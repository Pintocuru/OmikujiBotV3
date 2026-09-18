<!-- src/editor/assets/box/OmikujiLegendItem.vue -->
<template>
  <div
    class="flex items-center gap-2 text-xs bg-base-100 p-2 rounded shadow-sm hover:shadow-md transition-all cursor-pointer"
    :class="{ 'bg-primary text-primary-content': isSelected }"
    @click="$emit('select')"
  >
    <!-- ドラッグハンドル -->
    <div class="legend-drag-handle cursor-move shrink-0">
      <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
    </div>

    <!-- 色インジケーター -->
    <div class="w-4 h-4 rounded shrink-0" :style="{ backgroundColor: color }"></div>

    <!-- 情報 -->
    <div class="flex-1 min-w-0">
      <div class="truncate font-medium">
        {{ item.name || `アイテム` }}
      </div>
      {{ percentage }}%

      <div class="text-base">
        <span v-if="item.lottery.isPriority" class="badge badge-xs badge-primary"> 優先 </span>
        <span v-if="!item.lottery.isPriority && item.lottery.criteria" class="badge badge-xs badge-secondary ml-1">
          条件
        </span>
      </div>
    </div>

    <!-- Weight編集 -->
    <div class="text-base" :class="{ 'text-base-content': isSelected }">
      <input
        v-if="!item.lottery.isPriority"
        type="number"
        :value="item.lottery.weight"
        @input="handleWeightUpdate"
        @click.stop
        min="0"
        step="1"
        class="input input-xs input-bordered w-16 shrink-0"
      />
    </div>

    <!-- メニュー -->
    <div class="ml-auto">
      <MenuDropdown @duplicate="$emit('duplicate')" @delete="$emit('delete')" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import MenuDropdown from '@/editor/parts/MenuDropdown/MenuDropdown.vue'
  import { GripVertical } from 'lucide-vue-next'

  defineProps<{
    item: OmikujiItemType
    color: string
    percentage: string
    isSelected: boolean
  }>()

  const emit = defineEmits<{
    'update:weight': [weight: number]
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
