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

export type FollowSpeed = 'slow' | 'normal' | 'fast'

/** 盤面を上から下まで辿りきるまでの時間 (秒)。全員同時でも一人ずつでも同じ */
export const FOLLOW_DURATION_SEC: Record<FollowSpeed, number> = {
  slow: 12,
  normal: 6,
  fast: 2.5,
}

/** 横線を渡る間に進む高さ (行数換算)。横線の高さを中心に、前後へ半分ずつ */
export const RUNG_CROSS_ROWS = 0.3

/** 一人ずつ発表するときの、辿る線への拡大率 */
export const FOLLOW_ZOOM = 1.6
