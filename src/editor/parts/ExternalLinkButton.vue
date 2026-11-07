<!-- src/editor/parts/ExternalLinkButton.vue -->
<template>
  <div
    v-if="isValidUrl(url)"
    class="tooltip tooltip-top"
    :data-tip="title ?? t('editorUi.externalLink.open')"
  >
    <button
      class="btn btn-sm btn-ghost btn-square"
      :aria-label="title ?? t('editorUi.externalLink.open')"
      @click="openUrl"
    >
      <ExternalLink class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ExternalLink } from 'lucide-vue-next'

  const { t } = useI18n()

  // Props
  const props = defineProps<{
    url: string
    title?: string
  }>()

  // URL検証
  const isValidUrl = (urlValue: string): boolean => {
    if (!urlValue) return false
    try {
      new URL(urlValue)
      return true
    } catch {
      return false
    }
  }

  // URLを開く
  const openUrl = () => {
    if (isValidUrl(props.url)) {
      window.open(props.url, '_blank', 'noopener,noreferrer')
    }
  }
</script>
