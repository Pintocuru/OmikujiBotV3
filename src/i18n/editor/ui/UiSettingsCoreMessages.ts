// src/i18n/editor/ui/UiSettingsCoreMessages.ts
// UI 設定の翻訳: common / characterStage / lifeHourglass / slots
export const uiSettingsCore = {
  ja: {
    uiSettings: {
      common: {
        color: {
          label: 'カラー設定',
          description: '表示カラー',
        },
        bubbleMotion: {
          label: 'フキダシアニメーション',
          description: 'フキダシの表示アニメーション',
        },
        displayStyle: {
          label: '表示スタイル',
          description: '表示形式を選択',
        },
        unregistered: '未登録: {id}',
        unregisteredDescription: 'このバージョンには含まれていません',
        resetToDefault: '既定に戻す',
        defaultOption: '(既定: {value})',
        defaultOnly: '(既定)',
        emptyMessage: '(未記入)',
        loadError: {
          unregistered: '未登録の表示タイプ: {id}',
          loadFailed: '表示タイプ「{id}」の読み込みに失敗しました',
        },
      },
      characterStage: {
        noSettings: {
          line1: 'シナリオで個別に編集するものです。',
          line2: '設定できる項目がありません。',
        },
        preview: {
          noImageCharacter: '画像のあるキャラクターがありません',
          spawn: '登場',
          hideAll: '消す',
        },
        slots: {
          hint: '空欄の項目は既定値が使われます',
          secondsUnit: '秒(0 は無期限)',
          anchorHint: '位置X・Yに置く、キャラ画像上の点',
          scaleUnit: '倍(実寸 {px}px)',
          durationUnit: '秒(小さいほど速い)',
          clearYes: '消す',
          clearNo: '消さない',
          axisX: {
            label: '位置X',
            description: '0〜100(%)。左端が 0。違う値ならランダム',
          },
          axisY: {
            label: '位置Y',
            description: '0〜100(%)。上端が 0。違う値ならランダム',
          },
          anchors: {
            topLeft: '左上',
            top: '上中央',
            topRight: '右上',
            left: '左中央',
            center: '中央',
            right: '右中央',
            bottomLeft: '左下',
            bottom: '下中央',
            bottomRight: '右下',
          },
        },
      },
      lifeHourglass: {
        carryOver: {
          label: '前回までの砂粒を引き継ぐ',
          descriptionOn: 'ON: 前回までの通算を表示します / OFF: 今回の配信ぶんだけを表示します',
          descriptionUnavailable: 'サーバーがないため、現在は使用できません(起動しごとに 0 に戻ります)',
        },
        preview: {
          viewer: '同接',
          time: '時間',
          gift: 'ギフト',
          reset: 'リセット',
          add10s: '+10秒',
          add1m: '+1分',
          add10m: '+10分',
          add1h: '+1時間',
        },
      },
      slots: {
        gameRanking: {
          gameKey: {
            title: 'ゲームキー',
            description: 'ゲームの認識キー(任意)',
          },
          listName: {
            title: 'ユーザー名',
            description: '表示名。空なら user.userName を使う',
          },
          symbol: {
            title: 'シンボル',
            description: 'ユーザー名の右側につく記号',
          },
          scoreText: {
            title: '得点(文字)',
            description: '表示用の得点',
          },
          score: {
            title: '得点(数値)',
            description: '並び順を決める(表示しない)',
          },
        },
        kujibikiPanel: {
          result: {
            title: '結果',
            description: '運勢などの見出し(例: 大吉)',
          },
          detail: {
            title: '解説',
            description: '結果の解説文',
          },
          subResult: {
            title: 'サブ見出し',
            description: '例: 恋愛(空ならサブ全体を表示しない)',
          },
          subDetail: {
            title: 'サブ解説',
            description: '例: 神様の後押しで愛が深まる',
          },
        },
        characterStage: {
          seconds: {
            title: '表示秒数',
            description: '0 は無期限。空なら既定値',
          },
          xMin: {
            title: '位置X 最小',
            description: '0〜100(%)。最小と最大が同じなら固定、違えば範囲内でランダム',
          },
          xMax: {
            title: '位置X 最大',
            description: '0〜100(%)',
          },
          yMin: {
            title: '位置Y 最小',
            description: '0〜100(%)。画面上端が 0',
          },
          yMax: {
            title: '位置Y 最大',
            description: '0〜100(%)',
          },
          scale: {
            title: 'サイズ倍率',
            description: '1 が標準。空なら 1',
          },
          motion: {
            title: '登場・退場モーション',
            description: 'モーションのキー(例: fade, slideUp)。空なら既定値',
          },
          clearPrevious: {
            title: '前の表示を消す',
            description: 'true なら、これまでの表示を消してから表示する',
          },
          motionDuration: {
            title: 'アニメーション速度',
            description: '登場・退場のモーションの秒数。0.4〜5(小さいほど速い)。空なら 1',
          },
          anchor: {
            title: '基準点',
            description: '位置X・Yが、キャラ画像のどの点か(例: bottomRight)。空なら既定値',
          },
        },
      },
    },
  },
  en: {
    uiSettings: {
      common: {
        color: {
          label: 'Color',
          description: 'Set the display color',
        },
        bubbleMotion: {
          label: 'Bubble animation',
          description: 'Set the display animation of the bubble',
        },
        displayStyle: {
          label: 'Display style',
          description: 'Choose the display format',
        },
        unregistered: 'Unregistered: {id}',
      },
    },
  },
} as const
