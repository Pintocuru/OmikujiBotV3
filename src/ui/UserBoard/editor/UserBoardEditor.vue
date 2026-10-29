<!-- src/ui/UserBoard/editor/UserBoardEditor.vue -->
<template>
  <!-- プレビュー (ダミーのユーザーで表示) -->
  <HudPreview :isAdminOnly="true">
    <UserBoardSelector :users="previewUsers" :settings="board" :fontFamily="fontFamily" />
  </HudPreview>

  <p class="text-sm opacity-70">
    LiveConsole(<code>console.html</code>)で操作した、ユーザーの得点・チームが表示されます。プレビューはダミーです。
  </p>

  <!-- 表示するコンポーネント -->
  <SettingItem label="表示のしかた" description="個人の得点リスト・チームの得点(2種類)から選べます" layout="vertical">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(info, key) in userBoardComponentMap"
        :key="key"
        class="badge badge-lg cursor-pointer whitespace-nowrap"
        :class="board.component === key ? 'badge-primary' : 'badge-outline'"
        :title="info.description"
        @click="update('component', key)"
      >
        {{ info.label }}
      </div>
    </div>
  </SettingItem>

  <!-- カラー設定 -->
  <SettingItem
    label="カラー設定"
    description="表示するカラーを設定します(チームの色は、LiveConsole で割り当てた色になります)"
    layout="vertical"
  >
    <ColorPicker :modelValue="board.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- 表示件数 (個人の得点リストだけで使う) -->
  <SettingItem
    v-if="board.component === 'ranking'"
    label="表示件数"
    description="得点リストに表示する人数を設定します(最大30)"
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
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { UserBoardSchema, type UserBoardType } from '@/types/ui'
  import { userBoardComponentMap } from '@/maps/ui'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import UserBoardSelector from '@/ui/UserBoard/UserBoardSelector.vue'
  import { buildPreviewUsers } from '@/ui/UserBoard/scripts/boardData'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const board = computed(() => UserBoardSchema.parse(data.value.ui.settings.userBoard ?? {}))
  const previewUsers = buildPreviewUsers()

  // 更新関数
  const update = <K extends keyof UserBoardType>(field: K, value: UserBoardType[K]) => {
    updateItemSettings('userBoard', { [field]: value })
  }

  // リセット関数
  const resetField = (field: keyof UserBoardType) => {
    update(field, UserBoardSchema.parse({})[field])
  }
</script>
