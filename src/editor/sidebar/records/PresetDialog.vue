<!-- src/editor/sidebar/records/PresetDialog.vue -->
<!-- プリセットをカード一覧で選ぶダイアログ。カードに「追加されるデータ」のプレビューを出し、選ぶと追加して閉じる -->
<template>
  <BaseDialog :open="open" :title="t('navigation.preset.title')" size="3xl" @update:open="emit('update:open', $event)">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        v-for="card in cards"
        :key="card.preset.id"
        class="card card-border bg-base-100 border-base-300 hover:border-primary text-left p-3 flex flex-col gap-2 transition-colors"
        @click="handleSelect(card.preset)"
      >
        <div>
          <div class="text-sm font-medium">{{ presetLabel(card.preset) }}</div>
          <div class="text-xs opacity-60">{{ presetDescription(card.preset) }}</div>
        </div>

        <div class="border-t border-base-300 pt-2">
          <div class="text-[10px] uppercase opacity-50 mb-1">{{ t('navigation.preset.contents') }}</div>
          <ul class="flex flex-col gap-1">
            <li v-for="(line, i) in card.visible" :key="i" class="flex items-center gap-1 text-xs min-w-0">
              <span class="badge badge-xs badge-ghost shrink-0">{{ line.category }}</span>
              <span class="truncate">{{ line.name }}</span>
            </li>
            <li v-if="card.hiddenCount > 0" class="text-xs opacity-60">
              {{ t('navigation.preset.more', { count: card.hiddenCount }) }}
            </li>
          </ul>
        </div>
      </button>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { DataCategoryType } from '@/types/OmikujiData/'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import type { PresetDefinition } from '@/editor/presets'
  import { useSidebarCreate } from '../composables/useSidebarCreate'
  import { useSidebarPreset } from '../composables/useSidebarPreset'

  /** カードに出すプレビュー行の上限(超えた分は「他 N 件」) */
  const MAX_PREVIEW_LINES = 5

  const props = defineProps<{ open: boolean; category: DataCategoryType }>()
  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  const { t } = useI18n()
  const { categoryLabel } = useSidebarCreate()
  const { presetsOf, presetLabel, presetDescription, addPreset } = useSidebarPreset()

  interface PreviewLine {
    category: string
    name: string
  }

  /** build() の結果から「追加されるデータ」(assets → events の順)を作る。build は ID 発行のみで副作用なし */
  const previewOf = (preset: PresetDefinition): PreviewLine[] => {
    const result = preset.build()
    const lines: PreviewLine[] = []
    for (const [assetCategory, items] of Object.entries(result.assets ?? {})) {
      for (const item of (items ?? []) as { name?: string }[]) {
        lines.push({ category: categoryLabel(assetCategory as DataCategoryType), name: item.name ?? '' })
      }
    }
    for (const ev of (result.events ?? []) as { name?: string }[]) {
      lines.push({ category: categoryLabel(preset.category), name: ev.name ?? '' })
    }
    return lines
  }

  // 開いている間だけ生成する
  const cards = computed(() => {
    if (!props.open) return []
    return presetsOf(props.category).map((preset) => {
      const lines = previewOf(preset)
      return {
        preset,
        visible: lines.slice(0, MAX_PREVIEW_LINES),
        hiddenCount: Math.max(0, lines.length - MAX_PREVIEW_LINES),
      }
    })
  })

  const handleSelect = (preset: PresetDefinition) => {
    addPreset(preset)
    emit('update:open', false)
  }
</script>
