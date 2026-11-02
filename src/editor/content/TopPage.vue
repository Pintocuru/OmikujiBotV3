<!-- src/editor/content/TopPage.vue -->
<template>
  <!-- ヘッダー帯 -->
  <SectionCard icon="Home" labelKey="topPage.label" descriptionKey="topPage.description">
    <div class="space-y-4">
      <!-- 1. ui で使われるもの -->
      <section v-if="uiItems.length > 0" class="space-y-1.5">
        <!-- カテゴリ見出し -->
        <div class="rounded-lg -mx-1 px-1">
          <SubSectionHeader :icon="categoryMap.ui.icon" :title="t('categories.ui.label')">
            <span class="text-sm font-normal text-base-content/60">
              {{ t(uiItems.length === 1 ? 'topPage.countOne' : 'topPage.count', { count: uiItems.length }) }}
            </span>
          </SubSectionHeader>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1.5">
          <!-- UI アイテム -->
          <button
            v-for="item in uiItems"
            :key="item.kind"
            type="button"
            class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 text-left hover:bg-primary hover:text-primary-content transition-colors min-w-0 cursor-pointer"
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
      <section v-if="characterCards.length > 0" class="space-y-1.5">
        <div class="rounded-lg -mx-1 px-1">
          <SubSectionHeader :icon="categoryMap.characters.icon" :title="t('categories.characters.label')">
            <span class="text-sm font-normal text-base-content/60">
              {{
                t(characterCards.length === 1 ? 'topPage.countOne' : 'topPage.count', {
                  count: characterCards.length,
                })
              }}
            </span>
          </SubSectionHeader>
        </div>

        <!-- キャラクター アイテム -->
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
                {{ character.displayName || character.name || character.key }}
              </div>
              <div class="text-xs text-base-content/60 truncate">{{ character.description }}</div>
            </div>
            <ItemMenu
              @edit="openEdit('characters', character.key)"
              @duplicate="duplicateCharacter(character.key)"
              @remove="removeCharacter(character.key, character.displayName || character.name)"
            />
          </div>
        </div>
      </section>

      <!-- 3. events: 全データ(0件のカテゴリは非表示)。ドラッグで並び替え可能 -->
      <section v-for="section in eventSections" :key="section.category" class="space-y-1.5">
        <div class="rounded-lg -mx-1 px-1">
          <SubSectionHeader
            :icon="categoryMap[section.category].icon"
            :title="t(`categories.${section.category}.label`)"
          >
            <span class="text-sm font-normal text-base-content/60">
              {{ t(section.items.length === 1 ? 'topPage.countOne' : 'topPage.count', { count: section.items.length }) }}
            </span>
          </SubSectionHeader>
        </div>

        <!-- ドロップ後、並び順を reorderEvents で配列に反映(サイドバーのドラッグと同じ) -->
        <VueDraggable
          :model-value="section.items"
          tag="div"
          class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1.5"
          :animation="150"
          @update:model-value="onEventDrag(section.category, $event)"
        >
          <div
            v-for="event in section.items"
            :key="event.id"
            class="group flex items-center gap-1 rounded-lg bg-base-200 px-3 py-2 text-left hover:bg-primary hover:text-primary-content transition-colors min-w-0 cursor-pointer"
            :class="{ 'opacity-50': event.isEnabled === false }"
            @click="goToItem(section.category, event.id)"
          >
            <div class="min-w-0 flex-1">
              <div class="text-lg font-bold truncate">{{ event.name || event.id }}</div>
              <div class="text-xs text-base-content/60 truncate">{{ event.description }}</div>
            </div>
            <ItemMenu
              @edit="openEdit(section.category, event.id)"
              @duplicate="duplicateEventItem(section.category, event.id)"
              @remove="removeEventItem(section.category, event.id, event.name)"
            />
          </div>
        </VueDraggable>
      </section>
    </div>

    <!-- 基本設定の編集ダイアログ(対象アイテムを一時選択して開く) -->
    <ItemEditDialog v-model:open="editOpen" />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { VueDraggable } from 'vue-draggable-plus'
  import { eventCategory, type CategoryType, type EventCategoryType, type CharacterType } from '@/types/OmikujiData'
  import { categoryMap } from '@/maps/OmikujiData'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { sortByOrder } from '@/editor/helpers/sortByOrder'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { useVisibleUiKinds } from '../ui/useVisibleUiKinds'
  import ItemEditDialog from './summary/ItemEditDialog.vue'
  import ItemMenu from './ItemMenu.vue'

  const { t } = useI18n()

  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)
  const omikujiStore = useOmikujiStore()
  const { getEvents } = useGetEventData()
  const { getAssets } = useGetAssetData()

  // 選択中レイアウトが使う UI のうち、登録済みのもの(UiEditor と同じ条件)
  const visibleUiKinds = useVisibleUiKinds()
  const uiItems = computed(() =>
    visibleUiKinds.value.map(({ kind, entry }) => ({ kind, icon: resolveLucideIcon(entry.icon) }))
  )

  // ui カテゴリを開き、該当タブを選択
  const goToUiSection = (kind: string) => {
    navigationStore.selectCategory('ui')
    navigationStore.selectItem(null, kind)
  }

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

  // events はカテゴリごとに order 昇順。0件のカテゴリは除外
  const eventSections = computed(() =>
    eventCategory
      .map((category) => ({ category, items: sortByOrder(getEvents(category)) }))
      .filter((section) => section.items.length > 0)
  )

  const goToItem = (category: CategoryType, key: string) => {
    navigationStore.selectCategory(category)
    navigationStore.selectItem(key)
  }

  // 編集(ItemEditDialog):対象を一時選択してから開く(TOPページからは移動しない)
  const editOpen = ref(false)
  const openEdit = (category: CategoryType, key: string) => {
    selectedCategory.value = category
    selectedItemKey.value = key
    editOpen.value = true
  }

  // メニュー操作後にフォーカスを外して dropdown を閉じる
  const closeMenu = () => {
    ;(document.activeElement as HTMLElement)?.blur()
  }

  // characters: 複製・削除
  const duplicateCharacter = (key: string) => {
    omikujiStore.duplicateAsset('characters', key)
    swalToast.success({ title: t('navigation.menu.duplicateSuccess') })
    closeMenu()
  }

  const removeCharacter = async (key: string, name?: string) => {
    closeMenu()
    const label = name || t('navigation.unnamed')
    const result = await swalModal.confirmDelete({ title: t('navigation.menu.deleteConfirmTitle', { name: label }) })
    if (!result.isConfirmed) return
    omikujiStore.removeAsset('characters', key)
    // 選択中のアイテムを消した場合は選択解除
    if (selectedItemKey.value === key) selectedItemKey.value = null
    swalToast.success({ title: t('navigation.menu.deleteSuccess', { name: label }) })
  }

  // events: 複製・削除
  const duplicateEventItem = (category: EventCategoryType, id: string) => {
    omikujiStore.duplicateEvent(category, id)
    swalToast.success({ title: t('navigation.menu.duplicateSuccess') })
    closeMenu()
  }

  const removeEventItem = async (category: EventCategoryType, id: string, name?: string) => {
    closeMenu()
    const label = name || t('navigation.unnamed')
    const result = await swalModal.confirmDelete({ title: t('navigation.menu.deleteConfirmTitle', { name: label }) })
    if (!result.isConfirmed) return
    omikujiStore.removeEvent(category, id)
    // 選択中のアイテムを消した場合は選択解除
    if (selectedItemKey.value === id) selectedItemKey.value = null
    swalToast.success({ title: t('navigation.menu.deleteSuccess', { name: label }) })
  }

  // events: ドラッグ後の並び順を配列に反映(サイドバーの並び替えと同じ reorderEvents)
  const onEventDrag = (category: EventCategoryType, ordered: { id: string }[]) => {
    omikujiStore.reorderEvents(
      category,
      ordered.map((event) => event.id)
    )
  }
</script>
