---
title: "Understanding Hoisting and Closure through JavaScript Engine Overview and Execution Process"
category: ["Language", "Javascript"]
created: 2020-08-26T17:22:10.000Z
updated: 2021-01-30T16:21:33.148Z
deck: "JavaScript transcends a simple interpreter language, executing in a modern fashion through high-performance engines like V8. This article dissects how the magic of 'Hoisting,' where variable declarations seem to be pulled to the top, and 'Closure,' where functions remember their state even after termination, are implemented deep within the engine."
abstract: "This article aims to understand the principles behind Hoisting by focusing on the JavaScript engine's two-phase execution process: 'Compilation' and 'Execution.' Furthermore, it will explore the mechanism by which Closures persist in memory through the relationship between Execution Contexts and Lexical Scopes, and discuss considerations for using Closures from a Garbage Collection (GC) perspective."
keywords: "JavaScript Engine, V8 Engine, Hoisting, Closure, Execution Context"
description: "This article provides an in-depth explanation of Hoisting and Closure concepts, not merely as memorization items, but from the perspective of the JavaScript V8 engine's compilation and execution mechanisms."
---

# JavaScript

JavaScript is one of the three core elements of a web page:

-   **HTML**: A markup language that defines the format of web pages (documents).
-   **CSS**: A language for defining the design elements of web pages (documents).
-   **JS** (JavaScript): A language for handling all interaction events between web pages (documents) and users.

Like other programming languages, JavaScript can execute synchronously through immediate function declarations and calls, or asynchronously at specific event times via callbacks. For execution, an engine is required to transform the JavaScript code written by developers into an executable language, manage its execution order, and handle memory.

> A browser typically consists of an **HTML/CSS engine** + a **JavaScript engine**.

Various web browsers like Chrome, Internet Explorer, and Safari each have their own HTML/CSS/JS engines. Among JavaScript engines, V8, used in Chrome and Node.js, is a prominent example. The JavaScript engine and runtime explanations in this article will be based on V8. Let's clarify the terms "JavaScript engine" and "JavaScript runtime," which will be frequently mentioned. A more detailed explanation will be provided in the subheading "JavaScript Engine and Runtime."

> A **JavaScript runtime** is a **collection of APIs and functionalities** that includes the **JavaScript engine** necessary for JavaScript to operate.
> A **JavaScript engine**, in a narrow sense, exclusively handles JavaScript interpreting and can be understood as equivalent to **Java's JVM**.

For example, Chrome, which we use, operates on a JavaScript runtime based on the **V8 JavaScript engine**.

# JavaScript = Interpreted Language

> JavaScript is a scripting language and an **interpreted language** processed by an engine.
> However, it also includes a **compilation process**. Let's elaborate on this.

The JavaScript engine has an execution structure slightly different from typical shell scripts, which execute line by line as interpreted languages. It first undergoes a Ⓐ JIT (Just-in-Time) compilation process, which briefly scans the entire function to be executed for variable and function declarations just before execution. This is then followed by a Ⓑ execution phase cycle. This Ⓐ JIT (Just-in-Time) compilation process differs from the AOT (Ahead-of-Time) compilation process that creates intermediate code in commonly known compiled languages like C++ and Java. You might be surprised to learn this, especially if you've always known JavaScript as an interpreted language. Sometimes, JavaScript is referred to as a compiled language simply because its engine includes a compilation process, but it is strictly different from the definition of traditional compiled languages. Since the JavaScript engine performs compilation at the time of function execution, it is fundamentally an interpreted language.

> The JavaScript engine is divided into two phases: **Ⓐ JIT Compilation Phase** and **Ⓑ Execution Phase**.
> In conclusion, JavaScript can be summarized as **an interpreted language with a compilation process**.

# JavaScript Engine and Runtime

A JavaScript runtime can be broadly divided into 2 main components, and individually into 5:

-   JavaScript Engine = **① Heap** + **② Stack** (Call stack)
-   **③ Web APIs** + **④ Callback Queue** + **⑤ Event Loop**

The JavaScript engine specifically refers only to **① Heap** and **② Stack**, executing all code on a single thread. The **③ Web APIs**, **④ Callback Queue**, and **⑤ Event Loop**, which are learned when studying JavaScript's asynchronous nature, are not strictly components of the JavaScript engine itself. If the JavaScript engine executes all code on a single thread, it would only support synchronous execution, so how does it support asynchronicity? To enable asynchronous support, these three elements (③, ④, ⑤) are added by the JavaScript runtime.

The (2) Stack in the JavaScript engine differs from the Stack in other programming languages. Other languages typically push context information, such as local function variables, onto the Call Stack as functions execute. This context, being confined to local functions, is also referred to as a Scope. In contrast, while the JavaScript engine also loads function call order onto the Call Stack, it stores variable and function declaration and assignment information separately in the Heap, with the Call Stack only holding pointers to this Heap data. Specifically, the breakdown is as follows:

-   JavaScript Engine
    -   **① Heap**: A memory area where all declared and assigned variables and functions for each function are stored.
    -   **② Stack** (Call Stack): Stores pointers to the Heap according to the function execution order and executes them.
-   Asynchronous Support
    -   **③ Web APIs**: [Provides various functions not native to basic JavaScript, such as DOM, Ajax, and setTimeout.](https://developer.mozilla.org/ko/docs/Web/API)
        -   These are implemented in various languages like C++ by browsers or operating systems.
    -   **④ Callback Queue**: Callbacks generated by the Web APIs are sequentially queued here.
    -   **⑤ Event Loop**: A thread that moves functions from the Callback Queue one by one to the Stack for execution.

# JavaScript Engine Execution Process

The JavaScript engine is divided into two phases: **Ⓐ JIT Compilation Phase** and **Ⓑ Execution Phase**.

## Ⓐ Compilation Phase

Upon each function execution (the first JavaScript execution function is `main()`), ASTs are generated and converted into bytecode. For JIT compilation (which reduces unnecessary compilation time by caching bytecode), a profiler stores/tracks function call counts. What we need to remember is that in this phase, **variable 'declarations'** (among declaration and assignment) and **function 'declarations' are loaded into the Heap**.

> A JavaScript **variable 'declaration'** is `var a`. (`a = 5` is an 'assignment'.)

<br>

> A JavaScript **function 'declaration'** is `function a() {}`.

<br>

> In the Ⓐ Compilation Phase, only **variable and function 'declarations' are extracted and loaded into the Heap**.
> Variable and function declarations are compiled and stored before JavaScript execution to check for their existence during actual execution.

For example, when a JavaScript file like the one below is executed for the first time, the entire file undergoes the compilation process.

```js
var a = 2;
b = 1;

function f(z) {
  b = 3;
  c = 4;
  var d = 6;
  e = 1;

  function g() {
    var e = 0;
    d = 3*d;
    return d;
  }

  return g();
  var e;
}

f(1);
```

1.  A **Global Scope (window) area for the `main()` function is created in the Heap** for the initial JavaScript execution.

```
# Global Scope (window)
-
-
```

2.  The variable declaration `var a` is found, and `a` is **loaded into the Global Scope (window) area**.
3.  The variable assignment `b = 1` is an assignment, so `b` is **not loaded into this area**.

```
# Global Scope (window)
- a =
-
```

4.  The function declaration `function f(z) {}` is found, and `f` is **loaded into the Global Scope (window) area**.
5.  When a function is loaded, a pointer value to the bytecode (blob) of the `f` function is loaded along with it.

```
# Global Scope (window)
- a =
- f = a pointer for f functions bytecode
```

After the compilation process for the JavaScript code from the first to the 20th line is complete, the Heap configuration will be as described last.

## Ⓑ Execution Phase

**Variable 'assignments'** are performed, and **functions are actually called and executed**.

> A JavaScript **variable 'assignment'** is `a = 1`.
> When `a = 1` is assigned, it first checks if variable `a` was declared during the previous compilation phase.
> If it doesn't exist, variable `a` is declared and assigned simultaneously, then loaded.

<br>

> A JavaScript **function 'call and execution'** is `a()`.
> When `a()` is executed, first, it checks if the function `a()` was declared during the previous compilation phase.
> Second, when `a()` is executed, a new Local Execution Scope area for the new function is created in the Heap, and the Call Stack loads `a()` function information, which holds a pointer to this newly created Heap.
> Finally, when `a()` is executed, compilation is performed, and variables and functions within this function are loaded into the Local Execution Scope area.

<br>

> In the Ⓑ Execution Phase, 'assignment' values of variables are loaded into the Heap, and functions are called and executed.

Unlike stack-based languages, which load variables and functions onto the stack with each function call, JavaScript's stack holds the function call order and pointers to the actual variable and function information in the Heap. The Local Execution Scope for function `a()` in the Heap holds a pointer to the Global Scope (window) that existed in the Heap before `a()` was called, allowing the engine to perform the following operations:

-   When `a = 1` is assigned within the `a()` function, it first searches for the declaration of variable `a` in the Local Execution Scope. If it doesn't exist, it can go back to the previous Global Scope to search.
-   When `a()` function execution finishes, the current Heap area is reverted to the Global Scope via the Call Stack.

After completing the compilation process for the JavaScript file example discussed above, the execution process proceeds as follows:

6.  After the compilation, with the Heap below, execution starts from the very first line of the JavaScript file code again.

```
# Global Scope (window)
- a =
- f = a pointer for f functions bytecode
```

7.  The variable assignment `a = 2` is found, and the Global Scope (window) area is checked for the existence of variable `a`.
8.  Since variable `a` exists, `2` is assigned to `a`.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
```

9.  The variable assignment `b = 1` is found, and the Global Scope (window) area is checked for the existence of variable `b`.
10. Since variable `b` is not declared, `b` is declared and `1` is assigned.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1
```

11. The function call `f(1)` is found, and the Global Scope (window) area is checked for the declaration of `f()`.
12. To compile and execute the `f()` blob, a new Local Execution Scope area is created in the Heap.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1

# Local Execution Scope for f()
- (hidden) A pointer for previous scope (= Global Scope (window))
-
-
```

When the `f(1)` function executes, the newly created Local Execution Scope again undergoes the Compilation Phase to load variables and functions, and then proceeds with the Execution Phase. If there are other functions nested within `f(1)`, this process recursively repeats.

13. After the **Ⓐ Compilation Phase** of function `f()`, it will look like this:

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1

# Local Execution Scope for function f()
- (hidden) a pointer for previous scope (= Global Scope (window))
- z =
- d =
- e =
```

14. After the **Ⓑ Execution Phase** of function `f()`, variable assignments within `f()` and the Scope for function `g()` will be created.

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 3

# Local Execution Scope for function f()
- (hidden) a pointer for previous scope (= Global Scope (window))
- z = 1
- d = 6
- e = 1
- c = 4

# Local Execution Scope for function g()
- (hidden) a pointer for previous scope (= Local Execution Scope for function f())
- e =
```

# JavaScript Engine Characteristics

## Function-level scope: `var`

**JavaScript execution ultimately involves Ⓐ compilation and Ⓑ execution recursively based on functions.** Starting with the Ⓐ and Ⓑ processing for the `main()` function upon initial JavaScript execution, if a new function call occurs internally, Ⓐ and Ⓑ processing for that new function begins, and so on for any further nested function calls.

> A `var` variable declared within a specific function is defined during the Ⓐ compilation of that function, making the scope of `var` function-level.

For block-level (`{}`) variables in constructs like `if` and `for` statements, **Block-level scope: `const`, `let`** was newly introduced in the ES6 specification.

## Scope Chain

As observed in the JavaScript engine execution process, during the Ⓑ execution phase for a specific function, when a variable is assigned, the function's Heap area is first checked for a variable declaration. **If the variable is not declared within the current function, the Heap of that function cannot find the variable declaration. In this case, the engine traverses up through the `(hidden) A pointer for previous scope` to the calling function's Heap Scope to check if the variable is declared there.** If the variable declaration is not found in any function, the search continues all the way up to the `main()` function, the first function called. **Because the search for variable declarations proceeds in a chained manner, checking each function's Heap Scope in reverse order of the function call stack all the way to the initial `main()` function, this is called the Scope Chain.**

## Variable Hoisting

Because variable declarations occur first in the Ⓐ compilation phase, followed by variable assignments in the Ⓑ execution phase, if they are within the same function-level scope, the JavaScript engine processes a variable declaration as happening first, even if the declaration and assignment are separated as shown below.

```js
a = 10
var a;
```

```
# Global Scope (window)
- a = 10
```

As in the example above, a `var a` declaration within the same function-level scope appears to be 'hoisted' to the top. However, if a variable is not declared within a function, the engine searches for it via the Scope Chain all the way up to the `main()` function. If it's still not declared in the `main()` function's Heap Scope, the variable is declared in the `main()` function area. Since any function called from `main()` will look at this newly declared variable via the Scope Chain, it effectively becomes a global variable. (The Heap Scope area for `main()` is also called the Global Scope (window).) **When a variable is assigned within a specific function, but that variable does not exist in any function, it is 'hoisted' all the way up to the `main()` function to be declared as a global variable. This phenomenon, where variable declarations seem to be 'pulled up,' is collectively referred to as Variable Hoisting.**

## Variable Shadowing

If a variable is declared within a specific function's Heap Scope, any assignment to that variable will be made to the variable declared in the current function's Heap Scope. Even if an identical variable name is declared in a calling function (an earlier function in the Scope Chain), there's no need to traverse the Scope Chain to the previous function's Heap Scope because the variable already exists in the current function's Heap Scope. **Since the current function neither knows nor needs to know about the existence of an identically named variable in a previous function, this is called Variable Shadowing.**

## Garbage Collection

When the direct execution of a function ends, its information is removed from the Stack, and its Heap Scope within the Heap memory is also removed. This memory cleanup is called Garbage Collection. When the entire JavaScript file finishes execution, the Global Scope (Window) of the `main()` function is the last to disappear. While some languages, like Swift, perform Garbage Collection based on Reference Count, **JavaScript performs Garbage Collection purely based on the Reachability of functions (pointers).** In cases where a function execution is assigned to a variable instead of being executed directly, the function's Heap Scope might not be Garbage Collected even after its immediate execution ends, because the function can still be called repeatedly through the assigned variable. This scenario is precisely what the Closure concept, explained below, addresses.

## Closure

In the example used to explain JavaScript engine execution, instead of directly executing `function f`, we declared `var myFunction` and assigned `f` to it.

```js
var a = 2;
b = 1;

function f(z) {
  b = 3;
  c = 4;
  var d = 6;
  e = 1;

  function g() {
    var e = 0;
    d = 3*d;
    return d;
  }

  return g; // Changed from return g();
  var e;
}

var myFunction = f(1); // Newly added code
myFunction();
```

When a function call is assigned to a variable, the function's invocation isn't a one-time event that disappears after execution. Instead, it can be repeatedly called via the `myFunction` variable. Therefore, the Heap Scope created for the `f` function call cannot be deleted. To put it simply, the `f` function's Heap Scope holds the parameter value `1` passed for `f`'s execution, preventing it from being Garbage Collected. In this way, when a function call is assigned to a variable, the `f` function's Heap Scope and the Heap Scope of the function that called `f` are strongly bound together by the parameter `1`. Consequently, even after the `f` function finishes execution, its Heap Scope is not Garbage Collected.

Closure is the concept of linking a function's Heap Scope with the Heap Scope of the function that calls it, meaning that even after a function call ends, its Scope remains 'enclosed' within the calling function's Scope.

---
- https://youtu.be/QyUFheng6J0
- https://www.quora.com/Is-JavaScript-a-compiled-or-interpreted-programming-language
- https://medium.com/@almog4130/javascript-is-it-compiled-or-interpreted-9779278468fc
- https://blog.usejournal.com/is-javascript-an-interpreted-language-3300afbaf6b8
- https://youtu.be/QyUFheng6J0?t=435
- https://dev.to/genta/is-javascript-a-compiled-language-20mf
- https://dev.to/deanchalk/comment/8h32
- https://gist.github.com/kad3nce/9230211#compiler-theory
- https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf
- https://developer.mozilla.org/ko/docs/Web/%EC%B0%B8%EC%A1%B0/API
- https://medium.com/@antwan29/browser-and-web-apis-d48c3fd8739