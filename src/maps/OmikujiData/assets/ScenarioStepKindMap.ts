// src/maps/OmikujiData/assets/ScenarioStepKindMap.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { ScenarioStepKind } from '@/types/OmikujiData'

/**
 * シナリオステップのアイコンマップ
 */
export const scenarioStepKindIcons: Record<ScenarioStepKind, LucideIconName> = {
  message: 'MessageSquare',
  sound: 'Volume2',
  wordParty: 'PartyPopper',
  variable: 'Brackets',
  gameScript: 'Gamepad2',
  scenarioCall: 'FilePen',
}
