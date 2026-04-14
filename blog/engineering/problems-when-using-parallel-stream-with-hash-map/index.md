---
title: "ParallelStream 과 HashMap 의 Rehashing 이슈"
category: ["Troubleshooting", "Java 8+"]
created: 2021-01-30T16:15:46.000Z
updated: 2021-03-15T18:13:31.498Z
deck: 성능 개선을 위해 도입한 Java의 ParallelStream이 때로는 시스템을 멈추게 하는 치명적인 독이 될 수 있다. MSA 전환 과정에서 마주한 성능 저하 문제를 해결하려다 발생한 HashMap의 Race Condition과 무한 루프 장애 사례를 통해 멀티스레드 환경의 위험성을 파헤쳐 본다.
abstract: 단일 쿼리 중심의 레거시 시스템을 MSA로 전환하며 발생한 성능 문제를 해결하기 위해 ParallelStream을 도입했던 실무 경험을 공유한다. 특히 Thread-Safe하지 않은 HashMap을 병렬 스트림 내에서 사용할 때 발생하는 Rehashing 과정의 포인터 사이클 문제와 데이터 유실 메커니즘을 분석하고, 이에 대한 근본적인 해결책을 제시한다.
keywords: ParallelStream, HashMap, Race Condition, 무한 루프, Rehashing, MSA 성능 개선
description: Java 8+의 ParallelStream 사용 시 Thread-Safe하지 않은 HashMap의 put 작업이 유발하는 Race Condition 장애 사례와 원인을 상세히 설명합니다.
---

# Single SQL Query -> MSA APIs 전환 시 성능 저하

최근 Monolithic Architecture 구조의 레가시 시스템을 MSA 구조로 바꾸는 리플랫폼을 진행하였었습니다. 기존 레가시 시스템은 여러 서브도메인에 해당하는 테이블들이 단일 쿼리에 수많은 Join 으로 연결되어있어서 “단 하나의 쿼리”를 통해 결과를 얻을 수 있어 성능은 매우 좋았지만, 재사용성 및 유지보수성에 있어서는 최악의 구조를 갖고있었습니다. 예약, 결제, 정산, 상품 등 각 서브도메인들을 서비스들로 나누어서 “다수의 API 호출”들로 요청을 처리하도록 변환하니 재사용성 및 유지보수성은 올라갔지만 **SQL Join 을 사용하던 것을 다수의 API 로 바꾸다보니 수행의 파편화 및 네트워크 시간에 의해 성능이 저하되어 이 해결이 또 다른 리플랫폼의 챌린지 포인트**였습니다.

# Java Stream -> ParallelStream 을 통한 성능 개선

단일 쿼리에서는 Join 하나만으로 여러 테이블에 분산된 정보를 하나의 Dto 로 모아서 반환할 수 있습니다. 하지만 각 테이블들을 도메인 기반으로 예약 서비스, 계정 서비스 등으로 나눈다면 간단했던 Join 문은 각각 테이블에 해당하는 다수의 API들을 호출한 뒤, 하나의 Dto 로 Id 기반으로 합치는 작업을 필요로 하게됩니다. 이런 작업에서 Id 기반의 Join 을 프로그램으로 구현할때 저는 개인적으로 성능을 위해 Hash Join 전략과 유사하게 작성하게 되는데 이는 각 API 결과의 HashMap 을 필요로 함을 뜻합니다.

List -> HashMap 변환은 간단하지만, List 결과값이 매우 비대한 경우 각 도메인에 해당하는 테이블별로 HashMap 변환만 하더라도 몇초의 시간을 소비하기 때문에 이 시간을 줄이고자 `Stream` 에서 `ParallelStream` 로 변환하는 작업을 거쳤습니다. 이실직고하자면 빠르다는 사실 하나만으로 주니어였던 제겐 왜 안써? 싶은 존재였습니다. 성능은 굉장히 빨라졌고, 긴 시간동안 잘 동작하는 듯 했지만 예상치 못했던 몇 이슈로 다가오게 됩니다.

# ParallelStream

**ParallelStream 는 Java 8 에서 도입된 멀티스레드 프로그래밍을 매우 쉽게 활용할 수 있게 해주는 도구**입니다. 학부때도 멀티스레드가 제일 복잡하고 힘들었었는데, 이걸 단 하나의 코드로 쉽게 사용하게 해준다니 스레드 관리가 불편했던 저에겐 굉장히 매력적으로 다가왔습니다. 또한 타 웹페이지에서 고전적 for-each, stream, parallelStream 성능 비교를 보면 당연하겠지만 말도 안되게 빠른 성능을 제공해주는걸 알 수 있습니다.

# ForkJoinPool: ParallelStream 의 Thread 관리

스레드 관리가 쉬워진 이유는 기존에 Java 에서 사용하던 스레드 관리 방식을 확장한 ForkJoinPool 이라는 관리 방식을 사용하기 때문입니다. 이름과 같이 Fork + Join 을 통해 어떤 복잡한 작업도 작은 단위로 세분화하여 여러 스레드들이 나누어 작업한 뒤 완료된 결과를 하나의 결과로 합치게 되는데, 그것이 ParallelStream 의 방식이기도 합니다.

### ExecutorService (기존)

- **1개의 Queue** (1: Main Queue)
- **Thread Pool 에서 쉬고있는 Thread 에게 Main Queue 의 작업(Job)을 할당**

### ForkJoinPool (신규, Fork + Join)

- **2개의 Queue** (1: Main Queue, 2: ExecutorService Queue)
  - ForkJoinPool = Queue 가 추가된 ExecutorService 구현체
- **Thread Pool 에서 쉬고있는 Thread 에게 Main Queue 의 작업(Job)을 할당 후 추가 프로세스가 존재**
  - Fork: 해당 Thread 는 할당받은 작업(Job)을 수행가능한 작은 단위의 작업들로 분할
  - Steal: 한 Thread 가 다수의 작업(Job) 부담을 갖게되므로 타 Thread 들이 작업을 나눠서 수행
  - Join: 세분화되어 여러 Thread 에서 수행완료된 작업 결과는 쪼개어졌던 Thread 에서 다시 합쳐 반환

[ParallelStream 는 <b>Spliterator</b> 와 <b>ForkJoinPool</b> 기반](https://java-8-tips.readthedocs.io/en/stable/parallelization.html)으로 Fork + Join 을 통해 작업을 작은 단위로 분할한 뒤 실시간으로 어느 하나의 스레드에 작업 부담(Workload)가 몰리지 않도록 여러 Thread 들이 작은 단위의 작업들을 서로 나누어서 효율적으로 자원을 사용하게됩니다. 결과적으로는 더 빠르게 결과를 반환하게되며, ParallelStream == 성능으로 인식되는 이유입니다.

# HashMap & ParallelStream 사용시 무한루프 이슈

## Rehashing

ParallelStream 을 통해 서비스 성능 개선을 이룬 뒤 많은 시간이 지나서 갑자기 해당 서버 인스턴스 CPU 가 75% 를 넘어서서 오랜시간동안 계속 내려오지 않는 온콜이 발생하였었습니다. 점유율이 오랜시간동안 75% 에서 내려오지 않자 **무한 루프에 진입한것으로 보여 쓰레드 덤프를 분석해보니 parallelStream 에서 할당된 스레드에서 block 인채 멈춰있는걸 발견하였습니다.**

문제의 로직은 ParallelStream 내부에서 HashMap 의 `put` 함수를 사용한 부분이었습니다.

```java
Map<Integer, Boolean> result = new HashMap<>();
sampleList.parallelStream().forEach(each ->
  result.put(each.getId(), isSample)
);
```

간단하게 생각하면 List 가 아닌 Map 이기때문에 주입되는 순서도 상관없고, 값이 잘 들어갈것처럼 보입니다. **하지만 HashMap 는 Rehashing 이 있다는 정말 기초적인것을 놓친 생각이었습니다.** HashMap 은 Key-Value Pair 를 주입(put)할 때 아래의 과정을 거쳐 이뤄집니다.

1. 새로 추가하는 Key 에 대한 Hash 를 생성하고
2. Hash 테이블 인덱스에 for-loop 를 통해 존재여부 판단 후
3. 해당 Hash Key 에 포인터를 통해 Value 을 적재하게 됩니다.
4. 특정 Hash Key 에 포인터로 연결된 Value 개수가 일정 수를 넘으면 Rehashing 을 수행해
   - Hash 인덱스를 나누어 Value 들을 재적재하게 됩니다.

## Rehashing: Race Condition

위 과정 중에 3. 새 Value 포인터로 연결과 4. Rehashing, 두 부분에서는 포인터를 변경하게 되는데 기본 HashMap 의 경우엔 이 포인터 변경 부분이 thread-safe 하지 않습니다. 따라서 다수의 스레드가 3번과 4번을 동시에 수행한다면 즉, 같은 Hash 인덱스의 포인터를 변경하려 하면 문제가 발생할 수 있습니다. 두 스레드가 같은 Hash Key 에 대한 포인터들을 재설정하는 과정에서 서로 꼬여 포인트간 사이클이 발생하게 됩니다. 3번, 4번 모두 `put` 실행시 수행되는 로직이고, 여기서 생긴 포인터 사이클에 Hash 테이블 인덱스에 대한 for-loop 존재여부 조회가 들어서면서 무한 루프에 빠진것입니다.

HashMap 과 ParallelStream 를 동시에 사용시 이러한 Race Condition 으로 인한 무한 루프 문제도 있지만, 실제로 정상 수행되더라도 HashMap 에는 몇개의 Key 가 유실되는 경우도 발생합니다. 이 또한 다수의 스레드가 Hash Key 에 포인터로 Value 를 동시에 주입하면서, 몇개만 포인터가 정상할당되고 나머지는 무시되는 문제에서 발생합니다. 이로 인해 새로운 Key 를 10000 개 `put` 으로 주입하였는데, 실제 HashMap 에 저장된 Key 는 10000 개보다 적은 황당한 경우도 발생합니다.

# Conclusion

Java 의 ParallelStream 내부에서 thread-safe 하지 못한 어떤 작업, 본 글에서는 HashMap 의 `put`, 을 수행하면 Race Condition 발생으로 인해 몇개의 thread 작업들이 타 thread 에 의해 무시되게 되어서 예상치 못한 결과를 얻게됩니다. HashMap 의 경우엔 아래의 이슈가 발생합니다.

- Hash Key 에 연결된 Value 간 포인터 사이클이 발생 후, for-loop 존재여부 조회 시 무한루프
- 10000 번 `put` 수행하더라도, 몇 Value 포인터 주입이 무시되어 결과 HashMap 사이즈가 10000 미만

당시까지 ParallelStream 로 말미암아 생긴 이슈들이 많았기에, 온콜 해결을 위해서 서비스 전체 로직에서 ParallelStream 이 사용되는 부분을 모두 걷어내었었습니다. 위 문제를 해결하기 위해서는 HashMap 을 ConcurrentHashMap 으로만 바꾸는것으로도 해결이 가능합니다. 물론 ParallelStream 동작 원리는 **Spliterator** 와 **ForkJoinPool** 기반이기 때문에 Divide-and-Conquer 라는 기본 원칙인 분할(split) 과 합치는(merge) 작업에 메모리, CPU 자원 소요 비중이 커질 수 있습니다. 따라서 루프 횟수가 몇 십만, 몇 백만건까지의 유즈케이스가 존재한다면 꼭 스트레스 테스트가 필요할것 입니다.

---

- https://hamait.tistory.com/612
- https://blog.naver.com/tmondev/220945933678
- http://www.h-online.com/developer/features/The-fork-join-framework-in-Java-7-1762357.html
- https://medium.com/@itugs/custom-forkjoinpool-in-java-8-parallel-stream-9090882472db
- https://java-8-tips.readthedocs.io/en/stable/parallelization.html#conclusion

---
