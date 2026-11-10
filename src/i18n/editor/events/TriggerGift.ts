// src/i18n/editor/events/TriggerGift.ts
export const triggerGiftMessages = {
  ja: {
    triggerGift: {
      label: 'ギフト条件',
      description: '金額や種類で発動条件を設定',
      kindsLabel: '種類（未選択ならすべて）',
      tiersLabel: '金額の段階（有料ギフトのみ）',
      kinds: {
        paid: { label: '有料', description: '収益になるギフト（スパチャ・ジュエル・ビッツなど）' },
        free: { label: '無料', description: 'お茶など、無料のギフト' },
        member: { label: 'メンバー/サブスク', description: 'メンバーシップ・サブスクの加入やギフト' },
      },
      conditions: {
        all: {
          label: '全て',
          description: '金額を問わないすべてのギフト（無料・メンバー／サブスクを含む）',
        },
        blue: {
          label: '200円未満',
          description: '200円未満の小額ギフト',
        },
        lightBlue: {
          label: '200-499円',
          description: '200円以上500円未満のギフト',
        },
        green: {
          label: '500-999円',
          description: '500円以上1000円未満のギフト',
        },
        yellow: {
          label: '1000-1999円',
          description: '1000円以上2000円未満のギフト',
        },
        orange: {
          label: '2000-4999円',
          description: '2000円以上5000円未満のギフト',
        },
        pink: {
          label: '5000-9999円',
          description: '5000円以上10000円未満のギフト',
        },
        red: {
          label: '10000円-19999円',
          description: '10000円以上20000円未満の高額ギフト',
        },
        purple: {
          label: '20000円以上',
          description: '20000円以上の超高額ギフト',
        },
      },
    },
  },
  en: {
    triggerGift: {
      label: 'Gift Conditions',
      description: 'Change activation based on amount or type',
      kindsLabel: 'Kind (all kinds if none selected)',
      tiersLabel: 'Amount tier (applies to paid gifts only)',
      kinds: {
        paid: { label: 'Paid', description: 'Gifts that bring in real money (Super Chat, Jewels, Bits, etc.)' },
        free: { label: 'Free', description: 'Free gifts such as tea' },
        member: { label: 'Member/Sub', description: 'Membership / subscription joins and gifts' },
      },
      conditions: {
        all: {
          label: 'All',
          description: 'All gifts regardless of amount (including free and member/sub)',
        },
        blue: {
          label: 'Under ¥200',
          description: 'Small gifts under ¥200',
        },
        lightBlue: {
          label: '¥200 - ¥499',
          description: 'Gifts from ¥200 to under ¥500',
        },
        green: {
          label: '¥500 - ¥999',
          description: 'Gifts from ¥500 to under ¥1,000',
        },
        yellow: {
          label: '¥1,000 - ¥1,999',
          description: 'Gifts from ¥1,000 to under ¥2,000',
        },
        orange: {
          label: '¥2,000 - ¥4,999',
          description: 'Gifts from ¥2,000 to under ¥5,000',
        },
        pink: {
          label: '¥5,000 - ¥9,999',
          description: 'Gifts from ¥5,000 to under ¥10,000',
        },
        red: {
          label: '¥10,000 - ¥19,999',
          description: 'High-value gifts from ¥10,000 to under ¥20,000',
        },
        purple: {
          label: '¥20,000 and above',
          description: 'Ultra high-value gifts of ¥20,000 or more',
        },
      },
    },
  },
} as const
