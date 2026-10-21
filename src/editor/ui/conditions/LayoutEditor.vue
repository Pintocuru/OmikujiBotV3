<!-- src/editor/ui/conditions/LayoutEditor.vue -->
<template>
  <div class="flex flex-col gap-3">
    <SettingItem icon="LayoutGrid" label="レイアウト" description="ジェネレーターで使用するレイアウト">
      <div class="flex flex-wrap gap-2">
        <!-- main.ts / registerAll で登録済みのレイアウトのみ -->
        <span
          v-for="key in availableLayouts"
          :key="key"
          class="badge cursor-pointer select-none"
          :class="layout === key ? 'badge-accent text-accent-content' : 'badge-outline text-base-content'"
          :title="t(`mapText.uiLayout.${key}.description`)"
          @click="updateLayout(key)"
        >
          {{ t(`mapText.uiLayout.${key}.label`) }}
        </span>
      </div>
      <p class="text-xs opacity-70 p-2">{{ t(`mapText.uiLayout.${layout}.description`) }}</p>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { uiLayouts } from '@/types'
  import type { UiLayoutType } from '@/types'
  import { getLayoutLoader } from '@/ui/uiRegistry'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const layout = computed(() => data.value.ui.layout)
  const availableLayouts = uiLayouts.filter((key) => getLayoutLoader(key))

  const updateLayout = (key: UiLayoutType) => omikujiStore.updateUi({ layout: key })
</script>
