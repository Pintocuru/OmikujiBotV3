// src/editor/assets/box/composables/useBoxOmikujiList.ts
import { computed, ref, watch, type Ref } from 'vue'
import { OmikujiItemSchema, type BoxType, type OmikujiItemType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { updateItemWeight } from './useOmikujiWeight'

export function useBoxOmikujiList(omikujiKey: Ref<string | null>) {
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  const box = computed<BoxType | null>(() => (omikujiKey.value ? (getAsset('box', omikujiKey.value) ?? null) : null))
  const omikujiList = computed<OmikujiItemType[]>(() => box.value?.omikuji ?? [])

  const commit = (omikuji: OmikujiItemType[]) => {
    if (!box.value || !omikujiKey.value) return
    updateAsset('box', omikujiKey.value, { ...box.value, omikuji })
  }

  const selectedId = ref<string | null>(null)

  const selectedIndex = computed(() => {
    if (!selectedId.value) return null
    const i = omikujiList.value.findIndex((v) => v.id === selectedId.value)
    return i === -1 ? null : i
  })

  const selectedItem = computed(() => (selectedIndex.value === null ? null : omikujiList.value[selectedIndex.value]))

  watch(omikujiKey, () => (selectedId.value = omikujiList.value[0]?.id ?? null), { immediate: true })

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

  return { box, omikujiList, selectedId, selectedIndex, selectedItem, replaceAll, setWeight, updateSelected, add }
}
