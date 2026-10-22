<!-- src/editor/parts/CharacterPicker.vue -->
<template>
  <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1" role="radiogroup">
    <!-- 未選択 -->
    <button
      v-if="allowEmpty"
      type="button"
      role="radio"
      :aria-checked="modelValue === ''"
      class="flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition"
      :class="modelValue === '' ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
      :style="{ width: `${size + 16}px` }"
      @click="emit('update:modelValue', '')"
    >
      <div
        class="flex items-center justify-center rounded border border-dashed border-base-300 text-xs opacity-60"
        :style="{ width: `${size}px`, height: `${size}px` }"
      >
        {{ emptyLabel }}
      </div>
      <span class="text-xs">{{ emptyLabel }}</span>
    </button>

    <!-- キャラクター -->
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      role="radio"
      :aria-checked="modelValue === item.key"
      :title="item.name"
      class="flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition"
      :class="modelValue === item.key ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
      :style="{ width: `${size + 16}px` }"
      @click="emit('update:modelValue', item.key)"
    >
      <LayerImage v-if="item.layers.length" :layers="item.layers" :size="size" />
      <div
        v-else
        class="flex items-center justify-center rounded bg-base-200 text-xs opacity-60"
        :style="{ width: `${size}px`, height: `${size}px` }"
      >
        画像なし
      </div>
      <span class="w-full truncate text-center text-xs">{{ item.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

  withDefaults(
    defineProps<{
      modelValue: string
      allowEmpty?: boolean // 「なし」を選べるようにする
      emptyLabel?: string
      size?: number // サムネイルの一辺(px)
    }>(),
    { allowEmpty: false, emptyLabel: 'なし', size: 64 }
  )

  const emit = defineEmits<{
    'update:modelValue': [key: string]
  }>()

  const { characterMap } = useCharacterLookup()

  const hasSrc = (src?: string[]) => (src ?? []).some((p) => p && p.trim() !== '')

  // 画像は default を優先。無ければ最初に画像のある表情
  const items = computed(() =>
    Object.entries(characterMap.value).map(([key, c]) => {
      const images = c.image ?? {}
      const entry = hasSrc(images['default']?.src)
        ? images['default']
        : Object.values(images).find((i) => hasSrc(i.src))
      return { key, name: c.name, layers: entry?.src ?? [] }
    })
  )
</script>
