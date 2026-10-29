<!-- src/editor/assets/characters/CharacterImage/EmotionAnimationEditor.vue -->
<template>
  <div class="space-y-3">
    <div class="text-xs font-medium text-base-content/70 mb-1">{{ t('characterImage.animation.title') }}</div>

    <!-- プレビュー -->
    <div class="flex justify-center bg-base-200 rounded p-3">
      <ImagePreview :key="previewKey" :layers="src" :width="192" :animation="localAnimation" />
    </div>

    <!-- タイプ選択 -->
    <div class="space-y-1">
      <label class="text-xs text-base-content/60">{{ t('characterImage.animation.type') }}</label>
      <select class="select select-xs w-full" v-model="localAnimation.type" @change="applyAnimation">
        <option v-for="(_, key) in loopMotionMap" :key="key" :value="key">
          {{ t(`mapText.loopMotion.${key}.label`) }}
        </option>
      </select>
    </div>

    <!-- アニメーション速度(秒) -->
    <template v-if="localAnimation.type !== 'none'">
      <div class="space-y-1">
        <div class="flex justify-between">
          <label class="text-xs text-base-content/60">{{ t('characterImage.animation.speed') }}</label>
          <span class="text-xs font-mono">{{ localAnimation.duration }}s</span>
        </div>
        <input
          type="range"
          class="range range-xs range-primary"
          min="0.4"
          max="5"
          step="0.2"
          v-model.number="localAnimation.duration"
          @change="applyAnimation"
        />
        <div class="flex justify-between text-xs text-base-content/40">
          <span>{{ t('characterImage.animation.fast') }}</span
          ><span>{{ t('characterImage.animation.slow') }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="toggle toggle-xs toggle-primary"
          v-model="localAnimation.loop"
          @change="applyAnimation"
        />
        <label class="text-xs text-base-content/60">
          {{ localAnimation.loop ? t('characterImage.animation.loop') : t('characterImage.animation.once') }}
        </label>
      </div>
    </template>

    <div v-else class="text-xs text-base-content/30 text-center py-4">{{ t('characterImage.animation.none') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, watch, computed } from 'vue'
  import type { CharacterAnimationType } from '@/types/OmikujiData'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'
  import { loopMotionMap } from '@/maps/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    /** どの感情のアニメーションか（変化時に local state をリセットするために使用） */
    emotionKey: string
    src: string[]
    animation: CharacterAnimationType | undefined
  }>()

  const emit = defineEmits<{
    'update:animation': [animation: CharacterAnimationType | undefined]
  }>()

  const localAnimation = ref<CharacterAnimationType>({
    type: props.animation?.type ?? 'none',
    duration: props.animation?.duration ?? 1.5,
    loop: props.animation?.loop ?? true,
  })

  // プレビュー用の key: 感情・type・duration・loop が変わったら再マウント
  const previewKey = computed(
    () =>
      `${props.emotionKey}-${localAnimation.value.type}-${localAnimation.value.duration}-${localAnimation.value.loop}`
  )

  const applyAnimation = () => {
    const payload = localAnimation.value.type === 'none' ? undefined : { ...localAnimation.value }
    emit('update:animation', payload)
  }

  watch(
    () => props.emotionKey,
    () => {
      localAnimation.value = {
        type: props.animation?.type ?? 'none',
        duration: props.animation?.duration ?? 1.5,
        loop: props.animation?.loop ?? true,
      }
    }
  )
</script>
