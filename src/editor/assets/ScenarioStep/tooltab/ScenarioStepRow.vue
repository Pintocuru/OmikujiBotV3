<!-- src/editor/assets/ScenarioStep/tooltab/ScenarioStepRow.vue -->
<template>
  <div class="flex items-center gap-2 p-1">
    <!-- 遅延秒数 -->
    <div class="flex items-center gap-2 shrink-0">
      <span class="badge badge-accent badge-sm rounded tooltip"> {{ step.delaySeconds }}s </span>
    </div>

    <!-- 種別アイコン -->
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap gap-1 items-center">
        <component v-if="resolvedIcon" :is="resolvedIcon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ScenarioStepType } from '@/types/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { scenarioStepKindMap } from '@/maps/OmikujiData'

  const props = defineProps<{
    step: ScenarioStepType
  }>()

  const resolvedIcon = computed(() => {
    const iconName = scenarioStepKindMap[props.step.kind]?.icon
    return resolveLucideIcon(iconName)
  })
</script>
