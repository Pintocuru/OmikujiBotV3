<!-- src/MainGenerator/ui/FlashBanner/FlashBanner.vue -->
<template>
  <CenteringWrapper>
    <FlashBannerSelector
      :key="currentMessage.id"
      :settings="settings"
      :message="currentMessage.bubble?.message ?? ''"
      :characterLayers="characterLayers"
      :characterAnimation="characterAnimation"
      :color="currentCharacterColor"
      :label-class="blinkClass"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { BotMessageBubbleSchema, FlashBannerSchema } from "@/types";
import FlashBannerSelector from "./parts/FlashBannerSelector.vue";
import { useDelayedBlink } from "./composables/useDelayedBlink.js";
import { useFlashBannerDisplay } from "./composables/useFlashBannerDisplay.js";
import { useFilteredBotMessages } from "../common/useFilteredBotMessages.js";
import { usePlaceholderInterval } from "../common/usePlaceholderInterval.js";
import CenteringWrapper from "../common/CenteringWrapper.vue";
import { useAppStore } from "@/generator/stores/useAppStore.js";
import { useBotDisplay } from "@/generator/ui/CommentBubble/composables/useBotDisplay.js";
import { useCharacterManager } from "@/generator/scripts/CharacterManager/useCharacterManager.js";

const appStore = useAppStore();
const { getCharacterColor, getCharacterLayers, getCharacterAnimation } =
  useCharacterManager();
const settings = computed(() =>
  FlashBannerSchema.parse(
    appStore.data.components?.settings?.flashBanner ?? {},
  ),
);
const { blinkClass, triggerBlink } = useDelayedBlink({
  transitionDuration: 350,
  blinkDuration: 750,
});
const {
  message: defaultComment,
  commitIfPending,
  registerIntervalHook,
} = usePlaceholderInterval(() => settings.value.defaultMessage ?? "");

const { messages } = useFilteredBotMessages("flashBanner", {
  displaySeconds: settings.value.displaySeconds,
  userIconSize: 12,
});

const { displayedComments, start, stop } = useBotDisplay(messages);

const defaultMessage = computed(() =>
  BotMessageBubbleSchema.parse({
    id: "flash-default",
    bubble: {
      message: defaultComment.value,
      characterKey: settings.value.defaultCharacterKey,
      displaySeconds: settings.value.displaySeconds,
    },
  }),
);

// メッセージ切り替え時に blink を発火
const { currentMessage, isShowingDefault } = useFlashBannerDisplay({
  displayedComments,
  defaultMessage,
  onMessageChanged: () => triggerBlink(true),
});

// インターバルのタイミングでデフォルト表示中なら pending な defaultComment を反映
registerIntervalHook(() => commitIfPending(isShowingDefault()));

const characterLayers = computed(() =>
  getCharacterLayers(currentMessage.value),
);
const characterAnimation = computed(() =>
  getCharacterAnimation(currentMessage.value),
);
const currentCharacterColor = computed(() =>
  getCharacterColor(currentMessage.value.bubble?.characterKey ?? null),
);

onMounted(() => start());
onUnmounted(() => stop());
</script>
