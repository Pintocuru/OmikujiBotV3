// src/common/UserIconMarkup/userIconMarkup.ts

/**
 * 本文中にユーザーアイコンを差し込む位置を表す、内部用の目印。
 *
 * - <<user>> のプレースホルダーが作る (DefaultPlaceholderBuilder)
 * - 表示側の UI が、アイコン画像に置き換える (useFilteredBotMessages など)
 * - わんコメへの投稿・判定式では、取り除く
 *
 * エディターで書く記法ではないので、形式を変えるときはこのファイルだけ直せばよい。
 */
const MARKUP_SOURCE = String.raw`\{\{icon\s+([^}]+)\}\}`

/** ユーザーアイコンの目印を作る */
export const createUserIconMarkup = (userId: string): string => `{{icon ${userId}}}`

/** 目印を、userId を使った文字列に置き換える */
export const replaceUserIconMarkup = (text: string, replacer: (userId: string) => string): string =>
  text.replace(new RegExp(MARKUP_SOURCE, 'g'), (_match, userId: string) => replacer(userId.trim()))

/** 目印をすべて取り除く */
export const stripUserIconMarkup = (text: string): string => replaceUserIconMarkup(text, () => '')

/** 先頭にある目印だけを取り除く (<<user>> の値から、表示名だけを取り出す用) */
export const stripLeadingUserIconMarkup = (text: string): string => text.replace(new RegExp(`^${MARKUP_SOURCE}`), '')
