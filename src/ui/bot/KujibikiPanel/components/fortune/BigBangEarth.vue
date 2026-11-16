<!-- src/ui/KujibikiPanel/components/fortune/BigBangEarth.vue -->
<!-- 地球を模したおみくじ箱 -->
<template>
  <div class="earth-scene pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
    <div class="earth-orbit orbit-one absolute rounded-full" />
    <div class="earth-orbit orbit-two absolute rounded-full" />
    <div class="earth-glow absolute rounded-full" />
    <div class="earth relative overflow-hidden rounded-full">
      <div class="earth-land land-one absolute" />
      <div class="earth-land land-two absolute" />
      <div class="earth-land land-three absolute" />
      <div class="earth-shine absolute inset-0 rounded-full" />
    </div>
  </div>
</template>

<style scoped>
  .earth-scene {
    z-index: 0;
    transform: translateY(-0.25rem);
    opacity: 0.72;
  }

  .earth {
    width: 13rem;
    height: 13rem;
    background:
      radial-gradient(ellipse at 35% 28%, rgba(186, 230, 253, 0.95), transparent 8%),
      radial-gradient(ellipse at 35% 35%, #38bdf8 0%, #0369a1 42%, #082f49 72%, #020617 100%);
    box-shadow:
      inset -1.2rem -0.8rem 2rem rgba(2, 6, 23, 0.9),
      inset 0.5rem 0.2rem 1rem rgba(186, 230, 253, 0.35),
      0 0 2rem rgba(56, 189, 248, 0.55);
  }

  .earth-land {
    background: linear-gradient(135deg, #86b879, #286b59 70%, #164e63);
    filter: drop-shadow(0 0 3px rgba(134, 239, 172, 0.3));
    opacity: 0.85;
  }

  .land-one {
    top: 18%;
    left: 24%;
    width: 34%;
    height: 27%;
    border-radius: 62% 38% 52% 48% / 42% 40% 60% 58%;
    transform: rotate(-24deg);
  }

  .land-two {
    top: 48%;
    left: 48%;
    width: 28%;
    height: 38%;
    border-radius: 38% 62% 44% 56% / 35% 45% 55% 65%;
    transform: rotate(18deg);
  }

  .land-three {
    top: 30%;
    left: 66%;
    width: 18%;
    height: 16%;
    border-radius: 55% 45% 60% 40%;
    transform: rotate(30deg);
  }

  .earth-shine {
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0.22),
      transparent 38%,
      transparent 70%,
      rgba(2, 6, 23, 0.45)
    );
  }

  .earth-glow {
    width: 15rem;
    height: 15rem;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.25), transparent 68%);
    filter: blur(8px);
  }

  .earth-orbit {
    width: 16rem;
    height: 5rem;
    border: 1px solid rgba(186, 230, 253, 0.35);
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.18);
  }

  .orbit-one {
    transform: rotate(-25deg);
  }

  .orbit-two {
    transform: rotate(55deg);
    opacity: 0.5;
  }
</style>
