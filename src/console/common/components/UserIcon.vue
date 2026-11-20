<!-- src/console/common/components/UserIcon.vue -->
<!-- ユーザーのアイコン。画像がない・読み込めないときは、名前の頭文字を表示する -->
<template>
  <img v-if="src && !failed" :src="src" alt="" class="size-6 shrink-0 rounded-full object-cover" @error="failed = true" />
  <span v-else class="flex size-6 shrink-0 items-center justify-center rounded-full bg-base-300 text-xs">{{
    initial
  }}</span>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    src?: string
    userName: string
  }>()

  const failed = ref(false)
  watch(
    () => props.src,
    () => (failed.value = false)
  )

  const initial = computed(() => Array.from(props.userName)[0] ?? '?')
</script>
