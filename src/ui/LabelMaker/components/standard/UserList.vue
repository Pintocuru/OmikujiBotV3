<!-- src/ui/LabelMaker/components/standard/UserList.vue -->
<!-- ユーザー名のバッジを、折り返しながら並べる -->
<template>
  <div v-if="users.length > 0" class="rounded-2xl p-2 shadow-xl" :style="labelRootStyle(settings)">
    <ul class="flex flex-wrap justify-center gap-2">
      <li
        v-for="{ key, user } in users"
        :key="key"
        class="inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-lg font-bold"
        :style="{ backgroundColor: mix('var(--lm-accent)', 30) }"
      >
        <UserAvatar :user="user" :size="28" />
        <span class="truncate" :style="{ color: 'var(--lm-name)' }">{{ user.userName }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { LabelMakerType } from '@/types/ui'
  import { labelRootStyle, mix } from '../../parts/labelStyle'
  import UserAvatar from '../../parts/UserAvatar.vue'
  import type { LabelEntry } from '../../scripts/labelUsers'

  defineProps<{ users: LabelEntry[]; settings: LabelMakerType }>()
</script>
