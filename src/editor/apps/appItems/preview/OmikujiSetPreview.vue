<!-- src/editor/apps/appItems/preview/OmikujiSetPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <ListChecks class="w-3 h-3" />
        <span>{{ t('appPreview.omikuji.title') }}</span>
      </div>
      <span class="badge badge-xs badge-primary">{{ t('appPreview.count', { n: omikuji.length }) }}</span>
    </div>

    <!-- 空 -->
    <div v-if="!omikuji.length" class="text-xs opacity-40">{{ t('appPreview.omikuji.empty') }}</div>

    <!-- アイテムリスト（最大5件） -->
    <div v-for="(item, i) in omikuji.slice(0, 5)" :key="i" class="flex items-center gap-1.5 text-xs">
      <!-- 優先度バッジ -->
      <span v-if="isPriority(item)" class="badge badge-xs badge-accent shrink-0">{{ t('appPreview.omikuji.priority') }}</span>
      <span v-else class="opacity-40 shrink-0 tabular-nums w-3 text-right">{{ i + 1 }}</span>

      <!-- name / kind表示 -->
      <span class="truncate flex-1" :class="item.name ? '' : 'opacity-60'">
        {{ item.name || getItemKindLabel(item) }}
      </span>

      <!-- weight（lottery があるアイテムのみ） -->
      <span v-if="getWeight(item) !== null" class="badge badge-xs badge-ghost shrink-0"> ×{{ getWeight(item) }} </span>

      <!-- criteria あり -->
      <span v-if="hasCriteria(item)" class="text-accent" :title="t('appPreview.omikuji.hasCriteria')">
        <Filter class="w-2.5 h-2.5" />
      </span>
    </div>

    <!-- 省略表示 -->
    <div v-if="omikuji.length > 5" class="text-xs opacity-40 text-right">{{ t('appPreview.more', { n: omikuji.length - 5 }) }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ListChecks, Filter } from 'lucide-vue-next'
  import { OmikujiItemType } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    data: { omikuji?: OmikujiItemType[] } | null
  }>()

  const omikuji = computed(() => props.data?.omikuji ?? [])

  function getItemKindLabel(item: OmikujiItemType): string {
    if (item.kind === 'control') return t(`mapText.omikujiControlCommand.${item.command}.label`)
    return t(`mapText.omikujiItemKind.${item.kind}.label`)
  }

  function isPriority(item: OmikujiItemType): boolean {
    if ('lottery' in item && item.lottery) {
      return item.lottery.isPriority === true
    }
    return false
  }

  function getWeight(item: OmikujiItemType): number | null {
    if ('lottery' in item && item.lottery) {
      return item.lottery.weight ?? 1
    }
    return null
  }

  function hasCriteria(item: OmikujiItemType): boolean {
    if (!('lottery' in item) || !item.lottery?.criteria) return false
    const c = item.lottery.criteria
    return (
      (c.conditions?.length ?? 0) > 0 ||
      (c.userName?.length ?? 0) > 0 ||
      (c.comment?.length ?? 0) > 0 ||
      (c.access?.length ?? 0) > 0 ||
      (c.gift?.length ?? 0) > 0
    )
  }
</script>
