<!-- src/ui/CommentBubble/components/messageBoard/ChalkBoard.vue -->
<!-- 黒板: 木枠の黒板にチョークで書く。名前はマグネット名札。キャラは黒板の横に立つ -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 pb-8">
    <ShownImage :shown="shown" :size="settings.characterSize" class="shrink-0" />

    <div class="w-140">
      <div class="chalk-board h-60">
        <div class="h-full p-4">
          <BoardLines
            :displayed-comments="displayedComments"
            :remove-comment="removeComment"
            :motion="settings.bubbleMotion"
          >
            <template #default="{ speaker, message, color }">
              <div class="chalk-line flex items-start gap-3 pb-2">
                <!-- マグネット名札: キャラクターの背景色・名前色、accent は磁石の色 -->
                <span
                  v-if="speaker"
                  class="chalk-magnet relative mt-0.5 shrink-0 rounded px-3 py-0.5 text-sm font-bold"
                  :style="{ backgroundColor: color.background, color: color.name }"
                >
                  <span class="chalk-magnet-dot" :style="{ backgroundColor: color.accent }" />
                  {{ speaker }}
                </span>
                <!-- 本文はチョークの白(黒板の上で読めるよう、キャラの文字色は使わない) -->
                <div class="chalk-text wrap-break-word text-lg leading-snug" v-html="message" />
              </div>
            </template>
          </BoardLines>
        </div>
      </div>

      <!-- チョーク受け -->
      <div class="chalk-tray">
        <span class="chalk-piece chalk-piece-white" />
        <span class="chalk-piece chalk-piece-pink" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CommentBubbleComponentProps } from '../../CommentBubbleRegistry'
  import ShownImage from '../../parts/ShownImage.vue'
  import BoardLines from './BoardLines.vue'

  defineProps<CommentBubbleComponentProps>()
</script>

<style scoped>
  /* 黒板: 深緑の板面 + 消し跡のかすれ + 木枠 */
  .chalk-board {
    background-color: #26382f;
    background-image:
      radial-gradient(ellipse at 28% 22%, rgba(255, 255, 255, 0.08), transparent 55%),
      radial-gradient(ellipse at 82% 78%, rgba(255, 255, 255, 0.05), transparent 50%),
      repeating-linear-gradient(105deg, rgba(255, 255, 255, 0.015) 0 14px, transparent 14px 38px);
    border: 12px solid #9b6a38;
    border-radius: 4px;
    box-shadow:
      inset 0 0 0 2px rgba(0, 0, 0, 0.35),
      inset 0 0 44px rgba(0, 0, 0, 0.6),
      0 4px 0 #6f4a24;
  }

  .chalk-line {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.22);
  }

  .chalk-text {
    color: #f4f1e6;
    letter-spacing: 0.04em;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.35);
  }

  .chalk-magnet {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
  }
  .chalk-magnet-dot {
    position: absolute;
    top: -4px;
    left: -4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    box-shadow:
      inset -1px -1px 2px rgba(0, 0, 0, 0.4),
      0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .chalk-tray {
    position: relative;
    height: 12px;
    margin: 0 8px;
    border-radius: 0 0 4px 4px;
    background: linear-gradient(180deg, #a97640, #6f4a24);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.45);
  }
  .chalk-piece {
    position: absolute;
    bottom: 100%;
    height: 7px;
    border-radius: 2px;
  }
  .chalk-piece-white {
    left: 36px;
    width: 26px;
    background: #f4f1e6;
  }
  .chalk-piece-pink {
    left: 74px;
    width: 18px;
    background: #f1a7b8;
    transform: rotate(-4deg);
  }
</style>
