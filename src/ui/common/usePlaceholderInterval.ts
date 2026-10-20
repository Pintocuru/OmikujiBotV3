// src/MainGenerator/ui/common/usePlaceholderInterval.ts
import { ContentPlaceholder } from '@/engine/ContentPlaceholder/processor'
import { useAppStore } from '@/generator/stores/useAppStore'
import { DefaultPlaceholdersMetaSchema } from '@/types/engine'
import { ref, onMounted, onUnmounted } from 'vue'

export function usePlaceholderInterval(templateRef: () => string, intervalMs = 30000) {
  const { resolveComment } = usePlaceholderResolver()

  const getTemplates = (): string[] => {
    const t = templateRef()
    return Array.isArray(t) ? t : [t ?? '']
  }

  const generateOne = (): string => {
    const list = getTemplates()
    const picked = list[Math.floor(Math.random() * list.length)] ?? ''
    return resolveComment(picked)
  }

  const message = ref(generateOne())
  const pending = ref<string | null>(null)

  function commitIfPending(isShowingDefault: boolean) {
    if (pending.value !== null && isShowingDefault) {
      message.value = pending.value
      pending.value = null
    }
  }

  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    interval = setInterval(() => {
      // 直接更新
      pending.value = generateOne()

      _onInterval()
    }, intervalMs)
  })

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  })

  let _onInterval: () => void = () => undefined

  function registerIntervalHook(fn: () => void) {
    _onInterval = fn
  }

  return {
    message,
    commitIfPending,
    registerIntervalHook,
  }
}

function usePlaceholderResolver() {
  const appStore = useAppStore()

  const resolveComment = (raw: string): string => {
    const meta = appStore.serviceMetaStore.getCurrent()
    const uniqueCount = appStore.userStats.getUniqueCount()
    const { liveComments, syoken } = appStore.streamStats.getStats()
    const draw = appStore.userStats.drawWinners()

    const base = DefaultPlaceholdersMetaSchema.parse({
      viewer: meta?.viewer ?? 0,
      upVote: meta?.upVote ?? 0,
      follower: meta?.follower ?? 0,
      lc: liveComments,
      commenter: uniqueCount,
      syoken: syoken,
      winner: draw.winners[0]?.userName ?? '名無し',
    })

    const cp = new ContentPlaceholder(appStore.data.assets.placeholders)
    cp.updateResolvedValues(base)

    return cp.processText(raw)
  }

  return { resolveComment }
}
