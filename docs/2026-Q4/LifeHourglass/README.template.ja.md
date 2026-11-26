# 命の砂時計 LifeHourglass

最終更新日：<% tp.date.now('YYYY/MM/DD') %>

## このテンプレートは何？（Features）

■ リスナーの視聴時間、結晶化します！

- 視聴中のリスナーの滞在時間（秒数）を「砂粒」として数値化する砂時計ジェネレーターです。
- 同時接続数から秒数を計算し、リスナーと一緒に砂粒を積み上げていきます。
- ギフトを受け取ると、金額に応じた砂粒も加算されます。
- 個人情報が流出しないバージョンです。

### 砂粒の加算方法

- 視聴時間：リスナー1人の視聴1秒につき、砂粒を1粒加算します。
- ギフト：金額に応じて砂粒を加算します（10円相当＝60粒、100円相当＝600粒）。

視聴時間とギフトによる加算は、同じカウンターに合算されます。

### 表示内容

- メイン表示：積み上がった砂粒の数
- サブ表示：砂時計の器のアイコン数

## つかいかた（Usage）

配信を開始するとカウントが0から始まり、配信中の同時接続数と経過時間に応じて砂粒が増えていきます。ギフトを受け取った場合も、金額に応じた砂粒が加算されます。

![Installation_92_OmikujiBotPROSet](../../template/jp/installation/Installation_92_OmikujiBotPROSet.md)

## つかいかた (Usage)

### 命の砂時計

- これまでに投稿したコメント数を、わんコメが起動していた配信枠の範囲でカウントし、結果をトースト通知で表示します。

![customization_21_ConfigEditor](../../template/jp/customization/customization_21_ConfigEditor.md)

![faq_91_OmikujiBotSet](../../template/jp/faq/faq_91_OmikujiBotSet.md)

![troubleshooting_91_OmikujiBotSet](../../template/jp/troubleshooting/troubleshooting_91_OmikujiBotSet.md)

![license_92_PackageLicense](../../template/jp/license/license_92_PackageLicense.md)

## バージョン情報 (Version)

### ver.261127

- **おみくじBOT のバージョン**: v3.0.0-beta3
- 新規作成

![credits_99_sesupin](../../template/jp/credits/credits_99_sesupin.md)

<%* await tp.user.expandEmbeds(tp,'ja') %>
