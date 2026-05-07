---
title: "Spring Security: SecurityContextHolder のスレッド共有戦略"
category: ["Troubleshooting", "Java 8+"]
created: 2021-03-14T14:35:26.000Z
updated: 2021-03-15T18:15:43.363Z
deck: "並列処理のために導入した`parallelStream`内でSpring Securityのセッション情報が断続的に消失するという奇妙なバグに遭遇しました。「シュレーディンガーの猫」のように、リロードするたびに結果が変わるこの現象の原因を掘り下げ、SecurityContextHolderがマルチスレッド環境でセッションデータを共有する3つの戦略について考察します。"
abstract: "リストフィルタリングロジックに`parallelStream`を適用した際、一部のスレッドでのみ権限確認が失敗する原因を分析します。SecurityContextHolderのデフォルト戦略である`MODE_THREADLOCAL`が子スレッドとコンテキストを共有できないことで発生する問題を診断し、これを解決するための`MODE_INHERITABLETHREADLOCAL`など、共有モードごとの特徴と注意点を学びます。"
keywords: "Spring Security, SecurityContextHolder, ThreadLocal, parallelStream, マルチスレッド, セッション共有"
description: "Spring Security環境で並列ストリームを使用する際にセッション情報が失われる現象を通して、SecurityContextHolderの3つのスレッド共有戦略とマルチスレッド環境でのセッション管理における注意点を説明します。"
---

多数の情報をリスト表示するページで、現在ログインしているユーザーが持つ権限に基づいて一部の情報が表示されないようにする処理が必要でした。そこで、まずAPIからリストを取得し、現在のSpring Securityログインセッションに保存されている権限を使用して一部の情報をフィルタリングし、最終的に表示ページにレンダリングする作業を行いました。

しかし、不思議なことに、**リストに表示される行が全部で10個ある場合、約2〜3個、つまり約1/4の行にのみ「セッション権限フィルタリング」ロジックが適用され、残りの3/4には適用されないというバグを発見しました。** さらに、1/4に該当する2〜3個は、リロードするたびに不規則に変化していました。例えば、一度リロードすると2番目と3番目の行に「セッション権限フィルタリング」が適用され、もう一度リロードすると5番目と6番目の行に適用されるといった具合です。まるでシュレーディンガーの猫のようでした…

実装は以下の通りでした。

```java
List<SomeInformation> list = someApi.retreive(condition);
list.parallelStream()
    .forEach(each -> {
        if (!SecurityHelper.hasRole("ROLE_CAN_SEE_SENSITIVE_NUMBERS")) {
            each.setSensitiveNumber1(null);
            each.setSensitiveNumber2(null);
        }
    })
```

```java
public class SecurityHelper {

    public static boolean hasRole(String role) {
        SecurityContext context = SecurityContextHolder.getContext();
        if (Objects.isNull(context))) {
            return false;
        }
        Authentication authentication = context.getAuthentication();
        if (Objects.isNull(authentication))) { // `auth`を`authentication`に修正
            return false;
        }
        for (GrantedAuthority eachAuthority : authentication.getAuthorities()) { // `GrantAuthority`を`GrantedAuthority`に修正
            if (role.equals(eachAuthority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}
```

実際にテストしたログインアカウントには`ROLE_CAN_SEE_SENSITIVE_NUMBERS`権限があったため、リストのすべての行で`sensitiveNumber1`、`sensitiveNumber2`が正常に表示されるのが正しいはずです。**しかし、1/4しか表示されないのはどう考えてもおかしいので、`parallelStream.forEach`の内部にログを追加してみたところ、以下の結果が得られました。**

```
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-3] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-2] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-7] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-1] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [http-nio-80-exec-3] [TEST] hasRole: true
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-4] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-5] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-6] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [ForkJoinPool.commonPool-worker-2] [TEST] hasRole: false
INFO 2021-01-01 00:00:01 [http-nio-80-exec-3] [TEST] hasRole: true
```

見てみると、ForkJoinPool、つまり`ParallelStream`の実行のために割り当てられた**子スレッド**(`ForkJoinPool.commonPool-worker-1~7`)では`hasRole`が異常に`false`を返し、**メインスレッド**(`http-nio-80-exec-3`)では`hasRole`が正常に`true`を返していることがわかります。どうやら`ParallelStream`と`SecurityContextHolder`の併用が問題のようです。

# SecurityContextHolder のスレッド間共有モード

`ParallelStream`のスレッドで`hasRole = false`が返された第一の原因は、`SecurityContext context = SecurityContextHolder.getContext()`呼び出し時に`null`が返されていたことです。一方、メインスレッドで`SecurityContextHolder.getContext()`を呼び出すと、正常にセッションデータを取得でき、`hasRole`に適切な比較ロジックを実行できました。調べてみたところ、以下の事実を発見しました。

> SecurityContextHolder は、SecurityContext ログインセッション情報をどのレベルのスレッドまで共有するかモードを指定できるようになっています。デフォルト値は**MODE_THREADLOCAL**であり、SecurityContext 情報は**「メインスレッド」**でのみ見ることができます。

共有モードは合計3種類あります。

-   **MODE_THREADLOCAL**: (デフォルト) ローカルスレッド内でのみ共有可能
-   **MODE_INHERITABLETHREADLOCAL**: ローカルスレッドが生成した子スレッドにまで共有可能
-   **MODE_GLOCAL**: すべてのスレッド、アプリケーション全体で共有可能

デフォルトモードは**MODE_THREADLOCAL**だったため、何も設定していなかったサーバーでは、**メインスレッド**(`http-nio-80-exec-3`)でのみ`SecurityContext`が返され、残りの**子スレッド**(`ForkJoinPool.commonPool-worker-1~7`)では`null`が返されていたのです。

# まとめ

SecurityContextHolderのデフォルト設定は、SecurityContext情報をローカルスレッドのみで共有するように設計されているため、SecurityContextHolderを子スレッド内で直接呼び出して使用するよりも、メインスレッドで呼び出してその値を子スレッドから参照する方が、パフォーマンス的にもコードの可読性的にもよりクリーンなコードになるでしょう。

**`ParallelStream`や`Async`関連の機能を使用する際、子スレッドでSecurityContextHolderを使用する必要がある場合は、SecurityContextHolderの共有モードを`MODE_INHERITABLETHREADLOCAL`に切り替えることを検討すべきです。**

---

-   [Spring Security - SecurityContextHolder Strategy](http://ncucu.me/116)

---