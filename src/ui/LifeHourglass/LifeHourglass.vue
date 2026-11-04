<!-- src/ui/LifeHourglass/LifeHourglass.vue -->
<template>
  <LifeHourglassSelector
    :settings="settings"
    :grains="grains"
    :giftPulse="giftPulse"
    :viewer="viewer"
    :giftTotal="giftTotal"
    :streamSeconds="streamSeconds"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { LifeHourglassSchema } from '@/types/ui'
  import LifeHourglassSelector from './LifeHourglassSelector.vue'
  import { useLifeHourglassStore } from './composables/useLifeHourglassStore'
  import { useSandAccumulator } from './composables/useSandAccumulator'

  const appStore = useAppStore()
  const settings = computed(() => LifeHourglassSchema.parse(appStore.data.ui?.settings?.lifeHourglass ?? {}))

  // 砂粒の加算(同接・ギフト)と保存は composable 側で行う。UI は表示だけを持つ
  const { giftPulse, viewer, giftTotal, streamSeconds } = useSandAccumulator()

  const lifeHourglassStore = useLifeHourglassStore()
  const { totalGrains } = storeToRefs(lifeHourglassStore)

  // carryOver=true: 通算をそのまま表示 / false: 起動時(読み込み時)の通算を基準にした、今回の配信ぶん
  const grains = computed(() =>
    settings.value.carryOver ? totalGrains.value : lifeHourglassStore.displayedGrains
  )
</script>
