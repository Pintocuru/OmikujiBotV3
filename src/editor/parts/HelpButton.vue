<!-- src/editor/parts/HelpButton.vue -->
<!-- はてなボタン。押すと説明ダイアログを開く。説明の中身はデフォルトスロットに書く(どの画面でも使い回せる) -->
<template>
  <div class="tooltip tooltip-top" :data-tip="t('editorUi.help.open')">
    <button
      ref="buttonRef"
      type="button"
      class="btn btn-ghost btn-circle btn-xs text-info"
      :aria-label="t('editorUi.help.open')"
      @click="show"
    >
      <CircleHelp class="w-4 h-4" />
    </button>
  </div>

  <!-- label の中に置かれても、ダイアログ内のクリックでボタンが再び押されないよう body へ移す。
       Teleport 先には data-theme が届かないので、ボタンの位置のテーマを引き継ぐ -->
  <Teleport to="body">
    <div :data-theme="theme">
      <BaseDialog v-model:open="isOpen" :title="title" size="xl">
        <div class="space-y-3 text-sm">
          <slot />
        </div>
      </BaseDialog>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { CircleHelp } from 'lucide-vue-next'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'

  const { t } = useI18n()

  defineProps<{
    /** 説明ダイアログのタイトル */
    title: string
  }>()

  const buttonRef = ref<HTMLButtonElement | null>(null)
  const isOpen = ref(false)
  const theme = ref<string | undefined>(undefined)

  const show = () => {
    theme.value =
      buttonRef.value?.closest('[data-theme]')?.getAttribute('data-theme') ??
      document.documentElement.getAttribute('data-theme') ??
      undefined
    isOpen.value = true
  }
</script>
