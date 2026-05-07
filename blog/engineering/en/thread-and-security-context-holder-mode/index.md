---
title: "Spring Security: SecurityContextHolder's Thread Sharing Strategies"
category: ["Troubleshooting", "Java 8+"]
created: 2021-03-14T14:35:26.000Z
updated: 2021-03-15T18:15:43.363Z
deck: "I encountered a peculiar bug where Spring Security session information intermittently vanished within a `parallelStream` introduced for parallel processing. Like 'Schrödinger's Cat,' the results varied with each refresh. This post delves into the cause of this phenomenon and explores the three strategies SecurityContextHolder uses to share session data in a multi-threaded environment."
abstract: "This article analyzes why permission checks failed in only some threads when `parallelStream` was applied to list filtering logic. It diagnoses the issue caused by `SecurityContextHolder`'s default `MODE_THREADLOCAL` strategy failing to share context with child threads, and examines the characteristics and caveats of different sharing modes, such as `MODE_INHERITABLETHREADLOCAL`, to resolve this."
keywords: "Spring Security, SecurityContextHolder, ThreadLocal, parallelStream, multithreading, session sharing"
description: "Explains the three thread sharing strategies of `SecurityContextHolder` and considerations for session management in multi-threaded environments, based on a scenario where session information is lost when using parallel streams in Spring Security."
---

I needed to implement a process on a page displaying multiple pieces of information in a list, where some information would be hidden based on the logged-in user's permissions. My approach was to first retrieve the list from an API, then filter some of this information using the roles stored in the current Spring Security login session, and finally render the processed list on the display page.

However, I encountered a strange bug: **if there were 10 rows displayed in the list, the 'session permission filtering' logic was only applied to approximately 2 to 3 rows (about 1/4), while the remaining 3/4 of the rows were unaffected.** What was even stranger was that the specific 1/4 of rows that were affected changed unpredictably with each refresh. For example, after one refresh, the filtering might apply to the 2nd and 3rd rows, but after another refresh, it might apply to the 5th and 6th rows. It was like Schrödinger's Cat...

The implementation was as follows:

```java
List<SomeInformation> list = someApi.retreive(condition);
list.parallelStream()
    .forEach(each -> {
        if (!SecurityHelper.hasRole("ROLE_CAN_SEE_SENSITIVE_NUMBERS")) {
            each.setSensitiveNumber1(null);
            each.setSensitiveNumber2(null);
        }
    })
```

```java
public class SecurityHelper {

    public static boolean hasRole(String role) {
        SecurityContext context = SecurityContextHolder.getContext();
        if (Objects.isNull(context))) {
            return false;
        }
        Authentication authentication = context.getAuthentication();
        if (Objects.isNull(authentication))) { // Corrected 'auth' to 'authentication'
            return false;
        }
        for (GrantedAuthority eachAuthority : authentication.getAuthorities()) { // Corrected 'GrantAuthority' to 'GrantedAuthority'
            if (role.equals(eachAuthority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}
```

Actually, the login account used for testing had the `ROLE_CAN_SEE_SENSITIVE_NUMBERS` permission, so both `sensitiveNumber1` and `sensitiveNumber2` should have been displayed normally for all rows in the list. **However, only 1/4 showing up was very odd, so I added logs inside the `parallelStream.forEach` block, which yielded the following results:**

```
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-3] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-2] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-7] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-1] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [http-nio-80-exec-3] [TEST] hasRole: true
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-4] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-5] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-6] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-2] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [http-nio-80-exec-3] [TEST] hasRole: true
```

It appears that `hasRole` returns `false` unexpectedly in the **child threads** (`ForkJoinPool.commonPool-worker-1~7`) allocated for `parallelStream` execution (i.e., the ForkJoinPool), while it returns `true` correctly in the **main thread** (`http-nio-80-exec-3`). This strongly suggests an issue with combining `parallelStream` and `SecurityContextHolder`.

# SecurityContextHolder's Thread Sharing Modes

The primary reason `hasRole = false` was returned in the `parallelStream` worker threads was that `SecurityContextHolder.getContext()` returned `null`. In contrast, when `SecurityContextHolder.getContext()` was called in the main thread, it successfully retrieved session data and proceeded with the appropriate permission check logic for `hasRole`. Upon further investigation, I discovered the following:

> `SecurityContextHolder` allows you to specify the mode for sharing `SecurityContext` login session information across threads. The default value is **MODE_THREADLOCAL**, which means `SecurityContext` information is only visible to the **"main thread"**.

There are a total of three sharing modes:

-   **MODE_THREADLOCAL**: (Default) Shared only within the local thread.
-   **MODE_INHERITABLETHREADLOCAL**: Shared with child threads created by the local thread.
-   **MODE_GLOCAL**: Shared across all threads, application-wide.

Since the default mode was **MODE_THREADLOCAL**, in my server setup where no specific configuration was applied, `SecurityContext` was only returned in the **main thread** (`http-nio-80-exec-3`), while `null` was returned in the other **child threads** (`ForkJoinPool.commonPool-worker-1~7`).

# Conclusion

Because `SecurityContextHolder`'s default setting is to share `SecurityContext` information only within the local thread, it is generally cleaner and potentially more performant to retrieve the `SecurityContext` in the main thread and pass that value to child threads, rather than calling `SecurityContextHolder` directly within the child threads.

**If you are using features like `parallelStream` or `Async` and need to use `SecurityContextHolder` within child threads, you should consider switching `SecurityContextHolder`'s sharing mode to `MODE_INHERITABLETHREADLOCAL`.**

---

-   [Spring Security - SecurityContextHolder Strategy](http://ncucu.me/116)

---