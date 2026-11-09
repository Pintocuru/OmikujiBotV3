<!-- src/ui/KujibikiPanel/components/fortune/BigBangUserName.vue -->
<!-- ユーザー名: 星の光が走る銀色の文字 + 菱形の飾り罫 -->
<template>
  <div class="relative z-10 flex max-w-full items-center gap-2.5">
    <span class="ornament" aria-hidden="true" />
    <span class="name-text min-w-0 truncate font-serif text-xl font-semibold tracking-[0.18em]">{{ name }}</span>
    <span class="ornament ornament-right" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{ name: string }>()
</script>

<style scoped>
  .name-text {
    background: linear-gradient(100deg, #7dd3fc 0%, #fff 35%, #c7d2fe 50%, #fff 65%, #7dd3fc 100%);
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.7));
    animation: name-shimmer 5s linear infinite;
  }

  .ornament {
    position: relative;
    flex: none;
    width: 1.75rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.9));
  }

  .ornament::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -3px;
    width: 5px;
    height: 5px;
    background: #e0f2fe;
    box-shadow: 0 0 6px 1px rgba(56, 189, 248, 0.9);
    transform: translateY(-50%) rotate(45deg);
  }

  .ornament-right {
    transform: scaleX(-1);
  }

  @keyframes name-shimmer {
    from {
      background-position: 0% 0;
    }
    to {
      background-position: -220% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .name-text {
      animation: none;
    }
  }
</style>
