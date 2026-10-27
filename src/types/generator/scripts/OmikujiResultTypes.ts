// src/types/generator/scripts/OmikujiResultTypes.ts
import { PostFlowType } from '@/types/OmikujiData/'
import { BotMessageSlotsType } from './BotMessageSchema'

/**
 * 評価ブロックの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
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
 * 処理済みのアクションと解析結果をセットにした型
 */
export interface ProcessedPostAction {
  action: PostFlowType
  extra?: VariablePlaceholderExtra
}
