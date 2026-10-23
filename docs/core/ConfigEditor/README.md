# おみくじ BOT コンフィグエディター OmikujiBot ConfigEditor

最終更新日：2026/01/22

配信者のためのコメントアプリ「わんコメ」で使用できる、 ジェネレーター BOT 「おみくじ BOT」のデータを編集できるアプリケーションです。

この内容は、BOOTH で配布している、 下記に同梱している 「コンフィグエディター」 の readme となります。

- [おみくじBOT ストロベリーショコラ OmikujiBot StrawberryChocolate](https://pintocuru.booth.pm/items/7733810)
- [おみくじ BOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa](https://pintocuru.booth.pm/items/5471598)
- [おみくじ BOT みんなのずんだもん OmikujiBot EveryoneZunda](https://pintocuru.booth.pm/items/6053855)
- [おみくじ BOT 高飛車な四国めたん OmikujiBot DivaMetan](https://pintocuru.booth.pm/items/6058829)
- [おみくじ BOT じゃんけん OmikujiBot HondaJanken](https://pintocuru.booth.pm/items/7383088)
- [おみくじ BOT カード駅 OmikujiBot CardStation](https://pintocuru.booth.pm/items/7412886)
- [おみくじ BOT タロットカード OmikujiBot TarotCard](https://pintocuru.booth.pm/items/7432682)
- [おみくじ BOT 超おみくじ OmikujiBot BigBangFortune](https://pintocuru.booth.pm/items/7440428)
- [おみくじ BOT スイカジェネレーター +カボチャ&クジラ OmikujiBot GouseiSuika](https://pintocuru.booth.pm/items/5813323)
- [おみくじ BOT ボンバースロット OmikujiBot BomberSpin](https://pintocuru.booth.pm/items/7730686)
- [どこでもドラちゃん Bot OmikujiBot 5percent_Dora](https://pintocuru.booth.pm/items/7291931)

## はじめに（Intro）

- [わんコメ](https://onecomme.com/) の機能を前提としたソフトウェアです。
- 本ソフトウェアの利用は自己責任でお願いいたします。
- 仕様は予告なく変更される場合があります。

## このアプリは何？（Features）

![](./images/features-04.webp)

### おみくじ BOT を自分好みに設定できる専用エディター

【おみくじ BOT コンフィグエディター OmikujiBot ConfigEditor】は、[おみくじ BOT](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/OmikujiBot/README.md) 専用のエディターです。おみくじの内容や演出を、直感的にカスタマイズできます。

1. **おみくじの確率や制限が自由に行える**
   - おみくじの内容や、演出のタイミングを自由に変更可能
   - 出現確率も自由に設定可能、パチスロのような 1/65536 にも
   - 「メンバー限定」「ギフト」など、発動条件を自由に設定
   - 引ける回数を制限（例：1 日 1 回、連投制限）
2. **多彩なおみくじ結果をサポートする「プレースホルダー」機能**
   - 抽選の重さを使った簡易設定から、プレースホルダー機能を使った高度なおみくじまで対応
   - 1000 通り以上の複雑なおみくじも簡単に作成
   - プレースホルダー設定の「テキストモード」で、大量データも楽に入力
3. **フキダシのカラーやスタイルを変更できる**
   - フキダシ色やアニメーションの変更を、エディター内で動作確認
   - DaisyUi を使用した、可読性と装飾性を兼ねたカラーテンプレート
4. **シンプルにも賑やかにもできるキャラクター関連**
   - キャラクター画像が使えます。自作画像の使用も可能！
   - キャラクターごとに読み上げを変えられます
5. **PRO 版限定機能**
   - 「テンプレート出力」が可能（特定条件で配布も可能）
   - プラグインを使うことで、複数のデータを管理可能

## インストール (Installation)

### [1. おみくじ BOT のアップグレード / コンフィグエディターの新規導入](../../template/jp/installation/Installation_52_VersionUp.md)

- コンフィグエディターは、一部のおみくじ BOT のパッケージに付属しています。
- 付属していない場合でも、無料で コンフィグエディター の導入が可能です。

### [2. おみくじBOT コンフィグエディター PRO (有料版) のご案内](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_51_ProUpgradeTemplate.md)

## つかいかた (Usage)

おみくじデータに関する設定方法は、それぞれエディターに詳細が書かれています。現在も開発中であり、機能が多岐にわたるため、すべてをこの README に記載することはしていません。

**基本的な使い方のヒント**：
- エディターを開くと、各項目にツールチップや説明が表示されます
- 設定項目は直感的に操作できるように設計されています

![](./images/usage-05.webp)

### 【重要】 設定の保存方法

仕様上、コンフィグエディターは途中の保存が行えません。閉じたりリロードすると内容が消えてしまうため、保存は注意深く行ってください。

**内容の反映のさせ方**

1. 「設定を出力 (js)」ボタンを押すと、ブラウザから「omikujiData.js」というファイルが保存されます。
2. コンフィグエディターと同じフォルダに、ダウンロードした「omikujiData.js」を上書き保存します。

### 【PRO 版】 テンプレート出力 (json)

テンプレートを JSON データとして書き出すことができます。

- バックアップ用途や、自作テンプレートの保存・共有にご利用いただけます
- 改変したデータの再配布については、**CC BY 4.0 ライセンス**に準じつつ、独自の制限が適用される場合があります。再配布の可否は各ファイル内のライセンス表記を必ずご確認ください。
- 一部のパッケージでは、テンプレート出力ができないよう、ライセンス記入項目をなくしています。

### 【PRO 版】 テンプレート読み込み (json)

![](./images/usage-06.webp)

配布されている JSON ファイルや、バックアップとして出力した JSON ファイルを読み込むことができます。

- **マージ**：既存データに新しいデータを追加（重複は上書き）
- **置き換え**：既存データを削除して、新しいデータに差し替え
- ライセンス情報や一部の設定は上書きされません。

> 📝 読み込み前に、現在のテンプレートをバックアップしておくことをおすすめします。 読み込み後は、設定内容を確認し、必要に応じて微調整してください。

## よくある質問 (FAQ)

### エディター関連

#### Q. このエディターで何が編集できる？

A. [おみくじ BOT](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/OmikujiBot/README.md) で表示させるおみくじ結果を編集できます。

#### Q. 元に戻す（Undo）はできる？

A. Undo 機能は付いていません。こまめに保存していただくようお願いします。

#### Q. 作成したデータを他の人と共有できますか？

A. 配布データをそのまま再配布することは禁止です。内容を編集し、配布データにない要素を付与した json データについては、配布できる場合があります。詳しくは Readme をお読み下さい。

#### Q. おみくじ BOT 用 WordParty を編集したい

A. 通常の WordParty と同様に編集が可能です。詳しくは [WordPartyエディタの見方と設定](https://onecomme.com/docs/feature/wordparty-editor) をご覧ください。

#### Q. 最新のバージョンより古いデータで作成したファイルは読めますか？

- **v1.0.0 以降**で作成されたファイルは、問題なく読み込めます。
- **v0.8-beta** のファイルも、かろうじて読み込める可能性はありますが、動作の保証はできません。
- **v0.73 以前**のデータは互換性がないため、読み込むことはできません。

## トラブルシューティング (Troubleshooting)

### Q. データを記入したのに、ジェネレーターに反映されていない

A. **このコンフィグエディターは、自動保存ではありません。** 保存ボタンを押し、出力されたファイルを上書きする方法で保存を行う必要があります。詳しくはつかいかた (Usage) の、【重要】 設定の保存方法をご覧ください。

### Q. ダイアログを出した時、一部表記が隠れる

### Q. エディターで記入したが反映されない、ボタンを押しても反応しない、等

A. 一部動作に不具合がある可能性があります。バグを見つけたら連絡ください。

## ライセンス（License）

### アプリ本体（ジェネレーター・コンフィグエディター）

- Copyright © 2023-2026 Pintocuru(せすじピンとしてます)
- 本ソフトウェア (おみくじ BOT) は、著作権者の許可なく再配布することを禁じます。
- 本ソフトウェアは、Github、または BOOTH にて提供される各パッケージに含まれる形でのみ配布されます。
- 改変・逆コンパイル・再販売も禁止されています。

### パッケージデータ

パッケージごとにライセンス形態（商用利用可否・改変可否など）が異なります。詳しくは各パッケージの README または商品ページをご確認ください。

## バージョン情報

> 詳細な変更履歴は [Releases](https://github.com/Pintocuru/OmikujiBot-Docs/releases) をご覧ください。

作成者：せすじピンとしてます @pintocuru

[Twitter](https://twitter.com/pintocuru) | [YouTube](https://www.youtube.com/@pintocuru)