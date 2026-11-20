// src/console/game/NuisanceSurvival/scripts/nuisanceConstants.ts
// 邪魔者サバイバルの定数。マス目・時間の刻み・記録の名前は、ここだけを変える

// ---- マス目 (横長: 横 11 × 縦 8) ----
export const GRID_COLS = 11
export const GRID_ROWS = 8
/** 1マスの描画の大きさ (px。画面の大きさに合わせて、縮尺は自動で変わる) */
export const CELL_PX = 64

// ---- 時間 ----
/** シミュレーションの1刻み (秒)。隠れていた間の分は、この刻みで追いつく */
export const STEP_SECONDS = 0.05
/** 1回の更新で進める刻みの上限。長く離席したあとでも、画面が固まらないようにする (残りは次の更新で進める) */
export const MAX_STEPS_PER_ADVANCE = 6000
/** 画面が隠れて requestAnimationFrame が止まっても進められるよう、タイマーでも更新する間隔 (ミリ秒) */
export const PUMP_INTERVAL_MS = 100

// ---- 主人公 ----
/** 1マス動く間隔 (秒)。キーを押し続けている間、この間隔で動く */
export const HERO_MOVE_INTERVAL_SECONDS = 0.14
/** 押すのをやめたとき、押した時間が減る速さ (1秒あたりに減る秒数の倍率) */
export const PUSH_DECAY_RATE = 1.5

// ---- 邪魔者 ----
/** 邪魔者の大きさ (倍率) の上限 */
export const MAX_SIZE_SCALE = 3.4
/** 邪魔者が占めるマスの一辺の上限 (大きさの倍率を四捨五入して、1〜この値) */
export const MAX_FOOTPRINT = 3

// ---- 記録 (GameLog) ----
/** ユーザーごとの貢献度 (ダメージ) の eventKey */
export const DAMAGE_EVENT_KEY = 'nuisanceSurvival'
/** ゲーム全体の生存時間の eventKey (貢献度とは別にして、ランキングを混ぜない) */
export const SURVIVAL_EVENT_KEY = 'nuisanceSurvivalTime'
/** 生存時間の記録に使う、プレイヤー (配信者) の userId と表示名。ユーザーリストにはいない */
export const PLAYER_USER_ID = 'player'
export const PLAYER_USER_NAME = '配信者'

/** 設定をサーバーに保存するときの gameKey (ConsoleViewKey と同じ) */
export const CONFIG_GAME_KEY = 'nuisanceSurvival'
