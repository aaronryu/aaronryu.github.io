---
title: "6. 싱글턴 패턴, 그리고 Race Condition"
category: ["Design Pattern", "Creational"]
created: 2019-03-02 21:15:18
deck: 코드를 작성하다보면 변수나 메서드를 하나만 정의/생성하여 모든곳에서 공유하고 싶을때가 있다. 이에 두가지 솔루션이 있다. 첫번째는 정적 변수/메서드이고, 두번째는 이번에 배울 싱글턴 '객체'이다.
abstract: 먼저 JVM 내 Heap 영역과 Static 영역의 차이를 통해 정적 변수/메소드를 배우고, 싱글턴 '객체'는 앞선 정적 변수/메소드와 어떤점에서 다른지를 비교해보며 배울것이다. 그 다음 단일 객체에 너무 많은 요청이 한번에 몰리면 발생하는 Race Condition 과 그에 대한 솔루션도 함께 알아보도록 한다.
image: { url: ./singleton-comic-1-en-2x.png, alt: "Singleton Comic" }
keywords: 싱글턴 패턴, Singleton, Race Condition, JVM 메모리, 가시성 문제, DCL, Volatile, Lazy Holder
description: JVM의 메모리 구조를 통해 정적 변수와 싱글턴의 차이를 이해하고, 멀티스레드 환경에서 발생하는 Race Condition 해결을 위한 DCL 및 Lazy Holder 기법을 상세히 다룹니다.
---

코드를 작성하다보면 **변수**나 **메서드**를 **단 하나만 생성하여 모든 곳에서 공유**하여 사용할 때가 있다. 클래스 내 정적 변수/메서드를 정의하여 사용하는 방법과 싱글턴 객체를 단 하나만 생성하는 방법이 있다.
