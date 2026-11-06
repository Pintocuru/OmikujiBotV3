<!-- src/editor/assets/mikuji/MikujiSettings.vue -->
<!-- おみくじ一覧の設定UI(ツールバー + ヘッダー + 一覧編集) -->
<template>
  <!-- ツールバー -->
  <div class="flex justify-end gap-2">
    <div class="tooltip tooltip-bottom" :data-tip="t('omikujiItem.list.testTooltip')">
      <!-- 抽選テスト -->
      <button class="btn btn-info" :disabled="omikujiItem.length === 0" @click="postTestOmikuji(mikuji)">
        <Dices class="w-4 h-4" />
        {{ t('omikujiItem.list.test') }}
      </button>
    </div>

    <button class="btn btn-primary" @click="add">
      <Plus class="w-4 h-4" />
      {{ t('omikujiItem.list.add') }}
    </button>
  </div>

  <!-- おみくじ一覧 -->
  <div v-if="omikujiItem.length > 0" class="w-full overflow-x-auto">
    <!-- ヘッダー: 列幅は OmikujiRow と同じ grid-cols にしてある(変更時は両方を揃えること) -->
    <div class="grid grid-cols-[minmax(18rem,1fr)_1rem_16rem_7rem] items-center gap-2 px-2 pb-1 text-sm opacity-60">
      <span>おみくじ</span>
      <span />
      <span>実行内容</span>
      <span class="inline-flex items-center">
        クールダウン
        <CooldownHelpButton />
      </span>
    </div>

    <VueDraggable v-model="draggableItems" handle=".legend-drag-handle" :animation="200" class="w-full space-y-2">
      <OmikujiRow
        v-for="(item, index) in draggableItems"
        :key="item.id"
        :item="item"
        :percentage="percentages[index] ?? null"
        @update:weight="setWeight(index, $event)"
        @update:item="updateItem(index, $event)"
        @select="selectedId = item.id"
        @duplicate="duplicate(index)"
        @delete="remove(index)"
      />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import { Dices, Plus } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import { useTestPost } from '@/editor/helpers/useTestPost'
  import { useBoxOmikujiList } from './composables/useBoxOmikujiList'
  import OmikujiRow from './row/OmikujiRow.vue'
  import CooldownHelpButton from './cooldown/CooldownHelpButton.vue'

  const { t } = useI18n()

  const props = defineProps<{
    omikujiKey: string
  }>()

  const { postTestOmikuji } = useTestPost()

  const { mikuji, omikujiItem, percentages, selectedId, replaceAll, updateItem, setWeight, add, duplicate, remove } =
    useBoxOmikujiList(toRef(props, 'omikujiKey'))

  // ドラッグによる並べ替え
  const draggableItems = computed({
    get: () => omikujiItem.value,
    set: (val: OmikujiItemType[]) => replaceAll(val),
  })
</script>
