<!-- src/editor/assets/PostFlow/tooltab/PostActionRow.vue -->
<template>
  <div class="flex items-center gap-2 p-1">
    <!-- 遅延秒数 -->
    <div class="flex items-center gap-2 shrink-0">
      <span class="badge badge-accent badge-sm rounded tooltip"> {{ action.delaySeconds }}s </span>
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
  import { PostFlowType } from '@/types'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { postFlowKindMap } from '@/maps/OmikujiData'

  const props = defineProps<{
    action: PostFlowType
  }>()

  const resolvedIcon = computed(() => {
    const iconName = postFlowKindMap[props.action.kind]?.icon
    return resolveLucideIcon(iconName)
  })
</script>
