// src/editor/content/composables/useOmikujiConnections.ts
import { eventCategory, hasScenarioStepMessage, type EventCategoryType, type ScenarioType } from '@/types/OmikujiData/'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'

/** 接続表示に使う最小限の参照形 */
export type EventRef = { category: EventCategoryType; id: string; name: string }
export type AssetRef = { key: string; name: string }

/** シナリオのステップ本文(message / variable)。プレースホルダー `<<キー>>` を埋め込める場所 */
const scenarioTexts = (scenario: ScenarioType): string[] =>
  scenario.steps.filter(hasScenarioStepMessage).map((step) => step.message)

/**
 * イベント ↔ みくじ箱 ↔ シナリオ ↔ プレースホルダー の参照関係を計算する。
 * すべて OmikujiStore から読むため、編集結果は即座に反映される。
 */
export function useOmikujiConnections() {
  const { getEvents } = useGetEventData()
  const { getAssets, getAsset } = useGetAssetData()

  /** みくじ箱に接続されているイベント一覧(全イベント種別から逆引き) */
  const connectedEvents = (mikujiKey: string): EventRef[] =>
    eventCategory.flatMap((category) =>
      [...getEvents(category)]
        .filter((event) => event.omikujiKey === mikujiKey)
        .map((event) => ({ category, id: event.id, name: event.name || event.id }))
    )

  /** みくじ箱が参照しているシナリオ一覧(kind === 'steps' の stepKey) */
  const connectedScenarios = (mikujiKey: string): AssetRef[] => {
    const box = getAsset('mikuji', mikujiKey)
    const keys = new Set<string>()
    for (const item of box?.omikuji ?? []) {
      if (item.kind === 'steps' && item.stepKey) keys.add(item.stepKey)
    }
    return [...keys].map((key) => ({ key, name: getAsset('scenarios', key)?.name || key }))
  }

  /** シナリオの参照元(みくじ箱 / 他のシナリオ)。複数から参照される場合もある */
  const scenarioSources = (scenarioKey: string): { mikuji: AssetRef[]; scenarios: AssetRef[] } => {
    const mikuji: AssetRef[] = []
    for (const [key, box] of Object.entries(getAssets('mikuji'))) {
      if (box.omikuji?.some((item) => item.kind === 'steps' && item.stepKey === scenarioKey)) {
        mikuji.push({ key, name: box.name || key })
      }
    }

    const scenarios: AssetRef[] = []
    for (const [key, scenario] of Object.entries(getAssets('scenarios'))) {
      if (key === scenarioKey) continue
      const isCalled = scenario.steps?.some(
        (step) =>
          step.kind === 'scenarioCall' &&
          step.callKeys.some((value) =>
            typeof value === 'string' ? value === scenarioKey : value.content === scenarioKey
          )
      )
      if (isCalled) scenarios.push({ key, name: scenario.name || key })
    }

    return { mikuji, scenarios }
  }

  /**
   * シナリオが使っているプレースホルダー一覧。
   * ステップ本文に `<<キー>>` があり、かつ placeholders に存在するキーだけを返す
   * (`<<userId>>` などの組み込みプレースホルダーは対象外)
   */
  const scenarioPlaceholders = (scenarioKey: string): AssetRef[] => {
    const scenario = getAsset('scenarios', scenarioKey)
    if (!scenario) return []
    const texts = scenarioTexts(scenario)
    return Object.values(getAssets('placeholders'))
      .filter((placeholder) => texts.some((text) => text.includes(`<<${placeholder.key}>>`)))
      .map((placeholder) => ({ key: placeholder.key, name: placeholder.name || placeholder.key }))
  }

  /** プレースホルダーを使っているシナリオ一覧(scenarioPlaceholders の逆引き) */
  const placeholderUsers = (placeholderKey: string): AssetRef[] => {
    const token = `<<${placeholderKey}>>`
    return Object.values(getAssets('scenarios'))
      .filter((scenario) => scenarioTexts(scenario).some((text) => text.includes(token)))
      .map((scenario) => ({ key: scenario.key, name: scenario.name || scenario.key }))
  }

  return { connectedEvents, connectedScenarios, scenarioSources, scenarioPlaceholders, placeholderUsers }
}
