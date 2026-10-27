// src/editor/apps/appItems/preview/staticSectionPreviewMap.ts
import type { Component } from 'vue'

import BaseSettings from './BaseSettings.vue'
import ActionSetPreview from './ActionSetPreview.vue'
import ThresholdPreview from './ThresholdPreview.vue'
import OmikujiSetPreview from './OmikujiSetPreview.vue'
import TimerIntervalPreview from './TimerIntervalPreview.vue'
import TriggerPreview from './TriggerPreview.vue'
import PlaceholderPreview from './PlaceholderPreview.vue'
import ColorSettingsPreview from './ColorSettingsPreview.vue'
import CommentVoicePreview from './CommentVoicePreview.vue'
import ImageSettingsPreview from './ImageSettingsPreview.vue'

export const staticSectionPreviewMap: Record<string, Component> = {
  // 共通
  baseSettings: BaseSettings,
  omikujiSet: OmikujiSetPreview,
  actionSet: ActionSetPreview, // mikuji / actions カテゴリ用 // TODO: actionSet -> actions

  // comments
  threshold: ThresholdPreview, // mode デフォルト: 'threshold'

  // timers
  timerInterval: TimerIntervalPreview,

  // services / reactions
  // SidebarSectionList 側で :mode="category" を渡すこと
  trigger: TriggerPreview,

  // placeholders
  placeholder: PlaceholderPreview,

  // characters
  colorSettings: ColorSettingsPreview,
  commentVoice: CommentVoicePreview,
  imageSettings: ImageSettingsPreview,
}
