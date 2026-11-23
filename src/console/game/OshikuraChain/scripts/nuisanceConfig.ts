// src/console/game/OshikuraChain/scripts/nuisanceConfig.ts
// おしくらチェインの難易度設定 (サーバーに保存する。ゲーム内の調整値は難易度から導出する)
import { z } from 'zod'
import { TIME_ATTACK_TARGET_SECONDS } from './nuisanceConstants'

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
    /** 係数が 1 分ごとに下がる割合 (%) */
    coefficientDropPerMinute: number
    /** 表示用の所要時間目安 (分)。初見コメントによる係数リセットを含まない */
    estimatedMinutes: number
  }
> = {
  1: { initialSeconds: 3600, iconSeconds: 8, wordSeconds: 1.5, coefficientDropPerMinute: 1, estimatedMinutes: 60 },
  2: { initialSeconds: 2400, iconSeconds: 6, wordSeconds: 1.2, coefficientDropPerMinute: 2, estimatedMinutes: 40 },
  3: { initialSeconds: 1500, iconSeconds: 5, wordSeconds: 1, coefficientDropPerMinute: 3, estimatedMinutes: 25 },
  4: { initialSeconds: 900, iconSeconds: 3, wordSeconds: 0.6, coefficientDropPerMinute: 5, estimatedMinutes: 15 },
  5: { initialSeconds: 600, iconSeconds: 2, wordSeconds: 0.4, coefficientDropPerMinute: 8, estimatedMinutes: 10 },
}

/** 全難易度共通の設定 */
export const COMMON_CONFIG = {
  /** 残り時間の上限 (秒)。獲得した時間はこの値を超えない */
  maxSeconds: 3600,
  /** 係数の下限 (%) */
  coefficientFloorPercent: 10,
  /** 同時に存在できるアイコンの上限 */
  maxNuisances: 30,
} as const

const DifficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])

export const NuisanceConfigSchema = z.object({
  difficulty: DifficultySchema.default(3),
  /** 初見コメントによる係数リセット。既定で有効 */
  resetCoefficientOnFirst: z.boolean().default(true),
  gameMode: z.enum(GAME_MODES).default('endurance'),
  commentSource: z.enum(COMMENT_SOURCES).default('live'),
})

export type NuisanceConfigType = {
  difficulty: DifficultyLevel
  resetCoefficientOnFirst: boolean
  gameMode: GameMode
  commentSource: CommentSource
  /** タイムアタックの目標 (獲得秒数の合計) */
  targetSeconds: number
  initialSeconds: number
  maxSeconds: number
  iconSeconds: number
  wordSeconds: number
  coefficientDropPerMinute: number
  coefficientFloorPercent: number
  maxNuisances: number
}

export const createConfigForDifficulty = (
  difficulty: DifficultyLevel,
  resetCoefficientOnFirst = true,
  gameMode: GameMode = 'endurance',
  commentSource: CommentSource = 'live'
): NuisanceConfigType => {
  const profile = DIFFICULTY_PROFILES[difficulty]
  return {
    difficulty,
    initialSeconds: profile.initialSeconds,
    iconSeconds: profile.iconSeconds,
    wordSeconds: profile.wordSeconds,
    coefficientDropPerMinute: profile.coefficientDropPerMinute,
    ...COMMON_CONFIG,
    resetCoefficientOnFirst,
    gameMode,
    commentSource,
    targetSeconds: TIME_ATTACK_TARGET_SECONDS,
  }
}

export const createDefaultConfig = (): NuisanceConfigType => createConfigForDifficulty(3)

export const parseConfig = (raw: unknown): { config: NuisanceConfigType; error: string | null } => {
  const result = NuisanceConfigSchema.safeParse(raw)
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.join('.')
    return { config: createDefaultConfig(), error: path ? `${path}: ${issue.message}` : issue.message }
  }
  const { difficulty, resetCoefficientOnFirst, gameMode, commentSource } = result.data
  return {
    config: createConfigForDifficulty(difficulty, resetCoefficientOnFirst, gameMode, commentSource),
    error: null,
  }
}

/** UI から受け取った難易度を安全な範囲に収める */
export const sanitizeConfig = (draft: Partial<NuisanceConfigType>): NuisanceConfigType => {
  const difficulty = DIFFICULTY_LEVELS.includes(draft.difficulty as DifficultyLevel)
    ? (draft.difficulty as DifficultyLevel)
    : 3
  return createConfigForDifficulty(
    difficulty,
    typeof draft.resetCoefficientOnFirst === 'boolean' ? draft.resetCoefficientOnFirst : true,
    GAME_MODES.includes(draft.gameMode as GameMode) ? (draft.gameMode as GameMode) : 'endurance',
    COMMENT_SOURCES.includes(draft.commentSource as CommentSource) ? (draft.commentSource as CommentSource) : 'live'
  )
}
