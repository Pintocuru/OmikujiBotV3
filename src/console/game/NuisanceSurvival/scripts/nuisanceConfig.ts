// src/console/game/NuisanceSurvival/scripts/nuisanceConfig.ts
// 邪魔者サバイバルのコンフィグ (サーバーに保存する。形はここのスキーマが決める)
import { z } from 'zod'

/** 項目ごとの範囲と既定値。フォームの入力範囲も、ここを使う */
export const CONFIG_LIMITS = {
  /** 最大ライフ (開始時のライフ) */
  startLife: { min: 10, max: 1000, step: 10, default: 100 },
  /** 同時に存在できる邪魔者の上限。超えたコメントは無視する */
  maxNuisances: { min: 1, max: 200, step: 1, default: 30 },
  /** 成長の倍率。growthIntervalSeconds ごとに、邪魔者の大きさにこの倍率が掛かる */
  growthMultiplier: { min: 1, max: 3, step: 0.05, default: 1.1 },
  /** 成長の間隔 (秒) */
  growthIntervalSeconds: { min: 1, max: 600, step: 1, default: 10 },
  /** ライフの減る速さと爆発のダメージの倍率 (難しさ) */
  drainMultiplier: { min: 0.1, max: 10, step: 0.1, default: 1 },
  /** 取り除くのに必要な、押し続ける時間の倍率 */
  pushMultiplier: { min: 0.1, max: 10, step: 0.1, default: 1 },
} as const

export type NuisanceConfigKey = keyof typeof CONFIG_LIMITS

const field = (key: NuisanceConfigKey, integer = false) => {
  const { min, max, default: value } = CONFIG_LIMITS[key]
  const base = integer ? z.number().int() : z.number()
  return base.min(min).max(max).default(value)
}

export const NuisanceConfigSchema = z.object({
  startLife: field('startLife'),
  maxNuisances: field('maxNuisances', true),
  growthMultiplier: field('growthMultiplier'),
  growthIntervalSeconds: field('growthIntervalSeconds'),
  drainMultiplier: field('drainMultiplier'),
  pushMultiplier: field('pushMultiplier'),
})
export type NuisanceConfigType = z.infer<typeof NuisanceConfigSchema>

export const CONFIG_KEYS = Object.keys(CONFIG_LIMITS) as NuisanceConfigKey[]

export const createDefaultConfig = (): NuisanceConfigType => NuisanceConfigSchema.parse({})

/**
 * サーバーから読んだ値を、コンフィグにする。形が違うときは、既定値で始めて理由を返す (黙って直さない)
 * 項目が足りないだけなら、足りない項目だけが既定値になる (項目を増やしても、古い保存データで壊れない)
 */
export const parseConfig = (raw: unknown): { config: NuisanceConfigType; error: string | null } => {
  const result = NuisanceConfigSchema.safeParse(raw)
  if (result.success) return { config: result.data, error: null }
  const issue = result.error.issues[0]
  const path = issue.path.join('.')
  return { config: createDefaultConfig(), error: path ? `${path}: ${issue.message}` : issue.message }
}

/**
 * フォームの入力を、範囲に収めてコンフィグにする (数字でない・空の項目は既定値。整数の項目は四捨五入)
 * スタートを押したときに使う。範囲外の入力で、ゲームが始まらないことがないようにする
 */
export const sanitizeConfig = (draft: Partial<Record<NuisanceConfigKey, unknown>>): NuisanceConfigType => {
  const next: Record<string, number> = {}
  for (const key of CONFIG_KEYS) {
    const { min, max, default: fallback } = CONFIG_LIMITS[key]
    const value = typeof draft[key] === 'number' && Number.isFinite(draft[key]) ? (draft[key] as number) : fallback
    const clamped = Math.min(max, Math.max(min, value))
    next[key] = key === 'maxNuisances' ? Math.round(clamped) : clamped
  }
  return NuisanceConfigSchema.parse(next)
}
