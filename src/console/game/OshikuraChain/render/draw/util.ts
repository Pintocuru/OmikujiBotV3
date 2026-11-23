// src/console/game/OshikuraChain/render/draw/util.ts
// 描画の小さな計算

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** 色相・彩度・明るさ (0〜360 / 0〜100 / 0〜100) を、Excalibur の Color が受け取る RGB (0〜255) に直す */
export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const sat = s / 100
  const light = l / 100
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}
