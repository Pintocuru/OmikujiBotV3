// src/ConfigMaker/stores/composables/useGetEventData.ts
import { storeToRefs } from 'pinia'
import type { EventCategoryType, EventCategoryDataMap } from '@/types/OmikujiData'
import { useOmikujiStore } from './useOmikujiStore'

export function useGetEventData() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 単一イベント取得
  const getEvent = <K extends EventCategoryType>(category: K, key: string): EventCategoryDataMap[K] | undefined => {
    return data.value.events[category].find((item) => item.id === key) as EventCategoryDataMap[K] | undefined
  }

  // カテゴリ内のイベント一覧
  const getEvents = <K extends EventCategoryType>(category: K): EventCategoryDataMap[K][] => {
    return data.value.events[category] as EventCategoryDataMap[K][]
  }

  // イベント存在確認
  const hasEvent = <K extends EventCategoryType>(category: K, key: string): boolean => {
    return data.value.events[category].some((item) => item.id === key)
  }

  // イベント数
  const getEventCount = (category: EventCategoryType): number => {
    return data.value.events[category].length
  }

  return {
    getEvent,
    getEvents,
    hasEvent,
    getEventCount,
  }
}
