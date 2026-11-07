// src/editor/helpers/referenceGraph/useReferenceGraph.ts
import { effectScope, ref, shallowRef, watch } from 'vue'
import { getActivePinia, storeToRefs, type Pinia } from 'pinia'
import { eventCategory, hasScenarioStepMessage, type OmikujiDataType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import type { LinkItem } from './types'
import { addEdge, cyclicNodes, findCycle, reachable, type Edges } from './graphUtils'

/** プレースホルダーの埋め込み `<<キー>>`(キーは英数字と _ のみ。`<<userId>>` などの組み込みは後で除外される) */
const PLACEHOLDER_TOKEN = /<<([a-zA-Z0-9_]+)>>/g

const contentOf = (value: string | { content: string }): string => (typeof value === 'string' ? value : value.content)

export const tokensOf = (text: string): string[] => Array.from(text.matchAll(PLACEHOLDER_TOKEN), (m) => m[1])

/** イベント / みくじ箱 / シナリオ / プレースホルダー / キャラクターの参照関係を、データ全体から 1 回で作る */
const buildReferenceGraph = (data: OmikujiDataType) => {
  const { scenarios, placeholders, mikuji, characters } = data.assets

  const scenarioCalls: Edges = new Map() // シナリオ → 呼び出すシナリオ
  const scenarioCallers: Edges = new Map() // 逆向き
  const characterScenarios: Edges = new Map() // キャラクター → 使うシナリオ
  const scenarioPlaceholders: Edges = new Map() // シナリオ → 使うプレースホルダー
  const placeholderScenarios: Edges = new Map() // 逆向き
  const placeholderChildren: Edges = new Map() // プレースホルダー → 中で使うプレースホルダー
  const placeholderParents: Edges = new Map() // 逆向き
  const boxScenarios: Edges = new Map() // みくじ箱 → 実行するシナリオ
  const scenarioBoxes: Edges = new Map() // 逆向き
  const scenarioItemCounts = new Map<string, number>() // シナリオ → それを実行するおみくじ数

  const placeholderKeys = new Set(Object.keys(placeholders))

  for (const [scenarioKey, scenario] of Object.entries(scenarios)) {
    for (const step of Object.values(scenario.steps)) {
      if (step.kind === 'scenarioCall') {
        for (const call of step.callKeys) {
          const calledKey = contentOf(call)
          if (!calledKey) continue
          addEdge(scenarioCalls, scenarioKey, calledKey)
          addEdge(scenarioCallers, calledKey, scenarioKey)
        }
      }
      if ((step.kind === 'message' || step.kind === 'gameScript') && step.characterKey) {
        addEdge(characterScenarios, step.characterKey, scenarioKey)
      }
      if (hasScenarioStepMessage(step)) {
        for (const token of tokensOf(step.message)) {
          if (!placeholderKeys.has(token)) continue
          addEdge(scenarioPlaceholders, scenarioKey, token)
          addEdge(placeholderScenarios, token, scenarioKey)
        }
      }
    }
  }

  for (const [placeholderKey, placeholder] of Object.entries(placeholders)) {
    for (const value of placeholder.values) {
      for (const token of tokensOf(contentOf(value))) {
        if (!placeholderKeys.has(token)) continue
        addEdge(placeholderChildren, placeholderKey, token)
        addEdge(placeholderParents, token, placeholderKey)
      }
    }
  }

  for (const [boxKey, box] of Object.entries(mikuji)) {
    for (const omikujiItem of box.omikuji) {
      if (omikujiItem.kind !== 'scenario' || !omikujiItem.scenarioKey) continue
      addEdge(boxScenarios, boxKey, omikujiItem.scenarioKey)
      addEdge(scenarioBoxes, omikujiItem.scenarioKey, boxKey)
      scenarioItemCounts.set(omikujiItem.scenarioKey, (scenarioItemCounts.get(omikujiItem.scenarioKey) ?? 0) + 1)
    }
  }

  // みくじ箱 → それを使うイベント
  const boxEvents = new Map<string, LinkItem[]>()
  for (const category of eventCategory) {
    for (const event of data.events[category]) {
      if (!event.mikujiKey) continue
      const list = boxEvents.get(event.mikujiKey) ?? []
      list.push({ category, key: event.id, name: event.name || event.id })
      boxEvents.set(event.mikujiKey, list)
    }
  }

  return {
    scenarioCalls,
    scenarioCallers,
    characterScenarios,
    scenarioPlaceholders,
    placeholderScenarios,
    placeholderChildren,
    placeholderParents,
    boxScenarios,
    scenarioBoxes,
    scenarioItemCounts,
    boxEvents,
    // 存在するシナリオのキー。みくじ箱の scenarioKey / scenarioCall の callKeys はシナリオ削除後も残るため、存在確認に使う
    scenarioKeys: new Set(Object.keys(scenarios)),
    mikujiKeys: new Set(Object.keys(mikuji)), // イベントの mikujiKey の存在確認に使う
    names: {
      scenarios: (key: string) => scenarios[key]?.name || key,
      placeholders: (key: string) => placeholders[key]?.name || key,
      mikuji: (key: string) => mikuji[key]?.name || key,
      characters: (key: string) => characters[key]?.name || key,
    },
  }
}

type ReferenceGraph = ReturnType<typeof buildReferenceGraph>

/** 最初の構築が終わるまで使う空のグラフ(全部「つながりなし」) */
const createEmptyGraph = (): ReferenceGraph => {
  const identity = (key: string) => key
  return {
    scenarioCalls: new Map(),
    scenarioCallers: new Map(),
    characterScenarios: new Map(),
    scenarioPlaceholders: new Map(),
    placeholderScenarios: new Map(),
    placeholderChildren: new Map(),
    placeholderParents: new Map(),
    boxScenarios: new Map(),
    scenarioBoxes: new Map(),
    scenarioItemCounts: new Map(),
    boxEvents: new Map(),
    scenarioKeys: new Set(),
    mikujiKeys: new Set(),
    names: { scenarios: identity, placeholders: identity, mikuji: identity, characters: identity },
  }
}

/** データ変更から再構築までの待ち時間(ms)。連続した編集はまとめ、先に「検索中」を描画させる */
const REBUILD_DELAY_MS = 150

/**
 * グラフと循環の集合。どれも全体を走査するので、呼び出し元ごとに作らず 1 つを共有する。
 * 描画側が読むのは「できあがったスナップショット」だけ。データが変わっても同期では再計算せず、
 * isSearching を立てたうえで少し待ってから作り直す(その間は前のスナップショットを出し続ける)。
 */
const createSharedGraph = () => {
  const { data } = storeToRefs(useOmikujiStore())
  const graph = shallowRef<ReferenceGraph>(createEmptyGraph())
  const cyclicScenarioKeys = shallowRef<Set<string>>(new Set())
  const cyclicPlaceholderKeys = shallowRef<Set<string>>(new Set())
  const isSearching = ref(true)

  let timer: ReturnType<typeof setTimeout> | undefined
  const rebuild = () => {
    const built = buildReferenceGraph(data.value)
    graph.value = built
    cyclicScenarioKeys.value = cyclicNodes(built.scenarioCalls)
    cyclicPlaceholderKeys.value = cyclicNodes(built.placeholderChildren)
    isSearching.value = false
  }
  const schedule = () => {
    isSearching.value = true
    clearTimeout(timer)
    timer = setTimeout(rebuild, REBUILD_DELAY_MS)
  }

  watch(data, schedule, { deep: true, immediate: true })
  return { graph, cyclicScenarioKeys, cyclicPlaceholderKeys, isSearching }
}

// Pinia(= データの持ち主)ごとに 1 つ。コンポーネントの破棄に巻き込まれないよう、独立した effectScope で作る
const sharedGraphs = new WeakMap<Pinia, ReturnType<typeof createSharedGraph>>()

const getSharedGraph = () => {
  const pinia = getActivePinia()
  if (!pinia) throw new Error('useReferenceGraph: Pinia が有効になっていません')
  let shared = sharedGraphs.get(pinia)
  if (!shared) {
    shared = effectScope(true).run(createSharedGraph)!
    sharedGraphs.set(pinia, shared)
  }
  return shared
}

/**
 * イベント / みくじ箱 / シナリオ / プレースホルダー / キャラクターの参照関係。
 * データが変わったときに 1 回だけ全体を走査して作り(全コンポーネントで共有)、以降の検索は Map 引きだけで済ませる。
 * 返す LinkItem はそのまま接続表示のチップになる。
 */
export function useReferenceGraph() {
  const { graph, cyclicScenarioKeys, cyclicPlaceholderKeys, isSearching } = getSharedGraph()
  const { data } = storeToRefs(useOmikujiStore())

  const toLinkItems = (keys: Iterable<string> | undefined, category: 'scenarios' | 'placeholders' | 'mikuji'): LinkItem[] =>
    Array.from(keys ?? [], (key) => ({
      category,
      key,
      name: graph.value.names[category](key),
      // 削除済みのシナリオが「ある」ように見えないよう、存在しないものに印を付ける(参照データ自体は変更しない)
      ...(category === 'scenarios' && !graph.value.scenarioKeys.has(key) ? { missing: true } : {}),
    }))

  /** キャラクターを使うイベント。scenarioCall の呼び出し元も辿る(循環があっても 1 度ずつ) */
  const eventsUsingCharacter = (characterKey: string): LinkItem[] => {
    const { characterScenarios, scenarioCallers, scenarioBoxes, boxEvents } = graph.value
    const scenarioKeys = reachable(scenarioCallers, characterScenarios.get(characterKey) ?? [])
    const events = new Map<string, LinkItem>()
    for (const scenarioKey of scenarioKeys) {
      for (const boxKey of scenarioBoxes.get(scenarioKey) ?? []) {
        for (const event of boxEvents.get(boxKey) ?? []) events.set(`${event.category}:${event.key}`, event)
      }
    }
    return [...events.values()]
  }

  /** みくじ箱に接続されているイベント(全イベント種別から逆引き) */
  const eventsOfBox = (boxKey: string): LinkItem[] => [...(graph.value.boxEvents.get(boxKey) ?? [])]

  /** みくじ箱が直接実行するシナリオ(kind === 'scenario' の scenarioKey) */
  const scenariosOfBox = (boxKey: string): LinkItem[] => toLinkItems(graph.value.boxScenarios.get(boxKey), 'scenarios')

  /** シナリオの参照元(みくじ箱 → 他のシナリオの順。複数から参照される場合もあり、自己呼び出しは除く) */
  const sourcesOfScenario = (scenarioKey: string): LinkItem[] => {
    const { scenarioBoxes, scenarioCallers } = graph.value
    const callers = [...(scenarioCallers.get(scenarioKey) ?? [])].filter((key) => key !== scenarioKey)
    return [...toLinkItems(scenarioBoxes.get(scenarioKey), 'mikuji'), ...toLinkItems(callers, 'scenarios')]
  }

  /** シナリオから呼び出されるシナリオ(自身を含む。循環参照は重複排除) */
  const calledScenarios = (scenarioKey: string): LinkItem[] =>
    toLinkItems(reachable(graph.value.scenarioCalls, [scenarioKey]), 'scenarios')

  /** シナリオが使っているプレースホルダー(組み込みの `<<userId>>` などは対象外) */
  const placeholdersOfScenario = (scenarioKey: string): LinkItem[] =>
    toLinkItems(graph.value.scenarioPlaceholders.get(scenarioKey), 'placeholders')

  /** プレースホルダーを使っているシナリオ */
  const scenariosOfPlaceholder = (placeholderKey: string): LinkItem[] =>
    toLinkItems(graph.value.placeholderScenarios.get(placeholderKey), 'scenarios')

  /** プレースホルダーが中で使っているプレースホルダー(直接のみ。辿るにはそのアイテムへ移動する) */
  const childPlaceholders = (placeholderKey: string): LinkItem[] =>
    toLinkItems(graph.value.placeholderChildren.get(placeholderKey), 'placeholders')

  /** プレースホルダーを中で使っているプレースホルダー(直接のみ) */
  const parentPlaceholders = (placeholderKey: string): LinkItem[] =>
    toLinkItems(graph.value.placeholderParents.get(placeholderKey), 'placeholders')

  /** プレースホルダーと、それを(入れ子の上位も含めて)使っているプレースホルダーのキー */
  const ancestorPlaceholderKeys = (placeholderKey: string): string[] => [
    ...reachable(graph.value.placeholderParents, [placeholderKey]),
  ]

  /** そのシナリオを実行するおみくじの数(同じシナリオを複数のおみくじが共有できる) */
  const scenarioItemCount = (scenarioKey: string) => graph.value.scenarioItemCounts.get(scenarioKey) ?? 0

  /**
   * イベントから辿れる(= 使用中の)みくじ箱・シナリオ・プレースホルダー・キャラクターのキー(存在するものだけ)。
   * 起点はイベントの mikujiKey。辿った先(みくじ箱 → シナリオ → シナリオ / キャラクター / プレースホルダー)も使用中とする。
   * プレースホルダーは、グラフにない参照(おみくじの制御 variable、gameScript の queryString、イベントの条件式など)を
   * 取りこぼさないよう、使用中の項目の JSON 全体から `<<キー>>` を探す(削除の判断に使うので、使用中の側に倒す)。
   */
  const usedKeysFromEvents = () => {
    const {
      boxEvents,
      boxScenarios,
      scenarioCalls,
      placeholderChildren,
      characterScenarios,
      scenarioKeys,
      mikujiKeys,
    } = graph.value
    const { events, assets } = data.value

    const mikuji = new Set([...boxEvents.keys()].filter((key) => mikujiKeys.has(key)))
    const entryScenarios = [...mikuji].flatMap((boxKey) => [...(boxScenarios.get(boxKey) ?? [])])
    const scenarios = new Set([...reachable(scenarioCalls, entryScenarios)].filter((key) => scenarioKeys.has(key)))

    const characters = new Set<string>()
    for (const [characterKey, scenarioKeysOfCharacter] of characterScenarios) {
      if ([...scenarioKeysOfCharacter].some((scenarioKey) => scenarios.has(scenarioKey))) characters.add(characterKey)
    }

    const placeholderKeys = new Set(Object.keys(assets.placeholders))
    const sources = [
      events,
      ...[...mikuji].map((key) => assets.mikuji[key]),
      ...[...scenarios].map((key) => assets.scenarios[key]),
    ]
    const entryPlaceholders = sources
      .flatMap((source) => tokensOf(JSON.stringify(source)))
      .filter((key) => placeholderKeys.has(key))
    const placeholders = new Set(
      [...reachable(placeholderChildren, entryPlaceholders)].filter((key) => placeholderKeys.has(key))
    )

    return { mikuji, scenarios, placeholders, characters }
  }

  /** 循環の経路(例: A → B → A)を名前で返す。循環していなければ null */
  const scenarioCyclePath = (scenarioKey: string): string[] | null => {
    const path = findCycle(graph.value.scenarioCalls, scenarioKey)
    return path ? path.map(graph.value.names.scenarios) : null
  }
  const placeholderCyclePath = (placeholderKey: string): string[] | null => {
    const path = findCycle(graph.value.placeholderChildren, placeholderKey)
    return path ? path.map(graph.value.names.placeholders) : null
  }

  return {
    eventsUsingCharacter,
    eventsOfBox,
    scenariosOfBox,
    sourcesOfScenario,
    calledScenarios,
    placeholdersOfScenario,
    scenariosOfPlaceholder,
    childPlaceholders,
    parentPlaceholders,
    ancestorPlaceholderKeys,
    scenarioItemCount,
    usedKeysFromEvents,
    /** グラフを作り直している最中か(この間の結果は前回のスナップショット。空でも「なし」とは言えない) */
    isSearching,
    // 循環参照(エディターで見つけて直せるように、接続表示と切替プルダウンに出す)
    cyclicScenarioKeys,
    cyclicPlaceholderKeys,
    scenarioCyclePath,
    placeholderCyclePath,
  }
}
