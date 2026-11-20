// src/console/common/scripts/streamId.ts
// ゲームログの保存先 (1配信 = 1ファイル) の配信ID。起動した日時 例 '20261020-2130' (StreamIdSchema に合う形)
// OBS 側の GameRanking (src/ui/game/GameRanking/scripts/useGameLogSaver.ts の createStreamId) と同じ形式
export const createStreamId = (now: Date = new Date()): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
}
