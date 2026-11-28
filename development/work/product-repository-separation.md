# Product リポジトリ分離計画

## 目的

公開リポジトリ Pintocuru/OmikujiBotV3 と、非公開 Git Submodule Pintocuru/OmikujiBotV3-Product を分離する。

公開リポジトリ単体でビルドできる商品は OmikujiBot と StrawberryChocolate の2つに限定する。それ以外の商品定義・商品固有素材などは Submodule 側で管理する。

今回は調査・設計のみ。コード、設定、ファイル配置、Git 管理状態の変更は行わない。

## リポジトリ名と配置

- Submodule リポジトリ名: OmikujiBotV3-Product
- 公開リポジトリ内の配置先: Product/

Submodule は1つにまとめ、プロジェクトルート直下の Product/ に配置する。

## 目標構成

```text
OmikujiBotV3/                         # Public
├── src/
├── assets/
│   ├── images/common/
│   └── sounds/common/
├── packages/
│   ├── common/
│   │   ├── OmikujiBot/
│   │   └── StrawberryChocolate/
│   ├── _shared/
│   ├── index.ts
│   └── build.ts
├── server/                           # 共通サーバー処理
├── tools/
│   ├── viteBuild/                    # 共通ビルド基盤
│   └── viteConfig/                   # 共通 Vite 設定
└── Product/                          # Git Submodule
    ├── packages/2026-Q4/
    ├── assets/
    │   ├── images/2026-Q4/
    │   └── sounds/2026-Q4/
    └── tools/                        # 商品専用ツールがあれば配置
```

上記は目標イメージ。Submodule に移すファイルの最終範囲は、依存関係の確認後に確定する。

## ビルド対象

公開側の packages/index.ts は OmikujiBot と StrawberryChocolate のみを import/export する形に固定する。

```ts
import OmikujiBot from './common/OmikujiBot/build'
import StrawberryChocolate from './common/StrawberryChocolate/build'

export default [
  OmikujiBot,
  StrawberryChocolate,
]
```

- 公開側の index から Submodule 内のファイルを import しない。
- Submodule 未取得でも公開側の2商品をビルドできること。
- 四半期商品用のビルド入口は公開用 index と分離する。公開用 index に条件分岐や未使用 import を残さない。
- 公開側の npm run build が2商品のみをビルドすること。

## 移行対象の洗い出し

### 移行対象として確定しているもの

| 現在の場所 | 移行先案 | 備考 |
| --- | --- | --- |
| packages/2026-Q4/ | Product/packages/2026-Q4/ | 商品定義、main/editor/console、商品固有ファイル |
| assets/images/2026-Q4/ | Product/assets/images/2026-Q4/ | 四半期商品・関連機能の画像素材 |
| assets/sounds/2026-Q4/ | Product/assets/sounds/2026-Q4/ | 四半期商品・関連機能の音声素材 |

### 調査対象外

- server/presets/

Submodule 側へ移す方針は確定済み。今回の洗い出しには含めない。参照先の変更は実装時に対応する。

### tools の調査結果

| 現在の場所 | 方針 | 理由 |
| --- | --- | --- |
| tools/viteBuild/ | Public に残す | OmikujiBot / StrawberryChocolate のビルドにも必要 |
| tools/viteConfig/ | Public に残す | 公開側の開発サーバー・プラグインビルドにも必要 |
| tools/presetMeta/ | 要設計。Public 維持を基本案とする | packages/build.ts から呼ばれ、ビルド対象のプリセット meta を同期する。公開2商品のビルドでも必要な処理を含むため、単純移動できない |
| tools/types/ | Public に残す | 共通ビルド基盤の型定義 |
| tools/JsonMerge/ | Public 維持を基本案とする | 共通エディター機能との関係を確認して判断 |
| tools/depcruise/ | Public に残す | リポジトリ全体の依存関係検査 |
| tools/fileName/ | Public 維持を基本案とする | 汎用的な開発補助ツール |
| tools/runFix.ts | Public に残す | リポジトリ全体の修正・保守用 |
| tools/find-unused-icons.mjs | Public に残す | 共通UIを含む開発補助 |
| tools/i18n-dup.ts | Public に残す | 共通i18nの検査 |

現時点で、Submodule に移すべきと判断できる独立した商品専用 tools は確認できていない。今後商品専用ツールが見つかった場合は Product/tools/ に置く。

### src 内の製品固有コード・機能

四半期商品や追加機能に関係する名前・配置が確認できるが、単純に Submodule へ移すとは決めない。公開側の共通UI・型・登録処理との依存を確認する。

- src/ui/counter/LifeHourglass/
- src/console/game/WordAlchemy/
- src/console/game/OshikuraChain/
- src/ui/game/OshikuraChain/
- src/ui/game/LiverBingo/
- その他、四半期商品専用のUI・ゲーム・スキーマ・型・i18n

これらを移す場合、Submodule 内コードから公開側 src への依存方向、TypeScript/Vite alias、型チェック対象、ビルド時の解決方法を設計する。公開側で共有する機能まで巻き込まないこと。

## パス・ビルド基盤で確認が必要な箇所

### definePackage

現在の tools/viteBuild/definePackage.ts は build.ts の配置場所から key / category / dir を自動決定する。

現在の前提は packages/<category>/<key>/build.ts。Submodule 配下の Product/packages/2026-Q4/<key>/build.ts へ移すと category の自動判定が変わる。

- category/key を明示指定できる API にするか検討する。
- dir は Submodule 内の商品ディレクトリを正しく指す必要がある。
- extraFiles 等の商品ファイル参照も Submodule の実パスを解決できるようにする。

### ConfigResolver

現在のプリセットルートは server/presets/ 固定。Submodule への移動に合わせて参照先を変更する。

README URL・商品 category・series なども現行ディレクトリ構成に依存しているため、移動後も正しい URL を生成すること。

### PROJECT_ROOT / alias

現在の PROJECT_ROOT は tools/viteBuild/constants/system.ts の配置からリポジトリルートを算出し、alias はルートの tsconfig.json を基準に生成する。

ビルド基盤を Public に残すため、Submodule の商品コードをビルドするときも、公開側のソース・assets・依存パッケージを正しく参照できる必要がある。

### Vite のアセット解決

確認対象:
- tools/viteConfig/imageAssetsPlugin.ts
- tools/viteConfig/soundAssetsPlugin.ts
- ルートの vite.config.ts

現状は common/ または YYYY-QN/ フォルダからアセットを探索する設計。Submodule の Product/assets/ を探索対象に含める方法を検討する。開発サーバーと商品ビルドで同じアセット配置を解決できること。

### TypeScript / ESLint / 検査対象

- tsconfig.json の include / paths
- ESLint / dependency-cruiser の対象範囲
- Vite alias
- Submodule 未取得の場合の型チェック・開発サーバー起動

公開側だけで成立する検査と、Product Submodule を取得した場合に行う検査を区別する。

## isDev と環境変数

### 現状

src/common/AppEnv.ts の isDev は VITE_IS_DEV === 'true' で判定する。

.env.development では VITE_IS_DEV=true。一方、商品ビルドの tools/viteBuild/buildOptions/viteConfig.ts は envDir: false にしており、開発用 .env を読み込まない。したがって配布物では isDev=false になる設計。

isDev は現在、開発者向けUI、Express API切替、開発用操作、開発時のダミーデータ処理などに使われている。

### 方針

- isDev の意味は「開発者向け機能を有効にする」に維持する。
- Product Submodule を取得しているか、どの商品をビルドするかを isDev で判定しない。
- 公開ビルドとProduct商品ビルドの違いは、まずビルド対象一覧・ビルド入口で制御する。
- Submodule があるだけで開発者向け機能が有効になる設計にはしない。

### 第三の環境変数が必要になる条件

現時点では第三の環境変数を追加する必要はない。

ただし、同じ開発サーバー上で「公開版相当」と「Product連携版相当」の機能を切り替える必要が出た場合は、isDev に意味を追加せず別の設定を設ける。

候補:
- VITE_PRODUCT_MODE=true: Product 専用機能を開発時に有効化する単純なフラグ
- VITE_APP_MODE=development|public|product: 将来モードが増える場合の明示的なモード

どちらを採用するかは、Submodule 内へ移す src/ の範囲と、公開側でProduct専用機能を隠す必要があるかを確定してから判断する。ビルド対象を選ぶだけなら環境変数は不要。

## 実装時のTODO

1. Product Submodule のリポジトリを用意し、公開側ルートの Product/ に追加する。
2. packages/2026-Q4/ と商品固有 assets を移行する。
3. packages/index.ts を OmikujiBot / StrawberryChocolate の2商品だけに固定する。
4. Product 商品用のビルド入口・index を設計する。公開用 index から Product を import しない。
5. definePackage の category/key/dir 解決を Submodule 配置に対応させる。
6. ConfigResolver、extraFiles、README URL、プリセット参照を Submodule 配置に対応させる。
7. Vite の画像・音声アセット探索を Submodule 配下に対応させる。
8. TypeScript、ESLint、dependency-cruiser、Vite alias の対象範囲を整理する。
9. src/ 内の製品固有コードを、共通機能との依存関係を見て移行するか判断する。
10. isDev は開発者向けフラグとして維持し、Product モードが必要か検証する。
11. Submodule 未取得の Public clone で OmikujiBot / StrawberryChocolate のビルドが成功することを確認する。
12. Product Submodule 取得時に、対象商品のビルド・アセット同梱・プリセット処理が成功することを確認する。
13. 公開リポジトリの Git 履歴・追跡状態に商品内容物が残らないよう移行する。過去に公開済みの履歴がある場合は、必要に応じて履歴整理も別途判断する。

## 完了条件

- Public リポジトリだけで OmikujiBot と StrawberryChocolate をビルドできる。
- Public の packages/index.ts に Product 商品の import が存在しない。
- Product 商品の定義・素材・専用データが OmikujiBotV3-Product で管理される。
- Product Submodule 未取得でも、Public 側の通常開発・ビルドに支障がない。
- Product Submodule を取得した環境では、別のビルド入口から商品をビルドできる。
- 開発者向け機能の判定である isDev と、Product 機能の有効範囲が混同されていない。
