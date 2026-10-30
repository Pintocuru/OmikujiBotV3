// src/types/generator/scripts/OmikujiResultTypes.ts
import { ScenarioStepType } from '@/types/OmikujiData/'
import { BotMessageSlotsType } from './BotMessageSchema'

/**
 * 評価ブロックの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
 * TODO: これらって今も必要なのか?
 */
export interface VariablePlaceholderExtra {
  slots?: BotMessageSlotsType
}

export interface VariablePlaceholderResult {
  bubble: string
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
