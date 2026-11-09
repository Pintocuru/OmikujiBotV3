<!-- src/editor/assets/characters/CharacterImage/CharacterImageSettings.vue -->
<template>
  <div class="flex gap-2 mb-2">
    <input
      type="text"
      class="input input-sm"
      :class="{ 'input-error': isNumericKey }"
      :placeholder="t('characterImage.newEmotionPlaceholder')"
      v-model="newEmotionKey"
    />
    <button
      class="btn btn-sm btn-secondary gap-2"
      @click="handleAddEmotion"
      :disabled="!newEmotionKey.trim() || isNumericKey"
    >
      <Plus class="w-4 h-4" />
      {{ t('characterImage.add') }}
    </button>
  </div>
  <p v-if="isNumericKey" class="text-error text-xs mb-2">{{ t('characterImage.numericKeyError') }}</p>

  <EmotionPresetButtons :existing-keys="Object.keys(currentImages)" @add="handleAddPreset" />

  <EmotionGrid
    :images="currentImages"
    @select="handleSelectEmotion"
    @reorder="pushImages"
    @duplicate="handleDuplicateEmotion"
    @remove="handleRemoveEmotion"
  />

  <EmotionEditModal
    ref="editModalRef"
    :model-value="currentImages"
    :selected-item-key="selectedItemKey"
    :is-default-filled="isDefaultFilled"
    @update="handleUpdateEmotion"
  />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, nextTick, ref } from 'vue'
  import { Plus } from 'lucide-vue-next'
  import { CharacterImageSetSchema, CharacterImageSetType, CharacterImageType } from '@/types/OmikujiData'
  import EmotionPresetButtons from './EmotionPresetButtons.vue'

  import EmotionGrid from './EmotionGrid.vue'
  import EmotionEditModal from './EmotionEditModal.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { NUMERIC_KEY_PATTERN, duplicateEmotion, renameEmotion } from './composables/emotionOperations'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: CharacterImageSetType
    selectedItemKey: string | null
  }>()

  const { updateAssetProperty } = useOmikujiStore()
  const editModalRef = ref<InstanceType<typeof EmotionEditModal> | null>(null)
  const newEmotionKey = ref('')

  // 数字だけのキーは並び順を保存できないため追加させない(NUMERIC_KEY_PATTERN の説明を参照)
  const isNumericKey = computed(() => NUMERIC_KEY_PATTERN.test(newEmotionKey.value.trim()))

  // 現在の画像データ
  const currentImages = computed(() => props.modelValue ?? CharacterImageSetSchema.parse({}))

  const isDefaultFilled = computed(() => currentImages.value['default']?.src.some((v) => v.trim() !== '') ?? false)

  // Store への書き込み
  const pushImages = (newImages: CharacterImageSetType) => {
    if (!props.selectedItemKey) return
    updateAssetProperty('characters', props.selectedItemKey, 'image', newImages)
  }

  // 編集ダイアログの保存: 編集した1キーだけを書き戻す(キーを変えても元の位置に置くので並び順は変わらない)
  // シナリオの iconKey など、他のデータの参照は書き換えない(未使用キーの修復は IconKeyChanger の役目)
  const handleUpdateEmotion = (oldKey: string, newKey: string, value: CharacterImageType) => {
    const next = renameEmotion(currentImages.value, oldKey, newKey, value)
    if (next) pushImages(next)
  }

  const handleAddPreset = async (key: string, label: string) => {
    if (key in currentImages.value) return
    pushImages({ ...currentImages.value, [key]: { label, src: [`${props.selectedItemKey}/${key}.webp`] } })
    await nextTick()
    editModalRef.value?.showModal(key) // key を直接渡すだけ
  }

  const handleSelectEmotion = (key: string) => {
    editModalRef.value?.showModal(key)
  }

  const handleAddEmotion = async () => {
    const key = newEmotionKey.value.trim()
    if (!key || NUMERIC_KEY_PATTERN.test(key) || key in currentImages.value) return
    pushImages({ ...currentImages.value, [key]: { label: key, src: [''] } }) // 空の1枚目 (ダイアログを開くと自動検出する)
    newEmotionKey.value = ''
    await nextTick()
    editModalRef.value?.showModal(key)
  }

  // 感情の削除(一覧側の即時操作。確認してから消す)
  const handleRemoveEmotion = async (key: string) => {
    if (key === 'default') return
    const result = await swalModal.confirmDelete({
      text: t('characterImage.editModal.confirmDelete', { name: currentImages.value[key]?.label || key }),
    })
    if (!result.isConfirmed) return
    const { [key]: _, ...rest } = currentImages.value
    pushImages(rest as CharacterImageSetType)
  }

  // 感情の複製(元の直後に挿入し、すぐ編集ダイアログを開く)
  const handleDuplicateEmotion = async (key: string) => {
    const result = duplicateEmotion(currentImages.value, key, (label) => t('characterImage.item.copyLabel', { label }))
    if (!result) return
    pushImages(result.images)
    await nextTick()
    editModalRef.value?.showModal(result.newKey)
  }
</script>
