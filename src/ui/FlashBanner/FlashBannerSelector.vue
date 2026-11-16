<!-- src/ui/FlashBanner/FlashBannerSelector.vue -->
<template>
  <div v-if="currentComponent && message" class="bg-base-100 transparent-bg w-full overflow-hidden">
    <component
      :is="currentComponent"
      :settings="settings"
      :message="message"
      :character-layers="characterLayers"
      :character-animation="characterAnimation"
      :color="color"
      :label-class="labelClass"
    />
  </div>
  <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
    {{ $t(loadError.key, { id: loadError.id }) }}
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { CharacterAnimationType, CharacterColorType } from '@/types/OmikujiData'
  import type { FlashBannerType } from '@/types/ui'
  import { getFlashBannerComponent } from './FlashBannerRegistry'
  import { notifyFlashBannerComponentIssue } from './notifyFlashBannerComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: FlashBannerType
      message: string // 空なら何も表示しない
      characterLayers?: string[]
      characterAnimation?: CharacterAnimationType
      color: CharacterColorType
      labelClass?: string
      editorPreview?: boolean
    }>(),
    { characterLayers: () => [], characterAnimation: undefined, labelClass: '', editorPreview: false }
  )

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getFlashBannerComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyFlashBannerComponentIssue(
            id,
            `ニュースフラッシュの表示タイプ「${id}」は、このバージョンには含まれていません`
          )
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[FlashBanner] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyFlashBannerComponentIssue(id, `ニュースフラッシュの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
