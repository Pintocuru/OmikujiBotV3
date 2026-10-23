<!-- src/console/components/StatusNotice.vue -->
<!-- サーバーに接続できない / 読み込みに失敗した、ときの案内 -->
<template>
  <main v-if="status === 'offline'" class="mx-auto max-w-xl p-8">
    <div class="alert alert-warning flex-col items-start gap-2">
      <p class="font-bold">サーバーに接続できません</p>
      <p class="text-sm">
        LiveConsole は、データを保存しているサーバー(わんコメのプラグイン、開発中は <code>npm run dev</code> の API サーバー)が
        起動している必要があります。起動してから「更新」を押してください。自動更新がオンなら、つながり次第表示されます。
      </p>
    </div>
  </main>

  <main v-else-if="status === 'error'" class="mx-auto max-w-xl p-8">
    <div class="alert alert-error flex-col items-start gap-2">
      <p class="font-bold">データを読み込めませんでした</p>
      <p class="text-sm break-all">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
  import type { ConsoleStatus } from '../composables/useLiveConsole'

  defineProps<{ status: ConsoleStatus; errorMessage: string }>()
</script>
