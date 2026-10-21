// src/editor/apps/navigation/composables/useSidebarPreset.ts
import { useI18n } from 'vue-i18n'
import { AssetCategoryType, DataCategoryType, EventCategoryType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { getPresets, PresetDefinition } from '@/editor/presets'
import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

/**
 * サイドバーからのプリセット追加
 * assets(みくじ箱など) → events の順に追加し、events の omikujiKey 参照を成立させる
 */
export const useSidebarPreset = () => {
  const { t } = useI18n()
  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()
  const { isEventCategory } = useGetEventData()

  const presetKey = (category: DataCategoryType, id: string) => `presets.${category}.${id}`
  const presetLabel = (preset: PresetDefinition) => t(`${presetKey(preset.category, preset.id)}.label`)
  const presetDescription = (preset: PresetDefinition) => t(`${presetKey(preset.category, preset.id)}.description`)

  /** そのカテゴリで使えるプリセット(無ければメニュー自体を出さない) */
  const presetsOf = (category: DataCategoryType) => getPresets(category)

  /** プリセットを追加 → 先頭に作ったデータを選択 */
  const addPreset = (preset: PresetDefinition): string | null => {
    const result = preset.build()
    let selectKey: string | null = null

    // 1. assets
    for (const [assetCategory, items] of Object.entries(result.assets ?? {})) {
      for (const item of items ?? []) {
        const key = omikujiStore.addAsset(assetCategory as AssetCategoryType, item as never)
        selectKey ??= key
      }
    }

    // 2. events
    if (isEventCategory(preset.category) && result.events) {
      const category: EventCategoryType = preset.category
      const newIds = (result.events as never[]).map((ev) => omikujiStore.addEvent(category, ev))

      if (result.eventsToTop) {
        const restIds = omikujiStore.data.events[category].map((e) => e.id).filter((id) => !newIds.includes(id))
        omikujiStore.reorderEvents(category, [...newIds, ...restIds])
      }
      selectKey = newIds[0] ?? selectKey
    }

    if (!selectKey) return null
    navigationStore.selectItem(selectKey, 'baseSettings')
    swalToast.success({ title: t('navigation.preset.success', { name: presetLabel(preset) }) })
    return selectKey
  }

  return { presetsOf, presetLabel, presetDescription, addPreset }
}
