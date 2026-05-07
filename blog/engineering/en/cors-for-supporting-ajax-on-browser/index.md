---
title: "CORS - A Complementary Policy to SOP for Cross-Origin AJAX Calls"
category: ["Frontend"]
created: 2022-07-18 01:51:23
deck: "When I first delved into web development, CORS was one of the initial challenges I encountered. CORS itself isn't an issue but a protocol that informs developers when a request doesn't adhere to its rules. It's a fundamental security component for web browsers. While linking external images for a blog doesn't pose a security risk, retrieving dynamic resources from external sources via AJAX calls like POST or PUT can alter server state, creating security vulnerabilities. Therefore, calls that modify server state (including client state changes via cookie headers) must be rigorously verified to ensure they are genuinely intended by the developer. Otherwise, malicious script injection into a blog could trigger unwanted AJAX calls to manipulate server resources on an external domain."
abstract: "Web browsers display resources fetched from both the same domain and external domains for versatile content utilization. Resources from the same domain are 'Same Origin,' while those from different domains are 'Cross Origin.' For minimal security, browsers implement the Same-Origin Policy (SOP), which allows cross-origin fetching for simple resources. However, AJAX calls, which can manipulate external domain resources, are blocked by SOP due to potential risks. CORS is an additional policy that enables AJAX requests to external domains that would otherwise be blocked by SOP."
keywords: "CORS, SOP, Same-Origin Policy, AJAX, Browser Security, Preflight"
description: "Summarizing the concept and verification process of CORS policy, which complements the browser's SOP for security, enabling secure Cross-origin AJAX calls."
---

# Browser's Same-Origin Policy (SOP)

HTTP requests in browsers fundamentally adhere to the Same-Origin Policy (SOP).

-   The 'same origin' or 'different origin' determination is based on three elements:
    -   Scheme (http) + Host (1.2.3.4) + Port (8080)

Due to its name, the Same-Origin Policy might be misunderstood as strictly requiring the calling domain and the resource-providing domain to be identical. However, it [**exceptionally permits the following cases where security is not compromised**](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_network_access). Note that Cross-site, Cross-domain, and Cross-origin all refer to the same concept.

-   Cross-origin **Submissions**: <u>Intended</u> submissions by the user
    -   Can **submit()** to another domain using `<form>` tags
-   Cross-origin **Fetching**: <u>Simple retrieval</u> = no malicious requests possible
    -   Can fetch **image files** from another domain using `<img>` tags
    -   Can fetch **CSS** from another domain using `<link>` tags
    -   Can fetch **JavaScript libraries** from another domain using `<script>` tags
    -   `<iframe>` tags can also fetch **pages** from another domain
-   Cross-origin **Requests (= AJAX)**: Malicious requests possible
    -   **Conditionally allowed only if they comply with the CORS (Cross-Origin Resource Sharing) policy due to security vulnerabilities**

## AJAX (Asynchronous JavaScript and XML)

What is AJAX? It supports asynchronous JavaScript for server communication, forming the foundation for technologies like axios and fetch, commonly used in frontend development to retrieve data from servers. Most major web browsers today incorporate the XMLHttpRequest (XHR) object to handle asynchronous data requests to servers. Although not a W3C standard, its implementation varies across browsers but universally relies on the XHR object. This XHR object allows requesting or receiving data from the server and updating only a portion of the page, even after the entire web page has loaded.

-   **AJAX** = **Asynchronous** HTTP data transfer = returns **results as an "object"**
    -   Transfers HTTP data in the background and receives results without affecting the current page.
-   **FORM** = **Synchronous** HTTP data transfer = returns **results as a "new page to navigate to"**, which is then rendered.
    -   Transfers HTTP data, receives a result page, and navigates to that page.

# Introduction of CORS - For Cross-origin AJAX Calls

AJAX can call any server, allowing it to fetch information from both same-domain servers and different domains. While it would be ideal if only developer-intended AJAX calls were possible, there's a vulnerability known as **CSRF (Cross-site Request Forgery)**, which involves tricking users into executing malicious scripts that trigger unwanted AJAX calls to other domain servers.

Due to such vulnerabilities, the SOP policy should block AJAX. However, despite AJAX not being a W3C standard, it's used as a de facto asynchronous standard, leading to the introduction of CORS as an exception policy. **The CORS policy provides a mechanism for cross-verification between the client (browser) and the server to determine if an AJAX call is intended, thereby preventing malicious AJAX requests.**

Adhering to the CORS policy permits Cross-origin calls via AJAX.

# CORS Policy Verification Procedure

**CORS is a mandatory HTTP policy included in the browser's implementation specification**, and like SOP, the browser determines whether the CORS policy is met. The browser **receives the response** from the server but **discards it if, after analysis, a CORS violation is detected**. Therefore, **this policy does not apply to server-to-server communication** that bypasses the browser.

-   CORS Policy Compliance - 3 Standard Headers
    1.  Allowed Origin
        -   **Origin** (Client)
        -   **Access-Control-<u>Allow</u>-Origin** (Server)
    2.  Allowed Method
        -   **Access-Control-<u>Request</u>-Method** (Client)
        -   **Access-Control-<u>Allow</u>-Method** (Server)
    3.  Allowed Header
        -   **Access-Control-<u>Request</u>-Headers** (Client)
        -   **Access-Control-<u>Allow</u>-Headers** (Server)

# Types of CORS Requests

Browsers classify AJAX calls into two types, applying different **CORS policy verification procedures**. This categorization appears to be for documentation purposes, and simply put, it can be understood as follows:

-   For any request, <u>(1) Allowed Origin</u> verification is mandatory.
-   If the Method is not GET, HEAD, or POST (with certain Content-types), <u>(2) Allowed Method</u> verification is required.
-   When using non-standard Custom Headers, <u>(3) Allowed Header</u> verification is required.

For a detailed understanding, let's examine the two types of combinations:

## Simple/Preflight Request

If the HTTP method used in AJAX is GET or HEAD, which are for simple retrieval and **cannot manipulate the server**, CORS verification is performed by **receiving the actual response and checking its included headers**. However, if the method **changes the server's state (POST, PUT, DELETE)** or **includes custom headers (e.g., for cookie storage)**, a **preflight request (Method = OPTIONS) is sent before the actual request** to perform CORS verification by receiving only headers, without the actual response body. **Once CORS verification is complete, the actual request is then sent to modify the server's state.**

### Simple Request

-   **Methods: GET, HEAD, POST (conditional)**
    -   For **POST** requests, the **Content-type** must be one of the following three:
        -   application/x-www-form-urlencoded
        -   multipart/form-data
        -   text/plain
-   **Custom Header: Not present**

Since these are Methods that **cannot manipulate the server**, the client sends the **actual request** and only verifies the match of <u>(1) Allowed Origin</u>.

-   (1) **Origin** === **Access-Control-<u>Allow</u>-Origin**

### Preflight Request

-   **Methods: POST, PUT, DELETE, etc., or GET/HEAD with custom headers**
-   **Custom Header: Present**

Since these are Methods that **can manipulate the server**, the client sends a **preflight request** instead of the actual request, and verifies the match of all three: <u>(1) Allowed Origin</u>, <u>(2) Allowed Method</u>, and <u>(3) Allowed Header</u>.

-   (1) **Origin** = **Access-Control-<u>Allow</u>-Origin**
-   (2) **Access-Control-<u>Request</u>-Method** = **Access-Control-<u>Allow</u>-Method**
-   (3) **Access-Control-<u>Request</u>-Headers** = **Access-Control-<u>Allow</u>-Headers**

## Credentials

**Credentials** refer to Cookies, Authorization Headers, or TLS client certificates. When a client requests by activating "**credential mode**" via `XMLHttpRequest.withCredentials` or the `credentials` option in the Fetch API `Request()` constructor, the server sends "**credential information headers**" containing values to the client. At this point, the server also indicates, via the "**CORS header**" below, whether the client can view the "**credential information header**" values. If this "**CORS header**" is `true`, the browser exposes the "**credential information headers**" to the client; if `false` or absent (defaulting to `false`), it discards all "**credential information headers**" and hides them from the client.

-   **Access-Control-<u>Allow</u>-Credentials** = true

It's important to note that for Credential requests, the `Access-Control-Allow-Origin` value in the CORS header **must not** be `*`. A specific domain, such as `a.com`, must be provided.

# Examining with Examples

## Simple Request

When an AJAX call is made from domain `a.com` to domain `b.com`:

-   If the Method is (1) GET, HEAD, or POST (conditional), and (2) **no** custom headers are present = **Simple Request**
    -   CORS policy only checks **Origin**
        -   (1) **Origin** === **Access-Control-Allow-Origin**

## Preflight Request

When an AJAX call is made from domain `a.com` to domain `b.com`:

-   If the Method is (1) GET, HEAD, or POST (conditional), but (2) custom headers **are present** = **Preflight Request**
-   If the Method is (1) DELETE = **Preflight Request**
    -   CORS policy checks **Origin/Method/Headers**
        -   (1) **Origin** = **Access-Control-Allow-Origin**
        -   (2) **Access-Control-Request-Method** = **Access-Control-Allow-Method**
        -   (3) **Access-Control-Request-Headers** = **Access-Control-Allow-Headers**

# Additional CORS-Related Response HTTP Headers

Unlike `Access-Control-Allow-Methods` or `Access-Control-Allow-Headers` which we've already examined, there are a few additional CORS-related headers that the server sends in its response, which I'll explain to conclude.

## Access-Control-Max-Age

For Preflight Requests, repeatedly sending and receiving `OPTIONS` preflight requests takes time before the actual result can be returned. Therefore, the server can specify how long the CORS response header values for preflight requests can be cached by the browser.

## Access-Control-Expose-Headers

While `Allow` in `Access-Control-Allow-Headers` signifies which headers the server **allows the client to send**, the `Expose` header explicitly defines **which headers sent by the server the browser is permitted to read**.

---

1.  [HomoEfficio : Cross Origin Resource Sharing - CORS](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
2.  [MDN : Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
3.  [MDN : Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
4.  [MDN : Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
5.  [Youtube : CORS in 100 Seconds](https://youtu.be/4KHiSt0oLJ0)