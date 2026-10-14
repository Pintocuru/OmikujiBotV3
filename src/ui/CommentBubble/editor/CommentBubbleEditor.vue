<!-- src/ui/CommentBubble/editor/CommentBubbleEditor.vue -->
<template>
  <!-- プレビュー表示 -->
  <HudPreview>
    <CommentBubblePreview
      :key="bubble.bubbleMotion"
      :botName="previewCharacter?.displayName"
      :color="previewColor"
      :fontFamily="fontFamily"
      :bubbleMotion="bubble.bubbleMotion"
    />
  </HudPreview>

  <!-- キャラクター画像(大きさの確認用) -->
  <div class="flex justify-center py-2">
    <LayerImage v-if="previewLayers.length" :layers="previewLayers" :size="bubble.characterSize" />
    <span v-else class="text-sm opacity-60 italic">キャラクター画像が設定されていません</span>
  </div>

  <!-- キャラクター -->
  <SettingItem
    label="キャラクター"
    description="フキダシに表示するキャラクターを選択します"
    :showReset="true"
    @reset="resetField('character')"
  >
    <select
      :value="bubble.character"
      @change="(e) => update('character', (e.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option value="">先頭のキャラクター</option>
      <option v-for="c in characterList" :key="c.key" :value="c.key">
        {{ c.displayName || c.key }}
      </option>
    </select>
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
      min="16"
      max="80"
      step="4"
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

  <!-- フォントファミリー -->
  <SettingItem label="フォントファミリー" description="表示に使用するフォントを設定します">
    <select
      :value="fontFamily"
      @change="(e) => updateUi({ fontFamily: (e.target as HTMLSelectElement).value as FontFamilyType })"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(font, key) in fontFamilyMap" :key="key" :value="key">
        {{ font.label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import HudPreview from '@/editor/helpers/HudPreview/HudPreview.vue'
  import { CharacterColorScheme } from '@/types/OmikujiData'
  import type { EnterMotionType, FontFamilyType } from '@/types/OmikujiData'
  import { enterMotionMap, fontFamilyMap } from '@/maps/OmikujiData'
  import { CommentBubbleSchema } from '@/ui/types'
  import type { CommentBubbleType } from '@/ui/types'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import CommentBubblePreview from './CommentBubblePreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings, updateUi } = omikujiStore

  const bubble = computed(() => data.value.ui.settings.commentBubble ?? CommentBubbleSchema.parse({}))
  const fontFamily = computed(() => data.value.ui.fontFamily)
  const characterList = computed(() => Object.values(data.value.assets.characters))

  // プレビュー用: 選択中のキャラクター。未選択・不明なら先頭
  const previewCharacter = computed(
    () => characterList.value.find((c) => c.key === bubble.value.character) ?? characterList.value[0] ?? null
  )
  const previewColor = computed(() => previewCharacter.value?.color ?? CharacterColorScheme.parse({}))

  // プレビュー用の画像: default があればそれ、なければ最初に画像のある表情
  const previewLayers = computed(() => {
    const images = previewCharacter.value?.image ?? {}
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
