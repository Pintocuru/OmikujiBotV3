<!-- src/editor/assets/characters/service/CommentVoiceCard.vue -->
<!-- BOTコメント表現の要約(表示方法・枠・表示用画像)。編集はダイアログで行い、入力は即時に反映される -->
<template>
  <div class="p-2">
    <div class="flex items-center gap-2 font-semibold">
      {{ t('characterService.voice.label') }}
      <div class="tooltip tooltip-top" :data-tip="t('characterService.cards.edit')">
        <button
          class="btn btn-sm btn-neutral btn-square"
          :aria-label="t('characterService.cards.edit')"
          @click="editOpen = true"
        >
          <Pencil class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4 p-2">
      <div class="flex gap-2">
        <span class="badge badge-primary">{{ t(`mapText.displayMode.${currentOption.mode}.label`) }}</span>

        <!-- 枠と画像は、わんコメへ投稿するときだけ意味がある -->
        <template v-if="currentOption.mode === 'comment'">
          <span class="flex items-center gap-2 text-sm">
            <img
              v-if="currentOption.imageBase64"
              :src="currentOption.imageBase64"
              alt=""
              class="h-6 w-6 rounded object-cover"
            />
          </span>
        </template>
      </div>
    </div>
  </div>

  <BaseDialog v-model:open="editOpen" icon="MessageSquare" :title="t('characterService.voice.label')" size="3xl">
    <CommentVoiceSettings
      :modelValue="currentOption"
      :backgroundColor="backgroundColor"
      :onUpdate="(value) => emit('update:modelValue', value)"
    />
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Pencil } from 'lucide-vue-next'
  import { DisplayOptionSchema, type DisplayOptionType } from '@/types/OmikujiData'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import CommentVoiceSettings from './CommentVoiceSettings.vue'

  const props = defineProps<{
    modelValue?: DisplayOptionType
    /** 表示用画像のプレビュー背景に使う、キャラクターの背景色 */
    backgroundColor?: string
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: DisplayOptionType] }>()

  const { t } = useI18n()

  const currentOption = computed(() => props.modelValue ?? DisplayOptionSchema.parse({}))

  const editOpen = ref(false)
</script>
