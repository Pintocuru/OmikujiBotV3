<!-- src/ui/CommentBubble/components/messageBoard/WoodBoard.vue -->
<!-- 木の看板: 板を並べた掲示板にメモ紙をピンで留める。キャラは板の後ろから顔を出す -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center pb-10">
    <div class="relative">
      <!-- 板の後ろから顔を出すキャラ(下側を板に隠す) -->
      <ShownImage
        :shown="shown"
        :size="settings.characterSize"
        class="absolute right-10 bottom-full z-0 translate-y-6"
      />

      <div class="wood-board relative z-10 h-60 w-140">
        <span class="wood-nail wood-nail-tl" />
        <span class="wood-nail wood-nail-tr" />
        <span class="wood-nail wood-nail-bl" />
        <span class="wood-nail wood-nail-br" />

        <div class="h-full p-3">
          <BoardLines
            :displayed-comments="displayedComments"
            :remove-comment="removeComment"
            :motion="settings.bubbleMotion"
          >
            <template #default="{ speaker, message, color, index }">
              <!-- メモ紙: キャラクターの色をそのまま使い、accent はピンの色にする -->
              <div
                class="wood-note relative mx-2 rounded-sm px-4 pt-3 pb-2"
                :class="index % 2 === 0 ? 'rotate-[-0.6deg]' : 'rotate-[0.5deg]'"
                :style="{ backgroundColor: color.background, color: color.text }"
              >
                <span class="wood-pin" :style="{ backgroundColor: color.accent }" />
                <div v-if="speaker" class="text-sm font-bold" :style="{ color: color.name }">{{ speaker }}</div>
                <div class="wrap-break-word text-lg leading-snug" v-html="message" />
              </div>
            </template>
          </BoardLines>
        </div>
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
  /* 板: 横の継ぎ目(3枚張り) + 縦の木目 + 縁の濃い枠 */
  .wood-board {
    background-color: #c68b52;
    background-image:
      repeating-linear-gradient(180deg, transparent 0 72px, rgba(50, 25, 8, 0.35) 72px 74px),
      repeating-linear-gradient(90deg, rgba(90, 50, 20, 0.07) 0 1px, transparent 1px 7px),
      repeating-linear-gradient(90deg, rgba(255, 235, 200, 0.06) 0 3px, transparent 3px 19px),
      linear-gradient(180deg, #d69c62, #b9824a);
    border: 10px solid #6a4222;
    border-radius: 8px;
    box-shadow:
      inset 0 0 0 2px rgba(0, 0, 0, 0.25),
      inset 0 0 28px rgba(60, 30, 10, 0.45),
      0 10px 18px rgba(0, 0, 0, 0.45);
  }

  /* 四隅の釘(枠の上に重ねる) */
  .wood-nail {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ececec, #7a7a7a 60%, #333);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
  }
  .wood-nail-tl {
    top: -9px;
    left: -9px;
  }
  .wood-nail-tr {
    top: -9px;
    right: -9px;
  }
  .wood-nail-bl {
    bottom: -9px;
    left: -9px;
  }
  .wood-nail-br {
    right: -9px;
    bottom: -9px;
  }

  .wood-note {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.35),
      inset 0 -8px 12px -10px rgba(0, 0, 0, 0.2);
  }

  /* メモ紙を留めるピン */
  .wood-pin {
    position: absolute;
    top: -5px;
    left: 50%;
    width: 11px;
    height: 11px;
    margin-left: -5px;
    border-radius: 50%;
    box-shadow:
      inset -2px -2px 3px rgba(0, 0, 0, 0.35),
      inset 1px 1px 2px rgba(255, 255, 255, 0.55),
      0 2px 3px rgba(0, 0, 0, 0.45);
  }
</style>
