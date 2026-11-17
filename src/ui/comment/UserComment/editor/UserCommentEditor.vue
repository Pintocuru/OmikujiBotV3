<!-- src/ui/comment/UserComment/editor/UserCommentEditor.vue -->
<template>
  <!-- サンプル表示 -->
  <HudPreview>
    <UserCommentList :entries="previewEntries" :fontFamily="data.ui.fontFamily" />
  </HudPreview>

  <!-- 名前の表示 -->
  <SettingItem
    labelKey="uiSettings.userComment.nameMode.label"
    descriptionKey="uiSettings.userComment.nameMode.description"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="mode in userCommentNameModes"
        :key="mode"
        class="badge badge-lg cursor-pointer whitespace-nowrap"
        :class="userComment.nameMode === mode ? 'badge-primary' : 'badge-outline'"
        @click="update('nameMode', mode)"
      >
        {{ t(`uiSettings.userComment.nameMode.options.${mode}`) }}
      </div>
    </div>
  </SettingItem>

  <!-- 表示件数 -->
  <SettingItem
    labelKey="uiSettings.userComment.maxItems.label"
    descriptionKey="uiSettings.userComment.maxItems.description"
    :showReset="true"
    @reset="resetField('maxItems')"
  >
    <input
      type="number"
      min="1"
      :max="USER_COMMENT_MAX_ITEMS"
      class="input input-bordered w-24"
      :value="userComment.maxItems"
      @input="(e) => update('maxItems', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { USER_COMMENT_MAX_ITEMS, UserCommentSchema, userCommentNameModes, type UserCommentType } from '@/types/ui'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import UserCommentList from '../UserCommentList.vue'
  import { resolveCommentName } from '../scripts/userCommentName'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore

  const userComment = computed(() => UserCommentSchema.parse(data.value.ui.settings.userComment ?? {}))

  // 更新・リセット
  const update = <K extends keyof UserCommentType>(field: K, value: UserCommentType[K]) => {
    updateItemSettings('userComment', { [field]: value })
  }
  const resetField = (field: keyof UserCommentType) => {
    update(field, UserCommentSchema.parse({})[field])
  }

  // --- プレビュー用のサンプル(表示件数・名前の設定に合わせて変わる) ---
  const samples = [
    { userName: 'たろう', userId: 'sample-1', comment: 'おみくじ', reply: 'たろうさんの運勢は【大吉】' },
    { userName: 'はなこ', userId: 'sample-2', comment: 'おみくじ', reply: 'はなこさんの運勢は【中吉】' },
    { userName: 'ゆうた', userId: 'sample-3', comment: '運勢おねがいします', reply: 'ゆうたさんの運勢は【吉】' },
    { userName: 'たろう', userId: 'sample-1', comment: 'もう一回', reply: 'たろうさんの運勢は【凶】' },
  ]
  const previewEntries = computed(() =>
    samples
      .map((s, i) => ({
        id: `preview-${i}`,
        name: resolveCommentName(s, userComment.value.nameMode),
        comment: s.comment,
        reply: s.reply,
      }))
      .slice(-userComment.value.maxItems)
  )
</script>
