---
title: "분장으로 알아보는 데코레이터와 변장으로 알아보는 어댑터"
category: ["Workplace"]
created: 2019-02-26T17:59:41.000Z
updated: 2019-02-27T16:35:26.892Z
deck: 디자인 패턴 중 구조 패턴에 해당하는 데코레이터, 어댑터, 퍼사드 패턴은 모두 클래스 내부에 다른 객체를 두는 '구성' 방식을 취한다는 공통점이 있다. 하지만 그 목적이 기능을 추가하는 것인지, 인터페이스를 맞추는 것인지, 아니면 복잡한 구조를 단순하게 묶는 것인지에 따라 명확히 구분된다.
abstract: 클래스의 본질은 유지한 채 기능을 덧붙이는 '분장(데코레이터)'과, 클라이언트의 요구에 맞게 인터페이스를 완전히 바꾸는 '변장(어댑터)', 그리고 여러 클래스를 하나의 인터페이스로 편리하게 묶어주는 '퍼사드' 패턴의 동작 원리와 구현 차이를 비교하여 학습한다.
keywords: 데코레이터 패턴, 어댑터 패턴, 퍼사드 패턴
description: 객체의 본질을 유지하며 기능을 확장하는 데코레이터, 서로 다른 인터페이스를 연결하는 어댑터, 복잡한 서브시스템을 단순화하는 퍼사드 패턴의 차이점을 '분장'과 '변장'의 비유로 설명합니다.
---

디자인 패턴을 배우기에 앞서 무조건 아래 두 글을 선행해야합니다. 본 블로그에 게시해놓았으니 짧고 읽기 쉬우니 간단히라도 읽고 오시면 이해가 쉽습니다.

1. 디자인 패턴에 앞서
2. 디자인 패턴의 제 1, 2 원칙

설명에 사용할 코드는 Java-like Pseudo Code 입니다.

# 분장술

아기돼지 삼형제를 보면 양가죽을 쓰고 하얀색 분으로 손을 칠해 양으로 변장한 늑대가 나옵니다. 물론 너무 어설픈 나머지 막내돼지한테 비웃음을 당하지만 돼지들의 집을 들어가기 위해서는 ‘변장’이 필요했던 것이죠. 이번에 얘기할 내용은 분장과 변장에 대한 이야기입니다. 여기서 잠깐 그 차이를 알아볼까요.

## 분장

분장은 현재 나의 모습에서 조금 더 **과장한 나의 모습**으로 꾸민것입니다.
나 자신은 그대로, 어렵게 말하면 본질은 해치지 않는 선에서 그 위에 **무엇인가를 추가로 꾸민것**이죠.

## 변장

변장은 현재 나의 모습에서 **완전 다른것의 모습**으로 꾸민것입니다.
나 자신이 아닌 **완전 다른 어떤것으로 꾸민것**이죠.

이번 챕터에서 배울것은 분장에 해당하는 데코레이터 패턴과 변장에 해당하는 어댑터 패턴입니다. 마지막으론 앞서 두 패턴처럼 한 클래스를 다른 클래스로 바꾸는것이 아닌 다수의 클래스를 하나의 클래스로 단순히 묶어주는 퍼사드 패턴을 다루고 마칠 예정입니다.

# 어댑터 패턴 = 변장

앞서 늑대가 돼지삼형제 집으로 들어가기 위해 순한 양으로 변장했습니다. 무시무시한 발톱을 하얀 분칠을 통해 예뻐보이는 손으로 바꾸었고, 그르렁거리는 목소리를 순한 양처럼 메에 흉내내기도 해봅니다. 이를 클래스로 표현하면 이해가 매우 Sheep습니다.

- **늑대**

```java
class Wolf {
    public String Claw() {
        return "Sharp Claw";
    }
    public String Growl() {
        return "Grrrrrrr";
    }
}
```

- **늑대가 돼지삼형제 집에 들어가기 위해 양으로 ‘변장’했군요.**

```java
class WolfWantsToBeSheep implements Sheep {
    public Wolf wolf;
    public String Hand() {
        wolf.Claw().replace("Sharp Claw", "White Hand");
    }
    public String Sound() {
        wolf.Growl().replace("Grrrrrrr", "Baaaaaaa");
    }
}
```

이제 늑대는 양이 들어갈 수 있는곳이면 어디든 갈 수 있습니다. 양만 들어갈 수 있는 돼지삼형제 집에 한번 들어가보겠습니다.

- 돼지삼형제 집에 양만 들어올 수 있어요

```java
public void WelcomeToPigHouse(Sheep sheep);
```

- 실제 양은 돼지삼형제 집에 잘 들어가는걸 볼 수 있습니다

```java
WelcomeToPigHouse(new Sheep());
```

- 이런, 양으로 변한 늑대도 돼지삼형제 집에 잘 들어가게되었네요

```java
WelcomeToPigHouse(new WolfWantsToBeSheep(new Wolf()));
```

어떤 클래스나 함수를 **클라이언트**로 본다면 **클라이언트들은 특정 타켓 인터페이스에만 맞게 구현**되어있습니다. 이런 제약때문에 다른 클래스를 해당 클라이언트에서 사용하고 싶을지라도, **해당 클래스가 타겟 인터페이스의 구현체가 아니라면 사용할 수 없습니다.** 위의 예처럼 태어났을때부터 늑대였지만 돼지삼형제 집에 가기위해서는 순한 양이 되어야하는 상황말이죠. 일반 비지니스에서도 이와 같이 어떤 클래스를 클라이언트 목적에 맞는 클래스로 사용해야하는 갑작스런 요구사항이 발생하곤 합니다.

## 객체 어댑터

위 늑대와 양의 예시처럼 어댑터 패턴은 **어댑터**라는 **타겟 인터페이스에 대한 새 구현 클래스**를 생성하고 그 안에 **타켓 인터페이스로 변장하고자 하는 외부 클래스**를 객체로 내부에 지니게됩니다. **이렇게 기존의 객체를 한번 다른 인터페이스로 감싼 구현체를 어댑티라고 명명**하는데요. 어댑티의 원래 함수와 프로퍼티들을 활용하여 타겟 인터페이스의 각 함수들을 구현하면 됩니다.

이걸 더 구체적으로는 <b>'객체 어댑터'</b>로 부르는 이유는 **어댑티를 어댑터가 객체로 갖고 있기 때문**입니다. 이를 우리는 ‘구성’이라고 배웠었지요. 아래의 코드를 보면 Adapter 가 Adaptee 를 객체로 가지고 있습니다. 클래스 다이어그램이 이해를 조금 더 도와줄겁니다.

```java
public void Client(TargetInterface interface);

class Adapter implements TargetInterface {
    private Adaptee adaptee;
    // ... adaptee 함수를 활용해 TargetInterface 의 함수를 구현합니다.
}
```

```java
this.Client(new Adapter(new Adaptee()));
```

어답티는 어답터의 도움으로 TargetInterface 만을 사용하는 클라이언트에 주입가능해졌습니다.

![Class Diagram for understanding Adaptor Pattern](./adapter-depicked.svg)

그럼 <b>'클래스 어댑터'</b>은 무엇일까요? Adapter 가 Adaptee 를 객체의 형태로 ‘구성’하지 않고 클래스의 형태로 ‘상속’하면 됩니다.

## 클래스 어댑터

클래스 어댑터는 되려 단순합니다. 아래 코드와 클래스 다이어그램을 보시면 객체 어댑터와 두 가지 차이점이 있습니다.

- Adapter 가 Adaptee 를 구성(has)하지 않고 상속(extends)하고 있습니다.
- Target 이 Interface 가 아니라 Class 로 존재하며, 그에 따라 구현(implements)이 아닌 상속(extends)을 하고 있습니다.

객체 어댑터와 클래스 어댑터의 차이를 Pseudo 코드를 통해 간단히 이해해봅시다

- 객체 어댑터

```java
class Adapter implements TargetInterface {
    private Adaptee adaptee;
    // ... adaptee 함수를 활용해 TargetInterface 의 함수를 구현합니다.
}
```

![Class Diagram of Object Adaptor](./class-diagram-for-object-adapter.svg)

- 클래스 어댑터

```java
class Adapter extends Target, Adaptee {
    // ... adaptee 함수를 활용해 Target 의 함수를 확장합니다.
}
```

![Class Diagram of Class Adaptor](./class-diagram-for-class-adapter.svg)

위 코드를 보고 흠칫하신분도 있을텐데요. Java 에서는 클래스에 대해서는 다중 상속을 지원하지 않습니다. 클래스 어댑터 코드를 보면 2가지의 클래스를 하나의 어댑터 클래스로 확장하여 사용하는것을 볼 수 있는데, 하나는 확장하고자하는 타겟의 클래스이고, 하나는 확장하려는 대상 클래스인 어댑티 클래스이다. 물론 이런식으로 Java 는 클래스들의 다중 상속을 지원하지 않아 해당 로직은 자바에선 사용불가능하며, 이 구조 자체가 유연성을 해치는 구조이기때문에 사용을 권하는 방식이 아니기도 하다.

## 다중 어댑터

다중 어댑터는 기존에 하나의 타겟 인터페이스만 지원하는것이 아닌 다수의 타겟 인터페이스를 모두 지원하는걸 의미합니다. 하나의 어댑티 클래스를 여기 인터페이스뿐만 아니라 저 인터페이스에서도 사용하고 싶을때 TargetOneInterface, TargetTwoInterface 를 하나의 어댑터 클래스로 연결하고 두 인터페이스의 모든 것을 구현하면 됩니다. 객체 어댑터가 아니라 클래스 어댑터라면 두 개의 클래스 TargetOne, TargetTwo 를 상속(extends) 하면 됩니다.

Java 에서는 클래스에 대해서는 다중 상속을 지원하지 않지만 인터페이스에 대해서는 다중 상속을 지원하기때문에 extends A, B 와 같은 문법은 충분히 사용할 수 있게된다.

- **다중 (객체) 어댑터**

```java
public void ClientOne(TargetOneInterface interface1);
public void ClientAnother(TargetTwoInterface interface2);

class Adapter implements TargetOneInterface, TargetTwoInterface {
    private Adaptee adaptee;
    // ... adaptee 함수를 활용해 TargetOne/TwoInterface 의 함수들을 모두 구현합니다.
}
```

# 데코레이터 패턴 - 분장

데코레이터 패턴은 클래스에 추가적인 기능을 무수히 많이 추가하더라도 그 클래스는 본래 클래스의 기능을 유지하는 ‘분장’에 해당합니다. 데코레이터 패턴을 어댑터 패턴 다음에 같이 다루는 이유는 사실 원리는 어댑터-어댑티 개념과 같기 때문입니다. 어댑터가 **Adaptee** 를 **TargetInterface** 로 <b>'변장'</b>시켰다면, 데코레이터는 **Decoratee** 를 **Decoratee** 자기 자신으로 <b>'분장'</b>시키는 꼴이 됩니다.

- 어댑터 패턴 - **변장: Adaptee != TargetInterface**

```java
class Adapter implements TargetInterface {
    private Adaptee adaptee;
}
```

- 데코레이터 패턴 - **분장: Decoratee == Decoratee**

```java
class Decorator extends Decoratee {
    private Decoratee decoratee;
}
```

데코레이터 패턴은 한번만 분장하기 위해 사용되지 않습니다. 자기 자신을 재귀적으로 계속 분장할 수 있는데요. 아무리 다양한 DecoratorA, DecoratorB 를 만들어 꾸미더라도 결국에 Decoratee 클래스기 때문에 기존 클라이언트에서는 크게 신경쓰지 않고 쓰던 그대로 사용하면 됩니다.

> 데코레이터 패턴은 Decorater 클래스가 Decoratee 를 Decoratee 로 분장하는것입니다.
> Decorator 는 Decoratee 를 상속받기 때문에 그 자신도 Decoratee 가 될 수 있습니다.
> 따라서 Decorator 는 재귀적으로 Decoratee 에 위치할 수 있어 무한정 분장될 수 있습니다.

- **데코레이티**: 꾸미고 싶은 객체

```java
class Decoratee {
    // ...
}
```

- **데코레이터**: 꾸며주는 객체

```java
class Decorator extends Decoratee {
    private Decoratee decoratee;
    // ... decoratee 함수를 활용해 더 개선된 decoratee 함수로 확장합니다.
}
```

단순한 코드는 위와 같지만 아마 책으로 접하신 데코레이터 패턴 코드는 아래와 같은 구조를 갖고 있었을것입니다.

- 추상 데코레이터: 꾸며주는 추상 객체

```java
abstract class Decorator extends Decoratee {
    protected Decoratee decoratee;
    Decorator(Decoratee decoratee) {
        this.decoratee = decoratee
    }
}
```

- 구현 데코레이터: 꾸며주는 구현 객체

```java
class DecoratorA extends Decorator {
    DecoratorA(Decoratee decoratee) {
        super(decoratee)
    }
    // ...
}
```

정말 단순한 데코레이팅만 원하신다면 처음에 설명해드린 형태로도 충분합니다. 그렇다 하더라도 위와 같이 <b>'추상 데코레이터'</b>와 <b>'구현 데코레이터'</b>를 나누는 걸 추천드리는 이유는 다음과 같은 이점을 갖기 때문입니다.

- 구현 데코레이터에서 공통으로 필요로하는 로직이나 프로퍼티(특히 데코레이티)를 두고 구현 시 활용 가능합니다.
- 수많은 구현 데코레이터들을 추상 데코레이터 하나로 관리할 수 있습니다.

**구현보다 인터페이스를 사용하라던 디자인 패턴 제 1원칙** 기억하시나요? 구현이 아닌 인터페이스(혹은 추상클래스)의 이점은 원하는 구현클래스를 붙였다 떼었다 할 수 있는 유용성과 재사용성이었습니다. 예를 들어 구현 데코레이터들을 하나의 리스트나 셋으로 담아 관리하고싶을때 추상 데코레이터 타입의 리스트, 셋을 생성하여 사용할 수 있겠죠.

# 퍼사드 패턴 - 묶음

마지막으로 배울 패턴은 퍼사드 패턴입니다. **어댑터와 데코레이터 패턴은 각 하나의 어댑티나 데코레이티를 갖는다는 공통점**이 있고, 차이점은 <b>어댑터는 다른 클래스로 ‘변장’</b>하고 <b>데코레이터는 같은 데코레이터(사실상 데코레이티)로 ‘분장’</b>한다는 것 이었습니다. 퍼사드 패턴을 이 챕터에서 다룬다는것은 이들과 공통점이 있다는 것일텐데요. 어떤것이 같을까요?

퍼사드 패턴은 어댑터, 데코레이터 패턴의 공통점을 그대로 갖습니다. 어댑티, 데코레이티와 같이 활용하기 위한 클래스를 내부에 갖고있습니다. 다만 어댑터, 데코레이터가 어댑티, 데코레이티를 하나씩만 가졌다면 **퍼사드는 엄청 많은 수의 클래스를 갖습니다.** 그리고 어댑터와 데코레이터의 차이점이 ‘변장’이나 ‘분장’이냐의 차이였다면 퍼사드는 그저 그 자체로 새로운 클래스가 됩니다.

어댑터와 데코레이터 패턴은 되고싶은 인터페이스나 클래스를 상속하여 되고자하는 모습이 있었지만, 파사드 패턴은 단지 그냥 필요한 객체들을 마구 집어넣어 이루고자하는 목적의 로직을 만들어내는것 그 뿐입니다. 어떻게보면 굳이 어탭터와 데코레이터를 설명하는데 파사드 패턴을 언급하는게 맞나 싶긴하지만 조금 더 이해가 쉽지 않을까하여 넣어봤습니다.

- (객체) 어댑터

```java
class Adapter implements TargetInterface {
    private Adaptee adaptee;
    // ... adaptee 함수를 활용해 TargetInterface 의 함수를 구현합니다.
}
```

- 퍼사드

```java
class Facade {
    private ClassA classA;
    private ClassB classB;
    private ClassC classC;
    // ... ClassA, B, C 를 활용한 새 함수들을 만듭니다.
}
```

퍼사드는 뒤에 어떠한 extends, implements 도 존재하지 않습니다. 단순히 여러 클래스를 묶어주는 하나의 클래스인 셈입니다.

항상 긴 글을 읽다보면 마지막쯤에 도달해갈때쯤 집중력이 흐트러지곤 합니다. 아래 세 줄 요약을 해드리자면

---

**어댑터 패턴**

> 하나의 클래스(어댑티)를 다른 하나의 클래스(타겟 인터페이스)로 <b>’변장’</b>합니다.

```java
class Adapter implements TargetInterface {
    private Adaptee adaptee;
    // ... adaptee 함수를 활용해 TargetInterface 의 함수를 구현합니다.
}
```

**데코레이터 패턴**

> 하나의 클래스(데코레이티)를 그 하나의 클래스(데코레이티)로 <b>’분장’</b>합니다.

```java
class Decorator extends Decoratee {
    private Decoratee decoratee;
    // ... decoratee 함수를 활용해 더 개선된 decoratee 함수로 확장합니다.
}
```

위 예제 코드는 이해를 위해 간단한 데코레이터 클래스를 작성했습니다. 본문에서 설명드린바와 같이 추상/구현 데코레이터로 사용하는걸 추천드립니다.

**퍼사드 패턴**

> **다수의 클래스**를 **다른 하나의 클래스**로 **묶습니다.**

```java
class Facade {
    private ClassA classA;
    private ClassB classB;
    private ClassC classC;
    // ... ClassA, B, C 를 활용한 새 함수들을 만듭니다.
}
```

---
