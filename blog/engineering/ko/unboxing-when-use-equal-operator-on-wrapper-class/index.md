---
title: "Wrapper Class Caching: Integer(Wrapper Class) == 사용시 이슈"
category: ["Troubleshooting", "Java 8+"]
created: 2021-03-14T14:06:37.000Z
updated: 2021-03-15T18:15:05.305Z
deck: Java에서 Integer 객체를 == 연산자로 비교할 때, 왜 어떤 값은 '참'이고 어떤 값은 '거짓'일까? 단순한 실수처럼 보이는 이 현상의 이면에는 메모리 효율을 극대화하기 위한 JVM의 'Wrapper Class Caching' 메커니즘이 숨어 있다. 실무에서 마주친 간헐적 버그 사례를 통해 자바의 메모리 관리 전략을 파헤쳐 본다.
abstract: Integer 객체 비교 시 127까지는 정상 동작하다가 128부터 결과가 달라지는 원인을 분석한다. 기본형(Primitive)과 참조형(Reference)의 차이, 오토박싱(Auto-boxing)의 원리를 살펴보고, Java 5부터 도입된 캐싱 스펙이 메모리 주소 비교에 어떤 영향을 미치는지 상세히 학습한다. 이를 통해 값 비교 시 반드시 equals()를 사용해야 하는 이유와 경계값 테스트의 중요성을 재확인한다.
keywords: 자바, Wrapper Class, Integer 캐싱, 오토박싱, 메모리 주소 비교, equals
description: Java의 Integer 객체 비교 시 발생하는 == 연산자 이슈와 그 원인인 Wrapper Class Caching 메커니즘을 설명하고, 올바른 객체 비교 방법과 주의사항을 공유합니다.
---

얼마전부터 서버에서 Integer 객체를 == (항등 연산자)를 사용한 코드때문에 간간히 에러 로그가 남는것을 확인했습니다. 신기한건 해당 API 가 매우 자주사용되는데, 간헐적으로 발생한다는 것이었습니다. 간단하게 설명하면 **업데이트하려는 리스트 개수와, 업데이트 이전 리스트 개수가 맞는지 검사하는 Validation 로직이었는데, 에러 로그를 확인해보면 업데이트 전 리스트 개수와 업데이트 후 리스트 개수가 324 != 324 로 다릅니다.라고 찍혀있는 것이었습니다.** 단순히 팀원들과 객체 비교는 == 를 사용하면 Reference 메모리 주소값을 비교하기 때문에 당연히 equals 를 사용해야합니다.라고 공유했지만, 실제로 해당 로직이 이상해서 값을 하나씩 1씩 증가시키며 대입해본 끈기있는 개발자분에 의해 다음과 같은 사실이 밝혀졌습니다.

> Integer 객체 비교는 == 를 사용했을때 127 까지는 ‘true(같음)’을 반환하는데,<br>
> 그 이상 128 부터는 ‘false(다름)’으로 반환합니다.

본 글은 왜 그런지에 대한 이유에 대한 짧은 글입니다.

---

Java 뿐만 아니라 Javascript 를 처음배운다면 Class 를 접하실테고, Primitive Type, Reference Type 을 배우실겁니다. 컴퓨터공학/과학과에서 요즘엔 Python 을 배우지않을까 싶은데 C 를 배우게 된다면 변수에 값을 저장하면 메모리에 어떻게 적재되는지 배우게 됩니다. 간단하게 아래와 같이 나뉩니다.

# Primitive Type

- 변수에 값을 할당하면 그 값 그대로 메모리에 저장
- **값이 그 값 자체로 사용가능한 타입**
  - **정수형**: byte, short, int, long
  - **실수형**: float, double
  - **문자형**: char
  - **논리형**: boolean

# Reference Type

- 변수에 값을 가진 객체의 주소를 저장하고, 그 값은 주소가 가리키는 객체 공간에 저장되어있습니다.
- **값(field)과 유용한 함수(method)들을 하나의 객체로 담은 타입**
  - Wrapper Class: 그 중 Primitive Type 값과 유용한 함수들을 하나의 객체로 담은 타입
    - **정수형**: Byte, Short, Int, Long
    - **실수형**: Float, Double
    - **문자형**: Character
    - **논리형**: Boolean
  - **그 외**: Array, Class 등

본 글에서는 **Primitive Type** 과 **그 값들을 감싼 Wrapper Class**, 이 둘만을 다룹니다.

---

# Boxing & Unboxing

이 두 타입이 Java 에서 혼용할 수 있기 때문에, Primitive Type 과 Wrapper Class 에 저장된 값을 사용하기 위해서 매번 연산자나 함수에서 사용하는 타입에 맞춰서 변환해줄 순 없습니다. 불필요한 코드의 양이 늘어나기에 이는 Java Compiler 가 바이트코드 생성 시 자동변환을 해주게 됩니다. 어떤 타입에서 어떤 타입으로 변환하는지에 따라 boxing, unboxing 으로 나뉘는데 Class 에서 값을 꺼낸다 = unboxing, Class 에 값을 담는다 = boxing 으로 직관적으로 이해 가능합니다.

## Boxing

Primitive Type 값을 Wrapper Class 객체 내부에 감싸(box) 저장하여 Wrapper Class 주소를 반환합니다. `Integer a = 10;` 이런식으로 선언하면 좌측은 **Integer(Wrapper Class)** 우측은 **10(Primitive Type)**이기에 우측의 10 값을 `new Integer(10)` 의 형태로 객체로 자동으로 감싸 반환하게 됩니다. 이를 **Auto-boxing** 이라고 부릅니다. 이 덕분에 함수 파라미터가 다음과 같더라도 `private void pleaseGiveMeReference(Integer a)` 함수 호출시에 `pleaseGiveMeReference(10)` 으로 호출 할 수 있는것입니다.

## Unboxing

Primitive Type 값을 가진 Wrapper Class 객체를 `int a`, `Integer b = new Integer(10)` 과 같은곳에 사용하려면 Primitive Type 으로 값을 꺼내어(unbox) `int a = b` 의 결과는 `int a = 10` 이 됩니다. 이를 **Auto-unboxing** 이라고 부릅니다. 이 또한 위에 **Boxing** 에서 살펴봤듯이, 이 덕분에 함수 파라미터가 다음과 같더라도 `private void pleaseGiveMePrimitive(int a)` 함수 호출시에 `Integer wrapped = 10` 객체를 다음 함수에 `pleaseGiveMePrimitive(wrapped)` 이렇게 호출 할 수 있는것입니다.

---

글의 맨 처음에 문제가 되었던 `==` 은 실제 값의 비교이기에 Primitive Type 비교할때만 우리의 직관대로 동작합니다 Wrapper Class 을 비교한다면 `Integer a` 변수에 저장된 **객체에 대한 메모리 주소만을 비교**하기에 아무리 같은 값을 갖고있는 두 객체를 비교하더라도 결과값은 ‘false(불일치)’일것입니다. 명심해야할 것은 `==` **연산자는 “절대로” Auto-boxing, Auto-unboxing 을 지원하지 않습니다.** 심지어 Integer 처럼 Auto-boxing, Auto-unboxing 를 지원하더라도 말입니다.

그렇다면 왜 서버에서 `Integer == Integer` 는 127 까지는 제대로 동작하고 128 부터는 우리가 생각하는대로 동작하지 않는것일까요? `==` 연산자는 Auto-unboxing 이 안된다면서요. 설마 조건에 따라 되는걸까요?

**아닙니다.**

---

# Wrapper Class Caching (Java 5+)

Java 5 에서는 메모리 효율을 위해 Wrapper Class Caching 을 도입했습니다. “일부” Wrapper Class(Byte, Short, Integer, Long, Character) 에 대해서 작은 값에 대해서 메모리에 캐싱하여, 작은 값에 대한 객체를 생성하면 캐싱해놓은 Wrapper Class 객체를 반환해주는 것입니다. Integer 의 예로 1, 2, 10 같은 값들은 사용 빈도수가 굉장히 크기때문에 일일히 이를 사용할때마다 Wrapper Class 객체를 생성해주면 메모리 입장에서 `Integer a = 10`, `Integer b = 10` … 100개를 정의한다면 100개에 대한 메모리를 다 할당해놓아야하는 문제가 발생합니다. 이에 따라 **빈도수가 큰 객체는 미리 만들어두고 10 값에 대한 Wrapper Class 객체는 미리 만들어놓은 단 하나의 객체만을 사용하도록 하는것입니다. `Integer a = 10`, `Integer b = 10` … 모두 캐싱된 `new Integer(10)` 객체를 사용하기때문에 `Integer a`, `Integer b` 모두 같은 객체 주소값을 가지며, 메모리는 단 1개에 대해서만 할당하면 됩니다.**

한 객체로 여러 변수들에 사용가능하도록 했기때문에 이를 **Immutable Wrapper Object** 라고도 부르는듯 합니다. Wrapper Class Caching 이란것이 “일부” Wrapper Class 에만 적용된다고 강조했던 이유는 Float 는 캐싱하지 않고, Character 는 음수값을 제외한 0 ~ 127 만 캐싱하는 등 타입별 지원되는 캐싱 스펙이 다르기 때문입니다. [상세한 스펙은 자바 공식 스펙 문서를 참조하시기 바랍니다.](https://docs.oracle.com/javase/specs/#5.1.7) 아무래도 적은 수에 대해서만 캐싱한것은 빈도수가 적은수에 대해서만 집중함일것이고, 2^8(256)을 넘는다면 bit 개수에 따라 캐싱 메모리도 늘어나므로 어느 정도 합의점을 본것으로 느껴집니다.

> Wrapper Class 중 빈도수가 높은 작은 값들에 대한 객체들을 미리 선언해놓고,<br>
> 코드상에서 해당 값으로 Wrapper Class 객체를 생성하려하면 이미 저장된 객체를 반환합니다.

<br>

> Integer 에 대한 Wrapper Class Caching 은 -128 ~ 127 값에 대한 객체를 캐싱해놓습니다.

# Conclusion

> Wrapper Class 의 동일 여부는 `equals()` 를 사용합시다.

그렇다면 이제 `Integer == Integer` 가 어떨때 동작하였고, 어떨때 동작하지 않는지 이유가 명확해졌습니다. **Integer 는 -128 ~ 127 까지의 값에 대한 객체는 Java 의 Wrapper Class Caching 에 의해 매번 정의할때마다 메모리에 생성하지 않고, 미리 캐싱되어있는 객체를 사용하게 됩니다.** 그리하여 `Integer a = 10`, `Integer b = 10` 모두 같은 객체 주소값을 가지기때문에 `a == b` 는 `10 == 10` 값이 같다는 이유가 아닌 `9ab2e1 == 9ab2e1` 주소가 같다는 이유로 ‘true(같음)’을 반환하는것이었습니다.

에러 발생 빈도수가 적었던것도 해당 로직 특성상 127 이상의 값이 나올일이 없었던것일테고, 테스트시 발견 못한것은 테스트 값을 상식적인 값 범주만 했을뿐 Integer 최대, 최소 경계값에 대한 테스트케이스는 놓쳤기 때문이라 생각합니다. **다시 한번 값 비교는 `equals()` 를 사용해야한다는 것과, 항상 경계값에 대한 테스트케이스는 필수다라는 당연한 사실을 다시 깨닫고 갑니다.**

---

Java 는 예나 지금이나 참 어려운 언어인것같습니다. 이런걸 접하다보면 예전에 1년간 맛보았던 Kotlin 으로 다시 돌아가고 싶은 마음이 듭니다(…). 그래도 이런 작은 부분들까지 메모해놓고 알아둔다면 앞으로의 지식에 큰 도움이 언젠간 되겠죠. JVM, Java Compiler 에서는 개발자 편의를 위해 지원해주는 기능이 몇가지가 있는데, 이번 캐싱 이슈뿐만 아니라 Java Generic 개념에서도 메모리 효율을 위해 컴파일 시 **개발자가 개발한 Interface 구현체를 모두 Interface 로 자동 변환하여, 컴파일 타임에서 걸러지지 못한 에러가 런타임에서 에러로 발생하는 이슈도 있습니다. 이는 추후 포스팅으로 설명하도록 하겠습니다.**

---

- [Immutable Objects / Wrapper Class Caching](https://wiki.owasp.org/index.php/Java_gotchas#Immutable_Objects_.2F_Wrapper_Class_Caching)

---
