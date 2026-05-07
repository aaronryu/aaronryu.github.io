---
title: "Coroutine: Differences from Threads and Their Characteristics"
category: ["Language", "Kotlin"]
created: 2019-05-26T18:20:22.000Z
updated: 2021-01-31T18:20:14.557Z
deck: "The era of infinitely spawning threads for asynchronous processing is over. This post delves into why coroutines, which efficiently manage resources by controlling execution flow within a program, unlike threads that rely on OS scheduling, have become an essential paradigm in modern programming."
abstract: "Starting with the memory structure differences between processes and threads, we analyze why coroutines are called 'lightweight threads' from the perspective of Context Switching costs. We also explore the principles of cooperative multitasking and learn the features and differences of major Kotlin coroutine builders like `launch`, `async`, and `runBlocking`."
keywords: "Coroutine, Asynchronous Programming, Thread, Kotlin, Context Switching, Non-preemptive Multitasking"
description: "This article examines the concept of coroutines, a core technology for non-preemptive multitasking that allows execution to be suspended and resumed. It details the differences from traditional thread-based approaches and practical applications in Kotlin."
---

When I first started using Kotlin, I encountered the concept of Coroutines for asynchronous processing. **Synchronous** refers to waiting for a return value after sending a request before proceeding, while **asynchronous** means performing other tasks during that waiting period to enhance efficiency.

Synchronous and asynchronous are concepts that frequently appear in programming for tasks requiring 'waiting,' often termed 'blocking.' Examples include I/O or Network Request/Response handling, which we learned about in OS courses. I recall that in the past, asynchronous processing was primarily used only for such specific examples. However, it seems that currently, any task is being broken down into smaller pieces and handled asynchronously. One reason for this shift is the increased ease of use; I believe the Coroutine concept, which I will explain here, contributes significantly by making asynchronous operations simpler than with traditional Threads.

# Process & Thread

> **Process**: An instance of a program loaded into memory and executing.<br>
> **Thread**: A unit of multiple execution flows within a Process.

While threads are generally known as smaller units of execution instances than processes, their memory areas also differ slightly.

![Diagram showing memory allocation for Process and Thread, indicating Heap for Process and Stack for each Thread.](../../ko/coroutine-and-thread/process-and-thread.png)

A Process is allocated an independent memory area (Heap), and each Thread is also allocated an independent memory area (Stack). Since a Thread is inherently part of a Process, the Heap memory area can be shared by all Threads belonging to that Process.

When a Process is created for a program, it has a Heap area, one Thread, and one Stack area. **Each time a Thread is added, a corresponding number of Stacks are added.** If there are 100 Threads, 100 Stacks are created in the total memory.

# Concurrency & Parallelism

## Concurrency

> **Interleaving (Time-sharing)**: Executing multiple tasks by dividing each task into small, equal parts.

![Diagram showing three tasks being interleaved, one after another, on a single core.](../../ko/coroutine-and-thread/tasks.png)

The total execution time, excluding Context Switching overhead, is equivalent to the sum of each task's execution time. For example, if three tasks each take 10 minutes, **a total of 30 minutes will be required.**

## Parallelism

> **Parallelizing (Parallel execution)**: Executing multiple tasks simultaneously.

![Diagram showing three tasks being executed in parallel across multiple cores.](../../ko/coroutine-and-thread/parallelism.png)

This requires as many resources as there are tasks, and Context Switching is not needed. The total execution time is determined by the longest-running task among the multiple tasks. For instance, if three tasks take 10, 11, and 12 minutes respectively, **a total of 12 minutes will be required.**

# Thread & Coroutine

Both Threads and Coroutines are technologies designed to ensure Concurrency (Interleaving). When performing multiple tasks concurrently, Threads allocate a memory area for each task. Since multiple tasks must be performed simultaneously, OS-level preemptive scheduling is required to determine how efficiently each task should be allocated and executed. This means performing a bit of Task A, then a bit of Task B, ultimately completing both. Coroutines, on the other hand, are referred to as Lightweight Threads. They also aim for Concurrency by efficiently distributing and completing tasks incrementally. However, instead of allocating a Thread for each task, they allocate only small Objects and freely switch between these Objects, thereby minimizing switching costs.

## Thread

*   Task Unit: **Thread**
    *   A Thread is allocated for each of multiple tasks.
    *   As explained above, each Thread has its own Stack memory area and occupies a JVM Stack area.
*   **Context Switching**
    *   Concurrency is ensured through **Context Switching by the OS Kernel**.
    *   **Blocking**: If Task 1 (Thread) needs to wait for the result of Task 2 (Thread),
        Task 1's Thread becomes Blocked and cannot use its resources during that time.

![Diagram illustrating context switching between different threads on a single CPU core.](../../ko/coroutine-and-thread/context-switch-between-threads.png)

*   For simplicity, we assume a single-core CPU.

In the diagram above, all tasks are handled as Thread units. While Thread A is performing Task 1, if Task 2 is required, it is called asynchronously. Task 1 halts its ongoing work (Blocked), and Task 2 is executed on Thread B. At this point, a Context Switching occurs, where the CPU's focus shifts from Thread A's memory area to Thread B's for computation. When Task 2 is completed, its result is returned to Task 1. Concurrently, Task 3 and Task 4 are allocated to Thread C and Thread D, respectively. Since a single-core CPU cannot perform concurrent operations, the OS Kernel's Preemptive Scheduling determines how much of each Task 1, 3, and 4 should be executed before pausing and switching to the next task, thereby ensuring Concurrency.

## Coroutine

*   Task Unit: **Object** = **Coroutine**
    *   An Object is allocated for each of multiple tasks.
    *   This Coroutine Object is loaded onto the JVM Heap, which holds objects.
*   **Programmer Switching** = No OS-level Context Switching
    *   Concurrency is ensured by **allowing the programmer to freely determine switching points through coding**.
    *   **Suspend** = Non-Blocking: If Task 1 (Object) needs to wait for the result of Task 2 (Object),
        Task 1's Object is Suspended, but the Thread that was executing Task 1 remains valid. Therefore, Task 2 can also be executed on the same Thread as Task 1.

![Diagram illustrating how multiple coroutines can run on a single thread without OS-level context switching.](../../ko/coroutine-and-thread/no-context-switch-between-coroutines.png)

*   For simplicity, we assume a single-core CPU.

Since the unit of work is a Coroutine Object, even if an asynchronous Task 2 occurs while Task 1 is being performed, Task 2 can be executed on the same Thread that was running Task 1. Furthermore, a single Thread can execute multiple Coroutine Objects. As shown in the diagram above, the transition between Task 1 and Task 2 is achieved by simply swapping Coroutine Objects on a single Thread A, thus **eliminating the need for OS-level Context Switching**. The ability to execute multiple Coroutines on one Thread and **the absence of Context Switching are why Coroutines are also called Lightweight Threads.**

However, if multiple threads are executed concurrently, as in the example of Thread A and Thread C in the diagram, Context Switching between these two Threads is still necessary to ensure Concurrency. Therefore, to maximize the advantage of 'No Context Switching' when using Coroutines, it is generally better to execute multiple Coroutine Objects on a single Thread rather than using multiple Threads.

> Ultimately, by reducing the unit of 'work' to an Object (Coroutine) instead of a Thread,
> task switching and performing multiple tasks no longer necessarily require multiple Threads.

<br>

> Coroutines are not a substitute for Threads but rather a concept for utilizing existing Threads more finely.
> Since a single Thread can execute multiple coroutines, there's no longer a need to endlessly spawn Threads based on the number of tasks, consuming memory unnecessarily.

*   They do not have a Stack memory area for each Thread, so memory usage does not increase with the number of Threads as it would with traditional Thread usage.
*   There's also no concern about locking for 'shared data structures' (Heap) within the same process.

![Comparative progress bars showing execution flow for Threads versus Coroutines, highlighting reduced context switching in coroutines.](../../ko/coroutine-and-thread/concurrency-progress-bar-thread-and-coroutine.png)

The diagrams showing Thread and Coroutine examples have been summarized above. When using Coroutines, you can see that the Thread remains the same even when the Task changes. Consequently, the number of Context Switching events is significantly reduced. As explained for Coroutines, if Task 3 and Task 4 are also designed to run on Thread A instead of Thread C, it's possible to design an application with no Context Switching at all. This means that the Thread on which a Coroutine runs is determined by the programmer who specifies a Shared Thread Pool, implying that the efficiency gained from using Coroutines is entirely up to the programmer.

### Coroutines in Various Languages

*   **Future** = Java asynchronous support
*   **Promise** / **Generators** = JavaScript asynchronous support
    *   Generators only pause execution via the `yield` statement. In other words, they break tasks into small pieces (Iterator) and 'freeze' them (Freeze/Yield).
*   **Deferred** = Kotlin asynchronous support
    *   A Non-Blocking Cancellable 'Future' (Java) = Coroutine Object.
    *   Defined via the `async { }` Coroutine Builder.
    *   As explained in the Coroutine section, when executing a Deferred object, it does not block the Thread; it `await`s until the expression finishes, then continues.

### Stackful & Stackless

If you've delved deeper into Coroutines, you'll find they are categorized into two types: Stackful and Stackless. As mentioned at the very beginning of this article, a Thread has its own memory area, the Stack. The Stack is responsible for storing function call order and managing it. For Lightweight Threads like Coroutines, 'Stackful' and 'Stackless' refer to whether the Coroutine possesses its own Stack. A Stackful Coroutine means that if another function is called from within the Coroutine, that function can suspend the current Coroutine (more precisely, it can call `yield`). A Stackless Coroutine does not have a separate Stack for functions, so to connect the outer Coroutine with an inner function's suspension, the function to be called must first be wrapped in another Coroutine object, creating a 'nested Coroutine call'.

*   **Coroutine**: Stackful Functions
    *   `Yield` (Suspending the Coroutine) can be called from within a Coroutine's inner function.
*   **Generators**: Stackless Functions
    *   `Yield` (Suspending the Coroutine) cannot be called from within a Generator's inner function.
    *   For example, within an `Arrays.forEach()` function inside a Coroutine, a `yield` call is impossible unless the `forEach()` function itself is separately defined to support coroutine application.

# Kotlin Coroutine

## `buildSequence {}`

*   Sequential Yield/Resuming
    *   Execution is paused via `yield`.
    *   Execution resumes sequentially via `resume`.

```kotlin
fun g() = buildSequence {
  yield(1); yield(2);
}
for (v in g()) {
  println(v)
}
```

## `runBlocking {}`

*   **Blocks the Main Thread** while + **executing the tasks within the `{ }` block on a new Thread**.
*   If multiple `async { }` blocks are defined within `runBlocking { }`,
    the Main Thread is unblocked only when all those `async` tasks have completed and returned their results.

## `launch {}`

*   **Unblocks the Main Thread** while + executing the tasks within the `{ }` block.

## `async {}`

*   **Unblocks the Main Thread** while + executing the tasks within the `{ }` block and then **returns a value**.
    *   `async { }` performs similarly to `launch { }` but returns a `Deferred` object that holds a return value.
    *   That is, `launch` executes to completion, whereas `async` executes to completion and returns an object containing the return value.
    *   `Deferred`, which has an `await()` function that returns the result of the coroutine.

---
- https://stackoverflow.com/questions/1934715/difference-between-a-coroutine-and-a-thread
- https://stackoverflow.com/questions/43021816/difference-between-thread-and-coroutine-in-kotlin/43232925
- https://kotlinlang.org/docs/tutorials/coroutines/coroutines-basic-jvm.html
- https://medium.com/@jooyunghan/stackful-stackless-%EC%BD%94%EB%A3%A8%ED%8B%B4-4da83b8dd03e
---