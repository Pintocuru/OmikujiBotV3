// src/editor/apps/cooldown/useCooldownOverview.ts
import { computed } from 'vue'
import { eventCategory } from '@/types/OmikujiData'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { canCooldownBlock } from '@/generator/scripts/EventProcess/CooldownGate'
import type { LinkItem } from '@/editor/content/connections/types'

/** このおみくじを使うイベント1件(無効かどうかも持つ) */
export type CooldownEvent = { link: LinkItem; isEnabled: boolean }

/** 止める / 止められる相手の最小限の情報 */
export type CooldownPeer = { itemId: string; itemName: string; boxKey: string; cooldownSeconds: number }

export type CooldownOverviewRow = CooldownPeer & {
  boxName: string
  /** このおみくじ(が入っているおみくじ箱)を使うイベント。無効なものも含む */
  events: CooldownEvent[]
  /** 有効なイベントから使われているか。false(無効なイベントからしか使われない)なら、止める側・止められる側の計算に含めない */
  isActive: boolean
  /** このおみくじを(時間内に)止めうる、他のおみくじ */
  blockedBy: CooldownPeer[]
  /** このおみくじが(時間内に)止めうる、他のおみくじ */
  blocks: CooldownPeer[]
}

/**
 * 全おみくじのクールダウンを見渡すための集計と、値の更新。
 * イベントから使われているおみくじ箱の steps アイテムが対象(どのイベントからも使われないものは「使われていないアイテム」で扱う)。
 * 無効なイベントからだけ使われるものも一覧には出すが、止める・止められるの計算には含めない(有効にしたときに調整できるように)。
 * 止める・止められるの判定式は generator(canCooldownBlock)と共通。
 */
export function useCooldownOverview() {
  const { updateAsset } = useOmikujiStore()
  const { getEvents } = useGetEventData()
  const { getAsset } = useGetAssetData()

  const rows = computed<CooldownOverviewRow[]>(() => {
    // おみくじ箱 → それを使うイベント
    const eventsOfBox = new Map<string, CooldownEvent[]>()
    for (const category of eventCategory) {
      for (const event of getEvents(category)) {
        if (!event.omikujiKey) continue
        const list = eventsOfBox.get(event.omikujiKey) ?? []
        list.push({ link: { category, key: event.id, name: event.name }, isEnabled: event.isEnabled !== false })
        eventsOfBox.set(event.omikujiKey, list)
      }
    }

    const items: Omit<CooldownOverviewRow, 'blockedBy' | 'blocks'>[] = []
    for (const [boxKey, events] of eventsOfBox) {
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
          events,
          isActive: events.some((event) => event.isEnabled),
        })
      }
    }

    const active = items.filter((item) => item.isActive)
    const toPeer = ({ itemId, itemName, boxKey, cooldownSeconds }: CooldownPeer): CooldownPeer => ({
      itemId,
      itemName,
      boxKey,
      cooldownSeconds,
    })

    return items
      .map((x) => ({
        ...x,
        blockedBy: x.isActive
          ? active
              .filter((y) => y.itemId !== x.itemId && canCooldownBlock(y.cooldownSeconds, x.cooldownSeconds))
              .map(toPeer)
          : [],
        blocks: x.isActive
          ? active
              .filter((y) => y.itemId !== x.itemId && canCooldownBlock(x.cooldownSeconds, y.cooldownSeconds))
              .map(toPeer)
          : [],
      }))
      .sort((a, b) => b.cooldownSeconds - a.cooldownSeconds || a.boxName.localeCompare(b.boxName))
  })

  /** クールダウンを更新する(空欄・数値でない入力は 0。おみくじの編集画面の入力欄と同じ扱い) */
  const updateCooldown = (row: CooldownPeer, value: string) => {
    const box = getAsset('mikuji', row.boxKey)
    if (!box) return
    const num = parseFloat(value)
    const cooldownSeconds = isNaN(num) ? 0 : num
    updateAsset('mikuji', row.boxKey, {
      ...box,
      omikuji: box.omikuji.map((item) =>
        item.id === row.itemId && item.kind === 'steps' ? { ...item, cooldownSeconds } : item
      ),
    })
  }

  return { rows, updateCooldown }
}
