<!-- src/editor/content/AppDevWorld.vue -->
<!-- ようこそ、デブワールドへ… -->
<template>
  <div class="space-y-4 text-center">
    <p class="pt-8 text-4xl font-bold tracking-widest opacity-60">{{ t('devWorld.noData') }}</p>
    <p class="text-lg font-bold tracking-widest opacity-60">{{ t('devWorld.welcome') }}</p>
    <!-- 狭い幅では、はみ出さず幅に収める -->
    <iframe src="https://trello.com/b/fPhM7xVh.html" class="mx-auto h-150 w-full max-w-180 border-0"></iframe>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>
