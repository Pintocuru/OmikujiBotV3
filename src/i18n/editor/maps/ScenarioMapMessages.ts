// src/i18n/editor/maps/ScenarioMapMessages.ts
export const scenarioMapMessages = {
  ja: {
    mapText: {
      gameMeta: {
        GouseiSuika: {
          label: 'スイカジェネレーター',
          description: '米兜科技 - 合成大西瓜風のおみくじ',
        },
        CommentBot: {
          label: 'コメントBOT',
          description: 'BOTとしてわんコメにコメントを自動投稿する拡張スクリプト',
        },
      },
      // ゲームの入力欄・出力変数の説明 (宣言は src/games/scripts/**/meta.ts)
      gameParams: {
        GouseiSuika: {
          mode: { label: 'モード', description: '遊ぶ果物の種類' },
          life: { label: 'ライフ', description: 'ゲームのライフ (1〜99)。空欄なら 3' },
        },
        CommentBot: {
          theme: { label: 'テーマ', description: '投稿するコメントの種類' },
          name: { label: '投稿者名', description: '空欄ならランダム' },
          comments: { label: 'コメント', description: 'カンマ区切りで指定。空欄ならテーマから選びます' },
          users: { label: '人数', description: '投稿者の人数 (範囲外は自動で丸めます)' },
        },
      },
      gameOutputs: {
        GouseiSuika: { gouseisuika_points: '得点' },
      },
      scenarioStepKind: {
        message: {
          label: 'メッセージ',
          description: 'おみくじBOTに表示するテキスト',
        },
        sound: {
          label: 'サウンド',
          description: 'シナリオ実行時に再生する効果音',
        },
        wordParty: {
          label: 'WordParty',
          description: 'わんコメの WordParty 演出を呼び出します',
        },
        variable: {
          label: '評価ブロック',
          description: '変数の代入・計算・スクリプト評価を実行',
        },
        gameScript: {
          label: 'スクリプト',
          description: 'スクリプトやミニゲームを呼び出す',
        },
        scenarioCall: {
          label: 'シナリオ',
          description: '登録済みのシナリオを呼び出す',
        },
      },
      omikujiItemKind: {
        scenario: {
          label: 'シナリオ実行',
          description: '下記の内容をわんコメやジェネレーターに表示',
        },
        control: {
          label: '処理を制御する',
          description: 'シナリオを実行せず、処理の流れを制御',
        },
      },
      omikujiControlCommand: {
        return: {
          label: '処理を終了する(return)',
          description: 'シナリオを実行せず、このイベントの処理を終了',
        },
        continue: {
          label: '次のイベントへ進む(continue)',
          description: 'シナリオを実行せず、次のイベントへ進む',
        },
      },
      sound: {
        cute: 'ぽよん',
        bubble: 'ポコン',
        twinkle: 'キラキラ',
        bounce: 'ボヨン',
        jingle: 'ジングル',
        collect: '取得音',
        cash: 'お金チャリン',
        notification: '通知音',
        news: 'ニュース風',
        decision: '決定音',
        transition: 'トランジション',
        congrats: 'お祝い',
        fanfare: 'ファンファーレ',
        carnival: 'カーニバル',
        baseball: 'レベルアップ',
        warn: 'ブレーキ',
        cancel: 'キャンセル',
        negative: 'ざんねん',
        fail: '失敗',
        explosion: '爆発',
      },
    },
  },
  en: {
    mapText: {
      gameMeta: {
        GouseiSuika: {
          label: 'Watermelon Suika Generator',
          description: 'Mi Dou Technology - Omikuji inspired by Watermelon Suika Game',
        },
        CommentBot: {
          label: 'Comment Bot',
          description: 'Extension script that automatically posts comments to OneComme as the BOT',
        },
      },
      // Descriptions for game inputs and output variables (declared in src/games/scripts/**/meta.ts)
      gameParams: {
        GouseiSuika: {
          mode: { label: 'Mode', description: 'Fruit to play with' },
          life: { label: 'Life', description: 'Life of the game (1-99). Empty means 3' },
        },
        CommentBot: {
          theme: { label: 'Theme', description: 'Kind of comments to post' },
          name: { label: 'Poster name', description: 'Empty means random' },
          comments: { label: 'Comments', description: 'Comma-separated. Empty picks from the theme' },
          users: { label: 'Users', description: 'Number of posters (out-of-range values are clamped)' },
        },
      },
      gameOutputs: {
        GouseiSuika: { gouseisuika_points: 'Score' },
      },
      scenarioStepKind: {
        message: {
          label: 'Message',
          description: 'Sets the text sent to or displayed in OneComme and the generator',
        },
        sound: {
          label: 'Sound',
          description: 'Sets the sound effect or BGM played when the step runs',
        },
        wordParty: {
          label: 'WordParty',
          description: 'Calls the WordParty effect of OneComme',
        },
        variable: {
          label: 'Evaluation block',
          description: 'Runs variable assignment, calculation, and script evaluation',
        },
        gameScript: {
          label: 'Game script',
          description: 'Calls a prebuilt game',
        },
        scenarioCall: {
          label: 'Scenario',
          description: 'Calls a registered scenario (a named sequence of steps)',
        },
      },
      omikujiItemKind: {
        scenario: {
          label: 'Run scenario',
          description: 'Displays the content below in OneComme and the generator',
        },
        control: {
          label: 'Control flow',
          description: 'Controls the flow of processing without running any steps.',
        },
      },
      omikujiControlCommand: {
        return: {
          label: 'End processing (return)',
          description: 'Does nothing and ends processing for this event.',
        },
        continue: {
          label: 'Go to next event (continue)',
          description: 'Does nothing and moves on to the next event.',
        },
      },
      sound: {
        cute: 'Poyon',
        bubble: 'Pokon',
        twinkle: 'Sparkle',
        bounce: 'Boyon',
        jingle: 'Jingle',
        collect: 'Pickup',
        cash: 'Coin clink',
        notification: 'Notification',
        news: 'News-style',
        decision: 'Confirm',
        transition: 'Transition',
        congrats: 'Celebration',
        fanfare: 'Fanfare',
        carnival: 'Carnival',
        baseball: 'Level up',
        warn: 'Brake',
        cancel: 'Cancel',
        negative: 'Too bad',
        fail: 'Fail',
        explosion: 'Explosion',
      },
    },
  },
} as const
