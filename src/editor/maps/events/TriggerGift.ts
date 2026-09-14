// src/editor/maps/events/TriggerGift.ts
export const triggerGiftMessages = {
  ja: {
    triggerGift: {
      label: 'ギフト条件',
      description: '金額や種類で発動を変更できます',
      conditions: {
        all: {
          label: '全て',
          description: 'メンバー加入を含む全てのギフト',
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
        special: {
          label: 'その他のギフト（メンバーシップ等）',
          description: '金額区分ではない有料サービス（メンバーシップ・ステッカー・サブスクなど）',
        },
      },
    },
  },
  en: {
    triggerGift: {
      label: 'Gift Conditions',
      description: 'Change activation based on amount or type',
      conditions: {
        all: {
          label: 'All',
          description: 'All gifts including memberships',
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
        special: {
          label: 'Other Gifts (Memberships, etc.)',
          description: 'Paid services not based on amounts (memberships, stickers, subs, etc.)',
        },
      },
    },
  },
} as const
