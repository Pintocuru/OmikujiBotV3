<!-- src/editor/assets/mikuji/MikujiSettings.vue -->
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

  <!-- おみくじリスト一覧（クリックで選択） -->
  <!-- TODO: -->
  <div class="text-sm">おみくじ / シナリオ / クールダウン</div>
  <WeightBar
    :omikujiItems="omikujiList"
    :selectedOmikujiId="selectedId"
    @update:items="replaceAll"
    @update:weight="setWeight"
    @select="selectedId = $event"
  />
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import WeightBar from './weight/WeightBar.vue'
  import { useTestPost } from '@/editor/helpers/useTestPost'
  import { Dices, Plus } from 'lucide-vue-next'
  import { useBoxOmikujiList } from '@/editor/assets/mikuji/composables/useBoxOmikujiList'

  const { t } = useI18n()

  const props = defineProps<{
    omikujiKey: string
  }>()

  const { postTestOmikuji } = useTestPost()

  const { omikujiList, selectedId, replaceAll, setWeight, add } = useBoxOmikujiList(toRef(props, 'omikujiKey'))
</script>
