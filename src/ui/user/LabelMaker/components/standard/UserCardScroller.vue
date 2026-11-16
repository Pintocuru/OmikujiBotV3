<!-- src/ui/user/LabelMaker/components/standard/UserCardScroller.vue -->
<!-- ユーザーのカードを縦に並べ、新しいユーザーを右から滑り込ませる -->
<template>
  <div v-if="users.length > 0" class="rounded-2xl p-2 shadow-xl" :style="labelRootStyle(settings)">
    <TransitionGroup name="slide-in" tag="ul" class="flex flex-col gap-1">
      <li
        v-for="{ key, user } in users"
        :key="key"
        class="flex items-center gap-3 rounded-lg px-2 py-1"
        :style="{ backgroundColor: mix('var(--lm-accent)', 25) }"
      >
        <UserAvatar :user="user" :size="32" />
        <span class="min-w-0 truncate text-base font-bold" :style="{ color: 'var(--lm-name)' }">{{
          user.userName
        }}</span>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
  import type { LabelMakerType } from '@/types/ui'
  import { labelRootStyle, mix } from '../../parts/labelStyle'
  import UserAvatar from '../../parts/UserAvatar.vue'
  import type { LabelEntry } from '../../scripts/labelUsers'

  defineProps<{ users: LabelEntry[]; settings: LabelMakerType }>()
</script>

<style scoped>
  /* 新規追加時のみ右→左 */
  .slide-in-enter-from {
    transform: translateX(40px);
    opacity: 0;
  }
  .slide-in-enter-active {
    transition:
      transform 0.25s ease-out,
      opacity 0.25s ease-out;
  }
  .slide-in-enter-to {
    transform: translateX(0);
    opacity: 1;
  }

  /* 既存要素・削除時は一切動かさない */
  .slide-in-move,
  .slide-in-leave-active {
    transition: none;
  }
</style>
