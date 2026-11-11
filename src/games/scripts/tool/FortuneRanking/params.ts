// src/games/scripts/tool/FortuneRanking/params.ts
import { z } from 'zod'

/**
 * params
 */
export const DEFAULT_FRUITS = [
  'いちご',
  'ぶどう',
  'デコポン',
  'かき',
  'りんご',
  'なし',
  'パイナップル',
  'もも',
  'メロン',
  'スイカ',
] as const

export const DEFAULT_KEY_MAP: Record<string, string> = {
  いちご: 'strawberry',
  ぶどう: 'grape',
  デコポン: 'shiranui',
  かき: 'persimmon',
  りんご: 'apple',
  なし: 'pear',
  パイナップル: 'pineapple',
  もも: 'peach',
  メロン: 'melon',
  スイカ: 'watermelon',
}
export const GameParamsSchema = z.object({
  projectName: z.string().default('fortune'),
  fruits: z.string().min(1),
})
export type GameParams = z.infer<typeof GameParamsSchema>

export const DEFAULT_PROJECT_NAME = 'fortune'

/**
 * projectName / fruits(ラベル:キー,ラベル:キー,...) を解釈する。fruits が空なら既定の10種
 */
export function resolveFortuneConfig(params: Record<string, string | undefined>) {
  const projectName = params.projectName ?? DEFAULT_PROJECT_NAME
  const fruitsRaw = params.fruits ?? ''

  if (!fruitsRaw) {
    return {
      projectName,
      fruitPairs: DEFAULT_FRUITS.map((label) => ({ label, key: DEFAULT_KEY_MAP[label] })),
    }
  }

  const fruitPairs = fruitsRaw.split(',').map((v) => {
    const [label, key] = v.split(':')
    return { label, key }
  })
  return { projectName, fruitPairs }
}
