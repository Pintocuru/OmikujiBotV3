// src/console/game/OshikuraChain/scripts/nuisanceConstants.ts
// おしくらチェインの定数。マス目・時間の刻み・記録の名前は、ここだけを変える

// ---- マス目 (横長: 横 11 × 縦 8) ----
export const GRID_COLS = 11
export const GRID_ROWS = 8
/** 1マスの描画の大きさ (px。画面の大きさに合わせて、縮尺は自動で変わる) */
export const CELL_PX = 64

// ---- 時間 ----
/** シミュレーションの1刻み (秒)。1フレームの経過時間を、この刻みで進める */
export const STEP_SECONDS = 0.05
/** 1回の更新で進める刻みの上限 (安全装置。通常のフレームでは届かない) */
export const MAX_STEPS_PER_ADVANCE = 6000
/**
 * 1フレームで進めるゲーム内の時間の上限 (秒)。
 * ウィンドウが非表示の間は requestAnimationFrame が止まり、ゲームも止まる。再表示された最初のフレームで、
 * 止まっていた時間がまとめて進まないようにする (処理落ちしたときも同じ)
 */
export const MAX_FRAME_SECONDS = 0.25

/** 巨大化するユーザーの出現間隔 (秒) */
export const GIANT_INTERVAL_SECONDS = 120

// ---- 主人公 ----
/** 1マス動く間隔 (秒)。キーを押し続けている間、この間隔で動く */
export const HERO_MOVE_INTERVAL_SECONDS = 0.14
/** 初見さんのコメントで係数が戻ったことを、演出で知らせるのは、係数がこの値を下回っていたとき (わずかな下がりでは知らせない) */
export const COEFFICIENT_RESET_NOTICE_BELOW = 0.95
/** 画面の外へ押し出して得点したあと、次に動けるまでの間隔 (秒。クールダウン。得点のリズムになる) */
export const HERO_PUSH_INTERVAL_SECONDS = 0.5
/** 連鎖して押されるとき、1 つ後ろにつき動き出しを遅らせる秒数 (ウェーブ状に見せる。見た目だけで、位置は即座に変わる) */
export const PUSH_WAVE_DELAY_SECONDS = 0.15

// ---- アイコン (コメントした人) ----
/** アイコンが占めるマスの一辺の上限 (大きさの倍率を四捨五入して、1〜この値) */
export const MAX_FOOTPRINT = 3

// ---- コメントの文字 (ことば。ダメージなし・得点なし。押し出せて、時間が経つと消える) ----
/** 1 つの「ことば」に入れる文字数。コメントの文字数がこれを超えるごとに、1 つ増える */
export const WORD_CHARS_PER_ITEM = 5
/** 1 コメントから降ってくる「ことば」の上限 */
export const WORD_MAX_PER_COMMENT = 5
/** 同時に盤面にある「ことば」の上限。超えたら、古いものから (爆発させずに) 消す */
export const WORD_MAX = 30
/** 「ことば」が爆発するまでの時間 (秒)。この範囲でランダム (押されるたびに、最初の長さに戻る) */
export const WORD_SECONDS_MIN = 5
export const WORD_SECONDS_MAX = 20

// ---- ギフト障害物 (プレイヤーは取り除けない。ダメージはなく、通行と押し出しを妨げる) ----
/** 障害物が残る時間 (秒)。基本はこの秒数で、金額が大きいほど伸びる (OBSTACLE_SECONDS_FULL_PRICE 以上で最大) */
export const OBSTACLE_SECONDS = 15
export const OBSTACLE_SECONDS_MAX = 25
export const OBSTACLE_SECONDS_FULL_PRICE = 10000
/** 障害物を置いたあと、主人公が (敵を無視して) 動ける範囲がこのマス数を下回る場所には置かない (閉じ込め防止) */
export const MIN_HERO_REACHABLE_CELLS = 20
/** 同時に置ける障害物の数。超えたら、古いものから消す */
export const MAX_OBSTACLES = 5
/** 障害物が占めるマスの合計の上限 (盤面を埋めて、ゲームが成立しなくならないようにする) */
export const MAX_OBSTACLE_CELLS = 20
/** 金額と大きさ (一辺のマス数)。金額が大きいほど大きい。金額 0 (無料ギフトなど) も 1 マスで置く */
export const OBSTACLE_SIZE_TIERS: readonly { minPrice: number; size: number }[] = [
  { minPrice: 0, size: 1 },
  { minPrice: 500, size: 2 },
  { minPrice: 2000, size: 3 },
]

// ---- 記録 (GameLog) ----
/** ユーザーごとの貢献度 (その人のものが生んだ秒数) の eventKey。生存時間とは別のランキングにする */
export const CONTRIBUTION_EVENT_KEY = 'oshikuraChainSeconds'
/** ゲーム全体の生存時間の eventKey (貢献度とは別にして、ランキングを混ぜない) */
export const SURVIVAL_EVENT_KEY = 'oshikuraChainTime'
/** 生存時間の記録に使う、プレイヤー (配信者) の userId と表示名。ユーザーリストにはいない */
export const PLAYER_USER_ID = 'player'
export const PLAYER_USER_NAME = '配信者'

/** 設定をサーバーに保存するときの gameKey (ConsoleViewKey と同じ) */
export const CONFIG_GAME_KEY = 'oshikuraChain'
