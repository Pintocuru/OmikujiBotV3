// src/editor/assets/mikuji/composables/useBoxOmikujiList.ts
import { computed, watch, type Ref } from 'vue'
import { OmikujiItemSchema, type MikujiBoxType, type OmikujiItemType } from '@/types/OmikujiData/'
import { generateId } from '@/types/core'
import { calcOmikujiPercentages } from '@/engine/DrawOmikuji/DrawOmikuji'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useMikujiSelectionStore } from '@/editor/stores/useMikujiSelectionStore'

export function useBoxOmikujiList(omikujiKey: Ref<string | null>) {
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  const box = computed<MikujiBoxType | null>(() =>
    omikujiKey.value ? (getAsset('mikuji', omikujiKey.value) ?? null) : null
  )
  const omikujiList = computed<OmikujiItemType[]>(() => box.value?.omikuji ?? [])

  // 各行の出現確率(表示用)。優先アイテムは抽選外なので null
  const percentages = computed<(string | null)[]>(() =>
    calcOmikujiPercentages(omikujiList.value).map((p) => (p === null ? null : String(p)))
  )

  const commit = (omikuji: OmikujiItemType[]) => {
    if (!box.value || !omikujiKey.value) return
    updateAsset('mikuji', omikujiKey.value, { ...box.value, omikuji })
  }

  // 選択状態はサイドバーと共有するため、BOXキーごとにストアへ置く
  const selection = useMikujiSelectionStore()
  const selectedId = computed<string | null>({
    get: () => (omikujiKey.value ? (selection.selectedIdByBox[omikujiKey.value] ?? null) : null),
    set: (id) => {
      if (omikujiKey.value) selection.selectedIdByBox[omikujiKey.value] = id
    },
  })

  const selectedIndex = computed(() => {
    if (!selectedId.value) return null
    const i = omikujiList.value.findIndex((v) => v.id === selectedId.value)
    return i === -1 ? null : i
  })

  const selectedItem = computed(() => (selectedIndex.value === null ? null : omikujiList.value[selectedIndex.value]))

  // BOXが切り替わったとき、選択が無効(未選択・削除済み)なら先頭へ
  watch(
    omikujiKey,
    () => {
      if (!omikujiList.value.some((v) => v.id === selectedId.value)) {
        selectedId.value = omikujiList.value[0]?.id ?? null
      }
    },
    { immediate: true }
  )

  // 削除などで選択中が消えたら先頭へ
  watch(omikujiList, (list) => {
    if (selectedId.value && !list.some((v) => v.id === selectedId.value)) {
      selectedId.value = list[0]?.id ?? null
    }
  })

  const replaceAll = (omikuji: OmikujiItemType[]) => commit(omikuji)

  const updateItem = (index: number, item: OmikujiItemType) =>
    commit(omikujiList.value.map((v, i) => (i === index ? item : v)))

  const setWeight = (index: number, weight: number) => {
    const item = omikujiList.value[index]
    if (item) updateItem(index, { ...item, lottery: { ...item.lottery, weight } })
  }

  const updateSelected = (updated: OmikujiItemType) => {
    if (selectedIndex.value !== null) updateItem(selectedIndex.value, updated)
  }

  const add = () => {
    if (!box.value) return
    const created = OmikujiItemSchema.parse({})
    commit([...omikujiList.value, created])
    selectedId.value = created.id
  }

  const duplicate = (index: number) => {
    const src = omikujiList.value[index]
    if (!src) return
    const id = generateId()
    // JSON.parse(JSON.stringify(src)) で Proxy やリアクティブ参照を完全に除去してディープコピー
    const copy: OmikujiItemType = { ...JSON.parse(JSON.stringify(src)), id, key: id, name: `${src.name}(コピー)` }
    const next = [...omikujiList.value]
    next.splice(index + 1, 0, copy)
    commit(next)
  }

  const remove = (index: number) => commit(omikujiList.value.filter((_, i) => i !== index))

  return {
    omikujiList,
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
