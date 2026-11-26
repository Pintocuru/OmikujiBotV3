<!-- src/console/game/WordAlchemy/WordAlchemy.vue -->
<!-- 言葉の錬金術 (別ウィンドウで開く。仕様は SPEC.md)。画面の組み立てだけを行い、進行は useWordAlchemy が持つ -->
<template>
  <div class="flex h-screen flex-col bg-neutral text-neutral-content">
    <WordAlchemyTopBar
      :found="codex.found.value"
      :total="codex.total"
      :codex-offline="codex.offline.value"
      :record-error="recordError"
      :ai-usage="aiUsage"
      :pot-type="potType"
      :phase="phase"
      :comment-source="commentSource"
      :comment-status="commentStatus"
      @abort="abort"
      @reconnect="connectComments"
      @open-codex="showCodex = true"
      @open-ai-settings="showAiSettings = true"
    />
    <main class="relative min-h-0 grow">
      <WordAlchemyField :options="stageOptions" @ready="setStage" />
      <WordAlchemyTitle v-if="phase === 'idle'" v-model:pot-type="potType" @start="start" />
      <WordAlchemyBrewConfirm v-if="pending" :materials="pending" @answer="confirm" />
      <WordAlchemyAiSettings
        v-if="showAiSettings"
        :settings="aiSettings.settings.value"
        :busy="aiSettings.busy.value"
        :error="aiSettings.error.value"
        @close="showAiSettings = false"
        @save="aiSettings.save($event)"
      />
      <WordAlchemyCodex
        v-if="showCodex"
        :codex="codex.codex.value"
        :found="codex.found.value"
        :total="codex.total"
        :offline="codex.offline.value"
        :discarded="codex.discarded.value"
        @close="showCodex = false"
        @reset="codex.reset()"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import WordAlchemyAiSettings from './components/WordAlchemyAiSettings.vue'
  import WordAlchemyBrewConfirm from './components/WordAlchemyBrewConfirm.vue'
  import WordAlchemyCodex from './components/WordAlchemyCodex.vue'
  import WordAlchemyField from './components/WordAlchemyField.vue'
  import WordAlchemyTitle from './components/WordAlchemyTitle.vue'
  import WordAlchemyTopBar from './components/WordAlchemyTopBar.vue'
  import { useWordAlchemy } from './composables/useWordAlchemy'

  const {
    phase,
    potType,
    pending,
    codex,
    aiSettings,
    aiUsage,
    recordError,
    commentSource,
    commentStatus,
    stageOptions,
    setStage,
    start,
    abort,
    confirm,
    connectComments,
  } = useWordAlchemy()
  const showCodex = ref(false)
  const showAiSettings = ref(false)
</script>
