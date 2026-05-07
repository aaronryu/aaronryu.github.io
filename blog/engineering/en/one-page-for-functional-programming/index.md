---
title: "A One-Page Guide to Functional Programming - Closures, Currying, Functor, Monad"
category: ["Language", "Functional Programming"]
created: 2019-03-24T12:42:23.000Z
updated: 2019-12-08T15:05:55.564Z
deck: "Functional programming, a paradigm distinct from object-oriented programming, demands a shift in perspective towards data and functions rather than just a difference in syntax. This article explores why this philosophy—treating functions as variables and minimizing side effects—is regaining attention in modern development environments by examining its core concepts."
abstract: "This article clarifies the conditions for first-class functions, which form the basis of functional programming, and the concept of pure functions, which ensure referential transparency. Furthermore, it covers currying and closures utilizing higher-order functions, and the definitions of Functor and Monad for safely handling data structures, along with the principles of function composition."
keywords: "functional programming, first-class function, pure function, currying, monad"
description: "Starting with the characteristics of first-class functions and the definition of pure functions, this article summarizes and explains key functional programming concepts such as closures, currying, Functor, and Monad in a single concise overview."
---

# Functional Programming

Functional programming can be summarized in one sentence:

> Functions must be usable ① as variables, ② as parameters, ③ as return values, and ④ must possess the characteristics of pure functions.

*   A 'function' is a **first-class function**.
    *   ① A 'function' can be assigned to a **variable**.
    *   ② A 'function' can be passed as a **parameter**.
    *   ③ A 'function' can be **returned**.
    *   ④ A 'function' has **pure function** characteristics.
        *   **Referential Transparency** and **No Side-Effects**: It does not depend on external state, variables, or environment, and always returns the same result when called with the same parameters.

## Function Pointers

Since functions are references, not values, **using functions as first-class functions requires the use of function pointers.**

*   ① A function can be used as a **variable** via a function pointer.
*   ② If you want to pass a function as a **parameter**, you can do so by passing a function pointer.
*   ③ If you want to **return** a function, you can do so by returning a pointer to that function.

```cpp
void qsort (void* base, size_t n, size_t size,  int (*compare)(const void*,const void*));
```

The C language example above shows a `compare` function pointer being passed as the last parameter of the `qsort` algorithm. However, some argue that [functions in C are not first-class functions but rather second-class functions, because they are pre-compiled rather than defined at runtime](https://en.wikipedia.org/wiki/First-class_citizen#Functions).

# Lambda (Anonymous Function)

Lambda is a concept used in computer science and mathematical logic, representing the prototype of current programming functions.

> It is a **functional abstraction** that takes input values and returns a result by utilizing free variables defined outside the function.

The fact that it only defines a function without executing it is [identical to defining a function first in programming](https://ko.wikipedia.org/wiki/%EB%9E%8C%EB%8B%A4_%EB%8C%80%EC%88%98#%ED%95%B5%EC%8B%AC_%EA%B0%9C%EB%85%90). As a concept in mathematical logic and the prototype of functions, **lambdas have no function names.** For this reason, **lambdas are sometimes called anonymous functions in programming.** The concept is clear, but when and why are lambdas used?

In programming, there are two ways to use values:

*   To define a value for **reusability** and assign it to a variable, using it **Ⓐ as a variable**.

```ts
let defined: Int = 10;
print(defined);
```

*   To use a value **Ⓑ directly inline** for **one-time** use.

```ts
print(10);
```

There are also two ways to use functions, similar to values:

*   To define a function for **reusability** and use it **Ⓐ by reference**.

```ts
const defined = (param: Int) => { return param; };
print(defined(10));
```

*   To use a function **Ⓑ directly inline** for **one-time** use.

```ts
print(((param: Int) => { return param; })(10));
```

Lambdas pass function pointers as variables, parameters, and return values, similar to regular functions, but they differ in the timing of function definition, which offers advantages:

*   **No function name is needed**.
*   The **function's scope is ephemeral** for one-time use.
    *   Regular functions exist globally within their defined scope at definition time (in more technical terms, they are static implementations belonging to the global namespace).
    *   Lambdas exist ephemerally within their defining block at definition time.

Through lambdas, functions can be used as first-class functions by defining them inline without the need for prior definition.

## Function Objects

In object-oriented programming, a function cannot exist as a standalone entity; it must belong within a class. If you want to use a function **as a lambda, you must create a function object and use it at the object level.** In object-oriented programming, while lambdas may appear to exist as standalone functions, they are actually **syntactic sugar for function objects**, where an unnamed object wraps a single function.

# Closures

[**Lambdas** and **closures** may seem similar, but they are distinctly different concepts.](https://stackoverflow.com/questions/220658/what-is-the-difference-between-a-closure-and-a-lambda/220728#220728) Let's look at their definitions:

*   **Lambda**

> A lambda refers to an **anonymous function**.<br>
> It is used when you want to directly use a function as a variable, parameter, or return value for one-time purposes.

*   **Closure**

> [A closure refers to a **function that retains the environment (state) in which it was defined.**](https://en.wikipedia.org/wiki/Closure_(computer_programming)#cite_note-2)<br>
> Here, the environment means **the local variables within the scope where the closure is defined.**

Typically, closures are often used by defining a function (closure) C inside another function A. **If closure C is defined within function A, C can naturally reference and use A's variables even without them being explicitly passed as parameters.** This is the **environment (state)**.

*   You can think of the relationship between function A's variables and closure C as similar to the relationship between class A's fields and method C.

If we view **closures as a way to use functions like objects**, the reasons for using closures are similar to the reasons for using objects:

*   Since closure C retains the external variables it references as its state, it can continuously utilize that state even across repeated calls.
*   External variables are defined only within the scope of function A, making them inaccessible from outside.

```swift
func query(dbName: String) -> (String) -> (Person) {
  let instance: DBInstance = DBConfig.getInstance(dbName)
  // * Inside the closure { }, the 'instance' variable, which exists within the function where the closure is defined, is used.
  return { (tableName: String) -> (Person) in 
    return instance.getTable(tableName).getFirst()
  }
}
```

## Swift Closures

As seen above, while the definition of a closure is not an anonymous function, **in Swift, closures are used without a name, effectively functioning as anonymous functions.** Swift closures distinguish 'parameters' and 'return statements' with the `in` keyword.

![Closure Swift Example](../../ko/one-page-for-functional-programming/closure-swift-example.svg)

Swift closures can be abbreviated as much as desired:

*   **Basic form**: Explicitly define parameter types and return types, then write the function body after `in`.

```swift
{ (parameters) -> (return_type) in return /* statements using parameters */ }
```

*   **Abbreviated form**: Return type is implicitly inferred.

```swift
{ parameters in return /* statesments using parameters */ }
```

*   **For extreme conciseness**: Both return type and the `return` keyword are omitted.

```swift
{ parameters in /* statesments using parameters */ }
```

*   **Ultra-terse**: Parameter types are implicitly inferred. Parameters are referred to by their position as `$0`, `$1`, etc.

```swift
{ /* statesments using parameters with $0, $1 ... */ }
```

*   **Trailing Closure**: If a closure is the last parameter in a function call, it can be placed outside the parentheses, immediately after the function name, enclosed in `{}`.

```swift
var sorted = sort(names, { $0 < $1 })
var sorted = sort(names) { $0 < $1 }
```

# Higher-Order Functions

Higher-order functions utilize the second or third of the three first-class function conditions discussed earlier.

*   ② A 'function' can be passed as a **parameter**.
*   ③ A 'function' can be **returned**.

> A higher-order function **means a function that takes other functions as parameters or returns a function as its result.**<br>
> Because it's a function that operates on other functions, it's called a higher-order function, implying a **meta-function**.

# Currying

Currying utilizes the third of the three first-class function conditions.

*   ③ A 'function' can be **returned**.

> Currying refers to **a function returning another function.**
> In Swift, currying is commonly used in a way where a function returns a closure.

```swift
func curringExample: (a: Int, b: Int, c: Int) -> (Int, Int) -> (Bool) { ... }
```

The `curringExample` above shows a function that takes parameters a, b, and c and returns another function which takes two `Int` parameters `(Int, Int)` and returns a `Bool`.

Even the way 'an object of a class' calls 'a function of a class object' in Swift uses currying.

```swift
let someInstance = SomeClass()
someInstance.someFunction(params: /* parameters */) 
```

The class method above is actually performed by passing the object to the class function as follows:

```swift
SomeClass.someFunction(self: someInstance)(params: /* parameters */) 
```

As a side note, Kotlin's extension functions are also used in a similar manner, where the receiver object (class) is passed as a parameter to a function defined for that receiver type.

# Functor

A Functor is a **data structure**. Let's briefly look at functions before diving into the Functor concept.

## Function = Mapping

A function takes Input A and produces Output B as a result.
Alternatively, a function is a mapping between Input A and Output B.

## Data Structure Mapping

If you apply a mapping to an entire data structure, you must apply the mapping to each individual element within that data structure. For example, if the data structure is a list, it goes through the following procedure by iterating 0, 1...:

*   **Pull**: Retrieve each element.
*   **Mapping**: Apply the mapping.
*   **Push**: Insert the resulting element into the target data structure.

![Function Example](../../ko/one-page-for-functional-programming/functor-example-depicted.svg)

If we define the ability to apply a mapping function to each element as **Mappable**, then the list example can be defined as a **Mappable data structure**. The example in the figure above is a Functor example where each element is stringified from an Int data structure to a String data structure.

*   Functor Definition

> [A Functor is a **Mappable (possessing a mapping function) data structure.**](https://medium.com/@sjsyrek/five-minutes-to-functor-83ef9075978b)<br>
> Any data structure that can apply a mapping function to its individual elements can be called a Functor.

![Functor Definition](../../ko/one-page-for-functional-programming/functor-definition-depicted.svg)

*   ① A data structure composed of 'unit elements'.
*   ② A Mapping function from each 'unit element' to another 'unit element'.

For any ① data structure, if you want to apply a desired operation, you just need to define what type (T) the unit element inside the data structure is, and ② the Mapping for that unit element (T). [If ① is viewed as a class property and ② as a class method, a Functor is sometimes called a Function Object.](https://en.wikipedia.org/wiki/Function_object)

> The concept of Functor originates from Category Theory, where it refers to a mapping from one category to an identical category. **This is conceptually identical to mapping individual unit elements within a data structure to new values while preserving the overall data structure.** When the data structure (category) remains unchanged, and only the values are mapped, Category Theory defines this as **natural transformation**.

## Haskell's Functor

When you look for Functors, you will likely first encounter Haskell's Functor concept, which is defined as a typeclass as follows. It is instantiated by specifying the data structure type as desired. In Swift-like syntax, it can be expressed as:

*   Functor (typeclass)
    *   Operation(**① T**) -> (**② R**)
    *   **③ S** (Any Data Structure)
*   Functor Implementation (instantiation)
    *   Operation(**① Int**) -> (**② String**) { +1 and Stringify }
    *   **③ List**

In Haskell, **a Functor can be seen as a generic (③ S, ① T, ② R) abstract class that has a data structure type (③ S) and an abstract mapping function from an element (① T) to an element (② R).** When defining `fmap()` or `map()` functions in Haskell, you define the abstract mapping function and inject the data structure you want to transform, and a new identical data structure with only its internal values changed is returned.

If you are a Java user, you might recall the `map()` function of Stream, which helps in understanding this.

*   Stream can be called a Functor because it is a Mappable data structure that can have a mapping function.
*   That mapping function can be defined as a lambda (anonymous function) and passed as a parameter to `Stream.map()`.

Java's Stream is, more precisely, a Monad. The reason is that its mapping function:

*   `Operation(T) -> (R)`: Instead of mapping an element (T) to an element (R),
*   `Operation(T) -> (S)`: It returns an entirely new Functor (S) from an element (T).

In a Functor, after extracting a unit element from the original data structure, applying the mapping, and then **inserting the result element back into the data structure**. In contrast, in a Monad, after extracting a unit element from the original data structure and applying the mapping, it **returns the resulting data structure directly** by inserting that element into a data structure. Because the function itself returns a data structure, you can continuously chain operations like `Stream.map().map().map()...` from the mapping function's result.

Let's explore why we perform **'element-to-data structure mapping'** instead of **'element-to-element mapping'** in the Monad section below.

# Monad

Before summarizing what a Monad is in one sentence, let's understand why Monads are necessary. Do you know the difference between a 'programming function' in a programming language and a 'function' in academia?

*   **Mathematical function**: Guarantees that a value will be returned eventually, regardless of any internal situations during execution.
*   **Programming function**: If an unhandleable situation occurs internally during execution, it throws an Exception and fails to return a value.

In higher mathematics and university courses, no function f(x) would ever throw an Exception in the middle of execution because an input value was incorrect. However, programming functions can throw Exceptions if their state becomes invalid during operation.

> From the perspective of pure functions, throwing an Exception is defined as a Side-Effect, so [functions that throw Exceptions are defined as **impure functions**](https://github.com/funfunStudy/study/wiki/%EC%88%9C%EC%88%9C%ED%95%A8%EC%88%9C-(Pure-Function)).

If, instead of stopping mid-execution when an Exception occurs in a programming function, the failure state were returned along with the result, the Side-Effect would be eliminated. This is essentially making programming functions pure. **To return both ① the state value and ② the function's inherent result value together, a data structure to bundle them both seems necessary.**

> To make Functor's Mapping function a pure function, we tried returning a data structure that includes both<br>
> ① the state value where an Exception might occur and ② the result value, in the function's output.

![Functor Return Value](../../ko/one-page-for-functional-programming/functor-return-functor-depicted.svg)

Although we made Functor's Mapping function return a data structure, a problem arose: **the returned data structure was wrapped once more by the Functor's data structure.**

*   The data structure containing the Exception state was
*   returned wrapped once more by the Functor's data structure after the Mapping function was performed.

This happens because a Functor extracts an internal element from its data structure, applies an operation to it, and then maps the result element back into the data structure.

![Monad Return Value](../../ko/one-page-for-functional-programming/monad-return-functor-depicted.svg)

To avoid unnecessary double-wrapping and return only the data structure containing the Exception state, **we explicitly define an Unwrap function (called `flatMap`) that extracts the value from the current data structure before the Mapping function is performed.** The Monad pattern then **directly returns the 'data structure' that is the result of mapping this 'internal element of the data structure' obtained by `flatMap`.**

*   Monad Definition

> A Monad is a **Mappable data structure that includes an Unwrap (flatMap) function.**<br>
> A Monad's Mapping function returns a data structure that contains both ① the state value and ② the result value.

![Monad Definition](../../ko/one-page-for-functional-programming/monad-definition-depicted.svg)

*   (1) A data structure composed of 'unit elements'.
*   A Mapping function from a 'unit element' to (2) 'a data structure including an Exception state'.
*   An Unwrap (flatMap) function that extracts a 'unit element' from the (1) data structure.

Many explanations of Monads describe them as data types possessing both Context and Content. Context is often explained as a 'state' of having/not having a value, and Content as the 'value' or 'result' we want to operate on. While a Monad's Context doesn't necessarily have to represent a nullable state, because cases where functions might throw Exceptions often involve null values, many explanations tend to describe it in terms of nullability.

## Function Composition

Monads not only ensure that the resulting data structure contains state values but also possess the property of **function composition**.

*   **Composition with associativity**: <br>
    Given two mapping functions f(x) and g(x), composing them yields f(g(x)) = (f.g)(x). <br>
    Due to the associative property, f(g(x)) = (f.g)(x) = (g.f)(x) = g(f(x)) is also satisfied.

![Monad Composition](../../ko/one-page-for-functional-programming/monad-composition-depicted.svg)

This concludes our exploration of five core concepts in functional programming: closures, higher-order functions, currying, Functors, and Monads. If you have any questions or points for discussion, please let me know in the comments or personally. I especially want to thank a senior developer for helping me refine and improve the content of this article. In the next article, I will explain the reference cycle issues that arise when Swift closures reference external variables and the techniques to resolve them.

---

- https://medium.com/@sjsyrek/five-minutes-to-functor-83ef9075978b
- https://medium.com/@jooyunghan/functor-and-monad-examples-in-plain-java-9ea4d6630c6
- http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html
- http://seorenn.blogspot.com/2014/06/swift-closures.html
- https://stackoverflow.com/questions/356950/what-are-c-functors-and-their-uses
- https://stackoverflow.com/questions/2030863/in-functional-programming-what-is-a-functor