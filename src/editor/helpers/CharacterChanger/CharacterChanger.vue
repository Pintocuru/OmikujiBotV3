<!-- src/editor/helpers/CharacterChanger/CharacterChanger.vue -->
<template>
  <!-- トリガーボタン -->
  <div
    class="tooltip tooltip-bottom"
    :data-tip="t(hasInvalidCharacters ? 'characterChanger.tooltip.invalid' : 'characterChanger.tooltip.normal')"
  >
    <button :class="['btn', 'btn-sm', 'gap-2', hasInvalidCharacters ? 'btn-warning animate-pulse' : 'btn-ghost']" @click="openModal">
      <Users class="w-4 h-4" />
      {{ t('characterChanger.buttonLabel') }}
      <span v-if="hasInvalidCharacters" class="badge badge-sm">
        ⚠️ {{ t('characterChanger.invalidCount', { count: invalidCharacterCount }) }}
      </span>
      <span v-else class="badge badge-sm badge-outline">{{ uniqueCharacterKeys.length }}</span>
    </button>
  </div>

  <!-- モーダル -->
  <BaseDialog
    :open="isModalOpen"
    :title="t('characterChanger.title', { scope: scopeLabel })"
    icon="Users"
    size="3xl"
    @update:open="onUpdateOpen"
  >
    <div class="space-y-4">
      <!-- 統計情報（カテゴリ全体の場合のみ表示） -->
      <CharacterStatistics
        v-if="changeScope === 'category' && !props.targets"
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
          {{ t(visibleMappingKeys.length > 0 ? 'characterChanger.changeAll' : 'characterChanger.change') }}
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

    <template #actions>
      <ModalFooterActions
        class="w-full"
        :on-cancel="closeModal"
        :on-save="executeCharacterChange"
        :save-name="t('characterChanger.execute')"
        :disabled="!hasChanges"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CharacterStatistics from './CharacterStatistics.vue'
  import CurrentCharacterList from './CurrentCharacterList.vue'
  import InvalidCharacterAlert from './InvalidCharacterAlert.vue'
  import CharacterMappingEditor from './CharacterMappingEditor.vue'
  import MappingPreview from './MappingPreview.vue'
  import { TargetCategoryType, FlowTarget, useDataExtractor } from './composables/useDataExtractor'
  import { useCharacterStats } from './composables/useCharacterStats'
  import { useMappingModalState } from '@/editor/helpers/shared/useMappingModalState'
  import { useMappingUpdater } from '@/editor/helpers/shared/useMappingUpdater'
  import { useScenarioStepCharacters } from './composables/useScenarioStepCharacters'
  import { useCharacterLookup } from './composables/useCharacterLookup'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { Users } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = defineProps<{
    category: TargetCategoryType
    selectedId?: string
    itemId?: string
    targets?: FlowTarget[]
  }>()

  // キャラクターデータ
  const { getCharacterName } = useCharacterLookup()

  // データ抽出（selectedIdがある場合は単一イベントのみ対象）
  const { changeScope, scopeLabel, allTargets: extractedTargets, totalItems } = useDataExtractor(
    props.category,
    () => props.selectedId,
    () => props.itemId
  )

  const allTargets = computed(() => props.targets ?? extractedTargets.value)

  // キャラクター統計
  const { uniqueCharacterKeys, characterUsageCount, invalidCharacterCount, hasInvalidCharacters } =
    useCharacterStats(allTargets)

  // モーダル状態
  const {
    isModalOpen,
    mappings: characterMappings,
    openModal: openModalBase,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useMappingModalState()

  // キャラクター更新処理
  const { applyCharacterMappings } = useScenarioStepCharacters()
  const { applyMappingsToAllItems } = useMappingUpdater(allTargets, applyCharacterMappings)

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

  // ×・Esc・バックドロップで閉じたときも、編集中のマッピングを破棄する
  const onUpdateOpen = (open: boolean) => {
    if (!open) closeModal()
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

<style scoped src="@/editor/helpers/shared/softPulse.css"></style>
