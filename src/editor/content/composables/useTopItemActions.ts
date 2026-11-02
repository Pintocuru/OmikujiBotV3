// src/editor/content/composables/useTopItemActions.ts
// TOPページのアイテム操作(移動・複製・削除)。characters / events の重複処理をここにまとめる
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { CategoryType, EventCategoryType } from '@/types/OmikujiData'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

export function useTopItemActions() {
  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)
  const omikujiStore = useOmikujiStore()

  const goToItem = (category: CategoryType, key: string) => {
    navigationStore.selectCategory(category)
    navigationStore.selectItem(key)
  }

  // メニュー操作後にフォーカスを外して dropdown を閉じる
  const closeMenu = () => {
    ;(document.activeElement as HTMLElement)?.blur()
  }

  const duplicateWith = (duplicate: () => void) => {
    duplicate()
    swalToast.success({ title: t('navigation.menu.duplicateSuccess') })
    closeMenu()
  }

  const removeWith = async (key: string, name: string | undefined, remove: () => void) => {
    closeMenu()
    const label = name || t('navigation.unnamed')
    const result = await swalModal.confirmDelete({ title: t('navigation.menu.deleteConfirmTitle', { name: label }) })
    if (!result.isConfirmed) return
    remove()
    // 選択中のアイテムを消した場合は選択解除
    if (selectedItemKey.value === key) selectedItemKey.value = null
    swalToast.success({ title: t('navigation.menu.deleteSuccess', { name: label }) })
  }

  // characters
  const duplicateCharacter = (key: string) => duplicateWith(() => omikujiStore.duplicateAsset('characters', key))
  const removeCharacter = (key: string, name?: string) =>
    removeWith(key, name, () => omikujiStore.removeAsset('characters', key))

  // events
  const duplicateEventItem = (category: EventCategoryType, id: string) =>
    duplicateWith(() => omikujiStore.duplicateEvent(category, id))
  const removeEventItem = (category: EventCategoryType, id: string, name?: string) =>
    removeWith(id, name, () => omikujiStore.removeEvent(category, id))

  return { goToItem, duplicateCharacter, removeCharacter, duplicateEventItem, removeEventItem }
}
