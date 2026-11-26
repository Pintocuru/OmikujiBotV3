<!-- src/console/control/Amidakuji/components/SetupPanel.vue -->
<template>
  <div
    class="w-80 shrink-0 border-r border-base-300 bg-base-100 p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-3rem)]"
  >
    <PlayersSection />
    <PrizesSection />
    <RungsSection />
    <RevealSection />
  </div>
</template>

<script setup lang="ts">
  import PlayersSection from './setup/PlayersSection.vue'
  import PrizesSection from './setup/PrizesSection.vue'
  import RungsSection from './setup/RungsSection.vue'
  import RevealSection from './setup/RevealSection.vue'
</script>
