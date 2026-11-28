# Product の商品単位ディレクトリ構成（案B）実現可能性調査

## 目的

非公開 Submodule `OmikujiBotV3-Product` の商品データを、四半期単位かつ商品単位で管理する構成（案B）が、現在の `OmikujiBotV3` の実装で実現可能かを調査する。

この文書は、他のエージェントに調査を依頼するためのもの。**実装・ファイル移動・設定変更は行わない。**

## 前提・合意事項

- Submodule リポジトリ名は `OmikujiBotV3-Product`。
- 親リポジトリ `OmikujiBotV3` のルートに Submodule を配置する。
- ローカルでの配置ディレクトリ名は `products/`。Submodule は作成済み。
- Submodule 直下に商品関連のディレクトリを置く。
- 商品固有の `src/` は Submodule に置かない方針。共通エンジン・共通機能のソースはPublic側に残す。
- `packages/` と `assets/` を別々に四半期単位で管理する案Aは採用しない。
- 目標は、商品定義・商品固有素材を同じ商品ディレクトリにまとめる案B。
- `server/presets/` の移行先は別途決定済み。本調査で移行先を再検討しない。
- Public側はSubmodule未取得でも、公開対象の `OmikujiBot` と `StrawberryChocolate` をビルドできることを維持する。

## 目標構成

基本形：

```text
OmikujiBotV3/
├─ src/                         # Public: 共通エンジン・共通機能
├─ packages/                    # Public: 公開商品
├─ assets/                      # Public: 共通素材・公開商品素材
├─ server/
├─ tools/                       # Public: 共通ビルド基盤など
└─ products/                    # Submodule: OmikujiBotV3-Product
   └─ 2026-Q4/
      ├─ LifeHourglass/
      │  ├─ build.ts
      │  ├─ main.ts
      │  ├─ editor.ts            # 必要な場合
      │  ├─ console.ts           # 必要な場合
      │  └─ assets/
      │     ├─ images/
      │     └─ sounds/
      ├─ MaidenOmikuji/
      │  ├─ build.ts
      │  ├─ main.ts
      │  └─ assets/
      └─ _shared/                # 複数商品で共有するものが実際にある場合のみ
```

上記は検討対象の構成例。全商品に `assets/` を必須化する意図はない。共有素材の置き場や階層は、既存素材の利用実態を確認して提案すること。

商品ごとのフォルダを一か所にまとめることが目的であり、同じ商品名が `packages/` と `assets/` の両方に現れる構造にはしない。

## 現行実装で確認できたこと

以下は現行コードから確認できた事実。調査時には対象ブランチの最新状態を再確認すること。

### 1. `definePackage()`

対象：`tools/viteBuild/definePackage.ts`

- 呼び出し元の `import.meta.url` から `build.ts` のディレクトリを求める。
- そのディレクトリ名を `key`、親ディレクトリ名を `category` としている。
- `dir` は `build.ts` が置かれた商品ディレクトリ。

現在の前提は `packages/<category>/<key>/build.ts`。

案Bの `products/2026-Q4/<key>/build.ts` では、親ディレクトリ名から得られるcategoryは `2026-Q4` となる。現在のcategoryの意味・README URL・バナーURLなどと整合するかを調べる必要がある。

検討事項：

- category / key / dir を明示的に指定するAPIにするべきか。
- `dir` はSubmodule内の商品ディレクトリを指すだけでよいか。
- 既存商品の呼び出し方との後方互換性をどう保つか。

### 2. `ConfigResolver`

対象：`tools/viteBuild/core/ConfigResolver.ts`

確認できた現状：

- `packageRoot` は `PROJECT_ROOT`。
- entry point は `definePackage()` が返す商品 `dir` を基準に解決。
- プリセットJSONのルートは `PROJECT_ROOT/server/presets/` 固定。
- `extraFiles` は `PackageVariant` から引き継いでいる。
- README / banner URL はcategoryとseriesから組み立てている。

検討事項：

- 商品ディレクトリとビルド基盤のルートを別々に扱えるか。
- `extraFiles.from` の相対パスの基準をどう定義するか。現状の指定例にはPublicルート基準のパスがある。
- 出力先、README、バナー、商品識別子の組み立てをどう保つか。
- プリセットJSONの参照先は決定済みの移行先を使い、Public/Submodule双方のビルドで解決できるか。

### 3. Vite画像・音声アセット探索

対象：

- `tools/viteConfig/imageAssetsPlugin.ts`
- `tools/viteConfig/soundAssetsPlugin.ts`
- `vite.config.ts`

確認できた現状：

- 開発サーバー向けのmiddleware plugin。
- 画像はPublicルートの `assets/images/`、音声はPublicルートの `assets/sounds/` を探索する。
- 画像・音声とも中間フォルダ名から `common` / `wip` / 四半期フォルダ等を探索する方式。
- URLは `/images/...` / `/sounds/...` の形を維持する。

検討事項：

- 商品ディレクトリ内の `assets/images` / `assets/sounds` をどのように探索対象に加えるか。
- 商品名を含むURLにするか、既存の短いURLを維持するか。
- 同名素材が複数商品にある場合の衝突回避。
- 開発サーバーと商品ビルドで同じ解決規則を使えるか。
- Viteの開発時middlewareだけでなく、ビルド時に素材がどのように参照・コピーされるかも確認すること。

### 4. TypeScript / Vite alias

対象：

- `tsconfig.json`
- `tools/viteConfig/CreateViteAliases.ts`
- Vite設定・ビルド時のalias生成処理

確認できた現状：

- TypeScriptのpathsはPublicルートの `src/`、`assets/`、`packages/`、`server/`、`tools/` を基準にしている。
- includeにはPublic側の `packages/**/*.ts`、`server/**/*.ts`、`tools/**/*.ts` などが指定されている。

検討事項：

- Submodule側の商品コードからPublic側の共通ソースをimportできるか。
- Submodule側のコードや設定ファイルも型チェック対象に含められるか。
- Submodule未取得でもPublic側の型チェックを成立させられるか。
- aliasにSubmodule専用のものを追加する必要があるか。
- Public側の型チェック・lint・dependency-cruiserの境界をどうするか。

### 5. ビルド入口とビルド基盤

対象：

- `packages/build.ts`
- `packages/index.ts`
- `tools/viteBuild/buildPackages.ts`
- `tools/viteBuild/constants/system.ts`
- `tools/viteBuild/buildOptions/`

確認できた現状：

- Public側のビルド入口は `packages/build.ts`。
- ビルド対象は `packages/index.ts` のimport/exportで管理。
- `buildPackages()` は `PROJECT_ROOT` を出力先・検査対象などに使用する。
- `PROJECT_ROOT` は共通ビルド基盤のファイル位置からPublicリポジトリルートを算出している。

検討事項：

- Public用のビルド入口とProduct用のビルド入口を分離する具体案。
- Product用入口からSubmodule内の `build.ts` を読み込む方法。
- `buildPackages()` が複数の商品root / repository root を扱えるようにする必要があるか。
- Public側の型チェック・依存関係検査をProduct側ビルド時にどのように拡張するか。
- Submodule未取得の状態でPublicビルドが失敗しないこと。
- Product用ビルドでPublic側の共通ソース、依存パッケージ、設定を利用できること。

### 6. 商品実装の依存関係

案Bでは商品ディレクトリに `main.ts` などが置かれるが、商品固有のVue/TS実装をSubmoduleへ移すとは限らない。ユーザー方針として商品専用 `src/` は置かない。

調査対象：

- 商品の `main.ts` / `editor.ts` / `console.ts` からPublic側 `src/` へのimport。
- Public側の `src/` に置かれている商品固有UI・ゲーム・スキーマ・型・i18nとの依存。
- 商品専用コードと共通機能の境界。
- 商品固有コードをSubmoduleへ移さない場合、Public側に残す商品専用コードをどう登録・ビルドするか。

商品専用コードを移す必要がある場合も、商品用 `src/` をSubmoduleに作ることを前提にせず、依存方向や配置を比較して提案すること。

## 調査してほしいこと

次の観点で、具体的なコード参照を付けて評価する。

1. 案Bは現行設計を活かして実現可能か。
2. 必要な変更を「小規模 / 中規模 / 大規模」に分類し、その根拠を示す。
3. 変更対象ファイルと、各ファイルで必要になる変更内容を列挙する。
4. 既存のPublic商品（OmikujiBot / StrawberryChocolate）のビルドに影響する箇所を特定する。
5. Product商品をビルドするために必要な新しい入口・設定・APIを提案する。
6. 商品ごとのassetsを商品ディレクトリに置く場合、画像・音声の参照方法と同名ファイル衝突をどう扱うか。
7. Submodule未取得時のPublic開発・型チェック・ビルドをどう維持するか。
8. 商品固有コードをPublic側 `src/` に残す場合と、別の場所へ移す場合の長所・短所を比較する。
9. 段階的に導入できるか。可能なら安全な移行順序を示す。
10. 案Bを採用した場合の最終的なディレクトリ構成を提案する。

## 調査上の注意

- **実装・編集・ファイル移動・コミットは行わない。**
- コードから確認できた事実と、設計上の推測・提案を分ける。
- 「検索で見つからなかった」ことを「存在しない」と断定しない。依存関係を追って確認する。
- ファイル名だけで判断せず、実際のimport・参照・パス解決処理を追う。
- 大改修かどうかを先に決めつけない。変更範囲と理由を示す。
- 既存の共通ビルド基盤を商品専用に複製する案は、保守負担も含めて慎重に評価する。
- `server/presets/` の移行先は既決事項として扱い、再提案しない。
- `isDev` や第三の環境変数は今回の主題ではない。案Bの実現に本当に必要な場合だけ理由を説明する。

## 調査結果の提出形式

次の順で簡潔にまとめる。

1. 結論（案Bの実現可能性と改修規模）
2. 現行設計で流用できる部分
3. 必須変更箇所一覧（ファイルパス・理由・規模）
4. 技術的な懸念と未確認事項
5. 推奨する実装方針
6. 段階的な移行手順
7. 推奨ディレクトリ構成
