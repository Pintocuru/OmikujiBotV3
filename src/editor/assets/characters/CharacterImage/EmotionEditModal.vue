<!-- src/editor/assets/characters/CharacterImage/EmotionEditModal.vue -->
<template>
  <BaseEditDialog ref="baseDialog" :title="t('characterImage.editModal.title')" icon="Info" @save="handleSave">
    <div v-if="draftKey && draftItem" class="space-y-2">
      <EmotionImageItem
        :emotion-key="draftKey"
        :label="draftItem.label ?? ''"
        :is-default-warning="draftKey === 'default' && !props.isDefaultFilled"
        :key-locked="originalKey === 'default'"
        :validate-key="validateKey"
        @update:label="updateLabel"
        @rename="updateKey"
      />
      <div class="grid grid-cols-2 gap-4">
        <EmotionLayerEditor
          :src="draftItem.src"
          :emotion-key="draftKey"
          :selected-item-key="selectedItemKey ?? 'default'"
          :other-emotion-paths="otherEmotionPaths"
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
  import { computed, ref } from 'vue'
  import type { CharacterImageSetType, CharacterImageType } from '@/types/OmikujiData'
  import EmotionImageItem from './EmotionImageItem.vue'
  import EmotionLayerEditor from './EmotionLayerEditor.vue'
  import EmotionAnimationEditor from './EmotionAnimationEditor.vue'
  import BaseEditDialog from '@/editor/parts/BaseEditDialog.vue'
  import { useEmotionDraft } from './composables/useEmotionDraft'
  import { validateEmotionKey } from './composables/emotionOperations'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: CharacterImageSetType
    selectedItemKey: string | null
    isDefaultFilled: boolean
  }>()

  // 保存は編集した1キーぶんだけ(キーを変えたときは oldKey → newKey の付け替え)。追加・削除・複製は一覧側(EmotionGrid)の即時操作
  const emit = defineEmits<{
    update: [oldKey: string, newKey: string, value: CharacterImageType]
  }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)

  const { originalKey, draftKey, draftItem, initDraft, updateKey, updateSrc, updateLabel, updateAnimation } =
    useEmotionDraft(() => props.modelValue)

  const validateKey = (input: string) => validateEmotionKey(props.modelValue, originalKey.value ?? '', input)

  // このキャラクターの他の感情で使っているパス (レイヤー候補の1番目のグループ)
  const otherEmotionPaths = computed(() =>
    Object.entries(props.modelValue)
      .filter(([key]) => key !== originalKey.value)
      .flatMap(([, image]) => image.src)
      .filter((path) => path.trim() !== '')
  )

  const handleSave = () => {
    if (!originalKey.value || !draftKey.value || !draftItem.value) return
    emit('update', originalKey.value, draftKey.value, { ...draftItem.value })
    originalKey.value = draftKey.value // ダイアログが開いたままでも、次の保存が新しいキーを指すように
  }

  const showModal = (key: string) => {
    initDraft(key)
    baseDialog.value?.showModal()
  }

  const closeModal = () => baseDialog.value?.close()

  defineExpose({ showModal, closeModal })
</script>
