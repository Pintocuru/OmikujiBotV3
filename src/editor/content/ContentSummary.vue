<!-- src/editor/content/ContentSummary.vue -->
<template>
  <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
    <!-- 基本設定の概要 -->
    <section class="rounded-box border border-base-300 bg-base-200/40 p-4 min-w-0">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h3 class="font-semibold">{{ t('categorySections.baseSettings.label') }}</h3>
        <button class="btn btn-xs btn-ghost" @click="editOpen = true">
          <Pencil class="w-3.5 h-3.5" />
          {{ t('connections.switcher.edit') }}
        </button>
      </div>

      <dl v-if="selectedItem" class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <dt class="opacity-60">{{ t('baseSettings.key.label') }}</dt>
        <dd class="break-all font-mono">{{ selectedItem.key }}</dd>

        <dt class="opacity-60">{{ t('baseSettings.eventName.label') }}</dt>
        <dd class="break-words">{{ selectedItem.name || '—' }}</dd>

        <template v-if="selectedItem.description">
          <dt class="opacity-60">{{ t('baseSettings.description.label') }}</dt>
          <dd class="break-words">{{ selectedItem.description }}</dd>
        </template>

        <template v-if="selectedItem.isEnabled !== undefined">
          <dt class="opacity-60">{{ t('baseSettings.isEnabled.label') }}</dt>
          <dd>
            <span :class="['badge badge-sm', selectedItem.isEnabled === false ? 'badge-warning' : 'badge-success']">
              {{ selectedItem.isEnabled === false ? '無効' : '有効' }}
            </span>
          </dd>
        </template>

        <template v-if="selectedItem.tags?.length">
          <dt class="opacity-60">{{ t('baseSettings.tags.label') }}</dt>
          <dd class="flex flex-wrap gap-1">
            <span v-for="tag in selectedItem.tags" :key="tag" class="badge badge-sm badge-outline">{{ tag }}</span>
          </dd>
        </template>
      </dl>
    </section>

    <!-- 使用キャラクター -->
    <section class="rounded-box border border-base-300 bg-base-200/40 p-4 min-w-0">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h3 class="font-semibold">使用キャラクター</h3>
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
            <p v-if="!character.exists" class="text-xs text-warning">未定義: {{ character.key }}</p>
            <p v-else-if="!character.images.length" class="text-xs opacity-60">画像なし</p>
          </div>
        </div>
      </div>
      <p v-else class="text-sm opacity-60">使用されているキャラクターはありません。</p>

      <div v-if="changerTargets.length" class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-base-300">
        <template v-for="target in changerTargets" :key="`${target.category}:${target.selectedId ?? 'all'}`">
          <CharacterChanger :category="target.category" :selectedId="target.selectedId" />
          <IconKeyChanger :category="target.category" :selectedId="target.selectedId" />
        </template>
      </div>
    </section>
  </div>

  <ItemEditDialog v-model:open="editOpen" />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { CircleHelp, ImageOff, Pencil } from 'lucide-vue-next'
  import type { FlowTarget, TargetCategoryType } from '@/editor/helpers/CharacterChanger/composables/useDataExtractor'
  import { useCharacterStats } from '@/editor/helpers/CharacterChanger/composables/useCharacterStats'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useReferenceGraph } from './composables/useReferenceGraph'
  import { useSelectedItem } from './composables/useSelectedItem'
  import ItemEditDialog from './header/ItemEditDialog.vue'

  const { t } = useI18n()
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { selectedItem } = useSelectedItem()
  const { getAsset } = useGetAssetData()
  const { getEvent, isEventCategory } = useGetEventData()
  const { getCharacter, getCharacterName, iconSrc } = useCharacterLookup()
  const { scenariosOfPlaceholder, parentPlaceholders, calledScenarios } = useReferenceGraph()

  const editOpen = ref(false)

  // 選択中のアイテムから、キャラクター抽出対象となるシナリオ / みくじ箱を解決する
  const scenariosFromBox = (boxKey: string): FlowTarget[] => {
    const box = getAsset('mikuji', boxKey)
    const keys = new Set((box?.omikuji ?? []).flatMap((item) =>
      item.kind === 'steps' && item.stepKey ? calledScenarios(item.stepKey).map((scenario) => scenario.key) : []
    ))
    return [...keys].flatMap((scenarioKey) => {
      const scenario = getAsset('scenarios', scenarioKey)
      return scenario ? [{ category: 'scenarios' as const, item: scenario }] : []
    })
  }

  const allTargets = computed<FlowTarget[]>(() => {
    const category = selectedCategory.value
    const key = selectedItemKey.value
    if (!key) return []

    if (isEventCategory(category)) {
      const event = getEvent(category, key)
      return event?.omikujiKey ? scenariosFromBox(event.omikujiKey) : []
    }

    if (category === 'mikuji') {
      return scenariosFromBox(key)
    }

    if (category === 'scenarios') {
      return calledScenarios(key).flatMap(({ key: scenarioKey }) => {
        const scenario = getAsset('scenarios', scenarioKey)
        return scenario ? [{ category: 'scenarios' as const, item: scenario }] : []
      })
    }

    if (category === 'placeholders') {
      const placeholderKeys = new Set<string>([key])
      const queue = [key]
      while (queue.length) {
        const current = queue.pop()!
        for (const parent of parentPlaceholders(current)) {
          if (placeholderKeys.has(parent.key)) continue
          placeholderKeys.add(parent.key)
          queue.push(parent.key)
        }
      }

      const scenarioKeys = new Set(
        [...placeholderKeys].flatMap((placeholderKey) =>
          scenariosOfPlaceholder(placeholderKey).flatMap((scenario) =>
            calledScenarios(scenario.key).map((called) => called.key)
          )
        )
      )
      return [...scenarioKeys].flatMap((scenarioKey) => {
        const scenario = getAsset('scenarios', scenarioKey)
        return scenario ? [{ category: 'scenarios' as const, item: scenario }] : []
      })
    }

    return []
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

  // 実際に参照されるシナリオごとに変更対象を分ける
  const changerTargets = computed<{ category: TargetCategoryType; selectedId?: string }[]>(() =>
    allTargets.value
      .filter((target): target is Extract<FlowTarget, { category: 'scenarios' }> => target.category === 'scenarios')
      .map(({ item }) => ({ category: 'scenarios', selectedId: item.key }))
  )
</script>
