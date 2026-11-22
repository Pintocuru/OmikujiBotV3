// src/console/game/NuisanceSurvival/scripts/nuisanceConfig.ts
// 邪魔者サバイバルのコンフィグ (サーバーに保存する。形はここのスキーマが決める)
import { z } from 'zod'

/** 項目ごとの範囲と既定値。フォームの入力範囲も、ここを使う */
export const CONFIG_LIMITS = {
  /** 残り時間の上限 (秒)。ゲームは、この時間から始まる (満タン)。時間は、1 秒ごとに 1 秒減る */
  maxSeconds: { min: 60, max: 3600, step: 30, default: 900 },
  /** アイコン (コメントした人) を画面の外へ押し出したときに得る秒数 (これに、連鎖数と係数が掛かる) */
  iconSeconds: { min: 1, max: 30, step: 1, default: 5 },
  /** ことば (コメントの文字) を画面の外へ押し出したときに得る秒数 (これに、連鎖数と係数が掛かる) */
  wordSeconds: { min: 0, max: 10, step: 0.5, default: 1 },
  /** 係数の下がり方 (1 分ごとに、何 % 下がるか)。係数は、初見さんのコメントが届くと 100 % に戻る */
  coefficientDropPerMinute: { min: 0, max: 50, step: 1, default: 5 },
  /** 係数の下限 (%)。これより下がらない */
  coefficientFloorPercent: { min: 0, max: 100, step: 5, default: 20 },
  /** 同時に存在できるアイコンの上限。超えたコメントは無視する */
  maxNuisances: { min: 1, max: 200, step: 1, default: 30 },
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
  maxSeconds: field('maxSeconds'),
  iconSeconds: field('iconSeconds'),
  wordSeconds: field('wordSeconds'),
  coefficientDropPerMinute: field('coefficientDropPerMinute'),
  coefficientFloorPercent: field('coefficientFloorPercent'),
  maxNuisances: field('maxNuisances', true),
  bossInterval: field('bossInterval', true),
})
export type NuisanceConfigType = z.infer<typeof NuisanceConfigSchema>

export const CONFIG_KEYS = Object.keys(CONFIG_LIMITS) as NuisanceConfigKey[]

export const createDefaultConfig = (): NuisanceConfigType => NuisanceConfigSchema.parse({})

/** プリセット (メニューのボタンで、入力欄にまとめて入れる。選んだ名前は保存せず、値だけ保存する) */
export type ConfigPresetId = 'endurance' | 'tenMinutes' | 'merciless'

export const CONFIG_PRESETS: Record<ConfigPresetId, NuisanceConfigType> = {
  /** 耐久配信向け: 長い持ち時間で、係数がゆっくり下がる */
  endurance: {
    maxSeconds: 1800,
    iconSeconds: 5,
    wordSeconds: 1,
    coefficientDropPerMinute: 3,
    coefficientFloorPercent: 30,
    maxNuisances: 40,
    bossInterval: 300,
  },
  /** 標準: 15 分 */
  tenMinutes: {
    maxSeconds: 900,
    iconSeconds: 5,
    wordSeconds: 1,
    coefficientDropPerMinute: 5,
    coefficientFloorPercent: 20,
    maxNuisances: 30,
    bossInterval: 50,
  },
  /** 情け無用組み手: 短期決戦。係数がすぐ下がる */
  merciless: {
    maxSeconds: 300,
    iconSeconds: 3,
    wordSeconds: 0.5,
    coefficientDropPerMinute: 10,
    coefficientFloorPercent: 10,
    maxNuisances: 60,
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
