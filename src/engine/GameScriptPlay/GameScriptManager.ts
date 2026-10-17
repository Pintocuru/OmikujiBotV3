// src/engine/GameScriptPlay/GameScriptManager.ts
import { GameStateType, ScriptClass, ScriptResult } from '@/games/types'
import { PostFlowGameType, ScriptGameKey, isScriptGameKey } from '@/types/OmikujiData'
import { UserManager } from '@/generator/stores/UserManager/UserManager'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { OmikenCommentType } from '@/types/OmikenComment'
import { getGameScriptLoader, getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}
  private static instance: GameScriptManager | null = null
  private userManager?: UserManager

  static getInstance() {
    if (!this.instance) this.instance = new GameScriptManager()
    return this.instance
  }

  /** キャッシュ → なければ gameExecuteMap から動的 import で解決 */
  private async loadScript(scriptId: string): Promise<ScriptClass> {
    const cached = this.scriptInstances[scriptId]
    if (cached) return cached

    if (!isScriptGameKey(scriptId)) throw new Error(`スクリプト "${scriptId}" は存在しません`)
    const loader = getGameScriptLoader(scriptId)
    if (!loader) throw new Error(`スクリプト "${scriptId}" はこのビルドに含まれていません`)
    const module = await loader()

    const instance: ScriptClass = module.default
    if (this.userManager && instance.initialize) {
      instance.initialize(this.userManager)
    }
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

  setVisitManager(userSession: UserManager) {
    this.userManager = userSession
    Object.values(this.scriptInstances).forEach((instance) => {
      if (typeof instance.initialize === 'function') {
        instance.initialize(userSession)
      }
    })
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
