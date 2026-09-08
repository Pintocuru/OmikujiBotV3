//
import { ServiceComparisonConditionType, ServiceTriggerCondition } from '@/types/OmikujiData'

/**
 * 比較条件のUI表示情報
 */
export const serviceConditionMap: Record<ServiceComparisonConditionType, { label: string; description: string }> = {
  changed: {
    label: '変化した',
    description: '前回の値と異なる場合に条件を満たします',
  },
  increased: {
    label: '増えた',
    description: '前回の値より増加した場合に条件を満たします',
  },
  decreased: {
    label: '減った',
    description: '前回の値より減少した場合に条件を満たします',
  },
  greaterThanPeak: {
    label: 'ピーク値を超えた',
    description: '過去最高値を超えた場合に条件を満たします',
  },
  lowerBound: {
    label: '指定値以上',
    description: '指定値以上の場合に条件を満たします',
  },
  upperBound: {
    label: '指定値以下',
    description: '指定値以下の場合に条件を満たします',
  },
  equal: {
    label: '指定値と等しい',
    description: '指定値と等しい場合に条件を満たします',
  },
  loop: {
    label: 'ループ',
    description: '指定値の倍数の時に条件を満たします（例：10増えるごと）',
  },
}

/**
 * 条件タイプのUI表示情報
 */
export const serviceTriggerConditionMap: Record<
  ServiceTriggerCondition,
  { label: string; description: string; icon: string }
> = {
  upVote: {
    label: '👍高評価',
    description: '配信の高評価数の変動をトリガーにします',
    icon: 'ThumbsUp',
  },
  viewer: {
    label: '👀視聴者数',
    description: '現在の同接・視聴者数の変動をトリガーにします',
    icon: 'Users',
  },
  follower: {
    label: '⭐登録者数',
    description: 'チャンネル登録者数・フォロワー数の変動をトリガーにします',
    icon: 'UserPlus',
  },
  elapsedMinutes: {
    label: '⏱配信経過時間',
    description: '配信開始からの経過時間をトリガーにします',
    icon: 'Clock',
  },
}
