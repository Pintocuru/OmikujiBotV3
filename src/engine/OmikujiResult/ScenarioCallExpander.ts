// src/engine/OmikujiResult/ScenarioCallExpander.ts
import { drawByWeight } from '@/engine/DrawOmikuji/DrawOmikuji'
import { showErrorNotice } from '@/generator/scripts/Notice/showNotice'
import {
  ScenarioType,
  handelNormalizedValues,
  ScenarioStepCallType,
  ScenarioStepType,
  sortedStepsFromRecord,
} from '@/types/OmikujiData/'

export class ScenarioCallExpander {
  private static readonly MAX_DEPTH = 10

  static expand(
    steps: ScenarioStepType[],
    scenarios: Record<string, ScenarioType>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): ScenarioStepType[] {
    if (depth >= this.MAX_DEPTH) {
      const msg = `シナリオの展開が最大階層(${this.MAX_DEPTH})に達しました`
      console.warn(msg)
      showErrorNotice(msg)
      return steps
    }

    const expandedSteps: ScenarioStepType[] = []

    for (const step of steps) {
      // scenarioCallなら呼び出して展開
      if (step.kind === 'scenarioCall') {
        const calledSteps = this.expandSingleScenarioCall(step, scenarios, depth, visited)
        expandedSteps.push(...calledSteps)
      } else {
        expandedSteps.push(step)
      }
    }

    return expandedSteps
  }

  /**
   *
   */
  private static expandSingleScenarioCall(
    callStep: ScenarioStepCallType,
    scenarios: Record<string, ScenarioType>,
    depth: number,
    visited: Set<string>
  ): ScenarioStepType[] {
    // 抽選を行う
    const normalized = handelNormalizedValues(callStep.callKeys)
    const targetKeyObject = drawByWeight(normalized)
    if (!targetKeyObject) return []
    const targetKey = targetKeyObject.content

    // 循環参照チェック
    if (visited.has(targetKey)) {
      const msg = `循環参照が検出されました: ${targetKey}`
      console.error(msg)
      showErrorNotice(msg)
      return []
    }

    // 展開
    const targetScenario = scenarios[targetKey]
    if (!targetScenario) {
      const msg = `シナリオ "${targetKey}" が見つかりません`
      console.error(msg)
      showErrorNotice(msg)
      return []
    }

    const newVisited = new Set(visited)
    newVisited.add(targetKey)

    const adjustedSteps = this.adjustDelays(sortedStepsFromRecord(targetScenario.steps), callStep.delaySeconds)

    return this.expand(adjustedSteps, scenarios, depth + 1, newVisited)
  }

  private static adjustDelays(steps: ScenarioStepType[], baseDelay: number): ScenarioStepType[] {
    return steps.map((step) => ({
      ...step,
      delaySeconds: (step.delaySeconds || 0) + baseDelay,
    }))
  }
}
