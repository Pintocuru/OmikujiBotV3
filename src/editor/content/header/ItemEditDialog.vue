<!-- src/editor/content/header/ItemEditDialog.vue -->
<!-- 選択中アイテムの基本設定(名前・説明・タグ・有効/無効・Key)を編集するダイアログ。入力は即時に反映される -->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="close">
    <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-lg font-bold flex items-center gap-2">
          <SlidersHorizontal class="w-5 h-5" />
          {{ t('categorySections.baseSettings.label') }}
        </h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="close">
          <X :size="16" />
        </button>
      </div>

      <div v-if="selectedItem" class="space-y-2">
        <BaseEditor v-model="selectedItem" :category="dataCategory" :isIsEnabled="isEnabledEditable" />

        <!-- キャラクターだけは、色・コメント表現もここで編集する -->
        <template v-if="character && selectedItemKey">
          <SubSectionHeader
            class="mt-6"
            icon="Palette"
            :title="t('categorySections.colorSettings.label')"
            :description="t('categorySections.colorSettings.description')"
          />
          <CharacterColorSettings
            :botName="character.displayName"
            :modelValue="character.color"
            @update:modelValue="(value) => updateAssetProperty('characters', selectedItemKey!, 'color', value)"
          />

          <SubSectionHeader
            class="mt-6"
            icon="MessageSquare"
            :title="t('categorySections.commentVoice.label')"
            :description="t('categorySections.commentVoice.description')"
          />
          <CommentVoiceSettings
            :modelValue="character.displayOption"
            :backgroundColor="character.color.background"
            :onUpdate="(value) => updateAssetProperty('characters', selectedItemKey!, 'displayOption', value)"
          />
        </template>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop"><button @click="close">close</button></form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { SlidersHorizontal, X } from 'lucide-vue-next'
  import type { DataCategoryType } from '@/types/OmikujiData'
  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import CharacterColorSettings from '@/editor/assets/characters/color/CharacterColorSettings.vue'
  import CommentVoiceSettings from '@/editor/assets/characters/service/CommentVoiceSettings.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useSelectedItem } from '../composables/useSelectedItem'

  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  const { t } = useI18n()
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getAsset, isAssetCategory } = useGetAssetData()
  const { updateAssetProperty } = useOmikujiStore()
  const { selectedItem } = useSelectedItem()

  const dialogRef = ref<HTMLDialogElement | null>(null)

  // このダイアログはデータカテゴリ(Events / Assets)でだけ開く
  const dataCategory = computed(() => selectedCategory.value as DataCategoryType)

  // 有効/無効の切り替えを持つのはイベントだけ(アセットは常に有効)
  const isEnabledEditable = computed(() => !isAssetCategory(selectedCategory.value))

  const character = computed(() =>
    selectedCategory.value === 'characters' && selectedItemKey.value
      ? (getAsset('characters', selectedItemKey.value) ?? null)
      : null
  )

  watch(
    () => props.open,
    (open) => {
      if (open) dialogRef.value?.showModal()
      else dialogRef.value?.close()
    }
  )

  const close = () => emit('update:open', false)
</script>
