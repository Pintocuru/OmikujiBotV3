# src/ui の役割別フォルダ分け(指示書)

> 状態: **完了**

置き場所の想定: `docs/work/ui-folder-categorize.md`

## 目的

`src/ui` 直下に UI が17個横並びで読みづらい。役割別のフォルダに分ける。
**パスの移動と import の書き換えだけ**を行う。挙動・型・保存データは変えない。

## 分類の基準

「視聴者が最初に目にする主役は何か」で決める。仕組みや副次機能は基準にしない。
(例: LiveClock はコメントも出すが、主役は時計付きの BOT なので BOT演出)

## 移動先

| 新フォルダ | 役割 | UI |
|---|---|---|
| `src/ui/bot/` | BOT演出 | CharacterStage / CommentBubble / KujibikiPanel / FlashBanner / ToastWidgets / LiveClock |
| `src/ui/counter/` | 時間・カウンター | StreamCounter / CookieCounter / SnipeTimer / LifeHourglass |
| `src/ui/game/` | ゲーム | DeadAir / LiverBingo / GameRanking |
| `src/ui/user/` | ユーザー | UserBoard / LabelMaker / FlightSeat / LuckyDraw |

- `src/ui/common/` と `src/ui/uiRegistry.ts` は直下のまま動かさない。
- 「ユーザーコメント」(`comment/`)は UI が未作成なのでフォルダを作らない(最初の UI を作るときに作る)。
- 各 UI フォルダの中身(`components/` `editor/` `composables/` など)は一切変えず、フォルダごと移す。

## 変えないもの

- `UiKind` の値、スキーマのキー(`commentBubble` など)、保存データ
- `src/types/ui/`(型定義は平置きのまま)
- `uiSchemas.stable.ts` / `uiSchemas.experimental.ts`(安定/実験の分類はここだけで持つ。フォルダに持ち込まない)
- i18n キー
- 各ファイル1行目のパスコメントのズレ(自前ツールで修復されるので無視)

## 前提条件

- 最新の main から作業する。
- CookieCounter・SnipeTimer など、UI フォルダ内を触る進行中の patch が適用済みであること。未適用なら、移動の前に確認する。

## 手順

### 1. フォルダを移動する

`git mv` で上の表のとおり移す(patch は rename 検出つき `git diff -M` で作る)。

### 2. 絶対パスの import を書き換える

`@/ui/<UI名>/` → `@/ui/<フォルダ>/<UI名>/`

例: `@/ui/DeadAir/DeadAirSelector.vue` → `@/ui/game/DeadAir/DeadAirSelector.vue`

- `@/ui/common/` と `@/ui/uiRegistry` は書き換えない。
- 動的 import(`() => import('@/ui/...')`)も同様に書き換える。
- `.vue` / `.ts` だけでなく `.md` 内のパス記述も対象(例: `src/ui/LifeHourglass/LifeHourglass.md`)。

### 3. 壊れる相対パスを直す

UI フォルダの内側で閉じた相対 import(`../../XxxRegistry` など)は、フォルダごと移すので影響しない。
壊れるのは `src/ui/common` を相対パスで指しているもの。確認できた3件は次のとおり。

- `src/ui/LiveClock/LiveClock.vue`
- `src/ui/KujibikiPanel/KujibikiPanel.vue`
- `src/ui/ToastWidgets/ToastWidgets.vue`

いずれも `'../common/useFilteredBotMessages'` → `'@/ui/common/useFilteredBotMessages'` にする(相対のまま `../../common` にしない)。
同種の指し方が他にもないか、`'../common` / `'../../common` / `'../../../common` を `src/ui` 内で grep して確認する。

### 4. src/ui の外にある参照を直す

コード検索で見つけたもの。検索は漏れがあり得るので、手順5の確認で最終的に潰す。

- `src/register/registerUi.ts`(UI 本体と、各 `register` の import)
- `src/register/registerUiEditor.ts`
- `src/maps/ui/UiSlotsEditorMap.ts`
- `src/layout/common/SesupinTest/SesupinTest.vue`
- `src/layout/common/GameRanking/GameRanking.vue`
- `src/layout/common/KujibikiPanel/KujibikiPanel.vue`
- `src/layout/common/CommentBubble/CommentBubble.vue`
- `src/layout/2026-Q4/LifeHourglass/LifeHourglass.vue`
- `src/generator/App.vue`
- `src/editor/ui/conditions/LayoutEditor.vue`
- `src/editor/assets/scenarios/preview/CommentBubbleMessagePreview.vue`
- `src/editor/apps/appInfo/AvailableFeatures/AvailableFeaturesInfo.vue`
- `src/common/buildValidation/validateAgainstBuild.ts`
- `packages/_shared/commentBubble.ts` / `commentBubbleEditor.ts`
- `packages/2026-Q4/LifeHourglass/main.ts` / `editor.ts`
- `packages/2026-Q4/MaidenOmikuji/main.ts` / `editor.ts`

### 5. docs を直す

`src/ui` のパスを書いている次のファイルを更新する。

- `docs/architecture/UI.md`(分類の基準と移動先の表を、この指示書の内容で追記する)
- `README.md` / `README.ja.md`
- `docs/conventions/README.md` / `naming.md` / `ui-component-registry.md`
- `docs/work/ui-component-registry-migration.md` / `editor-ui-style-work.md`

### 6. 取りこぼしの確認

- `@/ui/(CharacterStage|CommentBubble|KujibikiPanel|FlashBanner|ToastWidgets|LiveClock|StreamCounter|CookieCounter|SnipeTimer|LifeHourglass|DeadAir|LiverBingo|GameRanking|UserBoard|LabelMaker|FlightSeat|LuckyDraw)/` が1件も残っていないこと(grep)。
- 文字列で組み立てるパスがないこと。`src/ui` を指す文字列、`import.meta.glob`、`tools/viteConfig`、`packages/**/build.ts`、webpack 設定を確認する。
- 型チェック(`vue-tsc`)が通ること。
- 開発版と StrawberryChocolate のビルドが通ること。

## 提出

- 1回の patch(`ui-folder-categorize.patch`)でまとめる。コミット・プッシュはしない。
- `AGENTS.md` の作業ログには追記しない。
- 挙動の確認ができなかったものは、確認していないと明記する。

## 報告

変更内容・例外・未実施のことだけを短く書く。
