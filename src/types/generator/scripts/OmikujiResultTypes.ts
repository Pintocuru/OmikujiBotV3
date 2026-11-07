// src/types/generator/scripts/OmikujiResultTypes.ts
import type { ScenarioStepType } from '@/types/OmikujiData'
import type { BotMessageSlotsType } from '@/types/generator/scripts/BotMessageSchema'

/**
 * 評価ブロックの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
 * TODO: これらって今も必要なのか?
 */
export interface VariablePlaceholderExtra {
  slots?: BotMessageSlotsType
}

export interface VariablePlaceholderResult {
  text: string // 評価ブロックを処理したあとの文字列
  extra?: VariablePlaceholderExtra
  hasError?: boolean
}

/**
 * 処理済みのステップと解析結果をセットにした型
 */
export interface ProcessedStep {
  step: ScenarioStepType
  extra?: VariablePlaceholderExtra
}
