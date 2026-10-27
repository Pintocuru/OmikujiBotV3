<!-- src/editor/assets/characters/CharacterImage/EmotionImageItem.vue -->
<template>
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <label class="text-sm text-base-content/60 shrink-0">{{ t('characterImage.item.name') }}</label>
        <input
          type="text"
          class="input input-xs flex-1"
          :placeholder="emotionKey"
          v-model="localName"
          @blur="emit('update:label', localName)"
        />
      </div>
      <div class="text-sm text-base-content/40">key: {{ emotionKey }}</div>
    </div>

    <div v-if="isDefaultWarning" class="badge badge-warning badge-sm">{{ t('characterImage.item.unset') }}</div>

    <!-- 削除ボタン -->
    <button type="button" class="btn btn-error btn-sm" @click="emit('remove')" :title="t('characterImage.item.deleteTip')">
      <Trash2 class="w-3 h-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, watch } from 'vue'
  import { Trash2 } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = defineProps<{
    emotionKey: string
    label: string
    isDefaultWarning?: boolean
  }>()

  const emit = defineEmits<{
    'update:label': [label: string]
    remove: []
  }>()

  const localName = ref(props.label)

  watch(
    () => props.label,
    (val) => {
      localName.value = val
    }
  )
</script>
