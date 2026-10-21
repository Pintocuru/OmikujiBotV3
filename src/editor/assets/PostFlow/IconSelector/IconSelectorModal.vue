<!-- src/editor/assets/PostFlow/IconSelector/IconSelectorModal.vue -->
<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box max-w-4xl space-y-4">
      <h3 class="font-bold text-lg">{{ t('postFlow.iconSelector.title', { name: characterName }) }}</h3>

      <EmotionGrid :images="characterImages" :selected-key="currentIconKey" readonly @select="selectEmotion" />

      <div class="modal-action">
        <button @click="closeModal" class="btn">{{ t('postFlow.common.cancel') }}</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, computed, type Ref } from 'vue'
  import EmotionGrid from '@/editor/assets/characters/CharacterImage/EmotionGrid.vue'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

  const { t } = useI18n()

  const props = defineProps<{
    characterKey: string
    currentIconKey: string
  }>()

  const emit = defineEmits<{
    'select:icon': [iconKey: string]
  }>()

  const { characterMap } = useCharacterLookup()
  const modalRef: Ref<HTMLDialogElement | null> = ref(null)

  const characterName = computed(() => characterMap.value[props.characterKey]?.name ?? '')
  const characterImages = computed(() => characterMap.value[props.characterKey]?.image ?? {})

  const selectEmotion = (key: string) => {
    emit('select:icon', key)
    closeModal()
  }

  const showModal = () => modalRef.value?.showModal()
  const closeModal = () => modalRef.value?.close()
  defineExpose({ showModal, closeModal })
</script>
