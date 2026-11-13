// src/ui/LiverBingo/composables/useLiverBingoSound.ts
import { playSoundResolved } from '@/common/sounds'

/** assets/sounds/ からの相対パス */
const SOUND_DIR = '2026-Q4/LiverBingo/'

const SOUND_FILES = {
  click: '決定ボタンを押す12.mp3',
  hover: '決定ボタンを押す2.mp3',
  reset: 'ゲージ回復3.mp3',
  cheers: '歓声と拍手.mp3',
  single: '「おめでとうございます」.mp3',
  multi1: '「すごいすごい」.mp3',
  multi2: '「エクセレント」.mp3',
} as const

type SoundName = keyof typeof SOUND_FILES

const play = (name: SoundName) => playSoundResolved('', SOUND_DIR + SOUND_FILES[name])

export const useLiverBingoSound = () => ({
  click: () => play('click'),
  hover: () => play('hover'),
  reset: () => play('reset'),
  cheers: () => play('cheers'),
  single: () => play('single'),
  /** 2 ライン以上のとき(2 種類からランダム) */
  multi: () => play(Math.random() < 0.5 ? 'multi1' : 'multi2'),
})
