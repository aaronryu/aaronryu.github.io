---
title: "VSCodeでHexoをデバッグする方法"
category: ["Workplace"]
created: 2021-02-06T17:57:26.000Z
updated: 2021-02-06T18:36:54.761Z
deck: "Hexoブログのテーマを自分好みに変更したいのに、修正したコードがどう反映されるか確認しづらくて困った経験はありませんか？VSCodeのデバッグ機能を活用してみましょう。Icarusのような最新テーマの.jsxコードを分析し、エラーを修正しながら自分だけのテーマを完成させる実践ガイドを紹介します。"
abstract: "Hexoテーマの核となるスタイルファイル（.styl）とレンダリングロジック（.jsx）の構造を理解し、VSCodeのlaunch.json設定を通じてローカルサーバーをデバッグする具体的な方法を学習します。これにより、複雑なテーマカスタマイズプロセスを視覚的に確認しながら効率的に進めるノウハウを習得できます。"
keywords: "Hexo, VSCodeデバッグ, テーマカスタマイズ, launch.json, Icarusテーマ"
description: "VSCodeを活用し、Hexoブログテーマのソースコードを直接修正し、リアルタイムでローカルサーバーの動作をデバッグしながらテーマをカスタマイズする環境設定方法を解説します。"
---

# Hexoテーマのカスタマイズ

Hexoで希望するテーマを選択しても、修正したい部分が出てくることがあります。テーマがYAMLベースの設定を提供しているとはいえ、さらに詳細な部分まで自分の思い通りに変更したい場合は、テーマコードを直接修正する必要があります。私がHexoインストール型ブログを始めた際に選んだIcarusテーマは、大きく2つのタイプのコードに分かれていました。

-   `.styl`: BulmaをベースとしたCSS設定が含まれています。
-   `.jsx`: .mdで作成された記事をページにどのようにレンダリングするかを定義しています。

## .stylファイルのカスタマイズ

幅、高さ、フォントサイズ、色などの設定は`.styl`コードで調整します。ブラウザでページの各要素のCSS設定を分析し、該当する設定があれば値を修正し、なければBulmaの設定がそのまま適用されるため、オーバーライドのために希望の設定を追加します。

![.stylファイルのカスタマイズ](../../ko/how-to-debug-hexo-using-vscode/debugging-styl.png)

## .jsxファイルのカスタマイズ

記事やウィジェットをページにレンダリングする部分は`.jsx`コードで設定します。画面にどのようにレンダリングされるか、修正したコードが正しく動作するかを知るためにはデバッグが必要です。Hexoブログの運営はVSCodeで行っているため、VSCodeでHexoをデバッグしています。

![.jsxファイルのカスタマイズ](../../ko/how-to-debug-hexo-using-vscode/debugging-jsx.png)

# デバッグ設定

VSCodeのデバッグ設定は、デバッグウィンドウのRUN右側にあるデバッグリストの「Add Configuration...」を通じて行うことができます。

![VSCodeで設定を追加](../../ko/how-to-debug-hexo-using-vscode/vscode-add-configuration.png)

「Add Configuration...」を選択すると、現在のプロジェクトディレクトリに`.vscode`ディレクトリと、その中に`launch.json`ファイルが作成され、そのファイルに移動して、以下のように追加する設定のリストが表示されます。

![VSCodeで設定追加のオプション](../../ko/how-to-debug-hexo-using-vscode/vscode-add-configuration-options.png)

リストから「Node.js: Launch Program」を選択すると、設定が1つ追加されます。

![Node.js: プログラムの起動](../../ko/how-to-debug-hexo-using-vscode/node-launch-program.png)

以下のように修正して入力します。

```json:launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Hexo Debugging",
            "program": "${workspaceFolder}/node_modules/hexo-cli/bin/hexo",
            "args": [
                "server"
            ]
        }
    ]
}
```

これはローカルで実行される`hexo server`のデバッグであるため、ターゲットプログラムは`hexo-cli`の`bin/hexo`であり、`args`に`server`が含まれていることがわかります。これでデバッグをしながら、自分だけのカスタムテーマを楽しく作成できます。さらに、そうして作成した自分だけのテーマを他の人と共有したり、既存のテーマにGitコントリビューターとして拡張機能を追加することも可能になるでしょう。

---

- https://gary5496.github.io/2018/03/nodejs-debugging/
- https://stackoverflow.com/questions/57125171/how-to-debug-inspect-hexo-blog

---