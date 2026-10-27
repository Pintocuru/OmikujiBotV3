<!-- src/editor/assets/PostFlow/Sounds/SoundSettings.vue -->
<template>
  <SettingItem icon="Volume2" layout="vertical" :label="t('postFlow.sound.label')" :description="t('postFlow.sound.desc')">
    <!-- プリセット選択 -->
    <select v-model="sound" class="select select-bordered select-sm w-full">
      <option value="">{{ t('postFlow.common.none') }}</option>
      <option v-for="(_, key) in soundMap" :key="key" :value="key">{{ t(`mapText.sound.${key}`) }} ({{ key }})</option>
    </select>
  </SettingItem>

  <!-- カスタムパス -->
  <SettingItem icon="Volume2" layout="vertical" :label="t('postFlow.sound.customLabel')" :description="t('postFlow.sound.customDesc')">
    <input
      v-model="soundPath"
      type="text"
      :placeholder="t('postFlow.sound.customPlaceholder')"
      class="input input-bordered input-sm w-full"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { PostFlowMessageType, PostFlowSoundType } from '@/types/OmikujiData'
  import { soundMap } from '@/maps/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    action: PostFlowMessageType | PostFlowSoundType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowMessageType | PostFlowSoundType]
  }>()

  const updateAction = (updates: Partial<PostFlowMessageType | PostFlowSoundType>) => {
    const updatedAction = { ...props.action, ...updates } as PostFlowMessageType | PostFlowSoundType
    emit('update:action', updatedAction)
  }

  // プリセット選択時は soundPath をクリア
  const sound = computed({
    get: () => props.action.sound || '',
    set: (value) => updateAction({ sound: value || undefined, soundPath: '' }),
  })

  // カスタムパス入力時は sound をクリア
  const soundPath = computed({
    get: () => props.action.soundPath || '',
    set: (value) => updateAction({ soundPath: value || '', sound: value ? '' : props.action.sound }),
  })
</script>
