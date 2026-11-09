<!-- src/ui/KujibikiPanel/components/fortune/BigBangSpace.vue -->
<!-- 宇宙空間: 星・星雲・きらめき・流れ星 -->
<template>
  <div class="pointer-events-none absolute inset-0" aria-hidden="true">
    <div class="stars stars-fine" />
    <div class="stars stars-a" />
    <div class="stars stars-b" />

    <div class="nebula nebula-one" />
    <div class="nebula nebula-two" />
    <div class="nebula nebula-three" />

    <span v-for="(s, i) in sparkles" :key="i" class="sparkle" :style="s" />

    <span class="meteor meteor-one" />
    <span class="meteor meteor-two" />
  </div>
</template>

<script setup lang="ts">
  // 4方向に光るきらめき(位置・大きさ・タイミングをずらして瞬かせる)
  const sparkles = [
    { left: '20%', top: '12%', '--size': '0.9rem', '--delay': '0s', '--dur': '3.2s' },
    { left: '80%', top: '20%', '--size': '1.2rem', '--delay': '1.1s', '--dur': '4s' },
    { left: '10%', top: '70%', '--size': '1rem', '--delay': '2s', '--dur': '3.6s' },
    { left: '88%', top: '78%', '--size': '0.8rem', '--delay': '0.6s', '--dur': '3s' },
    { left: '50%', top: '4%', '--size': '0.7rem', '--delay': '1.7s', '--dur': '3.4s' }
  ]
</script>

<style scoped>
  .stars {
    position: absolute;
    inset: 0;
  }

  /* 細かい星(静止) */
  .stars-fine {
    opacity: 0.85;
    background-image:
      radial-gradient(1px 1px at 12% 18%, #fff 99%, transparent),
      radial-gradient(1px 1px at 78% 13%, #bae6fd 99%, transparent),
      radial-gradient(1px 1px at 24% 63%, #fff 99%, transparent),
      radial-gradient(1px 1px at 69% 76%, #bae6fd 99%, transparent),
      radial-gradient(1px 1px at 9% 85%, #fff 99%, transparent),
      radial-gradient(1px 1px at 33% 8%, #fff 99%, transparent),
      radial-gradient(1px 1px at 55% 52%, #bae6fd 99%, transparent),
      radial-gradient(1px 1px at 91% 68%, #fff 99%, transparent),
      radial-gradient(1px 1px at 47% 91%, #fff 99%, transparent),
      radial-gradient(1px 1px at 5% 40%, #bae6fd 99%, transparent),
      radial-gradient(1px 1px at 62% 24%, #fff 99%, transparent),
      radial-gradient(1px 1px at 84% 90%, #bae6fd 99%, transparent),
      radial-gradient(1px 1px at 38% 72%, #fff 99%, transparent),
      radial-gradient(1px 1px at 96% 22%, #fff 99%, transparent);
  }

  /* 明るい星(ハロー付き・交互に瞬く) */
  .stars-a,
  .stars-b {
    animation: twinkle 3.6s ease-in-out infinite;
  }

  .stars-a {
    background-image:
      radial-gradient(2px 2px at 86% 36%, #fff 99%, transparent),
      radial-gradient(8px 8px at 86% 36%, rgba(186, 230, 253, 0.65), transparent),
      radial-gradient(2px 2px at 14% 24%, #fff 99%, transparent),
      radial-gradient(8px 8px at 14% 24%, rgba(186, 230, 253, 0.65), transparent),
      radial-gradient(2px 2px at 66% 84%, #fff 99%, transparent),
      radial-gradient(8px 8px at 66% 84%, rgba(186, 230, 253, 0.65), transparent),
      radial-gradient(2px 2px at 27% 78%, #fff 99%, transparent),
      radial-gradient(8px 8px at 27% 78%, rgba(165, 180, 252, 0.65), transparent),
      radial-gradient(2px 2px at 52% 6%, #fff 99%, transparent),
      radial-gradient(8px 8px at 52% 6%, rgba(186, 230, 253, 0.65), transparent);
  }

  .stars-b {
    animation-delay: -1.8s;
    background-image:
      radial-gradient(2px 2px at 8% 62%, #fff 99%, transparent),
      radial-gradient(8px 8px at 8% 62%, rgba(165, 180, 252, 0.65), transparent),
      radial-gradient(2px 2px at 92% 58%, #fff 99%, transparent),
      radial-gradient(8px 8px at 92% 58%, rgba(186, 230, 253, 0.65), transparent),
      radial-gradient(2px 2px at 40% 14%, #fff 99%, transparent),
      radial-gradient(8px 8px at 40% 14%, rgba(186, 230, 253, 0.65), transparent),
      radial-gradient(2px 2px at 78% 28%, #fff 99%, transparent),
      radial-gradient(8px 8px at 78% 28%, rgba(165, 180, 252, 0.65), transparent),
      radial-gradient(2px 2px at 58% 94%, #fff 99%, transparent),
      radial-gradient(8px 8px at 58% 94%, rgba(186, 230, 253, 0.65), transparent);
  }

  /* 星雲 */
  .nebula {
    position: absolute;
    width: 15rem;
    height: 9rem;
    border-radius: 50%;
    filter: blur(32px);
    opacity: 0.42;
    animation: nebula-drift 9s ease-in-out infinite alternate;
  }

  .nebula-one {
    top: 28%;
    left: -35%;
    background: #0ea5e9;
  }

  .nebula-two {
    top: 46%;
    right: -38%;
    background: #6366f1;
    animation-delay: -3s;
  }

  .nebula-three {
    top: -4%;
    right: -30%;
    width: 12rem;
    height: 7rem;
    background: #a855f7;
    opacity: 0.3;
    animation-delay: -6s;
  }

  /* 十字のきらめき */
  .sparkle {
    position: absolute;
    width: var(--size);
    height: var(--size);
    opacity: 0.8;
    background:
      radial-gradient(circle, #fff 0 14%, transparent 16%),
      linear-gradient(90deg, transparent, #fff 50%, transparent) center / 100% 1.5px no-repeat,
      linear-gradient(0deg, transparent, #fff 50%, transparent) center / 1.5px 100% no-repeat;
    filter: drop-shadow(0 0 4px #7dd3fc);
    animation: sparkle var(--dur) ease-in-out var(--delay) infinite;
  }

  /* 流れ星 */
  .meteor {
    position: absolute;
    width: 5rem;
    height: 2px;
    border-radius: 9999px;
    background: linear-gradient(90deg, #fff, rgba(125, 211, 252, 0.6) 40%, transparent);
    filter: drop-shadow(0 0 4px #7dd3fc);
    opacity: 0;
    transform: rotate(-35deg);
    animation: meteor 7s linear infinite;
  }

  .meteor-one {
    top: 8%;
    left: 85%;
    animation-delay: 1s;
  }

  .meteor-two {
    top: 38%;
    left: 105%;
    width: 4rem;
    animation-delay: 4.5s;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes nebula-drift {
    from {
      transform: translate(0, 0) scale(1);
    }
    to {
      transform: translate(1rem, -0.6rem) scale(1.15);
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(0.6) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.1) rotate(45deg);
    }
  }

  @keyframes meteor {
    0% {
      opacity: 0;
      transform: translate(0, 0) rotate(-35deg);
    }
    2% {
      opacity: 1;
    }
    12%,
    100% {
      opacity: 0;
      transform: translate(-16rem, 11.2rem) rotate(-35deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stars-a,
    .stars-b,
    .nebula,
    .sparkle {
      animation: none;
    }

    .meteor {
      display: none;
    }
  }
</style>
