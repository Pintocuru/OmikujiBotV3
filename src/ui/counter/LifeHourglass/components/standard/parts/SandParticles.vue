<!-- src/ui/LifeHourglass/components/standard/parts/SandParticles.vue -->
<template>
  <span
    v-for="p in visible"
    :key="p.key"
    :class="['lh-particle', `lh-${p.kind}`]"
    :style="{
      left: `${p.left}%`,
      width: `${p.size}px`,
      height: `${p.size}px`,
      animationDelay: `${p.delay}s`,
      animationDuration: `${p.duration}s`,
    }"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{ intensity?: number }>(), { intensity: 0 })

  const DUST_POOL = 20
  const SPARKLE_POOL = 8
  const GLOW_POOL = 4

  type ParticleKind = 'dust' | 'sparkle' | 'glow'

  interface Particle {
    key: string
    kind: ParticleKind
    left: number
    size: number
    duration: number
    delay: number
  }

  // 固定シードによる乱数
  const createRandom = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }

  const rand = createRandom(20261108)

  const createPool = (kind: ParticleKind, count: number, minSize: number, maxSize: number): Particle[] =>
    Array.from({ length: count }, (_, i) => {
      const duration = 4 + rand() * 5

      return {
        key: `${kind}-${i}`,
        kind,
        left: 5 + rand() * 90,
        size: minSize + rand() * (maxSize - minSize),
        duration,
        delay: -rand() * duration,
      }
    })

  // 細かな砂粒
  const dustPool = createPool('dust', DUST_POOL, 2, 4)

  // 大粒のきらめき
  const sparklePool = createPool('sparkle', SPARKLE_POOL, 5, 9)

  // 最大時の特大粒子
  const glowPool = createPool('glow', GLOW_POOL, 10, 14)

  const visible = computed(() => {
    const intensity = Math.min(1, Math.max(0, props.intensity))

    // 常時存在する砂粒
    const dustCount = Math.round(6 + (DUST_POOL - 6) * intensity)

    // 強度が上がるほど大粒が増える
    const sparkleCount = Math.round(SPARKLE_POOL * intensity ** 1.5)

    // 強度65%以上で特大粒子が登場
    const glowIntensity = Math.max(0, (intensity - 0.65) / 0.35)
    const glowCount = Math.round(GLOW_POOL * glowIntensity ** 1.5)

    return [...dustPool.slice(0, dustCount), ...sparklePool.slice(0, sparkleCount), ...glowPool.slice(0, glowCount)]
  })
</script>

<style scoped>
  .lh-particle {
    position: absolute;
    top: 10%;
    display: block;
    border-radius: 50%;
    background: var(--lh-accent);
    pointer-events: none;
    opacity: 0;
    animation: lh-fall linear infinite;
  }

  /* 細かな砂粒 */
  .lh-dust {
    box-shadow:
      0 0 4px var(--lh-accent),
      0 0 7px var(--lh-accent);
  }

  /* 大粒のきらめき */
  .lh-sparkle {
    background: radial-gradient(circle, #fff 0%, var(--lh-accent) 65%);
    box-shadow:
      0 0 5px var(--lh-accent),
      0 0 10px var(--lh-accent),
      0 0 16px var(--lh-accent);
  }

  .lh-sparkle::before,
  .lh-sparkle::after {
    content: '';
    position: absolute;
    inset: -50%;
    border-radius: 50%;
    background:
      linear-gradient(90deg, transparent 45%, #fff 49%, #fff 51%, transparent 55%),
      linear-gradient(0deg, transparent 45%, #fff 49%, #fff 51%, transparent 55%);
    opacity: 0.85;
    animation: lh-twinkle 1.8s ease-in-out infinite;
  }

  /* 特大の光 */
  .lh-glow {
    background: radial-gradient(circle, #fff 0%, #fff4c0 25%, var(--lh-accent) 70%);
    box-shadow:
      0 0 8px #fff,
      0 0 14px var(--lh-accent),
      0 0 24px var(--lh-accent),
      0 0 36px var(--lh-accent);
  }

  .lh-glow::before,
  .lh-glow::after {
    content: '';
    position: absolute;
    inset: -100%;
    background:
      linear-gradient(90deg, transparent 47%, #fff 49.5%, #fff 50.5%, transparent 53%),
      linear-gradient(0deg, transparent 47%, #fff 49.5%, #fff 50.5%, transparent 53%);
    opacity: 0.95;
    animation: lh-twinkle 1.4s ease-in-out infinite;
  }

  .lh-glow::after {
    transform: rotate(45deg);
    animation-delay: -0.7s;
  }

  /* 上から下へ落下 */
  @keyframes lh-fall {
    0% {
      top: 10%;
      opacity: 0;
      transform: scale(0.6);
    }

    15% {
      opacity: 1;
      transform: scale(1);
    }

    80% {
      opacity: 0.85;
    }

    100% {
      top: 90%;
      opacity: 0;
      transform: scale(0.8);
    }
  }

  /* 光の明滅 */
  @keyframes lh-twinkle {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(0.7);
    }

    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lh-particle,
    .lh-sparkle::before,
    .lh-glow::before,
    .lh-glow::after {
      animation-duration: 12s;
    }
  }
</style>
