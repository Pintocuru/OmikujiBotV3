<!-- src/editor/helpers/IconKeyChanger/IconKeyChanger.vue -->
<template>
  <div
    class="tooltip tooltip-bottom"
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
      <span v-else class="badge badge-sm badge-outline">{{
        usedIconGroups.reduce((n, g) => n + g.icons.length, 0)
      }}</span>
    </button>
  </div>

  <!-- モーダル -->
  <BaseDialog
    :open="isModalOpen"
    :title="t('iconKeyChanger.title', { scope: scopeLabel })"
    icon="Image"
    size="3xl"
    @update:open="onUpdateOpen"
  >
    <div class="space-y-4">
      <!-- 現在使用されているアイコン -->
      <div class="bg-base-200 p-4 rounded-lg space-y-3">
        <p class="text-sm font-semibold text-gray-600">{{ t('iconKeyChanger.currentListTitle') }}</p>
        <p v-if="usedIconGroups.length === 0" class="text-sm text-gray-500">
          {{ t('iconKeyChanger.emptyList') }}
        </p>
        <div v-for="group in usedIconGroups" :key="group.characterKey">
          <p class="text-xs text-gray-500 mb-1">
            {{ getCharacterName(group.characterKey) || group.characterKey || t('mapping.emptyKey') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="icon in group.icons"
              :key="icon.iconKey"
              :class="['badge badge-lg', icon.invalid ? 'badge-error animate-pulse' : 'badge-outline']"
            >
              {{ icon.invalid ? '⚠️ ' : '' }}{{ icon.iconKey || t('mapping.emptyKey') }}
              <span class="ml-1 text-xs opacity-70">({{ usageCountLabel(icon.count) }})</span>
            </span>
          </div>
        </div>
      </div>

      <!-- エラー統計 -->
      <div v-if="hasInvalidIconKeys" class="stats shadow w-full">
        <div class="stat bg-error/10">
          <div class="stat-title">{{ t('iconKeyChanger.invalidStatistics') }}</div>
          <div class="stat-value text-error">{{ invalidIconKeyCount }}</div>
        </div>
      </div>

      <!-- エラー警告 -->
      <div v-if="hasInvalidIconKeys" class="alert alert-error">
        <AlertTriangle class="w-4 h-4" />
        <div class="flex-1">
          <span class="font-semibold">{{ t('iconKeyChanger.invalidAlert.title') }}</span>
          <p class="text-sm mt-1">{{ t('iconKeyChanger.invalidAlert.description') }}</p>
        </div>
      </div>

      <!-- 不正キーがない場合 -->
      <div v-else class="alert alert-success">
        <span>{{ t('iconKeyChanger.validAlert') }}</span>
      </div>

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

      <!-- 変更プレビュー -->
      <div v-if="hasChanges" class="alert alert-warning">
        <AlertTriangle class="w-4 h-4" />
        <div class="flex-1">
          <span class="font-semibold">{{ t('mapping.review') }}</span>
          <ul class="text-sm mt-2 space-y-1">
            <li v-for="(newKey, compositeKey) in iconKeyMappings" :key="compositeKey">
              <span v-if="newKey">
                {{
                  t('mapping.itemChange', {
                    before: formatPreviewLabel(compositeKey),
                    after: newKey,
                    usageCount: usageCountLabel(iconKeyUsageCount[compositeKey] ?? 0),
                  })
                }}
              </span>
            </li>
          </ul>
          <p class="text-sm mt-3 font-semibold text-warning-content">
            {{ t('mapping.caution', { scope: scopeLabel }) }}
          </p>
        </div>
      </div>
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
  import { ImageIcon, AlertTriangle } from 'lucide-vue-next'
  import IconKeyMappingEditor from './IconKeyMappingEditor.vue'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { TargetCategoryType, FlowTarget, useDataExtractor } from '../CharacterChanger/composables/useDataExtractor'
  import { useIconKeyStats } from './composables/useIconKeyStats'
  import { useMappingModalState } from '@/editor/helpers/shared/useMappingModalState'
  import { useMappingUpdater } from '@/editor/helpers/shared/useMappingUpdater'
  import { useScenarioStepCharacters } from '@/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters'
  import { useCharacterLookup } from '../CharacterChanger/composables/useCharacterLookup'

  const { t } = useI18n()

  const props = defineProps<{
    category: TargetCategoryType
    selectedId?: string
    itemId?: string
    targets?: FlowTarget[]
  }>()

  const { getCharacterName } = useCharacterLookup()

  const { scopeLabel, allTargets: extractedTargets } = useDataExtractor(
    props.category,
    () => props.selectedId,
    () => props.itemId
  )

  const allTargets = computed(() => props.targets ?? extractedTargets.value)

  const { invalidIconKeyPairs, iconKeyUsageCount, hasInvalidIconKeys, invalidIconKeyCount } =
    useIconKeyStats(allTargets)

  const usageCountLabel = (count: number) => t(`mapping.usageCount.${count === 1 ? 'one' : 'other'}`, { count })

  // 使用中のアイコンをキャラクターごとにまとめる（不正なものを先頭に）
  const usedIconGroups = computed(() => {
    const invalidSet = new Set(invalidIconKeyPairs.value.map((p) => `${p.characterKey}:${p.iconKey}`))
    const groups = new Map<string, { iconKey: string; count: number; invalid: boolean }[]>()
    Object.entries(iconKeyUsageCount.value).forEach(([compositeKey, count]) => {
      const i = compositeKey.indexOf(':')
      const characterKey = compositeKey.slice(0, i)
      const iconKey = compositeKey.slice(i + 1)
      const list = groups.get(characterKey) ?? []
      list.push({ iconKey, count, invalid: invalidSet.has(compositeKey) })
      groups.set(characterKey, list)
    })
    return Array.from(groups, ([characterKey, icons]) => ({
      characterKey,
      icons: [...icons.filter((v) => v.invalid), ...icons.filter((v) => !v.invalid)],
    })).sort((a, b) => Number(b.icons.some((v) => v.invalid)) - Number(a.icons.some((v) => v.invalid)))
  })

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
      initialMappings[`${characterKey}:${iconKey}`] = ''
    })
    openModalBase(initialMappings)
  }

  /**
   * "characterKey:iconKey" → 表示用ラベル
   */
  const formatPreviewLabel = (compositeKey: string): string => {
    const [characterKey, iconKey] = compositeKey.split(':')
    const character = getCharacterName(characterKey) || characterKey || t('mapping.emptyKey')
    return t('iconKeyChanger.mappingBeforeValue', { character, iconKey: iconKey || t('mapping.emptyKey') })
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

<style scoped src="@/editor/helpers/shared/softPulse.css"></style>
