<!-- src/ui/user/UserBoard/editor/UserBoardEditor.vue -->
<template>
  <!-- プレビュー (ダミーのユーザーで表示) -->
  <HudPreview>
    <UserBoardSelector :users="previewUsers" :settings="board" :fontFamily="fontFamily" editorPreview />
  </HudPreview>

  <p class="text-sm opacity-70">{{ t('uiSettings.userBoard.liveConsoleNote') }}</p>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="board.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem
    labelKey="uiSettings.userBoard.color.label"
    descriptionKey="uiSettings.userBoard.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="board.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- 表示件数 (個人の得点リストだけで使う) -->
  <SettingItem
    v-if="currentDefinition?.hasLimit"
    labelKey="uiSettings.userBoard.limit.label"
    descriptionKey="uiSettings.userBoard.limit.description"
    layout="vertical"
    :showReset="true"
    @reset="resetField('limit')"
  >
    <input
      type="number"
      min="1"
      max="30"
      class="input input-bordered w-24"
      :value="board.limit"
      @input="(e) => update('limit', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { UserBoardSchema, type UserBoardType } from '@/types/ui'
  import { getUserBoardComponent, getUserBoardComponentSets } from '../UserBoardRegistry'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import UserBoardSelector from '@/ui/user/UserBoard/UserBoardSelector.vue'
  import { buildPreviewUsers } from '@/ui/user/UserBoard/scripts/boardData'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const board = computed(() => UserBoardSchema.parse(data.value.ui.settings.userBoard ?? {}))
  const previewUsers = buildPreviewUsers()

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const currentDefinition = computed(() => getUserBoardComponent(board.value.component))
  const componentOptions = computed(() => {
    const options: Record<string, { label: string; invalid?: boolean }> = {}
    const currentId = board.value.component
    if (!currentDefinition.value)
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }), invalid: true }
    for (const set of Object.values(getUserBoardComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // 更新関数
  const update = <K extends keyof UserBoardType>(field: K, value: UserBoardType[K]) => {
    updateItemSettings('userBoard', { [field]: value })
  }

  // リセット関数
  const resetField = (field: keyof UserBoardType) => {
    update(field, UserBoardSchema.parse({})[field])
  }
</script>
