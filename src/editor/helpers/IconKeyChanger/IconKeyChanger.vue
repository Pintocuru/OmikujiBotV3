<!-- src/editor/helpers/IconKeyChanger/IconKeyChanger.vue -->
<template>
  <div
    class="tooltip"
    :data-tip="t(hasInvalidIconKeys ? 'iconKeyChanger.tooltip.invalid' : 'iconKeyChanger.tooltip.normal')"
  >
    <button
      :class="['btn', 'btn-sm', 'gap-2', hasInvalidIconKeys ? 'btn-warning animate-pulse' : 'btn-ghost']"
      @click="openModal"
    >
      <ImageIcon class="w-4 h-4" />
      {{ t('iconKeyChanger.buttonLabel') }}
      <span v-if="hasInvalidIconKeys" class="badge badge-sm">
        ⚠️ {{ t('iconKeyChanger.invalidCount', { count: invalidIconKeyCount }) }}
      </span>
      <span v-else class="badge badge-sm badge-outline">{{ usedIconCount }}</span>
    </button>
  </div>

  <!-- モーダル -->
  <BaseDialog
    :open="isModalOpen"
    :title="t('iconKeyChanger.title')"
    icon="Image"
    size="3xl"
    @update:open="onUpdateOpen"
  >
    <div class="space-y-4">
      <CurrentIconList :groups="usedIconGroups" />

      <IconKeyStatus :invalid-count="invalidIconKeyCount" />

      <!-- 変更エディター（不正キーがある場合のみ表示） -->
      <IconKeyMappingEditor
        v-if="hasInvalidIconKeys"
        :invalid-pairs="invalidIconKeyPairs"
        :icon-key-mappings="iconKeyMappings"
        :usage-count="iconKeyUsageCount"
        :has-changes="hasChanges"
        @clear-all="clearAllMappings"
        @update-mapping="updateMapping"
      />

      <IconKeyMappingPreview v-if="hasChanges" :icon-key-mappings="iconKeyMappings" :usage-count="iconKeyUsageCount" />
    </div>

    <template #actions>
      <ModalFooterActions
        class="w-full"
        :on-cancel="closeModal"
        :on-save="executeIconKeyChange"
        :save-name="t('iconKeyChanger.execute')"
        :disabled="!hasChanges"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ImageIcon } from 'lucide-vue-next'
  import CurrentIconList from './CurrentIconList.vue'
  import IconKeyStatus from './IconKeyStatus.vue'
  import IconKeyMappingEditor from './IconKeyMappingEditor.vue'
  import IconKeyMappingPreview from './IconKeyMappingPreview.vue'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import type { FlowTarget } from '../CharacterChanger/types'
  import { useIconKeyStats } from './composables/useIconKeyStats'
  import { useUsedIconGroups } from './composables/useUsedIconGroups'
  import { toCompositeKey } from './compositeKey'
  import { useMappingModalState } from '@/editor/helpers/shared/useMappingModalState'
  import { useMappingUpdater } from '@/editor/helpers/shared/useMappingUpdater'
  import { useScenarioStepCharacters } from '@/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters'

  const { t } = useI18n()

  // 変更対象のシナリオ(選択中のアイテムに関係するシナリオ。呼び出し側が解決して渡す)
  const props = defineProps<{
    targets: FlowTarget[]
  }>()

  const allTargets = computed(() => props.targets)

  const { invalidIconKeyPairs, iconKeyUsageCount, hasInvalidIconKeys, invalidIconKeyCount } =
    useIconKeyStats(allTargets)

  const { usedIconGroups, usedIconCount } = useUsedIconGroups(iconKeyUsageCount, invalidIconKeyPairs)

  const {
    isModalOpen,
    mappings: iconKeyMappings,
    openModal: openModalBase,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useMappingModalState()

  const { applyIconKeyMappings } = useScenarioStepCharacters()
  const { applyMappingsToAllItems } = useMappingUpdater(allTargets, applyIconKeyMappings)

  /**
   * モーダルを開く（不正キーを初期選択状態に）
   */
  const openModal = () => {
    const initialMappings: Record<string, string> = {}
    invalidIconKeyPairs.value.forEach(({ characterKey, iconKey }) => {
      initialMappings[toCompositeKey(characterKey, iconKey)] = ''
    })
    openModalBase(initialMappings)
  }

  // ×・Esc・バックドロップで閉じたときも、編集中のマッピングを破棄する
  const onUpdateOpen = (open: boolean) => {
    if (!open) closeModal()
  }

  /**
   * iconKey変更を実行
   */
  const executeIconKeyChange = () => {
    if (!hasChanges.value) return
    applyMappingsToAllItems(iconKeyMappings.value)
    closeModal()
  }
</script>
