// src/generator/scripts/EventProcess/ReactionProcessor.ts
import { useAppStore } from '@/generator/stores/useAppStore'
import { evaluateReactionTrigger, getTargetTotal } from '@/generator/scripts/EventProcess/ReactionTriggerEvaluator'
import { GetReactions, unsubscribeReactions } from '@/sdk/subscribe/GetReactions'
import { OmikujiProcessor } from '@/generator/scripts/EventProcess/OmikujiProcessor'
import { BURST_DECAY_MS } from '@/generator/GeneratorConstants'
import { describeError, showErrorNotice } from '@/generator/scripts/Notice/showNotice'

export class EventReactionProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()

  /** 購読の世代。stop / 再 start で進め、古い購読のコールバックを無効にする */
  private session = 0

  /** デケイタイマーのID。null = 未起動 */
  private decayTimer: ReturnType<typeof setTimeout> | null = null

  /** 前回の評価時点での、ルールごとの対象リアクションの累計(イベントの key → 累計) */
  private readonly lastTotals = new Map<string, number>()

  /**
   * リアクション購読を開始する。
   * 既存の購読があれば先に停止してからリスタートする。
   */
  startReactions(): void {
    this.stopReactions()
    const session = this.session

    GetReactions((aggregated) => {
      // 停止後(または再起動後)に届いた古い購読のコールバックは無視
      if (session !== this.session) return
      // リアクション集計を記録し、ルール評価とデケイタイマーをリセット
      this.store.reactionStats.record(aggregated)
      this.evaluateReactionRules().catch((error) => {
        console.error('[EventReactionProcessor] リアクションイベントの処理エラー:', error)
        showErrorNotice(`リアクションイベントの処理エラー: ${describeError(error)}`)
      })
      this._restartDecayTimer()
    })
      .then((ok) => {
        if (!ok) {
          console.error('Reaction購読失敗')
          showErrorNotice('リアクションの購読に失敗しました')
        }
      })
      .catch((error) => {
        console.error('Reaction購読失敗', error)
        showErrorNotice(`リアクションの購読に失敗しました: ${describeError(error)}`)
      })
  }

  /**
   * リアクション購読を停止し、統計をリセットする。
   */
  stopReactions(): void {
    this.session++
    unsubscribeReactions()
    this._clearDecayTimer()
    this.store.reactionStats.reset()
    this.lastTotals.clear()
  }

  /**
   * 有効なリアクションルールをorder順に評価し、
   * トリガー条件を満たしたルールのおみくじを実行してBotMessageをスケジュールする。
   */
  private async evaluateReactionRules(): Promise<void> {
    const enabledEvents = Object.values(this.store.data.events.reactions)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    // 先に全ルールを判定し(判定は同期)、そのあとで順に実行する
    const stats = this.store.reactionStats
    const firedEvents = enabledEvents.filter((rule) => {
      const total = getTargetTotal(rule.trigger, stats)
      const previousTotal = this.lastTotals.get(rule.key) ?? 0
      this.lastTotals.set(rule.key, total)
      return evaluateReactionTrigger(rule.trigger, stats, previousTotal)
    })

    for (const rule of firedEvents) {
      // 1 件の失敗で、残りのルールを止めない
      try {
        const messages = await this.omikujiProcessor.executeOmikuji(rule.mikujiKey)
        this.store.scheduleBotMessages(messages)
      } catch (error) {
        console.error(`[EventReactionProcessor] "${rule.name}" の実行エラー:`, error)
        showErrorNotice(`リアクションイベント「${rule.name}」の実行エラー: ${describeError(error)}`)
      }
    }
  }

  /**
   * デケイタイマーをリセットして再起動する。
   * バーストレベルが0の場合は起動しない。
   * タイムアウト後にレベルを1下げ、まだ残っていれば再帰的に再起動する。
   */
  private _restartDecayTimer(): void {
    this._clearDecayTimer()

    if (this.store.reactionStats.getBurstState().level === 0) return

    this.decayTimer = setTimeout(() => {
      const newLevel = this.store.reactionStats.decrementBurstLevel()
      if (newLevel > 0) {
        this._restartDecayTimer()
      } else {
        this.decayTimer = null
      }
    }, BURST_DECAY_MS)
  }

  /**
   * デケイタイマーが起動中であればキャンセルする。
   */
  private _clearDecayTimer(): void {
    if (this.decayTimer !== null) {
      clearTimeout(this.decayTimer)
      this.decayTimer = null
    }
  }
}
