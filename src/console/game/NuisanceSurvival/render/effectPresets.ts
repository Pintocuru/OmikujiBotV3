// src/console/game/NuisanceSurvival/render/effectPresets.ts
// 演出のプリセット。イベント (NuisanceEvent) に対して「何を、どれくらい派手に出すか」だけを決める。
// 描画の実体 (Excalibur) は EffectHost の向こう側にあり、ここは Excalibur を知らない
import type { NuisanceEvent } from '../scripts/nuisanceEngine'
import type { SoundKey } from './stageSounds'

/** 演出を出す側 (NuisanceStage が実装する) */
export interface EffectHost {
  /** 画面を揺らす (強さは盤面の px、時間はミリ秒) */
  shake(magnitude: number, durationMs: number): void
  /** 粒を一度に飛ばす (座標は盤面の px) */
  burst(options: BurstOptions): void
  /** 効果音を鳴らす (素材がなければ、何もしない) */
  play(key: SoundKey): void
}

export type BurstOptions = {
  x: number
  y: number
  count: number
  /** 粒の色 (CSS の hsl 文字列ではなく、色相 0〜360 と明るさで指定する) */
  hue: number
  saturation: number
  lightness: number
  /** 粒の速さ (px/秒) の最小・最大 */
  minSpeed: number
  maxSpeed: number
  /** 粒の大きさ (px) の最小・最大 */
  minSize: number
  maxSize: number
  /** 粒が残る時間 (ミリ秒) */
  lifeMs: number
  /** 発生させる範囲の半径 (px) */
  radius: number
}

// ---- 落下 (enemySpawn) ----

/** 落ちてくる時間 (秒)。上から降って、着地する */
export const FALL_SECONDS = 0.45
/** 落ち始める高さ (盤面の上端より、さらに上のマス数) */
export const FALL_EXTRA_CELLS = 1.5

// ---- 着地 (enemySpawn の続き) ----

/** 着地: 土煙と画面揺れ。ボスは大きく揺らす */
export const playLand = (host: EffectHost, at: { x: number; y: number; size: number; isBoss: boolean }): void => {
  host.burst({
    x: at.x,
    y: at.y + at.size * 0.4,
    count: at.isBoss ? 36 : 14,
    hue: 35,
    saturation: 25,
    lightness: 62,
    minSpeed: 40,
    maxSpeed: at.isBoss ? 220 : 130,
    minSize: 6,
    maxSize: at.isBoss ? 22 : 14,
    lifeMs: 650,
    radius: at.size * 0.35,
  })
  host.shake(at.isBoss ? 9 : 2.5, at.isBoss ? 420 : 160)
  host.play(at.isBoss ? 'bossLand' : 'land')
}

// ---- 撃破 (enemyDeath) ----

/** 撃破: 爆発は赤橙の大きな破片と強い揺れ、取り除いたときは邪魔者の色の小さな破片 */
export const playDeath = (
  host: EffectHost,
  event: Extract<NuisanceEvent, { type: 'enemyDeath' }>,
  at: { x: number; y: number; size: number }
): void => {
  if (event.cause === 'exploded') {
    host.burst({
      x: at.x,
      y: at.y,
      count: 46,
      hue: 18,
      saturation: 95,
      lightness: 55,
      minSpeed: 90,
      maxSpeed: 360,
      minSize: 8,
      maxSize: 26,
      lifeMs: 800,
      radius: at.size * 0.3,
    })
    host.shake(8 + event.footprint * 2, 360)
    host.play('explosion')
    return
  }
  host.burst({
    x: at.x,
    y: at.y,
    count: 22,
    hue: event.hue,
    saturation: 75,
    lightness: 58,
    minSpeed: 70,
    maxSpeed: 240,
    minSize: 5,
    maxSize: 15,
    lifeMs: 600,
    radius: at.size * 0.3,
  })
  host.shake(3, 140)
  host.play('remove')
}
