<!-- src/ui/ToastWidgets/editor/ToastWidgetsEditor.vue -->
<template>
  <!-- サンプル表示 -->
  <HudPreview>
    <div class="flex flex-col" :class="[fontFamily]">
      <!-- トーストサンプル -->
      <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
        <ToastBubbleSelector
          v-for="(message, i) in previewMessages"
          :key="i"
          :settings="toastSettings"
          :message="message.bubble?.message ?? '(未記入)'"
          :color="getCharacterColor(message.bubble.characterKey)"
          :iconLayers="
            toastSettings.showToastsCharacter
              ? iconSrc(message.bubble?.characterKey ?? null, message.bubble?.iconKey ?? 'default')
              : []
          "
        />
      </div>

      <!-- サムネイルサンプル表示 -->
      <div
        class="flex flex-row gap-4 mt-2"
        :class="toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start'"
      >
        <div>(OBSの対話モードでマウスを近づけると、キャラクターが表示され投稿テストができます)</div>
        <CharacterThumbnailsPreview :charactersArray="characterArray" :hoverVisibility="true" />
        <CharacterThumbnailsPreview :charactersArray="thumbnailCharacters" :hoverVisibility="false" />
      </div>
    </div>
  </HudPreview>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="toastSettings.component"
    :options="toastComponentMap"
    @update:modelValue="(val) => updateField('component', val as ToastComponent)"
  />

  <!-- 設定項目 -->
  <SettingItem
    label="トースト位置"
    description="通知メッセージを右側に表示するかどうか"
    :showReset="true"
    @reset="resetMap.showToastsOnRight"
  >
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="toastSettings.showToastsOnRight"
        @change="(e) => updateField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2"> {{ toastSettings.showToastsOnRight ? '右' : '左' }}側に表示する </span>
    </label>
  </SettingItem>

  <SettingItem
    label="キャラクター表示"
    description="トーストにキャラクターアイコンを表示するか"
    :showReset="true"
    @reset="resetMap.showToastsCharacter"
  >
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="toastSettings.showToastsCharacter"
        @change="(e) => updateField('showToastsCharacter', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2">キャラクターを表示する</span>
    </label>
  </SettingItem>

  <SettingItem
    label="サムネイル表示キャラクター"
    description="右下にサムネイルとして表示するキャラクターを選択します"
    :showReset="true"
    @reset="resetMap.showThumbnail"
  >
    <CharacterSelectorMulti
      :characters="data.assets.characters"
      :selectedKeys="toastSettings.showThumbnail"
      @update:selectedKeys="(keys) => updateField('showThumbnail', keys)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ToastWidgetsSchema, type ToastComponent } from '@/types/ui'
  import { toastComponentMap } from '@/maps/ui'
  import { BotMessageBubbleSchema } from '@/types/generator'
  import { useFontFamily } from '@/types/OmikujiData'
  import CharacterSelectorMulti from './CharacterSelectorMulti.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ToastBubbleSelector from '@/ui/ToastWidgets/ToastBubbleSelector.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import CharacterThumbnailsPreview from '@/ui/ToastWidgets/parts/CharacterThumbnailsPreview.vue'
  import { useCharacters } from '@/generator/composables/useCharacters'
  import HudPreview from '@/editor/parts/HudPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { iconSrc, getCharacterColor } = useCharacters()
  const fontFamily = computed(() => useFontFamily(data.value.ui.fontFamily ?? 'default'))

  const toastSettings = computed(() => ToastWidgetsSchema.parse(data.value.ui.settings.toastWidgets ?? {}))
  const characterArray = computed(() => Object.values(data.value.assets.characters))

  // showThumbnail に含まれるキーを持つキャラクターのみをフィルタリング
  const thumbnailCharacters = computed(() => {
    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })

  // toast設定の更新関数（v2.1）
  const updateField = <K extends keyof typeof toastSettings.value>(
    field: K,
    value: (typeof toastSettings.value)[K]
  ) => {
    omikujiStore.updateItemSettings('toastWidgets', {
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof toastSettings.value) => {
    const defaults = ToastWidgetsSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    showToastsOnRight: () => resetField('showToastsOnRight'),
    showToastsCharacter: () => resetField('showToastsCharacter'),
    showThumbnail: () => resetField('showThumbnail'),
  }

  // プレビュー用メッセージ
  const previewMessages = computed(() => {
    return Array(2)
      .fill(null)
      .map((_, i) => {
        const charIndex = i < characterArray.value.length ? i : 0
        const character = characterArray.value[charIndex]
        const messageText = i === 0 ? 'テストコメントです' : 'テストユーザーの運勢は【大吉】長文のテストコメントです。'
        const characterKey = character.key

        return BotMessageBubbleSchema.parse({
          uiKey: 'toastWidgets',
          bubble: {
            name: 'テストユーザー',
            message: messageText,
            isToast: true,
            characterKey,
          },
        })
      })
  })
</script>
