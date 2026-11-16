// src/ui/LiverBingo/composables/winLines.ts

/**
 * ビンゴが成立するライン(マスの番号の配列)を返す
 * 横 size 本 + 縦 size 本 + 斜め 2 本
 */
export const getWinLines = (size: number): number[][] => {
  const range = Array.from({ length: size }, (_, i) => i)
  return [
    ...range.map((row) => range.map((col) => row * size + col)), // 横
    ...range.map((col) => range.map((row) => row * size + col)), // 縦
    range.map((i) => i * size + i), // 左上から右下
    range.map((i) => i * size + (size - 1 - i)), // 右上から左下
  ]
}
