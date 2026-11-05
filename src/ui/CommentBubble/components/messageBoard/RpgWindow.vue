<!-- src/ui/CommentBubble/components/messageBoard/RpgWindow.vue -->
<!-- RPG ウィンドウ: 青いメッセージウィンドウ + 顔グラ枠。話者は ◆名前、最新行に ▼ が点滅する -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-3 pb-8">
    <!-- 顔グラ枠(キャラがいるときだけ) -->
    <div v-if="shown && shown.layers.length > 0" class="rpg-window shrink-0 p-1">
      <div
        class="overflow-hidden rounded-sm bg-black/30"
        :style="{ width: `${settings.characterSize}px`, height: `${settings.characterSize}px` }"
      >
        <ShownImage :shown="shown" :size="settings.characterSize" />
      </div>
    </div>

    <div class="rpg-window h-60 w-[460px]">
      <div class="h-full px-5 py-4">
        <BoardLines
          :displayed-comments="displayedComments"
          :remove-comment="removeComment"
          :motion="settings.bubbleMotion"
        >
          <template #default="{ speaker, message, color, index }">
            <div class="rpg-line relative pr-7">
              <div v-if="speaker" class="rpg-name text-base font-bold" :style="{ color: color.accent }">
                ◆ {{ speaker }}
              </div>
              <!-- 本文は白(青い背景で読めるよう、キャラの文字色は使わない) -->
              <div class="rpg-text wrap-break-word text-lg leading-snug" v-html="message" />
              <span v-if="index === 0" class="rpg-cursor" :style="{ color: color.accent }">▼</span>
            </div>
          </template>
        </BoardLines>
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
  /* 青のグラデーション + 白い縁 + 内側の細線(定番のウィンドウ) */
  .rpg-window {
    background: linear-gradient(180deg, #1c2c9a 0%, #0a1350 100%);
    border: 3px solid #f4f4f4;
    border-radius: 10px;
    box-shadow:
      0 0 0 3px #15153a,
      inset 0 0 0 2px #7f8fd8,
      0 8px 16px rgba(0, 0, 0, 0.5);
  }

  .rpg-text,
  .rpg-name {
    text-shadow: 1px 1px 0 #000;
  }
  .rpg-text {
    color: #fff;
    letter-spacing: 0.06em;
  }

  /* 最新行の「次へ」マーク */
  .rpg-cursor {
    position: absolute;
    right: 2px;
    bottom: 2px;
    font-size: 0.85rem;
    text-shadow: 1px 1px 0 #000;
    animation: rpg-blink 1s steps(1, end) infinite;
  }
  @keyframes rpg-blink {
    50% {
      opacity: 0;
    }
  }
</style>
