<!-- src/editor/assets/mikuji/weight/WeightItemSummary.vue -->
<!-- 行の左側: ドラッグハンドル・名前・確率・追加条件・weight 入力・メニュー -->
<template>
  <div
    class="flex flex-1 min-w-72 items-center gap-2 text-sm p-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
    :class="isSelected ? 'bg-primary text-primary-content' : 'bg-base-100'"
    @click="emit('select')"
  >
    <!-- ドラッグハンドル -->
    <div class="legend-drag-handle cursor-move shrink-0">
      <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
    </div>

    <!-- 情報 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1">
        <span class="truncate">{{ item.name || 'アイテム' }}</span>
        <!-- 名前・説明の編集 -->
        <button
          class="btn btn-ghost btn-xs btn-square shrink-0"
          title="名前・説明を編集"
          @click.stop="emit('open', 'base')"
        >
          <Pencil class="w-3.5 h-3.5" />
        </button>
      </div>
      <div v-if="item.description" class="text-xs opacity-70 truncate">{{ item.description }}</div>

      <div class="mt-1 flex flex-wrap items-center gap-1">
        <span class="text-xs">{{ percentage }}%</span>

        <!-- 追加条件 -->
        <button class="btn btn-ghost btn-xs gap-1" @click.stop="emit('open', 'condition')">
          <Filter class="w-3 h-3" />
          追加条件
        </button>
        <span v-if="item.lottery.isPriority" class="badge badge-sm badge-primary">優先</span>
        <span v-else-if="item.lottery.criteria" class="badge badge-xs badge-secondary">条件</span>
      </div>
    </div>

    <!-- Weight編集 -->
    <div class="text-base shrink-0" :class="{ 'text-base-content': isSelected }">
      <input
        v-if="!item.lottery.isPriority"
        type="number"
        :value="item.lottery.weight"
        @input="handleWeightUpdate"
        @click.stop
        min="0"
        step="1"
        class="input input-xs input-bordered w-16"
      />
    </div>

    <!-- メニュー -->
    <div class="shrink-0" @click.stop>
      <MenuDropdown @duplicate="emit('duplicate')" @delete="emit('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Filter, GripVertical, Pencil } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import type { WeightDialogName } from '../composables/useWeightItemDialog'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'

  defineProps<{
    item: OmikujiItemType
    percentage: string
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
    open: [name: WeightDialogName]
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
