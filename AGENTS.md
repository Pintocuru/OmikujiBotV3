# AGENTS.md

## エディター UI スタイル統一作業

### 目的・参照

- 目的: `src/`(`src/games/` は直接変更しない。独自ボタンがあれば報告のみ)のボタン・アイコン・`title`・DaisyUI tooltip を統一する。
- 再開時は最初に次を読む: `docs/conventions/editor-ui-style.md`(恒久ルール)/ `docs/work/editor-ui-style-work.md`(指示書)/ 本セクション。
- 指示書 §3 の対象範囲(`editor/`・`console/` のみ、`src/ui/` 不可)と、指示書 §5 の「単位1〜4完了」は古い。**最初からやり直し**。対象は `src/`(`games/` 除く)、`src/ui/` も対象。
- 通常時のボタン色の問題が主眼: `btn-neutral` の多用(`src` 内37ファイル)、`btn-soft` + `text-*-content` の併用による文字色崩れ。
- コミット・push は不可(403)。**差分 patch で提出**する。判断が必要な点は推測せず質問する。

### 進め方

- 1ディレクトリ(または機能)=1 patch。調査 → 修正 → 検証 → 本セクション更新の順で、複数単位をまとめない。
- 色は操作の役割で選ぶ(`btn-neutral` は背景とのコントラスト確認時のみ)。`bg-primary` 等の色付き背景上では、色なしの `btn` を優先候補にする。
- 報告は端的に(変更内容・例外・未実施のみ)。

### 進捗

| 単位 | 範囲                             | 状態                                                       |
| ---- | -------------------------------- | ---------------------------------------------------------- |
| 1    | `src/editor/shell/`              | patch 提出済み(`ui-style-unit1-shell.patch`)。適用は依頼者 |
| 2    | `src/editor/parts/`              | patch 提出済み(`ui-style-unit2-parts.patch`)。適用は依頼者 |
| 3〜  | 下記チェックリスト(`apps/` から) | 未着手                                                     |

### 単位1の結果(`src/editor/shell/`)

- `TopBar.vue`: ジェネレーター切替・テーマ切替の `btn-neutral` を削除(色なし `btn`、使用不可時のみ `btn-warning`)。切替ボタンの `title` を tooltip(`tooltip-bottom`)に変更、`gap-2` 追加。
- `useSaveActions.ts`: `text-*-content` を削除(`btn-soft` 時の文字色崩れ対策)。
- `GeneratorView.vue`: 「ツール」切替を `btn-xs` → `btn-sm`。
- 例外として残す: 保存ボタンの `btn-lg`(サーバー未接続時のみ)、サイドバーボタンの hover 上書き(hover で色が変わるため)、`IssuesBadge.vue` / バージョンの `badge`(`btn` ではない)。
- 検証: patch の `git apply --check` のみ実施。`vue-tsc` / ESLint / light・dark の通常時・hover / tooltip の表示は**未実施**。

### 単位2の結果(`src/editor/parts/`)

- `ColorPicker.vue`: `btn-xs btn-neutral` → `btn btn-sm`(色なし)。
- `MessageTextDialog/`: 「詳細編集」を `btn-primary` → `btn-secondary`。パネル内の `btn-xs` を `btn-sm` に、アイコンを `:size` 指定から `w-4 h-4`、間隔を `gap-1` → `gap-2` に統一。「作成」の `btn-warning` → `btn-secondary`、「キー挿入」の `btn-primary` → `btn-secondary`、「追加」(ghost)→ `btn-secondary`、ダイアログの「挿入」`btn-accent` → `btn-primary`。
- `title` → tooltip: `PlaceholderPanel.vue` の簡易プレースホルダー(`tooltip-bottom`)と挿入アイコン(`tooltip-left`、`aria-label` 追加)。
- 削除アイコンのボタン2か所に `aria-label` を追加。i18n に `scenarioStep.common.remove`(ja「削除」/ en「Delete」)を追加。
- 変更なし: `BaseDialog.vue` / `ModalFooterActions.vue` / `ExternalLinkButton.vue`(規約どおり)、`HelpButton.vue` / `SettingItem.vue` の `btn-xs`(インライン配置のため例外)、`MenuDropdown.vue`(dropdown 用 `label`)。
- 検証: patch の `git apply --check` のみ。`vue-tsc` / ESLint / light・dark の通常時・hover / tooltip の表示・clipping は**未実施**。

### 未解決・要確認

- [ ] `ColorThemeChip.vue`: `btn` ではない独自ボタン(お気に入り星の `title`)。tooltip 化するか
- [ ] `PlaceholderPanel.vue`: 文字列ボタン(`badge` 形、`title` あり)は `btn` ではないので未変更
- [ ] 単位2の tooltip は、ダイアログ内の `overflow` で切れないか未確認
- [ ] `SaveMenu.vue`: 保存主ボタンの `title`、▾ボタンの tooltip 化(`join` / `indicator` / `dropdown` の入れ子で見た目が崩れないか未確認のため未変更)
- [x] `GeneratorStage.vue` の `btn-xs`(`input-xs` / `range-xs` と並ぶ小型ツールバー)を `btn-sm` に揃えるか
- [ ] `src/games/` 内の独自ボタン(見つけたら報告のみ。単位ごとに記録)

### 次の単位チェックリスト

- [x] `src/editor/parts/`(patch 提出済み)
- [x] `src/editor/apps/`
- [ ] `src/editor/assets/`
- [ ] `src/editor/content/`
- [ ] `src/editor/events/`
- [ ] `src/editor/helpers/`
- [ ] `src/editor/preview/`
- [ ] `src/editor/ui/`
- [ ] `src/editor/sidebar/`
- [ ] `src/editor/`(直下: `App.vue` / `EditorApp.vue`)
- [ ] `src/console/`
- [ ] `src/manager/`
- [ ] `src/ui/`
- [ ] `src/generator/`
- [ ] 最終確認: `btn-neutral` の残存検索、サイズ未指定の `btn`、アイコンのみボタンの `aria-label`
