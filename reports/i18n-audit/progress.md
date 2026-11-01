# i18n Audit Progress

- Repository: `Pintocuru/OmikujiBotV3`
- Working branch: `docs/i18n-audit-preparation`
- Audit scope: `src/editor/`
- Locale: `ja` / `en`（default / fallback: `ja`）
- Source commit for Batch 01: `7a057bbcb577dac75e73123a88884f279a2aa4ab`
- Last updated: 2026-11-01
- Code changes: none

## Overall status

- [x] Batch 01
- [x] Batch 02
- [x] Batch 03
- [x] Batch 04
- [x] Batch 05
- [x] Batch 06
- [ ] Batch 07
- [ ] Batch 08
- [ ] Batch 09
- [ ] Batch 10
- [ ] Batch 11
- [ ] Batch 12
- [ ] Batch 13
- [ ] Batch 14
- [ ] Batch 15
- [ ] Batch 16
- [ ] Batch 17
- [ ] Batch 18
- [ ] Batch 19
- [ ] Batch 20
- [ ] Batch 21
- [ ] Batch 22
- [ ] Batch 23
- [ ] Batch 24
- [ ] Batch 25
- [ ] Batch 26
- [ ] Batch 27
- [ ] Batch 28
- [ ] Batch 29
- [ ] Batch 30
- [ ] Batch 31
- [ ] Batch 32
- [ ] Batch 33
- [ ] Batch 34

## Batch 01

Status: completed

Files processed (8 / 8):
- `src/editor/apps/BaseSettings/BaseEditor.vue`
- `src/editor/apps/BaseSettings/BaseTagEditor.vue`
- `src/editor/apps/JsonMerge/JsonMergeEditor.vue`
- `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue`
- `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue`
- `src/editor/apps/appInfo/AppInfoEditor.vue`
- `src/editor/apps/appInfo/AvailableFeatures/AvailableFeaturesInfo.vue`
- `src/editor/apps/appInfo/AvailableFeatures/FeatureCard.vue`

Report: `reports/batch-01.md`

Findings:
- Missing dynamic-key entries: 10
- Missing leaf translation values: 20
- Hardcoded UI strings: 33
- Locale formatting / pluralization: 0
- Needs confirmation: 0

Static analysis:
- ESLint and eslint-plugin-vue are dependencies.
- vue-i18n-specific ESLint plugin / vue-i18n-extract are not dependencies and no vue-i18n-specific ESLint rules are configured.
- Commands not executed: GitHub API inspection environment does not provide repository command execution.

## Batch 02

Planned files:
- `src/editor/apps/appInfo/meta/PackageBasicInfo.vue`
- `src/editor/apps/appInfo/meta/PackageDistributionInfo.vue`
- `src/editor/apps/appInfo/meta/PackageSystemInfo.vue`
- `src/editor/apps/appInfo/settings/EditorSettingsEditor.vue`
- `src/editor/apps/appInfo/settings/GeneratorSettingsEditor.vue`
- `src/editor/apps/dataPacks/DataPackCard.vue`
- `src/editor/apps/dataPacks/DataPacks.vue`
- `src/editor/apps/dataPacks/useDataPacks.ts`

## Batch 02

Status: completed

Files processed (8 / 8):
- src/editor/apps/appInfo/meta/PackageBasicInfo.vue
- src/editor/apps/appInfo/meta/PackageDistributionInfo.vue
- src/editor/apps/appInfo/meta/PackageSystemInfo.vue
- src/editor/apps/appInfo/settings/EditorSettingsEditor.vue
- src/editor/apps/appInfo/settings/GeneratorSettingsEditor.vue
- src/editor/apps/dataPacks/DataPackCard.vue
- src/editor/apps/dataPacks/DataPacks.vue
- src/editor/apps/dataPacks/useDataPacks.ts

Report: reports/batch-02.md

Findings:
- Missing key (confirmed): 0
- Missing key (needs confirmation): 1 dynamic-key candidate set
- Hardcoded UI strings: 33
- Empty / untranslated values: 0
- Locale formatting / pluralization: 0

Static analysis: not run; GitHub API inspection does not provide repository command execution.

## Batch 03

Status: completed

Files processed (8 / 8; 664 lines):
- src/editor/assets/characters/CharacterEditor.vue
- src/editor/assets/characters/CharacterImage/CharacterImageSettings.vue
- src/editor/assets/characters/CharacterImage/EmotionAnimationEditor.vue
- src/editor/assets/characters/CharacterImage/EmotionCard.vue
- src/editor/assets/characters/CharacterImage/EmotionEditModal.vue
- src/editor/assets/characters/CharacterImage/EmotionGrid.vue
- src/editor/assets/characters/CharacterImage/EmotionImageItem.vue
- src/editor/assets/characters/CharacterImage/EmotionLayerEditor.vue

Report: reports/batch-03.md

Findings:
- Missing key (confirmed): 0
- Missing key (needs confirmation): 0
- Hardcoded UI strings: 1
- Empty / untranslated values: 0
- Dynamic key: 1 candidate; all 17 loopMotion keys resolve in ja/en
- Locale formatting / pluralization: 0
- Needs confirmation: 0

Static analysis: not run; GitHub API inspection does not provide repository command execution.

## Batch 04

Status: completed

Files processed (8 / 8; 464 lines):
- src/editor/assets/characters/CharacterImage/EmotionPresetButtons.vue
- src/editor/assets/characters/CharacterImage/ImageSettingsInfo.vue
- src/editor/assets/characters/CharacterImage/composables/useEmotionDraft.ts
- src/editor/assets/characters/color/CharacterColorCard.vue
- src/editor/assets/characters/color/CharacterColorSettings.vue
- src/editor/assets/characters/service/CharacterBase64Settings.vue
- src/editor/assets/characters/service/CommentVoiceCard.vue
- src/editor/assets/characters/service/CommentVoiceSettings.vue

Report: reports/batch-04.md

Findings:
- Missing key (confirmed): 6 dynamic references (2 expressions × 3 display modes)
- Missing key (needs confirmation): 0
- Hardcoded UI strings: 1
- Empty / untranslated values: 0
- Dynamic key candidates: 2; both candidate sets were checked and missing paths confirmed
- Locale formatting / pluralization: 0
- Needs confirmation: 0

Static analysis: not run; GitHub API inspection does not provide repository command execution.

## Batch 05

Status: completed

Files processed (8 / 8; 533 lines):
- src/editor/assets/mikuji/MikujiSettings.vue
- src/editor/assets/mikuji/composables/useBoxOmikujiList.ts
- src/editor/assets/mikuji/composables/useOmikujiLottery.ts
- src/editor/assets/mikuji/composables/useOmikujiWeight.ts
- src/editor/assets/mikuji/composables/useWeightItemDialog.ts
- src/editor/assets/mikuji/item/OmikujiItemControlSettings.vue
- src/editor/assets/mikuji/item/OmikujiItemCriteria.vue
- src/editor/assets/mikuji/item/OmikujiItemEditor.vue

Report: reports/batch-05.md

Findings:
- Missing key (confirmed): 0
- Missing key (needs confirmation): 0
- Hardcoded UI strings: 10
- Empty / untranslated values: 0
- Dynamic key groups: 2; all item-kind and control-command values resolve in ja/en
- Locale formatting / pluralization: 0
- Needs confirmation: 1 (localized suffix in duplicated item name)

Static analysis: not run; GitHub API inspection does not provide repository command execution.

## Batch 06

Status: completed

Files processed (8 / 8; 591 lines):
- src/editor/assets/mikuji/item/OmikujiItemHeader.vue
- src/editor/assets/mikuji/item/OmikujiItemPriority.vue
- src/editor/assets/mikuji/item/OmikujiItemScenario.vue
- src/editor/assets/mikuji/item/ScenarioPickerDialog.vue
- src/editor/assets/mikuji/weight/WeightBar.vue
- src/editor/assets/mikuji/weight/WeightItem.vue
- src/editor/assets/mikuji/weight/WeightItemCooldown.vue
- src/editor/assets/mikuji/weight/WeightItemDialogs.vue

Report: reports/batch-06.md

Findings:
- Missing key (confirmed): 0
- Missing key (needs confirmation): 0
- Hardcoded UI strings: 10
- Empty / untranslated values: 0
- Dynamic key candidates: 0
- Locale formatting / pluralization: 1 (fixed Japanese seconds unit)
- Needs confirmation: 1 (whether `key:` is intentionally English-only)

Static analysis: not run; GitHub API inspection does not provide repository command execution.

## Remaining work

- Completed files: 48 / 262
- Remaining files: 214
- Completed batches: 6 / 34
- Remaining batches: 28
- Next batch: 07

The initial batch sizing is provisional. Before each batch, verify the current branch tree and record the exact file list. The coordinator updates this file; delegated agents update only their own batch report.
