// src/generator/scripts/trigger/checkers/CheckTimeRange.ts

/**
 * 時間範囲チェック（追加機能）
 */
export function checkTimeRange(startHour: number, endHour: number): boolean {
  const now = new Date()
  const currentHour = now.getHours()

  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour
  } else {
    // 日をまたぐ場合（例: 23-7時）
    return currentHour >= startHour || currentHour < endHour
  }
}
