<!-- src/editor/assets/mikuji/item/OmikujiItemScenario.vue -->
<!-- おみくじ 1 件が実行するシナリオ(1 対 1)。steps のときだけ接続を持ち、control は持たない -->
<template>
  <!-- control: シナリオを実行しない -->
  <div
    v-if="omikujiItem.kind !== 'steps'"
    class="flex items-center gap-2 rounded-box border border-base-300 bg-base-200/60 px-3 py-2 text-sm"
  >
    <Ban class="w-4 h-4 shrink-0 opacity-60" />
    <span class="opacity-80">{{ t('omikujiItem.scenario.controlNote') }}</span>
  </div>

  <!-- steps: 実行するシナリオ -->
  <div v-else class="rounded-box border border-primary/40 bg-primary/5 p-3 space-y-2">
    <div class="flex items-center gap-2 text-sm font-bold">
      <Zap class="w-4 h-4" />
      {{ t('omikujiItem.scenario.label') }}
      <span class="font-normal text-xs opacity-70">{{ t('omikujiItem.scenario.description') }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <!-- 接続済み -->
      <template v-if="scenario">
        <button class="btn btn-sm btn-primary gap-1 max-w-80" @click="pickerOpen = true">
          <Zap class="w-4 h-4 shrink-0" />
          <span class="truncate">{{ scenario.name || stepKey }}</span>
        </button>
        <button class="btn btn-xs btn-ghost" @click="pickerOpen = true">{{ t('omikujiItem.scenario.change') }}</button>
        <button class="btn btn-xs btn-ghost gap-1" @click="goToScenario">
          <ExternalLink class="w-3.5 h-3.5" />
          {{ t('omikujiItem.scenario.edit') }}
        </button>
        <span v-if="sharedCount > 0" class="badge badge-sm badge-outline">
          {{ t('omikujiItem.scenario.shared', { count: sharedCount }) }}
        </span>
      </template>

      <!-- 未接続 / 参照切れ -->
      <div v-else class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
        <span v-if="stepKey" class="badge badge-warning">{{ t('omikujiItem.scenario.missing', { key: stepKey }) }}</span>
        <span v-else class="text-sm">{{ t('omikujiItem.scenario.none') }}</span>
        <button class="btn btn-xs btn-primary" @click="pickerOpen = true">{{ t('omikujiItem.scenario.pick') }}</button>
      </div>
    </div>

    <ScenarioPickerDialog v-model:open="pickerOpen" :selectedKey="stepKey || undefined" @select="onSelect" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Ban, ExternalLink, Zap } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useReferenceGraph } from '@/editor/content/composables/useReferenceGraph'
  import ScenarioPickerDialog from './ScenarioPickerDialog.vue'

  const props = defineProps<{ omikujiItem: OmikujiItemType }>()
  const emit = defineEmits<{ update: [item: OmikujiItemType] }>()

  const { t } = useI18n()
  const { getAsset } = useGetAssetData()
  const navigationStore = useNavigationStore()
  const { scenarioItemCount } = useReferenceGraph()

  const pickerOpen = ref(false)

  const stepKey = computed(() => (props.omikujiItem.kind === 'steps' ? props.omikujiItem.stepKey : ''))
  const scenario = computed(() => (stepKey.value ? (getAsset('scenarios', stepKey.value) ?? null) : null))
  /** 同じシナリオを実行する、ほかのおみくじの数(自分を除く) */
  const sharedCount = computed(() => Math.max(0, scenarioItemCount(stepKey.value) - 1))

  const onSelect = (key: string) => {
    if (props.omikujiItem.kind !== 'steps') return
    emit('update', { ...props.omikujiItem, stepKey: key })
  }

  /** シナリオの中身を編集しに行く */
  const goToScenario = () => {
    navigationStore.selectCategory('scenarios')
    navigationStore.selectItem(stepKey.value)
  }
</script>
