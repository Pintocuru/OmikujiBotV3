// src/engine/OmikujiResult/ScenarioStepHandler.ts
import { ScenarioType, OmikujiDataType, ScenarioStepType, ScenarioStepVariableType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'

import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { BotMessageGenerator } from './BotMessageGenerator'
import { DisplayVariableResolver } from '@/engine/DisplayVariable/DisplayVariableResolver'
import { ContentPlaceholder } from '@/engine/ContentPlaceholder/processor'
import { PlaceholderContext } from '@/engine/ContentPlaceholder/context'
import { ScenarioCallExpander } from '@/engine/OmikujiResult/ScenarioCallExpander'
import { BotMessageType, ProcessedStep } from '@/types/generator'

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
   * steps処理
   */
  process(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    // ステップ展開とプレースホルダー置換
    const expandedActions = ScenarioCallExpander.expand(steps, this.scenarios)
    const resolvedActions = this.resolvePlaceholders(expandedActions, defaultPlaceholders)

    // 評価ブロック {{ }} の処理
    const processedActions: ProcessedStep[] = isOnecommePost
      ? this.generator.processVariables(resolvedActions) // 本番：計算して置換
      : this.generator.stripVariables(resolvedActions) // ダミー：計算せず除去

    // BotMessage 生成
    return this.generator.postAndGenerate(processedActions, omiken, isOnecommePost)
  }

  /**
   * control アイテムの variable (評価ブロック {{ }}) を評価
   */
  evaluateVariable(variable: string, defaultPlaceholders: Record<string, string | number>): void {
    const flow: ScenarioStepVariableType = { kind: 'variable', delaySeconds: 0, message: variable }
    const resolved = this.resolvePlaceholders([flow], defaultPlaceholders)
    this.generator.processVariables(resolved)
  }

  /**
   * 表示変数 [[key]] と <<placeholder>> を置換する
   */
  private resolvePlaceholders(
    actions: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>
  ): ScenarioStepType[] {
    const displayResolved = this.displayResolver.processSteps(actions)

    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    const resolved = this.placeProcess.processSteps(displayResolved)
    this.placeContext.clear()

    return resolved
  }

  /**
   *  評価ブロックは通さず、[[key]] と <<placeholder>> だけ置換する (gameScript の queryString 用)
   */
  resolveFlows(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>
  ): ScenarioStepType[] {
    return this.resolvePlaceholders(steps, defaultPlaceholders)
  }
}
