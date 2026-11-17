<!-- src/ui/bot/LiveClock/editor/LiveClockPreview.vue -->
<template>
  <HudPreview maxHeightClass="">
    <div class="flex justify-center">
      <LiveClockSelector
        editorPreview
        :settings="settings"
        :slot-message="slotMessage"
        :is-mounted="isMounted"
        :is-flipped="isFlipped"
        :current-msg="currentMsg"
        :fontFamily="fontFamily"
        @click="isFlipped = !isFlipped"
      />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { LiveClockType } from '@/types/ui'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import LiveClockSelector from '@/ui/bot/LiveClock/LiveClockSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'

  const props = defineProps<{
    settings: LiveClockType
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const fontFamily = computed(() => data.value.ui.fontFamily)
  const settings = computed(() => props.settings)

  const slotMessage = ref('テスト用の下部メッセージです')
  const currentMsg = ref('テストメッセージです！テストメッセージです！')

  const isMounted = ref(false) // 表示アニメーションON
  const isFlipped = ref(false) // コメント表示状態

  onMounted(() => {
    requestAnimationFrame(() => {
      isMounted.value = true
    })
  })
</script>
