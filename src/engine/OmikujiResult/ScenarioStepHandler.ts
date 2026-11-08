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
    variable: PlaceholderVariableType,
    private readonly generator: BotMessageGenerator
  ) {
    this.displayResolver = new DisplayVariableResolver(variable)
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
    // ステップ展開とプレースホルダー置換
    const expandedSteps = ScenarioCallExpander.expand(steps, this.scenarios)
    const resolvedSteps = this.resolvePlaceholders(expandedSteps, defaultPlaceholders)

    // 評価ブロック {{ }} の処理
    const processedActions = this.generator.processVariables(resolvedSteps)

    // BotMessage 生成
    return this.generator.postAndGenerate(processedActions, omiken)
  }

  /**
   * control アイテムの variable (評価ブロック {{ }}) を評価
   */
  evaluateVariable(variable: string, defaultPlaceholders: Record<string, string | number>): void {
    const step: ScenarioStepVariableType = { kind: 'variable', delaySeconds: 0, message: variable }
    const resolved = this.resolvePlaceholders([step], defaultPlaceholders)
    this.generator.processVariables(resolved)
  }

  /**
   * 表示変数 [[key]] と <<placeholder>> を置換する
   */
  private resolvePlaceholders(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>
  ): ScenarioStepType[] {
    const displayResolved = this.displayResolver.processSteps(steps)

    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    const resolved = this.placeProcess.processSteps(displayResolved)
    this.placeContext.clear()

    return resolved
  }

  /**
   *  評価ブロックは通さず、[[key]] と <<placeholder>> だけ置換する (gameScript の queryString 用)
   */
  resolveSteps(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>
  ): ScenarioStepType[] {
    return this.resolvePlaceholders(steps, defaultPlaceholders)
  }
}
