<!-- src/editor/ui/common/FontFamilyEditor.vue -->
<template>
  <SettingItem label="フォントファミリー" description="表示に使用するフォントを設定します">
    <select
      :value="data.ui.fontFamily"
      @change="(e) => omikujiStore.updateUi({ fontFamily: (e.target as HTMLSelectElement).value as FontFamilyType })"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(font, key) in fontFamilyMap" :key="key" :value="key">{{ font.label }}</option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import type { FontFamilyType } from '@/types/OmikujiData'
  import { fontFamilyMap } from '@/maps/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
</script>
