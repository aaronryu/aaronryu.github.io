---
title: "Understanding the `open` Keyword in Swift 4+ Syntax"
category: ["Language", "iOS, Swift"]
created: 2019-03-09T07:24:17.000Z
updated: 2019-06-29T05:22:17.368Z
deck: "Inheritance is a cornerstone of object-oriented programming, but its misuse can lead to the 'Fragile Base Class' problem, where changes in a base class break its subclasses. This article explores how modern languages like Swift grammatically enforce solutions to this issue."
abstract: "This article analyzes the access control mechanisms in Swift and Kotlin, which by default make all classes non-inheritable (final) to prevent undesirable side effects of inheritance. Specifically, it explains the usage of the `open` keyword, which allows fine-grained control over inheritance at both class and method levels, comparing it with Java's approach."
keywords: "Swift, open keyword, access modifier, non-inheritable, fragile base class"
description: "Understand the design philosophy of Swift and Kotlin, which unlike Java, restrict inheritance by default, and explore the role of the `open` keyword in preventing the fragile base class problem."
---

# Access Modifier

In programming languages, taking Java as an example, `public`, `private`, and `protected` are used to control the **access scope of fields, functions, and classes**. Inheritance-related keywords like `final`, `open`, `override`, and `abstract` are also included under the umbrella of 'access modifiers'. (Access modifiers are sometimes referred to as Visibility Modifiers.)

## Fragile Base Class

The [Fragile Base Class problem](https://www.hackingwithswift.com/example-code/language/what-does-the-open-keyword-do) is an issue arising from inheritance. It refers to a situation where **changes made to a base class cause its subclasses to break**, assuming there's a base class and subclasses inheriting from it. If **rules are not explicitly defined for which methods can be overridden and how** when a base class is inherited by subclasses, subclasses might override *any* method in an unintended manner. Furthermore, if the purpose of a base class method changes, the overridden methods in subclasses may become unexpectedly divergent from the original intent, meaning **changes to a base class impact all its inheriting subclasses**. This vulnerability is why it's called a **Fragile Base Class**.

Early object-oriented programming languages like Java, C#, and C++ made inheritance easy by default; if no access modifier is explicitly specified, **all base classes are inheritable**. However, to prevent the Fragile Base Class problem, software architecture and design patterns **recommend against inheriting all base classes**, as stated in 'Effective Java': "Design and document for inheritance, or forbid it."

Limitations and problems discovered while using early object-oriented programming are sometimes addressed through continuous language updates, but newer languages often adopt these good patterns as their core features. **Modern object-oriented programming languages like Kotlin and Swift** are among them. While jokingly referred to as 'hybrid' or 'mishmash' languages (Korean: 짬뽕, meaning 'mixed'), this effectively means they have the advantage of enforcing these patterns grammatically.

# Swift and Kotlin: Non-Inheritable by Default, Unlike Java

While Java, an early programming language prone to the Fragile Base Class problem, **makes all base classes inheritable by default**, Kotlin and Swift address this issue by making all base classes non-inheritable (`final`) by default. Consequently, both Swift's `class` and `struct` types are non-inheritable by default.

Additionally, in Java, variables, classes, and functions are `package-private` by default if no access modifier is specified. In contrast, in Kotlin and Swift, if no access modifier is specified, they are declared as `public`, making them usable from anywhere. However, `public` members are `final` by default, meaning they are non-inheritable.

- **public** = **Uninheritable** + Callable
- **open** = **Inheritable** + Callable

```swift
open class User {
    open func login() { }
    public func playGame() { }
    public init() { }
}
```

In both Kotlin and Swift, to enable inheritance, the `open` keyword must be added to the class, function, and even variables. The advantage of using `open` for functions and variables is that it allows easy management of what is 'inheritable' and 'non-inheritable' at a granular level, rather than just at the class level.

---

As observed, Java's approach to inheritance is completely opposite to that of Kotlin and Swift. **Java allows `public` classes and functions to be inheritable by default**, using `private` or `protected` access modifiers to restrict inheritance. In contrast, **Kotlin and Swift default to making everything non-inheritable for developers**, and then **explicitly require `open` to be specified for additional inheritance**, thereby preventing incorrect inheritance. This is why, when initially using `open` in Swift, it might feel similar to `abstract` in Java, as it dictates the inheritable status of functions and variables.

---