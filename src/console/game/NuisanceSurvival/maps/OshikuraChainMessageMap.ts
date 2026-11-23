// src/console/game/NuisanceSurvival/maps/NuisanceSurvivalMessageMap.ts
// おしくらチェイン画面の文言 (日本語)。画面のコンポーネントは、文字をここから取る。
// i18n 化するときは、この map を翻訳ファイルに置き換える (関数の項目は、引数つきの文言)。
import type { ConfigPresetId, NuisanceConfigKey } from '../scripts/nuisanceConfig'
import type { NuisanceKind } from '../scripts/nuisanceTraits'

export const oshikuraChainMessages = {
  title: 'おしくらチェイン',
  bar: {
    openHint: 'クリックでメニューを開く',
    timeLeft: '残り時間',
    coefficient: (value: number) => `係数 ×${value.toFixed(2)}`,
    chain: (count: number, total: string) => (count > 0 ? `${count} 連鎖 / TOTAL +${total}秒` : `${count} 連鎖`),
    elapsed: (clock: string) => `経過 ${clock}`,
    nuisances: (count: number, max: number) => `アイコン ${count} / ${max}`,
  },
  menu: {
    description:
      'コメントした人のアイコンと、コメントの文字が降ってきます。画面の外へ押し出すと、残り時間が増えます。並べて連続で押し出すほど、連鎖で大きく増えます',
    howTo:
      'WASD で移動 / ぶつかると押し出せます。画面の端の外まで押し出すと得点です。得点しない動きをすると、連鎖が切れます',
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
      maxSeconds: {
        label: '残り時間の上限',
        unit: '秒',
        hint: 'ゲームは、この時間から始まります。時間は 1 秒ごとに 1 秒減り、押し出すと増えます (これ以上は増えません)',
      },
      iconSeconds: {
        label: 'アイコンの獲得秒数',
        unit: '秒',
        hint: '押し出したときに得る基本の秒数 (連鎖数と係数が掛かります)',
      },
      wordSeconds: {
        label: 'ことばの獲得秒数',
        unit: '秒',
        hint: '押し出したときに得る基本の秒数 (連鎖数と係数が掛かります)',
      },
      coefficientDropPerMinute: {
        label: '係数の下がり方',
        unit: '%/分',
        hint: '1 分ごとに、係数がこの割合ずつ下がります。初見さんのコメントが届くと、1 に戻ります',
      },
      coefficientFloorPercent: { label: '係数の下限', unit: '%', hint: 'これより下がりません' },
      maxNuisances: {
        label: 'アイコンの上限',
        unit: '個',
        hint: '超えたコメントのアイコンは出ません (ことばは降ります)',
      },
      bossInterval: {
        label: 'ボスの間隔',
        unit: 'コメントごと',
        hint: '配信枠のコメント数がこの数の倍数のとき、ボスが出ます。0 ならボスは出ません',
      },
    } satisfies Record<NuisanceConfigKey, { label: string; unit: string; hint: string }>,
    presetsTitle: 'プリセット',
    presets: {
      endurance: { label: '耐久配信向け', hint: '30 分の持ち時間。係数がゆっくり下がる' },
      tenMinutes: { label: '標準', hint: '15 分の持ち時間' },
      merciless: { label: '情け無用組み手', hint: '短期決戦。係数がすぐ下がる' },
    } satisfies Record<ConfigPresetId, { label: string; hint: string }>,
  },
  comments: {
    connecting: 'わんコメに接続中…',
    error: 'わんコメに接続できません。コメントがアイコンになりません',
    retry: '再接続',
  },
  kinds: {
    static: 'アイコン',
    boss: 'ボス',
  } satisfies Record<NuisanceKind, string>,
  result: {
    title: 'ゲームオーバー',
    survived: '生存時間',
    bestChain: (count: number) => `最大 ${count} 連鎖`,
    removed: (icons: number, words: number) => `押し出し: アイコン ${icons} 個 / ことば ${words} 個`,
    ranking: '時間を生んだ人',
    seconds: (seconds: number) => `+${seconds} 秒`,
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
