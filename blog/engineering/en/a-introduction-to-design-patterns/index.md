---
title: "1. What is a 'Design Pattern'?"
category: ["Design Pattern"]
created: 2019-02-21T03:17:48
deck: I remember learning about design patterns briefly in university. While they were always a topic for graduate school or job interviews, I had little practical experience, so I never truly felt their importance. Perhaps it's different in today's project-heavy, theory-light bootcamp era, but I only empirically understood *why* patterns are used after joining a company.
abstract: Before diving into various design patterns, let's explore why they are necessary and briefly learn about class diagrams, which will aid in understanding them.
image: { url: ../../ko/a-introduction-to-design-patterns/design-patterns.png, alt: "Overview of Design Patterns" }
---

# Design Patterns

In short, design patterns are the **'result of contemplating what constitutes better code within the object-oriented paradigm.'** This concept first emerged through the book [Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns) written by four programmers known as the Gang of Four. It encompasses development approaches that can be applied across various languages, not just object-oriented programming.

Before exploring various patterns, let's look at three fundamental principles that cut across all patterns and explain why they came into existence:

-   **Minimize Duplication**: A change in one place should not necessitate changes in other duplicated code.
-   **Ease of Code Change**: Code is never perfect, and requirements can always change.
-   **Reusability**: Well-organized code should be usable as-is for completely different or similar requirements.

## Three Categories of Design Patterns

-   **Creational Patterns**: Ways to create objects.
    -   Example: Singleton Pattern
-   **Structural Patterns**: Ways to relate and compose objects.
    -   Example: Facade Pattern
-   **Behavioral Patterns**: Ways objects communicate.
    -   Example: Observer Pattern

Design patterns are categorized into these three types, each containing a wide variety of specific patterns. I highly recommend referring to the [Refactoring Guru](https://refactoring.guru/design-patterns/catalog) page. There, you can see which patterns exist in each category, why they came about, and what concepts they embody, complete with example code, which will be a great help in your future learning.

## Design Patterns: Too Far for Juniors

It's understandable if you haven't grasped design patterns without having worked on large projects.

> I've never created a large project where a single line of code change would lead to dramatic changes elsewhere.

Even when I created an occupancy indicator for a university team project, which received AP information from users' phones and relayed their locations to a Raspberry Pi, there was no complexity across its two servers to warrant applying or even considering patterns. Students might relate: after 60% planning and construction, and 20% development, the remaining 20% is often dedicated to less academic pursuits.

> Moreover, team project code is rarely revisited. No professor asks for requirement changes, nor is there a need to reuse it for other projects.

'Design patterns' are a recurring topic when preparing for interviews, but **ultimately, you must experience them directly by developing projects with code.** The design pattern articles I'll be compiling on this blog will focus on understanding, aiming to be concise for easy review. While I'll strive to explain each pattern clearly in text, an understanding of **class diagrams** is essential for a more implementation-oriented grasp.

# Class Diagrams - The Arrows

As the name implies, a class diagram is a **simplified representation of relationships between Classes.** It can be seen as a blueprint for project implementation in Object-Oriented Programming (OOP), where the concept of Class exists. To understand class diagrams, you only need to focus on three core arrows for explaining the relationships between Classes and Interfaces: **Implements, Extends, and Composition.** Code examples will be based on Java-like pseudo-code.

## Implements

![Implements](../../ko/a-introduction-to-design-patterns/implements.png)

If you've read the previous article on [Object-Oriented Programming](/pattern/two-principles-on-oop), you'll already know that OOP code is structured around Interfaces rather than Classes. While the Interface specifies **'what task to perform,'** the desired Concrete Class is injected appropriately to actually perform **'how to perform the task.'**

When first learning about Classes, you might define and use them like this:

```java
ConcreteClass clazz = new ConcreteClass();
```

Then, after learning about Interfaces and polymorphism, you can **assign a Concrete Class to an Interface**:

```java
Interface clazz = new ConcreteClass();
```

In practice, for flexibility, the specific concrete class is not immediately specified. Instead, the desired concrete class is dynamically injected into the Interface from an external source. Because a concrete class is injected to perform a task, this is called **Dependency Injection**, or sometimes **Inversion of Control** because the code itself doesn't hold the 'implementation decision-making power.' This will be covered in depth separately in a Spring article.

```java
private Interface clazz;
public void setClass(Interface clazz) {
    this.clazz = clazz;
}
setClass(new ConcreteClass();
```

## Extends

![Extends](../../ko/a-introduction-to-design-patterns/extends.png)

Inheritance is used to extend certain functions of a Class with additional features or to replace them with different logic. Back in my day, inheritance was taught as 'parent class' Animal with 'child classes' like Cat and Dog. However, this kind of **superior-subordinate concept is better suited for Implements,** and **inheritance should only be used for simple functional/definition extension.** In other words, we learned it wrong.

When defining a striped Cat as StripeCat, all functions and variables except for the stripe information are identical to Cat.

## Composite (Composition)

![Has-A](../../ko/a-introduction-to-design-patterns/has.png)

Inheritance is not the only way to extend Class functionality/definitions; composition is another.

-   **Inheritance**: **extends** the original Class -> defines a new Class.
-   **Composition**: **uses** the original Class as a variable -> defines a new Class.

Why does [Object-Oriented Programming](/pattern/two-principles-on-oop) advocate using **composition over inheritance**? To review once more:

-   **Inheritance has 'rigid extensibility,' but**
-   **the combination of 'interface implementation' and 'composition' offers 'open extensibility.'**

If we add an interface (implements) to the composition example above, it can express the **Cat species** much better:

![Has-A and Implements](../../ko/a-introduction-to-design-patterns/extends2.png)

It gains extensibility to handle 'striped species,' 'black species,' etc., under the higher concept of 'species.' Comparing this to the previous inheritance (extends) example, the `Sprite` information that was held by the child class `SpriteCatClass` has now moved outside the `Cat` class to `SpriteClass`. This is where you can understand why it's called **Inversion of Control.**

![Openness, when we use Has-A and Implements](../../ko/a-introduction-to-design-patterns/extends3.png)

Let's assume a Cat can have 'odd eyes' in addition to being a 'striped species.' This too can be handled by specifying `OddEyesClass` within `EyesClass` via interface (implements) and composition, giving Cat extensibility for both 'species' and 'eyes.'

This allowed us to reiterate the first principle of Object-Oriented Programming, **"Prefer 'interface-composition' over 'class-inheritance',"** and the second principle, **"Compose with 'interfaces' over 'concrete classes'."**

Now, let's explore design patterns using these two principles and three arrows (implementation, inheritance, composition).

---

1.  https://martinfowler.com/articles/injection.html
2.  http://www.nextree.co.kr/p11247/
3.  http://www.nextree.co.kr/p6753/