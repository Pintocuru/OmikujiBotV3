// src/editor/stores/composables/useEventCRUD.ts
import type { Ref } from 'vue'
import { EventCategorySchemaMap, EventCategoryType, EventCategoryDataMap, OmikujiDataType } from '@/types/OmikujiData'

/**
 * Eventsの基本的なCRUD操作を提供
 */
export function useEventCRUD(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // Event追加
  const addEvent = <C extends EventCategoryType>(category: C, item: Partial<EventCategoryDataMap[C]> = {}): string => {
    const schema = EventCategorySchemaMap[category]
    const newItem = schema.parse(item) as EventCategoryDataMap[C]
    const events = data.value.events[category] as EventCategoryDataMap[C][]
    events.push(newItem)
    hasChanged.value = true
    return newItem.id
  }

  // Event更新
  const updateEvent = <C extends EventCategoryType>(
    category: C,
    id: string,
    updates: Partial<EventCategoryDataMap[C]>
  ) => {
    const events = data.value.events[category] as EventCategoryDataMap[C][]
    const index = events.findIndex((item) => item.id === id)
    if (index === -1) return
    const updatedItem = {
      ...events[index],
      ...updates,
      id,
    }
    const updatedEvents = [...events]
    updatedEvents[index] = updatedItem
    data.value.events[category] = updatedEvents as (typeof data.value.events)[C]
    hasChanged.value = true
  }

  // Event削除
  const removeEvent = <C extends EventCategoryType>(category: C, id: string) => {
    const events = data.value.events[category] as EventCategoryDataMap[C][]
    const updatedEvents = events.filter((item) => item.id !== id)
    if (updatedEvents.length === events.length) return
    data.value.events[category] = updatedEvents as (typeof data.value.events)[C]
    hasChanged.value = true
  }

  // Event複製
  const duplicateEvent = <C extends EventCategoryType>(category: C, id: string): string | null => {
    const event = data.value.events[category].find((item) => item.id === id) as EventCategoryDataMap[C] | undefined
    if (!event) return null
    const duplicatedEvent = { ...event, id: undefined }
    return addEvent(category, duplicatedEvent)
  }

  return {
    addEvent,
    updateEvent,
    removeEvent,
    duplicateEvent,
  }
}
