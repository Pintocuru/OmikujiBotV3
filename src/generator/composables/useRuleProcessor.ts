// src/generator/composables/useRuleProcessor.ts
import { watch, onUnmounted } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'
import { EventTimerProcessor } from '@/generator/scripts/EventProcess/TimerProcessor'
import { EventServiceProcessor } from '@/generator/scripts/EventProcess/ServiceProcessor'
import { EventReactionProcessor } from '../scripts/EventProcess/ReactionProcessor'
import { EventPadProcessor } from '@/generator/scripts/EventProcess/PadProcessor'

export function useRuleProcessor() {
  const appStore = useAppStore()

  let processor: ReturnType<typeof createRuleProcessor> | null = null

  watch(
    () => appStore.status,
    (status) => {
      if (status !== 'ready') return

      // Vite の HMR で残っているなら稼働前にストップ
      if (processor) {
        processor.timer.stop()
        processor.service.stop()
        processor.reaction.stop()
        processor.pad.stop()
      }
      console.log('🔄 RuleProcessor起動')

      processor = createRuleProcessor()

      console.log('▶️ タイマーイベント起動')
      processor.timer.start()

      console.log('▶️ サービスメタイベント起動')
      processor.service.start()
      console.log('▶️ リアクションイベント起動')
      processor.reaction.start()
      console.log('▶️ ポン出しイベント起動')
      processor.pad.start()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (!processor) return
    console.log('🛑 RuleProcessor停止 (unmount)')
    processor.timer.stop()
    processor.service.stop()
    processor.reaction.stop()
    processor.pad.stop()
  })
}

/**
 * RuleProcessorファクトリー
 */
function createRuleProcessor() {
  const timer = new EventTimerProcessor()
  const service = new EventServiceProcessor()
  const reaction = new EventReactionProcessor()
  const pad = new EventPadProcessor()

  return {
    timer: {
      start: timer.startTimers.bind(timer),
      stop: timer.stopTimers.bind(timer),
    },
    service: {
      start: service.startServices.bind(service),
      stop: service.stopServices.bind(service),
    },
    reaction: {
      start: reaction.startReactions.bind(reaction),
      stop: reaction.stopReactions.bind(reaction),
    },
    pad: {
      start: pad.startPads.bind(pad),
      stop: pad.stopPads.bind(pad),
    },
  }
}
