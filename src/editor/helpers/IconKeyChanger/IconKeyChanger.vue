<!-- src/editor/helpers/IconKeyChanger/IconKeyChanger.vue -->
<template>
  <div
    class="tooltip tooltip-bottom"
    :data-tip="hasInvalidIconKeys ? '不正なアイコンキーが使用されています！' : '使用中のアイコンを確認する'"
  >
    <button :class="['btn', hasInvalidIconKeys ? 'btn-error animate-pulse' : 'btn-ghost']" @click="openModal">
      <ImageIcon class="w-4 h-4" />
      使用アイコン
      <span v-if="hasInvalidIconKeys" class="badge badge-sm">⚠️ 不正 {{ invalidIconKeyCount }}</span>
      <span v-else class="badge badge-sm badge-outline">{{
        usedIconGroups.reduce((n, g) => n + g.icons.length, 0)
      }}</span>
    </button>
  </div>

  <!-- モーダル -->
  <div v-if="isModalOpen" class="modal modal-open">
    <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
      <h3 class="font-bold text-lg mb-4">{{ scopeLabel }}の使用アイコン</h3>

      <div class="space-y-4">
        <!-- 使用中のアイコン（キャラクターごと） -->
        <div class="bg-base-200 p-4 rounded-lg space-y-3">
          <p class="text-sm font-semibold text-gray-600">現在使用されているアイコン:</p>
          <p v-if="usedIconGroups.length === 0" class="text-sm text-gray-500">使用されているアイコンはありません。</p>
          <div v-for="group in usedIconGroups" :key="group.characterKey">
            <p class="text-xs text-gray-500 mb-1">
              {{ getCharacterName(group.characterKey) || group.characterKey || '空欄' }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="icon in group.icons"
                :key="icon.iconKey"
                :class="['badge badge-lg', icon.invalid ? 'badge-error animate-pulse' : 'badge-outline']"
              >
                {{ icon.invalid ? '⚠️ ' : '' }}{{ icon.iconKey || '空欄' }}
                <span class="ml-1 text-xs opacity-70">({{ icon.count }}箇所)</span>
              </span>
            </div>
          </div>
        </div>

        <!-- エラー統計 -->
        <div v-if="hasInvalidIconKeys" class="stats shadow w-full">
          <div class="stat bg-error/10">
            <div class="stat-title">不正アイコンキー</div>
            <div class="stat-value text-error">{{ invalidIconKeyCount }}</div>
          </div>
        </div>

        <!-- エラー警告 -->
        <div v-if="hasInvalidIconKeys" class="alert alert-error">
          <AlertTriangle class="w-4 h-4" />
          <div class="flex-1">
            <span class="font-semibold">存在しないアイコンキーが使用されています。</span>
            <p class="text-sm mt-1">画像が表示されません。有効なキーへ変更してください。</p>
          </div>
        </div>

        <!-- 不正キーがない場合 -->
        <div v-else class="alert alert-success">
          <span>すべてのアイコンキーは有効です。</span>
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
            <span class="font-semibold">変更内容の確認</span>
            <ul class="text-sm mt-2 space-y-1">
              <li v-for="(newKey, compositeKey) in iconKeyMappings" :key="compositeKey">
                <span v-if="newKey">
                  {{ formatPreviewLabel(compositeKey) }} → 「{{ newKey }}」 ({{
                    iconKeyUsageCount[compositeKey] ?? 0
                  }}箇所)
                </span>
              </li>
            </ul>
            <p class="text-sm mt-3 font-semibold text-warning-content">
              ⚠️ この操作は{{ scopeLabel }}に影響します。元に戻すことはできません。
            </p>
          </div>
        </div>
      </div>

      <ModalFooterActions
        class="mt-6"
        :on-cancel="closeModal"
        :on-save="executeIconKeyChange"
        saveName="変更を実行"
        :disabled="!hasChanges"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ImageIcon, AlertTriangle } from 'lucide-vue-next'
  import IconKeyMappingEditor from './IconKeyMappingEditor.vue'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import { TargetCategoryType, useDataExtractor } from '../CharacterChanger/composables/useDataExtractor'
  import { useIconKeyStats } from './composables/useIconKeyStats'
  import { useIconKeyModalState } from './composables/useIconKeyModalState'
  import { useIconKeyUpdater } from './composables/useIconKeyUpdater'
  import { useCharacterLookup } from '../CharacterChanger/composables/useCharacterLookup'

  const props = defineProps<{
    category: TargetCategoryType
    selectedId?: string
    itemId?: string
  }>()

  const { getCharacterName } = useCharacterLookup()

  const { changeScope, scopeLabel, allTargets } = useDataExtractor(
    props.category,
    () => props.selectedId,
    () => props.itemId
  )

  const { invalidIconKeyPairs, iconKeyUsageCount, hasInvalidIconKeys, invalidIconKeyCount } =
    useIconKeyStats(allTargets)

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
    iconKeyMappings,
    openModal: openModalBase,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  } = useIconKeyModalState()

  const { applyMappingsToAllItems } = useIconKeyUpdater(allTargets)

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
    const charName = getCharacterName(characterKey) || characterKey
    return `「${charName} / ${iconKey}」`
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
