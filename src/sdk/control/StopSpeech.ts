// src/sdk/control/StopSpeech.ts
import { api } from '@/sdk/client'

/**
 * 音声合成（Speech）を停止
 * TODO: 将来的に、OmikujiBotV3に「行き過ぎたコメント読み上げ」を検知して停止させる機能を追加する際に使用する。今は未使用。
 */
export async function stopSpeech(): Promise<void> {
  try {
    await api.delete('/speech')
  } catch (error) {
    console.error('スピーチの停止に失敗しました', error)
    throw error
  }
}
