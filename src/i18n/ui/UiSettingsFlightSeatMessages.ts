// src/i18n/editor/ui/UiSettingsFlightSeatMessages.ts
// UI 設定の翻訳: flightSeat
export const uiSettingsFlightSeat = {
  ja: {
    uiSettings: {
      flightSeat: {
        preset: {
          label: 'プリセット',
          description: '座席レイアウトのプリセットを適用します',
        },
        customLayout: {
          label: 'カスタムレイアウト',
          description: '各行の座席数をJSON配列で指定します（例: [12, 13, 12]）',
          invalid: 'JSONの形式が正しくありません',
        },
        statKey: {
          label: '右下のステータス',
          description: 'アイコンの右下に表示する内容',
          none: '非表示',
          userName: 'ユーザー名',
          tc: 'チャット数',
          giftPrice: 'ギフト金額',
        },
        preview: {
          totalSeats: '現在の座席: {n}',
          addUser: '👤 乗車',
          reset: '🔄 リセット',
        },
        presets: {
          grid3x3: '3×3 グリッド',
          row: '横一列',
          column: '縦一列',
          standardCabin: 'スタンダードキャビン',
          regionalJet: 'リージョナルジェット',
          wideBody: 'ワイドボディ配列',
          fullLongHaul: '満席ロングフライト',
          jumboCabin: '超大型機キャビン',
          normalClass: '一般的なクラス',
          smallClass: '小さなクラス',
          twoClasses: '2クラス合同',
          wholeGrade: '学年全員',
          friends100: 'ともだち100人できるかな',
          fill300: '300人埋めてみろよVTuber',
        },
      },
    },
  },
  en: {
    uiSettings: {
      flightSeat: {
        preset: {
          label: 'Presets',
          description: 'Apply a seat layout preset',
        },
        customLayout: {
          label: 'Custom layout',
          description: 'Set the number of seats in each row as a JSON array (e.g. [12, 13, 12])',
          invalid: 'Invalid JSON format',
        },
        statKey: {
          label: 'Bottom-right status',
          description: 'What to show at the bottom right of each icon',
          none: 'Hidden',
          userName: 'User name',
          tc: 'Comment count',
          giftPrice: 'Gift amount',
        },
        preview: {
          totalSeats: 'Seats: {n}',
          addUser: '👤 Board',
          reset: '🔄 Reset',
        },
        presets: {
          grid3x3: '3×3 grid',
          row: 'Single row',
          column: 'Single column',
          standardCabin: 'Standard cabin',
          regionalJet: 'Regional jet',
          wideBody: 'Wide-body layout',
          fullLongHaul: 'Full long-haul flight',
          jumboCabin: 'Jumbo cabin',
          normalClass: 'Typical class',
          smallClass: 'Small class',
          twoClasses: 'Two classes together',
          wholeGrade: 'Whole grade',
          friends100: 'Can you make 100 friends?',
          fill300: 'Fill all 300 seats, VTuber!',
        },
      },
    },
  },
} as const
