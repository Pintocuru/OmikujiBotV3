// src/console/game/WordAlchemy/maps/WordAlchemyMessageMap.ts
// 画面に出す文言
export const wordAlchemyMessages = {
  title: '言葉の錬金術',
  hint: 'WASD で動いて、ことばを鍋へ押し込もう',
  pot: '鍋',
  startLive: 'スタート',
  startAuto: 'コメントオートで試す',
  bar: {
    auto: 'オート',
    abort: 'やめる',
    abortConfirm: 'もう一度押してやめる',
    /** ゲーム中に鍋を変えると、鍋の中身は捨てる */
    potChange: '鍋を変えると、入っている材料は捨てられます',
  },
  codex: {
    title: '図鑑',
    open: '図鑑',
    discovered: (found: number, total: number) => `発見 ${found}/${total}`,
    close: '閉じる',
    reset: 'リセット',
    resetConfirm: 'すべての鍋の図鑑を削除します (元に戻せません)',
    resetDo: '削除する',
    resetCancel: 'やめる',
    /** 図鑑のホバー (tooltip) の見出し: 材料のことばと、それを出した視聴者 */
    materials: '素材元',
    offline: '図鑑を保存できません',
    discarded: '保存されていた図鑑を読めなかったので、初期化しました',
  },
  /** すでに図鑑にある枠へ、また同じアイテムが出たときの、新旧の選択 */
  replace: {
    title: 'すでに図鑑にあるアイテムです。どちらを残しますか?',
    old: '図鑑にあるもの',
    next: '今回のもの',
    keepOld: '古いほうを残す',
    useNew: '新しいほうにする',
    hint: '選ばずに閉じると、古いほうが残ります',
    close: '閉じる (古いほうを残す)',
  },
  ai: {
    title: 'AI の設定',
    open: 'AI の設定',
    close: '閉じる',
    noteFallback: 'メインが上限超過・エラーのときは、自動でサブに切り替えます。',
    noteMock: 'どちらも使えないときは、規則ベースの Mock で続けます。',
    noteKey: 'API キーは、この PC のサーバーにだけ保存します。保存したあとは画面に出さず、ログにも残しません。',
    slot: { main: 'メイン', sub: 'サブ (メインが使えないときの予備)' },
    provider: '種類',
    providers: { openai: 'OpenAI 互換 API', anthropic: 'Anthropic' },
    baseUrl: 'ベース URL',
    model: 'モデル',
    apiKey: 'API キー',
    keyNew: 'API キーを入力',
    keySaved: (hint: string) => `保存済み (${hint})。変更するときだけ入力`,
    save: '保存',
    saved: '保存しました',
    needFields: (slot: string) => `${slot}: ベース URL とモデルを入力してください`,
    needKey: (slot: string) => `${slot}: API キーを入力してください`,
    /** 上部バーの、AI の状態の表示 */
    status: {
      main: 'AI (メイン)',
      sub: 'AI (サブ)',
      mock: 'Mock',
      failed: 'Mock (AI 失敗)',
      limited: 'Mock (上限超過)',
    },
    usage: (ai: number, mock: number) => `AI ${ai} 回 / Mock ${mock} 回`,
  },
  recordFailed: 'ゲームログを保存できません',
  category: { A: '生物', B: '食物', C: '道具', D: 'ガラクタ' },
  outcome: { new: '新種発見！', known: '既発見' },
  /** 闇鍋が引いた鍋を、完成のときに明かす (煮込み中は伏せる) */
  potReveal: (label: string) => `${label}だった`,
  /** 材料が揃ったときの、煮込みの確認 (どの鍋でも同じ文言) */
  confirm: { question: 'この内容で煮込みますか?', yes: '煮込む', no: 'やめる', yesKey: 'Enter', noKey: 'Esc' },
  /** 分類と色に合うアイテムがなく、抽選できなかったときに、ランダムで 1 つ出す */
  lost: [
    '魔法のように消えてしまった！',
    '煙になって、どこかへ飛んでいった…',
    '鍋の底に溶けてしまった！',
    'まぶしく光って、跡形もなく消えた！',
  ],
  comments: { connecting: 'コメント接続中…', error: 'コメントに接続できません', retry: '再接続' },
} as const
