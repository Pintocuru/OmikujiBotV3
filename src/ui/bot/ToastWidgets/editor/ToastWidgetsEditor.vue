<!-- src/ui/bot/ToastWidgets/editor/ToastWidgetsEditor.vue -->
<template>
  <!-- サンプル表示 -->
  <HudPreview>
    <MotionWrapper
      v-for="message in previewMessages"
      :key="message.id"
      v-model:visible="message.display.visible"
      :motion="toastSettings.bubbleMotion"
      :leave-motion="toastSettings.bubbleMotion"
      :auto-hide="false"
      @after-leave="removePreviewMessage(message.id)"
    >
      <ToastBubbleSelector
        :settings="toastSettings"
        :fontFamily="data.ui.fontFamily"
        editorPreview
        :message="message.bubble.message"
        :color="getCharacterColor(message.bubble.characterKey)"
        :iconLayers="
          toastSettings.showToastsCharacter
            ? toastIconLayers(getCharacter(message.bubble.characterKey), message.bubble.iconKey)
            : []
        "
      />
    </MotionWrapper>

    <!-- 右下: 追加のフキダシ(キャラはランダム) -->
    <template #hud>
      <div class="flex gap-1">
        <button v-if="extraMessages.length" type="button" class="btn btn-ghost btn-xs" @click="clearExtra">
          {{ t('uiSettings.toastWidgets.preview.clear') }}
        </button>
        <button type="button" class="btn btn-primary btn-xs" @click="addExtra">
          {{ t('uiSettings.toastWidgets.preview.add') }}
        </button>
      </div>
    </template>
  </HudPreview>
  
  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="toastSettings.component"
    :options="componentOptions"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- 登場・退場アニメーション -->
  <SettingItem
    labelKey="uiSettings.common.bubbleMotion.label"
    descriptionKey="uiSettings.common.bubbleMotion.description"
    :showReset="true"
    @reset="resetField('bubbleMotion')"
  >
    <select
      :value="toastSettings.bubbleMotion"
      @change="(e) => updateField('bubbleMotion', (e.target as HTMLSelectElement).value as EnterMotionType)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="key in enterMotions" :key="key" :value="key">
        {{ t(`mapText.enterMotion.${key}.label`) }}
      </option>
    </select>
  </SettingItem>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    <!-- キャラクターアイコンを表示するか -->
    <SettingItem
      labelKey="uiSettings.toastWidgets.showCharacter.label"
      descriptionKey="uiSettings.toastWidgets.showCharacter.description"
    >
      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          v-model="toastSettings.showToastsCharacter"
          @change="(e) => updateField('showToastsCharacter', (e.target as HTMLInputElement).checked)"
        />
        <span class="ml-2">{{ t('uiSettings.toastWidgets.showCharacterToggle') }}</span>
      </label>
    </SettingItem>

    <!-- トースト位置 -->
    <SettingItem
      labelKey="uiSettings.toastWidgets.position.label"
      descriptionKey="uiSettings.toastWidgets.position.description"
    >
      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          v-model="toastSettings.showToastsOnRight"
          @change="(e) => updateField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
        />
        <span class="ml-2">
          {{
            t(
              toastSettings.showToastsOnRight ? 'uiSettings.toastWidgets.sideRight' : 'uiSettings.toastWidgets.sideLeft'
            )
          }}
        </span>
      </label>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ToastWidgetsSchema } from '@/types/ui'
  import { enterMotions, EnterMotionType } from '@/types/OmikujiData'
  import { getToastWidgetsComponent, getToastWidgetsComponentSets } from '../ToastWidgetsRegistry'
  import { BotMessageBubbleSchema } from '@/types/generator'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ToastBubbleSelector from '@/ui/bot/ToastWidgets/ToastBubbleSelector.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { withDisplay } from '@/ui/common/useBotDisplay'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import { getRandomToastCharacterKey, toastIconLayers } from '../toastCharacter'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  // 編集中のデータ(omikujiStore)のキャラクターを参照する(配信側の appStore ではない)
  const { characterArray, getCharacter, getCharacterColor, getCharacterName } = useCharacterLookup()

  const toastSettings = computed(() => ToastWidgetsSchema.parse(data.value.ui.settings.toastWidgets ?? {}))

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = toastSettings.value.component
    if (!getToastWidgetsComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getToastWidgetsComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
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
    bubbleMotion: () => resetField('bubbleMotion'),
  }

  // --- プレビュー用メッセージ ---
  const buildPreviewMessage = (id: string, message: string, characterKey: string): DisplayedBotMessage =>
    withDisplay(
      BotMessageBubbleSchema.parse({
        id,
        uiKey: 'toastWidgets',
        bubble: { name: 'テストユーザー', message, characterKey },
      })
    )

  // 基本の2つ: 登録順の先頭2人(1人ならその人)。キャラ未登録ならキャラなし
  const baseMessages = computed(() =>
    ['テストコメントです', 'テストユーザーの運勢は【大吉】長文のテストコメントです。'].map((text, i) => {
      const character = characterArray.value[i] ?? characterArray.value[0]
      return buildPreviewMessage(`preview-base-${i}`, text, character?.key ?? '')
    })
  )

  // 追加のフキダシ: ボタンを押すたびに、画像を持つ登録キャラからランダムで1人
  const extraMessages = ref<DisplayedBotMessage[]>([])
  let extraSeq = 0
  const addExtra = () => {
    const key = getRandomToastCharacterKey(characterArray.value)
    extraSeq += 1
    extraMessages.value.push(buildPreviewMessage(`preview-extra-${extraSeq}`, `追加のテストコメント ${extraSeq}`, key))
  }
  const removePreviewMessage = (id: string) => {
    extraMessages.value = extraMessages.value.filter((message) => message.id !== id)
  }
  const clearExtra = () => {
    extraMessages.value.forEach((message) => {
      message.display.visible = false
    })
  }

  const previewMessages = computed(() => [...baseMessages.value, ...extraMessages.value])
</script>
