<!-- src/editor/assets/PostFlow/variable/VariableSettings.vue -->
<template>
  <SettingItem icon="Code2" layout="vertical" :label="t('postFlow.variable.label')">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { PostFlowVariableType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '../Message/MessageTextDialog.vue'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowVariableType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowVariableType]
  }>()

  // --- Helper Functions ---
  const updateAction = (updates: Partial<PostFlowVariableType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  const bubbleText = computed<string>({
    get: () => props.action.message ?? '',
    set: (value) => updateAction({ message: value }),
  })
</script>
