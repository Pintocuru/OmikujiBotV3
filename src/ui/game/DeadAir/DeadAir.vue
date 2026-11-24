<!-- src/ui/game/DeadAir/DeadAir.vue -->
<template>
  <DeadAirSelector
    :settings="settings"
    :phase="phase"
    :formatted-time="formattedTime"
    :is-warning="isWarning"
    :is-critical="isCritical"
    :current-lives="currentLives"
    :bonus-fraction="bonusFraction"
    :life-fraction="lifeFraction"
    :optional-value="optionalValue"
    :font-family="appStore.data.ui.fontFamily"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { DeadAirSchema } from '@/types/ui'
  import { useStreamCounters } from '@/ui/common/useStreamCounters'
  import DeadAirSelector from './DeadAirSelector.vue'
  import { toDeadAirVariableLabelMap, useDeadAirLogic } from './composables/useDeadAirLogic'

  const appStore = useAppStore()
  const settings = computed(() => DeadAirSchema.parse(appStore.data.ui?.settings?.deadAir ?? {}))

  // 組み込みでないキーだけを「変数カウンター」として渡す
  const variableLabelMap = computed(() => toDeadAirVariableLabelMap(settings.value))
  const { counters } = useStreamCounters(variableLabelMap)

  // メタ取得が完了するまでは、カウンターの初期値を増加として扱わない
  const countersReady = computed(() => appStore.serviceMetaStore.getStatus() === 'ready')

  // 本番は常に等倍(ペナルティで加速させるときは、第3引数に speed の ref を渡して書き換える)
  const { phase, formattedTime, isWarning, isCritical, currentLives, bonusFraction, lifeFraction, optionalValue } =
    useDeadAirLogic(settings, counters, undefined, countersReady)
</script>
