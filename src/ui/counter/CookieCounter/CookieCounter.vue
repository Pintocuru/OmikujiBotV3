<!-- src/ui/CookieCounter/CookieCounter.vue -->
<template>
  <CookieCounterSelector
    :settings="cookieSettings"
    :counters="counters"
    :variable-labels="variableLabels"
    :shown-characters="shownCharacters"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import CookieCounterSelector from './CookieCounterSelector.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { CookieCounterSchema } from '@/types/ui'
  import { useStreamCounters } from '@/ui/common/useStreamCounters'
  import { useAppCharacters } from '@/ui/common/useAppCharacters'
  import { resolveCookieCharacters } from './composables/resolveCookieCharacters'

  const appStore = useAppStore()
  const cookieSettings = computed(() => CookieCounterSchema.parse(appStore.data.ui.settings.cookieCounter ?? {}))

  // キャラクターの解決は component の外で行う
  const appCharacters = useAppCharacters()
  const shownCharacters = computed(() => resolveCookieCharacters(cookieSettings.value.characters, appCharacters))

  // type: 'variable' の { target → label } マップ
  const variableLabelMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const c of cookieSettings.value.counters) {
      if (c.type === 'variable') {
        map[c.target] = c.label
      }
    }
    return map
  })

  const { counters, variableLabels } = useStreamCounters(variableLabelMap)
</script>
