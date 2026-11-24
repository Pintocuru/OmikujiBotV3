<!-- src/console/game/WordAlchemy/WordAlchemy.vue -->
<!-- 言葉の錬金術 (別ウィンドウで開く。仕様は SPEC.md)。画面の組み立てだけを行い、進行は useWordAlchemy が持つ -->
<template>
  <div class="flex h-screen flex-col bg-neutral text-neutral-content">
    <WordAlchemyTopBar
      :pot-type="potType"
      :phase="phase"
      :comment-source="commentSource"
      :comment-status="commentStatus"
      @abort="abort"
      @reconnect="connectComments"
    />
    <main class="relative min-h-0 grow">
      <WordAlchemyField :options="stageOptions" @ready="setStage" />
      <WordAlchemyTitle v-if="phase === 'idle'" v-model:pot-type="potType" @start="start" />
    </main>
  </div>
</template>

<script setup lang="ts">
  import WordAlchemyField from './components/WordAlchemyField.vue'
  import WordAlchemyTitle from './components/WordAlchemyTitle.vue'
  import WordAlchemyTopBar from './components/WordAlchemyTopBar.vue'
  import { useWordAlchemy } from './composables/useWordAlchemy'

  const { phase, potType, commentSource, commentStatus, stageOptions, setStage, start, abort, connectComments } = useWordAlchemy()
</script>
