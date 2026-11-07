<!-- src/editor/assets/characters/CharacterImage/EmotionLayerEditor.vue -->
<template>
  <div class="space-y-2">
    <div class="text-xs font-medium text-base-content/70 mb-1">{{ t('characterImage.layer.title') }}</div>

    <button type="button" class="btn btn-sm btn-neutral gap-2 w-full" @click="handleAddLayer">
      <Plus class="w-4 h-4" />
      {{ t('characterImage.layer.add') }}
    </button>

    <div v-for="(layer, index) in layers" :key="index" class="border rounded p-2 bg-base-200 space-y-1">
      <div class="flex items-center gap-2">
        <span class="badge badge-xs">{{ index + 1 }}</span>
        <div class="flex-1" />
        <button type="button" class="btn btn-sm btn-neutral btn-outline gap-2" @click="handleSetDefaultPath(index)">
          <RotateCcw class="w-4 h-4" />
          {{ t('characterImage.layer.setPath') }}
        </button>
        <div class="tooltip tooltip-top" :data-tip="t('characterImage.layer.moveUp')">
          <button type="button" class="btn btn-sm btn-ghost btn-square" :aria-label="t('characterImage.layer.moveUp')" @click="handleMoveUp(index)" :disabled="index === 0">
            <ChevronUp class="w-4 h-4" />
          </button>
        </div>
        <div class="tooltip tooltip-top" :data-tip="t('characterImage.layer.moveDown')">
          <button type="button" class="btn btn-sm btn-ghost btn-square" :aria-label="t('characterImage.layer.moveDown')" @click="handleMoveDown(index)" :disabled="index === layers.length - 1">
            <ChevronDown class="w-4 h-4" />
          </button>
        </div>
        <div class="tooltip tooltip-top" :data-tip="t('characterImage.layer.remove')">
          <button type="button" class="btn btn-sm btn-error btn-square" :aria-label="t('characterImage.layer.remove')" @click="handleRemoveLayer(index)">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <input
        type="url"
        class="input input-xs w-full"
        :placeholder="t('characterImage.layer.url', { n: index + 1 })"
        :value="layer"
        @input="handleLayerUpdate(index, ($event.target as HTMLInputElement).value)"
      />
      <ImagePreview :layers="layer" :width="128" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref } from 'vue'
  import { RotateCcw, Plus, ChevronUp, ChevronDown, X } from 'lucide-vue-next'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'

  const { t } = useI18n()

  const props = defineProps<{
    src: string[]
    emotionKey: string
    selectedItemKey: string
  }>()

  const emit = defineEmits<{
    'update:src': [src: string[]]
  }>()

  const layers = computed(() => (Array.isArray(props.src) ? props.src : []))

  const imageExtensions = ['png', 'gif', 'webp', 'jpg', 'jpeg', 'svg', 'webm', 'mp4']
  const extensionIndex = ref(0)

  // 押されたレイヤー(index)のパスだけを既定パスに書き換える
  const handleSetDefaultPath = (index: number) => {
    const ext = imageExtensions[extensionIndex.value % imageExtensions.length]
    extensionIndex.value++
    const newPath = `${props.selectedItemKey}/${props.emotionKey}.${ext}`
    const n = [...layers.value]
    n[index] = newPath
    emit('update:src', n)
  }

  const handleLayerUpdate = (index: number, value: string) => {
    const n = [...layers.value]
    n[index] = value
    emit('update:src', n)
  }
  const handleAddLayer = () => emit('update:src', [...layers.value, ''])
  const handleRemoveLayer = (index: number) =>
    emit(
      'update:src',
      layers.value.filter((_, i) => i !== index)
    )
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const n = [...layers.value]
    ;[n[index - 1], n[index]] = [n[index], n[index - 1]]
    emit('update:src', n)
  }
  const handleMoveDown = (index: number) => {
    if (index === layers.value.length - 1) return
    const n = [...layers.value]
    ;[n[index], n[index + 1]] = [n[index + 1], n[index]]
    emit('update:src', n)
  }
</script>
