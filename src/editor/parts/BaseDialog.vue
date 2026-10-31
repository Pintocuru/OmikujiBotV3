<!-- src/editor/parts/BaseDialog.vue -->
<!-- タイトル + ×ボタン + 本文 + (任意の)アクションだけを持つ薄いダイアログ。保存/キャンセルが要るときは BaseEditDialog を使う -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="close">
    <div class="modal-box max-h-[90vh] overflow-y-auto" :class="sizeClass[size]">
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-lg font-bold flex items-center gap-2">
          <component :is="IconComponent" v-if="IconComponent" class="w-5 h-5" />
          {{ title }}
        </h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="close">
          <X :size="16" />
        </button>
      </div>

      <slot />

      <div v-if="$slots.actions" class="modal-action">
        <slot name="actions" />
      </div>
    </div>

    <form method="dialog" class="modal-backdrop"><button @click="close">close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { X } from 'lucide-vue-next'
  import { type LucideIconName, resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const props = withDefaults(
    defineProps<{
      open: boolean
      title: string
      icon?: LucideIconName
      size?: 'xl' | '2xl' | '3xl'
    }>(),
    { icon: undefined, size: '2xl' }
  )

  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  // Tailwind が拾えるよう、クラス名は完全な文字列で書く
  const sizeClass = { xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl' } as const

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const IconComponent = computed(() => (props.icon ? resolveLucideIcon(props.icon) : null))

  onMounted(() => {
    if (props.open) dialogRef.value?.showModal()
  })

  watch(
    () => props.open,
    (open) => {
      if (open) dialogRef.value?.showModal()
      else dialogRef.value?.close()
    }
  )

  // Esc・×・バックドロップ・dialog.close() のどれでもここに来る。すでに閉じていれば何もしない
  const close = () => {
    if (props.open) emit('update:open', false)
  }
</script>
