// src/console/game/OshikuraChain/scripts/oshikuraChainConfig.ts
// おしくらチェインの難易度設定 (サーバーに保存する。ゲーム内の調整値は難易度から導出する)
import { z } from 'zod'
import { TIME_ATTACK_TARGET_SECONDS } from './oshikuraChainConstants'

export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5] as const
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]

/** ゲームモード: endurance = 耐久 (残り時間が 0 になるまで) / timeAttack = 目標の獲得秒数に届くまでのタイムを競う */
export const GAME_MODES = ['endurance', 'timeAttack'] as const
export type GameMode = (typeof GAME_MODES)[number]

/** コメントの源: live = 配信のコメント (わんコメ) / auto = 一定間隔で架空のコメントを入れる (実コメントは無視する) */
export const COMMENT_SOURCES = ['live', 'auto'] as const
export type CommentSource = (typeof COMMENT_SOURCES)[number]

export const DIFFICULTY_PROFILES: Record<
  DifficultyLevel,
  {
    /** ゲーム開始時の残り時間 (秒) */
    initialSeconds: number
    /** アイコンを押し出したときの基本獲得秒数 */
    iconSeconds: number
    /** ことばを押し出したときの基本獲得秒数 */
    wordSeconds: number
    /** 倍率 (残り時間が減る速さ) が 1 分ごとに上がる量 */
    multiplierRisePerMinute: number
    /** 表示用の所要時間目安 (分)。初見コメントによる倍率リセットを含まない */
    estimatedMinutes: number
  }
> = {
  1: { initialSeconds: 3600, iconSeconds: 8, wordSeconds: 1.5, multiplierRisePerMinute: 0.05, estimatedMinutes: 60 },
  2: { initialSeconds: 2400, iconSeconds: 6, wordSeconds: 1.2, multiplierRisePerMinute: 0.1, estimatedMinutes: 40 },
  3: { initialSeconds: 1200, iconSeconds: 5, wordSeconds: 1, multiplierRisePerMinute: 0.2, estimatedMinutes: 20 },
  4: { initialSeconds: 600, iconSeconds: 2, wordSeconds: 0.4, multiplierRisePerMinute: 0.35, estimatedMinutes: 10 },
  5: { initialSeconds: 300, iconSeconds: 2, wordSeconds: 0.4, multiplierRisePerMinute: 0.5, estimatedMinutes: 5 },
}

/** 全難易度共通の設定 */
export const COMMON_CONFIG = {
  /** 残り時間の上限 (秒)。獲得した時間はこの値を超えない */
  maxSeconds: 3600,
  /** 倍率の上限 (×)。残り時間が減る速さは、これ以上は速くならない */
  multiplierMax: 5,
  /** 同時に存在できるアイコンの上限 */
  maxIcons: 30,
} as const

const DifficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])

export const OshikuraChainConfigSchema = z.object({
  difficulty: DifficultySchema.default(3),
  /** 初見コメントによる倍率リセット。既定で有効 */
  resetMultiplierOnFirst: z.boolean().default(true),
  gameMode: z.enum(GAME_MODES).default('endurance'),
  commentSource: z.enum(COMMENT_SOURCES).default('live'),
})

export type OshikuraChainConfig = {
  difficulty: DifficultyLevel
  resetMultiplierOnFirst: boolean
  gameMode: GameMode
  commentSource: CommentSource
  /** タイムアタックの目標 (獲得秒数の合計) */
  targetSeconds: number
  initialSeconds: number
  maxSeconds: number
  iconSeconds: number
  wordSeconds: number
  multiplierRisePerMinute: number
  multiplierMax: number
  maxIcons: number
}

export const createConfigForDifficulty = (
  difficulty: DifficultyLevel,
  resetMultiplierOnFirst = true,
  gameMode: GameMode = 'endurance',
  commentSource: CommentSource = 'live'
): OshikuraChainConfig => {
  const profile = DIFFICULTY_PROFILES[difficulty]
  return {
    difficulty,
    initialSeconds: profile.initialSeconds,
    iconSeconds: profile.iconSeconds,
    wordSeconds: profile.wordSeconds,
    multiplierRisePerMinute: profile.multiplierRisePerMinute,
    ...COMMON_CONFIG,
    resetMultiplierOnFirst,
    gameMode,
    commentSource,
    targetSeconds: TIME_ATTACK_TARGET_SECONDS,
  }
}

export const createDefaultConfig = (): OshikuraChainConfig => createConfigForDifficulty(3)

/** 保存済みの設定の、古いキー名 (係数 → 倍率に変えた) を、新しいキー名に読み替える */
const migrateLegacyKeys = (raw: unknown): unknown => {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return raw
  const { resetCoefficientOnFirst, ...rest } = raw as Record<string, unknown>
  return resetCoefficientOnFirst !== undefined && !('resetMultiplierOnFirst' in rest)
    ? { ...rest, resetMultiplierOnFirst: resetCoefficientOnFirst }
    : rest
}

export const parseConfig = (raw: unknown): { config: OshikuraChainConfig; error: string | null } => {
  const result = OshikuraChainConfigSchema.safeParse(migrateLegacyKeys(raw))
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.join('.')
    return { config: createDefaultConfig(), error: path ? `${path}: ${issue.message}` : issue.message }
  }
  const { difficulty, resetMultiplierOnFirst, gameMode, commentSource } = result.data
  return {
    config: createConfigForDifficulty(difficulty, resetMultiplierOnFirst, gameMode, commentSource),
    error: null,
  }
}

/** UI から受け取った難易度を安全な範囲に収める */
export const sanitizeConfig = (draft: Partial<OshikuraChainConfig>): OshikuraChainConfig => {
  const difficulty = DIFFICULTY_LEVELS.includes(draft.difficulty as DifficultyLevel)
    ? (draft.difficulty as DifficultyLevel)
    : 3
  return createConfigForDifficulty(
    difficulty,
    typeof draft.resetMultiplierOnFirst === 'boolean' ? draft.resetMultiplierOnFirst : true,
    GAME_MODES.includes(draft.gameMode as GameMode) ? (draft.gameMode as GameMode) : 'endurance',
    COMMENT_SOURCES.includes(draft.commentSource as CommentSource) ? (draft.commentSource as CommentSource) : 'live'
  )
}
