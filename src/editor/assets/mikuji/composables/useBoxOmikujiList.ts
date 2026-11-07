// src/editor/assets/mikuji/composables/useBoxOmikujiList.ts
import { computed, watch, type Ref } from 'vue'
import { OmikujiItemSchema, type MikujiBoxType, type OmikujiItemType } from '@/types/OmikujiData/'
import { generateId } from '@/types/core'
import { calcOmikujiPercentages } from '@/engine/DrawOmikuji/DrawOmikuji'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useMikujiSelectionStore } from '@/editor/stores/useMikujiSelectionStore'

export function useBoxOmikujiList(mikujiKey: Ref<string | null>) {
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  const mikuji = computed<MikujiBoxType | null>(() =>
    mikujiKey.value ? (getAsset('mikuji', mikujiKey.value) ?? null) : null
  )
  const omikujiItem = computed<OmikujiItemType[]>(() => mikuji.value?.omikuji ?? [])

  // 各行の出現確率(表示用)。優先アイテムは抽選外なので null
  const percentages = computed<(string | null)[]>(() =>
    calcOmikujiPercentages(omikujiItem.value).map((p) => (p === null ? null : String(p)))
  )

  const commit = (omikuji: OmikujiItemType[]) => {
    if (!mikuji.value || !mikujiKey.value) return
    updateAsset('mikuji', mikujiKey.value, { ...mikuji.value, omikuji })
  }

  // 選択状態はサイドバーと共有するため、BOXキーごとにストアへ置く
  const selection = useMikujiSelectionStore()
  const selectedId = computed<string | null>({
    get: () => (mikujiKey.value ? (selection.selectedIdByBox[mikujiKey.value] ?? null) : null),
    set: (id) => {
      if (mikujiKey.value) selection.selectedIdByBox[mikujiKey.value] = id
    },
  })

  const selectedIndex = computed(() => {
    if (!selectedId.value) return null
    const i = omikujiItem.value.findIndex((v) => v.id === selectedId.value)
    return i === -1 ? null : i
  })

  const selectedItem = computed(() => (selectedIndex.value === null ? null : omikujiItem.value[selectedIndex.value]))

  // BOXが切り替わったとき、選択が無効(未選択・削除済み)なら先頭へ
  watch(
    mikujiKey,
    () => {
      if (!omikujiItem.value.some((v) => v.id === selectedId.value)) {
        selectedId.value = omikujiItem.value[0]?.id ?? null
      }
    },
    { immediate: true }
  )

  // 削除などで選択中が消えたら先頭へ
  watch(omikujiItem, (list) => {
    if (selectedId.value && !list.some((v) => v.id === selectedId.value)) {
      selectedId.value = list[0]?.id ?? null
    }
  })

  const replaceAll = (omikuji: OmikujiItemType[]) => commit(omikuji)

  const updateItem = (index: number, item: OmikujiItemType) =>
    commit(omikujiItem.value.map((v, i) => (i === index ? item : v)))

  const setWeight = (index: number, weight: number) => {
    const item = omikujiItem.value[index]
    if (item) updateItem(index, { ...item, lottery: { ...item.lottery, weight } })
  }

  const updateSelected = (updated: OmikujiItemType) => {
    if (selectedIndex.value !== null) updateItem(selectedIndex.value, updated)
  }

  const add = () => {
    if (!mikuji.value) return
    const created = OmikujiItemSchema.parse({})
    commit([...omikujiItem.value, created])
    selectedId.value = created.id
  }

  const duplicate = (index: number) => {
    const src = omikujiItem.value[index]
    if (!src) return
    const id = generateId()
    // JSON.parse(JSON.stringify(src)) で Proxy やリアクティブ参照を完全に除去してディープコピー
    const copy: OmikujiItemType = { ...JSON.parse(JSON.stringify(src)), id, key: id, name: `${src.name}(コピー)` }
    const next = [...omikujiItem.value]
    next.splice(index + 1, 0, copy)
    commit(next)
  }

  const remove = (index: number) => commit(omikujiItem.value.filter((_, i) => i !== index))

  return {
    mikuji,
    omikujiItem,
    percentages,
    selectedId,
    selectedIndex,
    selectedItem,
    replaceAll,
    updateItem,
    setWeight,
    updateSelected,
    add,
    duplicate,
    remove,
  }
}
