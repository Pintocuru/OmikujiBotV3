// src/console/game/WordAlchemy/render/WordAlchemyAudio.ts
// 効果音の読み込み・再生。盤面の描画やゲーム進行から独立させる
import { Sound } from 'excalibur'
import { getSoundPath } from '@/common/AppEnv'
import { resolveAsset } from '@/common/sounds'
import { MAX_CONCURRENT_PER_SOUND, SOUND_FILES, type SoundKey } from './stageSounds'

export class WordAlchemyAudio {
  /** 読み込めた効果音 (素材がないものは null。一度だけ試して、再試行しない) */
  private readonly sounds = new Map<SoundKey, Sound | null>()

  constructor() {
    for (const key of Object.keys(SOUND_FILES) as SoundKey[]) {
      const url = resolveAsset(getSoundPath(`core/${SOUND_FILES[key].file}`))
      const sound = new Sound({ paths: [url], maxConcurrentTracks: MAX_CONCURRENT_PER_SOUND })
      sound
        .load()
        .then(() => this.sounds.set(key, sound))
        .catch(() => {
          // 素材がなくても、音が鳴らないだけでゲームは動く
          this.sounds.set(key, null)
          console.warn(`[WordAlchemy] 効果音を読み込めませんでした: ${url}`)
        })
    }
  }

  play(key: SoundKey): void {
    const sound = this.sounds.get(key)
    if (sound) void sound.play({ volume: SOUND_FILES[key].volume })
  }
}
