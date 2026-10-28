// src/console/composables/usePadsConsole.ts
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { padApi } from '@/manager/services/padApi'
import { ConnectionError } from '@/manager/services/baseApiClient'
import { padGridSize, padIds, padLayouts, type PadIdType, type PadLayoutType } from '@/types/OmikujiData'
import { ConsoleStatus } from '@/console/types'

const STORAGE_KEY = 'liveConsole.padLayout'
const FLASH_MS = 250

const isPadLayout = (value: unknown): value is PadLayoutType => (padLayouts as readonly unknown[]).includes(value)

/** 前回選んだボタン構成 (Chrome の localStorage。読めないときは 4個) */
const loadLayout = (): PadLayoutType => {
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY))
    return isPadLayout(saved) ? saved : 4
  } catch {
    return 4
  }
}

/**
 * ポン出し画面のデータ
 * - layout: ボタン構成 (4 / 9 / 16個)。CSS Grid の列数は gridSize から決める
 * - press: ボタンが押されたことをサーバーに送る。OBS (Generator) が 0.5秒ごとのポーリングで受け取って発火する
 */
export function usePadsConsole() {
  const layout = ref<PadLayoutType>(loadLayout())
  const status = ref<ConsoleStatus>('online')
  const errorMessage = ref('')
  const lastPressed = ref<{ padId: PadIdType; firedAt: number } | null>(null)
  const flashingPadId = ref<PadIdType | null>(null)

  const gridSize = computed(() => padGridSize[layout.value])
  const pads = computed<readonly PadIdType[]>(() => padIds.slice(0, layout.value))

  watch(layout, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      // 保存できなくても、画面は使える
    }
  })

  let flashTimer: ReturnType<typeof setTimeout> | undefined

  const press = async (padId: PadIdType) => {
    flashingPadId.value = padId
    if (flashTimer) clearTimeout(flashTimer)
    flashTimer = setTimeout(() => (flashingPadId.value = null), FLASH_MS)

    try {
      lastPressed.value = await padApi.trigger(padId)
      status.value = 'online'
      errorMessage.value = ''
    } catch (error) {
      if (error instanceof ConnectionError) {
        status.value = 'offline'
        errorMessage.value = ''
      } else {
        status.value = 'error'
        errorMessage.value = error instanceof Error ? error.message : String(error)
      }
    }
  }

  onBeforeUnmount(() => {
    if (flashTimer) clearTimeout(flashTimer)
  })

  return { layout, gridSize, pads, status, errorMessage, lastPressed, flashingPadId, press }
}
