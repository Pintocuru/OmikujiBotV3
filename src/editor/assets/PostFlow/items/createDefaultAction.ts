// src/editor/assets/PostFlow/items/createDefaultAction.ts
import type { ScenarioStepKind, ScenarioStepType } from '@/types/OmikujiData'

export const createDefaultAction = (kind: ScenarioStepKind, delaySeconds: number): ScenarioStepType => {
  switch (kind) {
    case 'message':
      return {
        kind,
        delaySeconds,
        uiKey: 'commentBubble',
        slots: {},
        characterKey: null,
        iconKey: 'default',
        sound: '',
        soundPath: '',
        message: '',
      } satisfies Extract<ScenarioStepType, { kind: 'message' }>
    case 'sound':
      return { kind, delaySeconds, sound: '', soundPath: '' } satisfies Extract<ScenarioStepType, { kind: 'sound' }>
    case 'wordParty':
      return { kind, delaySeconds, wordPartyId: '', repeat: 1 } satisfies Extract<
        ScenarioStepType,
        { kind: 'wordParty' }
      >
    case 'variable':
      return { kind, delaySeconds, message: '' } satisfies Extract<ScenarioStepType, { kind: 'variable' }>
    case 'gameScript':
      return {
        kind,
        delaySeconds,
        scriptId: '',
        characterKey: '',
        queryString: '',
      } satisfies Extract<ScenarioStepType, { kind: 'gameScript' }>
    case 'scenarioCall':
      return { kind, delaySeconds, callKeys: [] } satisfies Extract<ScenarioStepType, { kind: 'scenarioCall' }>
  }
}
