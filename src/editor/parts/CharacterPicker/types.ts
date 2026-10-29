// src/editor/parts/CharacterPicker/types.ts
export type IconItem = { key: string; label: string; layers: string[] }

export type CharacterItem = {
  key: string
  name: string
  icons: IconItem[]
  defaultKey: string
  defaultLayers: string[]
}

export type SelectPayload = { characterKey: string; iconKey?: string }
