---
title: "2. ファクトリ「メソッド」パターン & 「抽象」ファクトリパターン"
category: ["Design Pattern", "Structural"]
created: 2019-02-22 02:33:46
deck: "開発を進めていると、「状態に応じて異なるフロー」を処理しなければならない場面に遭遇することがあります。単に「はい/いいえ」のような単一の状態であれば`if`文で十分ですが、複数の状態がある場合は`if-else`または`switch`を使用するでしょう。しかし、「異なるフロー」に該当するロジックが複雑になると、`if-else`のブロックが100行を超えるコードになることも珍しくありません。これは果たして再利用性が高いと言えるでしょうか？コードが読みにくいだけでなく、その100行の中に繰り返し現れるロジックも間違いなく存在するはずです。「異なるロジック」と「共通ロジック」を分離し、「異なるロジック」の部分は状態に応じて異なる実装を返したり、実装を作成したりするパターンが必要となります。"
abstract: "状態に応じた実装を返すこと、そしてその実装を返す主体が関数である場合、これをファクトリメソッドと呼び、そのデザイン原則を「ファクトリメソッドパターン」と称します。一方、ファクトリメソッドから「ファクトリ」としての役割を切り離し、メソッドが単に汎用的なカテゴリオブジェクトを返すだけに留め、状況に応じた具体的な実装を抽象ファクトリインターフェースに委譲したものが「抽象ファクトリパターン」です。要するに、状況に応じた実装（ファクトリロジック）をメソッドが行うのがファクトリ「メソッド」パターンであり、インターフェースがその責任を負うのが「抽象」ファクトリパターンなのです。"
keywords: "ファクトリメソッドパターン, 抽象ファクトリパターン, デザインパターン, オブジェクト指向設計, 依存性逆転の原則, 生成に関するパターン, コード再利用性"
description: "本記事では、複雑な条件分岐（if-else）の代わりに状態に応じたオブジェクト生成をカプセル化するファクトリメソッドパターンと、生成の責任をインターフェースに委譲することで拡張性を高める抽象ファクトリパターンの違いを詳細に解説します。"
---

# 「ファクトリ」とは何か？

ファクトリとは、単純に自動販売機を考えると分かりやすいです。「飲み物」の自動販売機からは「飲み物」が出てきて、「お菓子」の自動販売機からは「お菓子」が出てきます。自動販売機（VendingMachine）と商品（Product）はどちらもインターフェースで定義されているため、「商品（Product）」を飲み物として実装すれば、「自動販売機（VendingMachine）」は飲み物自動販売機として実装すれば良いのです。

-   インターフェース：「自動販売機」と「商品」

```java
	VendingMachine machine;
	Product product;
```

-   クラス：「飲み物自動販売機」と「飲み物」

```java
	VendingMachine machine = new BeverageVendingMachine();
	Product product = machine.get();
```

ファクトリとは、上記のように**__状況に応じて実装する__**ことを指します。

## 「ファクトリメソッド」とは何か？

ファクトリメソッドは、文字通り**__状況に応じて実装する__**ファクトリの役割を担うメソッドです。どのようなProductであるかに応じてProduct実装を返す関数で、上記の例では`machine.get()`に該当します。

# ファクトリメソッドパターン

ファクトリメソッドパターンは、インターフェース内に定義されている「ファクトリメソッド」を、**__状況に応じた実装オブジェクト__**を返すように、状況に合わせて具体的な「実装ファクトリメソッド」を作成するものです。これを使用することで得られるメリットを見てみましょう。

-   **非推奨：状態に応じた商品返却 - 状態の内部化**
    -   状態管理の保守性が低下します。
    -   状態管理の重複が増加します。
        -   本例では`get`関数のみを使用していますが、関数が増えるにつれて`if-else`文は繰り返されるでしょう。

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

-   **推奨：状態に応じた商品返却 - 状態の外部化（依存性逆転）**
    -   状態管理の一元化（保守性、重複性の解決）

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

`VendingMachine`インターフェース内のファクトリメソッドを、状況に合わせてどのような実装を返すか実装すれば良いだけです。もう使用しない状況の実装クラスは単に削除すればよく、追加の状況に応じた処理が必要な場合はクラスを作成するだけで済みます。

# 抽象ファクトリパターン

ところで、飲み物の種類がますます多様になると仮定しましょう。ファクトリメソッドパターンを使用した場合、次のように毎回クラスが生成されますが、このままで本当に良いのでしょうか？どんなに多くの種類の飲み物が生まれても、結局「飲み物（Beverage）」という分類は変わりません。ただ中身が変わるだけです。

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

`FruitBeverage`、`SparklingBeverage`、`TeaBeverage`はすべて飲み物という分類に含まれ、実際に3つの内部クラスのロジックはわずかな違いしかなく、ほとんどが同じでしょう。`Beverage`という汎用的な飲み物クラスを作成し、その中に入れる材料だけを変えれば良いはずです。そうすることで、`...Beverage`クラスが量産されるという重複を以下のように解決します。

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

「ファクトリメソッドパターン」は**ファクトリ「メソッド」が__状況に応じた実装オブジェクト__を返す**のに対し、「抽象ファクトリパターン」は**メソッドはカテゴリオブジェクトを単に返すだけで、__状況に応じた詳細な実装__は「抽象」ファクトリインターフェースに委譲**したものです。

-   「ファクトリメソッドパターン」は状況に応じて1、2、3の実装オブジェクトを返し、
-   「抽象ファクトリパターン」はAカテゴリのオブジェクトを返し、
    -   状況に応じた実装を「抽象ファクトリインターフェース」に委譲したものです。
        -   メソッドは機械的にオブジェクトを返すだけで、何を返すかを知る必要がありません。
        -   ファクトリメソッドパターンにおける**状況に応じた生成/返却**の役割を、さらに依存性逆転によって担わせたと言えます。

しかし、`...Beverage`クラスが量産されるのと`...BeverageMaker`クラスが量産されるのは、実質的に同じことではないでしょうか？はい、同じです。では、なぜわざわざ**状況に応じた実装**の責任を抽象ファクトリインターフェースに委譲したのでしょうか？

>   `VendingMachine`は製品を提供する役割だけを持ち、製品生産に関する責任は`BeverageMaker`が分担するためです。