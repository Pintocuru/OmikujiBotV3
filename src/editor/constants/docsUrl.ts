// src/editor/constants/docsUrl.ts

// ヘルプ(docs 配下の md)の公開先。リポジトリの docs/ と同じ構造
const DOCS_BLOB_BASE = 'https://github.com/Pintocuru/OmikujiBotV3/blob/main/docs'

const docsUrl = (path: string): string => `${DOCS_BLOB_BASE}/${path}`

/** 判定式(コメントの発動条件) */
export const TRIGGER_EXPRESSION_HELP_URL = docsUrl('core/ConfigEditor/sub/TriggerExpression.md')

/** タイマーの動作条件(判定式) */
export const TIMER_CONDITION_HELP_URL = docsUrl('core/ConfigEditor/sub/TimerCondition.md')
