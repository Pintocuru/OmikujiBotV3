// src/ui/FlashBanner/FlashBannerRegistry.ts
import {
  getUiComponent,
  getUiComponentSets,
  hasUiComponent,
  registerUiComponents,
  type UiComponentDefinition,
  type UiComponentSets,
} from '@/ui/common/uiComponentRegistry'
import type { CharacterAnimationType, CharacterColorType } from '@/types/OmikujiData'
import type { FlashBannerComponent, FlashBannerType } from '@/types/ui'

const UI_NAME = 'flashBanner'

/** この UI 固有のメタ。 */
type Meta = {
  isScrollReturn: boolean // 長文スクロール終了後の戻り方(scrollReturnMode)を使うか(エディターの出し分けに使う)
}

/** 各コンポーネント(Standard.vue など)が Selector から受け取る props */
export type FlashBannerComponentProps = {
  settings: FlashBannerType
  message: string
  characterLayers: string[]
  characterAnimation?: CharacterAnimationType
  color: CharacterColorType // 表示中のキャラの色(キャラがいないときは設定の color)
  labelClass?: string // ラベルの点滅用クラス(メッセージ切り替え時に付く)
}

// 登録に必要な共通型
export type FlashBannerComponentDefinition = UiComponentDefinition<Meta>
export type FlashBannerComponentSets = UiComponentSets<Meta>

// 共通 UI コンポーネント登録
export const registerFlashBannerComponents = (sets: FlashBannerComponentSets) => registerUiComponents(UI_NAME, sets)
export const getFlashBannerComponentSets = () => getUiComponentSets<Meta>(UI_NAME)
export const getFlashBannerComponent = (id: string) => getUiComponent<Meta>(UI_NAME, id)

/** 登録済みの ID かどうか */
export const isKnownFlashBannerComponent = (id: string): id is FlashBannerComponent => hasUiComponent(UI_NAME, id)
