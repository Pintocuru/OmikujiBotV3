<!-- src/editor/apps/appInfo/meta/PackageSystemInfo.vue -->
<template>
  <!-- ジェネレータ名 (読み取り専用) -->
  <SettingItem icon="Settings" label="アプリ名" description="このパッケージを生成したアプリ名">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.generatorName }}</span>
    </div>
  </SettingItem>

  <!-- ジェネレータバージョン (読み取り専用) -->
  <SettingItem icon="Tag" label="アプリバージョン" description="このアプリのバージョン">
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.generatorVersion }}</span>

      <ExternalLinkButton :url="LATEST_RELEASE_PAGE_URL" title="最新バージョンを入手する" />
    </div>
  </SettingItem>

  <!-- ID (読み取り専用) -->
  <SettingItem icon="Code2" label="データバージョン" description="このデータのスキーマバージョン">
    <div class="flex items-center gap-3">
      <span class="font-mono text-sm text-base-content/60 select-all">{{ meta.dataVersion }}</span>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ExternalLinkButton from '@/editor/parts/ExternalLinkButton.vue'
  import { LATEST_RELEASE_PAGE_URL } from '@/editor/constants/versionCheck'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
