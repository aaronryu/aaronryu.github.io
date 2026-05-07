---
title: "5. オブザーバーパターン"
category: ["Design Pattern", "Observer"]
created: 2019-02-27T13:23:42.000Z
updated: 2020-07-06T12:16:29.257Z
deck: "頻繁に変化する変数の状態をどのように追跡するのでしょうか？単に手動で確認するだけでなく、オブジェクト間の依存関係を最小限に抑えながら、状態の変化をリアルタイムでやり取りする効率的なメカニズムを考察します。"
abstract: "ObservableとObserverインターフェースを中心とした発行-購読モデルの動作原理を理解し、データ伝達方式であるPushとPullの違い、およびオブジェクト間の結合度を下げるデザイン原則を学習します。"
keywords: "オブザーバーパターン, 発行-購読モデル, 疎結合, プッシュとプル"
description: "状態変化を効率的に検知し伝達するためのオブザーバーパターンの構造と、オブジェクト間の結合度を下げる「疎結合」の原則について詳しく解説します。"
---

# 変数

プログラミングを初めて学ぶとき、私たちはまず変数について学びます。変わらない値は定数（Constant）と呼ばれ、変数（Variable）の値は頻繁に変化します。変数は頻繁に変化するため、文字通りプログラム全体を通して様々な状況を経験します。

# 状態

変数は上記で述べたように、本当に多様な状態を持ちます。このような変数の状態を知るためには、二つの方法があります。

## Push方式

> **自動**: **変数が**自身の状態が変わったことを私たちに**知らせます**。

## Pull方式

> **手動**: **私たちが**変数の状態が変わったかどうかを直接**調べます**。

自動で私たちに知らせてくれるのが最も便利に見えるかもしれませんが、特に知る必要がないのに常に自身の状態を伝え続けてくるのであれば、非常に煩わしいでしょう。その状態を継続的に追跡するためのリソースも不必要に浪費されることになります。そのような場合は、私たちが必要なときにだけ状態を確認できる手動の方法も必要です。これを少々堅苦しい言い方でPush方式とPull方式と呼びます。**変数の状態を一つの「主題」**と見なすと、その主題を中心に**私たちに知らせてくれるのか（Push方式）**、それとも**私たちが調べるのか（Pull方式）**によって、状態を知る方法が分かれるのです。

# オブザーバーパターン

> オブザーバーパターンは、変数の状態を（PushとPullの中から選択した方式で）知ることができるパターンです。

![Observer Shorthand](../../ko/observer-pattern/observer-depicted.svg)

一般的にこのパターンを説明する際、状態を「主題」と見なし、Publish-Subscribe（発行-購読）モデルとして説明されることがあります。ここでは、パターン名がオブザーバーパターンであるため、混乱を避けるために購読モデルではなく、**Observer**と**Observable**の二つの用語のみで説明します。オブザーバーパターンには、先に述べた通り、ちょうど二種類のインターフェースしか存在しません。一つは**状態を持っているObservable**、もう一つは**状態を見ようとするObserver**です。

## Observable

上記のオブザーバーパターン図を見ると、Observableインターフェースは二つの情報を持っています。

- State = 状態
- Observers = Observerリスト

誤解してはならない点は、Observableインターフェースが状態そのものではなく、状態を「持っている」ということです。状態を持っているという意味でObservable、つまり**ObserverはこのObservableインターフェースを通じて状態を「見ることができる」**という意味なのです。そしてObservableは、状態を知らせる/調べようとするObserverたちをリスト（もちろん他のデータ構造も可能です）で管理し、**Push方式の場合は状態を誰に送るのか？** そして**Pull方式の場合は状態を誰だけが見ることができるのか？** を決定できます。

- Observableインターフェース

```java
interface Observable {
    protected List<Observer> observers; // Javaでは、これは通常実装クラスのインスタンス変数となる。
    public void registerObserver(Observer o);
    public void removeObserver(Observer o);
    public void notifyObserver(Object obj);
}
```

- Observable実装

```java
class StateObservable implements Observable {
    private State state; // 'State'は定義済みのクラスまたは型と仮定
    private List<Observer> observers = new ArrayList<>(); // 一般的なObserver管理方法

    public void changeState() { /* 状態が変更されます。 */ }

    @Override
    public void registerObserver(Observer o) { /* オブザーバーを追加 */ observers.add(o); }
    @Override
    public void removeObserver(Observer o) { /* オブザーバーを除外 */ observers.remove(o); }
```

- ObservableがObserverに知らせるPush方式のnotifyObserver実装

```java
    // このメソッドはPushモデル用です。ここで'State'型がよく使われます。
    public void notifyObserver(State state) { /* 2. オブザーバーリストの各オブザーバーに1.状態を送信 */
        for (Observer o : observers) {
            // Observerが状態を受け取るための'update'メソッドを持っていると仮定。
            // o.update(state);
        }
    }
}
```

- ObservableがObserverに読み取られるPull方式のnotifyObserver実装

```java
    // 純粋なPullモデルでは、オブザーバーが積極的にポーリングするため、このメソッドは通常何も行いません
    // または、オブザーバーにデータをプルするように促す一般的な通知として機能します。
    @Override
    public void notifyObserver(Object obj) { /* 何もしません。 */ }
    public State getState() { /* オブザーバーは状態を取得するためにこのメソッドを呼び出すことができます。 */ return state; }
}
```

## Observer

Observerは、長く説明するまでもなく、**状態を見ようとするインターフェース**です。インターフェースであるため、その情報を参照し活用したいのであれば、意図に合わせて好きなように実装して使用すればよいです。

- Observerインターフェース

```java
interface Observer {
    protected Observable observable; // Javaでは、これは通常実装クラスのインスタンス変数となる。
    public void getStateFromObservable(); // このメソッドはPullメカニズムを示します。
}
```

- Observer実装

```java
class StateObserver implements Observer {
    private State state;
    private Observable observable;

    public StateObserver(Observable observable) {
        this.observable = observable;
        this.observable.registerObserver(this);
    }

    // このメソッドはPush方式の更新でよく使われますが、
    // ここで定義されているObserverインターフェースはgetStateFromObservable()を定義しています。
    public void update(State state) { // State型を想定、Observable.notifyObserver()から呼ばれることが多い
        this.state = state;
    }

    @Override // インターフェースに従ったPullモデル用の実装
    public void getStateFromObservable() {
        // オブザーバーがそのObservable参照を使って状態をプルする場所です。
        // 例: this.state = observable.getState();
    }
}
```

なぜStateObserverを`Observable.getObservers().add(new StateObserver())`という方法で追加せず、StateObserverオブジェクトを生成する際にObservableを渡してコンストラクタ内で追加したのでしょうか？

> `Observable.getObservers()`を呼び出さないことで、オブザーバーリストをObservableの外部に決して公開しないためです。

---

オブザーバーパターンは、なぜわざわざパターンとして定義されたのでしょうか？そこまで複雑にする必要はないように思えますが。その意義は、ObservableとObserverの二つのインターフェースが、互いの実装について全く知る必要なく、データのみをやり取りする点にあります。もう少し詳しく説明すると、以下のようになります。

> Observableが持つ状態とオブザーバーテーブルの両方を外部に公開せず、オブザーバーのみがそれを知るようにすること。
> 「相互作用するオブジェクト間では、可能な限り疎結合なデザインを使用すべきである」という原則です。

ご理解いただけたでしょうか。今日のデザインパターンはここで終わりにします。

---