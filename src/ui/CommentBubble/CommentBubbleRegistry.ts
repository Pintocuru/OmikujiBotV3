// src/ui/CommentBubble/CommentBubbleRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { BubbleComponent, CommentBubbleType, ShownCharacter } from '@/types/ui'
import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'

const UI_NAME = 'commentBubble'

/** この UI 固有のメタ。 */
type Meta = {
  hasCharacter: boolean // キャラクター画像を表示するか(エディターのキャラクター設定の出し分けに使う)
}

/** 各コンポーネント(Standard.vue など)が Selector から受け取る props */
export type CommentBubbleComponentProps = {
  displayedComments: DisplayedBotMessage[]
  removeComment: (id: string) => void
  shown: ShownCharacter | null
  settings: CommentBubbleType
}

// 登録に必要な共通型
export type CommentBubbleComponent = UiComponentDefinition<Meta>
export type CommentBubbleComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerCommentBubbleComponents = (sets: CommentBubbleComponentSets) => registerUiComponents(UI_NAME, sets)
export const getCommentBubbleComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getCommentBubbleComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownBubbleComponent = (id: string): id is BubbleComponent => hasUiComponent(UI_NAME, id)
