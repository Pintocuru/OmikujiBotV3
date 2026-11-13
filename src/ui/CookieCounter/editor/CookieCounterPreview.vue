<!-- src/ui/CookieCounter/editor/CookieCounterPreview.vue -->
<template>
  <HudPreview :defaultScale="0.8">
    <div :class="[fontFamily]">
      <CookieCounterSelector
        editorPreview
        :key="cookieCounter.component"
        :settings="cookieCounter"
        :counters="previewCounters"
        :variableLabels="variableLabels"
        :shownCharacters="shownCharacters"
      />
    </div>

    <template #hud>
      <div class="flex items-center gap-2">
        <button class="btn btn-xs btn-ghost" @click="incrementAll">
          {{ $t('uiSettings.cookieCounter.incrementAll') }}
        </button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import type { CookieCounterType } from '@/types/ui'
  import CookieCounterSelector from '@/ui/CookieCounter/CookieCounterSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { usePreviewCounters } from '@/ui/StreamCounter/editor/usePreviewCounters'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import { resolveCookieCharacters } from '../composables/resolveCookieCharacters'

  const props = defineProps<{
    cookieCounter: CookieCounterType
    variableLabels: Record<string, string>
  }>()

  const { previewCounters, incrementAll } = usePreviewCounters({
    getExtraKeys: () => props.cookieCounter.counters.map((c) => c.target),
  })

  // エディターでは編集中のデータのキャラクターを使う
  const characterLookup = useCharacterLookup()
  const shownCharacters = computed(() => resolveCookieCharacters(props.cookieCounter.characters, characterLookup))

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.ui.fontFamily ?? 'default'))
</script>
