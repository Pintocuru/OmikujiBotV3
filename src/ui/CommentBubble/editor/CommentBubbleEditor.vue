<!-- src/ui/CommentBubble/editor/CommentBubbleEditor.vue -->
<template>
  <!-- プレビュー表示 -->
  <CommentBubblePreview
    :settings="bubble"
    :fontFamily="fontFamily"
    :characterKey="previewCharacterKey"
    :character="persistentCharacter"
  />

  <!-- 未登録のコンポーネントが選ばれている場合 -->
  <div v-if="!currentDefinition" class="alert alert-error" role="alert">
    未登録の表示タイプ: {{ bubble.component }}(このバージョンには含まれていません)
  </div>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="bubble.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- キャラクター -->
  <SettingItem
    v-if="hasCharacter"
    labelKey="uiSettings.commentBubble.persistentCharacter.label"
    descriptionKey="uiSettings.commentBubble.persistentCharacter.description"
  >
    <button
      type="button"
      class="btn btn-ghost btn-sm mt-2"
      :disabled="!bubble.persistentCharacter"
      @click="update('persistentCharacter', '')"
    >
      なし
    </button>
    <CharacterIconPicker
      :character-key="bubble.persistentCharacter"
      :is-icon-key="false"
      @select="(p) => update('persistentCharacter', p.characterKey)"
    />
  </SettingItem>

  <!-- キャラクターの大きさ -->
  <SettingItem
    v-if="hasCharacter"
    labelKey="uiSettings.commentBubble.characterSize.label"
    descriptionKey="uiSettings.commentBubble.characterSize.description"
    :showReset="true"
    @reset="resetField('characterSize')"
  >
    <input
      type="range"
      min="64"
      max="320"
      step="16"
      class="range range-primary w-full max-w-xs"
      :value="bubble.characterSize"
      @input="(e) => update('characterSize', Number((e.target as HTMLInputElement).value))"
    />
    <div class="mt-2 text-sm">現在値: {{ bubble.characterSize }}px</div>
  </SettingItem>

  <!-- フキダシアニメーション -->
  <SettingItem
    labelKey="uiSettings.common.bubbleMotion.label"
    descriptionKey="uiSettings.common.bubbleMotion.description"
    :showReset="true"
    @reset="resetField('bubbleMotion')"
  >
    <select
      :value="bubble.bubbleMotion"
      @change="(e) => update('bubbleMotion', (e.target as HTMLSelectElement).value as EnterMotionType)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="key in enterMotions" :key="key" :value="key">
        {{ t(`mapText.enterMotion.${key}.label`) }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { EnterMotionType } from '@/types/OmikujiData'
  import { CommentBubbleSchema, CommentBubbleType } from '@/types/ui'
  import { getCommentBubbleComponent, getCommentBubbleComponentSets } from '../CommentBubbleRegistry'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import { enterMotionMap } from '@/maps/OmikujiData'
  import { enterMotions } from '@/types/OmikujiData'

  import CommentBubblePreview from './CommentBubblePreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import CharacterIconPicker from '@/editor/parts/CharacterPicker/CharacterIconPicker.vue'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const { t } = useI18n()

  const bubble = computed(() => data.value.ui.settings.commentBubble ?? CommentBubbleSchema.parse({}))
  const fontFamily = computed(() => data.value.ui.fontFamily)
  const { characterMap } = useCharacterLookup()

  // プレビュー用: 選択中のキャラクター。未選択・不明なら先頭
  const previewCharacterKey = computed(() => {
    const keys = Object.keys(characterMap.value)
    return characterMap.value[bubble.value.persistentCharacter] ? bubble.value.persistentCharacter : (keys[0] ?? null)
  })
  const persistentCharacter = computed(() =>
    previewCharacterKey.value ? (characterMap.value[previewCharacterKey.value] ?? null) : null
  )

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const currentDefinition = computed(() => getCommentBubbleComponent(bubble.value.component))
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    if (!currentDefinition.value) options[bubble.value.component] = { label: `未登録: ${bubble.value.component}` }
    for (const set of Object.values(getCommentBubbleComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: definition.label }
    }
    return options
  })
  const hasCharacter = computed(() => currentDefinition.value?.hasCharacter === true)

  // 更新関数
  const update = <K extends keyof CommentBubbleType>(field: K, value: CommentBubbleType[K]) => {
    updateItemSettings('commentBubble', { [field]: value })
  }

  // リセット関数
  const resetField = (field: keyof CommentBubbleType) => {
    update(field, CommentBubbleSchema.parse({})[field])
  }
</script>
