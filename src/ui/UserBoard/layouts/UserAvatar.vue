<!-- src/ui/UserBoard/layouts/UserAvatar.vue -->
<template>
  <img
    :src="src"
    alt=""
    class="shrink-0 rounded-full object-cover"
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import type { UserStatsRecord } from '@/types/api'

  const props = withDefaults(defineProps<{ user: UserStatsRecord; size?: number }>(), { size: 28 })

  // プロフィール画像がないユーザー (手動で追加したユーザーなど) は、名前から作ったアバターにする
  const src = computed(() => props.user.profileImage || getAvatarUrl(props.user.userName))
</script>
