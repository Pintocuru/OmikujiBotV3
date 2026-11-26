<!-- src/console/parts/ConfirmButton.vue -->
<!-- 配信中の押し間違いを防ぐ、2 回押しで実行するボタン。1 回目で確認表示になり、一定時間・フォーカスが外れる・Esc のいずれかで元に戻る -->
<template>
  <button
    type="button"
    class="btn btn-xs gap-1"
    :class="confirming ? 'btn-warning' : 'btn-ghost'"
    :title="confirmLabel"
    @click.stop="onClick"
    @blur="reset"
  >
    <slot name="icon" />
    {{ confirming ? confirmLabel : label }}
  </button>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const props = withDefaults(
    defineProps<{
      /** 通常時の表示 */
      label: string
      /** 1 回押したあとの表示 */
      confirmLabel: string
      /** 確認表示のまま待つ時間 (ミリ秒) */
      timeoutMs?: number
    }>(),
    { timeoutMs: 3000 }
  )
  const emit = defineEmits<{ confirm: [] }>()

  const confirming = ref(false)
  let timer = 0

  const reset = () => {
    clearTimeout(timer)
    confirming.value = false
  }

  const onClick = () => {
    if (!confirming.value) {
      confirming.value = true
      timer = window.setTimeout(reset, props.timeoutMs)
      return
    }
    reset()
    emit('confirm')
  }

  const isTyping = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

  /** Esc キーでも確認を解除する (入力欄でタイプしているときは除く) */
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !isTyping(event.target)) reset()
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    clearTimeout(timer)
  })
</script>
