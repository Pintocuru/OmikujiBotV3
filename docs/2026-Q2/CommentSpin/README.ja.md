# おみくじ BOT コメントスピン OmikujiBot CommentSpin README

最終更新日：2026/04/23

配信者のためのコメントアプリ「わんコメ」で使用できる、 テンプレートです。

この内容は、BOOTH で配布している、以下の readme となります。

- [おみくじBOT ゴールデン65536 OmikujiBot Golden65536](https://pintocuru.booth.pm/items/8188701)
- [おみくじBOT クイズせかいはバラエティスロット OmikujiBot VarietySlot](https://pintocuru.booth.pm/items/8231657)
- [おみくじBOT ペカるLAMP OmikujiBot GogoBonus](https://pintocuru.booth.pm/items/8251498)

## はじめに（Intro）

- [わんコメ](https://onecomme.com/) の機能を前提としたソフトウェアです。
- 本ソフトウェアの利用は自己責任でお願いいたします。
- 仕様は予告なく変更される場合があります。

## このテンプレートは何？（Features）

### ガチャに！ゲームに！多彩に使えるスロット風テンプレート

- わんコメと連携して動作する【おみくじ BOT】を利用した、ランダムにテキストや画像を抽選し、スロット風に表示するテンプレートです。
- 抽選で使うテキスト・画像は自前のものを利用可能。
	- 画像は gif/png/wenp/svg。アニメーション gif も OK
	- 動画は webm/ mp4 が使用可能
- 画像はレイヤーで使える。重ねて使うことで、表現力があがり再利用性も上がります

### シーン別・活用例

- **朝活・雑談配信に**
  - イラストを使ったガチャや、抽選機能として。
  - 簡易的なおみくじ・占いに。

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

### コメントスピン スロット

![](../../template/usage/images/Pasted%20image%2020260411213458.png)

- ランダムにテキストや画像を抽選し、スロット風に表示できます。
- 表示サイズの縦・横を設定すると、最も長いほうに沿って拡大・縮小表示されます。
- 「スピン」「長文スロット」を押すことで、動作を確認できます
	- スロットで表示する画像は、プレビューでは確認できません。

## カスタマイズ（Customization）

### 「コンフィグエディター」で自由におみくじを編集できる

![](../../core/ConfigEditor/images/features-04.webp)

- 一部の配布パッケージには、**コンフィグエディター**（おみくじデータ編集用アプリ）が付属しています。
	- 付属されていない場合、新しく導入する必要があります。[コンフィグエディターの新規導入](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_52_VersionUp.md) をご覧ください。
- アプリと同じフォルダにある **`ConfigMaker.html`** を開くと起動できます。
- 詳しくは [おみくじ BOT コンフィグエディター README](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md) をご覧ください。

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
- [Q. 評価ブロック (変数プレースホルダー)とは](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholder.md)
- [Q. 評価ブロック (変数プレースホルダー) チートシート](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholderCheatSheet.md)
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

### ゴールデン 65536

#### 黄金に光る古代ギリシャ風背景

- 生成：Microsoft Copilot <https://copilot.microsoft.com/>
- 本アプリ専用に制作された画像です。他の用途での使用・転載・再配布は禁止します。
- 動画も同様。

#### サッポーのコスプレをしたショコラ🍓

- 生成：Google Gemini <https://gemini.google.com/>
- 本アプリ専用に制作された画像です。他の用途での使用・転載・再配布は禁止します。

#### 数字のフォント

- こはるいろサンレイ <http://getsuren.com/>

![](images/Pasted%20image%2020260419105246.png)

「ショコラ🍓には伝えたハズなんだけど…モチーフは " ギリシャ神話 " であって、" 古代ギリシャ " じゃないんだ。君の好きな、サッポーっていう人物は出てこないよ…」

### クイズせかいはバラエティスロット

#### ミリオンスロットの出目のイメージ画像

- せすじピンとしてます の制作物です。
- licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)

#### クイズに答えるショコラ🍓

- 生成：ChatGPT <https://chatgpt.com/>
- 本アプリ専用に制作された画像です。他の用途での使用・転載・再配布は禁止します。

#### ミリオンスロットを回す時にグッとしているカペラテ☕とコーラ✝

- 生成：Google Gemini <https://gemini.google.com/>
- 本アプリ専用に制作された画像です。他の用途での使用・転載・再配布は禁止します。

### ペカる LAMP

#### サーカスの衣装を着るショコラ

- 生成：Grok <https://grok.com/>
- 本アプリ専用に制作された画像です。他の用途での使用・転載・再配布は禁止します。

#### BONUS の画像

- 枠 : ダーヤマ TOPECONHEROES <https://fukidesign.com/>

#### ペカった時の効果音 (通常)

- 下記を Mix したものを使用しています
	- [Ow Sound](https://freesound.org/people/Topschool/sounds/442602/)
	- [Psytrance Kick 02](https://freesound.org/people/jalastram/sounds/818654/)
- licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

#### `peka_2`

- [Grunt1.wav](https://freesound.org/people/whisperbandnumber1/sounds/397276/)
- licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

#### `no_hit`

- [Jumpstylekick2](https://freesound.org/people/Cat-Fox_Alex/sounds/817318/)
- licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

#### `FanfareRpg`

- [Fanfare 2 - Rpg](https://freesound.org/people/colorsCrimsonTears/sounds/580310/)
- licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

### イラストガチャメーカー

#### レアリティの枠画像 (N / R / SR / SSR)

- せすじピンとしてます の制作物です。
- licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)

#### どりんくるのスタッフ画像

- 生成：Google Gemini <https://gemini.google.com/>
- 本アプリ専用に制作された画像です。他の用途での使用・転載・再配布は禁止します。

![](images/Pasted%20image%2020260412074654.png)

## ライセンス（License）

### パッケージデータ

- このパッケージのデータ (JSON データ) は、改変・再利用は自由に行えます。
- ただし **再配布は禁止** とします。
- 本テンプレートの使用に伴ういかなる損害についても責任を負いません。ご利用は自己責任でお願いします。

### アプリ本体（ジェネレーター・コンフィグエディター）

- Copyright © 2023-2026 Pintocuru(せすじピンとしてます)
- 本ソフトウェア (おみくじ BOT) は、著作権者の許可なく再配布することを禁じます。
- 本ソフトウェアは、Github、または BOOTH にて提供される各パッケージに含まれる形でのみ配布されます。
- 改変・逆コンパイル・再販売も禁止されています。

## バージョン情報 (Version)

### ver.260412

- **おみくじ BOT のバージョン**: v2.12.0
- 新規作成

---

作成者：Pintocuru(せすじピンとしてます) @pintocuru

[Twitter](https://twitter.com/pintocuru) | [YouTube](https://www.youtube.com/@pintocuru)

<%* await tp.user.expandEmbeds(tp,'ja') %>