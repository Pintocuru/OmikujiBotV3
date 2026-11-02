// src/i18n/editor/maps/EventMapMessages.ts
export const eventMapMessages = {
  ja: {
    mapText: {
      reactionCondition: {
        milestone: {
          label: '増加した',
          description: '累計がnの倍数に達するたびに発火します（例：100回ごと）',
        },
        burstSustain: {
          label: '増加した(レベル参照)',
          description: '指定レベル以上の間、n回押されるたびに発火します',
        },
        equal: {
          label: '指定値と等しい',
          description: '累計が指定値にぴったり一致したとき1回だけ発火します',
        },
        burstReach: {
          label: 'レベルアップ時',
          description: '指定レベル以上に到達した瞬間に1回だけ発火します',
        },
        burstDrop: {
          label: 'レベルダウン時',
          description: '指定レベル以下に下がった瞬間に1回だけ発火します',
        },
      },
      serviceCondition: {
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
      },
      countComparison: {
        lowerBound: { label: '指定値以上' },
        upperBound: { label: '指定値以下' },
        equal: { label: '等しい' },
        loop: { label: 'ループ' },
      },
      countUnit: {
        lc: { label: '配信枠のコメント数' },
        tc: { label: '個人コメント数（総数）' },
      },
      syokenCondition: {
        syoken: { label: '初見' },
        again: { label: '7日以上経過' },
        firstVisit: { label: '配信枠での初回' },
      },
    },
  },
  en: {
    mapText: {
      reactionCondition: {
        milestone: {
          label: 'Increased',
          description: 'Fires each time the total reaches a multiple of n (e.g. every 100)',
        },
        burstSustain: {
          label: 'Increased (by level)',
          description: 'While at or above the specified level, fires every n presses',
        },
        equal: {
          label: 'Equals value',
          description: 'Fires only once when the total exactly matches the specified value',
        },
        burstReach: {
          label: 'On level up',
          description: 'Fires only once at the moment the specified level is reached',
        },
        burstDrop: {
          label: 'On level down',
          description: 'Fires only once at the moment it drops to or below the specified level',
        },
      },
      serviceCondition: {
        changed: {
          label: 'Changed',
          description: 'Satisfied when the value differs from the previous one',
        },
        increased: {
          label: 'Increased',
          description: 'Satisfied when the value is higher than the previous one',
        },
        decreased: {
          label: 'Decreased',
          description: 'Satisfied when the value is lower than the previous one',
        },
        greaterThanPeak: {
          label: 'Exceeded peak',
          description: 'Satisfied when the all-time high is exceeded',
        },
        lowerBound: {
          label: 'At or above value',
          description: 'Satisfied when at or above the specified value',
        },
        upperBound: {
          label: 'At or below value',
          description: 'Satisfied when at or below the specified value',
        },
        equal: {
          label: 'Equals value',
          description: 'Satisfied when equal to the specified value',
        },
        loop: {
          label: 'Loop',
          description: 'Satisfied at multiples of the specified value (e.g. every 10 increase)',
        },
      },
      countComparison: {
        lowerBound: { label: 'At or above value' },
        upperBound: { label: 'At or below value' },
        equal: { label: 'Equals value' },
        loop: { label: 'Loop' },
      },
      countUnit: {
        lc: { label: 'Comments in this stream' },
        tc: { label: 'Total comments by this user' },
      },
      syokenCondition: {
        syoken: { label: 'First-time visitor' },
        again: { label: 'No visit in the past 7 days' },
        firstVisit: { label: 'First comment in this stream' },
      },
    },
  },
} as const
