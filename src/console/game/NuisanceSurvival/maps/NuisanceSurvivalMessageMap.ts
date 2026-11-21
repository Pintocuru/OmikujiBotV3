// src/console/game/NuisanceSurvival/maps/NuisanceSurvivalMessageMap.ts
// 邪魔者サバイバル画面の文言 (日本語)。画面のコンポーネントは、文字をここから取る。
// i18n 化するときは、この map を翻訳ファイルに置き換える (関数の項目は、引数つきの文言)。
import type { ConfigPresetId, NuisanceConfigKey } from '../scripts/nuisanceConfig'
import type { NuisanceKind } from '../scripts/nuisanceTraits'

export const nuisanceSurvivalMessages = {
  title: '邪魔者サバイバル',
  bar: {
    openHint: 'クリックでメニューを開く',
    life: 'ライフ',
    nuisances: (count: number, max: number) => `邪魔者 ${count} / ${max}`,
    removed: (count: number) => `取り除いた ${count}`,
  },
  menu: {
    description: 'コメントした人は「邪魔者」になって居残り、ライフを減らし続けます。取り除いて、長く生き残りましょう',
    howTo: 'WASD で移動 / 邪魔者にぶつかったまま押し続けると取り除けます',
    start: 'スタート',
    config: 'コンフィグ',
    close: '閉じる',
    resetConfig: '初期値に戻す',
    configNote: '変更は、スタートしたときに保存されます',
    configLoadError: (message: string) => `設定を読み込めませんでした (初期値で始めます): ${message}`,
    configSaveError: (message: string) => `設定を保存できませんでした: ${message}`,
    offline: 'サーバーに接続できません。設定は保存されず、結果も記録できません',
  },
  config: {
    fields: {
      startLife: { label: '最大ライフ', unit: '', hint: '' },
      maxNuisances: { label: '邪魔者の上限', unit: '体', hint: '超えたコメントは無視します' },
      growthMultiplier: {
        label: '成長の倍率',
        unit: '倍',
        hint: '次の間隔ごとに、邪魔者の大きさにこの倍率が掛かります',
      },
      growthIntervalSeconds: { label: '成長の間隔', unit: '秒', hint: '' },
      drainMultiplier: { label: 'ダメージの倍率', unit: '倍', hint: 'ライフの減る速さと、爆発のダメージ' },
      pushMultiplier: { label: '取り除きにくさ', unit: '倍', hint: '大きいほど、押し続ける時間が長くなります' },
      specialRate: {
        label: '特殊能力の頻度',
        unit: '%',
        hint: '動く・爆発する邪魔者の割合。それ以外は動きません',
      },
      bossInterval: {
        label: 'ボスの間隔',
        unit: 'コメントごと',
        hint: '配信枠のコメント数がこの数の倍数のとき、ボスが出ます。0 ならボスは出ません',
      },
    } satisfies Record<NuisanceConfigKey, { label: string; unit: string; hint: string }>,
    presetsTitle: 'プリセット',
    presets: {
      endurance: { label: '耐久配信向け', hint: '長時間、のんびり' },
      tenMinutes: { label: '10分耐久', hint: '標準的な難しさ' },
      merciless: { label: '情け無用組み手', hint: '短期決戦。特殊能力だらけ' },
    } satisfies Record<ConfigPresetId, { label: string; hint: string }>,
  },
  comments: {
    connecting: 'わんコメに接続中…',
    error: 'わんコメに接続できません。コメントが邪魔者になりません',
    retry: '再接続',
  },
  kinds: {
    static: 'じっとしている',
    wanderer: 'ふらふら',
    evader: 'にげる',
    creeper: 'すりよる',
    bouncer: 'はねる',
    bomber: 'ばくだん',
    boss: 'ボス',
  } satisfies Record<NuisanceKind, string>,
  result: {
    title: 'ゲームオーバー',
    survived: '生存時間',
    removed: (count: number) => `取り除いた邪魔者: ${count} 体`,
    ranking: 'ダメージを与えた人',
    damage: (damage: number) => `${damage} ダメージ`,
    none: '記録はありません',
    again: 'もう一度',
    toMenu: 'メニューへ',
  },
  record: {
    saving: '結果を記録中…',
    saved: (streamId: string) => `結果を GameLog に記録しました (${streamId})`,
    error: (message: string) => `結果を記録できませんでした: ${message}`,
    retry: '再試行',
  },
  test: {
    title: 'テストコメント',
    expectedUsers: '想定ユーザー数',
    people: (count: number) => `${count}人`,
    pickMode: { even: '均等', regular: '常連あり' },
    interval: '間隔 (秒)',
    send: '送信',
    auto: '自動',
    stop: '停止',
    burst: '×10',
    sent: (count: number) => `${count} 件送信`,
    unavailable: '投稿先の枠がありません (わんコメで枠を追加してください)',
    hint: 'H キーで、この表示を隠す / 戻す',
  },
} as const
