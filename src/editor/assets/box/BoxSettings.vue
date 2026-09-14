<!-- src/editor/assets/box/BoxSettings.vue -->
<template>
  <div v-if="omikujiKey" class="space-y-4">
    <!-- ツールバー -->
    <div class="flex justify-end gap-2">
      <!-- キャラクター一括変更ボタン -->
      <CharacterChanger :category="category" :selectedId="omikujiKey" />
      <IconKeyChanger :category="category" :selectedId="omikujiKey" />

      <!-- おみくじテストボタン -->
      <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
        <button
          class="btn btn-info"
          @click="postTestOmikuji(item?.omikuji ?? [])"
          :disabled="!item || item.omikuji.length === 0"
        >
          <Dices class="w-4 h-4" />
          抽選テスト
        </button>
      </div>

      <button @click="addOmikuji" class="btn btn-primary">
        <Plus class="w-4 h-4" />
        おみくじを追加
      </button>
    </div>

    <!-- おみくじリスト一覧（クリックで選択） -->
    <OmikujiWeightProgressBar
      :category="category"
      :omikujiKey="omikujiKey"
      :items="item"
      :selectedId="selectedOmikujiId"
      @update:items="item = $event"
      @update:weight="({ index, weight }) => (item = updateItemWeight(item, index, weight))"
      @select="selectedOmikujiId = $event"
    />

    <!-- 選択されたアイテムの編集 -->
    <template v-if="selectedOmikujiIndex !== null">
      <!-- 帯ヘッダー -->
      <div
        class="flex items-center justify-between px-4 py-2 font-bold text-white"
        :style="{ backgroundColor: getColorForIndex(selectedOmikujiIndex) }"
      >
        <h3 class="text-sm md:text-base">
          おみくじ編集:
          {{ item[selectedOmikujiIndex]?.name || `アイテム${selectedOmikujiIndex + 1}` }}
        </h3>
      </div>

      <!-- 本文 -->
      <OmikujiItemEditor :category="category" :omikujiKey="omikujiKey" :index="selectedOmikujiIndex" />
    </template>

    <!-- 選択していない場合のメッセージ -->
    <div v-else class="card bg-base-200 shadow p-6 text-center">
      <p class="text-base-content/60">上のリストからおみくじアイテムをクリックして編集してください</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { OmikujiItemSchema, EventCategoryType, BoxType } from '@/types/OmikujiData/'
  import OmikujiWeightProgressBar from './OmikujiWeightProgressBar.vue'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import OmikujiItemEditor from './OmikujiItemEditor.vue'

  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useTestPost } from '@/editor/helpers/useTestPost.js'

  import { Dices, Plus } from 'lucide-vue-next'
  import { getColorForIndex, updateItemWeight } from '@/editor/assets/box/useOmikujiWeight.js'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData.js'

  const props = defineProps<{
    category: EventCategoryType | 'box'
    omikujiKey: string | null
  }>()

  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()
  const { postTestOmikuji } = useTestPost()

  // 選択されたおみくじアイテムのインデックス
  const selectedOmikujiId = ref<string | null>(null)

  // Computed
  const item = computed({
    get: () => {
      if (!props.omikujiKey) return null
      return getAsset('box', props.omikujiKey)
    },
    set: (value: BoxType) => {
      if (!props.omikujiKey) return
      updateAsset('box', props.omikujiKey, value)
    },
  })

  const selectedOmikujiIndex = computed(() => {
    if (!item.value || !selectedOmikujiId.value) return null
    return item.value.omikuji.findIndex((v) => v.id === selectedOmikujiId.value)
  })

  // Methods
  const addOmikuji = () => {
    const newOmikuji = OmikujiItemSchema.parse({})
    if (!item.value) return
    item.value = { ...item.value, omikuji: [...item.value.omikuji, newOmikuji] }
    selectedOmikujiId.value = newOmikuji.id
  }

  watch(
    () => props.omikujiKey,
    () => {
      if (!item.value || item.value.omikuji.length === 0) {
        selectedOmikujiId.value = null
      } else {
        selectedOmikujiId.value = item.value.omikuji[0].id
      }
    }
  )
</script>
