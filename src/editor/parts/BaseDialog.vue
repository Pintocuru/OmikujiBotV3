<!-- src/editor/parts/BaseDialog.vue -->
<!-- タイトル + ×ボタン + 本文 + (任意の)アクションだけを持つ薄いダイアログ。保存/キャンセルが要るときは BaseEditDialog を使う -->
<!-- 開いた直後に本文へフォーカスさせたい要素には autofocus 属性を付ける(showModal() が拾う。未指定なら先頭の操作要素=×ボタン) -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="close">
    <!-- 開いている間だけ中身を描画する。閉じたままの MessageTextDialog 等の中身まで全件マウントされ、
         一覧(44 行程度)でクリックから数秒固まる原因になっていたため。
         DaisyUI の modal-box は「閉じた状態 → [open]」の CSS transition でアニメーションするので、
         開く前に描画しておき、閉じるアニメーションが終わってから外す(rendered) -->
    <template v-if="rendered">
      <div class="modal-box max-h-[90vh] overflow-y-auto text-base-content" :class="sizeClass[size]">
        <div class="flex items-center justify-between pb-2">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <component :is="IconComponent" v-if="IconComponent" class="w-5 h-5" />
            {{ title }}
          </h3>
          <button class="btn btn-sm btn-circle btn-ghost shrink-0" :aria-label="t('editorUi.dialog.close')" @click="close">
            <X :size="16" />
          </button>
        </div>

        <slot />

        <div v-if="$slots.actions" class="modal-action">
          <slot name="actions" />
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button :aria-label="t('editorUi.dialog.close')" @click="close">{{ t('editorUi.dialog.close') }}</button>
      </form>
    </template>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { X } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'
  import { type LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      open: boolean
      title: string
      icon?: LucideIconName
      size?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    }>(),
    { icon: undefined, size: '2xl' }
  )

  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  // Tailwind が拾えるよう、クラス名は完全な文字列で書く
  const sizeClass = {
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
  } as const

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const IconComponent = computed(() => (props.icon ? resolveLucideIcon(props.icon) : null))

  // 中身(modal-box)を DOM に置いているか。open より少し長く true にして、閉じるアニメーションを見せる
  const rendered = ref(props.open)
  // DaisyUI の modal-box の transition(.3s)に合わせる
  const CLOSE_ANIMATION_MS = 300
  let unmountTimer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    if (props.open) dialogRef.value?.showModal()
  })
  onBeforeUnmount(() => clearTimeout(unmountTimer))

  watch(
    () => props.open,
    async (open) => {
      clearTimeout(unmountTimer)
      if (open) {
        // 閉じた状態の modal-box を先に描画・スタイル確定してから開く(でないと transition が走らない)
        rendered.value = true
        await nextTick()
        void dialogRef.value?.offsetHeight
        if (props.open) dialogRef.value?.showModal()
      } else {
        dialogRef.value?.close()
        unmountTimer = setTimeout(() => (rendered.value = false), CLOSE_ANIMATION_MS)
      }
    }
  )

  // Esc・×・バックドロップ・dialog.close() のどれでもここに来る。すでに閉じていれば何もしない
  const close = () => {
    if (props.open) emit('update:open', false)
  }
</script>
