<!-- src/editor/apps/appItems/preview/ThresholdPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Filter class="w-3 h-3" />
      <span>{{ title }}</span>
    </div>

    <!-- conditions バッジ群 -->
    <div v-if="conditions.length" class="flex flex-wrap gap-1">
      <span v-for="cond in conditions" :key="cond" class="badge badge-xs" :class="conditionBadgeClass(cond)">
        {{ conditionLabel(cond) }}
      </span>
    </div>
    <div v-else class="text-xs opacity-40">{{ t('appPreview.threshold.none') }}</div>

    <!-- userName -->
    <div v-if="trigger.userName?.length" class="flex items-center gap-1 text-xs">
      <User class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">{{ t('appPreview.threshold.user') }}</span>
      <span class="truncate max-w-30">
        {{ trigger.userName.slice(0, 2).join(', ') }}
        <span v-if="trigger.userName.length > 2" class="opacity-50">+{{ trigger.userName.length - 2 }}</span>
      </span>
    </div>

    <!-- comment キーワード -->
    <div v-if="trigger.comment?.length" class="flex items-start gap-1 text-xs">
      <MessageSquare class="w-3 h-3 shrink-0 opacity-60 mt-0.5" />
      <div class="flex flex-wrap gap-1">
        <span v-for="kw in trigger.comment.slice(0, 3)" :key="kw" class="badge badge-xs badge-ghost font-mono">{{
          kw
        }}</span>
        <span v-if="trigger.comment.length > 3" class="text-xs opacity-50">+{{ trigger.comment.length - 3 }}</span>
      </div>
    </div>

    <!-- 判定式 -->
    <div v-if="trigger.expression" class="flex items-center gap-1 text-xs">
      <Sigma class="w-3 h-3 shrink-0 opacity-60" />
      <code class="truncate max-w-45 font-mono">{{ trigger.expression }}</code>
    </div>

    <!-- access / gift 件数バッジ -->
    <div v-if="trigger.access?.length || trigger.gift?.length" class="flex gap-1.5 text-xs">
      <div v-if="trigger.access?.length" class="flex items-center gap-1">
        <Shield class="w-3 h-3 opacity-60" />
        <span class="badge badge-xs badge-info">{{ t('appPreview.threshold.access', { n: trigger.access.length }) }}</span>
      </div>
      <div v-if="trigger.gift?.length" class="flex items-center gap-1">
        <Gift class="w-3 h-3 opacity-60" />
        <span class="badge badge-xs badge-warning">{{ t('appPreview.threshold.gift', { n: trigger.gift.length }) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { CommentTriggerType } from '@/types/OmikujiData'
  import { Filter, User, MessageSquare, Shield, Gift, Sigma } from 'lucide-vue-next'

  type TriggerLike = Partial<CommentTriggerType>

  const { t, te } = useI18n()

  const props = defineProps<{
    data: { trigger?: TriggerLike } | null
  }>()

  const title = computed(() => t('appPreview.threshold.title'))

  const trigger = computed<TriggerLike>(() => {
    if (!props.data) return {}
    return props.data.trigger ?? {}
  })

  const conditions = computed(() => trigger.value.conditions ?? [])

  function conditionLabel(cond: string) {
    const key = `appPreview.threshold.conditions.${cond}`
    return te(key) ? t(key) : cond
  }

  function conditionBadgeClass(cond: string) {
    const map: Record<string, string> = {
      syoken: 'badge-primary',
      count: 'badge-secondary',
      access: 'badge-info',
      gift: 'badge-warning',
      comment: 'badge-accent',
      userName: 'badge-neutral',
      expression: 'badge-success',
    }
    return map[cond] ?? 'badge-ghost'
  }
</script>
