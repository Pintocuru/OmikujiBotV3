// src/editor/assets/mikuji/cooldown/useCooldownOverview.ts
import { computed } from 'vue'
import { eventCategory } from '@/types/OmikujiData'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { canCooldownBlock } from '@/generator/scripts/EventProcess/CooldownGate'

export type CooldownOverviewRow = {
  itemId: string
  itemName: string
  boxKey: string
  boxName: string
  cooldownSeconds: number
  /** このおみくじを(時間内に)止めうる、他のおみくじの件数 */
  blockedByCount: number
}

/**
 * 全おみくじのクールダウンを見渡すための集計。
 * 有効なイベントから使われているおみくじ箱の steps アイテムだけを対象にする(実行されないものは影響しない)。
 * 止められる件数は generator の判定式(canCooldownBlock)と共通。
 */
export function useCooldownOverview() {
  const { getEvents } = useGetEventData()
  const { getAsset } = useGetAssetData()

  const allRows = computed<CooldownOverviewRow[]>(() => {
    const boxKeys = new Set<string>()
    for (const category of eventCategory) {
      for (const event of getEvents(category)) {
        if (event.isEnabled !== false && event.omikujiKey) boxKeys.add(event.omikujiKey)
      }
    }

    const items: Omit<CooldownOverviewRow, 'blockedByCount'>[] = []
    for (const boxKey of boxKeys) {
      const box = getAsset('mikuji', boxKey)
      if (!box) continue
      for (const item of box.omikuji) {
        if (item.kind !== 'steps') continue
        items.push({
          itemId: item.id,
          itemName: item.name,
          boxKey,
          boxName: box.name,
          cooldownSeconds: item.cooldownSeconds ?? 0,
        })
      }
    }

    return items.map((x) => ({
      ...x,
      blockedByCount: items.filter(
        (y) => y.itemId !== x.itemId && canCooldownBlock(y.cooldownSeconds, x.cooldownSeconds)
      ).length,
    }))
  })

  // クールダウンを持つもの(値の大きい順)。0 / 未設定は他を止めないので一覧には出さない
  const withCooldown = computed(() =>
    allRows.value.filter((r) => r.cooldownSeconds !== 0).sort((a, b) => b.cooldownSeconds - a.cooldownSeconds)
  )
  const zeroCount = computed(() => allRows.value.length - withCooldown.value.length)

  return { withCooldown, zeroCount }
}
