<!-- src/editor/apps/cooldown/CooldownPeerList.vue -->
<!-- 止める / 止められる相手の件数。開くと名前(とクールダウン)が並び、押すとそのおみくじへ移動する -->
<template>
  <details v-if="peers.length > 0" class="text-sm">
    <summary class="cursor-pointer">
      <span class="badge badge-warning">{{ peers.length }}</span>
    </summary>
    <ul class="mt-1 space-y-0.5">
      <li v-for="peer in peers" :key="peer.itemId">
        <button type="button" class="link link-hover text-left text-xs" @click="emit('go', peer)">
          {{ peer.itemName || t('omikujiItem.summary.unnamed') }}
          <span class="opacity-60 font-mono"
            >{{ peer.cooldownSeconds }}{{ t('omikujiItem.header.cooldown.unit') }}</span
          >
        </button>
      </li>
    </ul>
  </details>
  <span v-else class="badge badge-ghost">0</span>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { CooldownPeer } from './useCooldownOverview'

  const { t } = useI18n()

  defineProps<{ peers: CooldownPeer[] }>()
  const emit = defineEmits<{ go: [peer: CooldownPeer] }>()
</script>
