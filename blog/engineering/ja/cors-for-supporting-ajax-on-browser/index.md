---
title: "CORS - クロスオリジンAJAX呼び出しのためのSOP補完ポリシー"
category: ["Frontend"]
created: 2022-07-18 01:51:23
deck: "私がWeb開発を始めたばかりの頃、最初に出くわした問題がCORSでした。CORSはそれ自体が問題ではなく、開発者にそのリクエストがCORS規則に従っていないことを伝えるための規約です。CORS規約はWebブラウザのセキュリティ要素です。ブログを作成する際、外部画像をリンクすることがあります。このように外部にある単純なリソースを取得することはセキュリティ上の問題になりませんが、POSTやPUTのようなAJAX呼び出しを通じて外部にある動的なリソースを取得することは、サーバーの状態を変更するためセキュリティ上の問題となります。したがって、サーバーの状態変更（クッキーヘッダーなどを介したクライアントの状態変更も含む）に関連する呼び出しの際には、その呼び出しが開発者の意図したものかどうかを厳密に検証する必要があります。そうしないと、ブログに悪意のあるスクリプトが注入され、外部ドメインに対して意図しないサーバーリソースを操作するAJAXが呼び出される可能性があるからです。"
abstract: "ウェブブラウザに表示されるすべてのリソースは、同一ドメインから取得されることもありますが、多様なリソース活用のため外部ドメインから取得されることもあります。ドメインが同じ場合はSame Origin、異なる場合はCross Originと表記されます。ブラウザは最低限のセキュリティのために、単純なリソースの取得においてはCross Originも許可するなど、SOP（Same Origin Policy）というポリシーを持っています。AJAX呼び出しは単純なリソースではなく、外部ドメインのリソースを操作する危険性があるため、SOPによってブロックされてしまいます。CORSは、SOPによってブロックされる外部ドメインへのAJAXを可能にする追加ポリシーです。"
keywords: "CORS, SOP, Same-Origin Policy, AJAX, ブラウザセキュリティ, プリフライト"
description: "ウェブブラウザのセキュリティのためのSOPポリシーを補完し、安全なクロスオリジンAJAX呼び出しを可能にするCORSポリシーの概念と検証手順をまとめます。"
---

# ブラウザのSOP（Same Origin Policy）ポリシー

ブラウザでのHTTPリクエストは、基本的にSOP（Same Origin Policy）ポリシーに従います。

-   オリジンが同一か否かは、以下の3つの要素を基準とします。
    -   Scheme (http) + Host (1.2.3.4) + Port (8080)

Same Origin Policyという名称から、SOPポリシーがリソースを呼び出したドメインとリソースを提供するドメインが必ず同一でなければならないと誤解されがちですが、[**セキュリティ上の問題がない範囲で以下のケースについては例外的に許可**](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%B3%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9)されます。ちなみに、Cross-site = Cross-domain = Cross-origin はすべて同じ意味です。

-   クロスオリジン**送信**：ユーザーによる<u>意図された</u>送信
    -   `<form>`タグで他のドメインに**submit()**送信可能
-   クロスオリジン**取得**：<u>単純な参照</u> = 悪意のあるリクエスト不可
    -   `<img>`タグで他のドメインの**画像ファイル**を取得可能
    -   `<link>`タグで他のドメインの**CSS**を取得可能
    -   `<script>`タグで他のドメインの**JavaScriptライブラリ**を取得可能
    -   `<iframe>`タグも他のドメインの**ページ**を取得可能
-   クロスオリジン**リクエスト（= AJAX）**：悪意のあるリクエストが可能
    -   **セキュリティの脆弱性により、CORS（Cross-Origin Resource Sharing）ポリシーにのみ適合すれば条件付きで許可**

## AJAX (Asynchronous JavaScript and XML)

AJAXとは何でしょうか？これは、サーバーと通信する際に使用される非同期JavaScriptをサポートするもので、フロントエンドでデータを取得するためにサーバーを呼び出す際によく使われるaxiosやfetchの根幹となる技術です。現在、ほとんどの主要なウェブブラウザは、サーバーにデータをリクエストするためにXHR（XmlHttpRequest）オブジェクトを内蔵し、非同期処理を行っています。W3C標準ではないため、ブラウザごとに設計方式に違いはありますが、すべてXHRオブジェクトを通じて実装されています。このXHRオブジェクトを通じて、ウェブページがすべてロードされた後でもサーバーにデータをリクエストしたり受け取ったりして、ページの一部だけを更新することができるのです。

-   **AJAX** = **非同期**HTTPデータ転送 = **結果を「オブジェクト」として返却**
    -   HTTPデータをバックグラウンドで転送し結果を受け取るが、現在のページには何の影響も与えない
-   **FORM** = **同期**HTTPデータ転送 = **結果を「移動する新しいページ」として返却**され、レンダリングする
    -   HTTPデータを転送し、結果ページを受け取ってそのページに移動する

# CORSの登場 - クロスオリジンAJAX呼び出しのために

AJAXはどのようなサーバーでも呼び出すことができるため、同一ドメインのサーバーから情報を取得することも、異なるドメインから情報を取得することも可能です。開発者の意図に基づいたAJAX呼び出しのみが可能であれば良いのですが、ユーザーに悪意のあるスクリプトを実行させ、他のドメインサーバーに対して悪意のあるAJAX呼び出しを実行させる**CSRF（Cross-site Request Forgery）**という脆弱性があります。

このような脆弱性があるため、SOPポリシーはAJAXをブロックすべきですが、AJAXはW3C標準ではないにもかかわらず、事実上の非同期標準として使用されているため、CORSという例外ポリシーが導入されました。**CORSポリシーは、悪意のあるAJAX呼び出しを防ぐために、クライアント（ブラウザ）とサーバー間で、そのAJAX呼び出しが意図されたものであるかどうかを相互に交差検証する仕組み**を提供しています。

CORSポリシーさえ遵守すれば、AJAXを介したクロスオリジン呼び出しを許可するというものです。

# CORSポリシー検証手順

**CORSはブラウザの実装仕様に含まれるHTTP必須ポリシー**であり、SOPと同様にCORSポリシーの通過可否はブラウザが判断します。ブラウザはサーバーから**応答を受け取ります**が、**応答分析後にCORS違反であればそのまま破棄します**。したがって、ブラウザを介さずに**サーバー間で通信を行う際には、このポリシーは適用されません**。

-   CORSポリシー通過可否 - 3つの基準ヘッダー
    1.  許可されたオリジン
        -   **Origin** (クライアント)
        -   **Access-Control-<u>Allow</u>-Origin** (サーバー)
    2.  許可されたメソッド
        -   **Access-Control-<u>Request</u>-Method** (クライアント)
        -   **Access-Control-<u>Allow</u>-Method** (サーバー)
    3.  許可されたヘッダー
        -   **Access-Control-<u>Request</u>-Headers** (クライアント)
        -   **Access-Control-<u>Allow</u>-Headers** (サーバー)

# CORSリクエストの種類

ブラウザはAJAX呼び出しを2種類の組み合わせに分類し、**CORSポリシー検証手順**を異なる方法で適用しますが、これはドキュメント定義のための区分と見られ、簡単に言えば次のように理解できます。

-   いかなるリクエストであっても、<u>(1) 許可されたオリジン</u>の検証は必須です。
-   MethodがGET, HEAD, POST（一部Content-type）ではない場合、<u>(2) 許可されたMethod</u>の検証が必要です。
-   非標準のCustom Headerを使用する場合、<u>(3) 許可されたHeader</u>の検証が必要です。

具体的な学習のために、2種類の組み合わせについて見ていきましょう。

## Simple/Preflight Request

AJAXで使用されるHTTPメソッドが、単純な照会に使われるGET、HEADであれば、**サーバーを操作できないメソッド**であるため、**実際のリクエストに対する戻り値を受け取り、それに含まれるヘッダーを通じてCORS検証**を行います。しかし、**サーバーの状態を変更するメソッド（POST、PUT、DELETE）**である場合や、**カスタムヘッダー（クッキー保存など）が含まれている**場合は、**実際のリクエストを送信する前に予備リクエスト（Method = OPTIONS）を送り、実際の戻り値なしでヘッダーのみを受け取りCORS検証**を行います。**CORS検証が完了した後、実際のリクエストを送信してサーバーの状態を変更します。**

### Simple Request

-   **メソッド: GET, HEAD, POST（条件付き）**
    -   **POST**方式の場合、**Content-type**は以下の3つのうちのいずれかである必要があります。
        -   application/x-www-form-urlencoded
        -   multipart/form-data
        -   text/plain
-   **Custom Header: 存在しない場合**

**サーバーを操作できない**メソッドであるため、クライアントは**実際のリクエスト**を送信し、<u>(1) 許可されたオリジン</u>の一致のみを確認します。

-   (1) **Origin** === **Access-Control-<u>Allow</u>-Origin**

### Preflight Request

-   **メソッド: POST, PUT, DELETE など、またはカスタムヘッダーを伴うGET/HEAD**
-   **Custom Header: 存在する場合**

**サーバーを操作できる**メソッドであるため、クライアントは実際のリクエストではなく**予備（プリフライト）リクエスト**を送信し、<u>(1) 許可されたオリジン</u>、<u>(2) 許可されたメソッド</u>、<u>(3) 許可されたヘッダー</u>のすべての一致を確認します。

-   (1) **Origin** = **Access-Control-<u>Allow</u>-Origin**
-   (2) **Access-Control-<u>Request</u>-Method** = **Access-Control-<u>Allow</u>-Method**
-   (3) **Access-Control-<u>Request</u>-Headers** = **Access-Control-<u>Allow</u>-Headers**

## Credential (資格情報)

**資格情報（Credential）**とは、Cookie、Authorization Headers、またはTLSクライアント認証を意味します。資格情報（Credential）は、クライアントが`XMLHttpRequest.withCredentials`またはFetch APIの`Request()`コンストラクタの`credentials`オプションを通じて「**資格情報モード**」を有効にしてリクエストすると、サーバーがクライアントに「**資格情報ヘッダー**」に値を含めて送信します。この時、サーバーは以下の「**CORSヘッダー**」を通じて、クライアントが「**資格情報ヘッダー**」の値を見ることができるか否かを同時に送信し、ブラウザはその「**CORSヘッダー**」が`true`であればクライアントに「**資格情報ヘッダー**」を公開し、`false`または存在しない場合（デフォルトは`false`）は「**資格情報ヘッダー**」をすべて破棄しクライアントから隠します。

-   **Access-Control-<u>Allow</u>-Credentials** = true

注意すべき点は、Credentialリクエストの場合、CORSヘッダーの**Access-Control-Allow-Origin**の値が`*`であってはならないことです。`a.com`のような具体的なドメインが指定されている必要があります。

# 例で見てみる

## Simple Request

`a.com`ドメインから`b.com`ドメインへAJAX呼び出しを行う場合：

-   Methodが(1) GET, HEAD, POST（条件付き）であり、(2) カスタムヘッダーが**ない場合** = **Simple Request**
    -   CORSポリシーは**Origin**のみを検査
        -   (1) **Origin** === **Access-Control-Allow-Origin**

## Preflight Request

`a.com`ドメインから`b.com`ドメインへAJAX呼び出しを行う場合：

-   Methodが(1) GET, HEAD, POST（条件付き）であるが、(2) カスタムヘッダーが**ある場合** = **Preflight Request**
-   Methodが(1) DELETEである場合 = **Preflight Request**
    -   CORSポリシーは**Origin/Method/Headers**すべてを検査
        -   (1) **Origin** = **Access-Control-Allow-Origin**
        -   (2) **Access-Control-Request-Method** = **Access-Control-Allow-Method**
        -   (3) **Access-Control-Request-Headers** = **Access-Control-Allow-Headers**

# 追加のCORS関連HTTPレスポンスヘッダー

`Access-Control-Allow-Methods`や`Access-Control-Allow-Headers`など、これまで見てきたものとは異なり、サーバーが応答時にさらに送るCORS関連ヘッダーがいくつかあるので、それらを説明して終わりにします。

## Access-Control-Max-Age

Preflight Requestの場合、毎回`OPTIONS`予備リクエストを送受信すると、実際の結果値が返されるまでに時間がかかるため、予備リクエストに対するCORSレスポンスヘッダーの値をブラウザにどのくらいの時間保存できるかをサーバーが指定できます。

## Access-Control-Expose-Headers

`Access-Control-Allow-Headers`のAllowが、サーバーが**「クライアントがどのヘッダーを送信できるか」**を許可するヘッダーであるのに対し、Exposeが付いたこのヘッダーは、**「サーバーが送信するヘッダー」の中でブラウザが読み取れるヘッダーを明示**するものです。

---

1.  [HomoEfficio : Cross Origin Resource Sharing - CORS](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
2.  [MDN : Same-Origin Policy](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)
3.  [MDN : Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)
4.  [MDN : Access-Control-Allow-Credentials](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
5.  [Youtube : CORS in 100 Seconds](https://youtu.be/4KHiSt0oLJ0)