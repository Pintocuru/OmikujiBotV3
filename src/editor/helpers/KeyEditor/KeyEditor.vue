<!-- src/editor/helpers/KeyEditor/KeyEditor.vue -->
<template>
  <!-- Keyエディタボタン -->
  <button
    class="btn btn-sm btn-outline btn-primary tooltip tooltip-bottom min-w-fit whitespace-nowrap"
    :data-tip="$t('keyEditor.buttonTip')"
    @click="openDialog(currentKey, category)"
  >
    <span>📝</span>
    <span class="hidden sm:inline ml-1">{{ $t('keyEditor.buttonLabel') }}</span>
  </button>

  <!-- ダイアログ -->
  <BaseDialog
    :open="isDialogOpen"
    :title="dialogTitle"
    icon="Key"
    size="2xl"
    @update:open="handleDialogOpenChange"
  >
    <div class="py-4 space-y-4">
      <SettingItem icon="Key" labelKey="keyEditor.currentKey">
        <div class="input input-bordered bg-neutral text-neutral-content select-all">
          {{ dialogKey }}
        </div>
      </SettingItem>

      <SettingItem icon="Key" labelKey="keyEditor.newKey" class="form-control">
        <input
          v-model="newKey"
          type="text"
          :placeholder="$t('keyEditor.newKeyPlaceholder')"
          class="input input-bordered focus:input-primary"
          :class="{ 'input-error': hasError }"
        />
        <label v-if="hasError" class="label">
          <span class="label-text-alt text-error font-bold">{{ errorMessage }}</span>
        </label>
      </SettingItem>

      <KeyEditorUsage v-if="characterUsage" :usage="characterUsage" />
      <KeyEditorWarning :category="dialogCategory" />
    </div>

    <template #actions>
      <ModalFooterActions :on-cancel="closeDialog" :on-save="saveKey" :disabled="!canSave" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { AssetCategoryType } from '@/types/OmikujiData'
  import { useKeyEditor } from './composables/useKeyEditor'
  import KeyEditorUsage from './KeyEditorUsage.vue'
  import KeyEditorWarning from './KeyEditorWarning.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  defineProps<{
    category: AssetCategoryType
    currentKey: string
  }>()

  // props と名前が衝突するので、ダイアログ側の状態は別名で受ける
  const {
    isDialogOpen,
    currentKey: dialogKey,
    currentCategory: dialogCategory,
    newKey,
    errorMessage,
    characterUsage,
    hasError,
    canSave,
    dialogTitle,
    openDialog,
    closeDialog,
    saveKey,
  } = useKeyEditor()

  // BaseDialog から閉じる通知を受けたとき、Composable の状態も同期する
  function handleDialogOpenChange(open: boolean): void {
    if (!open) closeDialog()
  }
</script>
