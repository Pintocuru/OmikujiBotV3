// src/i18n/ui/UiSettingsLuckyDrawMessages.ts
// UI 設定の翻訳: luckyDraw
export const uiSettingsLuckyDraw = {
  ja: {
    uiSettings: {
      luckyDraw: {
        previewHint: 'クリックで抽選 / 参加者: {count}名',
        addDummy: 'ダミー参加者を追加',
        waiting: 'クリックして抽選する',
        animation: {
          label: 'アニメーション',
          description: '結果の表示・非表示のアニメーション',
        },
        label: {
          label: '見出し',
          description: '結果の上に出す見出し(空なら表示しません)',
        },
        count: {
          label: '当選人数',
          description: '抽選で選ぶ人数。メッセージの「当選人数」で上書きできます',
          unit: '名',
        },
        clearOnDraw: {
          label: '抽選後に参加者をリセット',
          description: 'オンにすると、抽選のたびに参加者を空にします(当選者は次回の候補から外れます)',
        },
        displaySeconds: {
          label: '結果の表示秒数',
          description: '抽選結果を表示し続ける秒数(0 は次の抽選まで表示します)',
          unit: '秒',
        },
        showHistory: {
          label: '履歴ボタン',
          description: 'マウスを乗せると出るボタンで、最新 10 件の当選者を見られます',
        },
        history: {
          title: '履歴(最新10件)',
          empty: 'まだ履歴がありません',
          clear: '履歴をクリア',
        },
        coupling: {
          notEnough: 'カップリングには2名の参加者が必要です',
        },
        topStars: {
          noUsers: '表示するユーザーがいません',
        },
      },
    },
  },
  en: {
    uiSettings: {
      luckyDraw: {
        previewHint: 'Click to draw / Participants: {count}',
        addDummy: 'Add dummy participants',
        waiting: 'Click to draw',
        animation: {
          label: 'Animation',
          description: 'Animation for showing and hiding the result',
        },
        label: {
          label: 'Heading',
          description: 'A heading shown above the result (hidden when empty)',
        },
        count: {
          label: 'Winners',
          description: 'How many people to draw. A message can override this with its own count',
          unit: '',
        },
        clearOnDraw: {
          label: 'Reset participants after a draw',
          description: 'When on, participants are cleared after every draw (winners drop out of the next draw)',
        },
        displaySeconds: {
          label: 'Result display seconds',
          description: 'How long the result stays visible (0 keeps it until the next draw)',
          unit: 'sec',
        },
        showHistory: {
          label: 'History button',
          description: 'A button shown on hover that lists the latest 10 draws',
        },
        history: {
          title: 'History (latest 10)',
          empty: 'No history yet',
          clear: 'Clear history',
        },
        coupling: {
          notEnough: 'Coupling needs 2 participants',
        },
        topStars: {
          noUsers: 'There are no users to show',
        },
      },
    },
  },
} as const
