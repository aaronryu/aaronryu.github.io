---
title: "Docker基本概念をサッと見てみる"
category: ["Deployment"]
created: 2020-08-19T17:52:48.000Z
updated: 2021-02-04T16:17:46.181Z
deck: "サービス環境構築のたびに直面する複雑な設定やリソース無駄の問題を解決するために登場したDockerの核心的な哲学を探ります。仮想マシン（VM）より軽量なコンテナ技術が、どのようにアプリケーションのデプロイと管理を革新したのか、その構造的な違いを掘り下げて解説します。"
abstract: "単一ホストOS上で論理的にリソースを分配するコンテナの概念をVMと比較しながら詳細に学習します。Dockerイメージの定義からコンテナとの関係、そして実際のサービスデプロイのためのDockerfileの作成方法と主要コマンド（FROM, ENV, COPY, EXPOSEなど）を実務例を通して理解します。"
keywords: "Docker, コンテナ, VM vs コンテナ, Dockerfile, 仮想化"
description: "仮想マシンよりも効率的なリソース管理をサポートするDockerのコンテナ技術とイメージベースのデプロイ方式を説明し、サーバー環境構築のためのDockerfile作成ガイドを提供します。"
---

# Dockerをなぜ使用するのか？

1つのサーバー上で多様なアプリケーションを稼働させる場合、複数のVMを構築し、それぞれのアプリケーションにVMを割り当てる方法もあります。しかし、Dockerは各アプリケーションをVMよりも軽量なコンテナ単位でパッケージングおよび管理することを可能にします。

# コンテナとは何か？

## VM vs コンテナ

VMの概念は、単一のホストOS上に複数のゲストOSを置き、それぞれのアプリケーションを単一のゲストOSにマッピングするものです。

> [ ホストOS - [ **VM**: ゲストOS - ライブラリ - アプリ ] ]

**コンテナは、単一のホストOS上で複数のアプリケーションを直接稼働させることができる、VMよりも軽量な単位**です。ホストOSとコンテナ間のポートフォワーディングやファイルシステム（ディレクトリ）連携などは、後述するイメージ設定によって可能です。

> [ ホストOS - [ **コンテナ**: ライブラリ - アプリ ] ]

VMはハイパーバイザーによって物理リソースが管理されるのに対し、コンテナはDockerによって論理的にリソースが分配されます。

-   VM: ハイパーバイザーによるハードウェア仮想化
-   コンテナ: DockerによるホストOS仮想化

かつて学部時代にデモ実行のため、マルチノードHadoop構成時に使用経験のあるLXC（Linux Container）の概念がDockerの初期バージョンの実装だったとされていますが、その後Dockerは独自のコンテナを使用するようになったとのことです。

## イメージとコンテナ

Dockerに初めて触れた際に明確に区別できなかった概念があります。「Image」と「Container」です。ImageはVMにおける概念と同じなので、比較的簡単に理解できるでしょう。

-   **Image**は、コンテナ起動のためのファイルシステムと、起動に必要な設定群が集められた**静的な設定**であり、
-   **Container**は、上記のImageを基に実際に稼働（Runtime）した**動的なインスタンス**と見なすことができます。

# コンテナをなぜ使用するのか？

## アプリケーション単位での管理

アプリケーション単位でのパッケージングを可能にすることで、開発時の役割と責任（R&R）を分離できます。ウェブサービスを開発する際、1つのサーバーインスタンスに多様な役割が含まれていますが、これらをそれぞれ独立したコンテナとして分離することが可能です。

-   **nginx**: 静的ページの提供およびSPAフロントエンド
-   **tomcat**: フロントエンドに提供されるAPIサーバー
-   **logstash** (ログ収集): nginx、tomcatで発生するログをログ蓄積サーバーに転送
-   **prometheus** (メトリック収集): nginx、tomcatで発生するエラーログやCPU、メモリなどのリソース状態を状態管理サーバーに転送
-   **pinpoint** (性能測定): tomcatから他のサーバーへのAPIコール回数、遅延時間などを性能管理サーバーに転送

つまり、上記の例のように、1つのサーバーインスタンス上で合計5つのコンテナを稼働させることができます。

もしフロントエンドに提供するAPIサーバーだけでなく、外部から直接呼び出せるAPIサーバーを追加したい場合、tomcatコンテナをもう1つ追加することで、合計2つのtomcatを1つのサーバーインスタンスに置いて使用することができます。JavaベースのtomcatをPythonベースのDjangoに置き換えることも可能です。フロントエンドを提供するnginxサーバーはそのままに、APIサーバーだけが置き換えられた形になります。

各アプリケーションをレゴブロックのように管理できることは、デプロイにおいても大きな利点があります。単一のコンテナバージョンのみを更新したい場合、そのコンテナのイメージを再度取得して再デプロイを行うだけで済みます。これにより、各コンテナごとに個別のバージョン管理が可能になります。

> アプリケーションをレゴブロックのように管理できるという利点はVMも持っていますが、それよりも**コンテナが好まれる理由は、仮想化のレベルが上位であるため軽量であり（コンテナ = 軽量VM）、前述のようにバージョンおよびデプロイ管理がイメージで行われるため、①イメージ設定と②デプロイが分離されており、プロセスの自動化が容易だからです。[性能面でも、コンテナ間のI/Oおよびネットワーク処理において高速です。](https://medium.com/@darkrasid/docker%EC%99%80-vm-d95d60e56fdd)** 仮想化のレベルが低いVMは、セキュリティ面でのカプセル化がコンテナよりも優れていると言われていますが、現在の技術では両者の間にどれほどの大きな違いがあるのか気になるところです。

このように、Dockerではアプリケーションが稼働する環境と稼働させるイメージを設定します。アプリケーションそれぞれの自己設定はDockerとは別にプロジェクト内部に設定しておけばよいでしょう。これは責任の分離と言えます。

# Docker使用時に遭遇する用語

-   **Registry** = イメージストレージ
    -   イメージを保存しておく中央リポジトリ。
    -   一般的に、デプロイパイプラインを構築する場合、最新のソースコードからDocker Engineで生成したtomcat/nginxイメージをRegistryにアップロードした後、そのイメージで最終的なサーバーデプロイを実行します。
    -   デフォルトのDocker Hubサーバー、または会社/個人用のDocker Hubサーバーを作成して使用するか、
    -   Amazon AWSが提供するECR（AWS EC2 Container Registry）を使用することもできます。
-   **Image**
    -   前述したように、コンテナ動作のためのファイルシステムと、起動に必要な設定群が集められた静的な設定です。
    -   [ImageはRO（Read-Only）ファイルシステムの集合](https://docs.docker.com/engine/storage/drivers/#images-and-layers)です。
        -   さらに[詳細なファイルシステム構造]()については、以下を参照してください。
-   **Container**
    -   上記Imageを基に実際に稼働（Runtime）した動的なインスタンス
-   **Application** / **Service** = 単一ホスト上のコンテナ群
    -   これには**Docker Compose**を使用して**単一のホストマシン上でContainersを管理**します。
-   **Orchestration** = 複数ホスト上のコンテナ群管理 (システム、MSA)
    -   これには**Docker Swarm**を使用して**複数のホストマシン上でContainersを管理**します。

# Docker Engine

[**① Image生成** および **② Container起動**の両方を担当するエンジン](https://www.quora.com/What-is-the-difference-between-the-Docker-Engine-and-Docker-Daemon)であり、その構成は以下の通りです。

-   コンテナおよびイメージ生成のためのユーザー入力を受け付ける**Docker CLI**
-   コンテナ起動のための**Docker Daemon**

## Image生成

コンテナはImageに基づいて起動されるため、希望するコンテナを起動する前に、まず希望するImageを作成する必要があります。Imageの生成から最終的なコンテナの起動までは、3つのステップで構成されます。

-   Dockerfile - Dockerfileの作成

Dockerfileを使って、希望するImage生成に関する設定（生成ルール）を複数のコマンドで記述します。この設定に基づいてImageが生成され、生成されたImageを基に後にコンテナとして起動することになります。以下は簡単なコマンド集です。

> **FROM**: 基本となるベースイメージを定義します。取得するイメージのURLを記述します。<br>
> **ENV**: イメージ内の環境変数を設定します。Linuxターミナルでの`SET_VALUE=3` & `echo $SET_VALUE`をイメージしてください。<br>

> **RUN**: 実行するシェルコマンドを明記すると、**イメージビルド時**にそのコマンドを実行します。<br>
> **CMD**: 実行するシェルコマンドを明記すると、**イメージビルド完了後にコンテナが正常に実行されたとき**にそのコマンドを実行します。<br>

> **EXPOSE**: 外部に公開したいポートを設定します。**コンテナポートと実際のホストで公開するポートを接続**します。<br>
> **WORKDIR**, **ENTRYPOINT**: RUN/CMDで指定したシェルを実行するディレクトリ位置を指定します。<br>
> **ADD**, **COPY**: ホストのディレクトリや**ファイルをイメージにコミット**します。<br>
> **VOLUME**: ホストのディレクトリや**ファイルをイメージにコミットせず、コンテナディレクトリに接続**します。<br>

> … その他のコマンドと詳細な説明は、公式Dockerドキュメントを参照してください。

-   Build (docker build) - イメージ生成

`docker build`コマンドを実行すると、まず作成済みのDockerfileがDocker Daemonに渡されます。その後、Dockerfileスクリプト内の各コマンドごとに実行するためのコンテナを起動し、コマンドが正常に実行されれば、そのスナップショットからイメージを生成します。以下の例で確認できる`docker build`の実行ログを見ると、**DockerはDockerfile内の各コマンドが実行されるコンテナのIDと、実行が完了したコンテナのスナップショットから生成されたイメージIDの両方を返す**ことがわかります。

もしコマンド実行中に失敗した場合、そのコマンドが実行されているコンテナIDにシェルを通じてアクセスし、ログを確認することができます。このように、途中で返されるコンテナIDを通じて`docker build`のデバッグが可能です。つまり、Dockerfileスクリプトの最終行が実行完了したコンテナのスナップショットが、最終的に我々が生成するイメージとなるわけです。

-   **ビルドはDockerfileをDocker Daemonに渡すことから始まります。**

Docker Daemonは、DockerfileのFROMコマンドで指定された、新しく生成するイメージのベースとなるイメージを取得します。

```bash
$ docker build .

Sending build context to Docker daemon 10240 bytes

Step 1/3 : FROM base-image:1.7.2
Pulling repository base-image:1.7.2
 ---> e9aa60c60128/1.000 MB (100%) endpoint: https://my-own.docker-registry.com/v1/ // [!code highlight]
```

個人Docker Registryである`https://my-own.docker-registry.com/v1/`から`base-image:1.7.2`イメージが取得されました。最終行の`e9aa60c60128`は、ダウンロードされたベースイメージにDockerが割り当てたIDです。次に実行されるコマンドは、このイメージをベースとして中間イメージを作成します。

-   **その次のコマンドは、以前に生成された中間イメージを再度コンテナとして起動し、コマンドを実行した後、そのスナップショットをイメージとして返します。**

```bash
Step 2/3 : WORKDIR /instance
 ---> Running in 9c9e81692ae9
Removing intermediate container 9c9e81692ae9
 ---> b35f4035db3f
```

直前に実行したFROMコマンドの結果として`e9aa60c60128`中間イメージが生成されました。このイメージで新しいコンテナ`9c9e81692ae9`を起動し、その内部で`WORKDIR /instance`コマンドを実行した後、実行完了したコンテナを削除し、そのスナップショットを`b35f4035db3f`イメージとして返したことがわかります。

-   **Dockerfile内のすべてのステップを完了した後、最後に生成されたスナップショットイメージが、私たちが最終的に得るイメージとなります。**

```bash
Step 3/3 : CMD echo Hello world
 ---> Running in 02071fceb21b
Removing intermediate container 02071fceb21b
 ---> f52f38b7823e

Successfully built f52f38b7823e
```

私たちが得る最終イメージ名（ID）を`f52f38b7823e`ではなく、任意の名前を付けたい場合、tagオプションを通じて名前を付けることができます。例えば、`base-image:1.7.2`で新しいイメージを作成したので、`custom-image:1.7.2`と名付けることができます。

-   **Push** (`docker push`) - 作成したイメージを最後にDocker Registryに保存します。

## コンテナ起動

生成された最終Imageで、Docker Daemon上でContainerを起動します。

-   **Pull** (`docker pull`) - コンテナを起動するために保存されているイメージを取得します。
-   **Execute** (`docker run`) - 取得したイメージでコンテナを起動します。

# Dockerイメージ設定の例

商品情報の保存/照会サービスを提供するため、**フロントエンドサーバーはnginx**(React.js)で、**バックエンドサーバーはtomcat**(Java)でサービスを提供しようとしています。これら2つのアプリケーションをそれぞれコンテナとして、合計2つのコンテナを1つのAWS EC2サーバーインスタンス上で稼働させます。

## nginx用Dockerfileの例

まず、nginxイメージの設定を見てみましょう。nginxの起動にはシェルスクリプトを実行しますが、自作の`replace-hosts-and-run.sh`シェルをイメージに注入し、適切な環境変数とともに実行して、最終的にnginxサーバーを立ち上げることを目標とします。

```dockerfile
# 1. 基本ベースイメージを取得します。フロントエンドサーバー用のnginx基本イメージをプルします。
FROM http://docker-hub.aaronryu.com/nginx:1.8.0

# 2. nginxウェブサーバーで多言語サポートのためのgettextをインストールします。
RUN apk --no-cache add gettext

# 3. 現在のプロジェクトディレクトリ内のfiles/, build/, およびシェルスクリプトを、イメージ内の指定したディレクトリに追加/コピーします。
ADD files/ /instance/program/nginx/conf
ADD build/ /instance/service/webroot/ui
ADD replace-hosts-and-run.sh /instance/program/nginx/replace-hosts-and-run.sh

# 4. 上記シェルスクリプト(replace-hosts-and-run.sh)で使用するホスト名環境変数を設定します。
ENV NGINX_HOST aaronryu.frontend.com

# 5. ロギングなどのため、nginxコンテナ内の以下のディレクトリをホストのディレクトリに接続します。
# (コンテナが以下のディレクトリに対して行う操作は、実際のホストディレクトリに反映されます。)
VOLUME ["/instance/logs/nginx"]

# 6. 「イメージ完了後」に、先ほどコピーしておいた以下のシェルスクリプトを、上記の環境変数とともに実行（CMD）します。
CMD /instance/program/nginx/replace-hosts-and-run.sh
```

## tomcat用Dockerfileの例

nginxサーバーのSPA静的ページから照会および保存を行うには、それに対応するAPIが必要です。これらのAPIを提供するためのtomcatサーバーを起動します。Javaサーバーであるため、JVMの設定を追加し、外部からこのサーバーの状態を照会できるように12345番ポートを開放します。

```dockerfile
# 1. 基本ベースイメージを取得します。バックエンドサーバー用のtomcat基本イメージをプルします。
FROM http://docker-hub.aaronryu.com/tomcat:8.0.0-jdk8

# 2. tomcatの実装はSpring Bootで行われています。起動時にproductionプロファイルオプションを指定します。
ENV SPRING_PROFILE production

# 3. tomcatはJavaベースのサーバーであるため、JVMメモリオプションを追加します。
ENV JVM_MEMORY -Xms2g -Xmx2g -XX:PermSize=512m -XX:MAxPermSize=512m

# 4. 現在のプロジェクトディレクトリ内に保存されているsetenv.shを、イメージ内のtomcat実行シェルファイルに追加/コピーします。
ADD setenv.sh ${CATALINA_HOME}/bin/setenv.sh

# 5. 現在のプロジェクトビルドが完了した後、生成されたすべてのwarファイルをtomcat実行のwebappsに追加/コピーします。
COPY build/libs/*.war "${CATALINA_HOME}" /webapps/ROOT.war

# 6. 設定したtomcatサーバーポート8080をホストの12345ポートに接続し、外部に公開します。
EXPOSE 8080 12345

# 7. ロギングなどのため、tomcatコンテナ内の以下のディレクトリをホストのディレクトリに接続します。
# (コンテナが以下のディレクトリに対して行う操作は、実際のホストディレクトリに反映されます。)
VOLUME ["/instance/logs/tomcat", "/instance/logs/tomcat/catalina_log", "/instance/logs/tomcat/gc"]
```

上記の例で見てきた各Dockerfileは、それぞれnginxとtomcatプロジェクト内に配置されます。これら2つのコンテナを1つのインスタンスに同時に起動させるには、Docker Compose設定（例：.yml）で各コンテナのイメージをまとめて明記すればよいでしょう。

---

- https://medium.com/@darkrasid/docker%EC%99%80-vm-d95d60e56fdd
- https://docs.docker.com/storage/storagedriver/#images-and-layers
- https://rampart81.github.io/post/docker_image/
- https://www.quora.com/What-is-the-difference-between-the-Docker-Engine-and-Docker-Daemon
- https://www.joyfulbikeshedding.com/blog/2019-08-27-debugging-docker-builds.html