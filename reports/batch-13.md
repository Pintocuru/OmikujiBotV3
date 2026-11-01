# Batch 13 i18n Audit Report

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/`
- Locale: `ja` / `en` (default / fallback: `ja`)
- Status: completed
- Code changes: none

## Files inspected

| File | Lines |
|---|---:|
| `src/editor/content/summary/CharacterSummary.vue` | 85 |
| `src/editor/content/summary/ItemEditDialog.vue` | 44 |
| `src/editor/events/comment/CommentTriggerEditor.vue` | 97 |
| `src/editor/events/core/DisabledEventNotice.vue` | 15 |
| `src/editor/events/core/MikujiPickerDialog.vue` | 99 |
| `src/editor/events/pad/PadTriggerEditor.vue` | 73 |
| `src/editor/events/reaction/ReactionTriggerEditor.vue` | 112 |
| `src/editor/events/service/ServiceTrigger.vue` | 116 |
| **Total** | **641** |

## Findings

### Hardcoded UI text

- `src/editor/events/core/MikujiPickerDialog.vue:20` — `key:` is displayed as a hardcoded English label.
  - Type: hardcoded UI string
  - Recommendation: if this label is intended for end users, localize it (or confirm that the technical identifier label should remain English).
  - Confidence: medium

### Translation key verification

- `CharacterSummary.vue`: `connections.summary.characters`, `undefinedCharacter`, `noImage`, and `noCharacters` exist in both locales.
- `ItemEditDialog.vue`: `categorySections.baseSettings.label` exists in both locales.
- `CommentTriggerEditor.vue`: `commentTrigger.information.*`, `setting.*`, `noParams.message`, and the condition labels/descriptions are defined in ja/en.
- `DisabledEventNotice.vue`: `eventCore.disabledNotice.title/action` exist in ja/en.
- `MikujiPickerDialog.vue`: `connections.picker.*` and count messages exist in ja/en.
- `PadTriggerEditor.vue`: `padTrigger.padLabel/padDescription/padName` exist in ja/en.
- `ReactionTriggerEditor.vue`: dynamic `mapText.reactionCondition.${key}.label/description` entries (milestone, burstSustain, equal, burstReach, burstDrop) exist in ja/en. `reactionEditorMessages` is registered through `messageModules.ts`.
- `ServiceTrigger.vue`: dynamic `serviceTrigger.conditions.${key}` entries (upVote, viewer, follower, elapsedMinutes) and the other `serviceTrigger.*` keys exist in ja/en. `mapText.serviceCondition.*` is present in `EventMapMessages.ts`, aggregated through `OmikujiDataMaps.ts`.
- The relevant message modules are registered in `src/i18n/editor/messageModules.ts`.

### Other categories

- Missing translation keys (confirmed): 0
- Missing translation keys (needs confirmation): 0
- Empty / untranslated values: 0
- Dynamic key candidates not resolved: 0
- Locale formatting / pluralization: 0
- Additional items needing confirmation: 0

## Static analysis

Not run. The GitHub API inspection environment does not provide repository command execution. Findings are based on source and translation-definition inspection.
