---
title: "The Rehashing Issue of ParallelStream and HashMap"
category: ["Troubleshooting", "Java 8+"]
created: 2021-01-30T16:15:46.000Z
updated: 2021-03-15T18:13:31.498Z
deck: "Java's ParallelStream, introduced for performance improvement, can sometimes become a critical toxin that halts the system. This article explores the dangers of a multi-threaded environment through a case study of a HashMap Race Condition and an infinite loop failure encountered while trying to resolve performance degradation during an MSA migration."
abstract: "This article shares a practical experience of introducing ParallelStream to address performance issues that arose when migrating a legacy system, primarily focused on single queries, to an MSA. Specifically, it analyzes the pointer cycle problem and data loss mechanism during the Rehashing process that occurs when a non-thread-safe HashMap is used within a parallel stream, and proposes a fundamental solution."
keywords: "ParallelStream, HashMap, Race Condition, Infinite Loop, Rehashing, MSA Performance Improvement"
description: "This article provides a detailed explanation of a Race Condition failure and its causes, triggered by non-thread-safe HashMap put operations when using Java 8+'s ParallelStream."
---

# Performance Degradation During Single SQL Query -> MSA APIs Transition

Recently, I was involved in a replatforming project to convert a legacy monolithic architecture system to an MSA (Microservices Architecture) structure. The existing legacy system had numerous tables corresponding to various subdomains connected by a single query with many joins. While this allowed obtaining results with "just one query" and offered excellent performance, it had a terrible structure in terms of reusability and maintainability.

When we transformed the system to handle requests by dividing subdomains like reservations, payments, settlements, and products into separate services and processing them through "multiple API calls," reusability and maintainability improved. However, replacing SQL joins with numerous API calls led to fragmented execution and increased network latency, resulting in performance degradation. Addressing this became another challenging point in the replatforming effort.

# Performance Improvement via Java Stream -> ParallelStream

In a single query environment, a simple join can gather information scattered across multiple tables into a single DTO. However, if these tables are divided into domain-based services like a reservation service or an account service, a straightforward join statement necessitates calling multiple APIs corresponding to each table and then merging their results into a single DTO based on IDs. When implementing this ID-based join programmatically, I personally tend to write it similarly to a Hash Join strategy for performance, which implies the need for a HashMap for the results of each API call.

Converting a `List` to a `HashMap` is simple, but if the `List` results are very large, just converting each domain's table data into a `HashMap` can take several seconds. To reduce this time, I opted to convert from `Stream` to `ParallelStream`. To be honest, as a junior developer, it felt like a no-brainer—why wouldn't I use something so fast? Performance significantly improved, and it seemed to work well for a long time, but then unexpectedly, several issues emerged.

# ParallelStream

**ParallelStream is a tool introduced in Java 8 that makes multi-threaded programming extremely easy to use.** Multi-threading was the most complex and difficult topic during my university days, so the idea of using it easily with just a single line of code was very appealing to me, especially given the inconvenience of traditional thread management. Furthermore, performance comparisons on other webpages clearly show that `ParallelStream` provides an unbelievably faster performance compared to classic `for-each` loops and `Stream` operations.

# ForkJoinPool: ParallelStream's Thread Management

The reason thread management became easier is due to the `ForkJoinPool`, an extended thread management mechanism building upon Java's existing thread management approach. As the name suggests, `Fork + Join` allows any complex task to be broken down into smaller units, processed by multiple threads, and then merged into a single result once completed. This is precisely how `ParallelStream` operates.

### ExecutorService (Traditional)

-   **1 Queue** (1: Main Queue)
-   **Assigns jobs from the Main Queue to idle threads in the Thread Pool.**

### ForkJoinPool (New, Fork + Join)

-   **2 Queues** (1: Main Queue, 2: Worker Queue / Local Queue for `ExecutorService` implementation)
    -   `ForkJoinPool` is an `ExecutorService` implementation with additional queues.
-   **Assigns jobs from the Main Queue to idle threads in the Thread Pool, with additional processes:**
    -   **Fork:** The assigned thread divides its job into smaller, executable units.
    -   **Steal:** If one thread becomes overburdened with many jobs, other threads "steal" tasks to share the workload.
    -   **Join:** The results of tasks that were divided and executed by multiple threads are then merged back by the original thread to return a single result.

`ParallelStream` is based on **Spliterator** and **ForkJoinPool**, using the Fork + Join mechanism to divide tasks into small units. This ensures that no single thread is overloaded with workload in real-time, allowing multiple threads to efficiently share and process these smaller tasks. Consequently, results are returned faster, which is why `ParallelStream` is often associated with high performance.

# Infinite Loop Issue When Using HashMap & ParallelStream

## Rehashing

After successfully improving service performance with `ParallelStream`, an on-call alert was triggered after a long time. The CPU utilization of the server instance suddenly exceeded 75% and remained there for an extended period. Since the utilization didn't drop from 75% for so long, it indicated an infinite loop. Upon analyzing the thread dump, **I found threads allocated by `parallelStream` were stuck in a blocked state.**

The problematic logic was a `HashMap.put` operation used inside the `ParallelStream`.

```java
Map<Integer, Boolean> result = new HashMap<>();
sampleList.parallelStream().forEach(each ->
  result.put(each.getId(), isSample)
);
```

On the surface, it seems straightforward: since it's a `Map` rather than a `List`, the insertion order shouldn't matter, and values should be stored correctly. **However, this was a fundamental oversight, as it neglected the crucial aspect of `HashMap`'s Rehashing.** `HashMap.put` operations, for a Key-Value Pair, proceed through the following steps:

1.  A hash is generated for the new Key being added.
2.  The hash table index is checked for existing entries via a `for-loop`.
3.  The Value is stored using a pointer at the corresponding hash Key.
4.  If the number of Values linked by pointers to a specific hash Key exceeds a certain threshold, `Rehashing` is performed:
    -   The hash index is divided, and Values are re-distributed and re-stored.

## Rehashing: Race Condition

During the above process, steps 3 (linking a new Value with a pointer) and 4 (Rehashing) involve modifying pointers. A default `HashMap`'s pointer modification is not thread-safe. Therefore, if multiple threads attempt to perform steps 3 and 4 simultaneously—i.e., modify pointers for the same hash index—problems can arise. If two threads simultaneously attempt to reset pointers for the same hash Key during `Rehashing`, their pointers can become entangled, forming a cycle. Both steps 3 and 4 are executed during a `put` operation. This pointer cycle, when encountered during the `for-loop` lookup in the hash table index for existence, causes an infinite loop.

Besides the infinite loop problem caused by such a Race Condition when `HashMap` and `ParallelStream` are used together, it's also common for some keys to be lost even if the operation seemingly completes normally. This also occurs when multiple threads simultaneously attempt to inject Values via pointers to a hash Key; only some pointers are correctly allocated, while others are ignored. This can lead to the perplexing situation where 10,000 new keys are inserted via `put`, but the actual `HashMap` ends up storing fewer than 10,000 keys.

# Conclusion

When a non-thread-safe operation—in this article's case, `HashMap.put`—is executed within Java's `ParallelStream`, a Race Condition can occur, causing some thread operations to be ignored by other threads and leading to unexpected results. For `HashMap`, the following issues can arise:

-   A pointer cycle forms between Values linked to a Hash Key, leading to an infinite loop during `for-loop` existence checks.
-   Even after 10,000 `put` operations, some Value pointer injections might be ignored, resulting in a `HashMap` size of less than 10,000.

At that time, due to numerous issues caused by `ParallelStream`, we removed all instances of `ParallelStream` from the entire service logic to resolve the on-call incidents. The above problem can be resolved simply by replacing `HashMap` with `ConcurrentHashMap`. Of course, since `ParallelStream` operates on the principles of **Spliterator** and **ForkJoinPool**, based on the Divide-and-Conquer paradigm, the splitting and merging operations can consume a significant amount of memory and CPU resources. Therefore, if your use case involves hundreds of thousands or even millions of loop iterations, stress testing is absolutely necessary.

---

- https://hamait.tistory.com/612
- https://blog.naver.com/tmondev/220945933678
- http://www.h-online.com/developer/features/The-fork-join-framework-in-Java-7-1762357.html
- https://medium.com/@itugs/custom-forkjoinpool-in-java-8-parallel-stream-9090882472db
- https://java-8-tips.readthedocs.io/en/stable/parallelization.html#conclusion

---