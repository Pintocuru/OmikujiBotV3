// src/console/game/OshikuraChain/render/draw/nuisance.ts
// アイコン (邪魔者) 1 体
import { CELL_PX, MAX_FOOTPRINT } from '../../scripts/nuisanceConstants'
import { footprintOf, sizeScaleOf, type ParticipantIcon } from '../../scripts/nuisanceEngine'
import type { ParticipantIconKind } from '../../scripts/nuisanceTraits'
import { clamp } from './util'

/** アイコン 1 体を描く canvas の一辺。最大の大きさ + 赤い輪・緑の輪の分の余白 */
export const VIEW_PX = CELL_PX * MAX_FOOTPRINT + 32
const KIND_GLYPH: Record<ParticipantIconKind, string> = {
  static: '',
  boss: '👑',
}

export const drawParticipantIcon = (ctx: CanvasRenderingContext2D, n: ParticipantIcon, image: HTMLImageElement | null): void => {
  const scale = sizeScaleOf(n)
  const footprint = footprintOf(scale)
  const cx = VIEW_PX / 2
  const cy = VIEW_PX / 2
  const radius = (CELL_PX * clamp(scale, footprint - 0.5, footprint) * 0.9) / 2
  const { hue } = n.traits

  // 本体
  ctx.fillStyle = `hsl(${hue} 65% 52%)`
  ctx.strokeStyle = `hsl(${hue} 70% 25%)`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // アイコン (なければ頭文字)
  if (image) {
    const iconRadius = radius * 0.72
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, iconRadius, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(image, cx - iconRadius, cy - iconRadius, iconRadius * 2, iconRadius * 2)
    ctx.restore()
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = `bold ${Math.round(radius * 0.9)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(Array.from(n.userName)[0] ?? '?', cx, cy)
  }

  // 種類のしるし
  const glyph = KIND_GLYPH[n.traits.kind]
  if (glyph) {
    ctx.font = `${Math.round(CELL_PX * 0.3)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(glyph, cx + radius * 0.72, cy - radius * 0.72)
  }
}
