// src/engine/GameScriptPlay/GameScriptManager.ts
import { ScriptClass, ScriptResult } from '@/games/types'
import { PostFlowGameType, ScriptGameKey, isScriptGameKey } from '@/types/OmikujiData'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { OmikenCommentType } from '@/types/OmikenComment'
import { getGameScriptLoader, getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'
import { GameStateType } from '@/types/api'
import { BuildMismatchError, reportDataMismatch } from '@/common/buildValidation/validateAgainstBuild'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}

  /** キャッシュ → なければ gameExecuteMap から動的 import で解決 */
  private async loadScript(scriptId: string): Promise<ScriptClass> {
    const cached = this.scriptInstances[scriptId]
    if (cached) return cached

    // 存在しない / このビルドに未登録 / 読み込み失敗は、すべて「データ不一致」として扱う
    const mismatch = new BuildMismatchError([{ type: 'gameScript', key: scriptId }])
    if (!isScriptGameKey(scriptId)) throw mismatch
    const loader = getGameScriptLoader(scriptId)
    if (!loader) throw mismatch
    let module: Awaited<ReturnType<typeof loader>>
    try {
      module = await loader()
    } catch {
      throw mismatch
    }

    const instance: ScriptClass = module.default
    this.scriptInstances[scriptId] = instance
    return instance
  }

  playScript = async (gameScripts: PostFlowGameType, omiken?: OmikenCommentType): Promise<ScriptResult | null> => {
    if (!gameScripts) return null
    const { scriptId, queryString, characterKey } = gameScripts
    if (!scriptId) return null

    try {
      const script = await this.loadScript(scriptId)
      // await しないと run が async の場合に例外を拾えない
      return await script.run(queryString, characterKey, omiken)
    } catch (error) {
      // データ不一致: 画面表示 + わんコメへのシステムメッセージ(コンソールエラーの代わり)
      if (error instanceof BuildMismatchError) {
        reportDataMismatch(error.unsupported, { display: 'toast', throttle: true })
        return null
      }
      console.error(`スクリプトエラー (${scriptId}):`, error)
      postSystemMessage(`❌ スクリプトエラー: ${error}`)
      return null
    }
  }

  async playSampleScript(scriptId: string, queryString: string): Promise<string> {
    if (!scriptId) return '(スクリプトが指定されていません)'

    let script: ScriptClass
    try {
      script = await this.loadScript(scriptId)
    } catch (error) {
      if (error instanceof BuildMismatchError) return error.message
      console.error(`スクリプトロードエラー (${scriptId}):`, error)
      return 'スクリプトが正常に稼働できません'
    }
    if (!script.sampleRun) return 'テストに対応していないスクリプトです'

    try {
      return await script.sampleRun(queryString)
    } catch (error) {
      return `スクリプト実行エラー(${scriptId}): ${error}`
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
  listAvailableScripts(): readonly ScriptGameKey[] {
    return getRegisteredGameScriptKeys()
  }
}
