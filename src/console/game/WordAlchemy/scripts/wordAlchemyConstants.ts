// src/console/game/WordAlchemy/scripts/wordAlchemyConstants.ts
// 言葉の錬金術の定数。マス目・鍋の位置・時間は、ここだけを変える

// ---- マス目 (横 12 × 縦 8。どちらも偶数なので、2 × 2 の鍋がちょうど中央に置ける) ----
export const GRID_COLS = 12
export const GRID_ROWS = 8
/** 1マスの描画の大きさ (px。画面の大きさに合わせて、縮尺は自動で変わる) */
export const CELL_PX = 64

// ---- 鍋 (2 × 2 マスの障害物。左上のマス。0 始まり) ----
export const POT_SIZE = 2
export const POT_COL = GRID_COLS / 2 - 1
export const POT_ROW = GRID_ROWS / 2 - 1
/** 煮込みが始まる材料の数 */
export const POT_INGREDIENTS = 3
/** 煮込みの最短時間 (秒)。結果が先に届いても、この時間は待つ */
export const BREW_SECONDS = 5
/** 完成した名前を鍋の上に出しておく時間 (秒) */
export const RESULT_SHOW_SECONDS = 3

// ---- 主人公 ----
export const HERO_START = { col: 2, row: 3 }
/** 1マス動く間隔 (秒)。キーを押し続けている間、この間隔で動く */
export const HERO_MOVE_INTERVAL_SECONDS = 0.14
/** 連鎖して押されるとき、1 つ後ろにつき動き出しを遅らせる秒数 (ウェーブ状に見せる。位置は即座に変わる) */
export const PUSH_WAVE_DELAY_SECONDS = 0.15
/** 1マスの移動・押し出しの見た目にかける時間 (秒) */
export const MOVE_ANIM_SECONDS = 0.15

// ---- ことば (コメントの文字) ----
/** 1 つの「ことば」に入れる文字数 */
export const WORD_CHARS_PER_ITEM = 5
/** 1 コメントから降ってくる「ことば」の上限 */
export const WORD_MAX_PER_COMMENT = 5
/** 同時に盤面にある「ことば」の上限。超えたら、古いものから消す */
export const WORD_MAX = 30
/** 降ってくる演出 (秒と、盤面の上へはみ出すマス数) */
export const FALL_SECONDS = 0.45
export const FALL_EXTRA_CELLS = 1

// ---- コメントオートモード (実コメントの代わりに、一定間隔で架空のコメントを入れる) ----
export const AUTO_COMMENT_INTERVAL_SECONDS = 5
export const AUTO_COMMENT_USER_COUNT = 50

// ---- 完成品の判定 ----
/** 完成品の名前の長さの上限 (文字数) */
export const NAME_MAX_LENGTH = 12
/** 名前に、材料になくても使ってよい記号 (許可リスト。材料の文字数には数えない) */
export const NAME_FREE_CHARS = '・'
/** AI の出力の検証に失敗したときの、やり直しの上限 (それでも失敗したら Mock にフォールバック) */
export const ALCHEMY_MAX_RETRIES = 2
