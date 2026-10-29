// src/editor/parts/CharacterPicker/useIconPopup.ts
import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import type { CharacterItem } from './types'

const OPEN_DELAY = 500 // 最初のポップアップが出るまで
const SWITCH_DELAY = 150 // 既に開いている間の切替
const CLOSE_DELAY = 150 // ボタン → ポップアップへマウスを移す猶予
const POPUP_WIDTH = 520
const POPUP_GAP = 4
const POPUP_MIN_SPACE = 200

export const useIconPopup = (items: Ref<CharacterItem[]>, enabled: Ref<boolean>) => {
  const activeKey = ref<string | null>(null)
  const popupStyle = ref<Record<string, string>>({})
  const theme = ref<string | undefined>(undefined)
  const activeItem = computed(() => items.value.find((i) => i.key === activeKey.value) ?? null)

  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const keepOpen = () => clearTimeout(closeTimer)

  const closeNow = () => {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
    activeKey.value = null
  }

  const scheduleClose = () => {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
    closeTimer = setTimeout(() => (activeKey.value = null), CLOSE_DELAY)
  }

  const calcStyle = (rect: DOMRect): Record<string, string> => {
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - POPUP_WIDTH - 8))
    const base = { left: `${left}px`, maxWidth: `${POPUP_WIDTH}px` }
    const placeBelow = spaceBelow >= POPUP_MIN_SPACE || spaceBelow >= spaceAbove
    return placeBelow
      ? { ...base, top: `${rect.bottom + POPUP_GAP}px` }
      : { ...base, bottom: `${window.innerHeight - rect.top + POPUP_GAP}px` }
  }

  const scheduleOpen = (item: CharacterItem, ev: Event) => {
    clearTimeout(closeTimer)
    // 無効 or 表情が 1 つだけなら出さない
    if (!enabled.value || item.icons.length <= 1) {
      clearTimeout(openTimer)
      if (activeKey.value) scheduleClose()
      return
    }
    if (activeKey.value === item.key) return

    const el = ev.currentTarget as HTMLElement
    clearTimeout(openTimer)
    openTimer = setTimeout(
      () => {
        popupStyle.value = calcStyle(el.getBoundingClientRect())
        // Teleport 先では data-theme が届かないので、元の位置のテーマを引き継ぐ
        theme.value =
          el.closest('[data-theme]')?.getAttribute('data-theme') ??
          document.documentElement.getAttribute('data-theme') ??
          undefined
        activeKey.value = item.key
      },
      activeKey.value ? SWITCH_DELAY : OPEN_DELAY
    )
  }

  // スクロール/リサイズで位置がずれるので閉じる (ポップアップ内スクロールは除外)
  const onScroll = (e: Event) => {
    if ((e.target as HTMLElement | null)?.closest?.('[role="listbox"]')) return
    closeNow()
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', closeNow)
  })
  onBeforeUnmount(() => {
    closeNow()
    window.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('resize', closeNow)
  })

  return { activeItem, popupStyle, theme, scheduleOpen, scheduleClose, keepOpen, closeNow }
}
