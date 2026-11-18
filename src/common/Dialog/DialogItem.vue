<!-- src/common/Dialog/DialogItem.vue -->
<!-- 確認・通知ダイアログ 1 件ぶん。ネイティブ <dialog> + daisyUI の modal。重なったときは後から開いたものが前面に出て、Esc も最前面だけが閉じる -->
<template>
  <dialog ref="dialogRef" class="modal" :aria-labelledby="titleId" @cancel.prevent="settle(null)">
    <div class="modal-box max-w-md text-base-content">
      <h3 :id="titleId" class="flex items-center gap-2 text-lg font-bold">
        <component :is="toneIcon[request.tone]" class="h-5 w-5 shrink-0" :class="toneClass[request.tone]" />
        <span class="wrap-break-word">{{ request.title }}</span>
      </h3>

      <div class="mt-3 space-y-2 text-sm">
        <p v-if="request.body.text" class="whitespace-pre-line wrap-break-word">{{ request.body.text }}</p>
        <ul v-if="request.body.items?.length" class="list-inside list-disc space-y-0.5">
          <li v-for="(item, index) in request.body.items" :key="index" class="wrap-break-word">{{ item }}</li>
        </ul>
        <p v-if="request.body.note" class="whitespace-pre-line wrap-break-word text-xs opacity-70">
          {{ request.body.note }}
        </p>

        <div v-if="request.input">
          <input
            v-model="inputValue"
            type="text"
            class="input input-sm w-full"
            :class="{ 'input-error': inputError }"
            :placeholder="request.input.placeholder"
            autofocus
            @keydown.enter="onEnter"
          />
          <p v-if="inputError" class="mt-1 text-xs text-error">{{ inputError }}</p>
        </div>
      </div>

      <div class="modal-action">
        <button
          v-if="request.cancelLabel !== null"
          class="btn btn-sm btn-ghost"
          :autofocus="request.focusCancel"
          @click="settle(null)"
        >
          {{ request.cancelLabel }}
        </button>
        <button
          v-for="choice in request.choices"
          :key="choice.key"
          class="btn btn-sm"
          :class="variantClass[choice.variant]"
          :autofocus="!request.focusCancel && !request.input"
          @click="onChoice(choice.key)"
        >
          {{ choice.label }}
        </button>
      </div>
    </div>

    <!-- 外側のクリックは、キャンセルと同じ扱い -->
    <div class="modal-backdrop" @click="settle(null)"></div>
  </dialog>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { CircleCheck, CircleHelp, CircleX, Info, TriangleAlert } from '@lucide/vue'
  import type { Component } from 'vue'
  import { removeDialogRequest, type DialogButtonVariant, type DialogRequest, type DialogTone } from './dialogState'

  const props = defineProps<{ request: DialogRequest }>()

  const titleId = `dialog-title-${props.request.id}`

  // Tailwind が拾えるよう、クラス名は完全な文字列で書く
  const toneIcon: Record<DialogTone, Component> = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleX,
    question: CircleHelp,
  }
  const toneClass: Record<DialogTone, string> = {
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    question: 'text-info',
  }
  const variantClass: Record<DialogButtonVariant, string> = {
    primary: 'btn-primary',
    error: 'btn-error',
    warning: 'btn-warning',
    neutral: 'btn-neutral',
  }

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const inputValue = ref(props.request.input?.defaultValue ?? '')
  const inputError = ref<string | null>(null)

  // DaisyUI の modal の transition(.3s)に合わせる
  const CLOSE_ANIMATION_MS = 300
  let removeTimer: ReturnType<typeof setTimeout> | undefined
  let settled = false

  onMounted(() => {
    // 閉じた状態を先に描画・スタイル確定してから開く(でないと開くアニメーションが走らない)
    void dialogRef.value?.offsetHeight
    dialogRef.value?.showModal()
  })
  onBeforeUnmount(() => clearTimeout(removeTimer))

  // 結果を返して閉じる。閉じるアニメーションを見せてから一覧から外す
  const settle = (key: string | null) => {
    if (settled) return
    settled = true
    props.request.resolve({ key, value: props.request.input ? inputValue.value : undefined })
    dialogRef.value?.close()
    removeTimer = setTimeout(() => removeDialogRequest(props.request.id), CLOSE_ANIMATION_MS)
  }

  const onChoice = (key: string) => {
    const validate = props.request.input?.validate
    if (validate) {
      inputError.value = validate(inputValue.value)
      if (inputError.value) return
    }
    settle(key)
  }

  // 日本語入力の変換確定の Enter では送信しない
  const onEnter = (event: KeyboardEvent) => {
    if (event.isComposing) return
    const confirm = props.request.choices[0]
    if (confirm) onChoice(confirm.key)
  }
</script>
