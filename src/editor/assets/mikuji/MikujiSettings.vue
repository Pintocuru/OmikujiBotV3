<!-- src/editor/assets/mikuji/MikujiSettings.vue -->
<!-- おみくじ一覧の設定UI(ツールバー + ヘッダー + 一覧編集) -->
<template>
  <!-- ツールバー -->
  <div class="flex justify-end gap-2">
    <!-- おみくじテストボタン -->
    <div class="tooltip tooltip-bottom" :data-tip="t('omikujiItem.list.testTooltip')">
      <button class="btn btn-info" @click="postTestOmikuji(omikujiList)" :disabled="omikujiList.length === 0">
        <Dices class="w-4 h-4" />
        {{ t('omikujiItem.list.test') }}
      </button>
    </div>

    <button @click="add" class="btn btn-primary">
      <Plus class="w-4 h-4" />
      {{ t('omikujiItem.list.add') }}
    </button>
  </div>

  <!-- おみくじリスト一覧(クリックで選択) -->
  <div v-if="omikujiList.length > 0" class="w-full">
    <!-- ヘッダー(行と同じ flex レイアウトで各カラムの上に配置) -->
    <div class="flex flex-wrap items-center gap-2 px-1 pb-1 text-sm opacity-60">
      <span class="flex-1">おみくじ</span>
      <span class="w-4" /><!-- 行の「→」分の余白 -->
      <span>シナリオ</span>
      <span>クールダウン</span>
    </div>

    <VueDraggable v-model="draggableItems" handle=".legend-drag-handle" :animation="200" class="w-full space-y-2">
      <OmikujiRow
        v-for="(item, index) in draggableItems"
        :key="item.id ?? `legend-${index}`"
        :item="item"
        :color="getColorForIndex(index)"
        :percentage="String(localItems[index]?.weightPercent)"
        @update:weight="setWeight({ index, weight: $event })"
        @select="selectedId = item.id"
        @duplicate="duplicate(index)"
        @delete="remove(index)"
        @update:item="updateItem(index, $event)"
      />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import { Dices, Plus } from 'lucide-vue-next'
  import OmikujiRow from './weight/OmikujiRow.vue'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { addWeightPercentages } from '@/engine/DrawOmikuji/DrawOmikuji'
  import { useTestPost } from '@/editor/helpers/useTestPost'
  import { useBoxOmikujiList } from '@/editor/assets/mikuji/composables/useBoxOmikujiList'
  import { getColorForIndex, duplicateItemAt, removeItemAt } from './composables/useOmikujiWeight'

  const { t } = useI18n()

  const props = defineProps<{
    omikujiKey: string
  }>()

  const { postTestOmikuji } = useTestPost()

  const { omikujiList, selectedId, replaceAll, setWeight, add } = useBoxOmikujiList(toRef(props, 'omikujiKey'))

  // 各行の重み割合(表示用)
  const localItems = computed(() => addWeightPercentages(omikujiList.value))

  // ドラッグによる並べ替え
  const draggableItems = computed({
    get: () => omikujiList.value,
    set: (val: OmikujiItemType[]) => replaceAll(val),
  })

  const duplicate = (index: number) => replaceAll(duplicateItemAt(omikujiList.value, index))
  const remove = (index: number) => replaceAll(removeItemAt(omikujiList.value, index))
  // 1 件分の更新を、一覧全体の更新として反映する
  const updateItem = (index: number, item: OmikujiItemType) =>
    replaceAll(omikujiList.value.map((v, i) => (i === index ? item : v)))
</script>
