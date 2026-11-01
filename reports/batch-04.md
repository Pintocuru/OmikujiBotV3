# Batch 04 — i18n audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Source commit: `8e24623dbdc7524b0ef3c106ea72ec1c2b6ff8ba`
- Scope: `src/editor/assets/characters/` (remaining character image/color/service files)
- Files: 8
- Total lines: 464
- Code changes: none

## 対象ファイル

1. `src/editor/assets/characters/CharacterImage/EmotionPresetButtons.vue` (33 lines)
2. `src/editor/assets/characters/CharacterImage/ImageSettingsInfo.vue` (33)
3. `src/editor/assets/characters/CharacterImage/composables/useEmotionDraft.ts` (38)
4. `src/editor/assets/characters/color/CharacterColorCard.vue` (59)
5. `src/editor/assets/characters/color/CharacterColorSettings.vue` (34)
6. `src/editor/assets/characters/service/CharacterBase64Settings.vue` (111)
7. `src/editor/assets/characters/service/CommentVoiceCard.vue` (61)
8. `src/editor/assets/characters/service/CommentVoiceSettings.vue` (95)

## 検出結果

| ファイルパス:行 | 該当コード | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/assets/characters/service/CommentVoiceSettings.vue:11` | `t(`mapText.${key}.label`)` | missing key / dynamic key | `mapText.displayMode.${key}.label` に修正。displayModes の comment / voice / none 全3値について現行パスに該当キーなし。 | 高 |
| `src/editor/assets/characters/service/CommentVoiceSettings.vue:14` | `t(`mapText.${currentDisplayOption.mode}.desc`)` | missing key / dynamic key | `mapText.displayMode.${mode}.description` に修正。現在は namespace と leaf 名の両方が翻訳定義と不一致。 | 高 |
| `src/editor/assets/characters/service/CommentVoiceSettings.vue:30-31` | `hoge` | hardcoded string | `t('characterService.voice.link')` を使用。既存の翻訳キー `characterService.voice.link` が ja/en に存在する。 | 高 |

## 照合結果

- `EmotionPresetButtons.vue` の `mapText.characterEmotion.${key}.label` は `characterEmotionMap` の全6キーについて ja/en の翻訳が存在。
- `CommentVoiceCard.vue:9` の `mapText.displayMode.${currentOption.mode}.label` は comment / voice / none の全3値について ja/en の翻訳が存在。
- `CommentVoiceSettings.vue:11,14` は上記の有効な namespace `displayMode` を参照していない。また description のプロパティ名も `desc` ではなく `description`。動的値の集合は `displayModes` を参照し、対応する翻訳定義と照合した。
- `AppItemsCharacters.ts` の `characterImage.preset.*`、`characterService.base64.*`、`characterService.voice.*`、`characterService.cards.*` は ja/en の両方に存在。今回 `voice.link` は定義済みだが、テンプレートでは未使用。
- `CharacterColorCard.vue` の `characterService.cards.colorNames.${field}` は name / text / background / accent の4値が ja/en に存在。
- `ImageSettingsInfo.vue` が参照する `characterImage.info.*` と `characterImage.layer.setPath` は ja/en に存在。
- `useEmotionDraft.ts` は UI 文言を持たない。
- `CharacterBase64Settings.vue` の `alt` / `title` は翻訳キーを使用。ファイル選択 input はブラウザー標準UI。
- `CommentVoiceSettings.vue:89-93` の `hoge` オブジェクトはテンプレートから参照されないため、表示文字列の検出には含めていない。

## 集計

- Missing key（confirmed）: 6 dynamic references（2箇所の式 × 3モード）
- Missing key（needs confirmation）: 0
- Hardcoded UI strings: 1
- Empty / untranslated values: 0
- Dynamic key candidates: 2（いずれも候補集合を照合し、欠落を確認）
- Locale formatting / pluralization: 0
- 要確認: 0

## 静的解析

ESLint / eslint-plugin-vue は依存関係に存在するが、vue-i18n 専用 ESLint plugin / vue-i18n-extract は存在せず、専用ルール設定も確認されていない。GitHub API の読み取り環境ではリポジトリコマンドを実行できないため、lint等は未実行。

## 調査上の制約

翻訳定義との照合は GitHub 上の現行ファイルを読み取り確認した。コード・翻訳定義・設定ファイルは変更していない。
