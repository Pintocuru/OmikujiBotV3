<!-- src/editor/assets/mikuji/row/OmikujiRowSummary.vue -->
<!-- 行の左側: ドラッグハンドル・名前・確率・追加条件・重み入力・メニュー -->
<template>
  <div
    class="flex min-w-0 items-center gap-2 text-sm p-2 bg-base-100 rounded shadow-sm hover:shadow-md transition-all"
    @click="emit('select')"
  >
    <!-- ドラッグハンドル -->
    <div class="legend-drag-handle cursor-move shrink-0">
      <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
    </div>

    <!-- 情報 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1">
        <!-- おみくじ名前 -->
        <span class="truncate">{{ item.name || t('omikujiItem.summary.unnamed') }}</span>
        <!-- 名前・説明の編集 -->
        <button
          class="btn btn-ghost btn-xs btn-square shrink-0"
          :title="t('omikujiItem.summary.editNameDescription')"
          @click.stop="emit('open', 'base')"
        >
          <Pencil class="w-3.5 h-3.5" />
        </button>
      </div>
      <!-- 説明 -->
      <div v-if="item.description" class="text-xs opacity-70 truncate">{{ item.description }}</div>

      <div class="mt-1 flex flex-wrap items-center gap-1">
        <!-- 出現確率(優先アイテムは抽選外) -->
        <span
          v-if="percentage !== null"
          class="badge badge-secondary text-secondary-content badge-sm shrink-0 gap-1 font-mono"
        >
          <Sparkles class="h-3 w-3" />
          {{ percentage }}%
        </span>

        <!-- 追加条件 -->
        <button class="btn btn-ghost btn-xs gap-1" @click.stop="emit('open', 'condition')">
          <Filter class="w-3 h-3" />
          {{ t('omikujiItem.priority.sectionTitle') }}
        </button>
        <span v-if="item.lottery.isPriority" class="badge badge-sm badge-primary">
          {{ t('omikujiItem.priority.priority.badge') }}
        </span>
        <span v-else-if="item.lottery.criteria" class="badge badge-xs badge-secondary">
          {{ t('omikujiItem.summary.criteriaBadge') }}
        </span>
      </div>
    </div>

    <!-- 重み編集(優先アイテムは抽選外なので「-」) -->
    <label v-if="!item.lottery.isPriority" class="input input-xs input-bordered flex w-20 shrink-0 items-center gap-1">
      <Scale class="w-3.5 h-3.5 shrink-0 opacity-60" />
      <input
        type="number"
        class="min-w-0 grow"
        :value="item.lottery.weight"
        min="0"
        step="1"
        @input="handleWeightUpdate"
        @click.stop
      />
    </label>
    <div v-else class="w-20 shrink-0 text-center opacity-40">-</div>

    <!-- メニュー -->
    <div class="shrink-0" @click.stop>
      <MenuDropdown @duplicate="emit('duplicate')" @delete="emit('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Filter, GripVertical, Pencil, Scale, Sparkles } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'

  const { t } = useI18n()

  defineProps<{
    item: OmikujiItemType
    /** 出現確率(%)。優先アイテムなど抽選外のときは null */
    percentage: string | null
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
    open: [name: 'base' | 'condition']
    select: []
    duplicate: []
    delete: []
  }>()

  const handleWeightUpdate = (event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value)
    if (!isNaN(value) && value >= 0) {
      emit('update:weight', value)
    }
  }
</script>
