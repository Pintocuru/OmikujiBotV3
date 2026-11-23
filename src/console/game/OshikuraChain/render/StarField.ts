// src/console/game/OshikuraChain/render/StarField.ts
// 背景の星 (ロケットでの星間旅行)。盤面の中央から外へ星が広がり、連鎖が続くほど速く、長い尾を引く。
// 見た目だけで、ゲームには影響しない。連鎖数を読み取って動かすだけ (Excalibur は知らない)

/** 星の数 */
const STAR_COUNT = 140
/** 連鎖がこの数で、速さが最大になる */
export const CHAIN_FOR_MAX_SPEED = 12
/** 速さの倍率 (連鎖なし / 最大)。待機中・連鎖なしでも、ゆっくり流れる */
export const IDLE_SPEED = 0.25
export const MAX_SPEED = 3.5
/** 速さが変わる早さ (1 秒あたりの追従率)。上がるときは素早く、連鎖が切れたときはゆっくり戻す */
const ATTACK_PER_SECOND = 6
const RELEASE_PER_SECOND = 1.2
/** 1 フレームで進める時間の上限 (秒。非表示から戻った最初のフレームで、星が飛ばないように) */
const MAX_DT = 0.1
/** 星が中央から出てくる範囲 (px) */
const SPAWN_RADIUS = 18
/** 尾の長さ (速さ px/秒 に掛ける秒数) */
const TAIL_SECONDS = 0.05

type Star = {
  angle: number
  /** 中央からの距離 (px) */
  r: number
  /** 奥行き (0.3〜1。小さいほど遠く、小さく、遅い) */
  depth: number
}

export class StarField {
  private readonly stars: Star[] = []
  private readonly cx: number
  private readonly cy: number
  /** 星が盤面から出きる距離 (中央から角まで + 余白) */
  private readonly maxR: number
  /** いまの速さの倍率 (IDLE_SPEED〜MAX_SPEED) */
  speed = IDLE_SPEED

  constructor(
    width: number,
    height: number,
    private readonly rng: () => number = Math.random
  ) {
    this.cx = width / 2
    this.cy = height / 2
    this.maxR = Math.hypot(this.cx, this.cy) + 40
    // 最初から画面全体に星がいるように、距離はばらつかせる (中央付近を多めに)
    for (let i = 0; i < STAR_COUNT; i++) {
      const star = this.spawn()
      star.r = rng() ** 2 * this.maxR
      this.stars.push(star)
    }
  }

  private spawn(): Star {
    return { angle: this.rng() * Math.PI * 2, r: this.rng() * SPAWN_RADIUS, depth: 0.3 + this.rng() * 0.7 }
  }

  /** 連鎖数から決まる、速さの目標 */
  static targetSpeed(chain: number): number {
    const ratio = Math.min(1, Math.max(0, chain) / CHAIN_FOR_MAX_SPEED)
    return IDLE_SPEED + (MAX_SPEED - IDLE_SPEED) * ratio
  }

  /** 星を進める。chain は、いまの連鎖数 (ゲーム中でなければ 0) */
  update(dtSeconds: number, chain: number): void {
    const dt = Math.min(MAX_DT, Math.max(0, dtSeconds))
    const target = StarField.targetSpeed(chain)
    const rate = target > this.speed ? ATTACK_PER_SECOND : RELEASE_PER_SECOND
    this.speed += (target - this.speed) * Math.min(1, rate * dt)
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i]
      // 中央から離れるほど速く動く (近づいてくるように見える)
      star.r += this.pxPerSecond(star) * dt
      if (star.r > this.maxR) this.stars[i] = this.spawn()
    }
  }

  private pxPerSecond(star: Star): number {
    return (20 + star.r * 1.2) * this.speed * star.depth
  }

  /** 描く (呼び出し側で、盤面の大きさの canvas を渡す。毎回、全体を描き直す) */
  draw(ctx: CanvasRenderingContext2D): void {
    const norm = (this.speed - IDLE_SPEED) / (MAX_SPEED - IDLE_SPEED)
    ctx.clearRect(0, 0, this.cx * 2, this.cy * 2)
    ctx.lineCap = 'round'
    for (const star of this.stars) {
      const cos = Math.cos(star.angle)
      const sin = Math.sin(star.angle)
      const tail = Math.max(0, star.r - this.pxPerSecond(star) * TAIL_SECONDS)
      // 中央に近いうちは薄く、離れるほど濃く。遠い星は暗く
      const alpha = Math.min(1, star.r / 140) * (0.35 + 0.65 * star.depth)
      ctx.strokeStyle = `hsla(${205 + 30 * norm}, ${35 + 55 * norm}%, 85%, ${alpha.toFixed(3)})`
      ctx.lineWidth = (0.8 + star.depth * 1.4) * (1 + star.r / 500)
      ctx.beginPath()
      ctx.moveTo(this.cx + cos * tail, this.cy + sin * tail)
      ctx.lineTo(this.cx + cos * star.r, this.cy + sin * star.r)
      ctx.stroke()
    }
  }
}
