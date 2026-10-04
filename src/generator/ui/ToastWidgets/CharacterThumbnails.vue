<!-- src/generator/ui/ToastWidgets/CharacterThumbnails.vue -->
<template>
  <div
    class="flex gap-4 mt-2"
    :class="toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start'"
  >
    <!-- すべてのキャラクターリスト（テスト送信用） -->
    <CharacterThumbnailsPreview
      :charactersArray="clickableCharacters"
      :clickable="true"
      @character-click="handleCharacterClick"
    />

    <!-- 実際にトースト表示設定されているキャラクターのプレビュー -->
    <CharacterThumbnailsPreview :charactersArray="filteredCharacters" :hoverVisibility="false" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { characterEmotions, CharacterType } from '@/types/OmikujiData'
  import { BotMessageBubbleSchema, BotMessageBubbleType } from '@/generator/types'

  import CharacterThumbnailsPreview from './parts/CharacterThumbnailsPreview.vue'
  import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'
  import { ToastWidgetsSchema } from '@/types/OmikujiData/UiSettings/ToastWidgetsSchema.js'
  import { useAppStore } from '@/generator/stores/useAppStore'

  const appStore = useAppStore()

  const { characterArray, resolveCharacter, resolveEmotion } = useCharacterManager()

  const toastSettings = computed(() => appStore.data.ui.settings.toast ?? ToastWidgetsSchema.parse({}))

  const currentExpressions = ref<string[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  onMounted(() => {
    currentExpressions.value = characterArray.value.map(() => 'default')

    if (characterArray.value.length > 0) {
      startExpressionCycle()
    }
  })

  onUnmounted(() => {
    if (expressionTimer.value) {
      clearTimeout(expressionTimer.value)
    }
  })

  /**
   * サムネイルの表情を定期的にランダム変更する
   */
  const startExpressionCycle = () => {
    const updateExpressions = () => {
      if (characterArray.value.length === 0) return

      characterArray.value.forEach((character, index) => {
        const shouldChange = Math.random() < 0.05

        if (shouldChange) {
          const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]

          currentExpressions.value[index] = resolveEmotion(character.key, randomEmotion)
        } else {
          currentExpressions.value[index] = 'default'
        }
      })

      expressionTimer.value = setTimeout(updateExpressions, 10000)
    }

    updateExpressions()
  }

  /**
   * テスト送信用のキャラクター
   *
   * 実在するキャラクターをベースにすることで、
   * CharacterType の必須プロパティを個別に組み立てない。
   */
  const testCharacter = computed<CharacterType | null>(() => {
    const baseCharacter = characterArray.value[0]

    if (!baseCharacter) return null

    return {
      ...baseCharacter,
      key: '__test__',
      name: 'テスト',
    }
  })

  /**
   * キャラクタークリック時のテストメッセージ送信
   */
  const clickableCharacters = computed(() => {
    if (!testCharacter.value) {
      return characterArray.value
    }

    return [testCharacter.value, ...characterArray.value]
  })

  const handleCharacterClick = (character: CharacterType, isRightClick: boolean) => {
    try {
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]

      const resolvedData = resolveCharacter({
        characterKey: character.key,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
      })

      const postAction: BotMessageBubbleType = BotMessageBubbleSchema.parse({
        bubble: {
          name: character.name,
          message: `${character.name}の${isRightClick ? 'トースト' : 'テスト'}メッセージです！`,
          isToast: isRightClick,
          characterKey: resolvedData.characterKey,
          iconKey: resolvedData.iconKey,
        },
      })

      appStore.addBotMessage(postAction)
    } catch (error) {
      console.error('テストメッセージの生成に失敗しました:', error)
    }
  }

  /**
   * showThumbnail に含まれるキーを持つキャラクターのみをフィルタリング
   */
  const filteredCharacters = computed(() => {
    const selectedKeys = new Set(toastSettings.value.showThumbnail)

    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })
</script>
