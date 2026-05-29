# おみくじ BOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa README

最終更新日：2026/01/22

配信者のためのコメントアプリ「わんコメ」で使用できる、 テンプレートです。

この内容は、BOOTH で配布している、 [おみくじ BOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa](https://pintocuru.booth.pm/items/5471598) の readme となります。

## はじめに（Intro）

- [わんコメ](https://onecomme.com/) の機能を前提としたソフトウェアです。
- 本ソフトウェアの利用は自己責任でお願いいたします。
- 仕様は予告なく変更される場合があります。

## このテンプレートは何？（Features）

### ゆっくり霊夢と魔理沙がリスナーを歓迎してくれるジェネレーター

- わんコメに BOT 機能を付与するジェネレーター【おみくじ BOT】を使った、ゆっくり霊夢と魔理沙が楽しく出演するテンプレートです。
- 解説動画でも良く使われる、「ゆっくり霊夢」「ゆっくり魔理沙」を BOT キャラクターにしました。

### シーン別・活用例

- **朝活配信**
  - 今日 1 日の運勢を占う「おみくじ」で、配信が賑やかに。
- **雑談配信**
  - リスナーのコメントに対してキャラクターがボケたりツッコミを入れたりして、自然に会話が広がります。
- **ゲーム配信**
  - ゲームに集中していても、BOT が代わりに挨拶してくれるので、初見さんを見逃しません。

### ゆっくり霊夢のキャラクター設定

![](images/reimu.webp)

このジェネレーターでは、ゆっくり霊夢を以下のようなキャラクターとして登場させています。

- 誰にでも笑顔で接する親しみやすい存在
- ただし初見詐欺テメーはダメだ
- じゃんけんは圧倒的に強いが、負けても楽しそうに振る舞う

### ゆっくり魔理沙のキャラクター設定

![](images/marisa.webp)

ゆっくり魔理沙は、ゆっくり霊夢の相棒のような立ち位置で登場します。

- 登場頻度は霊夢よりも低め（約 20%）
- いたずらっ子。リスナーには気さくに話しかける。
- 「初見詐欺」にはノリの良いツッコミを入れる
- じゃんけんは本気で勝ちにいくタイプで、負けると悔しがる

### キャラクターの立ち位置・セリフについて

- 原作とは異なる「二次創作」キャラクターのため、一般的に知られているようなキャラクター像とは異なる言動やセリフが見られる場合があります。
- おみくじ BOT の博麗神社は、賽銭 (スパチャ・ビット等) が比較的多めに入るようで、巫女である霊夢も金銭に困っていないようです。
  - でも、お賽銭はもっと欲しいそうです。
- おみくじ BOT のゆっくり魔理沙は、キノコだけでなく、花にも詳しい設定になっています。（フラワー占い という機能で実装しています）

## インストール (Installation)

1. [テンプレートのインストール方法](https://github.com/Pintocuru/OmikenReadme/blob/main/docs/TemplateInstall/README.md)
2. [おみくじ BOT のアップグレード](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_52_VersionUp.md)
3. [【推奨】おみくじ BOT 演出用 WordParty2.0 の導入方法](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/OmikenWordParty/README.md#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95-installation)
	- [おみくじ BOT 演出用 WordParty2.0 とは?](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/OmikenWordParty/README.md#%E3%81%93%E3%81%AE%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%81%AF%E4%BD%95features)
4. [おみくじBOT コンフィグエディター PRO (有料版) のご案内](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_51_ProUpgradeTemplate.md)

## つかいかた (Usage)

### おみくじを発動させるには

![](../../template/usage/images/92_OmikujiActivation.webp)

- 配信で実際に使う前に、**わんコメのコメントテスターで動作確認**することをおすすめします。
- コメントテスターは、わんコメのメニューから「コメントテスター」を選択してご利用ください。
- OBS 等のストリーミング配信アプリに正しく導入されていれば、コメントに「おみくじ」などのキーワードを送信することで発動します。

### おみくじ

> 発動ワード : `おみくじ` / `omikuji`

- 「おみくじ」BOT らしく " 博麗神社の巫女 " が、おみくじの結果を教えてくれます。
- 「大凶」の代わりに「残念賞」が入ってますが…入れたのは魔理沙らしい。

### フラワー占い

> 発動ワード : `フラワー` `Flower`

- ちょっと本格的な、花を使った色占いです。
- 「キノコ好き」という、ゆっくり魔理沙の設定から、キノコに関するうんちくも聞けます。

### じゃんけん

![](../../core/OmikujiBot/images/faq-01.webp)

> 発動ワード : `じゃんけん` / `janken`/ `グー`/ `チョキ`/ `パー`

- じゃんけんの勝率は 1/2、あいこを「負け」とカウントしても、1/3 だと考えていませんか。
- この「じゃんけん」は、じゃんけんの猛者 [「ケイスケ ホンダ」](https://dic.pixiv.net/a/%E6%9C%AC%E7%94%B0%E3%81%A8%E3%81%98%E3%82%83%E3%82%93%E3%81%91%E3%82%93) を導入することにより、勝率をたったの 5% まで劇的に減少させることに成功しました。
	- 負けた時の「挑発的なコメント」が豊富です
	- 誰が勝つか、ユーザー同士で競い合え、コメント数も増加します。
- [勝ったらコーラ1本プレゼント！](https://www.j-cast.com/2019/04/17355553.html)

### 初見判定ちゃん

> 発動条件 : 初回コメント

- 初めてのコメント、久しぶり（約 1 週間ぶり）、その配信での初回コメントに対して挨拶します。
  - 判定には「わんコメ」のデータを参照します。
  - そのため、実際には「初見」でなくても、データにユーザー情報がなければ「初見」と判定されます。ご了承ください。
- 初見でもないのに「初見」とコメントすると…？

#### コメントテスターでのテスト方法

![](../../template/usage/images/22_FirstCounter.png)

- おみくじ BOT v1.2 以降では、コメントテスターの「その他」項目から以下にチェックを入れることで「初見判定ちゃん」のテストが可能です。
  - `NEWコメント` : 初見
  - `NEWコメント` + `再訪` : 久しぶり（前回コメントから 1 週間以上経過）
  - `再訪` : 配信枠での初回コメント

#### 初見詐欺

> 発動ワード : `初見(?!さん)` / `所見`/ `はじめまして`
> 発動条件 : 個人コメント数 (総数) が 6 以上であるとき

- 実際には初見でないのに「初見」とコメントしたユーザーに対して、ツッコミで返答します。
  - コメント数が 5 回以下の場合は、許容バージョンとして「ホントの初見」というデータも用意しています。
- 複数アカウントを利用している場合など、同一人物であってもアカウントが異なる場合、わんコメでは区別できないため、「初見」と判定されてしまいます。

### ギフトのお礼

> 発動条件 : 1 ポイント以上のスパチャ・ギフト・ビット・お茶爆等

- ギフトに対して、BOT コメントを表示することが出来ます。
- ギフトに対するリアクションは、わんコメのギフト用読み上げ機能や、 WordPatry 機能で様々な演出が可能なので、控えめに設定しています。

### コメント数チェック (配信内・個人総合)

> 発動条件 : 配信内で 50 コメント毎、個人で 100 コメント毎

- 配信内でのコメント数と、個人の総合コメント数を参照して、特定の回数で BOT がコメントしてくれます。
- デフォルトでは、50 回、または 100 回ごとにお知らせのトースト表示をしてくれます。

### コメント数を確認する

> 発動ワード : `コメント`

- これまでに投稿したコメント数を、わんコメが起動していた配信枠の範囲でカウントし、結果をトースト通知で表示します。

## カスタマイズ（Customization）

### 「コンフィグエディター」で自由におみくじを編集できる

![](../../core/ConfigEditor/images/features-04.webp)

- 一部の配布パッケージには、**コンフィグエディター**（おみくじデータ編集用アプリ）が付属しています。
- アプリと同じフォルダにある **`ConfigMaker.html`** を開くと起動できます。
- 詳しくは [おみくじ BOT コンフィグエディター README](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md) をご覧ください。
- おみくじの内容は、あなたの配信に合わせて**内容を自由にカスタマイズ**できます。
- ただし、使用している**キャラクターには著作権があります**ので、原作やイラスト制作者の方々へのご配慮をお願いします。

## よくある質問 (FAQ)

> わんコメの機能については [よくある質問](https://onecomme.com/docs/faq) または [導入ガイド](https://onecomme.com/docs/guide) をご参照ください。

### 発動条件・制限設定

- [Q. ギフト・スパチャされた時にだけ発動させたい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2101_Gift.md)
- [Q. メンバー限定で発動させたい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2102_Member.md)
- [Q. 1 日 1 回と、回数を制限したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2103_Limit.md)
- [Q. 同じ人に何回もおみくじされると困る](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2106_LimitOne.md)
- [Q. 配信者をおみくじから外すには？](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2104_Owner.md)
- [Q. 特定のおみくじを、一時的にオフにしたい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2105_OffOmikuji.md)
- [Q. 特定のユーザーを制限したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/21_LimitEdit/faq_2107_LimitOther.md)

### フキダシ・キャラクター表示関連

> キャラクターに関する扱いについては、各パッケージごとに異なります。

- [Q. フキダシの色を変更したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2201_BubbleColor.md)
- [Q. キャラクターを表示したい / キャラクターを消してフキダシだけにしたい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2202_BubbleOnly.md)
- [Q. 右下のアイコンを消したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2203_Thumbnail.md)
- [Q. トーストを左側から出したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2204_ToastLeft.md)
- [Q. 文字やキャラクターのサイズを調整したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2205_FontBig.md)
- [Q. 自前のキャラクター画像を追加したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2206_MyCharacter.md)
- [Q. おみくじ結果で表示されるキャラクター・アイコンを変更したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2207_CharacterChange.md)
- [Q. ジェネレーターで表示するキャラクターを変更する](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/22_Character/faq_2208_AlwaysCharacter.md)

### おみくじ内容・確率設定（コンテンツ編集）

- [Q. おみくじの内容を変更したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2301_OmikujiValue.md)
- [Q. おみくじが出てくる確率を変更したい](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2302_Omikujilottery.md)
- [Q. エディターで、おみくじの動作を確認するには](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2303_OmikujiConfirmation.md)
- [Q. プレースホルダーでおみくじのバリエーションを増やす](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/ContentPlaceholder.md)
- [Q. プレースホルダー チートシート](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/ContentPlaceholderCheatSheet.md)
- [Q. 変数プレースホルダーとは](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholder.md)
- [Q. 変数プレースホルダー チートシート](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholderCheatSheet.md)
- [Q. おみくじ表示時にサウンドを鳴らす](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2304_OmikujiSound.md)
- [Q. おみくじ表示時にWordpartyを鳴らす](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/faq/23_OmikujiEdit/faq_2305_OmikujiWordparty.md)

## トラブルシューティング (Troubleshooting)

わんコメの機能については [トラブルシューティング](https://onecomme.com/docs/trouble-shooting) または [導入ガイド](https://onecomme.com/docs/guide) をご参照ください。

### 設定・表示・音声関連

- [Q. OBS 側で非表示にしていても、BOT のコメントが勝手に動いてしまう](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1202_OBSSound.md)
- [Q. キャラクター画像が表示されない](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1203_CharacterImage.md)
- [Q. WordParty の音が配信に出ない](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1206_infoWordParty.md)

### おみくじ関連

- [Q. コメントでおみくじが反応しない](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1204_CommentOmikuji.md)
- [Q. おみくじが Youtube のコメントに反映されていない](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/troubleshooting/12_infoOmikujiBot/trouble_1205_OmikujiPlatform.md)

## クレジット（Credits）

### ゆっくり霊夢・ゆっくり魔理沙イラスト

- 凪ぽんの素材置き場 <https://nagipon-sozai.studio.site/>
- 本素材の同梱は通常、再配布にあたる行為ですが、作者様より特別にご許可を頂いております。

### 素材の取り扱いについて

1. 本アプリに含まれる素材は、各権利者からの許諾を得て使用しています。
	1. これらの素材は**アプリの機能提供のために同梱**しているものであり、素材そのものを再配布することを目的としたものではありません。
2. 素材は、**本アプリを利用した配信・演出の範囲内でのみ**ご使用ください。
	1. アプリからの抽出、素材データの単体利用、再配布、二次配布は禁止されています。
3. 各素材の利用条件については、配布元サイトの利用規約をご確認ください。
4. 素材の権利や利用条件について万が一不備や問題がございましたら、権利者様よりご連絡いただければ、速やかに確認・対応いたします。

![](images/excited.webp)

神社も私も、あなたを応援しているわ。

## ライセンス（License）

**このパッケージには、ライセンスの異なる複数の種類のデータが含まれています。**

### JSON データ

- 【CC-BY 4.0】 このパッケージのデータ (Json データ) は、 [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/) に基づいて提供されます。
- クレジット表記を行うことで、改変・再利用が可能です。

### 画像・イラスト等について

- パッケージに含まれる画像・イラスト等は **CC-BY 4.0 の対象外** です。
- これらは各権利者の許諾に基づき、**アプリ内での利用に限り同梱しているものです。**
- 抽出・再配布・単体利用は禁止されています。

### アプリ本体（ジェネレーター・コンフィグエディター）

- Copyright © 2023-2026 Pintocuru(せすじピンとしてます)
- 本ソフトウェア (おみくじ BOT) は、著作権者の許可なく再配布することを禁じます。
- 本ソフトウェアは、Github、または BOOTH にて提供される各パッケージに含まれる形でのみ配布されます。
- 改変・逆コンパイル・再販売も禁止されています。

## バージョン情報 (Version)

### ver.260120

- **おみくじ BOT のバージョン**: v2.0.3
- 各おみくじのバリエーションを増やしました
- 新機能に合わせて一部データが変更されています

### ver.251206

- **おみくじ BOT のバージョン**: v1.4.3
- 今後は【通常版】のみのリリースとなります。
  - これまで PRO 版にはミニゲームが搭載されていましたが、今後は個別パッケージとして提供します。
    - 搭載されていたミニゲームは以下の 2 パッケージです。
      - [おみくじ BOT ボンバースロット OmikujiBot BomberSpin - ピンとくる企画 - BOOTH](https://pintocuru.booth.pm/items/7730686)
      - [おみくじ BOT スイカジェネレーター + カボチャ&クジラ OmikujiBot GouseiSuika - ピンとくる企画 - BOOTH](https://pintocuru.booth.pm/items/5813323)
  - 今後は【通常版】をダウンロードしてご利用いただくか、JSON データをインポートしてご利用ください。
- おみくじ BOT のバージョンに合わせ、内容を拡充・変更しました。
	- 「初見」などの挨拶にバリエーションが追加されました。
		- 「ギフト」では、より巫女さんらしい振る舞いになっています。
		- 東方 Project では、どのように対応しているかは分かりませんが・・・
	- 霊夢・魔理沙が瞬きするようになりました。
	- じゃんけんで「俺」と言っていたのを「私」に変更しました。
	- キャラクターは常時表示するように変更しました。また、「ちょこんと版」の配布終了とします。
		- これらの設定変更は、同梱している コンフィグエディター で変更できます。
	- 「ちょこんと版」の配布終了、また、【通常版】のみの変更に伴い、「フラワー占い」を【通常版】に搭載するようにしました。遊んでみてね。

### ver.250910

- おみくじ BOT のバージョン: v1.1.0

### ver.250901

- おみくじ BOT のバージョン: v1.0.0
  - 2024/02/02 のリリースから 1 年 7 ヶ月 (開発開始は 2024/01 なので、1 年 8 ヶ月) ついに正式リリースです。
  - 正式版は追加データや、コンフィグエディターの一部機能が有料になりますが、引き続き無料でもお楽しみいただけます。配信で楽しんでいただけると幸いです。

### ver.250830

- おみくじ BOT のバージョン: v0.8.0 Beta.10
- Readme に [「ちょこっと版」](https://pintocuru.booth.pm/items/7366004) に関する案内を追加。

### ver.250825

- おみくじ BOT のバージョン: v0.8.0 Beta.09
- 「通常版」と「PRO 版」の 2 種類に分離しました。
  - これにより、PRO 版にアップグレードする作業が必要になります。
- エディターカラーを黒から白系に変更。
- 他、細かい修正を行いました。

### ver.250824

- おみくじ BOT のバージョン: v0.8.0 Beta.08
- 機能追加による更新を行いました。
- PRO 版に搭載の「スイカジェネレーター」「ボンバースピン」「うさぎスロット」の上限回数を「10」にしました。
  - この設定はエディターで変更できます

### ver.250816

- メインのシステムをおみくじ BOT に任せたことにより、バージョン表記の変更を行いました。
  - セマンティック・バージョニング > 日付にしました。
- 以降、おみくじ内容が変化しない限りは、バージョンの表記は変化しません。

### v0.8.0 25/07/24

- システムファイルを「おみくじ BOT」に移しました。以降、システム的なバージョン情報はそちらの ReadMe に記載します。
- ゆっくり霊夢とゆっくり魔理沙の画像を png から webp に変更し、大幅にファイルを小さくしました。

これ以前のリリースノートは [こちら](https://github.com/Pintocuru/OmikujiBot-Docs/releases/tag/v0.7.0) に移動しました。

---

作成者：Pintocuru(せすじピンとしてます) @pintocuru

[Twitter](https://twitter.com/pintocuru) | [YouTube](https://www.youtube.com/@pintocuru)