<!-- src/editor/assets/mikuji/cooldown/CooldownHelpButton.vue -->
<!-- クールダウンの仕組みの説明(はてなボタン)。入力欄・一覧の列見出し・一覧ダイアログで共有する -->
<template>
  <HelpButton :title="t('omikujiItem.cooldownHelp.title')">
    <p>{{ t('omikujiItem.cooldownHelp.summary') }}</p>
    <ul class="list-disc pl-5 space-y-1">
      <li>{{ t('omikujiItem.cooldownHelp.basis') }}</li>
      <li>{{ t('omikujiItem.cooldownHelp.zero') }}</li>
      <li>{{ t('omikujiItem.cooldownHelp.negative') }}</li>
      <li>{{ t('omikujiItem.cooldownHelp.blocked') }}</li>
    </ul>
    <div class="rounded-md bg-base-200 p-3 space-y-1">
      <p class="font-bold">{{ t('omikujiItem.cooldownHelp.examplesTitle') }}</p>
      <p>{{ t('omikujiItem.cooldownHelp.example1') }}</p>
      <p>{{ t('omikujiItem.cooldownHelp.example2') }}</p>
    </div>
  </HelpButton>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import HelpButton from '@/editor/parts/HelpButton.vue'

  const { t } = useI18n()
</script>
