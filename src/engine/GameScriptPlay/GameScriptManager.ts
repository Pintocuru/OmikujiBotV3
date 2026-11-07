// src/engine/GameScriptPlay/GameScriptManager.ts
import { ScriptClass, ScriptResult } from '@/games/types'
import { ScenarioStepGameScriptType, GameScriptKey, isGameScriptKey } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'
import { getGameScriptLoader, getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'
import { GameStateType } from '@/types/api'
import { BuildMismatchError, reportDataMismatch } from '@/common/buildValidation/validateAgainstBuild'
import { postSystemMessage } from '@/sdk/post/PostOneComme'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}

  /** キャッシュ → なければ gameExecuteMap から動的 import で解決 */
  private async loadScript(scriptKey: string): Promise<ScriptClass> {
    const cached = this.scriptInstances[scriptKey]
    if (cached) return cached

    // 存在しない / このビルドに未登録 / 読み込み失敗は、すべて「データ不一致」として扱う
    const mismatch = new BuildMismatchError([{ type: 'gameScript', key: scriptKey }])
    if (!isGameScriptKey(scriptKey)) throw mismatch
    const loader = getGameScriptLoader(scriptKey)
    if (!loader) throw mismatch
    let module: Awaited<ReturnType<typeof loader>>
    try {
      module = await loader()
    } catch {
      throw mismatch
    }

    const instance: ScriptClass = module.default
    this.scriptInstances[scriptKey] = instance
    return instance
  }

  playScript = async (
    gameScripts: ScenarioStepGameScriptType,
    omiken?: OmikenCommentType
  ): Promise<ScriptResult | null> => {
    if (!gameScripts) return null
    const { scriptKey, queryString, characterKey } = gameScripts
    if (!scriptKey) return null

    try {
      const script = await this.loadScript(scriptKey)
      // await しないと run が async の場合に例外を拾えない
      return await script.run(queryString, characterKey, omiken)
    } catch (error) {
      // データ不一致: 画面表示 + わんコメへのシステムメッセージ(コンソールエラーの代わり)
      if (error instanceof BuildMismatchError) {
        reportDataMismatch(error.unsupported, { display: 'toast', throttle: true })
        return null
      }
      console.error(`スクリプトエラー (${scriptKey}):`, error)
      postSystemMessage(`❌ スクリプトエラー: ${error}`)
      return null
    }
  }

  async playSampleScript(scriptKey: string, queryString: string): Promise<string> {
    if (!scriptKey) return '(スクリプトが指定されていません)'

    let script: ScriptClass
    try {
      script = await this.loadScript(scriptKey)
    } catch (error) {
      if (error instanceof BuildMismatchError) return error.message
      console.error(`スクリプトロードエラー (${scriptKey}):`, error)
      return 'スクリプトが正常に稼働できません'
    }
    if (!script.sampleRun) return 'テストに対応していないスクリプトです'

    try {
      return await script.sampleRun(queryString)
    } catch (error) {
      return `スクリプト実行エラー(${scriptKey}): ${error}`
    }
  }

  getGameState(targetKey: string): GameStateType | null {
    const instance = this.scriptInstances[targetKey]
    return instance?.getGameState?.() ?? null
  }

  reset(scriptKey: string): void {
    delete this.scriptInstances[scriptKey]
  }

  allReset(): void {
    this.scriptInstances = {}
  }

  // 利用可能なスクリプトID一覧(UIのセレクト用など)
  listAvailableScripts(): readonly GameScriptKey[] {
    return getRegisteredGameScriptKeys()
  }
}
