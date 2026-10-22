<!-- src/ui/LiveClock/editor/LiveClockPreview.vue -->
<template>
  <HudPreview maxHeightClass="">
    <div class="flex justify-center" :class="[fontFamily]">
      <LiveClockSelector
        :settings="settings"
        :default-message="defaultMessage"
        :is-mounted="isMounted"
        :is-flipped="isFlipped"
        :current-msg="currentMsg"
        @click="isFlipped = !isFlipped"
      />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useFontFamily } from '@/types/OmikujiData'
  import { LiveClockType } from '@/types/ui'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import LiveClockSelector from '@/ui/LiveClock/LiveClockSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { usePlaceholderInterval } from '@/ui/common/usePlaceholderInterval'

  const props = defineProps<{
    settings: LiveClockType
    messageText: string
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const fontFamily = computed(() => useFontFamily(data.value.ui.fontFamily ?? 'default'))
  const settings = computed(() => props.settings)

  const {
    message: defaultMessage,
    registerIntervalHook,
    commitIfPending,
  } = usePlaceholderInterval(() => settings.value.defaultMessage ?? '', 5000)
  registerIntervalHook(() => {
    commitIfPending(!isFlipped.value)
  })

  const currentMsg = ref('テストメッセージです！テストメッセージです！')

  const isMounted = ref(false) // 表示アニメーションON
  const isFlipped = ref(false) // コメント表示状態

  onMounted(() => {
    requestAnimationFrame(() => {
      isMounted.value = true
    })
  })
</script>
