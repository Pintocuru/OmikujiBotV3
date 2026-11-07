<!-- src/editor/assets/mikuji/item/OmikujiItemScenario.vue -->
<!-- おみくじ 1 件が実行するシナリオ(1 対 1)。steps のときだけ接続を持ち、control は持たない -->
<template>
  <!-- control: シナリオを実行しない -->
  <div
    v-if="omikujiItem.kind !== 'scenario'"
    class="flex items-center gap-2 rounded-box border border-base-300 bg-base-200/60 px-3 py-2 text-sm"
  >
    <Ban class="w-4 h-4 shrink-0 opacity-60" />
    <span class="opacity-80">{{ t('omikujiItem.scenario.controlNote') }}</span>
  </div>

  <!-- steps: 実行するシナリオ -->
  <div v-else class="space-y-4">
    <SettingItem
      icon="Zap"
      labelKey="omikujiItem.scenario.label"
      descriptionKey="omikujiItem.scenario.description"
      :showWarning="!scenario"
    >
      <div class="flex flex-wrap items-center gap-2">
        <!-- 接続済み -->
        <template v-if="scenario">
          <!-- 編集ダイアログを開くボタン -->
          <button class="btn btn-sm gap-2 max-w-80" @click="pickerOpen = true">
            <Zap class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ scenario.name || scenarioKey }}</span>
          </button>

          <!-- シナリオ編集画面へ飛ぶボタン -->
          <button class="btn btn-xs btn-secondary gap-2" @click="goToScenario">
            <ExternalLink class="w-4 h-4" />
            {{ t('omikujiItem.scenario.edit') }}
          </button>

          <!-- 同じシナリオを実行する、ほかのおみくじの数 -->
          <span v-if="sharedCount > 0" class="badge badge-sm badge-outline">
            {{ t('omikujiItem.scenario.shared', { count: sharedCount }) }}
          </span>
        </template>

        <!-- 未接続 / 参照切れ -->
        <div v-else class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
          <span v-if="scenarioKey" class="badge badge-warning">{{
            t('omikujiItem.scenario.missing', { key: scenarioKey })
          }}</span>
          <span v-else class="text-sm">{{ t('omikujiItem.scenario.none') }}</span>
          <button class="btn btn-sm btn-secondary" @click="pickerOpen = true">
            {{ t('omikujiItem.scenario.pick') }}
          </button>
        </div>
      </div>
    </SettingItem>

    <ScenarioPickerDialog v-model:open="pickerOpen" :selectedKey="scenarioKey || undefined" @select="onSelect" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Ban, ExternalLink, Zap } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useReferenceGraph } from '@/editor/helpers/referenceGraph/useReferenceGraph'
  import ScenarioPickerDialog from './ScenarioPickerDialog.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const props = defineProps<{ omikujiItem: OmikujiItemType }>()
  const emit = defineEmits<{ update: [item: OmikujiItemType] }>()

  const { t } = useI18n()
  const { getAsset } = useGetAssetData()
  const navigationStore = useNavigationStore()
  const { scenarioItemCount } = useReferenceGraph()

  const pickerOpen = ref(false)

  const scenarioKey = computed(() => (props.omikujiItem.kind === 'scenario' ? props.omikujiItem.scenarioKey : ''))
  const scenario = computed(() => (scenarioKey.value ? (getAsset('scenarios', scenarioKey.value) ?? null) : null))
  /** 同じシナリオを実行する、ほかのおみくじの数(自分を除く) */
  const sharedCount = computed(() => Math.max(0, scenarioItemCount(scenarioKey.value) - 1))

  const onSelect = (key: string) => {
    if (props.omikujiItem.kind !== 'scenario') return
    emit('update', { ...props.omikujiItem, scenarioKey: key })
  }

  /** シナリオの中身を編集しに行く */
  const goToScenario = () => {
    navigationStore.selectCategory('scenarios')
    navigationStore.selectItem(scenarioKey.value)
  }
</script>
