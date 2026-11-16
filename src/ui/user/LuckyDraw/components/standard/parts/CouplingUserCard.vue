<!-- src/ui/user/LuckyDraw/components/standard/parts/CouplingUserCard.vue -->
<template>
  <div
    class="w-44 overflow-hidden rounded-xl border-2 p-3 text-center shadow-xl"
    :style="{ borderColor: border, background: color.background }"
  >
    <div class="flex justify-center">
      <img
        :src="user.profileImage || getAvatarUrl(user.userName || 'Anonymous')"
        :alt="user.userName"
        class="h-20 w-20 rounded-full object-cover ring-2 ring-offset-2"
        :style="{ '--tw-ring-color': border }"
      />
    </div>
    <h3 class="mt-2 truncate text-lg font-bold" :style="{ color: color.name }">{{ user.userName }}</h3>
    <div class="mt-1 flex justify-center gap-1">
      <Heart v-for="i in 3" :key="i" class="h-3 w-3" :style="{ color: border, fill: border }" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Heart } from 'lucide-vue-next'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import type { UserNameType } from '@/types/OmikenComment'
  import type { CharacterColorType } from '@/types/OmikujiData'

  defineProps<{
    user: UserNameType
    color: CharacterColorType
    border: string
  }>()
</script>
