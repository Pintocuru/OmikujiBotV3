// src/editor/assets/scenarios/items/stepChoice.ts
import { uiKinds, type ScenarioStepKind, type UiKind } from '@/types/OmikujiData'
import { scenarioStepKindIcons, uiKindIcons } from '@/maps/OmikujiData'
import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/**
 * ステップタイプの選択肢
 * - 保存データは kind: 'message' + uiKey のまま。editor の選択肢だけ「表示先の UI」を kind と同列に並べる
 * - message は選択肢に出さない(表示先の UI を選ぶと message になる)
 */
export type StepChoice = Exclude<ScenarioStepKind, 'message'> | UiKind

export const isUiKindChoice = (choice: StepChoice): choice is UiKind => (uiKinds as readonly string[]).includes(choice)

/** 選択肢のアイコン (UiKind と kind のキーは重ならない) */
export const stepChoiceIcons: Record<StepChoice, LucideIconName> = { ...scenarioStepKindIcons, ...uiKindIcons }

/**
 * 選択肢の i18n base (`<base>.label` / `.description`)
 * - commentBubble は、基本の「メッセージ」として表示する(UI が1つだけのビルドでも分かりやすいように)
 */
export const stepChoiceI18nBase = (choice: StepChoice): string => {
  if (choice === 'commentBubble') return 'mapText.scenarioStepKind.message'
  return isUiKindChoice(choice) ? `mapText.uiKind.${choice}` : `mapText.scenarioStepKind.${choice}`
}

/** 現在のステップの選択肢 (message は表示先の UI) */
export const stepToChoice = (step: { kind: ScenarioStepKind; uiKey?: UiKind }): StepChoice =>
  step.kind === 'message' ? (step.uiKey ?? 'commentBubble') : step.kind
