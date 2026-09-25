<!-- src/editor/apps/appInfo/FlagsInfo/FeatureCard.vue -->
<template>
  <div v-if="isVisible" class="card bg-base-200 border-2" :class="getAccessLevelClass(isEnabled)">
    <div class="card-body p-4">
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg" :class="getIconBgClass(isEnabled)">
          <component :is="resolvedIcon" class="w-8 h-8" />
        </div>

        <div class="flex-1">
          <h4 class="font-bold">{{ title }}</h4>
          <p class="text-sm opacity-70 mt-1">{{ description }}</p>
        </div>

        <!-- スイッチ: showToggle が true のときのみ表示 -->
        <label v-if="showToggle" class="swap swap-rotate">
          <input type="checkbox" :checked="isEnabled" @change="handleToggle" />
          <div class="swap-on">
            <CheckCircle class="w-6 h-6 text-success" />
          </div>
          <div class="swap-off">
            <XCircle class="w-6 h-6 text-base-content/30" />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CheckCircle, XCircle } from 'lucide-vue-next'
  import { LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = defineProps<{
    title: string
    icon: LucideIconName
    isEnabled: boolean
    description: string
    featureKey?: string
    showToggle?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'toggle', key: string, enabled: boolean): void
  }>()

  // アイコン名文字列 → Lucideコンポーネントに解決
  const resolvedIcon = computed(() => resolveLucideIcon(props.icon))

  // 無効な機能は表示しない
  const isVisible = computed(() => props.isEnabled)

  function handleToggle() {
    if (!props.featureKey) return
    emit('toggle', props.featureKey, !props.isEnabled)
  }

  function getAccessLevelClass(enabled: boolean): string {
    return enabled ? 'border-success' : 'border-base-300 opacity-60'
  }

  function getIconBgClass(enabled: boolean): string {
    return enabled ? 'bg-success/20 text-success' : 'bg-base-300'
  }
</script>
