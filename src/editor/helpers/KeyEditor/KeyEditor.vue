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
  <Teleport to="body">
    <div v-if="isDialogOpen" class="modal modal-open">
      <div class="modal-box bg-base-300">
        <h3 class="font-bold text-lg text-primary">{{ dialogTitle }}</h3>

        <div class="py-4 space-y-4">
          <SettingItem icon="Key" :label="$t('keyEditor.currentKey')">
            <div class="input input-bordered bg-neutral text-neutral-content select-all">
              {{ dialogKey }}
            </div>
          </SettingItem>

          <SettingItem icon="Key" :label="$t('keyEditor.newKey')" class="form-control">
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

        <ModalFooterActions :on-cancel="closeDialog" :on-save="saveKey" :disabled="!canSave" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { AssetCategoryType } from '@/types/OmikujiData'
  import { useKeyEditor } from './composables/useKeyEditor'
  import KeyEditorUsage from './KeyEditorUsage.vue'
  import KeyEditorWarning from './KeyEditorWarning.vue'
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
</script>
