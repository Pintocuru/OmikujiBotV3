// src/editor/helpers/useTestPost.ts
import { storeToRefs } from 'pinia'
import { OmikenCommentSchema } from '@/types/OmikenComment'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { OmikujiItemType, ScenarioStepType, sortedStepsFromRecord } from '@/types/OmikujiData'
import { getDefaultPlaceholdersShortLabels } from '@/maps/engine/placeholder/DefaultPlaceholderMap'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { BotMessageType } from '@/types/generator'
import { OmikujiResultProcessor } from '@/engine/OmikujiResult/OmikujiResultProcessor'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { checkAllTriggers } from '@/generator/scripts/trigger/TriggerChecker'
import i18n from '@/editor/i18n'

const t = (key: string, named?: Record<string, unknown>) => (named ? i18n.global.t(key, named) : i18n.global.t(key))
const getShortLabels = () => getDefaultPlaceholdersShortLabels((key) => t(key))

const MOCK_COMMENT = OmikenCommentSchema.parse({
  userId: 'testUserId',
  userName: 'テストユーザー',
  comment: 'テストコメント',
  meta: {
    no: 2,
    tc: 2,
    lc: 2,
    isAgain: false,
    isExternal: true,
  },
})

export function useTestPost() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getAsset } = useGetAssetData()

  const scriptManager = new GameScriptManager()
  const placeholderVariable = new PlaceholderVariable()

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

  // 本番と同じく steps は delaySeconds の時刻どおりに実行する(評価ブロックもその時刻に評価される)
  // エディターは BotMessage を表示しないので、遅延分の結果は受け取らない
  const postTestOmikujiItem = async (steps: ScenarioStepType[], omikujiItem?: OmikujiItemType) => {
    const resultProcessor = new OmikujiResultProcessor(data.value, scriptManager.playScript, placeholderVariable)
    const { messages } = await resultProcessor.processTimeline(
      steps,
      getShortLabels(),
      MOCK_COMMENT,
      () => undefined
    )

    if (omikujiItem) showOmikujiResultToast(omikujiItem)
    executeTestPostDelays(messages)
  }

  /**
   * おみくじ箱から抽選して実行する(本番の CommentProcessor と同じ流れ)
   * criteria で絞り込み(テスト用コメントで判定) → 抽選 → control / steps
   * クールダウンは適用しない(続けてテストできるように)
   */
  const postTestMikuji = async (mikujiKey: string) => {
    const mikujiBox = getAsset('mikuji', mikujiKey)
    if (!mikujiBox) return

    const candidates = mikujiBox.omikuji.filter((item) => {
      const criteria = item.lottery.criteria
      return !criteria || checkAllTriggers(MOCK_COMMENT, criteria)
    })
    const omikujiItem = drawOmikuji(candidates)

    if (!omikujiItem) {
      swalToast.info({
        title: t('editorPreview.testPost.resultTitle'),
        text: t('editorPreview.testPost.noMatchingItem'),
      })
      return
    }

    // control: variable の評価だけ行い、投稿はしない(本番と同じ)
    if (omikujiItem.kind === 'control') {
      if (omikujiItem.variable.trim()) {
        new OmikujiResultProcessor(data.value, scriptManager.playScript, placeholderVariable).evaluateVariable(
          omikujiItem.variable,
          getShortLabels()
        )
      }
      showOmikujiResultToast(omikujiItem)
      return
    }

    const scenario = data.value.assets.scenarios[omikujiItem.scenarioKey]
    if (!scenario) {
      swalToast.error({
        title: t('editorPreview.testPost.missingScenarioTitle'),
        text: omikujiItem.scenarioKey
          ? t('editorPreview.testPost.missingScenario', { key: omikujiItem.scenarioKey })
          : t('editorPreview.testPost.missingScenarioKey'),
      })
      return
    }

    await postTestOmikujiItem(sortedStepsFromRecord(scenario.steps), omikujiItem)
  }

  return {
    postTestMikuji,
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
