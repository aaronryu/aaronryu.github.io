---
title: "The Diverse World of Open Source Licenses"
category: ["Development"]
created: 2019-08-10T06:31:23.000Z
updated: 2019-12-08T15:10:22.012Z
deck: "Open source doesn't simply mean 'free.' Using code from an open-source project might obligate you to release your entire project's source code, depending on its license. From GPL to MIT, we'll examine the key differences and restrictions of major licenses every developer should understand."
abstract: "This article compares and analyzes the core features of open-source licenses, ranging from the restrictive regulations of GPL, which inherits the spirit of free software, to the more permissive LGPL, and the public domain-like BSD and MIT licenses. We will delve into the practical implications of each license in a real-world development environment, focusing on commercial use and source code disclosure obligations."
keywords: "Open Source License, GPL, LGPL, MIT License, BSD License, Copyleft"
description: "An overview of major open-source licenses like GPL, LGPL, BSD, and MIT, explaining their differences and considerations for use, with a focus on commercial utilization and source code disclosure obligations."
---

# GPL (General Public License, GNU GPL)

The GPL is the progenitor of the free software philosophy, and as such, it is quite conservative (or "reciprocal").

> While typical proprietary licenses aim to restrict the freedom to share and modify software,
> the GPL is a regulation designed to guarantee the freedom to share and modify.

*   **Commercial use is permitted.**
*   However, if used publicly or commercially, **the software must be released for free.**
*   **No obligation to release for free during internal use** (personal, institutional, or organizational).
*   Even if only a portion of GPL code is used, **the entire derivative work falls under the GPL license.**

# LGPL (Lesser General Public License, GNU LGPL)

A major drawback of the GPL is its "viral" nature: simply using a GPL-licensed library means the entire derivative work becomes subject to the GPL, requiring its source code to be disclosed even if commercial use is allowed.

> To prevent developers from avoiding GPL libraries for this reason
> and to encourage contributions to open source, the FSF (Free Software Foundation)
> does not enforce the disclosure clause unless the code itself is modified.

*   **Essentially similar to GPL.**
*   When simply **using LGPL code, there is no obligation to disclose it for free.** Only attribution of its use is required.
*   When **modifying and using LGPL code, it must be released for free.**

# BSD (Berkeley Software Distribution) License & MIT License

The Unix-like operating system BSD was once sued by AT&T's Bell Labs, the original creators of Unix. Following this, BSD created and distributed a license that contained no copyright provisions other than requiring attribution of the source code author's name. The MIT License is very similar to BSD, so it's grouped here.

*   Considered the **public domain equivalent** in the software world.
*   **Permits modification** + **free use.**
*   **No obligation for disclosure.**

From the original 4-clause version, clauses were successively removed, leading to 3-clause and 2-clause versions.

## 4-Clause : Original

*   **Mandatory attribution of the original copyright holder** in advertisements.
*   **Prohibition of attributing secondary copyright holders** in advertisements.

## 3-Clause : BSD License 2.0

*   <del>Mandatory attribution of the original copyright holder in advertisements</del> (Removed).
*   **Prohibition of attributing secondary copyright holders** in advertisements.

## 2-Clause : FreeBSD License

*   Obligation to include the BSD license text and the original and secondary copyright holders in the product.

# Apache License

The preceding BSD License, with its public domain-like clauses, does not allow claiming any patents on derivative works. However, the Apache License permits patentees to claim patents on their derivative works.

> The Apache License allows you to utilize its code to create a derivative work and then patent that derivative work. However, if you do so, that derivative work should no longer be licensed under the Apache License.

*   **No obligation for disclosure.**
*   **Patent applications for derivative works are possible.**
    *   However, you must state whether modifications were made and include the Apache Foundation's name and the license text.

---

I've summarized these for a basic understanding. However, the most fascinating aspect is undoubtedly the history behind "why" and "how" each license came to be. The first reference link below provides a more detailed explanation, which you might find very helpful.

---

*   https://meetup.toast.com/posts/101
*   http://wiki.kldp.org/wiki.php/OpenSourceLicenseGuide
*   https://en.wikipedia.org/wiki/BSD_licenses
*   https://en.wikipedia.org/wiki/MIT_License

---