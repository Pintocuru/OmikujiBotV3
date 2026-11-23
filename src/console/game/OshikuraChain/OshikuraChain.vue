<!-- src/console/game/OshikuraChain/OshikuraChain.vue -->
<!-- おしくらチェイン: コメントのアイコンや文字を WASD で盤面の外へ押し出し、連鎖で残り時間を増やす -->
<template>
  <div class="flex h-screen flex-col bg-neutral text-neutral-content">
    <NuisanceTopBar
      :phase="phase"
      :state="state"
      :config="activeConfig"
      :commentStatus="commentStatus"
      :getClock="getClock"
      @toggle="toggleMenu"
      @abort="abort"
      @reconnect="connectComments"
    />

    <main class="relative min-h-0 grow">
      <NuisanceField :source="stageSource" />

      <OshikuraChainTitle v-if="phase === 'idle' && !showMenu" @openMenu="showMenu = true" />

      <NuisanceMenu
        v-if="phase === 'idle' && showMenu"
        :draft="configStore.draft"
        :online="configStore.online.value"
        :loadError="configStore.loadError.value"
        :saveError="configStore.saveError.value"
        @start="start"
        @close="showMenu = false"
        @resetConfig="configStore.reset"
        @difficulty="configStore.setDifficulty"
        @gameMode="configStore.setGameMode"
        @commentSource="configStore.setCommentSource"
        @resetMultiplier="configStore.setResetMultiplierOnFirst"
      />

      <NuisanceResult
        v-if="phase === 'over' && state"
        :state="state"
        :ranking="ranking"
        :recordStatus="recordStatus"
        :recordError="recordError"
        :streamId="streamId"
        @again="start"
        @toMenu="toMenu"
        @retryRecord="record"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import NuisanceField from './components/NuisanceField.vue'
  import OshikuraChainTitle from './components/OshikuraChainTitle.vue'
  import NuisanceMenu from './components/NuisanceMenu.vue'
  import NuisanceResult from './components/NuisanceResult.vue'
  import NuisanceTopBar from './components/NuisanceTopBar.vue'
  import { useOshikuraChain } from './composables/useOshikuraChain'
  import type { OshikuraChainStageSource } from './render/OshikuraChainStage'

  const {
    phase,
    showMenu,
    state,
    activeConfig,
    ranking,
    commentStatus,
    recordStatus,
    recordError,
    streamId,
    configStore,
    getClock,
    drainEvents,
    start,
    abort,
    toMenu,
    toggleMenu,
    record,
    connectComments,
  } = useOshikuraChain()

  // 盤面 (Excalibur) が毎フレーム読み取る窓口。読み取り専用で、ゲームには何も返さない
  const stageSource: OshikuraChainStageSource = {
    getState: () => state.value,
    getConfig: () => activeConfig.value,
    getClock,
    drainEvents,
  }

  // テストコメントは、OBS でキャプチャするときに隠せる (H キーで戻す)
  const hideTools = ref(false)
  const onKeydown = (event: KeyboardEvent) => {
    const target = event.target
    if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
    if (event.code === 'KeyH' && !event.ctrlKey && !event.metaKey && !event.altKey) hideTools.value = !hideTools.value
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
