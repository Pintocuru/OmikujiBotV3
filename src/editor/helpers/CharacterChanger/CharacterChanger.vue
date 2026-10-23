<!-- src/editor/helpers/CharacterChanger/CharacterChanger.vue -->
<template>
  <!-- トリガーボタン -->
  <div
    class="tooltip tooltip-bottom"
    :data-tip="hasInvalidCharacters ? '存在しないキャラクターが使用されています！' : '使用中のキャラクターを確認する'"
  >
    <button :class="['btn', hasInvalidCharacters ? 'btn-error animate-pulse' : 'btn-ghost']" @click="openModal">
      <Users class="w-4 h-4" />
      使用キャラ
      <span v-if="hasInvalidCharacters" class="badge badge-sm">⚠️ 未定義 {{ invalidCharacterCount }}</span>
      <span v-else class="badge badge-sm badge-outline">{{ uniqueCharacterKeys.length }}</span>
    </button>
  </div>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
    <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
      <h3 class="font-bold text-lg mb-4">{{ scopeLabel }}の使用キャラクター</h3>

      <div class="space-y-4">
        <!-- 統計情報（カテゴリ全体の場合のみ表示） -->
        <CharacterStatistics
          v-if="changeScope === 'category'"
          :total-items="totalItems"
          :unique-character-count="uniqueCharacterKeys.length"
          :invalid-character-count="invalidCharacterCount"
          :has-invalid-characters="hasInvalidCharacters"
        />

        <!-- 現在のキャラクター情報 -->
        <CurrentCharacterList :character-keys="sortedCharacterKeys" :usage-count="characterUsageCount" />

        <!-- エラー警告 -->
        <InvalidCharacterAlert v-if="hasInvalidCharacters" />

        <!-- 個別変更セクション（未定義がある場合、または「変更する」を押したときだけ表示） -->
        <CharacterMappingEditor
          v-if="visibleMappingKeys.length > 0"
          :character-keys="visibleMappingKeys"
          :character-mappings="characterMappings"
          :usage-count="characterUsageCount"
          :has-changes="hasChanges"
          @clear-all="clearAllMappings"
          @update-mapping="updateMapping"
        />

        <div v-if="!isEditing && uniqueCharacterKeys.length > visibleMappingKeys.length" class="text-center">
          <button class="btn btn-sm btn-ghost" @click="isEditing = true">
            {{ visibleMappingKeys.length > 0 ? 'すべてのキャラクターを変更する' : 'キャラクターを変更する' }}
          </button>
        </div>

        <!-- 変更内容のプレビュー -->
        <MappingPreview
          v-if="hasChanges"
          :character-mappings="characterMappings"
          :usage-count="characterUsageCount"
          :scope-label="scopeLabel"
        />
      </div>

      <!-- モーダルアクション -->
      <ModalFooterActions
        class="mt-6"
        :on-cancel="closeModal"
        :on-save="executeCharacterChange"
        saveName="変更を実行"
        :disabled="!hasChanges"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import CharacterStatistics from './CharacterStatistics.vue'
  import CurrentCharacterList from './CurrentCharacterList.vue'
  import InvalidCharacterAlert from './InvalidCharacterAlert.vue'
  import CharacterMappingEditor from './CharacterMappingEditor.vue'
  import MappingPreview from './MappingPreview.vue'
  import { TargetCategoryType, useDataExtractor } from './composables/useDataExtractor'
  import { useCharacterStats } from './composables/useCharacterStats'
  import { useModalState } from './composables/useModalState'
  import { useCharacterUpdater } from './composables/useCharacterUpdater'
  import { useCharacterLookup } from './composables/useCharacterLookup'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import { Users } from 'lucide-vue-next'

  const props = defineProps<{
    category: TargetCategoryType
    selectedId?: string
    itemId?: string
  }>()

  // キャラクターデータ
  const { getCharacterName } = useCharacterLookup()

  // データ抽出（selectedIdがある場合は単一イベントのみ対象）
  const { changeScope, scopeLabel, allTargets, totalItems } = useDataExtractor(
    props.category,
    () => props.selectedId,
    () => props.itemId
  )

  // キャラクター統計
  const { uniqueCharacterKeys, characterUsageCount, invalidCharacterCount, hasInvalidCharacters } =
    useCharacterStats(allTargets)

  // モーダル状態
  const {
    isModalOpen,
    characterMappings,
    openModal: openModalBase,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useModalState()

  // キャラクター更新処理
  const { applyMappingsToAllItems } = useCharacterUpdater(allTargets)

  // 「変更する」を押したときだけ、正常なキャラクターも変更対象に表示する
  const isEditing = ref(false)

  // 未定義キャラクターを先頭に並べる
  const isUndefinedKey = (key: string) => !getCharacterName(key)
  const sortedCharacterKeys = computed(() => [
    ...uniqueCharacterKeys.value.filter(isUndefinedKey),
    ...uniqueCharacterKeys.value.filter((key) => !isUndefinedKey(key)),
  ])
  const visibleMappingKeys = computed(() =>
    isEditing.value ? sortedCharacterKeys.value : uniqueCharacterKeys.value.filter(isUndefinedKey)
  )

  /**
   * モーダルを開く（未定義キャラクターは初期選択状態に）
   */
  const openModal = () => {
    isEditing.value = false
    const initialMappings: Record<string, string> = {}
    uniqueCharacterKeys.value.forEach((charKey) => {
      if (!getCharacterName(charKey)) initialMappings[charKey] = ''
    })
    openModalBase(initialMappings)
  }

  /**
   * キャラクター変更を実行
   */
  const executeCharacterChange = () => {
    if (!hasChanges.value) return
    applyMappingsToAllItems(characterMappings.value)
    closeModal()
  }
</script>

<style scoped>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
