<!-- src/editor/apps/appInfo/meta/PackageDistributionInfo.vue -->
<template>
  <!-- ライセンス (読み取り専用) -->
  <SettingItem
    icon="FileText"
    labelKey="packageMeta.distribution.license.label"
    descriptionKey="packageMeta.distribution.license.description"
  >
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60">{{ meta.license }}</span>
    </div>
  </SettingItem>

  <!-- URL (読み取り専用) -->
  <SettingItem
    icon="Link"
    labelKey="packageMeta.distribution.url.label"
    descriptionKey="packageMeta.distribution.url.description"
  >
    <div class="flex items-center gap-3">
      <span class="text-sm text-base-content/60 break-all">{{ meta.url || '未設定' }}</span>
      <ExternalLinkButton v-if="meta.url" :url="meta.url" />
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ExternalLinkButton from '@/editor/parts/ExternalLinkButton.vue'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // メタ情報の参照
  const meta = computed(() => data.value.meta)
</script>
