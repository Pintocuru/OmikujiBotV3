<!-- src/console/game/NuisanceSurvival/NuisanceSurvival.vue -->
<!-- 邪魔者サバイバル: コメントした人が「邪魔者」になり、居残ってライフを減らし続ける。WASD で押して取り除き、生き残る -->
<!-- 画面の部品: NuisanceTopBar / NuisanceField / NuisanceMenu / NuisanceResult / NuisanceTestPanel。ここは組み立てだけ -->
<!-- 仕様: ./SPEC.md。別ウィンドウで開き、OBS でキャプチャする -->
<template>
  <div class="flex h-screen flex-col bg-neutral text-neutral-content">
    <NuisanceTopBar
      :phase="phase"
      :state="state"
      :config="activeConfig"
      :commentStatus="commentStatus"
      :getClock="getClock"
      @toggle="toggleMenu"
      @reconnect="connectComments"
    />

    <main class="relative min-h-0 grow">
      <NuisanceField :state="state" :config="activeConfig" :getClock="getClock" />

      <NuisanceMenu
        v-if="phase === 'idle' && showMenu"
        :draft="configStore.draft"
        :limits="configStore.limits"
        :keys="configStore.keys"
        :online="configStore.online.value"
        :loadError="configStore.loadError.value"
        :saveError="configStore.saveError.value"
        @start="start"
        @close="showMenu = false"
        @resetConfig="configStore.reset"
        @update="configStore.setField"
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

      <NuisanceTestPanel v-if="!hideTools" />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import NuisanceField from './components/NuisanceField.vue'
  import NuisanceMenu from './components/NuisanceMenu.vue'
  import NuisanceResult from './components/NuisanceResult.vue'
  import NuisanceTestPanel from './components/NuisanceTestPanel.vue'
  import NuisanceTopBar from './components/NuisanceTopBar.vue'
  import { useNuisanceSurvival } from './composables/useNuisanceSurvival'

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
    start,
    toMenu,
    toggleMenu,
    record,
    connectComments,
  } = useNuisanceSurvival()

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
