<!-- src/editor/content/top/TopCharacterSection.vue -->
<!-- TOPページ: キャラクター一覧(画像つき。並び替え不可) -->
<template>
  <section v-if="characterCards.length > 0" class="space-y-1.5">
    <TopCategoryHeader
      :icon="categoryContentMap.characters.icon"
      :title="t('categories.characters.label')"
      :description="t('categories.characters.description')"
      :count="characterCards.length"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1.5">
      <div
        v-for="{ character, layers } in characterCards"
        :key="character.key"
        class="group flex items-center gap-2 rounded-lg bg-base-200 p-2 text-left hover:bg-primary hover:text-primary-content transition-colors min-w-0 cursor-pointer"
        :class="{ 'opacity-50': character.isEnabled === false }"
        @click="goToItem('characters', character.key)"
      >
        <div class="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-base-300">
          <LayerImage v-if="layers.length > 0" :layers="layers" size="100%" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-lg font-bold truncate">
            {{ character.name || character.key }}
            <span class="text-sm"> {{ character.displayName ? `(表示名:${character.displayName})` : '' }}</span>
          </div>
          <div class="text-xs text-base-content/60 group-hover:text-primary-content truncate">
            {{ character.description }}
          </div>
        </div>
        <ItemMenu
          @edit="emit('edit', 'characters', character.key)"
          @duplicate="duplicateCharacter(character.key)"
          @remove="removeCharacter(character.key, character.displayName || character.name)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { CategoryType, CharacterType } from '@/types/OmikujiData'
  import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { sortByOrder } from '@/editor/helpers/sortByOrder'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useTopItemActions } from '../composables/useTopItemActions'
  import ItemMenu from './ItemMenu.vue'
  import TopCategoryHeader from './TopCategoryHeader.vue'

  const emit = defineEmits<{
    edit: [category: CategoryType, key: string]
  }>()

  const { t } = useI18n()
  const { getAssets } = useGetAssetData()
  const { goToItem, duplicateCharacter, removeCharacter } = useTopItemActions()

  // キャラクター画像: image の先頭エントリのレイヤーを使う
  const characterImage = (character: CharacterType): string[] => {
    const first = Object.values(character.image ?? {})[0]
    return first?.src ?? []
  }

  // characters は order 昇順(画像のレイヤーは、1 件ずつ 1 度だけ求める)
  const characterCards = computed(() =>
    sortByOrder(Object.values(getAssets('characters'))).map((character) => ({
      character,
      layers: characterImage(character),
    }))
  )
</script>
