// src/games/scripts/game/BomberSpin/execute.ts
import { PostFlowMessageSchema, PostFlowType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { playGame } from './game'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'

export class ExecuteScript implements ScriptClass {
  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const { symbol, spin } = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)
    const gameResult = playGame(user.userName, symbol, spin)

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const rankingMessages = omiken
      ? [
          buildBotMessageRanking({
            user,
            score: gameResult.payout,
            symbol: gameResult.symbol,
          }),
        ]
      : []

    return {
      actions: this.buildPostActions(gameResult, characterKey),
      rankingMessages,
    }
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const { symbol, spin } = this.parseParams(queryString)
    const gameResult = playGame('[ユーザー名]', symbol, spin)
    return gameResult.message
  }

  /**
   * パラメータをパース
   */
  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse({
      symbol: paramsObject.symbol ?? '',
      spin: Number(paramsObject.spin),
    })
  }

  /**
   * ステップ の構築
   */
  private buildPostActions(gameResult: ReturnType<typeof playGame>, characterKey: string | null): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: gameResult.message,
      sound: 'decision',
    })

    return [
      // TODO:WordPartyに頼らない演出にする
      { kind: 'wordParty', delaySeconds: 1, repeat: 1, wordPartyId: 'BomberSpinBack' },
      { kind: 'wordParty', delaySeconds: 1.1, repeat: 1, wordPartyId: gameResult.party },
      { kind: 'wordParty', delaySeconds: 2.8, repeat: 1, wordPartyId: 'CommonBombFire' },
      messageAction,
    ]
  }
}

export default new ExecuteScript()
