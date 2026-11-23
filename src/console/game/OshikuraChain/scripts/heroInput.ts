// src/console/game/OshikuraChain/scripts/heroInput.ts
// WASD の入力 (押している順の配列) から、主人公の進む向きを決める (純粋関数)

export type HeroInput = { dx: -1 | 0 | 1; dy: -1 | 0 | 1 }
export const NO_INPUT: HeroInput = { dx: 0, dy: 0 }

/** KeyboardEvent.code で見る (IME が入っていても、キーボードの配列が違っても同じ位置のキーとして扱える) */
const KEY_DIRECTIONS: Readonly<Record<string, HeroInput>> = {
  KeyW: { dx: 0, dy: -1 },
  KeyA: { dx: -1, dy: 0 },
  KeyS: { dx: 0, dy: 1 },
  KeyD: { dx: 1, dy: 0 },
}

export const isMoveKey = (code: string): boolean => code in KEY_DIRECTIONS

/** 押している順 (後に押したものが後ろ) のキーから、向きを決める。斜めには動かず、最後に押したキーが優先 */
export const resolveInput = (heldCodes: readonly string[]): HeroInput => {
  for (let i = heldCodes.length - 1; i >= 0; i--) {
    const direction = KEY_DIRECTIONS[heldCodes[i]]
    if (direction) return direction
  }
  return NO_INPUT
}
