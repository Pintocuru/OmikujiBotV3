## 【重要】 「おみくじ BOT エディタープラグイン」をご利用の方へ

内部 ID の重複により、**v1.4.3 以前のデータでは、異なるパッケージを開いた際に別のデータが読み込まれてしまう不具合**が確認されています。 この問題は、各パッケージの本体バージョン **おみくじ BOT v2.0.3** にて修正済みですが、**v1 系のデータは正しく移行できません**。

### 該当するパッケージ (ver1.4)

- id : 1755337374735-01vj6j
	- おみくじ BOT ストロベリーショコラ OmikujiBot StrawberryChocolate
	- おみくじ BOT みんなのずんだもん OmikujiBot EveryoneZunda
	- おみくじ BOT 高飛車な四国めたん OmikujiBot Diva Metan
- id : 1754884254510-shoywq
	- おみくじ BOT 超おみくじ OmikujiBot BigBangFortune
	- おみくじ BOT カード駅 OmikujiBot CardStation
	- おみくじ BOT タロットカード OmikujiBot TarotCard
- id : 1754926464640-roopmp
	- おみくじ BOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa
	- おみくじ BOT じゃんけん OmikujiBot HondaJanken
	- おみくじ BOT スイカジェネレーター + カボチャ&クジラ OmikujiBot GouseiSuika
	- おみくじ BOT ボンバースロット OmikujiBot BomberSpin

### 対処方法

上記のパッケージを **同時に使用した場合にのみ** データ衝突が発生します。 単体で利用している場合は、そのままお使いいただいても問題ありません。

ただし、**v1 系のデータは内部 ID の重複により、v2 へ正しく移行できません。** 大変申し訳ありませんが、**v2 系の新しいパッケージを新規にご利用ください。**

### Pro 版（有料）をご利用の方へ

「テンプレート読み込み（json）」機能を使うことで、旧データを手動でマージできます。
