// src/maps/OmikujiData/FontFamilyMap.ts
import { FontFamilyType } from '@/types/OmikujiData/fontFamily'

/**
 * フォント情報のUI表示マップ
 */
export const fontFamilyMap: Record<
  FontFamilyType,
  {
    className: string
    googleFontsUrl: string | null
    category: 'gothic' | 'rounded' | 'mincho' | 'handwriting' | 'display' | null
    locales: string[]
  }
> = {
  // ───── システム ─────
  default: {
    className: '',
    googleFontsUrl: null,
    category: null,
    locales: ['ja'],
  },

  // ───── ゴシック・サンセリフ系 ─────
  notoSansJp: {
    className: 'font-noto-sans-jp',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@500&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  mplus1p: {
    className: 'font-mplus-1p',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@600&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  mplus2: {
    className: 'font-mplus-2',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@600&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  bizUdGothic: {
    className: 'font-biz-ud-gothic',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=BIZ+UDGothic:wght@700&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },
  lineSeedJp: {
    className: 'font-line-seed-jp',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=LINE+Seed+JP_OTF:wght@700&display=swap',
    category: 'gothic',
    locales: ['ja'],
  },

  // 丸ゴシック
  kosugiMaru: {
    className: 'font-kosugi-maru',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap',
    category: 'rounded',
    locales: ['ja'],
  },
  mplusRounded1c: {
    className: 'font-mplus-rounded-1c',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap',
    category: 'rounded',
    locales: ['ja'],
  },
  kiwiMaru: {
    className: 'font-kiwi-maru',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kiwi+Maru&display=swap',
    category: 'rounded',
    locales: ['ja'],
  },

  // ───── 明朝・セリフ系 ─────
  notoSerifJp: {
    className: 'font-noto-serif-jp',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@600&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  shipporiMincho: {
    className: 'font-shippori-mincho',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  kaiseiDecol: {
    className: 'font-kaisei-decol',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@500&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  zenOldMincho: {
    className: 'font-zen-old-mincho',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@600&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },
  zenAntique: {
    className: 'font-zen-antique',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Zen+Antique&display=swap',
    category: 'mincho',
    locales: ['ja'],
  },

  // ───── 手書き・カジュアル系 ─────
  hachiMaruPop: {
    className: 'font-hachi-maru-pop',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  yuseiMagic: {
    className: 'font-yusei-magic',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  zenKurenaido: {
    className: 'font-zen-kurenaido',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  kleeOne: {
    className: 'font-klee-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Klee+One:wght@600&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  yujiMai: {
    className: 'font-yuji-mai',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Yuji+Mai&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },
  newTegomin: {
    className: 'font-new-tegomin',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap',
    category: 'handwriting',
    locales: ['ja'],
  },

  // ───── 装飾・ディスプレイ系 ─────
  dotGothic: {
    className: 'font-dot-gothic',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DotGothic16&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  wdxlLubrifont: {
    className: 'font-wdxl-lubrifont',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+JP+N&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  pottaOne: {
    className: 'font-potta-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Potta+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  mochiyPop: {
    className: 'font-mochiy-pop',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  rocknrollOne: {
    className: 'font-rocknroll-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  reggaeOne: {
    className: 'font-reggae-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Reggae+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  rampartOne: {
    className: 'font-rampart-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Rampart+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  stick: {
    className: 'font-stick',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Stick&display=swap',
    category: 'display',
    locales: ['ja'],
  },
  delaGothicOne: {
    className: 'font-dela-gothic-one',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
    category: 'display',
    locales: ['ja'],
  },
}
