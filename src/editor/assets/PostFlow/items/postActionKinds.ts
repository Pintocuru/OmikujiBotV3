// src/editor/assets/PostFlow/items/postActionKinds.ts
import type { Component } from 'vue'
import {
  PostFlowCallSchema,
  PostFlowGameSchema,
  PostFlowMessageSchema,
  PostFlowSoundSchema,
  PostFlowVariableSchema,
  PostFlowWordPartySchema,
  type PostFlowKind,
  type PostFlowType,
} from '@/types/OmikujiData'
import MessageSettings from '../Message/MessageSettings.vue'
import SoundSettings from '../Sounds/SoundSettings.vue'
import WordPartySettings from '../WordParty/WordPartySettings.vue'
import VariableSettings from '../variable/VariableSettings.vue'
import ActionSetSettings from '../actions/ActionSetSettings.vue'
import GameScriptSettings from '../gameScript/GameScriptSettings.vue'

// kind → 設定コンポーネント
export const settingsComponentMap: Record<PostFlowKind, Component> = {
  message: MessageSettings,
  sound: SoundSettings,
  wordParty: WordPartySettings,
  variable: VariableSettings,
  gameScript: GameScriptSettings,
  flowCall: ActionSetSettings,
}

// kind → スキーマ (parse の結果だけ使うので、構造的な型にしてバージョン差を避ける)
export const actionSchemaMap: Record<PostFlowKind, { parse: (value: unknown) => PostFlowType }> = {
  message: PostFlowMessageSchema,
  sound: PostFlowSoundSchema,
  wordParty: PostFlowWordPartySchema,
  variable: PostFlowVariableSchema,
  gameScript: PostFlowGameSchema,
  flowCall: PostFlowCallSchema,
}
