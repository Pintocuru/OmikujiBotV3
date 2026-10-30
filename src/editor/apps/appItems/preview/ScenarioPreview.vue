<!-- src/editor/apps/appItems/preview/ScenarioPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-65">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <Zap class="w-3 h-3" />
        <span>{{ t('appPreview.scenario.title') }}</span>
      </div>
      <span class="badge badge-xs badge-primary">{{ t('appPreview.count', { n: steps.length }) }}</span>
    </div>

    <!-- 空 -->
    <div v-if="!steps.length" class="text-xs opacity-40 ml-1">{{ t('appPreview.scenario.empty') }}</div>

    <!-- steps リスト（最大4件） -->
    <div v-for="(step, i) in steps.slice(0, 4)" :key="i" class="flex items-center gap-1.5 text-xs ml-1">
      <!-- kind バッジ -->
      <span class="badge badge-xs shrink-0" :class="stepKindBadgeClass(step.kind)">
        {{ stepKindLabel(step.kind) }}
      </span>

      <!-- 遅延秒数（設定されている場合） -->
      <span v-if="step.delaySeconds" class="badge badge-xs badge-ghost text-[10px] px-1 shrink-0">
        {{ step.delaySeconds }}s
      </span>

      <!-- 各 kind 別のサマリー -->
      <!-- message / variable: message 本文 -->
      <span v-if="hasScenarioStepMessage(step) && step.message" class="truncate flex-1 opacity-80">
        {{ step.message }}
      </span>

      <!-- message: characterKey -->
      <span
        v-if="step.kind === 'message' && step.characterKey"
        class="badge badge-xs badge-ghost shrink-0 max-w-20 truncate"
      >
        {{ step.characterKey }}
      </span>

      <!-- sound: sound / soundPath -->
      <span v-if="step.kind === 'sound' && (step.sound || step.soundPath)" class="truncate flex-1 opacity-80 font-mono">
        {{ step.sound || step.soundPath }}
      </span>

      <!-- wordParty: wordPartyId -->
      <span v-if="step.kind === 'wordParty' && step.wordPartyId" class="truncate flex-1 opacity-80 font-mono">
        {{ step.wordPartyId }}
      </span>

      <!-- scenarioCall: 呼び出しキー数または内容 -->
      <span v-if="step.kind === 'scenarioCall' && step.callKeys?.length" class="opacity-70 truncate flex-1 text-xs">
        {{ formatCallKeys(step.callKeys) }}
      </span>

      <!-- gameScript: scriptId -->
      <span v-if="step.kind === 'gameScript' && step.scriptId" class="truncate flex-1 opacity-80 font-mono">
        {{ step.scriptId }}
      </span>
    </div>

    <!-- 省略表示 -->
    <div v-if="steps.length > 4" class="text-xs opacity-40 text-right">
      {{ t('appPreview.more', { n: steps.length - 4 }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { Zap } from 'lucide-vue-next'
  import { ScenarioType, ScenarioStepKind, ScenarioStepType, hasScenarioStepMessage } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    data: Partial<ScenarioType> | null
  }>()

  const steps = computed<ScenarioStepType[]>(() => props.data?.steps ?? [])

  function stepKindLabel(kind: ScenarioStepKind): string {
    const shortLabels: Partial<Record<ScenarioStepKind, string>> = {
      message: 'MSG',
      sound: 'SND',
      wordParty: 'WP',
      variable: 'VAR',
      gameScript: 'GAME',
      scenarioCall: 'CALL',
    }
    return shortLabels[kind] ?? t(`mapText.scenarioStepKind.${kind}.label`)
  }

  function stepKindBadgeClass(kind: ScenarioStepKind): string {
    const classMap: Record<ScenarioStepKind, string> = {
      message: 'badge-primary',
      sound: 'badge-secondary',
      wordParty: 'badge-accent',
      variable: 'badge-warning',
      gameScript: 'badge-info',
      scenarioCall: 'badge-neutral',
    }
    return classMap[kind] ?? 'badge-ghost'
  }

  function formatCallKeys(keys: unknown[]): string {
    const first = keys[0]
    const keyStr = typeof first === 'string' ? first : ((first as { content?: string })?.content ?? '')
    return keys.length > 1 ? `${keyStr} (+${keys.length - 1})` : keyStr
  }
</script>
