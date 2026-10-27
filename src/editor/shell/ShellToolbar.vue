<!-- src/editor/shell/ShellToolbar.vue -->
<template>
  <!-- 右上に常時表示する切り替えボタン -->
  <div class="fixed top-3 right-3 z-9999 flex gap-2">
    <!-- 1つ目: エディター / ジェネレーターの切り替え -->
    <button
      class="btn btn-sm shadow-lg"
      :class="canUseGenerator ? 'btn-primary' : 'btn-outline btn-warning bg-base-100'"
      :disabled="generatorState === 'checking' && !showGenerator"
      :title="generatorTitle"
      @click="onSwitch"
    >
      <component :is="showGenerator ? Settings : Cpu" class="w-4 h-4" />
      {{ generatorLabel }}
    </button>

    <!-- 2つ目: light / dark の切り替え -->
    <button class="btn btn-sm btn-square btn-neutral shadow-lg" :title="themeTitle" @click="toggleDaisyUiTheme">
      <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Settings, Cpu, Sun, Moon } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import type { GeneratorState } from './shellTypes'

  const props = defineProps<{ showGenerator: boolean; generatorState: GeneratorState }>()
  const emit = defineEmits<{ 'update:showGenerator': [value: boolean]; recheck: [] }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { toggleDaisyUiTheme } = omikujiStore

  const isDark = computed(() => data.value.settings.developer.daisyUiTheme === 'dark')
  const themeTitle = computed(() => (isDark.value ? 'ライトモードに切り替え' : 'ダークモードに切り替え'))

  // ジェネレーターを開けるのは、わんコメに接続できているとき(エディターに戻るのは常に可能)
  const canUseGenerator = computed(() => props.showGenerator || props.generatorState === 'ready')

  const generatorLabel = computed(() => {
    if (props.showGenerator) return 'エディター'
    if (props.generatorState === 'checking') return 'わんコメ確認中...'
    if (props.generatorState === 'unavailable') return 'ジェネレーター使用不可'
    return 'ジェネレーター'
  })

  const generatorTitle = computed(() => {
    if (props.showGenerator) return 'エディターに戻る'
    if (props.generatorState === 'unavailable')
      return 'わんコメに接続できません。わんコメを起動してから、クリックで再確認してください'
    return 'ジェネレーターを表示して動作を確認する'
  })

  function onSwitch() {
    if (!canUseGenerator.value) {
      if (props.generatorState === 'unavailable') emit('recheck')
      return
    }
    emit('update:showGenerator', !props.showGenerator)
  }
</script>
