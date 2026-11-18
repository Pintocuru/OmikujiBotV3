<!-- src/common/Dialog/DialogHost.vue -->
<!-- dialog.* の表示先。各 entry の最上位(daisyUI のテーマを当てている要素の内側)に 1 つだけ置く -->
<template>
  <DialogItem v-for="request in dialogRequests" :key="request.id" :request="request" />
</template>

<script setup lang="ts">
  import DialogItem from './DialogItem.vue'
  import { dialogRequests } from './dialogState'
</script>
