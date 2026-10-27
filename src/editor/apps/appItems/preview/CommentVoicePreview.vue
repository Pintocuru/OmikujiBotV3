<!-- src/editor/apps/appItems/preview/CommentVoicePreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <MessageSquare class="w-3 h-3" />
      <span>{{ t('appPreview.voice.title') }}</span>
    </div>

    <!-- 表示モード -->
    <div class="flex items-center gap-1.5 text-xs">
      <Mic class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">{{ t('appPreview.mode') }}</span>
      <span class="badge badge-xs" :class="modeBadgeClass">
        {{ option.mode === 'comment' ? t('appPreview.voice.comment') : option.mode === 'voice' ? t('appPreview.voice.voice') : t('appPreview.voice.noFrame') }}
      </span>
    </div>

    <!-- わんコメ枠 -->
    <div v-if="option.frameId" class="flex items-center gap-1.5 text-xs">
      <LayoutTemplate class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">{{ t('appPreview.voice.frameId') }}</span>
      <span class="truncate font-mono opacity-80">{{ option.frameId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { MessageSquare, Mic, LayoutTemplate } from 'lucide-vue-next'
  import { CharacterType, DisplayOptionSchema } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    data: Partial<CharacterType> | null
  }>()

  const option = computed(() => props.data?.displayOption ?? DisplayOptionSchema.parse({}))

  const modeBadgeClass = computed(() => {
    const map: Record<string, string> = {
      comment: 'badge-primary',
      voice: 'badge-secondary',
      rpgVoice: 'badge-accent',
      none: 'badge-ghost',
    }
    return map[option.value.mode ?? 'comment'] ?? 'badge-ghost'
  })
</script>
