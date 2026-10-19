// src/editor/maps/OmikujiDataMaps.ts
// src/maps/OmikujiData 配下の Map の表示文言(label / description)の翻訳
// Map 本体(日本語)は generator など editor 外でも使うため残し、editor 側はここのキーを参照する
export const omikujiDataMapMessages = {
  ja: {
    mapText: {
      characterEmotion: {
        default: {
          label: 'デフォルト',
          description: '標準の表情',
        },
        happy: {
          label: '嬉しい',
          description: '喜んでいる表情',
        },
        surprised: {
          label: '驚き',
          description: '驚いている表情',
        },
        sad: {
          label: '悲しみ',
          description: '悲しんでいる表情',
        },
        angry: {
          label: '怒り',
          description: '怒っている表情',
        },
        thinking: {
          label: '考え中',
          description: '思案している表情',
        },
      },
      loopMotion: {
        none: {
          label: 'なし',
          description: 'ループアニメーションを適用しません',
        },
        bounce: {
          label: 'バウンド',
          description: '上下に跳ね続けるアニメーション',
        },
        shake: {
          label: '小刻みシェイク',
          description: '左右に小刻みに揺れるアニメーション',
        },
        swing: {
          label: '左右揺れ',
          description: 'ブランコのように左右に振れるアニメーション',
        },
        wobble: {
          label: '大きく揺れ',
          description: '全体が大きくゆがみながら揺れるアニメーション',
        },
        rotate: {
          label: '回転（時計回り）',
          description: '時計回りに回転し続けるアニメーション',
        },
        rotateR: {
          label: '逆回転',
          description: '反時計回りに回転し続けるアニメーション',
        },
        rubberBand: {
          label: 'ゴムバンド',
          description: 'ゴムのように伸び縮みするアニメーション',
        },
        jello: {
          label: 'ゼリー',
          description: 'ゼリーのようにぷるぷると揺れるアニメーション',
        },
        tilt: {
          label: '傾き',
          description: '左右に少し傾き続けるアニメーション',
        },
        headShake: {
          label: '首振り',
          description: '首を横に振るようなアニメーション',
        },
        pulse: {
          label: '点滅',
          description: 'ゆっくりと拡大縮小・明滅を繰り返すアニメーション',
        },
        flash: {
          label: '高速明滅',
          description: '素早く点滅を繰り返すアニメーション',
        },
        tada: {
          label: 'タダ！',
          description: '強調してアピールするように揺れるアニメーション',
        },
        combo: {
          label: 'よろこび',
          description: '喜びを表現する複合的なループアニメーション',
        },
        joyful: {
          label: 'ぴょこぴょこ',
          description: '楽しそうにぴょこぴょこと動くアニメーション',
        },
        gentle: {
          label: 'ゆったり（呼吸）',
          description: '深呼吸のようにゆったりと拡大縮小するアニメーション',
        },
      },
      gameMeta: {
        GouseiSuika: {
          name: 'スイカジェネレーター',
          description: '米兜科技 - 合成大西瓜風のおみくじ',
        },
        BomberSpin: {
          name: 'ボンバースロット',
          description: 'APPLI - BOMBERSPIN2風のおみくじ',
        },
        DwarfBomb: {
          name: 'うさぎスロット',
          description: 'Nolimit City - Fire in the Hole風のおみくじ',
        },
        MultiplyBonanza: {
          name: '桜吹雪スロット',
          description: 'Wing - FURAIJIN風のおみくじ',
        },
        GoogolClover: {
          name: 'グーゴルクローバー',
          description: 'Future Friends Games - CloverPit風のおみくじ',
        },
        HugEmAll: {
          name: 'ダンジョンスロット',
          description: 'Nolimit City - Kill Em All風のおみくじ',
        },
      },
      postFlowKind: {
        message: {
          label: 'メッセージ',
          description: 'わんコメやジェネレーターに送信・表示するテキストを設定します',
        },
        sound: {
          label: 'サウンド',
          description: 'アクション実行時に再生する効果音やBGMを設定します',
        },
        wordParty: {
          label: 'WordParty',
          description: 'わんコメの WordParty 演出を呼び出します',
        },
        variable: {
          label: '評価ブロック',
          description: '変数の代入や計算・スクリプト評価処理を実行します',
        },
        gameScript: {
          label: 'ゲームスクリプト',
          description: '予め作成されたゲームを呼び出します',
        },
        bot: {
          label: 'BOTちゃん',
          description: 'BOTキャラクターの立ち絵や表情・吹き出しの設定を変更します',
        },
        flowCall: {
          label: 'アクションセット',
          description: '登録済みのアクションセット（一連の処理プリセット）を呼び出します',
        },
      },
      omikujiItemKind: {
        postFlow: {
          label: 'BOTアクション',
          description: '下記の内容をわんコメやジェネレーターで表示します',
        },
        control: {
          label: '処理を制御する',
          description: 'BOTアクションを何もせず、処理の流れを制御します。',
        },
      },
      omikujiControlCommand: {
        return: {
          label: '処理を終了する(return)',
          description: 'BOTアクションを何もせず、このイベントで処理を終了します。',
        },
        continue: {
          label: '次のイベントへ進む(continue)',
          description: 'BOTアクションを何もせず、次のイベントへ処理を進めます。',
        },
      },
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
      displayMode: {
        comment: {
          label: 'わんコメでの表示+読み上げ',
          description: 'わんコメのコメント欄への投稿と音声読み上げの両方を行います',
        },
        voice: {
          label: '読み上げのみ',
          description: 'コメント投稿は行わず、音声読み上げのみを行います',
        },
        none: {
          label: 'なし',
          description: 'コメント投稿も音声読み上げも行いません',
        },
      },
      uiLayout: {
        commentBubble: {
          label: 'フキダシ',
          description: 'シンプルなフキダシでおみくじ結果を表示します。',
        },
      },
      uiKind: {
        commentBubble: {
          label: 'フキダシ',
          description: 'BOTの発言内容を吹き出し形式で表示します。',
        },
      },
      scope: {
        single: 'このイベント',
        category: '{category}全体',
      },
    },
  },
  en: {
    mapText: {
      characterEmotion: {
        default: {
          label: 'Default',
          description: 'Standard expression',
        },
        happy: {
          label: 'Happy',
          description: 'Happy expression',
        },
        surprised: {
          label: 'Surprised',
          description: 'Surprised expression',
        },
        sad: {
          label: 'Sad',
          description: 'Sad expression',
        },
        angry: {
          label: 'Angry',
          description: 'Angry expression',
        },
        thinking: {
          label: 'Thinking',
          description: 'Thoughtful expression',
        },
      },
      loopMotion: {
        none: {
          label: 'None',
          description: 'No looping animation is applied',
        },
        bounce: {
          label: 'Bounce',
          description: 'Animation that keeps bouncing up and down',
        },
        shake: {
          label: 'Small shake',
          description: 'Animation that shakes slightly left and right',
        },
        swing: {
          label: 'Side swing',
          description: 'Animation that swings left and right like a swing',
        },
        wobble: {
          label: 'Big wobble',
          description: 'Animation that wobbles with a large distortion',
        },
        rotate: {
          label: 'Rotate (clockwise)',
          description: 'Animation that keeps rotating clockwise',
        },
        rotateR: {
          label: 'Reverse rotation',
          description: 'Animation that keeps rotating counterclockwise',
        },
        rubberBand: {
          label: 'Rubber band',
          description: 'Animation that stretches and shrinks like rubber',
        },
        jello: {
          label: 'Jelly',
          description: 'Animation that jiggles like jelly',
        },
        tilt: {
          label: 'Tilt',
          description: 'Animation that keeps tilting slightly left and right',
        },
        headShake: {
          label: 'Head shake',
          description: 'Animation like shaking one\'s head',
        },
        pulse: {
          label: 'Pulse',
          description: 'Animation that slowly scales and fades in and out repeatedly',
        },
        flash: {
          label: 'Fast flash',
          description: 'Animation that flashes quickly and repeatedly',
        },
        tada: {
          label: 'Ta-da!',
          description: 'Animation that shakes as if to draw attention',
        },
        combo: {
          label: 'Joy',
          description: 'Composite looping animation expressing joy',
        },
        joyful: {
          label: 'Hopping',
          description: 'Animation that hops around cheerfully',
        },
        gentle: {
          label: 'Gentle (breathing)',
          description: 'Animation that scales slowly like a deep breath',
        },
      },
      gameMeta: {
        GouseiSuika: {
          name: 'Watermelon Suika Generator',
          description: 'Mi Dou Technology - Omikuji inspired by Watermelon Suika Game',
        },
        BomberSpin: {
          name: 'Bomber Slot',
          description: 'APPLI - Omikuji inspired by BOMBERSPIN2',
        },
        DwarfBomb: {
          name: 'Rabbit Slot',
          description: 'Nolimit City - Omikuji inspired by Fire in the Hole',
        },
        MultiplyBonanza: {
          name: 'Cherry Blossom Slot',
          description: 'Wing - Omikuji inspired by FURAIJIN',
        },
        GoogolClover: {
          name: 'Googol Clover',
          description: 'Future Friends Games - Omikuji inspired by CloverPit',
        },
        HugEmAll: {
          name: 'Dungeon Slot',
          description: 'Nolimit City - Omikuji inspired by Kill Em All',
        },
      },
      postFlowKind: {
        message: {
          label: 'Message',
          description: 'Sets the text sent to or displayed in OneComme and the generator',
        },
        sound: {
          label: 'Sound',
          description: 'Sets the sound effect or BGM played when the action runs',
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
        bot: {
          label: 'BOT-chan',
          description: 'Changes the BOT character\'s portrait, expression, and speech bubble settings',
        },
        flowCall: {
          label: 'Action set',
          description: 'Calls a registered action set (a preset of a series of actions)',
        },
      },
      omikujiItemKind: {
        postFlow: {
          label: 'BOT action',
          description: 'Displays the content below in OneComme and the generator',
        },
        control: {
          label: 'Control flow',
          description: 'Controls the flow of processing without any BOT action.',
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
      displayMode: {
        comment: {
          label: 'Show in OneComme + read aloud',
          description: 'Both posts to the OneComme comment list and reads aloud',
        },
        voice: {
          label: 'Read aloud only',
          description: 'Reads aloud only, without posting a comment',
        },
        none: {
          label: 'None',
          description: 'Neither posts a comment nor reads aloud',
        },
      },
      uiLayout: {
        commentBubble: {
          label: 'Speech bubble',
          description: 'Displays omikuji results in a simple speech bubble.',
        },
      },
      uiKind: {
        commentBubble: {
          label: 'Speech bubble',
          description: 'Displays BOT comments as speech bubbles.',
        },
      },
      scope: {
        single: 'This event',
        category: 'All {category}',
      },
    },
  },
} as const
