---
title: "Regular Expressions Explained in One Page"
category: ["Development"]
created: 2019-12-14T17:32:23.000Z
updated: 2019-12-15T02:47:00.230Z
deck: "Regex, which often appears as an arcane language, is in fact an essential tool for developers, proving useful for a lifetime once mastered. From log analysis to data validation, we explore an efficient syntax system that solves complex text pattern matching encountered in real-world scenarios with just a single line of expression."
abstract: "This article introduces the use cases and fundamental principles of Regular Expressions, a core skill for developers. It systematically organizes methods for searching complex patterns using symbols, covering basic syntax for explicitly specifying words, extended syntax such as character types (e.g., \\d, \\D), position anchoring, repetition control, and grouping (capturing)."
keywords: "Regular Expression, Regex, Pattern Matching, Text Analysis, Development Productivity"
description: "This one-page summary explains the core syntax and key applications of Regular Expressions, widely used in various development environments including log analysis, web crawling, and data validation."
---

The Google Tech Lead YouTuber, whom I personally admire, once uploaded a video about several essential skills every developer should know:

-   Regular Expressions
-   SQL
-   Debugging Skills (Problem Solving)
-   Tooling Language
-   Anti-Social Skill

Among these, today's topic is **Regular Expressions**, mentioned first. Number 5 seems like a bit of an outlier; I believe developers communicate more than they code, so it might not be the best strategy. Even during my undergraduate years, I often noted down "study Regular Expressions later," but I never truly memorized them, always looking them up when needed. I recently organized them, and it turns out they're easier to remember when categorized like grammar rules. Indeed, as the Tech Lead mentioned, Regex is widely used in development. It's used for text searching, or more precisely, pattern matching, and has numerous use cases such as:

-   Log/text analysis via `grep`
-   Searching code/directories you are developing
-   Pre-commit code checking
-   Web crawling
-   URL parsing
-   Value/format validation

Regex often appears like a cipher or an alien language before you study it. This is because while common languages express semantics through words or their combinations, Regex maps semantics to individual characters, similar to a cryptographic system. However, classifying its syntax as shown below greatly aids in mastering regular expressions.

![One Page Explain for Regular Expression](../../ko/one-page-for-regular-expression/one-page-explain-for-regular-expression.png)

Fundamentally, Regular Expressions are used to search for specific words. While there's a method to **1. explicitly specify a particular word** you want to find, you can also **2. specify words as combinations of characters or numbers**. Regular Expressions provide both approaches.

# Basic Syntax

You can simply specify the exact word you want to search for.
If you want to search for multiple words at once, **you can include several words within parentheses `()` separated by `|`.**

## Character Sets

To specify particular characters, you can use a similar approach to specifying words, but **`[]` allows you to find multiple characters, and within `[]`, you can add rules for ranges like A to Z (`A-Z`) or exclude specific characters.**

## Character Types

If you want to search for numeric characters, `[0-9]` is good, as learned above, but you can also specify a 'numeric' character type. The backslash `\` is used to specify character types. For example, the **'numeric' character type can be expressed as `\d`**, and the **'non-numeric' character type can be indicated with a capital `\D`**.

# Advanced Syntax

## Anchors (Positions)

Used when you want to find a specific word or character only if it appears at the very beginning or very end of a string/line.

## Quantifiers (Repetition)

You can **specify how many times a particular word or character should be repeated** for a match.

> (abc){1} = abc (exactly one occurrence)<br>
> (abc){1,3} = abc, abcabc, abcabcabc (one to three occurrences)<br>
> (abc)? = (empty string), abc (zero or one occurrence)<br>
> (abc)+ = abc, abcabc ... (one or more occurrences)

## Capturing = Grouping

As explained earlier, it's used to group words for pattern searching or to save matched results when you intend to use those results.

---

Once learned, regular expressions are universally applicable across all programming languages and environments, offering immense utility due to the vast number of use cases in development. By organizing it this way, I should now be able to use it effectively without having to look it up every time.

---