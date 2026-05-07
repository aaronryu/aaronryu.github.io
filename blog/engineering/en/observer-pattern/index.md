---
title: "5. Observer Pattern"
category: ["Design Pattern", "Observer"]
created: 2019-02-27T13:23:42.000Z
updated: 2020-07-06T12:16:29.257Z
deck: "How do you track the frequently changing state of variables? Beyond simply checking manually, we explore an efficient mechanism for exchanging state changes in real-time while minimizing dependencies between objects."
abstract: "Understand the operating principles of the publish-subscribe model centered around the Observable and Observer interfaces, learn the differences between Push and Pull data delivery methods, and grasp design principles for reducing coupling between objects."
keywords: "Observer Pattern, Publish-Subscribe Model, Loose Coupling, Push vs Pull"
description: "This article details the structure of the Observer Pattern for efficiently detecting and communicating state changes, and the principle of 'loose coupling' that reduces dependencies between objects."
---

# Variables

When we first learn programming, we start with variables. Values that do not change are called constants, while the values of variables change frequently. Because variables can change constantly, they literally go through many challenges throughout the program's lifecycle.

# State

As mentioned above, variables can have many different states. There are two ways to know the state of these variables.

## Push Method

> **Automatic**: The **variable** itself **notifies** us when its state has changed.

## Pull Method

> **Manual**: **We** actively **check** if the variable's state has changed.

Being notified automatically might seem the most convenient, but it would be quite annoying if a variable kept telling us its state even when we don't need to know. Resources for continuously tracking that state would also be unnecessarily wasted. In such cases, a manual method, where we can check the state only when needed, is also necessary. These are somewhat formally referred to as Push and Pull methods. If we consider the **state of a variable as a 'topic'**, then the way we learn about its state is divided into whether **it notifies us (Push method)** or **we actively check (Pull method)**.

# Observer Pattern

> The Observer Pattern is a design pattern that allows us to know the state of a variable (using either the Push or Pull method as desired).

![Observer Shorthand](../../ko/observer-pattern/observer-depicted.svg)

Typically, when explaining this pattern, the state is considered a 'topic' and it's described as a Publish-Subscribe model. However, since the pattern's name is Observer Pattern, to avoid confusion, I will explain it using only two terms: **Observer** and **Observable**, rather than the publish-subscribe model terminology. As mentioned earlier, there are only two types of interfaces in the Observer Pattern. One is the **Observable, which possesses the state**, and the other is the **Observer, which intends to view the state**.

## Observable

Looking at the Observer Pattern diagram above, the Observable interface has two pieces of information:

- State = state
- Observers = list of observers

It's important not to misunderstand: the Observable interface doesn't *is* the state itself, but *has* the state. The term 'Observable' signifies that it 'has' the state, meaning that **an Observer can 'observe' the state through this Observable interface**. Furthermore, an Observable manages the Observers that want to be notified of or check its state in a list (though other data structures are also possible). This allows it to decide, **for the Push method, to whom the state should be sent?** And, **for the Pull method, who is allowed to view the state?**

- Observable Interface

```java
interface Observable {
    protected List<Observer> observers; // In Java, this would typically be an instance variable in an implementing class.
    public void registerObserver(Observer o);
    public void removeObserver(Observer o);
    public void notifyObserver(Object obj);
}
```

- Observable Implementation

```java
class StateObservable implements Observable {
    private State state; // Assuming 'State' is a defined class or type
    private List<Observer> observers = new ArrayList<>(); // A common way to manage observers

    public void changeState() { /* State changes. */ }

    @Override
    public void registerObserver(Observer o) { /* Add observer */ observers.add(o); }
    @Override
    public void removeObserver(Observer o) { /* Remove observer */ observers.remove(o); }
```

- Push-style `notifyObserver` implementation where Observable notifies Observers

```java
    // This method is for the Push model. The 'State' type is often used here.
    public void notifyObserver(State state) { /* 2. Transmit 1. the state to each observer in the observer list. */
        for (Observer o : observers) {
            // Assuming the Observer has an 'update' method to receive the state.
            // o.update(state);
        }
    }
}
```

- Pull-style `notifyObserver` implementation where Observable is read by Observers

```java
    // In a pure Pull model, observers actively poll, so this method typically does nothing
    // or acts as a generic notification for observers to pull data.
    @Override
    public void notifyObserver(Object obj) { /* Does nothing. */ }
    public State getState() { /* Observers can call this method to retrieve the state. */ return state; }
}
```

## Observer

Without much elaboration, the Observer is an interface for **intending to view a state**. As it is an interface, if you wish to view and utilize the relevant information, you can implement and use it in any way that suits your intent.

- Observer Interface

```java
interface Observer {
    protected Observable observable; // In Java, this would typically be an instance variable in an implementing class.
    public void getStateFromObservable(); // This method indicates a Pull mechanism.
}
```

- Observer Implementation

```java
class StateObserver implements Observer {
    private State state;
    private Observable observable;

    public StateObserver(Observable observable) {
        this.observable = observable;
        this.observable.registerObserver(this);
    }

    // This method is commonly used in a Push-style update,
    // although the Observer interface here defines getStateFromObservable().
    public void update(State state) { // Assuming State type, often called by Observable.notifyObserver()
        this.state = state;
    }

    @Override // Implementation for the Pull model as per the interface
    public void getStateFromObservable() {
        // This is where the observer pulls the state using its observable reference.
        // Example: this.state = observable.getState();
    }
}
```

Why was `StateObserver` added by passing the `Observable` into its constructor and registering it there, instead of using `Observable.getObservers().add(new StateObserver())`?

> By not calling `Observable.getObservers()`, the observer list is never exposed outside the Observable.

---

Why was the Observer Pattern formally defined as a pattern? It might seem unnecessarily complex. Its significance lies in the fact that the two interfaces, Observable and Observer, can exchange data without needing to know anything about each other's implementations. To elaborate further, it's as follows:

> The principle is to keep both the state held by the Observable and the observer table unexposed to the outside world, allowing only the observers to be aware of them.
> This aligns with the principle: "Objects that interact with each other should be as loosely coupled as possible."

I hope this was well understood. We will conclude today's design pattern discussion here.

---