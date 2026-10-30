// src/generator/scripts/EventProcess/PadProcessor.ts
import { useAppStore } from '@/generator/stores/useAppStore'
import { OmikujiProcessor } from '@/generator/scripts/EventProcess/OmikujiProcessor'
import { padApi } from '@/manager/services/padApi'
import type { PadIdType } from '@/types/OmikujiData'

/** ポーリング間隔 (固定。ローカルのみ・数クライアント前提のため、ジッターは付けない) */
export const PAD_POLL_INTERVAL_MS = 500

/**
 * ポン出しイベントの実行を管理
 *
 * サーバー (load-pad-status) を 0.5秒ごとにポーリングし、前回受け取った発火時刻 (lastSeen) より新しい発火があれば、
 * その padId に反応する pads イベントのおみくじを実行する。
 */
export class EventPadProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()

  private timer: ReturnType<typeof setInterval> | null = null

  /** 購読の世代。stop / 再 start で進め、古い応答を無効にする */
  private session = 0

  /** 前回の取得が終わる前に、次を始めない */
  private running = false

  /** 最後に受け取った発火時刻。null = まだサーバーから基準を受け取っていない */
  private lastSeen: number | null = null

  /**
   * ポーリングを開始する。既にあれば、先に停止してからやり直す
   */
  startPads(): void {
    this.stopPads()
    const session = this.session

    void this.poll(session)
    this.timer = setInterval(() => void this.poll(session), PAD_POLL_INTERVAL_MS)
  }

  /**
   * ポーリングを停止する
   */
  stopPads(): void {
    this.session++
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    this.running = false
    this.lastSeen = null
  }

  /**
   * 1回ぶんの取得
   * - サーバーがない・つながらないときは、静かに無視して次の周期でもう一度試す
   * - lastSeen が未設定のときは since を付けずに問い合わせ、サーバーの最後の発火時刻を基準にする
   *   (OBS を開き直したときに、過去の発火を再生しないため)
   */
  private async poll(session: number): Promise<void> {
    if (this.running) return
    this.running = true
    try {
      const status = await padApi.loadStatus(this.lastSeen ?? undefined)
      if (session !== this.session) return

      const isBaseline = this.lastSeen === null
      // 二重発火しないよう、実行より先に lastSeen を更新する
      this.lastSeen = status.firedAt

      if (!isBaseline && status.hasNew && status.padId) {
        await this.fire(status.padId)
      }
    } catch {
      // サーバーがない (OBS のみで使っているなど) ときは何もしない
    } finally {
      if (session === this.session) this.running = false
    }
  }

  /**
   * padId に反応する、有効な pads イベントを order 順に実行して BotMessage をスケジュールする
   */
  private async fire(padId: PadIdType): Promise<void> {
    const events = Object.values(this.store.data.events.pads)
      .filter((rule) => rule.isEnabled && rule.trigger.padId === padId)
      .sort((a, b) => a.order - b.order)

    for (const event of events) {
      try {
        const messages = await this.omikujiProcessor.executeOmikuji(event.omikujiKey)
        this.store.scheduleBotMessages(messages)
      } catch (error) {
        console.error(`Pad ${event.key} execution error:`, error)
      }
    }
  }
}
