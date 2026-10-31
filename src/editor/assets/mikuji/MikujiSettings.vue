<!-- src/editor/assets/mikuji/MikujiSettings.vue -->
<template>
  <!-- ツールバー -->
  <div class="flex justify-end gap-2">
    <!-- おみくじテストボタン -->
    <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
      <button class="btn btn-info" @click="postTestOmikuji(omikujiList)" :disabled="omikujiList.length === 0">
        <Dices class="w-4 h-4" />
        抽選テスト
      </button>
    </div>

    <button @click="add" class="btn btn-primary">
      <Plus class="w-4 h-4" />
      おみくじを追加
    </button>
  </div>

  <!-- おみくじリスト一覧（クリックで選択） -->
  <WeightBar
    :omikujiItems="omikujiList"
    :selectedOmikujiId="selectedId"
    @update:items="replaceAll"
    @update:weight="setWeight"
    @select="selectedId = $event"
  />

  <!-- TODO:以下の内容は、ダイアログで表示する -->
  <!-- 選択されたアイテムの編集 -->
  <template v-if="selectedItem && selectedIndex !== null">
    <!-- 本文 -->
    <OmikujiItemEditor :omikujiItem="selectedItem" @update="updateSelected" />
  </template>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import WeightBar from './weight/WeightBar.vue'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import OmikujiItemEditor from './item/OmikujiItemEditor.vue'
  import { useTestPost } from '@/editor/helpers/useTestPost'
  import { Dices, Plus } from 'lucide-vue-next'
  import { getColorForIndex } from '@/editor/assets/mikuji/composables/useOmikujiWeight'
  import { useBoxOmikujiList } from '@/editor/assets/mikuji/composables/useBoxOmikujiList'

  const props = defineProps<{
    omikujiKey: string
  }>()

  const { postTestOmikuji } = useTestPost()

  const { omikujiList, selectedId, selectedIndex, selectedItem, replaceAll, setWeight, updateSelected, add } =
    useBoxOmikujiList(toRef(props, 'omikujiKey'))
</script>
