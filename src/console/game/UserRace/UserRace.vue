<!-- src/console/game/UserRace/UserRace.vue -->
<!-- ユーザーレース: ユーザーリストから最大8人が走り、1〜3位に手動で得点を加算できる。別ウィンドウで開き、OBS でキャプチャする -->
<!-- 画面の部品: RaceTrack / RaceResult / RaceControls。ここは組み立てと状態の受け渡しだけ -->
<template>
  <div class="flex h-screen flex-col bg-neutral text-neutral-content">
    <StatusNotice :status="status" :errorMessage="errorMessage" />

    <main class="relative flex min-h-0 grow items-center">
      <RaceTrack v-if="race" :racers="race.racers" :ranks="ranks" />
      <p v-else class="grow px-8 text-center text-lg opacity-70">
        {{ notEnough ? userRaceMessages.notEnough(MIN_RACERS) : userRaceMessages.idle }}
      </p>

      <!-- カウントダウン -->
      <div v-if="phase === 'countdown'" class="absolute inset-0 flex items-center justify-center bg-black/40">
        <span :key="countdown" class="countdown-pop text-9xl font-black">{{ countdown }}</span>
      </div>

      <!-- 結果 -->
      <div v-if="phase === 'finished'" class="absolute inset-0 flex items-center justify-center bg-black/50">
        <RaceResult
          :results="results"
          :applying="applying"
          :applied="applied"
          :applyError="applyError"
          @apply="applyPoints"
        />
      </div>
    </main>

    <RaceControls v-if="!hideControls" :phase="phase" @start="start" @reset="reset" @hide="hideControls = true" />
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import StatusNotice from '@/console/common/components/StatusNotice.vue'
  import RaceTrack from './components/RaceTrack.vue'
  import RaceResult from './components/RaceResult.vue'
  import RaceControls from './components/RaceControls.vue'
  import { useUserRace } from './composables/useUserRace'
  import { userRaceMessages } from './maps/UserRaceMessageMap'
  import { MIN_RACERS } from './scripts/raceEngine'

  const {
    phase,
    status,
    errorMessage,
    notEnough,
    race,
    countdown,
    results,
    ranks,
    applying,
    applied,
    applyError,
    start,
    reset,
    applyPoints,
  } = useUserRace()

  // 操作バーは、OBS でキャプチャするときに隠せる (H キーで戻す)
  const hideControls = ref(false)
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'h' && !event.ctrlKey && !event.metaKey && !event.altKey)
      hideControls.value = !hideControls.value
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
  .countdown-pop {
    animation: countdown-pop 1s ease-out;
  }
  @keyframes countdown-pop {
    from {
      transform: scale(1.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
