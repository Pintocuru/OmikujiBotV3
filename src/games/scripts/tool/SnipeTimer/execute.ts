// src/games/scripts/tool/SnipeTimer/execute.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScenarioStepMessageSchema } from '@/types/OmikujiData'
import { SnipeTimerSlotMap } from '@/types/generator'
import { ScriptClass, ScriptResult } from '@/games/types'
import { parseQueryString } from '@/games/shared/parseQueryString'
import { parseSnipeTime } from '@/common/SnipeTimer/parseSnipeTime'
import { resolveLimits } from './params'

const EMPTY_RESULT: ScriptResult = { steps: [], rankingMessages: [] }

export class ExecuteScript implements ScriptClass {
  /**
   * コメントから目標時刻を取り出し、snipeTimer UI にカウント開始を伝える
   * 時刻の表記がないコメントは何もしない(どのコメントで呼ぶかは、トリガー側の条件で決める)
   */
  run(queryString: string, _characterKey: string, omiken?: OmikenCommentType): ScriptResult {
    if (!omiken?.comment) return EMPTY_RESULT

    const target = parseSnipeTime(omiken.comment, resolveLimits(parseQueryString(queryString)))
    if (!target) return EMPTY_RESULT

    const step = ScenarioStepMessageSchema.parse({
      kind: 'message',
      delaySeconds: 0,
      uiKey: 'snipeTimer',
      slots: { [SnipeTimerSlotMap.targetAt.slot]: String(target.getTime()) },
      message: '',
    })
    return { steps: [step], rankingMessages: [] }
  }

  /**
   * サンプルラン
   */
  sampleRun(): string {
    return 'コメントの「30秒後」「21:30」「15分」などから、カウントダウンを始めます'
  }
}

export default new ExecuteScript()
