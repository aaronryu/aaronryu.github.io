---
title: "0. オブジェクト指向プログラミングにおける第1、第2原則"
category: ["Design Pattern"]
created: 2018-12-30T00:13:33
deck: "筆者の大学時代、オブジェクト指向プログラミングは多態性と継承だけでした。企業で開発を経験し深く実感し学んだことは、オブジェクト指向プログラミングは、当然ながら学問ではなく実践であるということです。デザインパターンを学習するにあたり、なぜOOPの第1、第2原則を扱うのか疑問に思うかもしれません。デザインパターンは「オブジェクト指向パラダイムにおいて、より良いコードとは何かについての考察の結果」です。これを学習する前にオブジェクト指向プログラミングの原則を知っておくことで、様々なデザインパターンの意義を正しく体得することができます。"
abstract: "学校でOOPを初めて学ぶ際に触れる「継承」は、学問上の順序で最初に習うというだけで、実際の産業では最も避けるべきアンチパターンです。本稿では、「継承」をどのように、なぜ避けるべきかについて、第1、第2原則を通じて説明します。"
image: {
	url: ../../ko/two-principles-on-oop/composition-vs-inheritance.png,
	alt: "コンポジション vs 継承"
}
keywords: "オブジェクト指向, OOP原則, 継承よりコンポジション, インターフェース, 多態性, デザインパターン"
description: "継承の限界を克服するため、インターフェースとコンポジションを活用し、柔軟で拡張性のあるオブジェクト指向コードを設計する二つの核心原則を紹介します。"
---

# 継承＝オブジェクト指向プログラミング？

開発者が初めてエンタープライズオブジェクト指向プログラムを作成すると仮定してみましょう。学校で学んだ通りであれば、**オブジェクト指向プログラミングはまさに継承だ**と教わったように、果敢に親クラスを作成し、それを継承した子クラスを活用するでしょう。コードは下記のHead-First本の例のようになるはずです。

## 最初に学んだ継承

- **親クラス + 親関数**

```java
class Duck
	{ swim(), display(), fly(), quack() }
```

- **親クラス + 親関数拡張 = 子クラス**

```java
class RedHeadDuck extends Duck
	{ swim(), display(), fly(), quack() }

class RubberDuck extends Duck
	{ swim(), display(), fly(){ null }, quack() }
```

継承を使用すると、親のDuckクラスにあるすべての関数を子Duckクラスがすべて持つことになります。問題点は、親から継承を受けると資産と負債を共に受け取るように、**子Duckクラスは自身の意思とは関係なく、持ちたくないすべての親関数を持ったまま拡張しなければならない**という点です。これは開発において不要な制約を招くことになります。

これを解決するために、**「分離可能な最小単位の関数」をインターフェースとして定義し、開発しようとしているクラスに必要な関数を持つインターフェースを選択して拡張すれば良い**のです。

## 継承の代わりにインターフェース

- **「振る舞い単位」インターフェース**

```java
interface Flyable { fly() }
interface Quackable { quack() }
```

- **「振る舞い単位」インターフェースの組み合わせと実装**

```java
class RedHeadDuck implements Flyable, Quackable {
	fly() { ... }
	quack() { ... }
}

class RubberDuck implements Quackable {
	quack() { ... }
}
```

これにより、**親クラスに属していた振る舞いをインターフェースに細分化し、実装クラスには必要な振る舞いだけを付与できるようになりました**。しかし、「振る舞い単位」インターフェースを選択して拡張する際、**毎回実装しなければならないという問題**があります。開発者は面倒くさがりな民族ではないでしょうか。毎回実装するのが面倒なので、**「振る舞い単位」インターフェースを「振る舞い単位」クラスとして事前にすべて実装しておき、その「振る舞い」を選択的に利用する**という境地に達します。

## インターフェースの「実装」ではなく「コンポジション（構成）」

- **「振る舞い単位」インターフェース**

```java
interface Flyable { fly() }
interface Quackable { quack() }
```

- **「振る舞い単位」クラス（インターフェース実装）**

```java
class NotFlyable implements Flyable { fly() { ... } }
class SuperFlyable implements Flyable { fly() { ... } }
class ShoutQuackable implements Quackable { quack() { ... } }
class QuiteQuackable implements Quackable { quack() { ... } }
```

- **「振る舞い単位」クラスの組み合わせ**

```java
class RedHeadDuck {
	interface Flyable = new SuperFlyable();
	interface Quackable = new ShoutQuackable();
	doFly() { Flyable.fly() }
	doQuack(){ Quackable.quack() }
}

class RubberDuck {
	interface Flyable = new NotFlyable();
	interface Quackable = new QuiteQuackable();
	doFly(){ Flyable.fly() }
	doQuack(){ Quackable.quack() }
}
```

毎回インターフェースを実装するのではなく、事前に実装されているインターフェースの実装体をH選択的に構成することになります。これにより、望む振る舞いインターフェースの実装を自由に付け替えたり、交換したりできるようになりました。このようにして、インターフェースは大学で習ったクラスのテンプレートであるという概念を超え、**振る舞いや特性を実装したクラスを格納できる一つの「変数」**と捉えると良いでしょう。これこそが、私たちが**多態性（ポリモーフィズム）**を学んだ理由でもあります。

# オブジェクト指向プログラミングにおける第1、第2原則

上記で述べた内容は、結局以下の二つの原則に短くまとめられます。

## 「クラス - 継承」よりも「インターフェース - コンポジション」を使用せよ

> 「継承」は、親クラスが持つすべてを必要性に関係なく受け継ぐことになります。まるでレゴのように、望む実装を選択的に持つ「コンポジション」の方が、より高い拡張性を提供します。

## 「具象クラス」よりも「インターフェース」で構成せよ

> 実装はいつでも変更される可能性があります。クラス内のロジックを構成する際は、具象クラスではなくインターフェースを通じて柔軟に構成しましょう。

- **X 避けるべき: 「具象クラス」で構成**

```java
class RedHeadDuck {
	class SuperFlyable; // [!code highlight]
	class ShoutQuackable; // [!code highlight]
	doFly() { SuperFlyable.fly() }
	doQuack(){ ShoutQuackable.quack() }
}
```

- **O 推奨: 「インターフェース」で構成 - いつでも「具象クラス」を差し替え可能**

```java
class RedHeadDuck {
	interface Flyable = new SuperFlyable(); // [!code highlight]
	interface Quackable = new ShoutQuackable(); // [!code highlight]
	doFly() { Flyable.fly() }
	doQuack(){ Quackable.quack() }
}
```