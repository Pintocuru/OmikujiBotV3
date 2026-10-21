<!-- src/common/buildValidation/DataMismatchNotice.vue -->
<template>
  <div class="alert alert-error text-sm" role="alert">
    <div>
      <p class="font-bold">データが不一致です</p>
      <p class="text-xs">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import {
    BuildMismatchError,
    formatBuildMismatchMessage,
    reportDataMismatch,
    type UnsupportedKey,
  } from './validateAgainstBuild'

  // unsupported: 直接指定 / error: defineAsyncComponent の errorComponent から渡される
  const props = defineProps<{ unsupported?: UnsupportedKey[]; error?: unknown }>()

  const items = computed<UnsupportedKey[] | null>(() => {
    if (props.unsupported?.length) return props.unsupported
    if (props.error instanceof BuildMismatchError) return props.error.unsupported
    return null
  })

  const message = computed(() =>
    items.value ? formatBuildMismatchMessage(items.value) : 'このビルドでは、このデータの表示に必要な機能を読み込めませんでした'
  )

  // 表示と同時に、わんコメにも通知する(表示のたびに連投しないよう throttle)
  onMounted(() => {
    if (items.value) reportDataMismatch(items.value, { display: 'toast', throttle: true })
  })
</script>
