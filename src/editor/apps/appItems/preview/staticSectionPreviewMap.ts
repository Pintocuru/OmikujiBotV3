// src/editor/apps/appItems/preview/staticSectionPreviewMap.ts
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
  scenario: ScenarioPreview, // mikuji / actions カテゴリ用 // TODO: scenario -> actions

  // comments
  threshold: ThresholdPreview, // mode デフォルト: 'threshold'

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
