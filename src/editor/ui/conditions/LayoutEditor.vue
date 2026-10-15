<!-- src/editor/ui/conditions/LayoutEditor.vue -->
<template>
  <div class="flex flex-col gap-3">
    <SettingItem label="レイアウト" description="専用レイアウトを使用する場合に選択します">
      <div class="flex flex-wrap gap-2">
        <!-- null = 個別設定 -->
        <span
          class="badge cursor-pointer select-none"
          :class="layout === null ? 'badge-neutral text-neutral-content' : 'badge-outline text-base-content'"
          @click="updateLayout(null)"
        >
          個別設定
        </span>

        <!-- main.ts / registerAll で登録済みのレイアウトのみ -->
        <span
          v-for="key in availableLayouts"
          :key="key"
          class="badge cursor-pointer select-none"
          :class="layout === key ? 'badge-accent text-accent-content' : 'badge-outline text-base-content'"
          :title="uiLayoutMap[key].description"
          @click="updateLayout(key)"
        >
          {{ uiLayoutMap[key].label }}
        </span>
      </div>
    </SettingItem>

    <p v-if="layout" class="text-sm opacity-70 px-2">{{ uiLayoutMap[layout].description }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { uiLayouts } from '@/types'
  import type { UiLayoutType } from '@/types'
  import { uiLayoutMap } from '@/maps/OmikujiData'
  import { getLayoutLoader } from '@/ui/uiRegistry'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const layout = computed(() => data.value.ui.layout)
  const availableLayouts = uiLayouts.filter((key) => getLayoutLoader(key))

  const updateLayout = (key: UiLayoutType) => omikujiStore.updateUi({ layout: key })
</script>
