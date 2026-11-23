// src/console/game/OshikuraChain/render/draw/word.ts
// ことば (白い札と、消えるまでの円グラフ)
import { CELL_PX } from '../../scripts/oshikuraChainConstants'
import type { Word } from '../../scripts/oshikuraChainEngine'

/** 白い札に、コメントの一部を 2 行まで書く (1 マスに収まるよう、3 文字ずつで折り返す)。右上に、消えるまでの円グラフ (保護時はシールドアイコン) */
export const drawWord = (ctx: CanvasRenderingContext2D, word: Word, leftRatio: number, size: number): void => {
  const offset = (CELL_PX - size) / 2
  const isProtected = !!word.protected
  ctx.fillStyle = isProtected ? '#fffdf0' : '#ffffff'
  ctx.strokeStyle = isProtected ? '#eab308' : 'rgba(0,0,0,0.25)'
  ctx.lineWidth = isProtected ? 3 : 2
  ctx.beginPath()
  ctx.roundRect(offset, offset, size, size, 8)
  ctx.fill()
  ctx.stroke()
  const chars = Array.from(word.text)
  const lines =
    chars.length <= 3
      ? [chars.join('')]
      : [chars.slice(0, Math.ceil(chars.length / 2)).join(''), chars.slice(Math.ceil(chars.length / 2)).join('')]
  ctx.fillStyle = '#222222'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const lineHeight = 22
  lines.forEach((line, i) =>
    ctx.fillText(line, CELL_PX / 2, CELL_PX / 2 + 2 + (i - (lines.length - 1) / 2) * lineHeight, size - 6)
  )

  const radius = 8
  const cx = CELL_PX - offset - radius - 1
  const cy = offset + radius + 1

  if (isProtected) {
    // 保護中: 金色の星/シールドバッジを表示 (爆発しない)
    ctx.fillStyle = '#eab308'
    ctx.strokeStyle = '#ca8a04'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText('★', cx, cy + 1)
  } else {
    // 円グラフ: 札の右上の角に、残りの割合ぶんの扇を描く (時計回りに減る。残りが少ないほど、緑から赤へ)
    const ratio = leftRatio
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    if (ratio > 0) {
      ctx.fillStyle = `hsl(${Math.round(ratio * 120)}, 80%, 48%)`
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio)
      ctx.closePath()
      ctx.fill()
    }
  }
}
