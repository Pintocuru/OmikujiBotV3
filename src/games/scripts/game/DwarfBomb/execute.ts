// src/games/scripts/game/DwarfBomb/execute.ts
import { ScenarioStepMessageSchema, ScenarioStepType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { GameParams, GameParamsSchema } from './params'
import { buildBotMessageRanking, prepareUserInfo } from '@/games/shared/rankingMessage'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { generatePartyEffects, playGame } from './game/game'

export class ExecuteScript implements ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult {
    const params = this.parseParams(queryString)
    const user = prepareUserInfo(omiken)

    const result = playGame(user.userName, params.mode)
    const partyEffects = generatePartyEffects(result)

    // omiken(コメント)がある場合のみランキング用メッセージを付与
    const rankingMessages = omiken
      ? [
          buildBotMessageRanking({
            user,
            score: result.payout,
            symbol: '',
          }),
        ]
      : []

    return {
      steps: this.buildPostActions(partyEffects, characterKey, result.message),
      rankingMessages,
    }
  }

  sampleRun(queryString: string): string {
    const { mode } = this.parseParams(queryString)
    const user = prepareUserInfo()
    return playGame(user.userName, mode).message
  }

  private parseParams(queryString: string): GameParams {
    return GameParamsSchema.parse(parseQueryString(queryString))
  }

  private buildPostActions(
    partyEffects: ScenarioStepType[],
    characterKey: string | null,
    bubbleText: string
  ): ScenarioStepType[] {
    const messageAction = ScenarioStepMessageSchema.parse({
      delaySeconds: 3.5,
      characterKey,
      message: bubbleText,
      sound: 'decision',
    })

    return [
      // TODO:WordPartyに頼らない演出にする
      { kind: 'wordParty', delaySeconds: 1, repeat: 1, wordPartyId: 'DwarfBombRabbit1' },
      { kind: 'wordParty', delaySeconds: 1.5, repeat: 1, wordPartyId: 'DwarfBombRabbit2' },
      { kind: 'wordParty', delaySeconds: 2, repeat: 1, wordPartyId: 'DwarfBombRabbit3' },
      { kind: 'wordParty', delaySeconds: 2.7, repeat: 1, wordPartyId: 'CommonBombFire' },
      ...partyEffects,
      messageAction,
    ]
  }
}

export default new ExecuteScript()
