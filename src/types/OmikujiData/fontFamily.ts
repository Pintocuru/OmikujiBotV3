// src/types/MetaMaps/FontFamilyMaps.ts
import { z } from 'zod'

/**
 * フォントファミリーの種類（Array-first SSoT）
 */
export const fontFamilies = [
  // システム
  'default',
  // ゴシック・サンセリフ系
  'notoSansJp',
  'mplus1p',
  'mplus2',
  'bizUdGothic',
  'lineSeedJp',
  // 丸ゴシック
  'kosugiMaru',
  'mplusRounded1c',
  'kiwiMaru',
  // 明朝・セリフ系
  'notoSerifJp',
  'shipporiMincho',
  'kaiseiDecol',
  'zenOldMincho',
  'zenAntique',
  // 手書き・カジュアル系
  'hachiMaruPop',
  'yuseiMagic',
  'zenKurenaido',
  'kleeOne',
  'yujiMai',
  'newTegomin',
  // 装飾・ディスプレイ系
  'dotGothic',
  'wdxlLubrifont',
  'pottaOne',
  'mochiyPop',
  'rocknrollOne',
  'reggaeOne',
  'rampartOne',
  'stick',
  'delaGothicOne',
] as const

// スキーマと型の定義
export const FontFamilySchema = z.enum(fontFamilies).default('default').catch('default')
export type FontFamilyType = z.infer<typeof FontFamilySchema>
