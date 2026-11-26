// src/console/control/Amidakuji/scripts/amidakujiConstants.ts

/** 縦線(参加者)の上限数 */
export const PLAYER_MAX = 100

/** 最小参加者数 */
export const PLAYER_MIN = 2

/** 自動生成時の横線密度 (0.0 〜 1.0) */
export const DEFAULT_RUNG_DENSITY = 0.3

/** デフォルトの「はずれ」ラベル */
export const DEFAULT_LOSE_LABEL = 'はずれ'

/** 行数 (横線を配置可能な段数) を計算する: max(12, 縦線数 * 2) */
export const calculateRowCount = (colCount: number): number => {
  return Math.max(12, colCount * 2)
}

/** 辿る速度設定 (秒換算またはスピード乗数用) */
export type FollowSpeed = 'slow' | 'normal' | 'fast'

export const FOLLOW_SPEED_MS: Record<FollowSpeed, number> = {
  slow: 80,
  normal: 40,
  fast: 15,
}
