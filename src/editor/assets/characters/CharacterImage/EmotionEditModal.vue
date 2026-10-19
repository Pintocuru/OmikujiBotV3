<!-- src/editor/assets/characters/CharacterImage/EmotionEditModal.vue -->
<template>
  <BaseEditDialog ref="baseDialog" :title="t('characterImage.editModal.title')" icon="Info" @save="handleSave">
    <div v-if="selectedEmotionKey && draftItem" class="space-y-2">
      <ImageSettingsInfo />
      <EmotionImageItem
        :emotion-key="selectedEmotionKey"
        :label="draftItem.label ?? ''"
        :is-default-warning="selectedEmotionKey === 'default' && !props.isDefaultFilled"
        @update:label="(v) => updateLabel(selectedEmotionKey!, v)"
        @remove="handleDraftRemove"
      />
      <div class="grid grid-cols-2 gap-4">
        <EmotionLayerEditor
          :src="draftItem.src"
          :emotion-key="selectedEmotionKey"
          :selected-item-key="selectedItemKey ?? 'default'"
          @update:src="(v) => updateSrc(selectedEmotionKey!, v)"
        />
        <EmotionAnimationEditor
          :emotion-key="selectedEmotionKey"
          :src="draftItem.src"
          :animation="draftItem.animation"
          @update:animation="(v) => updateAnimation(selectedEmotionKey!, v)"
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
  import { ref, computed } from 'vue'
  import type { CharacterImageType } from '@/types/'
  import EmotionImageItem from './EmotionImageItem.vue'
  import EmotionLayerEditor from './EmotionLayerEditor.vue'
  import EmotionAnimationEditor from './EmotionAnimationEditor.vue'
  import ImageSettingsInfo from './ImageSettingsInfo.vue'
  import BaseEditDialog from '@/editor/parts/BaseEditDialog.vue'
  import { useEmotionDraft } from './composables/useEmotionDraft'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: CharacterImageType
    selectedItemKey: string | null
    isDefaultFilled: boolean
    // initialEmotionKey は廃止 ✕
  }>()

  const emit = defineEmits<{
    update: [value: CharacterImageType]
    remove: [key: string]
  }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const selectedEmotionKey = ref<string | null>(null)

  const { draftValue, initDraft, updateSrc, updateLabel, updateAnimation } = useEmotionDraft(() => props.modelValue)

  const draftItem = computed(() =>
    selectedEmotionKey.value ? (draftValue.value[selectedEmotionKey.value] ?? null) : null
  )

  const handleDraftRemove = async () => {
    if (!selectedEmotionKey.value) return
    const result = await swalModal.confirmDelete({
      text: t('characterImage.editModal.confirmDelete', { name: draftItem.value?.label ?? selectedEmotionKey.value }),
      target: baseDialog.value?.$el ?? 'body',
    })
    if (!result.isConfirmed) return
    emit('remove', selectedEmotionKey.value)
    selectedEmotionKey.value = null
    closeModal()
  }

  const handleSave = () => {
    emit('update', { ...draftValue.value })
  }

  // watch を完全削除 — showModal の引数だけで状態確定
  const showModal = (key: string) => {
    initDraft()
    selectedEmotionKey.value = key
    baseDialog.value?.showModal()
  }

  const closeModal = () => baseDialog.value?.close()

  defineExpose({ showModal, closeModal })
</script>
