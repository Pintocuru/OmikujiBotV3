// src/editor/helpers/useTestPost.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { OmikenCommentSchema } from '@/types/OmikenComment'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { EventType, OmikujiItemType, ScenarioStepType, sortedStepsFromRecord } from '@/types/OmikujiData'
import { defaultPlaceholdersShortLabels } from '@/maps/engine/placeholder/DefaultPlaceholderMap'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { BotMessageType } from '@/types/generator'
import { OmikujiResultProcessor } from '@/engine/OmikujiResult/OmikujiResultProcessor'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import i18n from '@/editor/i18n'

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))

const MOCK_COMMENT = OmikenCommentSchema.parse({
  userId: 'testUserId',
  userName: 'テストユーザー',
  comment: 'テストコメント',
})

export function useTestPost() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getEvent } = useGetEventData()
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)

  const scriptManager = new GameScriptManager()
  const placeholderVariable = new PlaceholderVariable()

  // 選択されているおみくじを取得
  const selectedRule = computed((): EventType | null => {
    const key = selectedItemKey.value
    if (!key) return null

    const category = selectedCategory.value
    if (!navigationStore.isEventCategory(category)) return null

    return getEvent(category, key) ?? null
  })

  // 重みは lottery を持つ種別のみ。log は 1 扱い
  const getWeight = (item: OmikujiItemType) => ('lottery' in item ? item.lottery.weight : 1)

  // 抽選結果の詳細トーストを表示
  const showOmikujiResultToast = (omikujiItem: OmikujiItemType) => {
    swalToast.success({
      title: t('editorPreview.testPost.resultTitle'),
      html: t('editorPreview.testPost.resultDetails', {
        name: omikujiItem.name || t('editorPreview.testPost.unnamedItem'),
        weight: getWeight(omikujiItem) || 1,
      }),
      timer: 15000,
    })
  }

  const postTestOmikujiItem = async (steps: ScenarioStepType[], omikujiItem?: OmikujiItemType) => {
    const resultProcessor = new OmikujiResultProcessor(data.value, scriptManager.playScript, placeholderVariable)
    const botMessages = (
      await Promise.all(
        steps.map((step) => resultProcessor.process(step, defaultPlaceholdersShortLabels, MOCK_COMMENT))
      )
    ).flat()

    if (omikujiItem) showOmikujiResultToast(omikujiItem)
    executeTestPostDelays(botMessages)
  }

  const postTestOmikuji = (mikuji: OmikujiItemType[]) => {
    if (!selectedRule.value) {
      swalToast.error({
        title: t('editorPreview.testPost.noSelectedEventTitle'),
        text: t('editorPreview.testPost.noSelectedEvent'),
      })
      return
    }

    const omikujiItem = drawOmikuji(mikuji)

    if (!omikujiItem) {
      swalToast.info({
        title: t('editorPreview.testPost.resultTitle'),
        text: t('editorPreview.testPost.noMatchingItem'),
      })
      return
    }

    // steps以外なら、結果だけ通知する
    if (omikujiItem.kind !== 'steps') {
      showOmikujiResultToast(omikujiItem)
      return
    }

    const scenario = data.value.assets.scenarios[omikujiItem.stepKey]
    if (!scenario) {
      swalToast.error({
        title: t('editorPreview.testPost.missingScenarioTitle'),
        text: omikujiItem.stepKey
          ? t('editorPreview.testPost.missingScenario', { key: omikujiItem.stepKey })
          : t('editorPreview.testPost.missingScenarioKey'),
      })
      return
    }

    postTestOmikujiItem(sortedStepsFromRecord(scenario.steps), omikujiItem)
  }

  return {
    postTestOmikuji,
    postTestOmikujiItem,
  }
}

// テスト投稿の遅延処理を並列実行
const executeTestPostDelays = async (posts: BotMessageType[]): Promise<void> => {
  try {
    await Promise.all(
      posts.map((post) => new Promise<void>((resolve) => setTimeout(resolve, post.delaySeconds * 1000)))
    )
  } catch (error) {
    console.error(t('editorPreview.testPost.postError'), error)
    swalModal.error({
      title: t('editorPreview.testPost.postErrorTitle'),
      text: String(error),
    })
  }
}
