// src/maps/OmikujiData/events/ServiceTriggerMap.ts
import type { ServiceComparisonConditionType, ServiceTriggerCondition } from '@/types/OmikujiData'

/**
 * サービス比較条件のキー一覧
 */
export const serviceConditionMap: Record<ServiceComparisonConditionType, true> = {
  changed: true,
  increased: true,
  decreased: true,
  greaterThanPeak: true,
  lowerBound: true,
  upperBound: true,
  equal: true,
  loop: true,
}

/**
 * greaterThanPeak を除いた比較条件のキー一覧
 */
export const serviceSimpleComparisonConditionMap: Record<
  Exclude<ServiceComparisonConditionType, 'greaterThanPeak'>,
  true
> = {
  changed: true,
  increased: true,
  decreased: true,
  lowerBound: true,
  upperBound: true,
  equal: true,
  loop: true,
}

/**
 * サービストリガー条件のキー一覧
 */
export const serviceTriggerConditionMap: Record<ServiceTriggerCondition, true> = {
  upVote: true,
  viewer: true,
  follower: true,
  elapsedMinutes: true,
}
