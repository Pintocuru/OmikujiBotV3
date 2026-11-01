# Batch 03 — i18n audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Source commit: `858ec86d3854d42b35c9821c4c44d416ba99114e`
- Scope: `src/editor/assets/characters/`
- Files: 8
- Total lines: 664
- Code changes: none

## 対象ファイル

1. `src/editor/assets/characters/CharacterEditor.vue` (71 lines)
2. `src/editor/assets/characters/CharacterImage/CharacterImageSettings.vue` (99 lines)
3. `src/editor/assets/characters/CharacterImage/EmotionAnimationEditor.vue` (108 lines)
4. `src/editor/assets/characters/CharacterImage/EmotionCard.vue` (34 lines)
5. `src/editor/assets/characters/CharacterImage/EmotionEditModal.vue` (96 lines)
6. `src/editor/assets/characters/CharacterImage/EmotionGrid.vue` (100 lines)
7. `src/editor/assets/characters/CharacterImage/EmotionImageItem.vue` (54 lines)
8. `src/editor/assets/characters/CharacterImage/EmotionLayerEditor.vue` (102 lines)

## 検出結果

| ファイルパス:行 | 該当コード | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/assets/characters/CharacterImage/EmotionImageItem.vue:15` | `key: {{ emotionKey }}` | hardcoded string | UI上の技術用語として英語表記を維持する仕様でなければ、翻訳キーを用意する（例: `キー:` / `Key:`）。 | 中 |

## 照合結果

- `CharacterImageSettings.vue` が参照する `characterImage.newEmotionPlaceholder` / `numericKeyError` / `add` は、`src/i18n/editor/apps/AppItemsCharacters.ts` の ja/en に存在。
- `EmotionAnimationEditor.vue` の動的キー `mapText.loopMotion.${key}.label` は、`loopMotionMap` の全17キー（none, bounce, shake, swing, wobble, rotate, rotateR, rubberBand, jello, tilt, headShake, pulse, flash, tada, combo, joyful, gentle）について、`src/i18n/editor/maps/CharacterMapMessages.ts` の ja/en に対応する label が存在。
- `EmotionEditModal.vue` / `EmotionImageItem.vue` / `EmotionLayerEditor.vue` が参照する `characterImage.editModal.*` / `characterImage.item.*` / `characterImage.layer.*` は ja/en に存在。
- `CharacterEditor.vue` の `categorySections.characterStyle` / `categorySections.imageSettings` は `CategorySectionMessagesMap.ts` の ja/en に存在。
- `AppItemsCharacters.ts` は `messageModules.ts` に登録済み。Map翻訳は `OmikujiDataMaps.ts` 経由で統合される。
- `EmotionCard.vue` の表示名、`EmotionImageItem.vue` の placeholder はユーザー定義データ/キーの表示であり、翻訳漏れとして扱っていない。
- `EmotionAnimationEditor.vue` の `s` は秒のSI記号であり、固定ロケール依存表記とは判断しない。
- アイコンのみの操作ボタンにアクセシブルネームがない点は確認したが、翻訳漏れではなくアクセシビリティ課題のため本件の検出件数には含めない。

## 集計

- Missing key（confirmed）: 0
- Missing key（needs confirmation）: 0
- Hardcoded UI strings: 1
- Empty / untranslated values: 0
- Dynamic key candidates: 1（17/17 keys resolved; no missing entry）
- Locale formatting / pluralization: 0
- 要確認: 0

## 静的解析

ESLint / eslint-plugin-vue は依存関係に存在するが、vue-i18n 専用 ESLint plugin / vue-i18n-extract は存在せず、専用ルール設定も確認されていない。GitHub API の読み取り環境ではリポジトリコマンドを実行できないため、lint等は未実行。

## 調査上の制約

翻訳定義との照合は GitHub 上の現行ファイルを読み取り確認した。コード・翻訳定義・設定ファイルは変更していない。
