<!-- src/editor/assets/PostFlow/PostActionsPreview.vue -->
<template>
  <div class="bg-base-200 rounded p-3 text-sm relative">
    <div v-if="actions.length !== 0" class="space-y-0">
      <div v-for="(action, index) in actions" :key="index" class="flex-1 min-w-0 flex">
        <!-- アイコンやバッジ部分 -->
        <PostActionRow :action="action" />

        <!-- 本文部分 -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap gap-1 items-center">
            <span class="text-base-content truncate">
              {{ displayText(action) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-base-content/70 italic">{{ t('postFlow.actionsPreview.empty') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { PostFlowType } from '@/types/OmikujiData'
  import PostActionRow from './tooltab/PostActionRow.vue'

  const { t } = useI18n()

  defineProps<{
    actions: PostFlowType[]
  }>()

  const displayText = (action: PostFlowType) => {
    switch (action.kind) {
      case 'message':
        return action.message || 'error'
      case 'wordParty':
        return action.wordPartyId
      case 'sound':
        return action.sound
      case 'flowCall':
        return t('postFlow.actionsPreview.flowCall', { keys: action.callKeys })
      default:
        return ''
    }
  }
</script>
