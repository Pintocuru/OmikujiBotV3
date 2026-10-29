// src/editor/assets/PostFlow/items/createDefaultAction.ts
import type { PostFlowKind, PostFlowType } from '@/types/OmikujiData'

export const createDefaultAction = (kind: PostFlowKind, delaySeconds: number): PostFlowType => {
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
      } satisfies Extract<PostFlowType, { kind: 'message' }>
    case 'sound':
      return { kind, delaySeconds, sound: '', soundPath: '' } satisfies Extract<PostFlowType, { kind: 'sound' }>
    case 'wordParty':
      return { kind, delaySeconds, wordPartyId: '', repeat: 1 } satisfies Extract<PostFlowType, { kind: 'wordParty' }>
    case 'variable':
      return { kind, delaySeconds, message: '' } satisfies Extract<PostFlowType, { kind: 'variable' }>
    case 'gameScript':
      return {
        kind,
        delaySeconds,
        scriptId: '',
        characterKey: '',
        queryString: '',
      } satisfies Extract<PostFlowType, { kind: 'gameScript' }>
    case 'flowCall':
      return { kind, delaySeconds, callKeys: [] } satisfies Extract<PostFlowType, { kind: 'flowCall' }>
  }
}
