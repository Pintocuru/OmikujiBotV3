// src/games/types/GameScriptTypes.ts
import { BotMessageExtraType } from '@/generator/types'
import { BaseRecordType } from '@/types/core'
import { OmikenCommentType } from '@/types/OmikenComment'
import { PostFlowType } from '@/types/OmikujiData'
import { UserManager } from '@/generator/stores/UserManager/UserManager'
import { GameStateType } from './GameStateSchema'

// スクリプトプリセット
export interface ScriptPreset extends BaseRecordType {
  execute: ScriptClass // メイン実行クラス
}

// ran実行時の返り値
export type ScriptResult = {
  actions: PostFlowType[]
  botMessageExtras: BotMessageExtraType[]
}

// スクリプトのメイン実行クラス
export interface ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult // メイン実行関数
  sampleRun?(queryString?: string): string // エディター用サンプルゲーム関数
  initialize?(userManager: UserManager): void // ユーザー管理の注入(任意)
  getGameState?(): GameStateType // ゲームステート取得(任意)
}

