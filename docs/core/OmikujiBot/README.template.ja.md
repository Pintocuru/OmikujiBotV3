# おみくじ BOT OmikujiBot

最終更新日：<% tp.date.now('YYYY/MM/DD') %>

![](/sharedTemplate/intro/intro_11.md) BOT ソフトウェア です。

このテンプレートは、下記のパッケージの内容を含みます。

![OmikujiBotPackageBOOTH](/packages/OmikujiBot/template/_common/OmikujiBotPackageBOOTH.md)

![](/sharedTemplate/intro/intro_22_IntroOneComme.md)

## このテンプレートは何？（Features）

![](./images/features-01.webp)

### 🎯 わんコメに BOT 機能を付与するジェネレーター

- 【おみくじ BOT OmikujiBot】は、わんコメに BOT 機能を付与するジェネレーターです。
- 特定のワード (おみくじ 等) と、チャットに投稿することで、ランダムな結果を配信画面に表示します。
- 初見さん (初めてのコメント) や、通算 100 回目のコメントなど、特定の条件で発動し、配信画面に表示することも可能です。

### ✨【おみくじ BOT OmikujiBot】で、できること

![](./images/features-02.webp)

1. **コメントに反応する【おみくじシステム】**
   - `おみくじ` とコメントすると、今日の運勢をランダムで表示
   - `じゃんけん` のような複雑なおみくじ結果も表示できる
   - `スイカジェネレーター` などのミニゲームで楽しむ
2. **[【コンフィグエディター】](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md) で多彩なおみくじを自作できる**
   - おみくじの内容は、自由に編集可能
   - フキダシの大きさ・色替え・アニメーションも自由に変更可能
   - わんコメの機能「WordParty」を使い、自由に演出を表示可能
3. **【初見判定ちゃん機能】で、初見さんや常連さんを判別**
   - 初めての視聴者を判別し、個別に挨拶してくれます
   - 1 週間以上の間隔が空くと、挨拶のコメントも変化します
   - 「初見詐欺」を見破る機能も搭載
4. **ギフト・メンバー限定への機能制限も可能**
   - すべてのおみくじ・ミニゲームは、ギフト限定等条件を絞ることが可能
   - メンバー、サブスク限定のおみくじの設定が可能
   - 金額に応じて、メッセージも変えられます
5. **【タイマー機能】でチャンネル登録を促す**
   - 現在の視聴数、高評価数の表示をトーストで表示できます
   - SNS やファンクラブの告知も自動投稿
   - 投稿間隔も設定可能で、時報代わりにも使えます

## インストール (Installation)

> それぞれのパッケージに記載されている「インストール方法」をご覧ください。

### OBS でジェネレーターを表示させる際の「幅」について

![](./images/Installation-05.webp)

- 表示サイズは柔軟に調整可能で、コンパクトにもワイドにも対応できます。
- 幅の最大値は `2xl = 42rem`（672px）、最小値は `10rem`（160px）です。
  - それ以下にすると、はみ出しなどの表示崩れが起こる可能性があります。

![Installation_52_VersionUp](../../template/installation/Installation_52_VersionUp.md)

![Installation_51_ProUpgradeTemplate](/sharedTemplate/installation/Installation_51_ProUpgradeTemplate.md)

## つかいかた (Usage)

> パッケージによって、利用シーンは様々です。詳しくは、下記の Readme をご覧ください。

![OmikujiBotPackageReadme](/packages/OmikujiBot/template/_common/OmikujiBotPackageReadme.md)

## カスタマイズ（Customization）

![customization_21_ConfigEditor](/packages/OmikujiBot/template/customization/customization_21_ConfigEditor.md)

## よくある質問 (FAQ)

![faq_11_infoOneComme](/sharedTemplate/faq/faq_11_infoOneComme.md)

> おみくじの内容、エディター関連についての内容は [おみくじ BOT コンフィグエディター README](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md) の [よくある質問](https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/README.md#%E3%82%88%E3%81%8F%E3%81%82%E3%82%8B%E8%B3%AA%E5%95%8F-faq) をご覧ください。

- コメントテスターで「初見コメント」を確認するには

#### Q. Omiken って何？

A: おみくじ (omikuji)＋初見 (syoken) から取ってます。前作「[初見判定ちゃん](https://booth.pm/ja/items/5471598) 」の名残です。

![troubleshooting_91_OmikujiBotSet](../../template/troubleshooting/troubleshooting_91_OmikujiBotSet.md)

## クレジット（Credits）

### ♫ 効果音・ジングル

- [効果音・ジングルに関するライセンス](sub/sounds.md) にまとめています。
  - このアプリに収録されている効果音データは、すべて [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) です。

それぞれのパッケージでは、各種イラスト素材を使用しています。詳しくは、下記の Readme をご覧ください。

![OmikujiBotPackageReadme](/packages/OmikujiBot/template/_common/OmikujiBotPackageReadme.md)

![license_91_AppLicense](/packages/OmikujiBot/template/license/license_91_AppLicense.md)

## バージョン情報 (Version)

> 詳細な変更履歴は [Releases](https://github.com/Pintocuru/OmikujiBot-Docs/releases) をご覧ください。

![credits_99_sesupin](/sharedTemplate/credits/credits_99_sesupin.md)

<%* await tp.user.expandEmbeds(tp,'ja') %>
