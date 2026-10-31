<!-- src/editor/sidebar/NavigationSidebar.vue -->
<!-- カテゴリの一覧と、選択中カテゴリのレコード一覧。サブ項目(タブ)は ContentArea 側に出す -->
<template>
  <div class="flex flex-col min-h-full py-2">
    <!-- データ系カテゴリ（Events / Assets） -->
    <DataCategories />

    <!-- 設定系カテゴリ（ui / jsonMerge / dataPacks / appInfo） -->
    <SettingsCategories />
  </div>
</template>

<script setup lang="ts">
  import DataCategories from './categories/DataCategories.vue'
  import SettingsCategories from './categories/SettingsCategories.vue'
</script>
