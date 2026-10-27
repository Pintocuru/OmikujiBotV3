// src/editor/helpers/KeyEditor/composables/useKeyEditor.ts
import { ref, computed, readonly, watch } from 'vue'
import { validateKey as validateKeyUtil } from './keyEditorValidation'
import { updateStrategies } from './keyUpdateStrategies'
import { CharacterUsage, UpdateResult } from '../types'
import { eventCategory, AssetCategoryType } from '@/types/OmikujiData'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import i18n from '@/editor/i18n'

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

export function useKeyEditor() {
  const { getEvents } = useGetEventData()
  const { getAsset, getAssets } = useGetAssetData()

  // ダイアログの状態
  const isDialogOpen = ref(false)
  const currentCategory = ref<AssetCategoryType>('mikuji')
  const currentKey = ref('') // 編集前の Key
  const newKey = ref('')
  const errorMessage = ref('')
  const characterUsage = ref<CharacterUsage | null>(null)

  const hasError = computed(() => errorMessage.value !== '')
  const dialogTitle = computed(() => t('keyEditor.title', { category: t(`categories.${currentCategory.value}.label`) }))
  const canSave = computed(
    () => !hasError.value && newKey.value.trim() !== '' && newKey.value.trim() !== currentKey.value
  )

  // 入力に追従して検証（ダイアログを閉じるときのリセットでは動かさない）
  watch(newKey, (key) => {
    if (!isDialogOpen.value) return
    errorMessage.value = validateKeyUtil(key, Object.keys(getAssets(currentCategory.value)), currentKey.value)
  })

  /**
   * キャラクター使用箇所の取得
   * event → omikujiKey → mikuji → postFlow の message を辿る
   */
  function getCharacterUsage(characterKey: string): CharacterUsage {
    const usage: CharacterUsage = { comments: [], timers: [], services: [], reactions: [] }

    eventCategory.forEach((category) => {
      getEvents(category).forEach((event) => {
        const box = getAsset('mikuji', event.omikujiKey)
        if (!box) return

        const hasUsage = box.omikuji.some(
          (item) =>
            item.kind === 'postFlow' &&
            item.postFlows.some(
              (flow) => (flow.kind === 'message' || flow.kind === 'gameScript') && flow.characterKey === characterKey
            )
        )

        if (hasUsage) usage[category].push(event.id)
      })
    })

    return usage
  }

  function executeKeyUpdate(oldKey: string, rawNewKey: string, category: AssetCategoryType): UpdateResult {
    const trimmedNewKey = rawNewKey.trim()
    const strategy = updateStrategies[category]

    if (!strategy) return { success: false, error: t('keyEditor.errors.unsupported') }

    try {
      const success = strategy.updateKey(oldKey, trimmedNewKey)
      if (success) strategy.updateReferences?.(oldKey, trimmedNewKey)
      return success ? { success: true } : { success: false, error: t('keyEditor.errors.failed') }
    } catch (error) {
      console.error('Key更新エラー:', error)
      return { success: false, error: t('keyEditor.errors.exception') }
    }
  }

  function openDialog(key: string, category: AssetCategoryType): void {
    currentCategory.value = category
    currentKey.value = key
    newKey.value = key
    errorMessage.value = ''
    characterUsage.value = category === 'characters' ? getCharacterUsage(key) : null
    isDialogOpen.value = true
  }

  function closeDialog(): void {
    isDialogOpen.value = false
    newKey.value = ''
    errorMessage.value = ''
    characterUsage.value = null
  }

  function saveKey(): boolean {
    if (!canSave.value) return false

    const result = executeKeyUpdate(currentKey.value, newKey.value, currentCategory.value)

    if (result.success) {
      closeDialog()
      return true
    }
    errorMessage.value = result.error || t('keyEditor.errors.failed')
    return false
  }

  return {
    isDialogOpen: readonly(isDialogOpen),
    currentCategory: readonly(currentCategory),
    currentKey: readonly(currentKey),
    newKey,
    errorMessage: readonly(errorMessage),
    characterUsage: readonly(characterUsage),
    hasError,
    canSave,
    dialogTitle,
    openDialog,
    closeDialog,
    saveKey,
  }
}
