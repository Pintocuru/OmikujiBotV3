<!-- src/editor/parts/BaseEditDialog.vue -->
<!-- BaseDialog に「キャンセル / 保存して閉じる」と左右サイドバーを足したもの。即時反映で良いなら BaseDialog を直接使う -->
<template>
  <BaseDialog :open="open" :title="title" :icon="icon" size="3xl" @update:open="onUpdateOpen">
    <!-- 本体: 左サイドバー・メイン・右サイドバー -->
    <div class="flex min-h-0 divide-x divide-base-300">
      <div v-if="$slots['sidebar-left']" class="hidden md:flex w-60 shrink-0 flex-col bg-base-100">
        <slot name="sidebar-left" />
      </div>

      <div class="flex-1 flex flex-col min-w-0">
        <slot />
      </div>

      <div v-if="$slots['sidebar-right']" class="hidden lg:flex w-72 shrink-0 flex-col bg-base-100">
        <slot name="sidebar-right" />
      </div>
    </div>

    <template #actions>
      <div class="flex w-full items-center justify-between gap-2">
        <!-- 左側: 任意の補足情報スロット -->
        <div class="text-xs text-base-content">
          <slot name="footer-info" />
        </div>

        <div class="flex gap-2">
          <button class="btn btn-sm btn-ghost" @click="handleCancel">キャンセル</button>
          <button class="btn btn-sm btn-primary gap-1" :disabled="saveDisabled" @click="handleSave">
            <Check :size="14" />
            保存して閉じる
          </button>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Check } from 'lucide-vue-next'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  defineProps<{
    title: string
    icon: LucideIconName
    saveDisabled?: boolean // true の間は保存ボタンを無効化
  }>()

  const emit = defineEmits<{
    save: [] // 保存ボタン押下
    cancel: [] // キャンセル / × / バックドロップ / Esc
  }>()

  const open = ref(false)

  const handleSave = () => {
    emit('save')
    open.value = false
  }

  const handleCancel = () => {
    emit('cancel')
    open.value = false
  }

  // BaseDialog 側の ×・バックドロップ・Esc はキャンセル扱い
  const onUpdateOpen = (value: boolean) => {
    if (!value) handleCancel()
  }

  // 外部から開くための公開メソッド
  const showModal = () => {
    open.value = true
  }
  // 外部から閉じるための公開メソッド（保存・キャンセル処理は呼ばない）
  const close = () => {
    open.value = false
  }

  defineExpose({ showModal, close })
</script>
