// src/engine/GameScriptPlay/GameScriptManager.ts
import { ScriptClass } from '@/games/types'
import { getScriptEntry } from '@/games/registry'
import { UserManager } from '@/generator/stores/UserManager/UserManager'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { OmikenCommentType } from '@/types/OmikenComment'

export class GameScriptManager {
  private scriptInstances: Record<string, ScriptClass> = {}
  private static instance: GameScriptManager | null = null
  private userManager?: UserManager

  static getInstance() {
    if (!this.instance) this.instance = new GameScriptManager()
    return this.instance
  }

  /** キャッシュ → なければレジストリから解決（同期） */
  private loadScript(scriptId: string): ScriptClass | null {
    const cached = this.scriptInstances[scriptId]
    if (cached) return cached

    const entry = getScriptEntry(scriptId)
    if (!entry) {
      throw new Error(`スクリプト "${scriptId}" が登録されていません(index.htmlの読み込みを確認)`)
    }

    const instance = typeof entry === 'function' ? entry() : entry
    if (this.userManager && 'initialize' in instance) {
      instance.initialize(this.userManager)
    }
    this.scriptInstances[scriptId] = instance
    return instance
  }

  playScript = async (gameScripts: GameScriptsType, omiken?: OmikenCommentType): Promise<ScriptResult | null> => {
    if (!gameScripts) return null
    const { scriptId, queryString, characterKey } = gameScripts
    if (!scriptId) return null

    try {
      const script = this.loadScript(scriptId)
      if (!script) return null
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

    let script: ScriptClass | null
    try {
      script = this.loadScript(scriptId)
    } catch (error) {
      console.error(`スクリプトロードエラー (${scriptId}):`, error)
      return 'スクリプトが正常に稼働できません'
    }
    if (!script?.sampleRun) return 'テストに対応していないスクリプトです'

    try {
      return await script.sampleRun(queryString)
    } catch (error) {
      return `スクリプト実行エラー(${scriptId}): ${error}`
    }
  }

  setVisitManager(userSession: UserManager) {
    this.userManager = userSession
    Object.values(this.scriptInstances).forEach((instance) => {
      if ('initialize' in instance && typeof instance.initialize === 'function') {
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

  /** 登録済みスクリプトID一覧(UIのセレクト用など) */
  listAvailableScripts(): string[] {
    return Object.keys(window.__GAME_SCRIPTS__ ?? {})
  }
}
