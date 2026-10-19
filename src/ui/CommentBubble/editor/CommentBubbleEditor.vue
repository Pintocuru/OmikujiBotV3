<!-- src/ui/CommentBubble/editor/CommentBubbleEditor.vue -->
<template>
  <!-- プレビュー表示 -->
  <HudPreview :isHeight="false">
    <CommentBubblePreview
      :key="bubble.bubbleMotion"
      :botName="persistentCharacter?.displayName"
      :color="previewColor"
      :fontFamily="fontFamily"
      :bubbleMotion="bubble.bubbleMotion"
    />

    <!-- キャラクター画像(大きさの確認用) -->
    <div class="flex justify-center py-2">
      <LayerImage v-if="previewLayers.length" :layers="previewLayers" :size="bubble.characterSize" />
      <span v-else class="text-sm opacity-60 italic">キャラクター画像が設定されていません</span>
    </div>
  </HudPreview>

  <!-- キャラクター -->
  <SettingItem label="常時表示キャラクター" description="未設定の場合、コメントが来たときのみ表示されます">
    <CharacterPicker
      :modelValue="bubble.persistentCharacter"
      allowEmpty
      emptyLabel="なし"
      @update:modelValue="(key) => update('persistentCharacter', key)"
    />
  </SettingItem>

  <!-- キャラクターの大きさ -->
  <SettingItem
    label="キャラクターの大きさ"
    description="キャラクター画像の横幅を調整します"
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
    label="フキダシアニメーション"
    description="フキダシの表示アニメーションを設定します"
    :showReset="true"
    @reset="resetField('bubbleMotion')"
  >
    <select
      :value="bubble.bubbleMotion"
      @change="(e) => update('bubbleMotion', (e.target as HTMLSelectElement).value as EnterMotionType)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(value, key) in enterMotionMap" :key="key" :value="key">
        {{ value.label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import CharacterPicker from '@/editor/parts/CharacterPicker.vue'
  import { CharacterColorScheme } from '@/types/OmikujiData'
  import type { EnterMotionType } from '@/types/OmikujiData'
  import { enterMotionMap } from '@/maps/OmikujiData'
  import { CommentBubbleSchema } from '@/ui/types'
  import type { CommentBubbleType } from '@/ui/types'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import CommentBubblePreview from './CommentBubblePreview.vue'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore

  const bubble = computed(() => data.value.ui.settings.commentBubble ?? CommentBubbleSchema.parse({}))
  const fontFamily = computed(() => data.value.ui.fontFamily)
  const { characterMap } = useCharacterLookup()

  // プレビュー用: 選択中のキャラクター。未選択・不明なら先頭
  const persistentCharacter = computed(
    () => characterMap.value[bubble.value.persistentCharacter] ?? Object.values(characterMap.value)[0] ?? null
  )
  const previewColor = computed(() => persistentCharacter.value?.color ?? CharacterColorScheme.parse({}))

  // プレビュー用の画像: default があればそれ、なければ最初に画像のある表情
  const previewLayers = computed(() => {
    const images = persistentCharacter.value?.image ?? {}
    const hasSrc = (src?: string[]) => (src ?? []).some((p) => p && p.trim() !== '')
    const entry = hasSrc(images['default']?.src) ? images['default'] : Object.values(images).find((i) => hasSrc(i.src))
    return entry?.src ?? []
  })

  const update = <K extends keyof CommentBubbleType>(field: K, value: CommentBubbleType[K]) => {
    updateItemSettings('commentBubble', { [field]: value })
  }

  const resetField = (field: keyof CommentBubbleType) => {
    update(field, CommentBubbleSchema.parse({})[field])
  }
</script>
