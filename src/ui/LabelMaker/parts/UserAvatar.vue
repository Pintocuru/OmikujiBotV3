<!-- src/ui/LabelMaker/parts/UserAvatar.vue -->
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
  import type { UserNameType } from '@/types/OmikenComment'

  const props = withDefaults(defineProps<{ user: UserNameType; size?: number }>(), { size: 28 })

  // プロフィール画像がないユーザーは、名前から作ったアバターにする
  const src = computed(() => props.user.profileImage || getAvatarUrl(props.user.userName || 'Anonymous'))
</script>
