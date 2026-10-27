<!-- src/editor/apps/navigation/SidebarMikujiItems.vue -->
<!-- 選択中レコードが指すおみくじBOXのアイテム一覧(クリックで選択) -->
<template>
  <div v-if="items.length > 0" class="ml-4 border-l-2 border-base-300 max-h-64 overflow-y-auto">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="flex items-center gap-1 pl-2 pr-1 rounded cursor-pointer hover:bg-base-200 hover:text-base-content"
      :class="[
        item.id === selectedId
          ? ['bg-primary text-primary-content', index % 2 === 1 ? '' : 'bg-neutral-content/15 text-neutral']
          : 'bg-neutral text-neutral-content',
      ]"
      @click="select(item.id)"
    >
      <!-- 優先マーク(優先でないアイテムは名前の位置を揃えるための空白) -->
      <span class="w-3 h-3 shrink-0" :title="item.lottery.isPriority ? '優先' : undefined">
        <Star v-if="item.lottery.isPriority" class="w-3 h-3 text-warning fill-current" />
      </span>

      <span class="text-xs py-0.5 truncate flex-1 min-w-0 select-none">
        {{ item.name || `アイテム${index + 1}` }}
      </span>

      <!-- 重さ(優先アイテムは weight を使わないので出さない) -->
      <span v-if="!item.lottery.isPriority" class="text-[10px] opacity-60 tabular-nums shrink-0">
        {{ item.lottery.weight }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Star } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useMikujiSelectionStore } from '@/editor/stores/useMikujiSelectionStore'

  const props = defineProps<{
    omikujiKey: string
  }>()

  const { getAsset } = useGetAssetData()
  const selection = useMikujiSelectionStore()

  const items = computed<OmikujiItemType[]>(() => getAsset('mikuji', props.omikujiKey)?.omikuji ?? [])
  const selectedId = computed(() => selection.selectedIdByBox[props.omikujiKey] ?? null)

  const select = (id: string) => {
    selection.selectedIdByBox[props.omikujiKey] = id
  }
</script>
