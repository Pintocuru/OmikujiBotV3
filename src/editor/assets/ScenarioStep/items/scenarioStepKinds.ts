// src/editor/assets/PostFlow/items/postActionKinds.ts
import type { Component } from 'vue'
import {
  ScenarioStepCallSchema,
  ScenarioStepGameSchema,
  ScenarioStepMessageSchema,
  ScenarioStepSoundSchema,
  ScenarioStepVariableSchema,
  ScenarioStepWordPartySchema,
  type ScenarioStepKind,
  type ScenarioStepType,
} from '@/types/OmikujiData'
import MessageSettings from '../Message/MessageSettings.vue'
import SoundSettings from '../Sounds/SoundSettings.vue'
import WordPartySettings from '../WordParty/WordPartySettings.vue'
import VariableSettings from '../variable/VariableSettings.vue'
import ActionSetSettings from '../actions/ActionSetSettings.vue'
import GameScriptSettings from '../gameScript/GameScriptSettings.vue'

// kind → 設定コンポーネント
export const settingsComponentMap: Record<ScenarioStepKind, Component> = {
  message: MessageSettings,
  sound: SoundSettings,
  wordParty: WordPartySettings,
  variable: VariableSettings,
  gameScript: GameScriptSettings,
  scenarioCall: ActionSetSettings,
}

// kind → スキーマ (parse の結果だけ使うので、構造的な型にしてバージョン差を避ける)
export const actionSchemaMap: Record<ScenarioStepKind, { parse: (value: unknown) => ScenarioStepType }> = {
  message: ScenarioStepMessageSchema,
  sound: ScenarioStepSoundSchema,
  wordParty: ScenarioStepWordPartySchema,
  variable: ScenarioStepVariableSchema,
  gameScript: ScenarioStepGameSchema,
  scenarioCall: ScenarioStepCallSchema,
}
