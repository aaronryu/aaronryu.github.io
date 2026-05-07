---
title: "Spring MVCの構造、動作原理、および処理フロー"
category: ["Spring"]
created: 2021-02-14 05:37:38
deck: "ウェブ開発を始めた当初、Springはウェブアプリケーションサーバー（WAS）を非常に簡単にセットアップし、開発できる画期的なフレームワークでした。入社したばかりの私でも数行のコードでコントローラーを作成できるほどで、Springがなかった時代のウェブ開発者たちには畏敬の念を抱きました。しかし、これは数多くの抽象化を経て得られた利便性であり、私にとっては、ウェブサーバーの理解からしばらく遠ざかる暗黒期を作り出してしまいました。その時になって初めて、なぜトビーのSpringの本がそんなに分厚かったのかを理解でき、それ以降は本当に綿密に勉強し、抽象化を一つずつ剥がしていくことで、Springの本質にさらに近づくことができました。"
abstract: "ウェブサーバーからウェブアプリケーションサーバー（WAS）への発展とSpringの登場、そしてServletを皮切りに、Springの動作原理とクライアントからのリクエストに対する処理フローを考察します。最後に、InterceptorとFilterの概念を簡単に説明します。"
image: { url: ../../ko/spring-mvc-structure-and-security/spring-mvc-abstract.png, alt: "Spring MVC Abstract" }
keywords: "Spring MVC, DispatcherServlet, Servlet Container, Spring Container, Filter, Interceptor, ウェブサーバー, WAS"
description: "ウェブサーバーからWASへの発展過程と共に、Spring MVCの核であるDispatcherServletの動作原理、そしてFilterとInterceptorの違いと処理フローについて詳しく解説します。"
---

# Webサーバー (**静的ページ**)

> ユーザーに**サーバーにあるページ**を表示します。

ウェブの初期には、サーバーに静的なドキュメント（HTML）を保存し、ユーザーがリクエストすると、そのファイルをユーザーのブラウザにダウンロードして表示する方式でした。例えば、特定のサーバー `aaron.com` にある `hello.html` ドキュメントを見たい場合、ブラウザで `aaron.com/hello.html` を呼び出す形式です。大学で教授が自身の研究室サーバーを利用して講義資料を配布する際に、以下のようなページを見た読者もいるかもしれません。

![Static Page from Web Server](../../ko/spring-mvc-structure-and-security/static-web-page-example.png)

この方式では、サーバーが提供したいファイルを実際にサーバー内部に一つずつ配置する必要があり、サーバーに存在しないファイルにアクセスすると `404 Not Found Error` が返されました。このようにユーザーに静的なページを提供するサーバーを**Webサーバー**と呼び、よく知られている**Apache**や**Nginx**がこれに該当します。

## 例) Nginxのリクエスト/処理フロー

**Webサーバー**の例として、**Nginx**ではユーザーのリクエストを以下の過程で処理します。

![Web Server](../../ko/spring-mvc-structure-and-security/web-server-description.png)

*   ユーザーは**Webサーバー**に特定のページ（`index.html`）をリクエストします。
*   **Webサーバー**は `index.html` を検索し、存在すればユーザーに返します。

# Webアプリケーション (**動的ページ**)

> **サーバーにないページ**を、ユーザーの**各リクエストごとに動的に生成して**表示します。

Webサーバーがユーザーに単純なドキュメントを共有する一方的なサービスを提供するに留まらず、ユーザーとのインタラクションを通じて会員登録が可能になり、記事の投稿や、投稿された記事を相互に閲覧できるといった双方向サービスの要求を受けるようになりました。一般的なアプリケーションのようにデータベースとの接続も必要になり、会員の状態に応じた動的なページレンダリングのための非同期API呼び出しなどが必要になったのです。サーバーはもはや**サーバーにある静的リソースを返すだけでなく**、**ユーザーが要求した情報に対応するリソース（ページ）を動的に作成して返す**ようになりました。

ウェブでアプリケーションのような要求を処理するためには、**Webサーバー**と**様々な言語で開発されたプログラム**を接続し、ユーザーのリクエストをサーバー経由でプログラムに渡す必要がありました。このようにWebサーバーとプログラムの間を接続する方式を**CGI (Common Gateway Interface)**と呼び、様々な言語で開発されてきましたが、その中でもJavaにおいては**Webサーバーのリクエスト/レスポンスとJavaアプリケーションの間を接続するServletオブジェクト**の概念が登場します。

Servletはユーザーのリクエストごとに一つずつ生成されるため、**複数のリクエストに応じたServletリソースの管理**が必要になります。この役割を担うのが**Webコンテナ**であり、Servletの視点からはServletコンテナとも呼ばれます。

*   ユーザーのリクエスト/レスポンスを管轄する**Webサーバー**、
*   ここに、リクエストに応じた適切なJavaアプリケーションの稼働を担うServlet管理者である**Webコンテナ**を追加すると、

この両者を合わせたものが**Webアプリケーション**です。

*   **Webアプリケーション** = **Webサーバー** + **Webコンテナ** (= Servletコンテナ)
    *   **Webコンテナ**は、ユーザーのリクエストに応じて**Servletリソースのライフサイクルを管理**します。
    *   **生成 (init) -> 処理 (service) -> 破棄 (destroy)**

![Web Server](../../ko/spring-mvc-structure-and-security/servlet-container-life-cycle.png)

## 例) Tomcatのリクエスト/処理フロー

**Webアプリケーション**の例として、**Tomcat**ではユーザーのリクエストを以下の過程で処理します。

![Web Application](../../ko/spring-mvc-structure-and-security/web-application-description.png)

Webサーバーの図と比較すると、Webサーバーの下に追加されたものはすべてWebコンテナに関連するものです。Webコンテナから始めて、下から上に逆順で見ていきましょう。隣に灰色で表示されている名称は実際のクラス/インターフェース名です。

*   **<u>ServletContext (Webコンテナ)</u>**
    *   Servletオブジェクトのライフサイクル管理のためのWebコンテナ（管理という意味でのContext）
    *   すべてのリクエストに対するServletのライフサイクルは、このServletContextがすべて管理します。
*   **<u>ServletContextListener</u>**
    *   ServletContextが最初に起動する際（Listener）に実行する処理を定義します。
*   **<u>web.xml (デプロイメント記述子)</u>**
    *   デプロイメント記述子という名称が示すように、Webコンテナ起動時のServletのための設定です。
        *   B) どの `ServletContextListener` インターフェース実装を実行するか
        *   A) 「どのリクエスト」に対して「どのタイプ」のServletオブジェクトを生成するかについてのマッピング
            *   例) `/hello.html` へのアクセスは `HelloServlet` が動的に処理

構成が分かったところで、上記の図に従ってWebアプリケーションの起動時の手順を見ていきましょう。

### 初回起動時

*   Tomcat Webアプリケーションが初回起動する際、最も先に**<u>Webコンテナ (ServletContext)</u>**が起動します。
*   B) ServletContext起動時、`web.xml`に設定された**<u>ServletContextListener</u>**が同時に実行されます。

### リクエスト処理時

*   ユーザーは**<u>Webサーバー</u>**に特定のページ（`index.html`）をリクエストします。
*   Webサーバーは `index.html` を検索しますが、存在しないため、**<u>Webコンテナ (ServletContext)</u>**にリクエストを移管します。
*   A) **<u>ServletContext</u>**は、`web.xml`で定義された`index.html`リクエストに合致するタイプのServletを生成します。
    *   生成されたServletは、ユーザーがリクエストしたページを動的に生成してユーザーに返し、その後破棄 (destroy) されます。

# Spring Framework

Java Servletを活用したWebアプリケーション開発が活発になるにつれて、様々なデザインパターンを適用し、Java Web開発をより容易にするSpring Frameworkが登場しました。初期のWebアプリケーションがページを動的にレンダリングするために**各リクエストごとにServletを割り当てて**リクエストを処理していたのに対し、Springは**各リクエストごとにServletよりも小さい単位であるBeanを割り当てて**リクエストを処理します。これは、多数のServletを置かず、単一のServlet（後述しますが、これがDispatcherServletです）を置き、バックエンドで多様かつ多数のBeanを配置することで、リクエストに応じた適切な処理を行うという意味です。

*   **Servletコンテナ**は、各URLリクエストを**Servlet**を単位として処理します。
    *   リクエストを処理する単位が**Servlet**であるため、**Servletコンテナ**がServletを管理します。
*   **Springコンテナ**は、各URLリクエストを**Bean**を単位として処理します。
    *   リクエストを処理する単位が**Bean**であるため、**Spring (Bean) コンテナ**がBeanを管理します。

**Springは基本的にMVCモデルで、Model、View、Controllerの3つのグループに役割を分離して開発を支援する**フレームワークであるため、デザインパターンに関する知識が全くない開発者でも、保守性、再利用性に優れたWebアプリケーションを作成できます。また、**データベースアクセス用のJPA、トランザクション、セキュリティなど、Webアプリケーションで必要とされるすべてのものをBean設定で提供**するため、どんな初心者でもしっかりとした理解があればWebアプリケーションを簡単に作成できます。実際、しっかりとした理解がなくても作成できるのがSpringの利点です。これはつまり、ジュニア/シニアに関わらず最高の生産性を意味します。

# Spring MVCの概念

Spring MVCの動作過程を理解するには、**MVC**と**Front Controllerパターン** (**2レベルController**) を知っていれば十分です。

## MVC (Model, View, Controller)

1.  ユーザーがあるページをリクエストすると、リクエストに適合する**Controllerがリクエストを受け取り**、
2.  リクエストされたページに必要な情報である**Modelを検索/生成**し、
3.  検索/生成したModelを通じて**最終ページであるViewを生成**してユーザーに**返します**。

## Front (2レベル) Controllerパターン

上記のMVCにおいて、リクエストを受け取る部分をControllerとしましたが、

*   Tomcatの立場では、リクエストを処理するServletがControllerでしょう。
*   Springの立場では、リクエストを処理するBeanがControllerでしょう。

では、**2レベルController**の意味は以下の通りです。

*   Front Controller: すべてのユーザーリクエストを、最初にTomcatの**単一Servlet (DispatcherServlet)**で受け取り、
*   Page Controller: リクエストURLが何であるかに応じて、SpringのController Beanにマッピング/ページ生成および返却を行います。

一番前の**Tomcat単一Servlet (DispatcherServlet)**を、「リクエストを一番最初に受け取る」という意味で**Front Controller**と呼び、その後の**Spring Controller Bean**を、実際のページ生成に使用されるという意味で**Page Controller**と呼びます。

# Spring MVCのリクエスト/処理フロー

## 初回起動時

まず、**Spring + Tomcat**が最初に起動する際にどのようなオブジェクトが生成されて準備されるかを見ていきましょう。**Webコンテナ**の下に**Springコンテナ**が新しく追加されているのが分かります。

![Spring Web Application - 1. Init](../../ko/spring-mvc-structure-and-security/spring-web-application-description-1-init.png)

上記の図のようにTomcatにSpringを接続するためには、Tomcatの設定ファイルである`web.xml`に2つの設定が必要です。

*   web.xml (デプロイメント記述子)
    *   B) ServletContextListenerインターフェース実装を通じて
        *   1: <u>ServletContext</u>を起動するだけでなく = <u>Front Controller</u>
            *   A) すべてのリクエストはFront Controllerに該当する単一のServletオブジェクト（DispatcherServlet）が処理します。
        *   2: <u>Root WebApplicationContext</u>も同時に（次に）起動します = <u>Page Controller</u>
            *   これはSpring共通Bean (@Service, @Repository, @Component...) オブジェクトを事前に生成しておくためです。

## リクエスト処理時

初回起動後、Tomcatはすべてのリクエストを単一のDispatcherServletで受け取る準備が完了し、SpringもController Beanが結果を返すための様々なBeanがRoot WebApplicationContextに準備完了します。それでは、ユーザーがリクエストを送信した際の処理を見ていきましょう。少し複雑に見えるかもしれませんが、上記の[初回起動時](/spring/spring-mvc-structure-and-security/#%EC%B5%9C%EC%B4%88-%EA%B5%AC%EB%8F%99%EC%8B%9C-1)で見た内容に少し拡張が加えられただけですので、心配する必要はありません。

![Spring Web Application - 2. Request](../../ko/spring-mvc-structure-and-security/spring-web-application-description-2-request.png)

SpringのキーワードはIoC、DIと言えますが、簡単に説明すると、従来は開発者が `new` を通じてオブジェクトを直接生成し、直接注入していたのに対し、Springではインターフェースだけを明示し、**<u>ApplicationContext (= Spring Container, BeanFactoryを継承)</u>** がBeanと呼ばれるオブジェクトを生成し、開発者の設定によって自動的に注入してくれる概念です。このようにSpringでは、基本単位のJavaオブジェクトをBeanと呼んで使用します。

*   Spring Container = ApplicationContext

SpringにおけるBeanは、Webアプリケーションの観点から、以下のように大きく**2つのタイプ**に区分できます。それに伴い、Beanのライフサイクルを管理する**Springコンテナも2つ**に分けられます。

*   リクエストが来た際に適切な処理のために、**リクエストに関わらずすべてのBeanが相互に共有する共通Bean**
    *   例) `@ComponentScan` で登録された **@Service, @Repository, @Component** など
    *   ライフサイクル管理
        *   **<u>Root WebApplicationContext</u>** (図中のSpring Container 1)
*   リクエストが来た時に割り当てられるServletのように、**リクエストが来た時にのみ生成すればよいBean**
    *   例: `@ComponentScan` で登録された **@Controller, @Interceptor** など
    *   ライフサイクル管理
        *   **<u>Servlet WebApplicationContext</u>** (図中のSpring Container 2)

上記の図を見ると、初回起動時に生成されたSpring Container 1の下にもう一つのSpring Container 2が生成されているのが分かります。特に重要な内容ではありませんが、「parent」と「child」と書かれているのは、2つのコンテナ間に階層があることを意味し、単に子である<u>Servlet WebApplicationContext</u>のBeanは親である<u>Root WebApplicationContext</u>のBeanを参照できますが、その逆は参照できないことを意味します。

---

リクエスト処理は次の流れで進行します。上記の赤線（リクエスト）と緑線（応答）の流れに従って見ていきましょう。

1.  ユーザーは**<u>Webサーバー</u>**に特定のページ（`index.html`）をリクエストします。
2.  **Webサーバー**は `index.html` を検索しますが、存在しないため、**<u>Webコンテナ (ServletContext)</u>**にリクエストを移管します。
3.  A) ServletContextは、`web.xml`で定義された、どのリクエストに対しても `/` **<u>単一のDispatcherServlet</u>**を生成します。
4.  **<u>DispatcherServlet</u>**は、ユーザーがリクエストしたページに該当するSpring Controllerがあるか、**<u>HandlerMapping</u>**を探索します。
5.  DispatcherServletは、見つけた**<u>Spring Controller Bean</u>**を**<u>HandlerAdapter</u>**を介して呼び出します。
6.  HandlerAdapterは**<u>HelloController Bean</u>**を呼び出します。
7.  HelloControllerは**<u>Root WebApplicationContext</u>**内のBeanを活用して**<u>DispatcherServlet</u>**に結果を返します。
8.  DispatcherServletはControllerの結果を受け取り、**<u>ViewResolver</u>**で**<u>結果ページ (= View)</u> (`index.html`)** を生成します。
9.  DispatcherServletは**<u>結果ページ (= View)</u> (`index.html`)** をユーザーに返します。

---

上記の過程のコードレベルでの流れは、[こちらのブログリンク](https://galid1.tistory.com/526)に詳しくまとめられているので、参考にすると良いでしょう。

このように、Spring MVCがどのようにユーザーのリクエストを受け取り、処理し、返すのかを図で見てきました。これほど詳細に見ていくと、ControllerやServiceでExceptionが発生した際にSpringのログに残る数多くのスタックトレース内のメソッドやクラス（invoke, DispatcherServlet, preHandle, postHandleなど）の意味をより深く理解できるようになるでしょう。

長い記事でしたが、ここからもう少し踏み込んでみようと思います。それはInterceptorとFilterです。この2つの違いは、単純にServletが管理するかSpringが管理するかであり、呼び出しの順序とタイミングを知っていれば、将来Spring Securityを学習/適用する際に大きな問題はないでしょう。もちろん、ここまで来るのに十分に大変だった場合は、後日でも構いませんのでぜひ読んでいただきたいと思います。

# Spring InterceptorとFilterの違い

Springに限らず、どのようなWebアプリケーションでも一部のユーザーにサービスを提供するために公開されているため、セキュリティは絶対に必要です。Spring Securityは、基本的にログインとセッションに関連するモジュールや設定を簡単に利用できるように提供するだけでなく、別途開発した認証モジュールを適用したり、リクエストURLに応じて異なるセキュリティ処理を行ったりと、開発者が望むセキュリティ要素を、Spring Controllerに実際のリクエストが渡される前に実行されるように追加できます。この際に使用されるのが**Interceptor**と**Filter**です。

私たちはこれまで、Springを使用したWebアプリケーションが大きく**Tomcat (Webコンテナ)**と**Spring (Springコンテナ)**の2つで構成されることを学びました。**Interceptor**と**Filter**は、管理主体および実行時間がこの2つの構成要素、**Tomcat**と**Spring**に分かれると理解すれば良いでしょう。

> FilterはServlet仕様の一部であり、サーバー(Tomcat)によって呼び出されます。一方、InterceptorはSpringによって呼び出されます。[^2](https://stackoverflow.com/questions/26908910/spring-mvc-execution-order-filter-and-interceptor)

*   **FilterはServlet仕様の一部であり、Servlet (Tomcat) によって呼び出されますが、**
*   **InterceptorはSpringによって呼び出されます。**

以下は、InterceptorとFilterの管理主体および実行時間を分かりやすく表現した図です。

![Spring Web Application - 3. Filter and Interceptor](../../ko/spring-mvc-structure-and-security/spring-web-application-description-3-filter-and-interceptor.png)

## Filter (Tomcat)

*   Servlet (J2EE 7標準) 仕様に定義されています。
    *   Webアプリケーション (Tomcat) の**デプロイメント記述子 (web.xml) に設定**されます。
        *   この部分は最新のSpringでも設定可能です。
*   **1つ**の関数で**DispatcherServletの前/後に呼び出されます**。
    *   `doFilter()`
        *   リクエストが `DispatcherServlet.service()` に**入る直前**（`init()` の後）に呼び出されます。
        *   `DispatcherServlet.service()` が結果を**返す直後**（`destroy()` の前）に呼び出されます。

`doFilter` 関数が**リクエスト進入時と結果返却時の2回呼び出される**ため、**暗号化/復号化のような、リクエスト前と返却後の両方でグローバルに処理する必要があるロジックに適しています**。

## Interceptor (Spring)

*   Spring Framework仕様に定義されています。
    *   Springの**WebApplicationContextに設定**されます。
*   **3つ**の関数で**Controllerの前/後に呼び出されます**。
    *   `preHandle()` = **リクエストがControllerに入る直前**に呼び出されます。
    *   `postHandle()` = **Controllerが結果を返した直後**に呼び出されます。
    *   `afterCompletion()` = Controllerの結果に基づいて**Viewを生成した直後**に呼び出されます。

Controller**進入時、または結果返却時に詳細な処理が必要なロジックに適しています**。例えば、特定のURLに進入するリクエストに対しては、Controller進入直前にそのURLに特化した情報をセッションに事前に設定し、Controller内部ロジックで活用できるようにすることができます。他のURLであれば、このロジックを実行しないように条件を追加することも可能です。

---

重要な内容として、FilterとInterceptorは管理主体が異なるため、以下のような状況が発生する可能性があります。

FilterはSpring Containerの管理主体ではないため、Filterロジック内部でSpringのBeanを使用するには、`@Autowired`のようなBean注入ではなく、まずSpring `WebApplicationContext`オブジェクトを取得し、その中に設定されたBeanをハードコーディングを通じて直接取得して使用する必要があります。

## 複数InterceptorとFilterの呼び出し順序

FilterとInterceptorは、状況に応じて複数指定して使用できます。多数のFilterあるいはInterceptorを使用する際、FilterとInterceptorそれぞれにおける呼び出し順序は設定できますが、Filter - Interceptor - Filter - Interceptor のように混ぜる形式では不可能です。

**2つのFilter**と**2つのInterceptor**を使用する際にどのように動作するのか順序を調べるために、DispatcherServletとHandlerAdapterに焦点を当てて見てみると以下のようになります。

![Spring Filters and Interceptors](../../ko/spring-mvc-structure-and-security/order-of-filters-and-interceptors.png)

簡潔に要約すると、下記の図/流れのようになります。

![Spring Filters and Interceptors - Summary](../../ko/spring-mvc-structure-and-security/summary-order-of-filters-and-interceptors.png)

1.  `doFilter` (F1)
2.  `doFilter` (F2)
3.  `preHandler` (I1)
4.  `preHandler` (I2)
5.  **<u>Controller リクエスト処理</u>**
6.  `postHandler` (I2)
7.  `postHandler` (I1)
8.  **<u>View レンダリング</u>**
9.  `afterCompletion` (I2)
10. `afterCompletion` (I1)
11. `doFilter` (F2)
12. `doFilter` (F1)

WebサーバーからWebアプリケーションへ、WebサーバーとWebアプリケーションを接続するためのCGIの例としてServlet、そしてコンテナについて学んだ後、SpringコンテナとFilter、Interceptorの違い、そして実行順序について考察しました。Springを学習されている方や使用されている他の開発者の皆様にとって、この記事が役立つことを願っています。参照した記事も素晴らしい内容ですので、お時間があれば一度目を通すことをお勧めして締めくくります。

---

1.  [Springの動作原理 #1](https://asfirstalways.tistory.com/334), [#2](https://devpad.tistory.com/24), [#3](https://taes-k.github.io/2020/02/16/servlet-container-spring-container/)
2.  [TomcatがSpringを呼び出す方法](http://www.deroneriksson.com/tutorial-categories/java/spring/introduction-to-the-spring-framework)
3.  [Java Servlet](https://mangkyu.tistory.com/14)
4.  [Webサーバー、Webアプリケーションの違い](https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html)
5.  [Spring DispatcherServletの動作原理 #1](https://jess-m.tistory.com/15), [#2](https://dynaticy.tistory.com/entry/Spring-MVC-Dispatcher-Servlet-%EB%82%B4%EB%B6%80-%EC%B2%98%EB%A6%AC-%EA%B3%BC%EC%A0%95-%EB%B6%84%EC%84%9D)
6.  [Spring web.xml解説 #1](https://sphere-sryn.tistory.com/entry/%EC%8A%A4%ED%94%84%EB%A7%81%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%9D%98-%EA%B0%80%EC%9E%A5-%EA%B8%B0%EB%B3%B8%EC%84%A4%EC%A0%95-%EB%B6%80%EB%B6%84%EC%9D%B8-webxml%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90), [#2](https://gmlwjd9405.github.io/2018/10/29/web-application-structure.html)
7.  [Springの2種類のApplicationContext](https://jaehun2841.github.io/2018/10/21/2018-10-21-spring-context/#web-application-context)
8.  [Servlet Container & Spring Container](https://velog.io/@16616516/%EC%84%9C%EB%B8%94%EB%A6%BF-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88%EC%99%80-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88)
9.  [Spring MVC コードベースの動作原理](https://galid1.tistory.com/526)