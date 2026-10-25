// src/editor/stores/composables/useEventProperties.ts
import { EventCategoryType, EventCategoryDataMap } from '@/types/OmikujiData'
import { useEventCRUD } from './useEventCRUD'

/**
 * Events専用のプロパティ更新機能
 */
export function useEventProperties(eventCRUD: ReturnType<typeof useEventCRUD>) {
  const updateEventProperty = <C extends EventCategoryType, K extends keyof EventCategoryDataMap[C]>(
    category: C,
    id: string,
    propertyKey: K,
    value: EventCategoryDataMap[C][K]
  ) => {
    eventCRUD.updateEvent(category, id, {
      [propertyKey]: value,
    } as unknown as Partial<EventCategoryDataMap[C]>)
  }

  return {
    updateEventProperty,
  }
}
