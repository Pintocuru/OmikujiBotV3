// src/console/game/WordAlchemy/render/stage/resultCard.ts
// 完成品のカード (名前と、新種・既発見の表示) を出して、しばらくして消す。名前が長いときは、折り返す
import { Actor, Canvas, vec } from 'excalibur'
import type { Engine } from 'excalibur'
import { RESULT_SHOW_SECONDS } from '../../scripts/wordAlchemyConstants'
import type { BrewOutcome } from './stageTypes'
import { BOARD_W, clamp } from './stageGeometry'

/** 結果のカードの縁の色 (新種は金、既発見は灰、抽選エラーは紫) */
const RESULT_ACCENT: Readonly<Record<BrewOutcome['kind'], string>> = {
  new: '#ffd34d',
  known: '#9aa4b2',
  lost: '#b07cff',
}

/** 文字を、maxWidth に収まるように折り返す (ctx.font は呼び出し側で設定済み。名前に上限がないため) */
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const lines: string[] = []
  let line = ''
  for (const char of Array.from(text)) {
    if (line !== '' && ctx.measureText(line + char).width > maxWidth) {
      lines.push(line)
      line = ''
    }
    line += char
  }
  lines.push(line)
  return lines
}

/** 文字幅の測定用のコンテキスト (モジュールで 1 つ) */
let probeContext: CanvasRenderingContext2D | null = null

export const showResultCard = (engine: Engine, outcome: BrewOutcome, x: number, y: number): void => {
  const probe = (probeContext ??= document.createElement('canvas').getContext('2d')!)
  const titleFont = 'bold 28px sans-serif'
  const subFont = 'bold 16px sans-serif'
  const lineHeight = 34
  probe.font = titleFont
  const lines = wrapText(probe, outcome.title, BOARD_W - 64)
  const titleWidth = Math.max(...lines.map((line) => probe.measureText(line).width))
  probe.font = subFont
  const subWidth = outcome.subtitle ? probe.measureText(outcome.subtitle).width : 0
  const width = Math.min(BOARD_W, Math.ceil(Math.max(titleWidth, subWidth)) + 32)
  const height = 14 + lines.length * lineHeight + (outcome.subtitle ? 28 : 0)
  const accent = RESULT_ACCENT[outcome.kind]
  const actor = new Actor({
    pos: vec(clamp(x, width / 2, BOARD_W - width / 2), Math.max(height / 2, y - (height - 48) / 2)),
    width,
    height,
    z: 1700,
  })
  actor.graphics.use(
    new Canvas({
      width,
      height,
      cache: true,
      draw: (ctx) => {
        ctx.fillStyle = 'rgba(20,20,30,0.88)'
        ctx.strokeStyle = accent
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(2, 2, width - 4, height - 4, 14)
        ctx.fill()
        ctx.stroke()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#ffffff'
        ctx.font = titleFont
        lines.forEach((line, i) => ctx.fillText(line, width / 2, 24 + i * lineHeight, width - 24))
        if (outcome.subtitle) {
          ctx.fillStyle = accent
          ctx.font = subFont
          ctx.fillText(outcome.subtitle, width / 2, height - 20, width - 24)
        }
      },
    })
  )
  engine.add(actor)
  actor.actions
    .delay(RESULT_SHOW_SECONDS * 1000)
    .fade(0, 700)
    .die()
}
