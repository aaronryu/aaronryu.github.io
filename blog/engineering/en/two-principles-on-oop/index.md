---
title: "0. The First and Second Principles of Object-Oriented Programming"
category: ["Design Pattern"]
created: 2018-12-30T00:13:33
deck: "During my university days, object-oriented programming felt limited to polymorphism and inheritance. Developing in the industry, I profoundly realized that OOP is not merely an academic concept but a practical discipline. One might wonder why the first and second principles of OOP are discussed before delving into design patterns. Design patterns are 'the culmination of deliberation on what constitutes better code within the object-oriented paradigm.' To truly grasp the significance of various design patterns, it is essential to first understand the fundamental principles of object-oriented programming."
abstract: "Inheritance, often the first concept encountered when learning OOP in school, is merely introduced early in the academic sequence. In actual industry practice, it is often an anti-pattern that should be avoided. This article will explain how and why to move away from inheritance through the lens of the first and second principles."
image: {
	url: ../../ko/two-principles-on-oop/composition-vs-inheritance.png,
	alt: "Composition vs Inheritance"
}
keywords: "Object-Oriented, OOP Principles, Composition over Inheritance, Interface, Polymorphism, Design Pattern"
description: "Introduces two core principles for designing flexible and extensible object-oriented code by leveraging interfaces and composition to overcome the limitations of inheritance."
---

# Is Inheritance Synonymous with Object-Oriented Programming?

Let's imagine a developer writing their first enterprise object-oriented program. Following what they learned in school, where **object-oriented programming is often equated with inheritance**, they might boldly create a parent class and then utilize child classes that inherit from it. The code would likely resemble the example from the Head-First book below.

## Inheritance as First Taught

- **Parent Class + Parent Functions**

```java
class Duck
	{ swim(), display(), fly(), quack() }
```

- **Parent Class + Parent Function Extension = Child Class**

```java
class RedHeadDuck extends Duck
	{ swim(), display(), fly(), quack() }

class RubberDuck extends Duck
	{ swim(), display(), fly(){ null }, quack() }
```

When using inheritance, all functions present in the parent `Duck` class are acquired by its child `Duck` classes. The problem is that much like inheriting both assets and debts, **a child `Duck` class is forced to extend with all parent functions, even those it doesn't want, regardless of its specific needs**. This introduces unnecessary constraints in development.

To resolve this, **one can define 'functions as the smallest separable units' as interfaces, and then select and extend only the interfaces containing the necessary functions for the class being developed.**

## Interfaces Instead of Inheritance

- **'Behavioral Unit' Interfaces**

```java
interface Flyable { fly() }
interface Quackable { quack() }
```

- **'Behavioral Unit' Interface Combination and Implementation**

```java
class RedHeadDuck implements Flyable, Quackable {
	fly() { ... }
	quack() { ... }
}

class RubberDuck implements Quackable {
	quack() { ... }
}
```

This way, **behaviors that once belonged to a parent class can be broken down into interfaces, allowing only the desired behaviors to be attached to an implementation class.** However, when selecting and extending 'behavioral unit' interfaces, there's the **problem of having to implement them every time**. Aren't developers a 'tribe of inconvenience'? Since implementing them every time is tedious, they reach a point where they **pre-implement all 'behavioral unit' interfaces as 'behavioral unit' classes, and then selectively use these 'behaviors' as needed**.

## Composition, Not Just Interface 'Implementation'

- **'Behavioral Unit' Interfaces**

```java
interface Flyable { fly() }
interface Quackable { quack() }
```

- **'Behavioral Unit' Classes (Interface Implementation)**

```java
class NotFlyable implements Flyable { fly() { ... } }
class SuperFlyable implements Flyable { fly() { ... } }
class ShoutQuackable implements Quackable { quack() { ... } }
class QuiteQuackable implements Quackable { quack() { ... } }
```

- **'Behavioral Unit' Class Composition**

```java
class RedHeadDuck {
	interface Flyable = new SuperFlyable();
	interface Quackable = new ShoutQuackable();
	doFly() { Flyable.fly() }
	doQuack(){ Quackable.quack() }
}

class RubberDuck {
	interface Flyable = new NotFlyable();
	interface Quackable = new QuiteQuackable();
	doFly(){ Flyable.fly() }
	doQuack(){ Quackable.quack() }
}
```

Instead of implementing interfaces every time, we selectively compose pre-implemented concrete classes of interfaces. This allows us to freely attach, detach, and swap desired behavioral interface implementations. Thus, interfaces evolve beyond the university-taught concept of merely being a class template. It's better to think of them as **a 'variable' capable of holding classes that implement specific behaviors or characteristics**. This, fundamentally, is why we learn about **polymorphism**.

# The First and Second Principles of Object-Oriented Programming

The concepts discussed above can ultimately be summarized into the following two principles.

## Prefer 'Interface - Composition' over 'Class - Inheritance'

> With 'inheritance', a class inherits everything its parent class possesses, regardless of need. Like LEGO blocks, 'composition', which allows selective inclusion of desired implementations, offers greater extensibility.

## Compose with 'Interfaces' rather than 'Concrete Classes'

> Implementations can change at any time. When structuring logic within a class, compose it flexibly through interfaces, not concrete classes.

- **X Avoid: Composing with 'Concrete Classes'**

```java
class RedHeadDuck {
	class SuperFlyable; // [!code highlight]
	class ShoutQuackable; // [!code highlight]
	doFly() { SuperFlyable.fly() }
	doQuack(){ ShoutQuackable.quack() }
}
```

- **O Prefer: Composing with 'Interfaces' - Concrete classes can be swapped out at any time**

```java
class RedHeadDuck {
	interface Flyable = new SuperFlyable(); // [!code highlight]
	interface Quackable = new ShoutQuackable(); // [!code highlight]
	doFly() { Flyable.fly() }
	doQuack(){ Quackable.quack() }
}
```