# おみくじBOT ストロベリーショコラ OmikujiBot StrawberryChocolate README

最終更新日：<% tp.date.now('YYYY/MM/DD') %>

配信者のためのコメントアプリ「わんコメ」で使用できる、テンプレートです。

この内容は、BOOTH で配布している、 [おみくじBOT ストロベリーショコラ OmikujiBot StrawberryChocolate](https://pintocuru.booth.pm/items/7733810) の README となります。

## はじめに（Intro）

![intro_Disclaimer](../../template/jp/intro/intro_Disclaimer.md)

## このテンプレートは何？（Features）

### わんコメに BOT 機能を付与するジェネレーター

- 【おみくじBOT】は、わんコメに BOT 機能を付与するジェネレーターです。
- 特定のワード (おみくじ 等) をチャットに投稿することで、ランダムな結果を配信画面に表示します。
- 初見さん (初めてのコメント) や、通算 100 回目のコメントなど、特定の条件で発動し、配信画面に表示する機能があります。
- ピンとくる企画のオリジナルキャラクター「ストロベリーショコラ」を BOT キャラクターにしました。
  - 世話好きでお姉さんらしい雰囲気を持ち、甘く丁寧な接客が魅力です。

### シーン別・活用例

![features_SceneOmikuji](../../template/jp/features/features_SceneOmikuji.md)

### ストロベリーショコラのキャラクター設定

![ストロベリーショコラのイラスト（笑顔）](../../images/StrawberryChocolate-1792723579455.webp)

- **性格**
  - 世話好きで面倒見がよく、困っている人を見ると放っておけないタイプ。
  - お姉さんらしい落ち着きと包容力を持ち、相手を安心させる雰囲気があります。
- **口調**
  - 丁寧で柔らかい言葉遣いが基本。
  - 相手を優しく包み込むようなトーンで話し、時折ユーモアを交えて場を和ませます。
  - 呼びかけは「〜さん」と親しみを込めつつ、少し甘えさせてくれるようなニュアンスを持っています。
    - 悪いことをすると「〜ちゃん」とからかうことも？

## インストール（Installation）

![installation_ProPackage](../../template/jp/installation/installation_ProPackage.md)

## つかいかた（Usage）

### おみくじを発動させるには

![usage_OmikujiActivation](../../template/jp/usage/usage_OmikujiActivation.md)

### じゃんけん

![usage_JankenHonda](../../template/jp/usage/usage_JankenHonda.md)

### 初見判定ちゃん

![usage_FirstCounter](../../template/jp/usage/usage_FirstCounter.md)

### ギフトのお礼

![usage_Gift](../../template/jp/usage/usage_Gift.md)

### コメント数チェック (配信内・個人総合)

![usage_CountStream](../../template/jp/usage/usage_CountStream.md)

### コメント数を確認する

![usage_CheckNumber](../../template/jp/usage/usage_CheckNumber.md)

## カスタマイズ（Customization）

### 「おみくじBOT エディター」で自由におみくじを編集できる

![customization_ConfigEditor](../../template/jp/customization/customization_ConfigEditor.md)

![customization_CharacterCopyright](../../template/jp/customization/customization_CharacterCopyright.md)

![faq_OmikujiBotSection](../../template/jp/faq/faq_OmikujiBotSection.md)

![troubleshooting_OmikujiBotSection](../../template/jp/troubleshooting/troubleshooting_OmikujiBotSection.md)

## クレジット（Credits）

### ストロベリーショコラのイラスト

- pintocuru(せすじピンとしてます)
- 作者のオリジナルキャラクターです。生成AIを用いて制作し、作者が調整・加工を行っています。
- 本アプリ専用に制作された素材です。他の用途での使用・転載・再配布は禁止します。

![ストロベリーショコラのイラスト（歌っている姿）](../../images/StrawberryChocolate-1792730486518.webp)

あたしぃのデータはサンプル用だからぁ、自由に置き換えしてもらって結構よぉ♡

## ライセンス（License）

### JSON データ

![license_PackageJson](../../template/jp/license/license_PackageJson.md)

### 画像・イラスト等について

![license_PackageImage](../../template/jp/license/license_PackageImage.md)

### アプリ本体（ジェネレーター・エディター・プラグイン）

![license_App](../../template/jp/license/license_App.md)

### 効果音

![license_SoundEffect](../../template/jp/license/license_SoundEffect.md)

## バージョン情報（Version）

### ver.261022

- **おみくじBOT のバージョン**: v3.0.0-alpha3
- ゲームは「じゃんけん」に絞り、初見のあいさつやコメント数の管理のみにしました。
- ショコラの口調を、よりクセのある喋り（ありがとぉ、よろしくねぇ 等、小さい文字の付与）にしました。
- ライセンスキーの廃止により、PRO版限定の機能（フォント設定など）も使用できるようになりました。
  - 他のパッケージでは、エディターは有料ですが、このパッケージでは無料で利用できます。

![contact_Author](../../template/jp/contact/contact_Author.md)

<%* await tp.user.expandEmbeds(tp,'ja') %>
