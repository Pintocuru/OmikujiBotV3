// src/generator/scripts/EventProcess/ServiceProcessor.ts
import { OmikujiProcessor } from '@/generator/scripts/EventProcess/OmikujiProcessor'
import { evaluateServiceTrigger, isStateTrigger } from './ServiceTriggerEvaluator'
import { MetaUpdateEvent } from '@/types/generator'
import type { ServiceTriggerType } from '@/types/OmikujiData/'
import { useAppStore } from '@/generator/stores/useAppStore'
import { describeError, showErrorNotice } from '@/generator/scripts/Notice/showNotice'

/**
 * 配信数値イベントの実行を管理
 */
export class EventServiceProcessor {
  private store = useAppStore()
  private readonly omikujiProcessor = new OmikujiProcessor()
  private unsubscribe: (() => void) | null = null
  // 購読開始時点の値を記録（初回イベントのpreviousとして使用）
  private lastUpVote: number | null = null
  private lastViewer: number | null = null
  // 「今その状態か」で判定するイベントの、前回の判定結果(イベントの key → 満たしていたか)
  // 初回の判定は基準として記録するだけで発火しない(配信中にジェネレーターを開き直したとき、すぐ発火しないため)
  private readonly lastMatched = new Map<string, boolean>()

  /**
   * イベント監視を開始
   */
  startServices(): void {
    this.stopServices()

    // 購読開始時点の値をスナップショットとして保存
    const snapshot = this.store.serviceMetaStore.getCurrent()
    this.lastUpVote = snapshot?.upVote ?? null
    this.lastViewer = snapshot?.viewer ?? null
    this.lastMatched.clear()

    // 購読の開始
    this.unsubscribe = this.store.serviceMetaStore.subscribe((event) => {
      this.processMetaRules(event).catch((error) => {
        console.error('[EventServiceProcessor] 配信数値イベントの処理エラー:', error)
        showErrorNotice(`配信数値イベントの処理エラー: ${describeError(error)}`)
      })
    })
  }

  /**
   * イベント監視を停止
   */
  stopServices(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    this.lastUpVote = null
    this.lastViewer = null
    this.lastMatched.clear()
  }

  /**
   * メタデータ更新時の処理
   */
  private async processMetaRules(event: MetaUpdateEvent): Promise<void> {
    const resolvedEvent: MetaUpdateEvent =
      event.previous === null && (this.lastUpVote !== null || this.lastViewer !== null)
        ? {
            ...event,
            previous: {
              isLive: event.current.isLive,
              upVote: this.lastUpVote ?? event.current.upVote,
              viewer: this.lastViewer ?? event.current.viewer,
              follower: event.current.follower,
              startTime: event.current.startTime,
            },
          }
        : event

    const enabledEvents = Object.values(this.store.data.events.services)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)

    // 先に全イベントを判定し(判定は同期)、そのあとで順に実行する
    const firedEvents = enabledEvents.filter((rule) => this.shouldFire(rule.key, rule.trigger, resolvedEvent))

    for (const rule of firedEvents) {
      // 1 件の失敗で、残りのイベントを止めない
      try {
        const messages = await this.omikujiProcessor.executeOmikuji(rule.mikujiKey)
        this.store.scheduleBotMessages(messages)
      } catch (error) {
        console.error(`[EventServiceProcessor] "${rule.name}" の実行エラー:`, error)
        showErrorNotice(`配信数値イベント「${rule.name}」の実行エラー: ${describeError(error)}`)
      }
    }
  }

  /**
   * 発火するか
   * 条件を満たしている間ずっと true になるトリガーは、満たした瞬間(false → true)だけ発火する
   */
  private shouldFire(key: string, trigger: ServiceTriggerType, event: MetaUpdateEvent): boolean {
    const matched = evaluateServiceTrigger(trigger, event)
    if (!isStateTrigger(trigger)) return matched

    const wasMatched = this.lastMatched.get(key)
    this.lastMatched.set(key, matched)
    return matched && wasMatched === false
  }
}
