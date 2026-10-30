// src/editor/apps/appItems/preview/staticSectionPreviewMap.ts
// TODO:プレビュー機能は不要かも…使いづらかったので
import type { Component } from 'vue'

import BaseSettings from './BaseSettings.vue'
import ScenarioPreview from './ScenarioPreview.vue'
import ThresholdPreview from './ThresholdPreview.vue'
import OmikujiSetPreview from './OmikujiSetPreview.vue'
import TimerIntervalPreview from './TimerIntervalPreview.vue'
import TriggerPreview from './TriggerPreview.vue'
import PadTriggerPreview from './PadTriggerPreview.vue'
import PlaceholderPreview from './PlaceholderPreview.vue'
import ColorSettingsPreview from './ColorSettingsPreview.vue'
import CommentVoicePreview from './CommentVoicePreview.vue'
import ImageSettingsPreview from './ImageSettingsPreview.vue'

export const staticSectionPreviewMap: Record<string, Component> = {
  // 共通
  baseSettings: BaseSettings,
  omikujiSet: OmikujiSetPreview,
  scenario: ScenarioPreview, // mikuji / scenarios カテゴリ用 // TODO: scenario -> scenarios

  // comments
  threshold: ThresholdPreview, // mode デフォルト: 'threshold' // TODO: threshold -> trigger だが、使われていない…？

  // timers
  timerInterval: TimerIntervalPreview,

  // services / reactions
  // SidebarSectionList 側で :mode="category" を渡すこと
  trigger: TriggerPreview,

  // pads
  padTrigger: PadTriggerPreview,

  // placeholders
  placeholder: PlaceholderPreview,

  // characters
  colorSettings: ColorSettingsPreview,
  commentVoice: CommentVoicePreview,
  imageSettings: ImageSettingsPreview,
}
