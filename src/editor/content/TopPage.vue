<!-- src/editor/content/TopPage.vue -->
<template>
  <!-- ヘッダー帯 -->
  <SectionCard icon="Home" label="TOPページ" description="編集したい項目を選んでください">
    <div class="space-y-4">
      <!-- 1. ui で使われるもの -->
      <section v-if="uiItems.length > 0" class="space-y-1">
        <button
          type="button"
          class="flex items-center gap-2 px-1 text-lg font-bold hover:text-primary transition-colors"
          @click="goToCategory('ui')"
        >
          <component :is="uiIcon" class="w-4 h-4" />
          {{ t('categories.ui.label') }}
          <span class="font-normal text-base-content/50">({{ uiItems.length }}件)</span>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1.5">
          <button
            v-for="item in uiItems"
            :key="item.kind"
            type="button"
            class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-left hover:bg-base-300 transition-colors min-w-0"
            @click="goToUiSection(item.kind)"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <div class="min-w-0">
              <div class="text-lg font-bold truncate">{{ t(`mapText.uiKind.${item.kind}.label`) }}</div>
              <div class="text-xs text-base-content/60 truncate">
                {{ t(`mapText.uiKind.${item.kind}.description`) }}
              </div>
            </div>
          </button>
        </div>
      </section>

      <!-- 2. assets: characters(画像つき) -->
      <section v-if="characterList.length > 0" class="space-y-1">
        <button
          type="button"
          class="flex items-center gap-2 px-1 text-lg font-bold hover:text-primary transition-colors"
          @click="goToCategory('characters')"
        >
          <component :is="charactersIcon" class="w-4 h-4" />
          {{ t('categories.characters.label') }}
          <span class="font-normal text-base-content/50">({{ characterList.length }}件)</span>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1.5">
          <button
            v-for="character in characterList"
            :key="character.key"
            type="button"
            class="flex items-center gap-2 rounded-lg bg-base-200 p-2 text-left hover:bg-base-300 transition-colors min-w-0"
            :class="{ 'opacity-50': character.isEnabled === false }"
            @click="goToItem('characters', character.key)"
          >
            <div class="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-base-300">
              <LayerImage v-if="characterImage(character).length > 0" :layers="characterImage(character)" size="100%" />
            </div>
            <div class="min-w-0">
              <div class="text-lg font-bold truncate">
                {{ character.displayName || character.name || character.key }}
              </div>
              <div class="text-xs text-base-content/60 truncate">{{ character.description }}</div>
            </div>
          </button>
        </div>
      </section>

      <!-- 3. events: 全データ(0件のカテゴリは非表示) -->
      <section v-for="section in eventSections" :key="section.category" class="space-y-1">
        <button
          type="button"
          class="flex items-center gap-2 px-1 text-lg font-bold hover:text-primary transition-colors"
          @click="goToCategory(section.category)"
        >
          <component :is="eventIcon(section.category)" class="w-4 h-4" />
          {{ t(`categories.${section.category}.label`) }}
          <span class="font-normal text-base-content/50">({{ section.items.length }}件)</span>
        </button>

        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
          <button
            v-for="event in section.items"
            :key="event.id"
            type="button"
            class="rounded-lg bg-base-200 px-3 py-2 text-left hover:bg-base-300 transition-colors min-w-0"
            :class="{ 'opacity-50': event.isEnabled === false }"
            @click="goToItem(section.category, event.id)"
          >
            <div class="text-lg font-bold truncate">{{ event.name || event.id }}</div>
            <div class="text-xs text-base-content/60 truncate">{{ event.description }}</div>
          </button>
        </div>
      </section>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import {
    eventCategory,
    type CategoryType,
    type EventCategoryType,
    type CharacterType,
    UiKind,
  } from '@/types/OmikujiData'
  import { categoryMap, uiLayoutMap } from '@/maps/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { getUiEditorEntries } from '../ui/uiEditorRegistry'
  import { useOmikujiStore } from '../stores/useOmikujiStore'

  const { t } = useI18n()

  const { data } = storeToRefs(useOmikujiStore())
  const navigationStore = useNavigationStore()
  const { getEvents } = useGetEventData()
  const { getAssets } = useGetAssetData()

  const uiIcon = resolveLucideIcon(categoryMap.ui.icon)
  const charactersIcon = resolveLucideIcon(categoryMap.characters.icon)
  const eventIcon = (category: EventCategoryType) => resolveLucideIcon(categoryMap[category].icon)

  // 選択中レイアウトが使う UI のうち、登録済みのもの(UiEditor.vue と同じ条件)
  const uiItems = computed(() => {
    const kinds = uiLayoutMap[data.value.ui.layout].kinds
    return Object.entries(getUiEditorEntries())
      .filter(([kind]) => kinds.includes(kind as UiKind))
      .map(([kind, entry]) => ({ kind, icon: resolveLucideIcon(entry.icon) }))
  })

  // ui カテゴリを開き、該当タブを選択
  const goToUiSection = (kind: string) => {
    navigationStore.selectCategory('ui')
    navigationStore.selectItem(null, kind)
  }

  // characters は order 昇順
  const characterList = computed(() =>
    Object.values(getAssets('characters')).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  // キャラクター画像: image の先頭エントリのレイヤーを使う
  const characterImage = (character: CharacterType): string[] => {
    const first = Object.values(character.image ?? {})[0]
    return first?.src ?? []
  }

  // events はカテゴリごとに order 昇順。0件のカテゴリは除外
  const eventSections = computed(() =>
    eventCategory
      .map((category) => ({
        category,
        items: [...getEvents(category)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      }))
      .filter((section) => section.items.length > 0)
  )

  const goToCategory = (category: CategoryType) => {
    navigationStore.selectCategory(category)
  }

  const goToItem = (category: CategoryType, key: string) => {
    navigationStore.selectCategory(category)
    navigationStore.selectItem(key)
  }
</script>
