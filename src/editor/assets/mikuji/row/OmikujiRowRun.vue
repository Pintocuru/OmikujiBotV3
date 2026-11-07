<!-- src/editor/assets/mikuji/row/OmikujiRowRun.vue -->
<!-- 行の実行内容(steps: シナリオ名 / control: command)と、シナリオ編集画面への移動ボタン -->
<template>
  <div class="flex min-w-0 flex-col items-start gap-1">
    <button class="btn btn-sm btn-outline w-full justify-start gap-1" @click="emit('open')">
      <Ban v-if="item.kind === 'control'" class="w-4 h-4 shrink-0" />
      <Zap v-else class="w-4 h-4 shrink-0" />
      <span class="truncate" :class="runState.cls">{{ runState.label }}</span>
    </button>
    <!-- シナリオ編集画面へ飛ぶボタン(シナリオを指定している steps のみ) -->
    <button v-if="scenarioKey" class="btn btn-xs btn-ghost gap-1" @click="goToScenario">
      <ExternalLink class="w-3.5 h-3.5" />
      {{ t('omikujiItem.scenario.edit') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Ban, ExternalLink, Zap } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  const props = defineProps<{
    item: OmikujiItemType
  }>()

  const emit = defineEmits<{
    open: []
  }>()

  const { t } = useI18n()
  const { getAsset } = useGetAssetData()
  const navigationStore = useNavigationStore()

  // 実行内容の表示。未接続・参照切れは警告色
  const runState = computed(() => {
    const item = props.item
    if (item.kind === 'control') {
      return { label: t(`mapText.omikujiControlCommand.${item.command}.label`), cls: '' }
    }
    if (!item.scenarioKey) return { label: t('omikujiItem.scenario.noneShort'), cls: 'text-error font-bold' }
    const scenario = getAsset('scenarios', item.scenarioKey)
    if (!scenario) return { label: t('omikujiItem.scenario.missingShort'), cls: 'text-error font-bold' }
    return { label: scenario.name || item.scenarioKey, cls: 'opacity-70' }
  })

  // 移動先のシナリオ key(control や未設定のときは空)
  const scenarioKey = computed(() => (props.item.kind === 'scenario' ? props.item.scenarioKey : ''))

  /** シナリオの中身を編集しに行く */
  const goToScenario = () => {
    if (!scenarioKey.value) return
    navigationStore.selectCategory('scenarios')
    navigationStore.selectItem(scenarioKey.value)
  }
</script>
