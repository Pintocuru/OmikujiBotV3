// src/i18n/editor/maps/ScenarioMapMessages.ts
export const scenarioMapMessages = {
  ja: {
    mapText: {
      gameMeta: {
        GouseiSuika: {
          label: 'スイカジェネレーター',
          description: '米兜科技 - 合成大西瓜風のおみくじ',
        },
        BomberSpin: {
          label: 'ボンバースロット',
          description: 'APPLI - BOMBERSPIN2風のおみくじ',
        },
        DwarfBomb: {
          label: 'うさぎスロット',
          description: 'Nolimit City - Fire in the Hole風のおみくじ',
        },
        MultiplyBonanza: {
          label: '桜吹雪スロット',
          description: 'Wing - FURAIJIN風のおみくじ',
        },
        GoogolClover: {
          label: 'グーゴルクローバー',
          description: 'Future Friends Games - CloverPit風のおみくじ',
        },
        HugEmAll: {
          label: 'ダンジョンスロット',
          description: 'Nolimit City - Kill Em All風のおみくじ',
        },
        FortuneRanking: {
          label: '占いランキング',
          description: '果物などの順位を作成する拡張スクリプト',
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
        BomberSpin: {
          symbol: { label: '絵柄', description: '指定する絵柄。空欄なら指定なし' },
          spin: { label: 'スピン数', description: '3〜8。空欄なら指定なし' },
        },
        DwarfBomb: {
          mode: {
            label: '開始時のアイテム',
            description: '最初のドワーフが持つアイテム。空欄なら、なしで始まります',
          },
        },
        MultiplyBonanza: {
          mode: { label: 'モード', description: '空欄なら通常' },
        },
        HugEmAll: {
          mode: {
            label: 'モード',
            description:
              '空欄: 通常 / lucky: 初期体力+1・クリティカル確率UP / berserker: ダメージ2倍・体力消費2倍 / shield: 体力消費なし・ダメージ半減',
          },
        },
        FortuneRanking: {
          projectName: { label: 'プロジェクト名', description: '変数名の頭に付く名前。空欄なら fortune' },
          fruits: {
            label: '項目',
            description: '「ラベル:キー」をカンマ区切りで指定 (例: いちご:strawberry,ぶどう:grape)。空欄なら既定の10種',
          },
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
        BomberSpin: { bomberspin_payout: '獲得額' },
        DwarfBomb: { dwarfbomb_payout: '獲得額', dwarfbomb_day: '経過日数' },
        MultiplyBonanza: { multiplybonanza_payout: '獲得額' },
        HugEmAll: { hugemall_payout: '獲得額' },
        GoogolClover: { googolclover_score: '得点' },
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
        BomberSpin: {
          label: 'Bomber Slot',
          description: 'APPLI - Omikuji inspired by BOMBERSPIN2',
        },
        DwarfBomb: {
          label: 'Rabbit Slot',
          description: 'Nolimit City - Omikuji inspired by Fire in the Hole',
        },
        MultiplyBonanza: {
          label: 'Cherry Blossom Slot',
          description: 'Wing - Omikuji inspired by FURAIJIN',
        },
        GoogolClover: {
          label: 'Googol Clover',
          description: 'Future Friends Games - Omikuji inspired by CloverPit',
        },
        HugEmAll: {
          label: 'Dungeon Slot',
          description: 'Nolimit City - Omikuji inspired by Kill Em All',
        },
        FortuneRanking: {
          label: 'Fortune Ranking',
          description: 'Extension script that creates rankings (e.g. fruits)',
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
        BomberSpin: {
          symbol: { label: 'Symbol', description: 'Symbol to specify. Empty means not specified' },
          spin: { label: 'Spins', description: '3-8. Empty means not specified' },
        },
        DwarfBomb: {
          mode: {
            label: 'Starting item',
            description: 'Item the first dwarf starts with. Leave empty to start with none',
          },
        },
        MultiplyBonanza: {
          mode: { label: 'Mode', description: 'Empty means normal' },
        },
        HugEmAll: {
          mode: {
            label: 'Mode',
            description:
              'Empty: normal / lucky: +1 starting HP, higher crit chance / berserker: 2x damage, 2x HP cost / shield: no HP cost, half damage',
          },
        },
        FortuneRanking: {
          projectName: { label: 'Project name', description: 'Prefix of the variable names. Empty means fortune' },
          fruits: {
            label: 'Items',
            description: 'Comma-separated "label:key" (e.g. apple:apple,grape:grape). Empty uses the 10 defaults',
          },
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
        BomberSpin: { bomberspin_payout: 'Payout' },
        DwarfBomb: { dwarfbomb_payout: 'Payout', dwarfbomb_day: 'Days elapsed' },
        MultiplyBonanza: { multiplybonanza_payout: 'Payout' },
        HugEmAll: { hugemall_payout: 'Payout' },
        GoogolClover: { googolclover_score: 'Score' },
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
