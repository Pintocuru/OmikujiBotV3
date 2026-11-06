// src/generator/GeneratorConstants.ts
// ジェネレーターの動作を決める数値をまとめる。値を変えるときは、ここだけを見ればよい。
// (単位は名前の末尾で示す: _MS = ミリ秒 / _COUNT = 回数)

/**
 * コメントに反応する期間 (ミリ秒)
 * 投稿からこの時間を過ぎたコメントには、おみくじで返信しない。
 * 再接続後などに届いた古いコメントへ、まとめて返信してしまうのを防ぐ。
 * (ユーザー統計と配信統計への記録には使わない。初回読み込みでも無視する)
 */
export const COMMENT_RESPONSE_WINDOW_MS = 10_000

/**
 * リアクションのバーストレベルが 1 段階下がるまでの時間 (ミリ秒)
 * リアクションが途切れてからこの時間が経つたびに、レベルが 1 つ下がる。
 */
export const BURST_DECAY_MS = 10_000

/**
 * LiveConsole で操作したユーザー統計を、サーバーから取り込む間隔 (ミリ秒)
 */
export const USER_STATS_POLL_INTERVAL_MS = 3000

/**
 * パッドの押下を、サーバーへ確認する間隔 (ミリ秒)
 */
export const PAD_POLL_INTERVAL_MS = 500

/**
 * タイマー(範囲指定)の待ち時間を決める刻み (ミリ秒)
 * 最小秒〜最大秒の間で、この刻みごとにランダムに選ぶ。
 */
export const TIMER_RANGE_STEP_MS = 500

/**
 * リアクションの履歴を残す件数の上限
 * 超えたら古いものから捨てる。
 */
export const REACTION_HISTORY_MAX = 5000

/**
 * 右下の通知を表示しておく時間 (ミリ秒)
 */
export const NOTICE_DISPLAY_MS = {
  cooldown: 3000,
  error: 5000,
} as const

/**
 * 配信中から非配信への切り替えを確認する回数
 * サービスメタは 0.5 秒ごとに取得する (間隔は src/sdk/subscribe/GetServiceMeta.ts の META_POLL_INTERVAL_MS)。この回数だけ連続して「配信していない」と取得できたときに、
 * 配信が終わったと判断する (一時的な取得の揺らぎで、配信開始リセットが走らないようにするため)。
 */
export const META_OFFLINE_CONFIRM_COUNT = 10

/**
 * 受け取り済みコメントの id を覚えておく件数の上限
 * 新しいコメントかどうかの判定に使う。超えたら古い id から忘れる。
 */
export const OMIKEN_ID_HISTORY_MAX = 20_000

/**
 * バーストレベルが上がる条件 (レベル 0→1、1→2、2→3 の順)
 * 「最大ピーク速度 × この割合」の数のリアクションが、次のレベルに上がるまでに必要。
 */
export const BURST_LEVEL_THRESHOLDS = [0.25, 0.5, 0.75] as const

/**
 * バーストレベルの判定に使うピーク速度の下限 (リアクション/秒)
 * リアクションが少ない配信で、わずかな数でレベルが上がらないようにする。
 */
export const BURST_PEAK_RATE_FLOOR = 30

/**
 * バーストレベルの最大値
 */
export const BURST_MAX_LEVEL = 3

/**
 * ピーク速度を計算するときの、リアクション間隔の上限 (秒)
 * 間隔が空いたあとの 1 件が、極端に大きな速度にならないようにする。
 */
export const PEAK_RATE_ELAPSED_CAP_SEC = 5
