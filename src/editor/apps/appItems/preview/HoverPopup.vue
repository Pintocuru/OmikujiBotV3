<!-- src/editor/apps/appItems/preview/HoverPopup.vue -->
<template>
  <Teleport to="body">
    <!-- Teleport 先は EditorApp.vue の data-theme の外側なので、同じテーマをここで指定する -->
    <div v-if="visible" ref="el" class="fixed z-50 pointer-events-none" :style="style" :data-theme="daisyUiTheme">
      <div class="bg-base-200 text-base-content border border-base-300 shadow-lg rounded p-2">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

  const props = defineProps<{
    x: number
    y: number
    visible: boolean
  }>()

  const OFFSET = 12
  const MARGIN = 8

  // EditorApp.vue と同じテーマ
  const { data } = storeToRefs(useOmikujiStore())
  const daisyUiTheme = computed(() => data.value.settings.developer.daisyUiTheme)

  // 画面外にはみ出さないよう、描画後にサイズを測って位置を補正する
  const el = ref<HTMLElement | null>(null)
  const left = ref(props.x + OFFSET)
  const top = ref(props.y + OFFSET)

  watch(
    () => [props.visible, props.x, props.y] as const,
    async ([visible, x, y]) => {
      left.value = x + OFFSET
      top.value = y + OFFSET
      if (!visible) return

      await nextTick()
      const rect = el.value?.getBoundingClientRect()
      if (!rect) return

      const maxLeft = window.innerWidth - rect.width - MARGIN
      const maxTop = window.innerHeight - rect.height - MARGIN
      left.value = Math.max(MARGIN, Math.min(left.value, maxLeft))
      top.value = Math.max(MARGIN, Math.min(top.value, maxTop))
    },
    { immediate: true }
  )

  const style = computed(() => ({
    left: left.value + 'px',
    top: top.value + 'px',
  }))
</script>
