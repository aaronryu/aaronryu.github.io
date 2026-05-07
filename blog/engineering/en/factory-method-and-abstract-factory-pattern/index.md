---
title: "2. Factory 'Method' Pattern & 'Abstract' Factory Pattern"
category: ["Design Pattern", "Structural"]
created: 2019-02-22 02:33:46
deck: "When developing software, you often encounter situations where you need to process 'different flows based on state.' For a single state, like a simple 'yes' or 'no,' an `if` statement is sufficient. For multiple states, `if-else` or `switch` statements can be used. However, if the logic corresponding to these 'different flows' becomes complex, an `if-else` block might easily exceed 100 lines of code. Does this truly promote reusability? Not only does such code become difficult to read, but it will undoubtedly contain repetitive logic within those many lines. A pattern is needed to cleanly separate 'varying logic' from 'common logic,' where the varying part either returns or creates different implementations based on the current state."
abstract: "The process of returning an implementation based on a given state, where a function is the entity responsible for this return, is termed a Factory Method, and the corresponding design principle is the 'Factory Method Pattern.' Conversely, when the 'factory' responsibility is decoupled from the method itself, allowing the method to merely return a general category object, and the specific, state-dependent implementation is delegated to an Abstract Factory interface, this constitutes the 'Abstract Factory Pattern.' In essence, if a method orchestrates the state-dependent creation (factory logic), it's the Factory 'Method' Pattern; if an interface assumes this responsibility, it's the 'Abstract' Factory Pattern."
keywords: "Factory Method Pattern, Abstract Factory Pattern, Design Patterns, Object-Oriented Design, Dependency Inversion Principle, Creational Patterns, Code Reusability"
description: "This article provides a detailed explanation of the distinctions between the Factory Method Pattern, which encapsulates object creation based on state to avoid complex conditional statements (if-else), and the Abstract Factory Pattern, which enhances extensibility by delegating creation responsibility to an interface."
---

# What is a 'Factory'?

A factory, simply put, can be thought of as a vending machine. A 'beverage' vending machine will dispense 'beverages,' and a 'snack' vending machine will dispense 'snacks.' Since both the vending machine (`VendingMachine`) and the product (`Product`) are defined as interfaces, if you implement `Product` as a `Beverage`, then the `VendingMachine` should be implemented as a `BeverageVendingMachine`.

- Interface: 'Vending Machine' and 'Product'

```java
	VendingMachine machine;
	Product product;
```

- Class: 'Beverage Vending Machine' and 'Beverage'

```java
	VendingMachine machine = new BeverageVendingMachine();
	Product product = machine.get();
```

A factory, as shown above, means **__implementing based on the situation__**.

## What is a 'Factory Method'?

A factory method, as the name suggests, is a method that acts as a factory, **__implementing based on the situation__**. It's a function that returns a `Product` implementation depending on what kind of `Product` it is, corresponding to `machine.get()` in the example above.

# Factory Method Pattern

The Factory Method Pattern involves defining a 'factory method' within an interface and then creating concrete 'implemented factory methods' that return **__situation-specific implementation objects__** for various situations. Let's examine the benefits of using this pattern.

-   **To Avoid: Returning Products Based on State - Internalizing State**
    -   State management becomes difficult to maintain.
    -   Duplication in state management increases.
        -   Although this example only uses the `get` function, `if-else` statements would repeat as more functions are added.

```java
class VendingMachine {
	public Product get(String type) {
		if (type == "beverage") {
			return new Beverage();
		} else if (type == "snack") {
			return new Snack();
		}
	}
}
```

```java
	VendingMachine machine = new VendingMachine();
	Product product = machine.get('beverage');
```

-   **To Prefer: Returning Products Based on State - Externalizing State (Dependency Inversion)**
    -   Centralized state management (resolves maintainability and duplication issues).

```java
interface VendingMachine {
	public Product get();
}

class BeverageVendingMachine implements VendingMachine {
	public Product get() {
		return new Beverage();
	}
}

class SnackVendingMachine implements VendingMachine {
	public Product get() {
		return new Snack();
	}
}
```

```java
	VendingMachine machine = new BeverageVendingMachine();
	Product product = machine.get();
```

Within the `VendingMachine` interface, you simply need to implement how the factory method will return a specific implementation according to the situation. An implementation class for a no-longer-used situation can simply be deleted, and if additional situation-specific handling is needed, you just create a new class.

# Abstract Factory Pattern

Now, let's assume the variety of beverages is steadily increasing. If we use the Factory Method Pattern, a new class would be created every time. Is this really optimal? No matter how many types of beverages emerge, the category 'Beverage' itself doesn't change. Only the contents vary.

```java
interface VendingMachine {
	public Product get();
}

class FruitBeverageVendingMachine implements VendingMachine {
	public Product get() {
		return new FruitBeverage();
	}
}

class SparklingBeverageVendingMachine implements VendingMachine {
	public Product get() {
		return new SparklingBeverage();
	}
}

class TeaBeverageVendingMachine implements VendingMachine {
	public Product get() {
		return new TeaBeverage();
	}
}

...
```

`FruitBeverage`, `SparklingBeverage`, and `TeaBeverage` are all included in the 'Beverage' category, and in reality, the logic within these three internal classes would have only minor differences; most would be the same. If we create a generic `Beverage` class, we would only need to change the ingredients inside it. This solves the duplication problem of proliferating `...Beverage` classes as follows:

```java
interface VendingMachine {
	Maker maker;
	public Product get() {
		return new Beverage(maker);
	}
}

class FruitBeverageVendingMachine implements VendingMachine {
	Maker maker = new FruitBeverageMaker();
}

class SparklingBeverageVendingMachine implements VendingMachine {
	Maker maker = new SparklingBeverageMaker();
}

class TeaBeverageVendingMachine implements VendingMachine {
	Maker maker = new TeaBeverageMaker();
}

...
```

While the 'Factory Method Pattern' has a **factory "method" that returns __situation-specific implementation objects__**, the 'Abstract Factory Pattern' has a **method that simply returns a category object, and __situation-specific detailed implementation__ is delegated to an "abstract" factory interface**.

-   The 'Factory Method Pattern' returns implementation objects 1, 2, 3 depending on the situation.
-   The 'Abstract Factory Pattern' returns a Category A object,
    -   And the situation-specific implementation is delegated to the 'Abstract Factory Interface'.
        -   The method mechanically returns the object and doesn't need to know what it returns.
        -   In essence, the role of **situation-dependent creation/return** from the Factory Method Pattern has been further inverted via Dependency Inversion.

So, isn't proliferating `...Beverage` classes effectively the same as proliferating `...BeverageMaker` classes? Yes, it's effectively the same. But why is the responsibility for **situation-specific implementation** delegated to the abstract factory interface?

>   This is to allow `VendingMachine` to have only the role of providing products, while `BeverageMaker` shares the responsibility for product production.