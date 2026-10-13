<!-- src/editor/apps/appItems/preview/ActionSetPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-65">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <Zap class="w-3 h-3" />
        <span>アクションセット</span>
      </div>
      <span class="badge badge-xs badge-primary">{{ postFlows.length }}件</span>
    </div>

    <!-- 空 -->
    <div v-if="!postFlows.length" class="text-xs opacity-40 ml-1">アクション未設定</div>

    <!-- postFlows リスト（最大4件） -->
    <div v-for="(flow, i) in postFlows.slice(0, 4)" :key="i" class="flex items-center gap-1.5 text-xs ml-1">
      <!-- kind バッジ -->
      <span class="badge badge-xs shrink-0" :class="flowKindBadgeClass(flow.kind)">
        {{ flowKindLabel(flow.kind) }}
      </span>

      <!-- 遅延秒数（設定されている場合） -->
      <span v-if="flow.delaySeconds" class="badge badge-xs badge-ghost text-[10px] px-1 shrink-0">
        {{ flow.delaySeconds }}s
      </span>

      <!-- 各 kind 別のサマリー -->
      <!-- message / variable / bot: message 本文 -->
      <span v-if="hasPostFlowMessage(flow) && flow.message" class="truncate flex-1 opacity-80">
        {{ flow.message }}
      </span>

      <!-- message: characterKey -->
      <span
        v-if="flow.kind === 'message' && flow.characterKey"
        class="badge badge-xs badge-ghost shrink-0 max-w-20 truncate"
      >
        {{ flow.characterKey }}
      </span>

      <!-- sound: sound / soundPath -->
      <span v-if="flow.kind === 'sound' && (flow.sound || flow.soundPath)" class="truncate flex-1 opacity-80 font-mono">
        {{ flow.sound || flow.soundPath }}
      </span>

      <!-- wordParty: wordPartyId -->
      <span v-if="flow.kind === 'wordParty' && flow.wordPartyId" class="truncate flex-1 opacity-80 font-mono">
        {{ flow.wordPartyId }}
      </span>

      <!-- flowCall: 呼び出しキー数または内容 -->
      <span v-if="flow.kind === 'flowCall' && flow.callKeys?.length" class="opacity-70 truncate flex-1 text-xs">
        {{ formatCallKeys(flow.callKeys) }}
      </span>

      <!-- gameScript: scriptId -->
      <span v-if="flow.kind === 'gameScript' && flow.scriptId" class="truncate flex-1 opacity-80 font-mono">
        {{ flow.scriptId }}
      </span>
    </div>

    <!-- 省略表示 -->
    <div v-if="postFlows.length > 4" class="text-xs opacity-40 text-right">…他 {{ postFlows.length - 4 }} 件</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Zap } from 'lucide-vue-next'
  import { ActionSetType, PostFlowKind, PostFlowType, hasPostFlowMessage } from '@/types/OmikujiData'
  import { postFlowKindMap } from '@/maps/OmikujiData'

  const props = defineProps<{
    data: Partial<ActionSetType> | null
  }>()

  const postFlows = computed<PostFlowType[]>(() => props.data?.postFlows ?? [])

  function flowKindLabel(kind: PostFlowKind): string {
    const shortLabels: Partial<Record<PostFlowKind, string>> = {
      message: 'MSG',
      sound: 'SND',
      wordParty: 'WP',
      variable: 'VAR',
      gameScript: 'GAME',
      bot: 'BOT',
      flowCall: 'CALL',
    }
    return shortLabels[kind] ?? postFlowKindMap[kind]?.label ?? kind
  }

  function flowKindBadgeClass(kind: PostFlowKind): string {
    const classMap: Record<PostFlowKind, string> = {
      message: 'badge-primary',
      sound: 'badge-secondary',
      wordParty: 'badge-accent',
      variable: 'badge-warning',
      gameScript: 'badge-info',
      bot: 'badge-info',
      flowCall: 'badge-neutral',
    }
    return classMap[kind] ?? 'badge-ghost'
  }

  function formatCallKeys(keys: unknown[]): string {
    const first = keys[0]
    const keyStr = typeof first === 'string' ? first : (first as { content?: string })?.content ?? ''
    return keys.length > 1 ? `${keyStr} (+${keys.length - 1})` : keyStr
  }
</script>
