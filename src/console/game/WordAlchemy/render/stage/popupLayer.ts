// src/console/game/WordAlchemy/render/stage/popupLayer.ts
// 浮かぶ文字 (演出)。出す (add) と進める (sync) だけ。何を出すかは effectPresets.ts が決め、Stage が渡す
import { Actor, Canvas, vec } from 'excalibur'
import type { Engine } from 'excalibur'
import type { PopupOptions } from '../effectPresets'
import { BOARD_H, BOARD_W, clamp } from './stageGeometry'

/** 浮かぶ文字の同時数の上限 (一度に続いても、画面が文字だらけにならないように) */
const POPUP_MAX = 20

type Popup = { actor: Actor; options: PopupOptions; age: number; baseY: number }

export class PopupLayer {
  private readonly popups: Popup[] = []
  private probe: CanvasRenderingContext2D | null = null

  add(engine: Engine, o: PopupOptions): void {
    const probe = (this.probe ??= document.createElement('canvas').getContext('2d')!)
    const font = `bold ${o.size}px sans-serif`
    probe.font = font
    const width = Math.ceil(probe.measureText(o.text).width) + 24
    const height = o.size + 18
    const x = clamp(o.x, width / 2, Math.max(width / 2, BOARD_W - width / 2))
    const y = clamp(o.y, height / 2, BOARD_H)
    const actor = new Actor({ pos: vec(x, y), width, height, z: 1600 })
    actor.graphics.use(
      new Canvas({
        width,
        height,
        cache: true,
        draw: (ctx) => {
          ctx.font = font
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.lineJoin = 'round'
          ctx.lineWidth = Math.max(4, o.size / 6)
          ctx.strokeStyle = 'rgba(20,20,30,0.85)'
          ctx.strokeText(o.text, width / 2, height / 2)
          ctx.fillStyle = o.color
          ctx.fillText(o.text, width / 2, height / 2)
        },
      })
    )
    engine.add(actor)
    this.popups.push({ actor, options: o, age: 0, baseY: y })
    while (this.popups.length > POPUP_MAX) this.popups.shift()!.actor.kill()
  }

  /** 浮かぶ文字を進める: 出たら少し弾んで、上へ浮かびながら、最後に薄くなって消える */
  sync(dt: number): void {
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i]
      p.age += dt * 1000
      const t = p.age / p.options.lifeMs
      if (t >= 1) {
        p.actor.kill()
        this.popups.splice(i, 1)
        continue
      }
      const eased = 1 - (1 - t) * (1 - t)
      const pop = 1 + 0.35 * Math.max(0, 1 - t * 8)
      p.actor.pos = vec(p.actor.pos.x, p.baseY - p.options.rise * eased)
      p.actor.scale = vec(pop, pop)
      p.actor.graphics.opacity = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3
    }
  }

  clear(): void {
    for (const p of this.popups) p.actor.kill()
    this.popups.length = 0
  }
}
