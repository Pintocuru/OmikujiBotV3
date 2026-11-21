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
  /** 特殊能力 (動く・爆発) を持つ邪魔者の割合 (%)。それ以外は、動かない */
  specialRate: { min: 0, max: 100, step: 5, default: 20 },
  /** ボスが出るコメント数 (配信枠のコメント数 lc が、この数の倍数のとき。0 ならボスは出ない) */
  bossInterval: { min: 0, max: 1000, step: 5, default: 100 },
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
  specialRate: field('specialRate'),
  bossInterval: field('bossInterval', true),
})
export type NuisanceConfigType = z.infer<typeof NuisanceConfigSchema>

export const CONFIG_KEYS = Object.keys(CONFIG_LIMITS) as NuisanceConfigKey[]

export const createDefaultConfig = (): NuisanceConfigType => NuisanceConfigSchema.parse({})

/** プリセット (メニューのボタンで、入力欄にまとめて入れる。選んだ名前は保存せず、値だけ保存する) */
export type ConfigPresetId = 'endurance' | 'tenMinutes' | 'merciless'

export const CONFIG_PRESETS: Record<ConfigPresetId, NuisanceConfigType> = {
  /** 耐久配信向け: 長時間、のんびり */
  endurance: {
    startLife: 300,
    maxNuisances: 20,
    growthMultiplier: 1.02,
    growthIntervalSeconds: 60,
    drainMultiplier: 0.3,
    pushMultiplier: 0.7,
    specialRate: 5,
    bossInterval: 300,
  },
  /** 10分耐久 */
  tenMinutes: {
    startLife: 100,
    maxNuisances: 30,
    growthMultiplier: 1.1,
    growthIntervalSeconds: 30,
    drainMultiplier: 1,
    pushMultiplier: 1,
    specialRate: 20,
    bossInterval: 50,
  },
  /** 情け無用組み手: 短期決戦、特殊能力だらけ */
  merciless: {
    startLife: 100,
    maxNuisances: 100,
    growthMultiplier: 1.3,
    growthIntervalSeconds: 10,
    drainMultiplier: 2,
    pushMultiplier: 1.5,
    specialRate: 60,
    bossInterval: 10,
  },
}

export const CONFIG_PRESET_IDS = Object.keys(CONFIG_PRESETS) as ConfigPresetId[]

/** 入力欄の値がプリセットと一致していれば、そのプリセット (ボタンの強調表示用) */
export const findMatchingPreset = (draft: Partial<Record<NuisanceConfigKey, unknown>>): ConfigPresetId | null =>
  CONFIG_PRESET_IDS.find((id) => CONFIG_KEYS.every((key) => draft[key] === CONFIG_PRESETS[id][key])) ?? null

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
    next[key] = key === 'maxNuisances' || key === 'bossInterval' ? Math.round(clamped) : clamped
  }
  return NuisanceConfigSchema.parse(next)
}
