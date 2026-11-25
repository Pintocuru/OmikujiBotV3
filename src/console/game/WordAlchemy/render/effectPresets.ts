// src/console/game/WordAlchemy/render/effectPresets.ts
// 演出のプリセット。出来事に対して「何を、どれくらい派手に出すか」だけを決める。
// 描画の実体 (Excalibur) は EffectHost の向こう側にあり、ここは Excalibur を知らない
import { POT_INGREDIENTS } from '../scripts/wordAlchemyConstants'
import type { SoundKey } from './stageSounds'

/** 演出を出す側 (WordAlchemyStage が実装する) */
export interface EffectHost {
  /** 画面を揺らす (強さは盤面の px、時間はミリ秒) */
  shake(magnitude: number, durationMs: number): void
  /** 粒を一度に飛ばす (座標は盤面の px) */
  burst(options: BurstOptions): void
  /** 効果音を鳴らす (素材がなければ、何もしない) */
  play(key: SoundKey): void
  /** 文字を浮かび上がらせる (座標は盤面の px) */
  popup(options: PopupOptions): void
}

export type PopupOptions = {
  x: number
  y: number
  text: string
  /** 文字の大きさ (px) */
  size: number
  /** 文字の色 (CSS の色) */
  color: string
  /** 見えている時間 (ミリ秒)。この間に、上へ浮かびながら、最後に薄くなる */
  lifeMs: number
  /** 浮かぶ高さ (px) */
  rise: number
}

export type BurstOptions = {
  x: number
  y: number
  count: number
  /** 粒の色 (色相 0〜360・彩度・明るさ 0〜100) */
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
  /** 粒の飛ぶ向きの範囲 (ラジアン。省略は全方向。真上は -π/2) */
  minAngle?: number
  maxAngle?: number
}

type At = { x: number; y: number }

const burstAt = (
  at: At,
  o: Pick<BurstOptions, 'count' | 'hue' | 'saturation' | 'lightness' | 'lifeMs' | 'radius'> & Partial<BurstOptions>
): BurstOptions => ({ minSpeed: 60, maxSpeed: 200, minSize: 4, maxSize: 11, ...o, x: at.x, y: at.y })

/** ことばが降ってきた: 1 コメントにつき 1 回だけ鳴らす (個々の着地は playLand) */
export const playSpawn = (host: EffectHost): void => host.play('land')

/** ことばの着地: 小さな土煙 */
export const playLand = (host: EffectHost, at: At): void =>
  host.burst(
    burstAt(at, {
      count: 6,
      hue: 35,
      saturation: 25,
      lightness: 62,
      lifeMs: 450,
      radius: 10,
      maxSpeed: 90,
      minSize: 3,
      maxSize: 8,
    })
  )

/** ことばが縁に押し込まれて消えた: 白い札の破片 */
export const playWordGone = (host: EffectHost, at: At): void => {
  host.burst(burstAt(at, { count: 12, hue: 0, saturation: 0, lightness: 96, lifeMs: 520, radius: 18 }))
  host.play('remove')
}

/** ことばが鍋に入った: 泡と、材料の数 (n/3) */
export const playIntake = (host: EffectHost, pot: { top: At; center: At }, count: number): void => {
  host.burst(burstAt(pot.center, { count: 10, hue: 130, saturation: 60, lightness: 70, lifeMs: 500, radius: 18 }))
  host.popup({
    x: pot.top.x,
    y: pot.top.y,
    text: `${count}/${POT_INGREDIENTS}`,
    size: 24,
    color: '#ffe9a8',
    lifeMs: 900,
    rise: 24,
  })
  host.play('intake')
}

/** 鍋が、ことばを受け付けずに弾いた */
export const playReject = (host: EffectHost, at: At): void => {
  host.burst(burstAt(at, { count: 12, hue: 0, saturation: 70, lightness: 62, lifeMs: 500, radius: 26 }))
  host.shake(2, 120)
  host.play('reject')
}

/** 煮込み開始: 緑の泡が立ちのぼる */
export const playBrewStart = (host: EffectHost, pot: { top: At; center: At }): void => {
  host.burst(
    burstAt(pot.center, {
      count: 30,
      hue: 120,
      saturation: 70,
      lightness: 60,
      lifeMs: 800,
      radius: 30,
      minSpeed: 40,
      maxSpeed: 160,
      minAngle: -Math.PI * 0.85,
      maxAngle: -Math.PI * 0.15,
    })
  )
  host.popup({ x: pot.top.x, y: pot.top.y, text: '煮込み開始！', size: 26, color: '#9be37f', lifeMs: 1200, rise: 20 })
  host.play('brewStart')
}

/** 煮込み中の湯気 (一定間隔で呼ぶ) */
export const playSteam = (host: EffectHost, at: At): void =>
  host.burst(
    burstAt(at, {
      count: 3,
      hue: 0,
      saturation: 0,
      lightness: 92,
      lifeMs: 900,
      radius: 22,
      minSpeed: 30,
      maxSpeed: 70,
      minSize: 6,
      maxSize: 12,
      minAngle: -Math.PI * 0.8,
      maxAngle: -Math.PI * 0.2,
    })
  )

/** 煮込み完了: 新種は派手に (金の粒・画面揺れ・ファンファーレ)、既発見は控えめに、抽選エラーは紫の煙 */
export const playBrewDone = (host: EffectHost, kind: 'new' | 'known' | 'lost', at: At): void => {
  if (kind === 'new') {
    host.burst(
      burstAt(at, {
        count: 60,
        hue: 48,
        saturation: 95,
        lightness: 62,
        lifeMs: 900,
        radius: 30,
        minSpeed: 120,
        maxSpeed: 380,
        minSize: 5,
        maxSize: 16,
      })
    )
    host.shake(6, 300)
    host.play('discoverNew')
  } else if (kind === 'known') {
    host.burst(
      burstAt(at, { count: 18, hue: 210, saturation: 15, lightness: 78, lifeMs: 600, radius: 24, maxSpeed: 150 })
    )
    host.play('discoverKnown')
  } else {
    host.burst(
      burstAt(at, {
        count: 30,
        hue: 270,
        saturation: 60,
        lightness: 55,
        lifeMs: 800,
        radius: 30,
        minSpeed: 30,
        maxSpeed: 140,
        minSize: 6,
        maxSize: 16,
      })
    )
    host.play('lost')
  }
}
