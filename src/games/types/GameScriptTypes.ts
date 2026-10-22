// src/games/types/GameScriptTypes.ts
import { BotMessageRankingType } from '@/types/generator'
import { BaseRecordType } from '@/types/core'
import { OmikenCommentType } from '@/types/OmikenComment'
import { PostFlowType } from '@/types/OmikujiData'
import { GameStateType } from '@/types/api'

// スクリプトプリセット
export interface ScriptPreset extends BaseRecordType {
  execute: ScriptClass // メイン実行クラス
}

// ran実行時の返り値
export type ScriptResult = {
  actions: PostFlowType[]
  rankingMessages: BotMessageRankingType[]
}

// スクリプトのメイン実行クラス
export interface ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult // メイン実行関数
  sampleRun?(queryString?: string): string // エディター用サンプルゲーム関数
  getGameState?(): GameStateType // ゲームステート取得(任意)
}
