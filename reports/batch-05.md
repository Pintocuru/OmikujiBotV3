# Batch 05 — i18n audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Source commit: `e55c164c94edbe3fdff3f6e3c54ec75c7cdb97e2`
- Scope: `src/editor/assets/mikuji/` (first 8 files in current tree)
- Files: 8
- Total lines: 533
- Code changes: none

## 対象ファイル

1. `src/editor/assets/mikuji/MikujiSettings.vue` (45 lines)
2. `src/editor/assets/mikuji/composables/useBoxOmikujiList.ts` (79)
3. `src/editor/assets/mikuji/composables/useOmikujiLottery.ts` (65)
4. `src/editor/assets/mikuji/composables/useOmikujiWeight.ts` (46)
5. `src/editor/assets/mikuji/composables/useWeightItemDialog.ts` (24)
6. `src/editor/assets/mikuji/item/OmikujiItemControlSettings.vue` (25)
7. `src/editor/assets/mikuji/item/OmikujiItemCriteria.vue` (132)
8. `src/editor/assets/mikuji/item/OmikujiItemEditor.vue` (117)

## 検出結果

| ファイルパス:行 | 該当コード | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/assets/mikuji/MikujiSettings.vue:6` | `data-tip="わんコメを起動すると、投稿の確認ができます"` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/MikujiSettings.vue:9` | `抽選テスト` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/MikujiSettings.vue:15` | `おみくじを追加` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/MikujiSettings.vue:20` | `おみくじ / シナリオ / クールダウン` | hardcoded string | 翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/item/OmikujiItemCriteria.vue:6-10` | 条件設定の説明カード内の日本語4箇所 | hardcoded string | 説明カードの各文言を翻訳キー化する。 | 高 |
| `src/editor/assets/mikuji/item/OmikujiItemCriteria.vue:77` | `message="発動条件が指定されていません"` | hardcoded string | `NoParamsCard` の message を翻訳関数経由にする。 | 高 |
| `src/editor/assets/mikuji/composables/useOmikujiWeight.ts:37` | `name: `${src.name}(コピー)`` | hardcoded string | 複製名に付ける接尾辞を翻訳化する。保存データに入るため、英語UIでも日本語が残る。 | 中 |

## 照合結果

- `OmikujiItemEditor.vue` の動的キー `mapText.omikujiItemKind.${key}.label` / `description` は、`steps` / `control` の2値について `ScenarioMapMessages.ts` に ja/en の定義が存在。
- 同ファイルの `mapText.omikujiControlCommand.${command}.label` / `description` は、`return` / `continue` の2値について ja/en の定義が存在。
- これらの翻訳は `OmikujiDataMaps.ts` から統合され、同モジュールは `messageModules.ts` に登録済み。
- `OmikujiItemControlSettings.vue` の `omikujiItem.control.*`、`OmikujiItemCriteria.vue` の `omikujiItem.criteria.*` は `OmikujiItemMessages.ts` の ja/en に存在。同翻訳モジュールも `messageModules.ts` に登録済み。
- composable 3ファイル（`useBoxOmikujiList.ts`, `useOmikujiLottery.ts`, `useWeightItemDialog.ts`）にユーザー向け表示文言はない。
- `OmikujiItemCriteria.vue` 内の `t` は import / 初期化されているが、このファイル内では使用されていない。未翻訳文言が残っているため、翻訳化の際に利用可能。
- `useOmikujiWeight.ts:37` の複製接尾辞は表示名データに含まれる。UIで表示される可能性があるため検出対象としたが、保存データ上の名称仕様として固定する意図があるかは実装側で確認が必要。

## 集計

- Missing key（confirmed）: 0
- Missing key（needs confirmation）: 0
- Hardcoded UI strings: 10（MikujiSettings 4、OmikujiItemCriteria 5、複製名接尾辞 1）
- Empty / untranslated values: 0
- Dynamic key candidates: 2 groups（item kind 2値、control command 2値。全て ja/en 解決）
- Locale formatting / pluralization: 0
- 要確認: 1（複製名の「(コピー)」をロケール依存にすべきか）

## 静的解析

ESLint / eslint-plugin-vue は依存関係に存在するが、vue-i18n 専用 ESLint plugin / vue-i18n-extract は存在せず、専用ルール設定も確認されていない。GitHub API の読み取り環境ではリポジトリコマンドを実行できないため、lint等は未実行。

## 調査上の制約

翻訳定義との照合は GitHub 上の現行ファイルを読み取り確認した。コード・翻訳定義・設定ファイルは変更していない。
