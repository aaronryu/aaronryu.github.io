---
title: "Development Log - iOS Architecture Patterns: MVC, MVVM, VIPER"
category: ["Language", "iOS, Swift"]
created: 2019-06-29T05:20:40.000Z
updated: 2019-12-08T16:26:22.848Z
deck: "iOS development, while similar to web development, has a unique characteristic: the strong coupling of View and Controller. This post explores how to evolve architecture to prevent the 'Massive ViewController' problem as projects grow, and to enhance code reusability and maintainability."
abstract: "This article analyzes the application of the MVVM pattern, introduced to overcome the limitations of the initial MVC pattern, and the structure of the VIPER pattern (Presenter, Interactor, Entity, Router), chosen for a clearer division of roles. It details the specific responsibilities of each component and the differences in development efficiency resulting from architectural changes."
keywords: "iOS architecture, MVC, MVVM, VIPER, design patterns, software design, Swift"
description: "Based on practical experience, this article explains the journey from MVC to MVVM, and then to the more granular VIPER pattern, to address the strong coupling between View and Controller in iOS app development, detailing the characteristics of each pattern."
---

In many ways, iOS app development bears a strong resemblance to web application development. However, similar to .NET WebForms, the View and Controller are tightly coupled, which means you cannot easily separate the React.js rendering (frontend) logic from the Controller that delivers view data. When I first started building Swift apps, I initially tried to develop them in the same way as web applications, thinking that an app is essentially a model similar to a web page. I applied my limited experience with MVC and MVVM as a starting point.

# MVC / MVVM

When building traditional web applications, I typically categorized server-side work into Controller, Application, Service, and Repository layers. HTML and JavaScript belonged to the View, data-level components like JPA were in the Model, and all business logic utilizing the Model, along with the intermediate layer handling POST/GET communication with the View for events, resided in the Controller. In web applications, the MVC Controller effectively acts as a ViewModel. It doesn't directly render the View but rather delivers a ViewModel that enables rendering, with the client-side engine (e.g., a Single Page Application framework) handling the actual rendering. Popular frontend frameworks like the various `.js` libraries utilize this pattern.

## The Massive Controller Problem in iOS App Development

When I tried to directly apply the MVVM pattern in iOS, I encountered an error. **The core issue is that `View.storyboard` and `ViewController.swift` essentially constitute a single View.** Unlike the typical separation of frontend and backend codebases (e.g., JS for frontend, Java for backend), iOS Swift handles all View logic within `.swift` files. Although `ViewController.swift` carries the name "Controller," it actually functions as the View, while `View.storyboard` can be seen as encompassing CSS/HTML and router concepts.

Swift is fundamentally an MVC pattern. However, due to the nature of the language, it seems necessary to differentiate it slightly from the MVC of web applications. **In Swift, because the Controller effectively acts as the View, the rendering logic resides within the Controller.** Even with well-modularized Service and Repository layers, the Controller ends up containing not only view rendering logic but also 'some' business logic related to data manipulation required for view rendering. **This problem is commonly referred to as the Massive Controller.**

# MVC Pattern Used in Initial Development

My first Swift code, applying MVC directly, looked like this: I would receive data (Model) for various assets like bars, generate statistical data (business logic), and then inject that into the View for rendering. As you can see, even for a simple **UIView, it contains not only the logic for drawing the View but also logic related to the ViewModel.**

![MVC Code](../../ko/ios-design-patterns/mvc-code.png)

# MVVM Pattern Used During Refactoring

When a Controller grows too large, an unconscious sense of unease arises. As I wrote the code, I often felt it wasn't the right approach, so I proceeded with refactoring. **This involved placing a ViewModel, which acts as the 'true' Controller in this context, underneath the ViewController, which effectively functions as the View.** Elements like shape, color, and size would remain in the ViewController, and the necessary ViewModel would be provided by a ViewModelController. In the example below, the ViewController effectively uses only the ViewModel, `mockBudgets`. While Rx is often used for binding the View (Controller) and ViewModel (Controller), I haven't yet implemented this.

![MVVM Code](../../ko/ios-design-patterns/mvvm-code.png)

# VIPER Pattern Currently Used in Development

Since this is a personal project, I work on it whenever I have time, and I found that after a few days or weeks, my own code felt completely new to me. Each time I resumed development or made progress, the time spent re-reading and understanding the code grew longer. I realized that the code components lacked specific and clear responsibilities. Of course, the Service and Repository level codes were well-organized and didn't pose a problem, but the View always gave me trouble, no matter how much I tried to adapt. Especially since I was learning Swift for the first time and building my first application.

## The VIPER Pattern

**VIPER can essentially be seen as a 'dualization' of the ViewModel.** It's easier to understand it as further subdividing the existing business logic into two categories: business logic related to the View, and business logic closer to the Model data level, including logging and network instance management. We call the former the **Presenter** and the latter the **Interactor**. This expanded the components from three to four. Additionally, a Router was added to handle screen transitions between ViewControllers, such as segues, bringing the total to five components.

In my existing code, the Model was already well-organized, meaning this part was already separated into Entity and Interactor. I had also tried my best not to put Model-related logic into the ViewModel. **When I moved the View-related business logic, which was previously concentrated in the ViewController, to the Presenter, I realized just how much ViewModel logic had been crammed into the original View.** Furthermore, screen transition (segue) handling was also managed by the existing ViewController. However, from a meta-perspective, coordinating transitions between ViewControllers correctly belongs to a higher-level component. I had wondered how to centralize the repetitive boilerplate code for segue navigation that each ViewController held, and the VIPER Router provided the answer.

I implemented this, but with five components, the boilerplate code becomes quite extensive. It was tedious, but I applied it for the sake of future productivity. I'm still unsure about its full effect. There also seems to be a concept called ReSwift (Redux on Swift). Having briefly used React.js, where components typically have only one or two layers, I didn't find a strong need to apply Redux then, so I haven't learned it yet. I'll have to consider implementing it later. Although it would be great to apply new architectural patterns or the latest trendy solutions, even for a personal project, rapid deployment is likely more crucial.