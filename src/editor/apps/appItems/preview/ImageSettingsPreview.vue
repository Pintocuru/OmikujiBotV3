<!-- src/editor/apps/appItems/preview/ImageSettingsPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <ImageIcon class="w-3 h-3" />
        <span>{{ t('appPreview.image.title') }}</span>
      </div>
      <span class="badge badge-xs" :class="totalLayers > 0 ? 'badge-success' : 'badge-ghost'">
        {{ t('appPreview.image.layers', { n: totalLayers }) }}
      </span>
    </div>

    <div v-if="totalLayers === 0" class="text-xs opacity-40">{{ t('appPreview.image.empty') }}</div>

    <!-- 感情ごとにレイヤー数を表示（設定あるもののみ） -->
    <div v-for="(count, emotion) in setEmotions" :key="emotion" class="flex items-center gap-1.5 text-xs">
      <Layers class="w-3 h-3 shrink-0 opacity-60" />
      <span class="flex-1 opacity-80">{{ emotionLabel(emotion) }}</span>
      <span class="badge badge-xs badge-ghost">×{{ count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { CharacterType } from '@/types/OmikujiData'
  import { Image as ImageIcon, Layers } from 'lucide-vue-next'

  const { t, te } = useI18n()

  const props = defineProps<{
    data: Partial<CharacterType> | null
  }>()

  const image = computed(() => props.data?.image ?? {})

  // レイヤーがあるemotionのみ抽出: { emotion: layerCount }
  const setEmotions = computed(() => {
    const result: Record<string, number> = {}
    for (const [key, layers] of Object.entries(image.value)) {
      if (Array.isArray(layers) && layers.length > 0) {
        result[key] = layers.length
      }
    }
    return result
  })

  const totalLayers = computed(() => Object.values(setEmotions.value).reduce((sum, n) => sum + n, 0))

  function emotionLabel(key: string) {
    const msgKey = `mapText.characterEmotion.${key}.label`
    return te(msgKey) ? t(msgKey) : key
  }
</script>
