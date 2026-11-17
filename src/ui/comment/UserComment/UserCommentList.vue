<!-- src/ui/comment/UserComment/UserCommentList.vue -->
<!-- 元コメントとおみくじ結果を、レス風に縦に積んで表示する(配信側・editor のプレビュー共通) -->
<template>
  <div class="flex flex-col w-full max-w-lg" :class="useFontFamily(fontFamily)">
    <TransitionGroup name="user-comment" tag="div" class="flex flex-col gap-2">
      <div v-for="entry in entries" :key="entry.id" class="rounded-lg bg-black/60 px-3 py-2 text-white shadow-lg">
        <!-- 名前 -->
        <div class="text-xs font-bold text-sky-300">{{ entry.name }}</div>
        <!-- 元コメント(ユーザー入力なので、HTML として扱わない) -->
        <div class="text-base leading-tight wrap-break-word">{{ entry.comment }}</div>
        <!-- おみくじ結果(BOT が作る文面。アイコン置換の <img> を含むので HTML として表示) -->
        <div class="mt-1 border-t border-white/20 pt-1 text-base leading-tight wrap-break-word">
          <span class="mr-1 opacity-60">→</span><span v-html="entry.reply" />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
  import type { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import type { UserCommentEntry } from './scripts/userCommentEntries'

  defineProps<{
    entries: UserCommentEntry[]
    fontFamily?: FontFamilyType
  }>()
</script>

<style scoped>
  .user-comment-enter-active,
  .user-comment-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }
  .user-comment-enter-from {
    opacity: 0;
    transform: translateY(12px);
  }
  .user-comment-leave-to {
    opacity: 0;
  }
</style>
