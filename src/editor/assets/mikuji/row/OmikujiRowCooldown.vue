<!-- src/editor/assets/mikuji/row/OmikujiRowCooldown.vue -->
<!-- クールダウン(秒)の入力。steps のみ編集でき、control は「-」を表示する -->
<template>
  <label
    v-if="item.kind === 'steps'"
    class="input input-sm input-bordered flex w-full items-center gap-1"
    :title="t('omikujiItem.header.cooldown.inputTitle')"
  >
    <Timer class="w-3.5 h-3.5 shrink-0 opacity-60" />
    <input
      type="number"
      class="min-w-0 grow"
      :value="item.cooldownSeconds ?? 0"
      min="0"
      step="0.1"
      @change="updateCooldown"
    />
    <span class="text-xs opacity-60">{{ t('omikujiItem.header.cooldown.unit') }}</span>
  </label>
  <div v-else class="text-center opacity-40">-</div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Timer } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'

  const { t } = useI18n()

  const props = defineProps<{
    item: OmikujiItemType
  }>()

  const emit = defineEmits<{
    'update:item': [item: OmikujiItemType]
  }>()

  const updateCooldown = (event: Event) => {
    if (props.item.kind !== 'steps') return
    const num = parseFloat((event.target as HTMLInputElement).value)
    emit('update:item', { ...props.item, cooldownSeconds: isNaN(num) || num < 0 ? 0 : num })
  }
</script>
