# Batch 14 i18n Audit Report

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/`
- Locale: `ja` / `en` (default / fallback: `ja`)
- Status: completed
- Code changes: none

## Files inspected

| File | Lines |
|---|---:|
| `src/editor/events/service/ServiceTriggerCondition.vue` | 99 |
| `src/editor/events/timer/TimerIntervalEditor.vue` | 199 |
| `src/editor/events/trigger/TriggerAccess.vue` | 45 |
| `src/editor/events/trigger/TriggerComment.vue` | 48 |
| `src/editor/events/trigger/TriggerCount.vue` | 50 |
| `src/editor/events/trigger/TriggerExpression.vue` | 51 |
| `src/editor/events/trigger/TriggerGift.vue` | 49 |
| `src/editor/events/trigger/TriggerSyoken.vue` | 48 |
| **Total** | **589** |

## Findings

### Hardcoded UI strings

1. `src/editor/events/trigger/TriggerCount.vue:11,20`
   - The option labels are rendered from `countUnitConditionMap` and `countComparisonConditionMap`; those maps define Japanese labels directly in `src/maps/engine/trigger/CountConditionMap.ts:9-35`.
   - The map also contains descriptions, although this component currently renders only `label`.
   - Type: hardcoded UI strings (map-backed labels).
   - Recommendation: provide ja/en message entries and resolve the labels through i18n, or confirm that this UI is intentionally Japanese-only.
   - Confidence: high.

2. `src/editor/events/trigger/TriggerSyoken.vue:17`
   - Option labels are sourced from `syokenConditionMap`, whose three labels are Japanese literals in `src/maps/engine/trigger/SyokenConditionMap.ts:7-19`.
   - Type: hardcoded UI strings (map-backed labels).
   - Recommendation: provide ja/en message entries and resolve the labels through i18n, or confirm that this UI is intentionally Japanese-only.
   - Confidence: high.

### Translation key verification

- `ServiceTriggerCondition.vue`: dynamic `mapText.serviceCondition.${key}.label/description` paths resolve for the comparison map entries. Placeholder keys `serviceTrigger.placeholder.*` are present in ja/en.
- `TimerIntervalEditor.vue`: `timerInterval.*` keys, including all nine `presets.s${value}` values (30, 60, 120, 180, 300, 600, 900, 1800, 3600), exist in ja/en.
- `TriggerAccess.vue`: all five `triggerAccess.conditions.*.label` entries exist in ja/en.
- `TriggerComment.vue`: `triggerComment.label/description/placeholder` exist in ja/en.
- `TriggerExpression.vue`: `triggerExpression.*` keys exist in ja/en. The expression examples are syntax examples, not UI prose requiring translation.
- `TriggerGift.vue`: all ten `triggerGift.conditions.*.label` entries exist in ja/en.
- `TriggerCount.vue`: `triggerCount.*` base keys exist, but the displayed option labels come from non-i18n map files as noted above.
- `TriggerSyoken.vue`: the displayed option labels come from a non-i18n map file as noted above.

### Other categories

- Missing translation keys (confirmed): 0
- Missing translation keys (needs confirmation): 0
- Empty / untranslated values: 0
- Dynamic key candidates unresolved: 0
- Locale formatting / pluralization: 0
- Additional items needing confirmation: 0

## Static analysis

Not run. The GitHub API inspection environment does not provide repository command execution. Findings are based on source and translation-definition inspection.
