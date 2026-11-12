<!-- src/editor/parts/BaseEditDialog.vue -->
<!-- BaseDialog に「キャンセル / 保存して閉じる」と左右サイドバーを足したもの。即時反映で良いなら BaseDialog を直接使う -->
<template>
  <BaseDialog :open="open" :title="title" :icon="icon" :size="size" @update:open="onUpdateOpen">
    <!-- 本体: 左サイドバー・メイン・右サイドバー。高さは bodyClass で呼び出し側が決める -->
    <div class="flex min-h-0 divide-x divide-base-300" :class="bodyClass">
      <div v-if="$slots['sidebar-left']" class="hidden md:flex w-60 shrink-0 flex-col bg-base-100">
        <slot name="sidebar-left" />
      </div>

      <div class="flex-1 flex flex-col min-w-0">
        <slot />
      </div>

      <!-- alwaysShowRightSidebar: true なら幅に関係なく常に表示 -->
      <div
        v-if="$slots['sidebar-right']"
        class="shrink-0 flex-col bg-base-100 min-h-0 overflow-hidden"
        :class="alwaysShowRightSidebar ? 'flex w-72' : 'hidden lg:flex w-72'"
      >
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
          <button class="btn btn-sm btn-ghost" @click="handleCancel">{{ t('editorUi.editDialog.cancel') }}</button>
          <button class="btn btn-sm btn-primary gap-2" :disabled="saveDisabled" @click="handleSave">
            <Check class="w-4 h-4" />
            {{ t('editorUi.editDialog.saveClose') }}
          </button>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Check } from 'lucide-vue-next'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  const { t } = useI18n()

  withDefaults(
    defineProps<{
      title: string
      icon: LucideIconName
      saveDisabled?: boolean // true の間は保存ボタンを無効化
      size?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' // ダイアログ幅
      bodyClass?: string // 本体の高さ等(Tailwind クラスは完全な文字列で渡す)
      alwaysShowRightSidebar?: boolean // true なら右サイドバーを lg 未満でも表示
    }>(),
    { saveDisabled: false, size: '3xl', bodyClass: 'h-[70vh]', alwaysShowRightSidebar: false }
  )

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
  // 外部から閉じるための公開メソッド(保存・キャンセル処理は呼ばない)
  const close = () => {
    open.value = false
  }

  defineExpose({ showModal, close })
</script>
