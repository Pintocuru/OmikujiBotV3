<!-- src/editor/assets/characters/CharacterImage/EmotionEditModal.vue -->
<template>
  <BaseEditDialog ref="baseDialog" :title="t('characterImage.editModal.title')" icon="Info" @save="handleSave">
    <div v-if="draftKey && draftItem" class="space-y-2">
      <ImageSettingsInfo />
      <EmotionImageItem
        :emotion-key="draftKey"
        :label="draftItem.label ?? ''"
        :is-default-warning="draftKey === 'default' && !props.isDefaultFilled"
        @update:label="updateLabel"
      />
      <div class="grid grid-cols-2 gap-4">
        <EmotionLayerEditor
          :src="draftItem.src"
          :emotion-key="draftKey"
          :selected-item-key="selectedItemKey ?? 'default'"
          @update:src="updateSrc"
        />
        <EmotionAnimationEditor
          :emotion-key="draftKey"
          :src="draftItem.src"
          :animation="draftItem.animation"
          @update:animation="updateAnimation"
        />
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-32 text-base-content/40 text-sm">
      {{ t('characterImage.editModal.noneSelected') }}
    </div>
  </BaseEditDialog>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref } from 'vue'
  import type { CharacterImageSetType, CharacterImageType } from '@/types/OmikujiData'
  import EmotionImageItem from './EmotionImageItem.vue'
  import EmotionLayerEditor from './EmotionLayerEditor.vue'
  import EmotionAnimationEditor from './EmotionAnimationEditor.vue'
  import ImageSettingsInfo from './ImageSettingsInfo.vue'
  import BaseEditDialog from '@/editor/parts/BaseEditDialog.vue'
  import { useEmotionDraft } from './composables/useEmotionDraft'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: CharacterImageSetType
    selectedItemKey: string | null
    isDefaultFilled: boolean
  }>()

  // 保存は編集した1キーぶんだけ。追加・削除・複製は一覧側(EmotionGrid)の即時操作
  const emit = defineEmits<{
    update: [key: string, value: CharacterImageType]
  }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)

  const { draftKey, draftItem, initDraft, updateSrc, updateLabel, updateAnimation } = useEmotionDraft(
    () => props.modelValue
  )

  const handleSave = () => {
    if (!draftKey.value || !draftItem.value) return
    emit('update', draftKey.value, { ...draftItem.value })
  }

  const showModal = (key: string) => {
    initDraft(key)
    baseDialog.value?.showModal()
  }

  const closeModal = () => baseDialog.value?.close()

  defineExpose({ showModal, closeModal })
</script>
