---
title: "Wrapper Class Caching: The `==` Operator Issue with Integer Objects"
category: ["Troubleshooting", "Java 8+"]
created: 2021-03-14T14:06:37.000Z
updated: 2021-03-15T18:15:05.305Z
deck: "When comparing `Integer` objects in Java using the `==` operator, why do some values return 'true' while others return 'false'? Behind this seemingly simple mistake lies JVM's 'Wrapper Class Caching' mechanism, designed to maximize memory efficiency. This article delves into Java's memory management strategy through an intermittent bug encountered in a real-world project."
abstract: "This article analyzes why comparing `Integer` objects works correctly up to 127 but yields different results from 128 onwards. We'll explore the differences between Primitive and Reference types, the principles of Auto-boxing, and how the caching specification introduced in Java 5 affects memory address comparisons. Through this, we reconfirm the crucial importance of always using `equals()` for value comparisons and the necessity of boundary value testing."
keywords: "Java, Wrapper Class, Integer Caching, Auto-boxing, Memory Address Comparison, equals"
description: "Explains the `==` operator issue when comparing Java `Integer` objects and its underlying cause, the Wrapper Class Caching mechanism, while sharing correct object comparison methods and precautions."
---

Recently, I noticed intermittent error logs on our server due to code using the `==` (equality operator) with `Integer` objects. What was peculiar was that this API is used very frequently, yet the errors occurred sporadically. Simply put, it was a validation logic checking if the number of items in a list to be updated matched the number of items in the list before the update. The error logs showed 'the pre-update list count and post-update list count are different: 324 != 324'. Although I simply shared with my team that object comparison using `==` compares reference memory addresses, so `equals()` should naturally be used, a persistent developer, intrigued by the strange logic, incremented values one by one and assigned them, revealing the following fact:

> When comparing `Integer` objects using `==`, it returns 'true' (equal) up to 127,
> but returns 'false' (different) from 128 onwards.

This article briefly explains why this phenomenon occurs.

---

When you first learn a language like Java or JavaScript, you'll encounter the concept of Classes, Primitive Types, and Reference Types. While computer science/engineering departments might be teaching Python these days, if you were to learn C, you'd learn how values are stored in memory when assigned to variables. Broadly, they are categorized as follows:

# Primitive Types

-   When a value is assigned to a variable, that value is stored directly in memory.
-   **Types where the value is used as itself.**
    -   **Integer types**: byte, short, int, long
    -   **Floating-point types**: float, double
    -   **Character type**: char
    -   **Boolean type**: boolean

# Reference Types

-   Variables store the memory address of an object that holds the value, and the value itself is stored in the object space pointed to by that address.
-   **Types that encapsulate values (fields) and useful functions (methods) into a single object.**
    -   Wrapper Classes: Among reference types, these encapsulate primitive type values and useful functions into a single object.
        -   **Integer types**: Byte, Short, Integer, Long
        -   **Floating-point types**: Float, Double
        -   **Character type**: Character
        -   **Boolean type**: Boolean
    -   **Others**: Array, Class, etc.

In this article, we will focus exclusively on **Primitive Types** and **Wrapper Classes** that encapsulate their values.

---

# Boxing & Unboxing

Since these two types can be mixed in Java, it's impractical to manually convert values between Primitive Types and Wrapper Classes every time an operator or function requires a specific type. To avoid increasing unnecessary code, the Java Compiler performs automatic conversions during bytecode generation. These conversions are categorized as boxing or unboxing, depending on the direction: intuitively, taking a value out of a Class is unboxing, and putting a value into a Class is boxing.

## Boxing

Boxing involves wrapping (boxing) a Primitive Type value inside a Wrapper Class object and returning the Wrapper Class's address. When you declare `Integer a = 10;` for instance, the left side is an **Integer (Wrapper Class)** and the right side is **10 (Primitive Type)**. The value 10 on the right is automatically wrapped into an object in the form of `new Integer(10)` and returned. This process is called **Auto-boxing**. Thanks to this, even if a function parameter is defined as `private void pleaseGiveMeReference(Integer a)`, you can call it with `pleaseGiveMeReference(10)`.

## Unboxing

Unboxing involves extracting (unboxing) a primitive type value from a Wrapper Class object. If you have an `Integer b = new Integer(10)` and assign it to an `int a`, as in `int a = b;`, the result will be `int a = 10;`. This is called **Auto-unboxing**. As seen with **Boxing** above, this allows you to call a function with a `private void pleaseGiveMePrimitive(int a)` parameter using an `Integer wrapped = 10` object, like `pleaseGiveMePrimitive(wrapped)`.

---

The `==` operator, which was the source of the problem at the beginning of this article, performs a direct value comparison and thus only works as intuitively expected when comparing Primitive Types. If you compare Wrapper Classes, it only compares the **memory addresses of the objects** stored in variables like `Integer a`. Therefore, even if two objects hold the same value, the result will be 'false' (unequal). It's crucial to remember that the `==` operator **“never” supports Auto-boxing or Auto-unboxing**, even for types like `Integer` that otherwise support these features.

So why does `Integer == Integer` work correctly up to 127 on the server, but not as we expect from 128 onwards? We just established that the `==` operator doesn't perform Auto-unboxing. Could it possibly work differently under certain conditions?

**No, it doesn't.**

---

# Wrapper Class Caching (Java 5+)

Java 5 introduced Wrapper Class Caching for memory efficiency. For "some" Wrapper Classes (Byte, Short, Integer, Long, Character), small values are cached in memory. When an object for such a small value is created, the JVM returns a pre-cached Wrapper Class object instead of creating a new one. For example, values like 1, 2, or 10 for `Integer` are used very frequently. If a `Wrapper Class` object were created every time they are used—e.g., `Integer a = 10;`, `Integer b = 10;`, and so on, defining 100 such variables would require allocating memory for 100 distinct objects. To mitigate this, **frequently used objects are pre-created, and for a value like 10, only one pre-existing Wrapper Class object is used. Thus, `Integer a = 10;`, `Integer b = 10;`, etc., all refer to the same cached `new Integer(10)` object. This means `Integer a` and `Integer b` share the same object address, and memory is allocated for only a single object.**

Because a single object can be used by multiple variables, these are sometimes referred to as **Immutable Wrapper Objects**. The reason I emphasized that Wrapper Class Caching applies to "some" Wrapper Classes is that the caching specifications differ by type; for example, `Float` is not cached, and `Character` only caches values from 0 to 127 (excluding negative values). [Please refer to the official Java specification document for detailed specifications.](https://docs.oracle.com/javase/specs/#5.1.7) It seems reasonable that only a limited range of numbers is cached, focusing on frequently used smaller values. If the range exceeded 2^8 (256), the caching memory would increase with the number of bits, suggesting a compromise was made.

> Wrapper Class Caching for `Integer` objects caches values from -128 to 127.

# Conclusion

> To check the equality of Wrapper Class objects, use `equals()`.

Now the reason why `Integer == Integer` sometimes worked and sometimes didn't is clear. **For `Integer` values from -128 to 127, Java's Wrapper Class Caching ensures that objects are not created in memory every time they are defined; instead, pre-cached objects are reused.** Consequently, `Integer a = 10;` and `Integer b = 10;` both point to the same object address. Therefore, `a == b` returned 'true' (equal), not because the values `10 == 10` were equal, but because their memory addresses, e.g., `9ab2e1 == 9ab2e1`, were identical.

The low frequency of errors was likely because the logic, given its nature, rarely encountered values exceeding 127. The failure to detect this during testing was probably because test values were only within a 'sensible' range, overlooking test cases for `Integer`'s maximum and minimum boundary values. **This experience reaffirms the fundamental truth that value comparisons should always use `equals()`, and boundary value test cases are indispensable.**

---

Java remains, now as ever, quite a challenging language. Encounters like this make me want to go back to Kotlin, which I briefly experienced for a year (...). Nevertheless, noting and understanding these small details will surely be a great help to my knowledge in the future. Both the JVM and Java Compiler offer several features to enhance developer convenience. Beyond this caching issue, there's also a point in Java Generics where, for memory efficiency, all interface implementations developed by the programmer are automatically converted to the interface type during compilation, leading to errors that weren't caught at compile time manifesting as runtime errors. I will explain this in a future post.

---

- [Immutable Objects / Wrapper Class Caching](https://wiki.owasp.org/index.php/Java_gotchas#Immutable_Objects_.2F_Wrapper_Class_Caching)

---