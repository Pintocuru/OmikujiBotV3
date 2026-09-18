// src/editor/helpers/useTestPost.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { OmikenCommentSchema } from '@/types/OmikenComment'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { GameScriptManager } from '@/generator/stores/GameScript/GameScriptManager'
import { PlaceholderVariable } from '@/generator/stores/PlaceholderVariable/PlaceholderVariable'
import { ActionSetSchema, ActionSetType, EventType, OmikujiItemType, PostFlowType } from '@/types/OmikujiData'
import { defaultPlaceholdersShortLabels } from '../maps/assets/DefaultPlaceholderMaps'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { addWeightPercentages, drawOmikuji } from '@/common/omikuji/DrawOmikuji'
import { BotMessageType } from '@/generator/types/MainGenerator'
import { OmikujiResultProcessor } from '@/engine/scripts/OmikujiResult/OmikujiResultProcessor'
import { useGetEventData } from '@/editor/stores/useGetEventData'

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

  const scriptManager = GameScriptManager.getInstance()
  const placeholderVariable = new PlaceholderVariable()

  // 選択されているおみくじを取得
  const selectedRule = computed((): EventType | null => {
    const key = selectedItemKey.value
    if (!key) return null

    const category = selectedCategory.value
    if (!navigationStore.isEventCategory(category)) return null

    return getEvent(category, key) ?? null
  })

  // 抽選結果の詳細トーストを表示
  const showOmikujiResultToast = (omikujiItem: OmikujiItemType) => {
    swalToast.success({
      title: 'おみくじ抽選結果',
      html: `おみくじ: ${omikujiItem.name || '無名のアイテム'}<br>重み: ${omikujiItem.lottery.weight || 1}`,
      timer: 15000,
    })
  }

  const postTestOmikujiItem = async (postFlows: PostFlowType[], omikujiItem?: OmikujiItemType) => {
    const resultProcessor = new OmikujiResultProcessor(data.value, scriptManager.playScript, placeholderVariable)

    const actionItem: ActionSetType = ActionSetSchema.parse({ postFlows })

    const botMessages = await resultProcessor.process(actionItem, defaultPlaceholdersShortLabels, MOCK_COMMENT)

    if (omikujiItem) showOmikujiResultToast(omikujiItem)
    executeTestPostDelays(botMessages)
  }

  const postTestOmikuji = (omikujiSet: OmikujiItemType[]) => {
    if (!selectedRule.value) {
      swalToast.error({
        title: 'イベントが選択されていません',
        text: 'テスト投稿の対象となるイベントを選択してください。',
      })
      return
    }

    const priorityItems = omikujiSet.filter((item) => !item.lottery.isPriority)
    const targetSet = priorityItems.length > 0 ? priorityItems : omikujiSet
    const omikujiItem = drawOmikuji(addWeightPercentages(targetSet))

    if (!omikujiItem) {
      swalToast.info({
        title: 'おみくじ抽選結果',
        text: '該当するおみくじがありませんでした。',
      })
      return
    }

    if (omikujiItem.kind !== 'postFlow') {
      // return/continue/reset/log は投稿するBOTアクションを持たないため、結果だけ通知する
      showOmikujiResultToast(omikujiItem)
      return
    }

    postTestOmikujiItem(omikujiItem.postFlows, omikujiItem)
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
    console.error('メッセージ投稿処理中にエラーが発生しました:', error)
    swalModal.error({
      title: 'テスト投稿の表示中にエラーが発生しました',
      text: String(error),
    })
  }
}
