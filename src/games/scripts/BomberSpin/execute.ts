// src/games/scripts/BomberSpin/execute.ts
import { PostFlowMessageSchema, PostFlowType } from '@/types/OmikujiData'
import { OmikenCommentType, UserNameSchema } from '@/types/OmikenComment'
import { GameStateType, ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { playSlot } from './game'
import { LogRankScript } from '@/games/scriptsEngine/LogRank/execute'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/scriptsEngine/RankingMessage/RankingMessage'
import { parseQueryString } from '@/games/parseQueryString'

const RANKING_KEY = 'BomberSpin'

export class ExecuteScript implements ScriptClass {
  private readonly logRank = new LogRankScript()

  constructor() {
    this.logRank.setup(RANKING_KEY)
  }

  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const { symbol, spin } = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)
    const gameResult = playSlot(user.userName, symbol, spin)

    if (omiken) {
      const logResult = this.recordRanking(omiken, gameResult.payout, characterKey)

      const botMessageExtra = buildBotMessageRanking({
        user,
        bubbleText: gameResult.message,
        componentKey: RANKING_KEY,
        score: gameResult.payout,
        symbol: gameResult.symbol,
        isOverLimit: logResult.isOverLimit,
      })

      return {
        actions: this.buildPostActions(gameResult, logResult?.postActions, characterKey),
        botMessageExtras: [botMessageExtra],
      }
    }

    // omiken(コメント)がない場合
    return {
      actions: this.buildPostActions(gameResult, null, characterKey),
      botMessageExtras: [],
    }
  }

  sampleRun(queryString: string): string {
    const { symbol, spin } = this.parseParams(queryString)
    const gameResult = playSlot('[ユーザー名]', symbol, spin)
    return gameResult.message
  }

  getGameState(): GameStateType {
    return this.logRank.getGameState()
  }

  private parseParams(queryString: string): GameParams {
    const paramsObject = parseQueryString(queryString)
    return GameParamsSchema.parse({
      symbol: paramsObject.symbol ?? '',
      spin: Number(paramsObject.spin),
    })
  }

  /**
   * ランキングデータを記録
   */
  private recordRanking(
    omiken: OmikenCommentType,
    payout: number,
    characterKey: string | null
  ): ReturnType<LogRankScript['run']> {
    return this.logRank.run({
      user: UserNameSchema.parse(omiken),
      characterKey,
      rankingMode: 'high_score',
      maxDraws: 5,
      result: {
        type: 'score',
        score: payout,
      },
    })
  }

  /**
   * PostAction の構築（bubble のみ）
   */
  private buildPostActions(
    gameResult: ReturnType<typeof playSlot>,
    postActions: PostFlowType[] | null,
    characterKey: string | null
  ): PostFlowType[] {
    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: {
        bubble: gameResult.message,
      },
      sound: 'decision',
    })

    return [
      ...(postActions ?? []),
      // TODO:WordPartyに頼らない演出にする
      { kind: 'wordParty', delaySeconds: 1, repeat: 1, wordPartyId: 'BomberSpinBack' },
      { kind: 'wordParty', delaySeconds: 1.1, repeat: 1, wordPartyId: gameResult.party },
      { kind: 'wordParty', delaySeconds: 2.8, repeat: 1, wordPartyId: 'CommonBombFire' },
      messageAction,
    ]
  }
}

export default new ExecuteScript()
