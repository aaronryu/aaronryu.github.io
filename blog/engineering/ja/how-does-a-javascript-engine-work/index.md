---
title: "JavaScriptエンジンの概要と実行プロセスから見るHoistingとClosure"
category: ["Language", "Javascript"]
created: 2020-08-26T17:22:10.000Z
updated: 2021-01-30T16:21:33.148Z
deck: "JavaScriptは、単なるインタプリタ言語を超え、V8エンジンなどの高性能エンジンを介して現代的な方法で実行されます。本稿では、変数宣言が最上部に引き上げられるかのような「Hoisting（巻き上げ）」と、関数が終了しても状態を記憶する「Closure（クロージャ）」の魔法が、エンジン内部でどのように実装されているのか、その実態を深く掘り下げます。"
abstract: "JavaScriptエンジンの二段階実行プロセスである「コンパイル」と「実行」を中心に、Hoistingの発生原理を理解します。また、実行コンテキストとレキシカルスコープの関係を通じてClosureがメモリに保持されるメカニズムを学習し、ガベージコレクション（GC）の観点からClosure利用時の注意点についても考察します。"
keywords: "JavaScriptエンジン, V8エンジン, Hoisting, Closure, 実行コンテキスト"
description: "JavaScript V8エンジンの動作原理を通じて、HoistingとClosureの概念を単なる暗記ではなく、エンジンのコンパイルおよび実行メカニズムの観点から深く解説します。"
---

# JavaScript

JavaScriptは、ウェブページの3つの要素のうちの1つです。

-   **HTML**: ウェブページ（ドキュメント）のフォーマットを定義するマークアップ言語。
-   **CSS**: ウェブページ（ドキュメント）のデザイン要素に関する言語。
-   **JS** (JavaScript): ウェブページ（ドキュメント）とユーザー間のインタラクションイベントに関する全ての処理。

JavaScriptは、一般的なプログラミング言語と同様に、関数の宣言と呼び出しを通じて直接同期的に実行することも、コールバックを介して特定のイベント時に非同期的に実行することも可能です。実行には、開発者が書いたJavaScript言語を実行可能な言語に変換し、実行順序とメモリを管理するエンジンが必要です。

> 1つのブラウザは、**HTML/CSSエンジン** + **JavaScriptエンジン**で構成されています。

よく知られているChrome、Internet Explorer、Safariなど、様々なウェブブラウザはそれぞれ独自のHTML/CSS/JSエンジンを持っています。JavaScriptエンジンの代表的なものとしては、ChromeブラウザやNode.jsで使われているV8があります。今後説明するJavaScriptエンジンおよびランタイムは、このV8を基準に解説します。ここで、今後繰り返し言及される「JavaScriptエンジン」と「JavaScriptランタイム」という用語を明確にしておきましょう。より詳細な説明は、「JavaScriptエンジンおよびランタイム」の小見出しで行います。

> **JavaScriptランタイム**は、JavaScriptの動作に必要となる**JavaScriptエンジン**を含む**APIと機能の集合体**です。
> **JavaScriptエンジン**は、狭義ではJavaScriptのインタプリティング（解釈実行）の役割を専門とするもので、**JavaのJVMとして理解できます**。

例えば、私たちが利用するChromeは、**V8 JavaScriptエンジン**ベースのJavaScriptランタイム上で動作しています。

# JavaScript = インタプリタ言語

> JavaScriptはスクリプト言語であり、エンジンを介して処理される**インタプリタ言語**です。
> ただし、**コンパイル過程**を持っています。これについて説明します。

JavaScriptエンジンは、一般的なシェルスクリプトが一行ずつ直接実行されるインタプリタ言語とは少し異なる実行構造を持っています。[まず、実行する関数全体を、実行直前に変数や関数宣言のみを簡単にスキャンするⒶ JITコンパイル過程を経て、その後Ⓑ実行過程のサイクルで実行されます。](https://dev.to/genta/is-javascript-a-compiled-language-20mf) ここで、[Ⓐ JIT (Just-in-Time)コンパイル過程は、私たちが一般的に知っているC++やJavaのようなコンパイル言語で中間コードを作成するAOT (Ahead-of-Time)コンパイル過程とは異なります。](https://dev.to/deanchalk/comment/8h32) JavaScriptをインタプリタ言語だと知っていた方は、少し驚くかもしれません。[このようにJavaScriptエンジンに単純にコンパイル過程があるという事実だけでJavaScriptをコンパイル言語として言及することもありますが、厳密には既存のコンパイル言語の定義とは異なり、](https://gist.github.com/kad3nce/9230211#compiler-theory) [JavaScriptエンジンは関数実行の時点でコンパイルを行うため、インタプリタ言語です。](https://dev.to/deanchalk/comment/8h32)

> JavaScriptエンジンは、**Ⓐ JITコンパイル過程**と**Ⓑ 実行過程**の2つに分かれます。
> 結論として、**JavaScriptはコンパイル過程を持つインタプリタ言語**と要約できるのではないでしょうか。

# JavaScriptエンジンおよびランタイム

JavaScriptランタイムは、大きく2つの構成要素に分けられ、個別の要素としては5つに分けられます。

-   JavaScriptエンジン = **① ヒープ (Heap)** + **② スタック (Stack)** (コールスタック)
-   **③ Web API** + **④ コールバックキュー (Callback Queue)** + **⑤ イベントループ (Event Loop)**

JavaScriptエンジンは、具体的には**① ヒープ**と**② スタック**のみを指し、全てのコードをシングルスレッドで実行します。JavaScriptの非同期処理を学ぶ際に登場する**③ Web API**、**④ コールバックキュー**、**⑤ イベントループ**は、厳密にはJavaScriptエンジンの構成要素ではありません。もしJavaScriptエンジンがシングルスレッドで全てのコードを実行するとすれば、同期的な実行しかできないはずですが、どのように非同期をサポートしているのでしょうか？非同期サポートのために、JavaScriptランタイムが③、④、⑤の3要素を追加しているのです。

JavaScriptエンジンの(2)スタックは、一般的なプログラミング言語のスタックとは異なります。他のプログラミング言語では、関数実行に伴い、各ローカル関数の変数などのコンテキスト情報がコールスタックにまとめて積まれます。ローカル関数に限定された情報を持つことから、このコンテキストをスコープとも呼びます。一方、JavaScriptエンジンもコールスタックに関数呼び出し順序を積載しますが、変数および関数宣言と代入の情報はヒープに別途保存し、コールスタックは本ヒープへのポインタのみを持っています。具体的に整理すると以下の通りです。

-   JavaScriptエンジン
    -   **① ヒープ (Heap)**: 各関数ごとに宣言および代入される全ての変数と関数を積載するメモリ領域。
    -   **② スタック (Stack)** (コールスタック): 関数実行順序に合わせて上記のヒープへのポインタを積載し、実行します。
-   非同期サポート
    -   **③ Web API**: [基本的なJavaScriptにはないDOM、Ajax、setTimeoutなどの多様な関数を提供します。](https://developer.mozilla.org/ko/docs/Web/API)
        -   ブラウザやOSなどでC++のような様々な言語で実装され提供されます。
    -   **④ コールバックキュー (Callback Queue)**: 上記Web APIで発生したコールバック関数がここに順次積載されます。
    -   **⑤ イベントループ (Event Loop)**: 上記コールバックキューに積載された関数をスタックへ1つずつ移動させて実行されるようにするスレッド。

# JavaScriptエンジンの実行過程

JavaScriptエンジンは、**Ⓐ JITコンパイル過程**と**Ⓑ 実行過程**の2つに分かれます。

## Ⓐ Compilation Phase（コンパイル段階）

各関数実行時（JavaScriptの最初の実行関数は`main()`です）に、AST（抽象構文木）が生成され、バイトコードに変換されます。JITコンパイル技術（バイトコードのキャッシュを通じて不要なコンパイル時間を削減する）のために、プロファイラが関数呼び出し回数を保存・追跡します。ここで覚えておくべきは、この過程で**変数の「宣言」**（宣言と代入のうち）と**関数の「宣言」がヒープ（Heap）に積載される**ということです。

> JavaScriptにおける**変数の「宣言」**は`var a`です。（`a = 5`は「代入（Assignment）」です。）

<br>

> JavaScriptにおける**関数の「宣言」**は`function a() {}`です。

<br>

> Ⓐ Compilation Phaseでは、変数および**関数の「宣言（Declaration）」のみを抽出し、ヒープに積載します。**
> 変数と関数の宣言は、JavaScriptの実行前にコンパイルによって保存され、実際の実行時に変数と関数が宣言されているかどうかが検索されます。

例えば、以下のJavaScriptファイルが初めて実行されると、ファイル全体にコンパイル過程が実行されます。

```js
var a = 2;
b = 1;

function f(z) {
  b = 3;
  c = 4;
  var d = 6;
  e = 1;

  function g() {
    var e = 0;
    d = 3*d;
    return d;
  }

  return g();
  var e;
}

f(1);
```

1.  JavaScriptの最初の実行のため、`main()`関数の**グローバルスコープ（Global Scope、window）領域がヒープに生成されます**。

```
# Global Scope (window)
-
-
```

2.  変数宣言`var a`を見つけ、グローバルスコープ（window）領域に**`a`を積載します**。
3.  変数代入`b = 1`は代入であるため、この領域には**`b`は積載されません**。

```
# Global Scope (window)
- a =
-
```

4.  関数宣言`function f(z) {}`を見つけ、グローバルスコープ（window）領域に**`f`を積載します**。
5.  関数積載時には、`f`関数のバイトコード（blob）へのポインタ値も一緒に積載します。

```
# Global Scope (window)
- a =
- f = a pointer for f functions bytecode
```

JavaScriptコードの最初の行から20行目までのコンパイル過程が完了すると、ヒープの構成は最終的に上記のようになります。

## Ⓑ Execution Phase（実行段階）

**変数の「代入（Assignment）」**と**実際の関数の呼び出しおよび実行**を行います。

> JavaScriptにおける**変数の「代入」**は`a = 1`です。
> `a = 1`の代入時、以前のコンパイル過程で変数`a`が宣言されているかを確認します。
> もし存在しない場合、`a`変数を「宣言」と同時に「代入」して積載します。

<br>

> JavaScriptにおける**関数の「呼び出しおよび実行」**は`a()`です。
> `a()`実行時、最初に、以前のコンパイル過程で関数`a()`が宣言されているかを確認します。
> `a()`実行時、次に、ヒープには新しい関数のためのローカル実行スコープ（Local Execution Scope）領域を生成し、
> コールスタックには生成されたヒープへのポインタを持つ関数`a()`情報を積載します。
> `a()`実行時、最後に、コンパイルを実行して本関数内の変数および関数を上記のローカル実行スコープ領域に積載します。

<br>

> Execution Phaseでは、変数の「代入（Assignment）」値がヒープに積載され、関数は呼び出され実行されます。

関数呼び出しのたびにスタックに関数内の変数や関数を一緒に積載するスタックベース言語とは異なり、JavaScriptはスタックには関数呼び出し順序と、実際の変数や関数情報はヒープへのポインタを持ちます。ヒープ上の関数`a()`のためのローカル実行スコープは、`a()`関数が呼び出される前にヒープに存在していたグローバルスコープ（window）へのポインタを持っているため、エンジン内で以下のような処理が可能です。

-   `a()`関数内で`a = 1`の変数代入時、まずローカル実行スコープに変数の`a`宣言を探し、
    存在しない場合は以前のグローバルスコープに戻って検索できます。
-   `a()`関数の実行が終了すると、コールスタックを通じて現在のヒープ領域をグローバルスコープに再び戻します。

上記で例として見たJavaScriptファイルのコンパイル過程を終えた後の実行過程は、以下の通り進行します。

6.  前述のコンパイル後、以下のヒープを持ち、JavaScriptファイルコードの最初の行から再び実行が開始されます。

```
# Global Scope (window)
- a =
- f = a pointer for f functions bytecode
```

7.  変数代入`a = 2`を見つけ、グローバルスコープ（window）領域に変数の`a`存在有無を確認します。
8.  変数`a`が存在するため、該当`a`に`2`を代入します。

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
```

9.  変数代入`b = 1`を見つけ、グローバルスコープ（window）領域に変数の`b`存在有無を確認します。
10. 変数`b`が宣言されていないため、`b`の宣言と同時に`1`を代入します。

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1
```

11. 関数呼び出し`f(1)`を見つけ、グローバルスコープ（window）領域で`f()`の宣言有無を確認します。
12. 関数`f()`のblobコンパイルおよび実行のため、ヒープに新しいローカル実行スコープ領域を生成します。

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1

# Local Execution Scope for f()
- (hidden) A pointer for previous scope (= Global Scope (window))
-
-
```

`f(1)`関数実行時、新しく生成されたローカル実行スコープに再びCompilation Phase過程を通じて変数と関数が積載され、Execution Phase過程が実行されます。また`f(1)`関数内部にさらに別の関数がある場合、この過程を繰り返し再帰的に行います。

13. 関数`f()`の**Ⓐ Compilation Phase**過程が完了すると、以下のようになります。

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 1

# Local Execution Scope for function f()
- (hidden) a pointer for previous scope (= Global Scope (window))
- z =
- d =
- e =
```

14. 関数`f()`の**Ⓑ Execution Phase**過程が完了すると、関数`f()`内の変数代入および関数`g()`のスコープが生成されます。

```
# Global Scope (window)
- a = 2
- f = a pointer for f functions bytecode
- b = 3

# Local Execution Scope for function f()
- (hidden) a pointer for previous scope (= Global Scope (window))
- z = 1
- d = 6
- e = 1
- c = 4

# Local Execution Scope for function g()
- (hidden) a pointer for previous scope (= Local Execution Scope for function f())
- e =
```

# JavaScriptエンジンの特性

## Function-level scope: `var`

**JavaScriptの実行は、最終的に関数に基づいてⒶコンパイル、Ⓑ実行が再帰的に行われます。** 最初はJavaScriptの実行開始時に`main()`関数に対するⒶ、Ⓑ処理から始まり、内部で新しい関数呼び出しが発生すると、その新しい関数に対するⒶ、Ⓑ処理が始まり、さらに内部で関数呼び出しがあればその関数に対するⒶ、Ⓑ処理が…といった形で処理が繰り返されます。

> 特定の関数内の変数`var`の宣言は、本関数のⒶコンパイル時に定義されるため、変数`var`のスコープは関数レベル（function-level）になります。

`if`、`for`文のようなブロックレベル（`{}`）単位の変数のために、ES6では新たに**Block-level scope: `const`、`let`**が導入されました。

## Scope Chain（スコープチェーン）

JavaScriptエンジンの実行過程で見たように、特定の関数に対するⒷ実行段階で変数代入時、まず本関数のヒープ領域に変数が宣言されているか検査されます。**もし本関数内に変数が宣言されていなければ、その関数のヒープでは変数宣言を見つけることができません。この時、当該関数が呼び出される以前の関数へと`(hidden) A pointer for previous scope`を通じて遡りながら、当該関数ヒープスコープに変数が宣言されているか確認します。** どの関数にも変数宣言がされていない場合は、最も最初に呼び出された`main()`関数まで遡って検索されます。**関数呼び出しスタックの逆順で、最も最初の`main()`関数まで各関数ヒープスコープに変数の宣言が存在するかを連鎖的にChainingしながら探すため、これをスコープチェーン（Scope Chain）と呼びます。**

## Variable Hoisting（変数巻き上げ）

Ⓐコンパイル段階で変数を先に宣言し、その後にⒷ実行段階で変数を代入するため、同じ関数レベルであれば以下のように変数宣言と代入を分けて行ったとしても、JavaScriptエンジンでは変数宣言が先にされたものとして処理されます。

```js
a = 10
var a;
```

```
# Global Scope (window)
- a = 10
```

上記の例のように`var a`の宣言が同じ関数レベル内で最上段に「巻き上げられた」かのように実行されることもありますが、もし関数内に変数が宣言されていなかった場合、スコープチェーンを通じて`main()`関数まで遡りながら変数宣言を探します。最終的に`main()`関数ヒープスコープにも宣言されていなければ、`main()`関数領域に変数宣言が行われます。`main()`から呼び出されたどの関数もスコープチェーンを通じて今宣言された変数を見るため、これはグローバル変数となります。（`main()`のヒープスコープ領域の名称はグローバルスコープ（window）でもあります。）**特定の関数内で変数を代入したが、この変数がどの関数にも存在しない変数であるため、`main()`関数まで「巻き上げられて」グローバル変数を宣言したことになります。変数宣言が「巻き上げられた」という意味で、この全てのケースをVariable Hoisting（変数巻き上げ）と表現します。**

## Variable Shadowing（変数シャドウイング）

特定の関数のヒープスコープに変数が宣言されている場合、その変数への代入は現在の関数ヒープスコープに宣言されている変数に対して行われます。もしその関数を呼び出す以前の関数に同じ名称の変数が宣言されていたとしても、現在の関数ヒープスコープに既に存在するため、以前の関数のヒープスコープまでスコープチェーンする必要はありません。**以前の関数に同じ名称の変数があったとしても、現在の関数はその存在を知ることも知る必要もないため、これをVariable Shadowing（変数シャドウイング）と呼びます。**

## Garbage Collection（ガベージコレクション）

関数の直接実行が終了すると、スタックから実行完了した関数の情報が削除され、ヒープメモリ内の実行完了した関数のヒープスコープも削除されます。メモリクリーンアップの意味でガベージコレクション（Garbage Collection）と呼びます。JavaScriptファイル全体の実行が終了すると、最後に`main()`関数のグローバルスコープ（Window）も消滅します。参照カウント（Reference Count）によるガベージコレクションを行うSwift言語などもありますが、**JavaScriptは単純に関数（ポインタ）の到達可能性（Reachability）に基づいてガベージコレクションを実行します。** 関数の直接実行ではなく、関数実行を変数に代入した場合、関数実行が終了したとしても、代入された変数を通じて関数実行を繰り返し可能であるため、本関数に対するガベージコレクションが行われないケースが存在します。これがまさに以下で説明するクロージャ（Closure）の概念です。

## Closure（クロージャ）

JavaScriptエンジンの実行説明で扱った例で、`function f`を直接実行せず、`var myFunction`を宣言してそれに代入してみました。

```js
var a = 2;
b = 1;

function f(z) {
  b = 3;
  c = 4;
  var d = 6;
  e = 1;

  function g() {
    var e = 0;
    d = 3*d;
    return d;
  }

  return g; // Changed from return g();
  var e;
}

var myFunction = f(1); // 新たに追加されたコード
myFunction();
```

関数呼び出しを変数に代入すると、関数の呼び出しは一度きりの実行で消滅するのではなく、`myFunction`という変数を介して繰り返し呼び出しが可能であるため、`f`関数呼び出しのために生成された`f`関数のヒープスコープは削除されません。少し簡単に考えると、`f`関数のヒープスコープには`f`関数実行のために渡された引数値`1`も保持しているため、ヒープスコープをガベージコレクションできないのです。このように、関数呼び出しを変数に代入すると、`f`関数のヒープスコープと`f`を呼び出した関数のヒープスコープが引数`1`を基準に強く結びついているため、`f`関数の実行が終了しても`f`関数のヒープスコープがガベージコレクションされません。

クロージャ（Closure）は、関数のヒープスコープと、その関数を呼び出す関数のヒープスコープを連結するもので、関数呼び出しが終了してもスコープは依然としてその関数を呼び出した関数のスコープに「閉じ込められている」概念です。

---
- https://youtu.be/QyUFheng6J0
- https://www.quora.com/Is-JavaScript-a-compiled-or-interpreted-programming-language
- https://medium.com/@almog4130/javascript-is-it-compiled-or-interpreted-9779278468fc
- https://blog.usejournal.com/is-javascript-an-interpreted-language-3300afbaf6b8
- https://youtu.be/QyUFheng6J0?t=435
- https://dev.to/genta/is-javascript-a-compiled-language-20mf
- https://dev.to/deanchalk/comment/8h32
- https://gist.github.com/kad3nce/9230211#compiler-theory
- https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf
- https://developer.mozilla.org/ko/docs/Web/%EC%B0%B8%EC%A1%B0/API
- https://medium.com/@antwan29/browser-and-web-apis-d48c3fd8739