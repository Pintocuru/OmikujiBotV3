// src/console/game/NuisanceSurvival/render/OshikuraChainAudio.ts
// 効果音の読み込み・再生。盤面の描画やゲーム進行から独立させる。
import { Sound } from 'excalibur'
import { getSoundPath } from '@/common/AppEnv'
import { resolveAsset } from '@/common/sounds'
import { MAX_CONCURRENT_PER_SOUND, SOUND_FILES, SOUND_FOLDER, type SoundKey } from './stageSounds'

export class OshikuraChainAudio {
  /** 読み込めた効果音 (素材がないものは null。一度だけ試して、再試行しない) */
  private readonly sounds = new Map<SoundKey, Sound | null>()
  private audio: AudioContext | null = null

  constructor() {
    this.loadSounds()
  }

  dispose(): void {
    void this.audio?.close().catch(() => undefined)
    this.audio = null
  }

  private loadSounds(): void {
    for (const key of Object.keys(SOUND_FILES) as SoundKey[]) {
      const url = resolveAsset(getSoundPath(SOUND_FOLDER + SOUND_FILES[key].file))
      const sound = new Sound({ paths: [url], maxConcurrentTracks: MAX_CONCURRENT_PER_SOUND })
      sound
        .load()
        .then(() => this.sounds.set(key, sound))
        .catch(() => {
          // 素材がなくても、音が鳴らないだけでゲームは動く
          this.sounds.set(key, null)
          console.warn(`[OshikuraChain] 効果音を読み込めませんでした: ${url}`)
        })
    }
  }

  play(key: SoundKey): void {
    const sound = this.sounds.get(key)
    if (sound) {
      void sound.play({ volume: SOUND_FILES[key].volume })
    } else if (sound === null && key === 'wordBlast') {
      // 素材 (word-blast.mp3) がなければ、ブラウザの音で代わりに鳴らす
      this.playBlastFallback()
    }
  }

  /** 爆発の代わりの音: 低く落ちていく音と、短いノイズ (素材なし) */
  private playBlastFallback(): void {
    try {
      const audio = (this.audio ??= new AudioContext())
      if (audio.state === 'suspended') void audio.resume()
      const now = audio.currentTime
      const length = 0.5
      const noise = audio.createBuffer(1, Math.floor(audio.sampleRate * length), audio.sampleRate)
      const data = noise.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
      const source = audio.createBufferSource()
      source.buffer = noise
      const filter = audio.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1800, now)
      filter.frequency.exponentialRampToValueAtTime(200, now + length)
      const noiseGain = audio.createGain()
      noiseGain.gain.setValueAtTime(0.5, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + length)
      source.connect(filter).connect(noiseGain).connect(audio.destination)
      source.start(now)

      const boom = audio.createOscillator()
      const boomGain = audio.createGain()
      boom.type = 'sine'
      boom.frequency.setValueAtTime(170, now)
      boom.frequency.exponentialRampToValueAtTime(38, now + length)
      boomGain.gain.setValueAtTime(0.5, now)
      boomGain.gain.exponentialRampToValueAtTime(0.0001, now + length)
      boom.connect(boomGain).connect(audio.destination)
      boom.start(now)
      boom.stop(now + length + 0.02)
    } catch {
      // 音が出せなくても、ゲームは動く
    }
  }

  /** 音階の音 (素材なし。三角波を、短く鳴らす)。音が出せない環境では、鳴らないだけでゲームは動く */
  playNote(frequency: number, delaySeconds: number): void {
    try {
      const audio = (this.audio ??= new AudioContext())
      if (audio.state === 'suspended') void audio.resume()
      const start = audio.currentTime + Math.max(0, delaySeconds)
      const length = 0.28
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.22, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + length)
      oscillator.connect(gain).connect(audio.destination)
      oscillator.start(start)
      oscillator.stop(start + length + 0.02)
    } catch {
      // 音が出せなくても、ゲームは動く
    }
  }
}
