// src/engine/OmikujiResult/ScenarioStepHandler.ts
import { ScenarioType, OmikujiDataType, ScenarioStepType, ScenarioStepVariableType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'

import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { BotMessageGenerator } from './BotMessageGenerator'
import { DisplayVariableResolver } from '@/engine/DisplayVariable/DisplayVariableResolver'
import { ContentPlaceholder } from '@/engine/ContentPlaceholder/processor'
import { PlaceholderContext } from '@/engine/ContentPlaceholder/context'
import { ScenarioCallExpander } from '@/engine/OmikujiResult/ScenarioCallExpander'
import { BotMessageType } from '@/types/generator'

export class ScenarioStepHandler {
  private readonly displayResolver: DisplayVariableResolver
  private readonly placeProcess: ContentPlaceholder
  private readonly placeContext: PlaceholderContext = new PlaceholderContext()
  private readonly scenarios: Record<string, ScenarioType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly variable: PlaceholderVariableType,
    private readonly generator: BotMessageGenerator
  ) {
    this.displayResolver = new DisplayVariableResolver(this.variable)
    this.placeProcess = new ContentPlaceholder(omikujiData.assets.placeholders)
    this.scenarios = omikujiData.assets.scenarios
  }

  /**
   * シナリオ開始からの実行時刻(delaySeconds)順のタイムラインに展開する。
   * - scenarioCall は抽選して展開し、子の delaySeconds には呼び出し側の delaySeconds が加算される
   * - 同じ時刻は展開順を保つ (Array.sort は安定ソート)
   * - 最大階層で展開しきれなかった scenarioCall は捨てる (遅延実行時に再展開されて、際限なく続くのを防ぐ)
   */
  buildTimeline(steps: ScenarioStepType[]): ScenarioStepType[] {
    return ScenarioCallExpander.expand(steps, this.scenarios)
      .filter((step) => step.kind !== 'scenarioCall')
      .sort((a, b) => a.delaySeconds - b.delaySeconds)
  }

  /**
   * steps処理
   */
  process(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): BotMessageType[] {
    const expandedSteps = ScenarioCallExpander.expand(steps, this.scenarios)

    // 1 ステップずつ、置換 → (variable なら)評価の順に進める。前のステップが更新した変数を、後のステップの [[key]] が読めるように
    const preparedSteps = expandedSteps.map((step) => {
      const [resolved] = this.resolvePlaceholders([step], defaultPlaceholders)
      this.generator.evaluateVariableStep(resolved)
      return resolved
    })

    // BotMessage 生成
    return this.generator.postAndGenerate(preparedSteps, omiken)
  }

  /**
   * control アイテムの variable (評価ブロック) を評価
   */
  evaluateVariable(variable: string, defaultPlaceholders: Record<string, string | number>): void {
    const step: ScenarioStepVariableType = { kind: 'variable', delaySeconds: 0, message: variable }
    const [resolved] = this.resolvePlaceholders([step], defaultPlaceholders)
    this.generator.evaluateVariableStep(resolved)
  }

  /**
   * <<placeholder>> → 表示変数 [[key]] の順に置換する
   * (先に <<>> を置換するので、[[anygame_<<userId>>]] のように変数名にも <<>> を使える。
   *  逆に <<subCategory_[[subRand]]>> のように、<<>> の ID 内の [[key]] だけは <<>> の置換時に変数値へ置き換える)
   */
  private resolvePlaceholders(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>
  ): ScenarioStepType[] {
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    // <<id_[[変数名]]>> の [[変数名]] は、このステップの時点の変数値で置き換える
    this.placeProcess.updateVariables(this.variable.getAll())
    const placeholderResolved = this.placeProcess.processSteps(steps)
    this.placeContext.clear()

    return this.displayResolver.processSteps(placeholderResolved)
  }

  /**
   *  variable の評価は行わず、<<placeholder>> と [[key]] だけ置換する (gameScript の queryString 用)
   */
  resolveSteps(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>
  ): ScenarioStepType[] {
    return this.resolvePlaceholders(steps, defaultPlaceholders)
  }
}
