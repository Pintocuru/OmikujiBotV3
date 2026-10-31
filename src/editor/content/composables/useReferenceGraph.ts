// src/editor/content/composables/useReferenceGraph.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { eventCategory, hasScenarioStepMessage } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import type { AssetRef, EventRef } from './useOmikujiConnections'

type Edges = Map<string, Set<string>>

/** プレースホルダーの埋め込み `<<キー>>`(キーは英数字と _ のみ。`<<userId>>` などの組み込みは後で除外される) */
const PLACEHOLDER_TOKEN = /<<([a-zA-Z0-9_]+)>>/g

const addEdge = (edges: Edges, from: string, to: string) => {
  const set = edges.get(from)
  if (set) set.add(to)
  else edges.set(from, new Set([to]))
}

const contentOf = (value: string | { content: string }): string => (typeof value === 'string' ? value : value.content)

const tokensOf = (text: string): string[] => Array.from(text.matchAll(PLACEHOLDER_TOKEN), (m) => m[1])

/** start から辿って start に戻る経路(start, ..., start)。無ければ null。到達済みを記録するので 1 回 O(V+E) */
const findCycle = (edges: Edges, start: string): string[] | null => {
  const visited = new Set<string>()
  const path: string[] = [start]
  const walk = (node: string): boolean => {
    for (const next of edges.get(node) ?? []) {
      if (next === start) {
        path.push(start)
        return true
      }
      if (visited.has(next)) continue
      visited.add(next)
      path.push(next)
      if (walk(next)) return true
      path.pop()
    }
    return false
  }
  return walk(start) ? path : null
}

/** edges 上で、自分自身に戻ってくるノード(循環に含まれるノード)の集合 */
const cyclicNodes = (edges: Edges): Set<string> => {
  const result = new Set<string>()
  for (const node of edges.keys()) if (findCycle(edges, node)) result.add(node)
  return result
}

/** starts とそこから到達できる全ノード。循環があっても 1 度ずつしか辿らない */
const reachable = (edges: Edges, starts: Iterable<string>): Set<string> => {
  const seen = new Set<string>()
  const queue = [...starts]
  while (queue.length > 0) {
    const node = queue.pop()!
    if (seen.has(node)) continue
    seen.add(node)
    for (const next of edges.get(node) ?? []) if (!seen.has(next)) queue.push(next)
  }
  return seen
}

/**
 * イベント / みくじ箱 / シナリオ / プレースホルダー / キャラクターの参照関係。
 * データが変わったときに 1 回だけ全体を走査して作り(computed)、以降の検索は Map 引きだけで済ませる。
 */
export function useReferenceGraph() {
  const { data } = storeToRefs(useOmikujiStore())

  const graph = computed(() => {
    const { scenarios, placeholders, mikuji, characters } = data.value.assets

    const scenarioCalls: Edges = new Map() // シナリオ → 呼び出すシナリオ
    const scenarioCallers: Edges = new Map() // 逆向き
    const characterScenarios: Edges = new Map() // キャラクター → 使うシナリオ
    const scenarioPlaceholders: Edges = new Map() // シナリオ → 使うプレースホルダー
    const placeholderScenarios: Edges = new Map() // 逆向き
    const placeholderChildren: Edges = new Map() // プレースホルダー → 中で使うプレースホルダー
    const placeholderParents: Edges = new Map() // 逆向き
    const boxScenarios: Edges = new Map() // みくじ箱 → 実行するシナリオ
    const scenarioBoxes: Edges = new Map() // 逆向き
    const scenarioItemCount = new Map<string, number>() // シナリオ → それを実行するおみくじ数

    const placeholderKeys = new Set(Object.keys(placeholders))

    for (const [scenarioKey, scenario] of Object.entries(scenarios)) {
      for (const step of scenario.steps) {
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
      for (const item of box.omikuji) {
        if (item.kind !== 'steps' || !item.stepKey) continue
        addEdge(boxScenarios, boxKey, item.stepKey)
        addEdge(scenarioBoxes, item.stepKey, boxKey)
        scenarioItemCount.set(item.stepKey, (scenarioItemCount.get(item.stepKey) ?? 0) + 1)
      }
    }

    // みくじ箱 → それを使うイベント
    const boxEvents = new Map<string, EventRef[]>()
    for (const category of eventCategory) {
      for (const event of data.value.events[category]) {
        if (!event.omikujiKey) continue
        const list = boxEvents.get(event.omikujiKey) ?? []
        list.push({ category, id: event.id, name: event.name || event.id })
        boxEvents.set(event.omikujiKey, list)
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
      scenarioItemCount,
      boxEvents,
      names: {
        scenarios: (key: string) => scenarios[key]?.name || key,
        placeholders: (key: string) => placeholders[key]?.name || key,
        mikuji: (key: string) => mikuji[key]?.name || key,
        characters: (key: string) => characters[key]?.name || key,
      },
    }
  })

  const toRefs = (keys: Iterable<string> | undefined, category: 'scenarios' | 'placeholders'): AssetRef[] =>
    Array.from(keys ?? [], (key) => ({ key, name: graph.value.names[category](key) }))

  /** キャラクターを使うイベント。scenarioCall の呼び出し元も辿る(循環があっても 1 度ずつ) */
  const eventsUsingCharacter = (characterKey: string): EventRef[] => {
    const { characterScenarios, scenarioCallers, scenarioBoxes, boxEvents } = graph.value
    const scenarioKeys = reachable(scenarioCallers, characterScenarios.get(characterKey) ?? [])
    const events = new Map<string, EventRef>()
    for (const scenarioKey of scenarioKeys) {
      for (const boxKey of scenarioBoxes.get(scenarioKey) ?? []) {
        for (const event of boxEvents.get(boxKey) ?? []) events.set(`${event.category}:${event.id}`, event)
      }
    }
    return [...events.values()]
  }

  /** シナリオが使っているプレースホルダー(組み込みの `<<userId>>` などは対象外) */
  const placeholdersOfScenario = (scenarioKey: string) =>
    toRefs(graph.value.scenarioPlaceholders.get(scenarioKey), 'placeholders')

  /** プレースホルダーを使っているシナリオ */
  const scenariosOfPlaceholder = (placeholderKey: string) =>
    toRefs(graph.value.placeholderScenarios.get(placeholderKey), 'scenarios')

  /** プレースホルダーが中で使っているプレースホルダー(直接のみ。辿るにはそのアイテムへ移動する) */
  const childPlaceholders = (placeholderKey: string) =>
    toRefs(graph.value.placeholderChildren.get(placeholderKey), 'placeholders')

  /** プレースホルダーを中で使っているプレースホルダー(直接のみ) */
  const parentPlaceholders = (placeholderKey: string) =>
    toRefs(graph.value.placeholderParents.get(placeholderKey), 'placeholders')

  /** そのシナリオを実行するおみくじの数(同じシナリオを複数のおみくじが共有できる) */
  const scenarioItemCount = (scenarioKey: string) => graph.value.scenarioItemCount.get(scenarioKey) ?? 0

  // 循環参照(エディターで見つけて直せるように、ヘッダーと切替プルダウンに出す)
  const cyclicScenarioKeys = computed(() => cyclicNodes(graph.value.scenarioCalls))
  const cyclicPlaceholderKeys = computed(() => cyclicNodes(graph.value.placeholderChildren))

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
    placeholdersOfScenario,
    scenariosOfPlaceholder,
    childPlaceholders,
    parentPlaceholders,
    scenarioItemCount,
    cyclicScenarioKeys,
    cyclicPlaceholderKeys,
    scenarioCyclePath,
    placeholderCyclePath,
  }
}
