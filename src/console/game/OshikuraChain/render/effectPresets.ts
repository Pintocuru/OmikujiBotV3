// src/console/game/OshikuraChain/render/effectPresets.ts
// 演出のプリセット。イベント (NuisanceEvent) に対して「何を、どれくらい派手に出すか」だけを決める。
// 描画の実体 (Excalibur) は EffectHost の向こう側にあり、ここは Excalibur を知らない
import { BIG_CHAIN_MIN } from '../scripts/nuisanceConstants'
import type { NuisanceEvent } from '../scripts/nuisanceEngine'
import { formatGain } from '../scripts/nuisanceRecord'
import type { SoundKey } from './stageSounds'

/** 演出を出す側 (NuisanceStage が実装する) */
export interface EffectHost {
  /** 画面を揺らす (強さは盤面の px、時間はミリ秒) */
  shake(magnitude: number, durationMs: number): void
  /** 粒を一度に飛ばす (座標は盤面の px) */
  burst(options: BurstOptions): void
  /** 効果音を鳴らす (素材がなければ、何もしない) */
  play(key: SoundKey): void
  /** 音階の音を鳴らす (素材なし。周波数 Hz と、鳴らすまでの待ち秒。音が出せない環境では、何もしない) */
  playNote(frequency: number, delaySeconds: number): void
  /** 文字を浮かび上がらせる (座標は盤面の px。待ち時間のあいだは見えない) */
  popup(options: PopupOptions): void
  /** 盤面の大きさ (px) */
  readonly boardSize: { width: number; height: number }
}

export type PopupOptions = {
  x: number
  y: number
  text: string
  /** 文字の大きさ (px) */
  size: number
  /** 文字の色 (CSS の色) */
  color: string
  /** 出るまでの待ち (ミリ秒。連鎖のウェーブに合わせる) */
  delayMs: number
  /** 見えている時間 (ミリ秒)。この間に、上へ浮かびながら、最後に薄くなる */
  lifeMs: number
  /** 浮かぶ高さ (px) */
  rise: number
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

/** アイコンが消えたとき: 押し出されて画面の外へ出たなら、アイコンの色の小さな破片と効果音。ことばの爆発に巻き込まれたなら、少し大きな破片だけ (音は爆発の音) */
export const playDeath = (
  host: EffectHost,
  event: Extract<NuisanceEvent, { type: 'enemyDeath' }>,
  at: { x: number; y: number; size: number }
): void => {
  if (event.cause === 'exploded') {
    host.burst({
      x: at.x,
      y: at.y,
      count: 28,
      hue: event.hue,
      saturation: 80,
      lightness: 60,
      minSpeed: 90,
      maxSpeed: 300,
      minSize: 6,
      maxSize: 18,
      lifeMs: 650,
      radius: at.size * 0.3,
    })
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

// ---- ことばが外へ出たとき ----

/** 白い札の小さな破片 (ことばが消えるとき) */
const burstWordShards = (host: EffectHost, at: { x: number; y: number; size: number }): void => {
  host.burst({
    x: at.x,
    y: at.y,
    count: 14,
    hue: 0,
    saturation: 0,
    lightness: 96,
    minSpeed: 60,
    maxSpeed: 200,
    minSize: 4,
    maxSize: 11,
    lifeMs: 520,
    radius: at.size * 0.3,
  })
}

/** ことばが押し出されて画面の外へ出たとき: 白い札の破片と、アイコンと同じ explosion.mp3 */
export const playWordGone = (host: EffectHost, at: { x: number; y: number; size: number }): void => {
  burstWordShards(host, at)
  host.shake(1.5, 100)
  host.play('remove')
}

/** ことばの爆発: 橙の大きな爆発と、強い画面揺れ、爆発の音 (explosion.mp3 とは別)。巻き込まれたことばは、白い破片になる */
export const playWordBlast = (
  host: EffectHost,
  at: { x: number; y: number; size: number },
  victims: { x: number; y: number; size: number }[]
): void => {
  host.burst({
    x: at.x,
    y: at.y,
    count: 48,
    hue: 22,
    saturation: 95,
    lightness: 58,
    minSpeed: 100,
    maxSpeed: 380,
    minSize: 8,
    maxSize: 26,
    lifeMs: 800,
    radius: at.size * 1.2,
  })
  for (const v of victims) burstWordShards(host, v)
  host.shake(9, 380)
  host.play('wordBlast')
}

// ---- 連鎖の音階 (score) ----

/** 音階 (長音階。ド・レ・ミ・ファ・ソ・ラ・シ の、ドからの半音の数) */
const MAJOR_SCALE_SEMITONES = [0, 2, 4, 5, 7, 9, 11] as const
/** 音階の一番下の音 (高いドの周波数 Hz。C5) */
const BASE_FREQUENCY = 523.25
/** 上がり続ける音の数の上限 (連鎖がこれを超えても、一番上の音のまま。2 オクターブ上のドまで) */
const MAX_NOTE_INDEX = 14

/** 連鎖数に応じた音の周波数 (1 連鎖がド、2 連鎖がレ、…、8 連鎖が 1 オクターブ上のド。上がり続けて、2 オクターブ上のドで止まる) */
export const chainNoteFrequency = (chain: number): number => {
  const index = Math.min(MAX_NOTE_INDEX, Math.max(0, Math.floor(chain) - 1))
  const octave = Math.floor(index / MAJOR_SCALE_SEMITONES.length)
  const semitones = MAJOR_SCALE_SEMITONES[index % MAJOR_SCALE_SEMITONES.length] + 12 * octave
  return BASE_FREQUENCY * 2 ** (semitones / 12)
}

/** 連鎖数に応じた文字の色 (連鎖が増えるほど、黄色から赤みへ) */
const chainColor = (chain: number): string => `hsl(${Math.round(55 - Math.min(chain, 10) * 5)}, 100%, 62%)`

/** 得点: 音階の音と、「N連鎖！」「+◯秒」の文字 (どちらも、連鎖のウェーブに合わせて、少し遅れて出る) */
export const playScore = (
  host: EffectHost,
  event: Extract<NuisanceEvent, { type: 'score' }>,
  at: { x: number; y: number }
): void => {
  const delayMs = event.delaySeconds * 1000
  host.playNote(chainNoteFrequency(event.chain), event.delaySeconds)
  if (event.chain >= 2) {
    host.popup({
      x: at.x,
      y: at.y - 22,
      text: `${event.chain}連鎖！`,
      size: 26 + Math.min(event.chain, 12) * 2,
      color: chainColor(event.chain),
      delayMs,
      lifeMs: 900,
      rise: 46,
    })
  }
  host.popup({
    x: at.x,
    y: at.y + 8,
    text: `+${formatGain(event.seconds)}秒`,
    size: 20,
    color: '#ffffff',
    delayMs,
    lifeMs: 900,
    rise: 36,
  })
  if (event.chain >= 5) host.shake(Math.min(event.chain, 12) * 0.4, 140)
}

/** 連鎖が切れた: 2 連鎖以上なら、その連鎖で得た秒数の合計を大きく見せる。BIG_CHAIN_MIN 以上の大連鎖なら、祝いの音も鳴らす */
export const playChainBreak = (host: EffectHost, event: Extract<NuisanceEvent, { type: 'chainBreak' }>): void => {
  if (event.chain < 2) return
  if (event.chain >= BIG_CHAIN_MIN) host.play('bigChain')
  host.popup({
    x: host.boardSize.width / 2,
    y: host.boardSize.height * 0.32,
    text: `TOTAL +${formatGain(event.total)}秒！`,
    size: 40,
    color: '#ffd84a',
    delayMs: 0,
    lifeMs: 1600,
    rise: 30,
  })
}

/** 倍率の段階ごとの、ヒートアップの文言と色 (段階が上がるほど、赤く危なくなる) */
const HEAT_STYLES: Record<number, { text: string; color: string; hue: number }> = {
  2: { text: 'エンジン温度上昇！', color: '#ffd84a', hue: 48 },
  3: { text: 'ヒートアップ！', color: '#ffa53a', hue: 32 },
  4: { text: 'オーバーヒート寸前！', color: '#ff6a3a', hue: 18 },
  5: { text: '限界突破！ 最大ヒート！', color: '#ff3a3a', hue: 4 },
}

/** 倍率が上がった (エンジンがヒートアップした): 段階が上がるほど、揺れ・火の粉・音が強くなる */
export const playMultiplierUp = (host: EffectHost, event: Extract<NuisanceEvent, { type: 'multiplierUp' }>): void => {
  const style = HEAT_STYLES[Math.min(5, Math.max(2, event.level))]
  host.popup({
    x: host.boardSize.width / 2,
    y: host.boardSize.height * 0.45,
    text: `${style.text} ×${event.level}`,
    size: 32 + event.level * 4,
    color: style.color,
    delayMs: 0,
    lifeMs: 1800,
    rise: 20,
  })
  host.burst({
    x: host.boardSize.width / 2,
    y: host.boardSize.height * 0.45,
    count: 14 + event.level * 8,
    hue: style.hue,
    saturation: 95,
    lightness: 58,
    minSpeed: 90,
    maxSpeed: 300,
    minSize: 4,
    maxSize: 12,
    lifeMs: 800,
    radius: 30,
  })
  host.shake(event.level * 1.5, 300 + event.level * 60)
  host.playNote(110 * event.level, 0)
  host.play('heatUp')
}

/** 初見さんのコメントで、上がっていた倍率が 1 に戻った (エンジンが冷えた) */
export const playMultiplierReset = (
  host: EffectHost,
  event: Extract<NuisanceEvent, { type: 'multiplierReset' }>
): void => {
  host.popup({
    x: host.boardSize.width / 2,
    y: host.boardSize.height * 0.18,
    text: `${event.userName} さん初見！ エンジン冷却！`,
    size: 28,
    color: '#7ee8ff',
    delayMs: 0,
    lifeMs: 2200,
    rise: 24,
  })
  host.burst({
    x: host.boardSize.width / 2,
    y: host.boardSize.height * 0.18,
    count: 30,
    hue: 190,
    saturation: 90,
    lightness: 70,
    minSpeed: 80,
    maxSpeed: 260,
    minSize: 4,
    maxSize: 12,
    lifeMs: 800,
    radius: 40,
  })
}

// ---- ゲームオーバー (gameOver) ----

/** ゲームオーバー: 耐久で残り時間が 0 になったときだけ、失敗の音を鳴らす (タイムアタックのクリアでは鳴らさない) */
export const playGameOver = (host: EffectHost, event: Extract<NuisanceEvent, { type: 'gameOver' }>): void => {
  if (!event.cleared) host.play('gameOver')
}
