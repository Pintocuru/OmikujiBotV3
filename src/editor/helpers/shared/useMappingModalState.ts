// src/editor/helpers/shared/useMappingModalState.ts
import { ref, computed } from 'vue'

/**
 * 「変更前 → 変更後」のマッピングを編集するモーダルの状態管理
 * (キャラクター変更・iconKey 変更で共用。iconKey 側のマッピングのキーは "characterKey:iconKey" 複合形式)
 */
export function useMappingModalState() {
  const isModalOpen = ref(false)
  const mappings = ref<Record<string, string>>({})

  const openModal = (initialMappings?: Record<string, string>) => {
    isModalOpen.value = true
    mappings.value = initialMappings || {}
  }

  const updateMapping = (key: string, value: string) => {
    mappings.value[key] = value
  }

  const closeModal = () => {
    isModalOpen.value = false
    mappings.value = {}
  }

  const clearAllMappings = () => {
    mappings.value = {}
  }

  // 変更があるか
  const hasChanges = computed(() => Object.values(mappings.value).some((value) => value !== ''))

  return {
    isModalOpen,
    mappings,
    openModal,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  }
}
