// src/games/types/GameScriptMetaTypes.ts

// エディターの入力欄の宣言(queryString の1項目につき1つ)
export type GameInputField =
  | {
      key: string
      type: 'enum'
      options: readonly string[] // '' は「指定なし」として扱う
      default: string
    }
  | { key: string; type: 'number'; min?: number; max?: number; default?: number }
  | { key: string; type: 'text'; default?: string }

// ゲームが実行時に書き込む変数 (後続ステップで [[name]] として表示できる)
export interface GameOutputVariable {
  name: string // 変数名(ユーザー別のときは末尾に _<userId> が付く)
  perUser: boolean
  label?: string // 入力値で変わる変数など、i18n に書けないときの説明
}

// ゲームスクリプトの入出力の宣言
export interface GameScriptMeta {
  inputs: readonly GameInputField[]
  outputs: readonly GameOutputVariable[]
  // 入力値で名前が変わる変数 (例: FortuneRanking)。values は parseQueryFields で得た宣言済みキーの値
  dynamicOutputs?: (values: Record<string, string>) => GameOutputVariable[]
}
