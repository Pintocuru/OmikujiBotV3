<!-- src/editor/assets/characters/color/CharacterColorCard.vue -->
<!-- キャラクターの色の要約カード(フキダシのサンプルと、4色の色見本)。編集はダイアログで行い、入力は即時に反映される -->
<template>
  <div class="p-2">
    <div class="flex items-center gap-2 font-semibold">
      {{ t('characterService.cards.edit') }}
      <div class="tooltip tooltip-top" :data-tip="t('characterService.cards.edit')">
        <button
          class="btn btn-sm btn-square"
          :aria-label="t('characterService.cards.edit')"
          @click="editOpen = true"
        >
          <Pencil class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-4 p-2">
      <!-- 色見本 -->
      <ul class="flex gap-x-4 gap-y-2 text-sm">
        <li v-for="field in colorFields" :key="field" class="flex items-center gap-2">
          <span
            class="h-5 w-5 shrink-0 rounded border border-base-content/20"
            :style="{ backgroundColor: currentColor[field] }"
          />
          <span class="min-w-0">
            <span class="block text-xs opacity-60">{{ t(`characterService.cards.colorNames.${field}`) }}</span>
            <span class="block truncate font-mono text-xs">{{ currentColor[field] }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>

  <BaseDialog v-model:open="editOpen" icon="Palette" :title="t('characterService.cards.edit')" size="3xl">
    <CharacterColorSettings
      :botName="botName"
      :modelValue="currentColor"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Pencil } from 'lucide-vue-next'
  import { CharacterColorSchema, type CharacterColorType } from '@/types/OmikujiData/'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import CharacterColorSettings from './CharacterColorSettings.vue'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName: string
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: CharacterColorType] }>()

  const { t } = useI18n()

  const colorFields = ['name', 'text', 'background', 'accent'] as const

  const currentColor = computed(() => props.modelValue ?? CharacterColorSchema.parse({}))

  const editOpen = ref(false)
</script>
