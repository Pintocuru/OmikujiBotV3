// src/ConfigMaker/stores/composables/useEventProperties.ts
import { Ref } from 'vue'
import {
  OmikujiDataType,
  EventCategoryType,
  EventCategoryDataMap,
  EventType,
  OmikujiItemType,
  PostFlowType,
} from '@/types/OmikujiData'
import { useEventCRUD } from './useEventCRUD'

/**
 * Events専用のプロパティ更新機能
 */
export function useEventProperties(data: Ref<OmikujiDataType>, eventCRUD: ReturnType<typeof useEventCRUD>) {
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

  // 特殊ケース: おみくじのitem更新
  const updateOmikujiByIndex = (
    category: EventCategoryType,
    eventId: string,
    omikujiIndex: number,
    updater: (item: OmikujiItemType) => OmikujiItemType
  ) => {
    const record = eventCRUD.getEvent(category, eventId) as EventType | undefined
    if (!record?.omikuji?.[omikujiIndex]) return

    const updated = [...record.omikuji]
    updated[omikujiIndex] = updater(updated[omikujiIndex])

    updateEventProperty(category, eventId, 'omikuji', updated)
  }

  // 特殊ケース: おみくじのpostActions更新
  const updateOmikujiPostActions = (
    category: EventCategoryType,
    eventId: string,
    omikujiIndex: number,
    postActions: PostFlowType[]
  ) => {
    const record = eventCRUD.getEvent(category, eventId) as EventType | undefined
    if (!record?.omikuji?.[omikujiIndex]) {
      console.error('指定されたおみくじが見つかりません')
      return
    }

    const updatedOmikuji = [...record.omikuji]
    updatedOmikuji[omikujiIndex] = {
      ...updatedOmikuji[omikujiIndex],
      postActions: postActions.sort((a, b) => a.delaySeconds - b.delaySeconds),
    }

    updateEventProperty(category, eventId, 'omikuji', updatedOmikuji)
  }

  return {
    updateEventProperty,
    updateOmikujiByIndex,
    updateOmikujiPostActions,
  }
}

/**

// src/ConfigMaker/stores/composables/useEventProperties.ts
import { Ref } from 'vue'
import {
  OmikujiDataType,
  EventCategoryType,
  EventCategoryDataMap,
  EventType,
  OmikujiItemType,
  PostFlowType,
} from '@/types/OmikujiData'
import { useEventCRUD } from './useEventCRUD'

export function useEventProperties(data: Ref<OmikujiDataType>, eventCRUD: ReturnType<typeof useEventCRUD>) {
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

  // 特殊ケース: おみくじのitem更新
  // TODO:「みくじ箱」が新設されたので、この処理は不要
  const updateOmikujiByIndex = (
    category: EventCategoryType,
    eventId: string,
    omikujiIndex: number,
    updater: (item: OmikujiItemType) => OmikujiItemType
  ) => {
    const record = eventCRUD.getEvent(category, eventId) as EventType | undefined
    if (!record?.omikuji?.[omikujiIndex]) return

    const updated = [...record.omikuji]
    updated[omikujiIndex] = updater(updated[omikujiIndex])

    updateEventProperty(category, eventId, 'omikuji', updated)
  }

  // 特殊ケース: おみくじのpostActions更新
  const updateOmikujiPostActions = (
    category: EventCategoryType,
    eventId: string,
    omikujiIndex: number,
    postActions: PostFlowType[]
  ) => {
    const record = eventCRUD.getEvent(category, eventId) as EventType | undefined
    if (!record?.omikuji?.[omikujiIndex]) {
      console.error('指定されたおみくじが見つかりません')
      return
    }

    const updatedOmikuji = [...record.omikuji]
    updatedOmikuji[omikujiIndex] = {
      ...updatedOmikuji[omikujiIndex],
      postActions: postActions.sort((a, b) => a.delaySeconds - b.delaySeconds),
    }

    updateEventProperty(category, eventId, 'omikuji', updatedOmikuji)
  }

  return {
    updateEventProperty,
    updateOmikujiByIndex,
    updateOmikujiPostActions,
  }
}


 *
 */
