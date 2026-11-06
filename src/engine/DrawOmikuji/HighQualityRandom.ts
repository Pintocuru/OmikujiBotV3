// src/engine/DrawOmikuji/HighQualityRandom.ts

/**
 * 高品質な乱数生成器
 * Math.random()の改良版（XorShift アルゴリズム使用）
 */
export class HighQualityRandom {
  private seed: number

  constructor() {
    // 現在時刻とランダムな要素でシードを生成
    this.seed = (Date.now() ^ (Math.random() * 0x100000000)) | 0
    // XorShift は 0 だと 0 のままになるため、0 のときは固定値に置き換える
    if (this.seed === 0) this.seed = 0x9e3779b9 | 0
  }

  /**
   * XorShift アルゴリズムによる高品質乱数生成
   */
  next(): number {
    this.seed ^= this.seed << 13
    this.seed ^= this.seed >>> 17
    this.seed ^= this.seed << 5
    return (this.seed >>> 0) / 0x100000000
  }

  /**
   * 指定範囲の整数を生成
   */
  nextInt(max: number): number {
    return Math.floor(this.next() * max)
  }

  /**
   * 指定範囲の浮動小数点数を生成
   */
  nextFloat(min: number = 0, max: number = 1): number {
    return min + this.next() * (max - min)
  }
}
