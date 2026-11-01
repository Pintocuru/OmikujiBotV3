# Batch 06 — i18n audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Source commit: `3781a12b4805acd0ca8d79aee8782682549f7449`
- Scope: `src/editor/assets/mikuji/item/` and `src/editor/assets/mikuji/weight/`
- Files: 8
- Total lines: 591
- Code changes: none

## 対象ファイル

1. `src/editor/assets/mikuji/item/OmikujiItemHeader.vue` (77 lines)
2. `src/editor/assets/mikuji/item/OmikujiItemPriority.vue` (67)
3. `src/editor/assets/mikuji/item/OmikujiItemScenario.vue` (96)
4. `src/editor/assets/mikuji/item/ScenarioPickerDialog.vue` (119)
5. `src/editor/assets/mikuji/weight/WeightBar.vue` (58)
6. `src/editor/assets/mikuji/weight/WeightItem.vue` (61)
7. `src/editor/assets/mikuji/weight/WeightItemCooldown.vue` (41)
8. `src/editor/assets/mikuji/weight/WeightItemDialogs.vue` (72)

## 検出結果

| ファイルパス:行 | 該当コード | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/assets/mikuji/item/OmikujiItemHeader.vue:15` | `placeholder="運勢の種類"` | hardcoded string | 既存の `omikujiItem.header.name.label` 等を利用するか、placeholder用キーを追加。 | 高 |
| `src/editor/assets/mikuji/item/OmikujiItemPriority.vue:17` | `設定する` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/item/OmikujiItemPriority.vue:42` | `適用時、このおみくじが必ず適用されます` / `他のおみくじと同じ抽選を行います` | hardcoded string | true / false の状態説明をそれぞれ翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/item/ScenarioPickerDialog.vue:42` | `key: {{ scenario.key }}` | hardcoded string | UI上の技術用語として英語固定が意図されていなければ翻訳キー化する。 | 中 |
| `src/editor/assets/mikuji/item/ScenarioPickerDialog.vue:62` | `close` | hardcoded string | backdrop button のアクセシブルなテキストを翻訳化する。 | 高 |
| `src/editor/assets/mikuji/weight/WeightItemCooldown.vue:7` | `title="クールダウン(秒)"` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/weight/WeightItemCooldown.vue:18` | `秒` | hardcoded string / locale unit | 単位表記を翻訳キーまたはロケール対応の数値・単位フォーマットにする。 | 高 |
| `src/editor/assets/mikuji/weight/WeightItemDialogs.vue:8` | `title="名前・説明"` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/weight/WeightItemDialogs.vue:27` | `title="追加条件"` | hardcoded string | 既存の `omikujiItem.priority.sectionTitle` を利用する。 | 高 |
| `src/editor/assets/mikuji/weight/WeightItemDialogs.vue:36` | `title="実行内容"` | hardcoded string | 既存の `omikujiItem.editor.kind.label` を利用する。 | 高 |

## 照合結果

- `OmikujiItemHeader.vue` の label / description は `omikujiItem.header.name.*` として ja/en に存在。placeholder のみ固定日本語。
- `OmikujiItemPriority.vue` の `omikujiItem.priority.*` は ja/en に存在するが、toggle補助文言と「設定する」は未翻訳。
- `OmikujiItemScenario.vue` が参照する `omikujiItem.scenario.*` は ja/en に存在。
- `ScenarioPickerDialog.vue` が参照する `omikujiItem.scenario.dialog.*` と `omikujiItem.scenario.unlink/create` は ja/en に存在。key表示と backdrop の close テキストはハードコード。
- `WeightItemCooldown.vue` は秒単位の固定日本語を表示する。
- `WeightItemDialogs.vue` の3つのダイアログタイトルは、既存の翻訳キーで代替できる（「名前・説明」用は対応する既存キーがあるか対象外の BaseSettings 翻訳定義との照合が必要なため、翻訳キー化を推奨）。
- `WeightBar.vue` / `WeightItem.vue` に表示文言はない。
- `ScenarioPickerDialog.vue:39` の `{count} step(s)` は英語の括弧表記で単複を明示している。vue-i18n pluralization の不足と断定する根拠はないため、検出件数には含めない。

## 集計

- Missing key（confirmed）: 0
- Missing key（needs confirmation）: 0
- Hardcoded UI strings: 10
- Empty / untranslated values: 0
- Dynamic key candidates: 0
- Locale formatting / pluralization: 1（秒の固定単位表記）
- 要確認: 1（`key:` を英語固定の技術ラベルとして扱う仕様か）

## 静的解析

ESLint / eslint-plugin-vue は依存関係に存在するが、vue-i18n 専用 ESLint plugin / vue-i18n-extract は存在せず、専用ルール設定も確認されていない。GitHub API の読み取り環境ではリポジトリコマンドを実行できないため、lint等は未実行。

## 調査上の制約

翻訳定義との照合は GitHub 上の現行ファイルを読み取り確認した。コード・翻訳定義・設定ファイルは変更していない。
