// src/editor/assets/mikuji/composables/useBoxOmikujiList.ts
import { computed, watch, type Ref } from 'vue'
import { OmikujiItemSchema, type MikujiBoxType, type OmikujiItemType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useMikujiSelectionStore } from '@/editor/stores/useMikujiSelectionStore'
import { updateItemWeight } from './useOmikujiWeight'

export function useBoxOmikujiList(omikujiKey: Ref<string | null>) {
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  const box = computed<MikujiBoxType | null>(() =>
    omikujiKey.value ? (getAsset('mikuji', omikujiKey.value) ?? null) : null
  )
  const omikujiList = computed<OmikujiItemType[]>(() => box.value?.omikuji ?? [])

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

  const setWeight = ({ index, weight }: { index: number; weight: number }) =>
    commit(updateItemWeight(omikujiList.value, index, weight))

  const updateSelected = (updated: OmikujiItemType) => {
    if (selectedIndex.value === null) return
    const next = [...omikujiList.value]
    next[selectedIndex.value] = updated
    commit(next)
  }

  const add = () => {
    if (!box.value) return
    const created = OmikujiItemSchema.parse({})
    commit([...omikujiList.value, created])
    selectedId.value = created.id
  }

  return { omikujiList, selectedId, selectedIndex, selectedItem, replaceAll, setWeight, updateSelected, add }
}
