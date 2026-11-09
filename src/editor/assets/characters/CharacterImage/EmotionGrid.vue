<!-- src/editor/assets/characters/CharacterImage/EmotionGrid.vue -->
<template>
  <VueDraggable
    v-if="!readonly"
    v-model="draggableItems"
    :animation="150"
    handle=".drag-handle"
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    @end="handleDragEnd"
  >
    <div
      v-for="item in draggableItems"
      :key="item.key"
      class="relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg hover:border-primary group"
      :class="selectedKey === item.key ? 'border-primary bg-primary/10' : 'border-base-200'"
      @click="emit('select', item.key)"
    >
      <EmotionCard :item="item" show-drag-handle />

      <!-- 複製・削除(カード全体が選択クリックなので .stop)。default は削除不可 -->
      <div class="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          class="btn btn-xs btn-square btn-ghost"
          :title="t('characterImage.item.duplicateTip')"
          :aria-label="t('characterImage.item.duplicateTip')"
          @click.stop="emit('duplicate', item.key)"
        >
          <Copy class="w-3.5 h-3.5" />
        </button>
        <button
          v-if="item.key !== 'default'"
          type="button"
          class="btn btn-xs btn-square btn-ghost text-error"
          :title="t('characterImage.item.deleteTip')"
          :aria-label="t('characterImage.item.deleteTip')"
          @click.stop="emit('remove', item.key)"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </VueDraggable>

  <!-- readonly モード（IconSelectorModal 向け）: ドラッグ不可 -->
  <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <div
      v-for="item in draggableItems"
      :key="item.key"
      class="cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg hover:border-primary group"
      :class="selectedKey === item.key ? 'border-primary bg-primary/10' : 'border-base-200'"
      @click="emit('select', item.key)"
    >
      <EmotionCard :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Copy, Trash2 } from 'lucide-vue-next'
  import { VueDraggable } from 'vue-draggable-plus'
  import EmotionCard from './EmotionCard.vue'
  import type { CharacterImageSetType } from '@/types/OmikujiData'

  const { t } = useI18n()

  // ── 内部用型 ──────────────────────────────────────────────────────────────
  type EmotionEntry = {
    key: string
    value: CharacterImageSetType[string]
  }

  // ── Props / Emits ─────────────────────────────────────────────────────────
  const props = withDefaults(
    defineProps<{
      images: CharacterImageSetType
      selectedKey?: string
      readonly?: boolean
    }>(),
    { readonly: false }
  )

  const emit = defineEmits<{
    select: [key: string]
    reorder: [newImages: CharacterImageSetType]
    duplicate: [key: string]
    remove: [key: string]
  }>()

  // ── images オブジェクト → 配列へ変換
  // キーは加工せずそのまま使う(select / reorder の emit や selectedKey の比較が実キーと一致するため)。
  // 注意: JS のオブジェクトは「数字だけのキー」を常に昇順で先頭に並べるため、
  //       数字キーの感情は並び替えを保存できない(ドラッグしても元の位置に戻る)。
  const toEntries = (images: CharacterImageSetType) => Object.entries(images).map(([key, value]) => ({ key, value }))

  const draggableItems = ref<EmotionEntry[]>(toEntries(props.images))

  // 外部から images が変わったとき（追加・削除など）は配列を再同期する
  // ただしドラッグ中の不要な上書きを防ぐため、キー構成が変わった時だけ更新
  watch(
    () => props.images,
    (newImages) => {
      const newKeys = Object.keys(newImages).join(',')
      const currentKeys = draggableItems.value.map((e) => e.key).join(',')

      if (newKeys !== currentKeys) {
        // キー構成が変わった（追加・削除・並び替え）→ 全再構築
        draggableItems.value = toEntries(newImages)
      } else {
        // キーは同じ → 値だけ差し替え（label/src/animation の編集）
        draggableItems.value.forEach((entry) => {
          entry.value = newImages[entry.key]
        })
      }
    },
    { deep: false }
  )

  // ── ドラッグ完了 → 配列をオブジェクトに戻して emit ───────────────────────
  const handleDragEnd = () => {
    const reordered = Object.fromEntries(
      draggableItems.value.map(({ key, value }) => [key, value])
    ) as CharacterImageSetType
    emit('reorder', reordered)
  }
</script>
