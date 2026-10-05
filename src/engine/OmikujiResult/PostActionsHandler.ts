// src/engine/OmikujiResult/PostActionsHandler.ts
import { ActionSetType, OmikujiDataType } from '@/types/OmikujiData/'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { BotMessageGenerator } from './BotMessageGenerator'
import { DisplayVariableResolver } from '../DisplayVariable/DisplayVariableResolver'
import { ContentPlaceholder } from '../ContentPlaceholder/processor'
import { PlaceholderContext } from '../ContentPlaceholder/context'
import { OmikenCommentType } from '@/types/OmikenComment'
import { BotMessageType, ProcessedPostAction } from '@/generator/types'
import { FlowCallExpander } from '../OmikujiProcess/FlowCallExpander'

export class PostActionsHandler {
  private readonly displayResolver: DisplayVariableResolver
  private readonly placeProcess: ContentPlaceholder
  private readonly placeContext: PlaceholderContext = new PlaceholderContext()
  private readonly actionSets: Record<string, ActionSetType>

  constructor(
    omikujiData: OmikujiDataType,
    variable: PlaceholderVariableType,
    private readonly generator: BotMessageGenerator
  ) {
    this.displayResolver = new DisplayVariableResolver(variable)
    this.placeProcess = new ContentPlaceholder(omikujiData.assets.placeholders)
    this.actionSets = omikujiData.assets.actions
  }

  /**
   * postActions処理
   */
  process(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    // 1. アクション展開とプレースホルダー置換
    const expandedActions = FlowCallExpander.expand(actionItem.postFlows, this.actionSets)
    const displayResolved = this.displayResolver.processPostActions(expandedActions)

    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    const resolvedActions = this.placeProcess.processPostActions(displayResolved)
    this.placeContext.clear()

    // 2. 評価ブロック {{ }} の処理
    const processedActions: ProcessedPostAction[] = isOnecommePost
      ? this.generator.processVariables(resolvedActions) // 本番：計算して置換
      : this.generator.stripVariables(resolvedActions) // ダミー：計算せず除去

    // 3. BotMessage 生成
    return this.generator.postAndGenerate(processedActions, omiken, isOnecommePost)
  }
}
