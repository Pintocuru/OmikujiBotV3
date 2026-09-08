// src/sdk/control/StopSpeech.ts
import { api } from "../client";

/**
 * 音声合成（Speech）を停止
 */
export async function stopSpeech(): Promise<void> {
  try {
    await api.delete("/speech");
  } catch (error) {
    console.error("スピーチの停止に失敗しました", error);
    throw error;
  }
}
