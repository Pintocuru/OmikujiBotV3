// src/games/types/GameScriptBase.t
// !廃止(ユーザーマネージャーを介さない)
import { UserManager } from '@/generator/stores/UserManager/UserManager'

// store のマネージャ呼び出し
export abstract class GameScriptBase {
  protected userManager?: UserManager

  // 初期化メソッド(GameScriptManagerから呼ばれる)
  initialize(userSession?: UserManager) {
    this.userManager = userSession
  }
}
