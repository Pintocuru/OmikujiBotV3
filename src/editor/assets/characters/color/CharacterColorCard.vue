<!-- src/editor/assets/characters/color/CharacterColorCard.vue -->
<!-- キャラクターの色の要約カード(フキダシのサンプルと、4色の色見本)。編集はダイアログで行い、入力は即時に反映される -->
<template>
  <div class="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 md:flex-row md:items-center">
    <!-- フキダシのサンプル(矢印の分、下に余白を取る) -->
    <div class="flex flex-1 justify-center pb-5">
      <CommentBubbleItem :botName="botName" :message="t('characterService.cards.colorSample')" :color="currentColor" />
    </div>

    <!-- 色見本 -->
    <ul class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:w-64">
      <li v-for="field in colorFields" :key="field" class="flex items-center gap-2 min-w-0">
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

    <button class="btn btn-primary btn-sm self-end md:self-center" @click="editOpen = true">
      <Pencil class="h-4 w-4" />
      {{ t('characterService.cards.edit') }}
    </button>
  </div>

  <BaseDialog
    v-model:open="editOpen"
    icon="Palette"
    :title="t('categorySections.colorSettings.label')"
    size="3xl"
  >
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
  import { CharacterColorScheme, type CharacterColorType } from '@/types/OmikujiData/'
  import CommentBubbleItem from '@/ui/common/CommentBubbleItem.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import CharacterColorSettings from './CharacterColorSettings.vue'

  const props = defineProps<{
    modelValue?: CharacterColorType
    botName: string
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: CharacterColorType] }>()

  const { t } = useI18n()

  const colorFields = ['name', 'text', 'background', 'accent'] as const

  const currentColor = computed(() => props.modelValue ?? CharacterColorScheme.parse({}))

  const editOpen = ref(false)
</script>
