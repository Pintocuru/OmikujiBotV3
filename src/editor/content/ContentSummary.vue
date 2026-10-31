<!-- src/editor/content/ContentSummary.vue -->
<template>
  <div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
    <!-- 基本設定の概要 -->
    <section class="w-full rounded-box border border-base-300 bg-base-200/40 p-4 min-w-0">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h3 class="font-semibold">{{ t('categorySections.baseSettings.label') }}</h3>
        <button class="btn btn-xs btn-ghost" @click="editOpen = true">
          <Pencil class="w-3.5 h-3.5" />
          {{ t('connections.switcher.edit') }}
        </button>
      </div>

      <!-- 名称 -->
      <dl v-if="selectedItem" class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <!-- イベント名 -->
        <dt class="opacity-60">{{ t('baseSettings.eventName.label') }}</dt>
        <dd class="wrap-break-word">{{ selectedItem.name || '—' }}</dd>

        <!-- 説明 -->
        <template v-if="selectedItem.description">
          <dt class="opacity-60">{{ t('baseSettings.description.label') }}</dt>
          <dd class="wrap-break-word">{{ selectedItem.description }}</dd>
        </template>

        <!-- タグ -->
        <template v-if="selectedItem.tags?.length">
          <dt class="opacity-60">{{ t('baseSettings.tags.label') }}</dt>
          <dd class="flex flex-wrap gap-1">
            <span v-for="tag in selectedItem.tags" :key="tag" class="badge badge-sm badge-outline">{{ tag }}</span>
          </dd>
        </template>
      </dl>
    </section>

    <!-- 使用キャラクター -->
    <section class="w-full rounded-box border border-base-300 bg-base-200/40 p-4 min-w-0">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h3 class="font-semibold">{{ t('connections.summary.characters') }}</h3>
        <span class="badge badge-sm badge-outline">{{ characters.length }}</span>
      </div>

      <div v-if="characters.length" class="flex flex-wrap gap-3">
        <div v-for="character in characters" :key="character.key" class="flex items-center gap-2 min-w-0">
          <div class="avatar">
            <div class="relative w-12 h-12 rounded-lg bg-base-300 overflow-hidden">
              <template v-if="character.images.length">
                <img
                  v-for="(src, index) in character.images"
                  :key="`${character.key}:${index}`"
                  :src="src"
                  class="absolute inset-0 w-full h-full object-contain"
                />
              </template>
              <div v-else class="w-full h-full flex items-center justify-center text-base-content/50">
                <ImageOff v-if="character.exists" class="w-6 h-6" />
                <CircleHelp v-else class="w-7 h-7 text-warning" />
              </div>
            </div>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ character.name }}</p>
            <p v-if="!character.exists" class="text-xs text-warning">
              {{ t('connections.summary.undefinedCharacter', { key: character.key }) }}
            </p>
            <p v-else-if="!character.images.length" class="text-xs opacity-60">
              {{ t('connections.summary.noImage') }}
            </p>
          </div>
        </div>
      </div>
      <p v-else class="text-sm opacity-60">{{ t('connections.summary.noCharacters') }}</p>

      <div v-if="allTargets.length" class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-base-300">
        <CharacterChanger category="scenarios" :targets="allTargets" />
        <IconKeyChanger category="scenarios" :targets="allTargets" />
      </div>
    </section>
  </div>

  <ItemEditDialog v-model:open="editOpen" />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { CircleHelp, ImageOff, Pencil } from 'lucide-vue-next'
  import { useCharacterStats } from '@/editor/helpers/CharacterChanger/composables/useCharacterStats'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useCharacterTargets } from './composables/useCharacterTargets'
  import { useSelectedItem } from './composables/useSelectedItem'
  import ItemEditDialog from './header/ItemEditDialog.vue'

  const { t } = useI18n()
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  const { selectedItem } = useSelectedItem()
  const { getCharacter, getCharacterName, iconSrc } = useCharacterLookup()
  const { allTargets } = useCharacterTargets()

  const editOpen = ref(false)

  // 別のアイテムへ移ったとき、開きっぱなしの編集ダイアログを閉じる
  watch(selectedItemKey, () => {
    editOpen.value = false
  })

  const { uniqueCharacterKeys } = useCharacterStats(allTargets)

  const characters = computed(() =>
    uniqueCharacterKeys.value.map((key) => {
      const character = getCharacter(key)
      return {
        key,
        exists: !!character,
        name: character ? getCharacterName(key) || key : '？',
        images: character ? iconSrc(key, 'default') : [],
      }
    })
  )
</script>
