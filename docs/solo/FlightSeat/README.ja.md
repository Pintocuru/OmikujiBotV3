# おみくじ BOT 8 時間フライト、どの席に座る? OmikujiBot FlightSeat README

最終更新日：2026/02/17

配信者のためのコメントアプリ「わんコメ」で使用できる、 テンプレートです。

この内容は、BOOTH で配布している、 [おみくじ BOT タロットカード OmikujiBot TarotCard](https://pintocuru.booth.pm/items/7432682) の readme となります。

## はじめに（Intro）

- [わんコメ](https://onecomme.com/) の機能を前提としたソフトウェアです。
- 本ソフトウェアの利用は自己責任でお願いいたします。
- 仕様は予告なく変更される場合があります。

## このテンプレートは何？（Features）

![](images/260209_2.webp)

### コメントしたユーザーをランダムに座らせるジェネレーター

- わんコメに BOT 機能を付与するジェネレーター【おみくじ BOT】を使った、コメントをくれたユーザーをランダムに配置し、座席リストを作成して楽しめます。
- 座席数は最大 100 席まで対応
	- 小規模配信から大人数配信まで柔軟に対応可能です。
- 多彩なレイアウトで遊べる！
	- 通常のグリッド配置に加え、ピラミッド型・逆ピラミッド型など、多彩な遊び方ができます。
- 履歴を閲覧可能
	- 座席がすべて埋まると自動でリセットされ、 過去の着席結果は履歴として振り返ることができます。

### シーン別・活用例

- **朝活・雑談配信**
  - ミニゲームの内容をきっかけに話題を広げて、会話が途切れにくくなります。
  - ゲーム参加を目的にコメントしてくれるリスナーが増えることで、自然にコメント数や盛り上がりがアップします。
- 抽選・参加確認・ちょっとした遊びに最適
	- 「誰が参加したか」「どこに座るか」を視覚的に楽しめるため、 抽選演出やアイスブレイク用途に向いています。

## インストール (Installation)

> テンプレートのインストールは、[わんコメ カスタムテンプレートの導入方法](https://github.com/Pintocuru/OmikenReadme/blob/main/docs/TemplateInstall/README.md) をご覧ください。

### おみくじ BOT のアップグレード / コンフィグエディターの新規導入

> 現在のバージョンは **コンフィグエディター** から確認できます。
> パッケージに「コンフィグエディター」が含まれていない場合でも、**このアップグレード手順を実行すれば新規導入として利用できます。**

#### アップグレード手順

![](template/installation/images/Pasted%20image%2020260103155223.png)

1. Github から [最新バージョン](https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest) をダウンロードします。
2. リリースノート下部の **「Assets」** から、 **「OmikujiBot_core_」** と書かれたファイルをダウンロードします。
3. ダウンロードした ZIP ファイルを **解凍** します。

![](template/installation/images/Pasted%20image%2020260103155557.png)

1. **わんコメを起動** します。
2. 「テンプレート」画面で、アップグレードしたいテンプレートを選び、右側の **「フォルダを開く」** をクリックします。
3. 解凍したファイルを、開いたフォルダへ **上書き保存** します。
4. 念のため、**コンフィグエディターを起動し、バージョンが最新になっているか** を確認してください。

- **注意**：アップグレード後、一部設定がデフォルトに戻る場合があります。バックアップは必ず行って下さい。

## つかいかた (Usage)

### 8 時間フライト、どの席に座る?

- コメントしたユーザーをランダムに座らせ、座席リストを作成して楽しめます。
- 座席数は最大 100 席まで対応
	- 小規模配信から大人数配信まで柔軟に対応可能です。
- 多彩なレイアウトで遊べる！
	- 通常のグリッド配置に加え、ピラミッド型・逆ピラミッド型など、多彩な遊び方ができます。
- 履歴を閲覧可能
	- 座席がすべて埋まると自動でリセットされ、 過去の着席結果は履歴として振り返ることができます。

## カスタマイズ（Customization）

### 「コンフィグエディター」で自由におみくじを編集できる

![](../../core/ConfigEditor/images/features-04.webp)

- 一部の配布パッケージには、**コンフィグエディター**（おみくじデータ編集用アプリ）が付属しています。
	- 付属されていない場合、新しく導入する必要があります。[コンフィグエディターの新規導入](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/template/installation/Installation_52_VersionUp.md) をご覧ください。
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

- バスガイドの女性
  生成：ChatGPT <https://chatgpt.com/>
- CA のうさぎ
- パッケージの背景（バス内の賑やかな座席）
  生成：Google Gemini <https://gemini.google.com/>

![](images/260209_1.webp)

### 素材の取り扱いについて

1. 本アプリに含まれる素材は、各権利者からの許諾を得て使用しています。
	1. これらの素材は**アプリの機能提供のために同梱**しているものであり、素材そのものを再配布することを目的としたものではありません。
2. 素材は、**本アプリを利用した配信・演出の範囲内でのみ**ご使用ください。
	1. アプリからの抽出、素材データの単体利用、再配布、二次配布は禁止されています。
3. 各素材の利用条件については、配布元サイトの利用規約をご確認ください。
4. 素材の権利や利用条件について万が一不備や問題がございましたら、権利者様よりご連絡いただければ、速やかに確認・対応いたします。

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

### ver.250918-v1.2.0-beta03

- 新規作成

---

作成者：Pintocuru(せすじピンとしてます) @pintocuru

[Twitter](https://twitter.com/pintocuru) | [YouTube](https://www.youtube.com/@pintocuru)