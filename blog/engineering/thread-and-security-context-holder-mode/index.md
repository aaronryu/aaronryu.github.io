---
title: "Spring Security: SecurityContextHolder 의 Thread 공유 전략"
category: ["Troubleshooting", "Java 8+"]
created: 2021-03-14T14:35:26.000Z
updated: 2021-03-15T18:15:43.363Z
deck: 병렬 처리를 위해 도입한 parallelStream 내에서 Spring Security의 세션 정보가 간헐적으로 사라지는 기이한 버그를 마주했다. '슈뢰딩거의 고양이'처럼 새로고침할 때마다 결과가 달라지는 이 현상의 원인을 파헤치고, SecurityContextHolder가 멀티스레드 환경에서 세션 데이터를 공유하는 세 가지 전략을 살펴본다.
abstract: 리스트 필터링 로직에 parallelStream을 적용했을 때, 일부 스레드에서만 권한 확인이 실패하는 원인을 분석한다. SecurityContextHolder의 기본 전략인 MODE_THREADLOCAL이 하위 스레드와 컨텍스트를 공유하지 못해 발생하는 문제를 진단하고, 이를 해결하기 위한 MODE_INHERITABLETHREADLOCAL 등 공유 모드별 특징과 주의사항을 학습한다.
keywords: Spring Security, SecurityContextHolder, ThreadLocal, parallelStream, 멀티스레드, 세션 공유
description: Spring Security 환경에서 병렬 스트림 사용 시 세션 정보가 유실되는 현상을 통해, SecurityContextHolder의 스레드 공유 전략 3가지와 멀티스레드 환경에서의 세션 관리 주의사항을 설명합니다.
---

다수 정보를 리스트로 조회하는 페이지에서 현재 로그인한 유저가 가진 권한에 따라 일부 정보를 보여주지 않도록하는 처리가 필요했습니다. 그래서 먼저 리스트를 API 로부터 가져온 뒤, 현재 Spring Security 로그인 세션에 저장되어있는 권한을 통해 일부 정보를 필터링하여 최종적으로 조회 페이지에 렌더링하도록 작업하였었습니다.

하지만 이상하게 **리스트에 노출되는 Row 가 총 10개라면 2 ~ 3개 약 1/4 에 해당하는 Row 만 해당 ‘세션 권한 필터링’ 로직이 적용되었고 나머지 3/4 에 대해서는 적용되지 않는 버그를 발견하였습니다.** 심지어 1/4 에 해당하는 2 ~ 3개는 변칙적으로 계속 변경되는것이었습니다. 예를 들면 새로고침 한번에 2번째 3번째 Row 에만 ‘세션 권한 필터링’ 이 적용되었다가, 새로고침을 한번 더 하면 5번째 6번째 Row 에 ‘세션 권한 필터링’이 적용되는것입니다. 마치 슈뢰딩거의 고양이처럼요…

구현은 다음과 같았습니다.

```java
List<SomeInformation> list = someApi.retreive(condition);
list.parallelStream()
    .forEach(each -> {
        if (!SecurityHelper.hasRole("ROLE_CAN_SEE_SENSITIVE_NUMBERS")) {
            each.setSensitiveNumber1(null);
            each.setSensitiveNumber2(null);
        }
    })
```

```java
public class SecurityHelper {

    public static boolean hasRole(String role) {
        SecurityContext context = SecurityContextHolder.getContext();
        if (Objects.isNull(context))) {
            return false;
        }
        Authentication authentication = context.getAuthentication();
        if (Objects.isNull(auth))) {
            return false;
        }
        for (GrantAuthority eachAuthority : authentication.getAuthorities()) {
            if (role.equals(eachAuthority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}
```

실제로는 테스트했던 로그인 계정에 `ROLE_CAN_SEE_SENSITIVE_NUMBERS` 권한이 있었기 때문에, 리스트의 모든 Row 들에 sensitiveNumber1, 2 모두 정상 노출되는것이 맞습니다. **하지만 1/4 만 노출되는건 아무리 생각해도 이상하여 parallelStream.forEach 내부에 로그를 추가하였더니 아래와 같은 결과가 나왔습니다.**

```
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-3] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-2] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-7] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-1] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [http-nio-80-exec-3] [TEST] hasRole: true
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-4] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-5] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-6] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-2] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [http-nio-80-exec-3] [TEST] hasRole: true
```

보아하니 ForkJoinPool 즉, ParallelStream 실행을 위해 할당된 **하위 Thread**(`ForkJoinPool.commonPool-worker-1~7`) 에서는 hasRole이 비정상적으로 false 값을 반환하고, **메인 Thread**(`http-nio-80-exec-3`) 에서는 hasRole이 정상적으로 true 값을 반환하는걸 알 수 있습니다.

무언가 ParallelStream 과 SecurityContextHolder 혼용이 문제인것으로 보입니다.

# SecurityContextHolder 의 Thread 간 공유 모드

ParallelStream 의 Thread 에서 hasRole = false 가 반환됐던 1차 원인은 `SecurityContext context = SecurityContextHolder.getContext()` 호출시 null이 반환되고 있었습니다. 반면 메인 Thread 에서 `SecurityContextHolder.getContext()` 호출시에는 정상적으로 세션 데이터를 가져올 수 있었고, hasRole 에 알맞은 비교 로직까지 수행할 수 있었습니다. 알아보니 아래와 같은 사실을 발견했습니다.

> SecurityContextHolder는 SecurityContext 로그인 세션 정보를 어떤 레벨의 Thread 까지 공유할지<br>
> 모드를 지정하도록 되어있습니다. 기본값으로는 **MODE_THREADLOCAL** 로써<br>
> SecurityContext 정보는 <b>“메인 Thread”</b> 에서만 볼 수 있습니다.

총 공유 모드는 3가지로 나뉘어져있습니다.

- **MODE_THREADLOCAL**: (Default) Local Thread 에서만 공유 가능
- **MODE_INHERITABLETHREADLOCAL**: Local Thread 에서 생성한 하위 Thread 에까지 공유 가능
- **MODE_GLOCAL**: 모든 Thread, 어플리케이션 전체에서 공유 가능

기본 모드는 **MODE_THREADLOCAL** 였기에, 아무런 설정도 하지 않았던 서버에서는 **메인 Thread**(`http-nio-80-exec-3`)에서만 SecurityContext 가 반환되었던고, 나머지 **하위 Thread**(`ForkJoinPool.commonPool-worker-1~7`)에서는 `null` 이 반환되었던것입니다.

# Conclusion

SecurityContextHolder 의 기본 설정은 SecurityContext 정보를 Local Thread 만 공유하도록 되어있기 때문에 SecurityContextHolder 를 직접 하위 Thread 안에서 호출하여 사용하는것보다, 메인 Thread 에서 호출하여 해당 값을 하위 Thread 에서 참조하도록 하는것이, 성능적으로나 가시적으로도 더 깔끔한 코드가 될것입니다.

**ParallelStream 혹은 Async 관련된 기능을 사용 시 하위 Thread 에서 SecurityContextHolder 를 사용해야하는 경우가 있다면 SecurityContextHolder 의 공유 모드를 MODE_INHERITABLETHREADLOCAL 로 낮추는것을 고려해야합니다.**

---

- [Spring Security - SecurityContextHolder Strategy](http://ncucu.me/116)

---
