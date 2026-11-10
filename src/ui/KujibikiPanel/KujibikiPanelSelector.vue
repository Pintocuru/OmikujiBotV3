<!-- src/ui/KujibikiPanel/KujibikiPanelSelector.vue -->
<template>
  <MotionWrapper
    v-if="hasMessage && currentComponent"
    :key="currentKey"
    :visible="isVisible"
    :motion="settings.animation"
    :leave-motion="settings.animation"
    class="w-full"
  >
    <component
      :is="currentComponent"
      :messages="messages"
      :label="settings.label"
      :imagePath="settings.imagePath"
      :iconSize="settings.iconSize"
    />
  </MotionWrapper>
  <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
    {{ $t(loadError.key, { id: loadError.id }) }}
  </div>
</template>

<script setup lang="ts">
  import { computed, shallowRef, watch, type Component } from 'vue'
  import type { KujibikiPanelType } from '@/types/ui'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { getKujibikiPanelComponent } from './KujibikiPanelRegistry'
  import { notifyKujibikiComponentIssue } from './notifyKujibikiComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: KujibikiPanelType
      messages: DisplayedBotMessage[]
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getKujibikiPanelComponent(id)
      if (!definition) {
        const message = `くじ引きの表示タイプ「${id}」は、このバージョンには含まれていません`
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) notifyKujibikiComponentIssue(id, message)
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[KujibikiPanel] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyKujibikiComponentIssue(id, `くじ引きの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )

  const hasMessage = computed(() => props.messages.some((message) => !!message.bubble?.message))
  const isVisible = computed(() => props.messages[0]?.display.visible ?? true)
  const currentKey = computed(() => `${props.messages[0]?.id ?? ''}-${props.settings.animation}`)
</script>
