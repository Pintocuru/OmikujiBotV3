// src/games/scripts/FortuneRanking/execute.ts
import { PostFlowMessageSchema } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScriptClass, ScriptResult } from '@/games/types'

import { DEFAULT_FRUITS, DEFAULT_KEY_MAP } from './params'
import { parseQueryString } from '@/games/parseQueryString'

export class ExecuteScript implements ScriptClass {
  /**
   * ゲームを実行する
   */
  run(queryString: string, characterKey: string | null, _omiken?: OmikenCommentType): ScriptResult {
    const { projectName, fruitPairs } = this.parseParams(queryString)

    // シャッフルして順位決定
    const shuffled = [...fruitPairs].sort(() => Math.random() - 0.5)

    // {{fortune_xxx = n}} を連結生成
    const placeholders = shuffled
      .map((fruit, index) => {
        const rank = index + 1
        return `{{${projectName}_${fruit.key} = ${rank}}}`
      })
      .join('')

    const messageAction = PostFlowMessageSchema.parse({
      delaySeconds: 0,
      characterKey,
      message: {
        bubble: placeholders + '占いランキングを作成したよ',
        isToast: true,
      },
      sound: 'decision',
    })

    return {
      actions: [messageAction],
      botMessageExtras: [],
    }
  }

  /**
   * サンプルラン
   */
  sampleRun(queryString: string): string {
    const { projectName, fruitPairs } = this.parseParams(queryString)
    const random = fruitPairs[Math.floor(Math.random() * fruitPairs.length)]

    return `${random.label}は {{${projectName}_${random.key}}} で順位が出るよ`
  }

  /**
   * パラメータをパース
   */
  private parseParams(queryString: string) {
    const paramsObject = parseQueryString(queryString)

    const projectName = paramsObject.projectName ?? 'fortune'
    const fruitsRaw = paramsObject.fruits ?? ''

    // クエリ未指定ならデフォルト10種
    if (!fruitsRaw) {
      return {
        projectName,
        fruitPairs: DEFAULT_FRUITS.map((label) => ({
          label,
          key: DEFAULT_KEY_MAP[label],
        })),
      }
    }

    const fruitPairs = fruitsRaw.split(',').map((v) => {
      const [label, key] = v.split(':')
      return { label, key }
    })

    return {
      projectName,
      fruitPairs,
    }
  }
}

export default new ExecuteScript()
