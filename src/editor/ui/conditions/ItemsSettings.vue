<!-- src/editor/ui/conditions/ItemsSettings.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
    <SettingItem
      v-for="[kind, item] in entries"
      :key="kind"
      :label="item.label"
      :description="kind"
      :variant="isEnabled(kind) ? undefined : 'neutral'"
    >
      <input
        type="checkbox"
        class="toggle toggle-warning toggle-sm"
        :checked="isEnabled(kind)"
        @change="handleToggle(kind, $event)"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { UiSettingsSchema } from '@/types'
  import type { UiKind } from '@/types'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { getUiEditorEntries } from '../uiEditorRegistry'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // main.ts で登録された UI だけが対象
  const entries = getUiEditorEntries()

  const isEnabled = (kind: UiKind) => data.value.ui.settings[kind] !== undefined

  const handleToggle = async (kind: UiKind, event: Event) => {
    const checkbox = event.target as HTMLInputElement

    // ON: スキーマの既定値で初期化
    if (checkbox.checked) {
      omikujiStore.updateItemSettings(kind, UiSettingsSchema.shape[kind].unwrap().parse({}))
      return
    }

    // OFF: 確認ダイアログ（キャンセル時のために一旦チェックを戻す）
    checkbox.checked = true
    const result = await swalModal.confirmDelete({
      title: `${entries.find(([k]) => k === kind)?.[1].label ?? kind} を無効にしますか？`,
      text: 'この設定データは削除されます',
    })
    if (result.isConfirmed) omikujiStore.removeItemSetting(kind)
  }
</script>
