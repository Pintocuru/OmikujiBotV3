# おみくじ BOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa README

最終更新日：<% tp.date.now('YYYY/MM/DD') %>

![](/sharedTemplate/intro/intro_11.md) テンプレートです。

この内容は、BOOTH で配布している、 [おみくじ BOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa](https://pintocuru.booth.pm/items/5471598) の readme となります。

![](/sharedTemplate/intro/intro_22_IntroOneComme.md)

## このテンプレートは何？（Features）

### ゆっくり霊夢と魔理沙がリスナーを歓迎してくれるジェネレーター

- わんコメに BOT 機能を付与するジェネレーター【おみくじ BOT】を使った、ゆっくり霊夢と魔理沙が楽しく出演するテンプレートです。
- 解説動画でも良く使われる、「ゆっくり霊夢」「ゆっくり魔理沙」を BOT キャラクターにしました。

![features_11_HowToPlay](../../template/features/features_11_HowToPlay.md)

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

![features_31_InfoCharacter](/packages/OmikujiBot/template/features/features_31_InfoCharacter.md)

- おみくじ BOT の博麗神社は、賽銭 (スパチャ・ビット等) が比較的多めに入るようで、巫女である霊夢も金銭に困っていないようです。
  - でも、お賽銭はもっと欲しいそうです。
- おみくじ BOT のゆっくり魔理沙は、キノコだけでなく、花にも詳しい設定になっています。（フラワー占い という機能で実装しています）

![Installation_92_OmikujiBotPROSet](../../template/installation/Installation_92_OmikujiBotPROSet.md)

## つかいかた (Usage)

![usage_92_OmikujiActivation](../../template/usage/usage_92_OmikujiActivation.md)

![usage_MaidenOmikuji](../../template/usage/usage_MaidenOmikuji.md)

![usage_FlowerFortune](../../template/usage/usage_FlowerFortune.md)

![usage_JankenHonda](../../template/usage/usage_JankenHonda.md)

![usage_FirstCounter](../../template/usage/usage_FirstCounter.md)

![usage_Gift](../../template/usage/usage_Gift.md)

![usage_CountStream](../../template/usage/usage_CountStream.md)

![usage_CheckNumber](../../template/usage/usage_CheckNumber.md)

## カスタマイズ（Customization）

![customization_21_ConfigEditor](/packages/OmikujiBot/template/customization/customization_21_ConfigEditor.md)

![](/packages/OmikujiBot/template/customization/customization_11_illust.md)

![faq_91_OmikujiBotSet](/packages/OmikujiBot/template/faq/faq_91_OmikujiBotSet.md)

![troubleshooting_91_OmikujiBotSet](/packages/OmikujiBot/template/troubleshooting/troubleshooting_91_OmikujiBotSet.md)

## クレジット（Credits）

### ゆっくり霊夢イラスト

- 凪ぽんの素材置き場 <https://nagipon-sozai.studio.site/>
- 本素材の同梱は通常、再配布にあたる行為ですが、作者様より特別にご許可を頂いております。

![](/sharedTemplate/credits/credits_11_sozai.md)

![](images/excited.webp)

神社も私も、あなたを応援しているわ。

![license_92_PackageLicense](/packages/OmikujiBot/template/license/license_92_PackageLicense.md)

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

![credits_99_sesupin](/sharedTemplate/credits/credits_99_sesupin.md)

<%* await tp.user.expandEmbeds(tp,'ja') %>
