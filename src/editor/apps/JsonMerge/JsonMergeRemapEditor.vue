<!-- src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue -->
<template>
  <div class="border-l-4 border-primary pl-4 py-2 mb-3 bg-base-200 rounded">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium">{{ t('jsonMerge.remap.title', { index: remapIndex + 1 }) }}</span>
      <button @click="removeRemap" class="btn btn-xs btn-ghost" :title="t('jsonMerge.remap.remove')">✕</button>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <!-- 元キャラキー -->
      <SettingItem icon="User" :label="t('jsonMerge.remap.fromCharacter')">
        <select v-model="localRemap.fromCharacterKey" class="select select-sm select-bordered w-full">
          <option v-for="key in jsonMergeSourceCharacterKeys" :key="key" :value="key">{{ key }}</option>
        </select>
      </SettingItem>

      <!-- 新キャラキー -->
      <SettingItem icon="UserPlus" :label="t('jsonMerge.remap.toCharacter')">
        <select v-model="localRemap.toCharacterKey" class="select select-sm select-bordered w-full">
          <option value="">{{ t('jsonMerge.remap.chooseCharacter') }}</option>
          <option v-for="(char, key) in characters" :key="key" :value="key">
            {{ char.displayName || key }}
          </option>
        </select>
        <p v-if="!localRemap.toCharacterKey" class="text-red-500 mt-2">
          {{ t('jsonMerge.remap.missingCharacter') }}
        </p>
      </SettingItem>

      <!-- 元アイコンキー -->
      <SettingItem icon="Image" :label="t('jsonMerge.remap.fromIcon')">
        <select v-model="localRemap.fromIconKey" class="select select-sm select-bordered w-full">
          <option value="">{{ t('jsonMerge.remap.chooseIcon') }}</option>
          <option v-for="(value, key) in characterEmotionMap" :key="key" :value="key">
            {{ value.label }}
          </option>
        </select>
      </SettingItem>

      <!-- 新アイコンキー -->
      <SettingItem icon="Image" :label="t('jsonMerge.remap.toIcon')">
        <select v-model="localRemap.toIconKey" class="select select-sm select-bordered w-full">
          <option value="">{{ t('jsonMerge.remap.chooseIcon') }}</option>
          <option v-for="(value, key) in characterEmotionMap" :key="key" :value="key">
            {{ value.label }}
          </option>
        </select>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { characterEmotionMap, jsonMergeSourceCharacterKeys } from '@/maps/OmikujiData'
  import { CharacterType, JsonMergeRemapType } from '@/types/OmikujiData'

  const props = defineProps<{
    mergeIndex: number
    remapIndex: number
    characters: Record<string, CharacterType>
  }>()

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)
  const { t } = useI18n()

  // 現在のリマップデータ
  const currentRemap = computed(
    () =>
      data.value.jsonMerge?.[props.mergeIndex]?.remaps?.[props.remapIndex] ?? {
        fromCharacterKey: '',
        toCharacterKey: '',
        fromIconKey: '',
        toIconKey: '',
      }
  )

  // v-modelで使用するローカルリマップ
  const localRemap = computed({
    get: () => currentRemap.value,
    set: (newValue: JsonMergeRemapType) => {
      if (!data.value.jsonMerge) return

      const updatedMerge = data.value.jsonMerge.map((merge, idx) => {
        if (idx !== props.mergeIndex) return merge

        return {
          ...merge,
          remaps: merge.remaps.map((remap, remapIdx) => (remapIdx === props.remapIndex ? newValue : remap)),
        }
      })

      store.updateJsonMerge(updatedMerge)
    },
  })

  // リマップを削除
  const removeRemap = () => {
    if (!data.value.jsonMerge) return

    const updatedMerge = data.value.jsonMerge.map((merge, idx) => {
      if (idx !== props.mergeIndex) return merge

      return {
        ...merge,
        remaps: merge.remaps.filter((_, remapIdx) => remapIdx !== props.remapIndex),
      }
    })

    store.updateJsonMerge(updatedMerge)
  }
</script>
