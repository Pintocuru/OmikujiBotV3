<!-- src/ui/LifeHourglass/components/standard/parts/SandBowlDeco.vue -->
<template>
  <!-- 装飾: 輪(ゆっくり回る目盛り)・砂時計の透かし・落ちる砂。同接が強いほど流れが速く太くなる -->
  <svg class="lh-deco" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="96" class="lh-ring lh-ring-outer" />
    <circle cx="100" cy="100" r="91" class="lh-ring lh-ring-inner" />
    <g class="lh-spin">
      <circle cx="100" cy="100" r="85" class="lh-ring lh-ring-ticks" />
    </g>
    <g class="lh-hourglass">
      <path
        class="lh-glass"
        d="M66 40 L134 40 C134 78 112 92 104 100 C112 108 134 122 134 160 L66 160 C66 122 88 108 96 100 C88 92 66 78 66 40 Z"
      />
      <path class="lh-sand" d="M74 46 L126 46 C123 66 110 80 100 90 C90 80 77 66 74 46 Z" />
      <path class="lh-sand" d="M71 158 C84 144 95 136 100 136 C105 136 116 144 129 158 Z" />

      <rect class="lh-cap" x="58" y="33" width="84" height="6" rx="3" />
      <rect class="lh-cap" x="58" y="161" width="84" height="6" rx="3" />
    </g>
  </svg>
</template>

<style scoped>
  .lh-deco {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .lh-ring {
    fill: none;
    stroke: var(--lh-accent);
  }

  .lh-ring-outer {
    stroke-width: 1.6;
  }

  .lh-ring-inner {
    stroke-width: 0.5;
    opacity: 0.7;
  }

  .lh-ring-ticks {
    stroke-width: 3;
    stroke-dasharray: 1 6.1;
    opacity: 0.55;
  }

  .lh-spin {
    transform-box: view-box;
    transform-origin: center;
    animation: lh-spin 90s linear infinite;
  }

  /* 砂時計の透かし(文字の邪魔にならない濃さ) */
  .lh-hourglass {
    opacity: 0.5;
    stroke: var(--lh-name);
  }

  .lh-glass {
    fill: none;

    stroke: var(--lh-name);
    stroke-width: 1.4;
  }

  .lh-sand {
    stroke: var(--lh-name);
    opacity: 0.55;
  }

  .lh-cap {
    stroke: var(--lh-name);
  }

  .lh-stream {
    stroke: var(--lh-name);
    stroke-dasharray: 2 5;
    animation: lh-stream 1.2s linear infinite;
  }

  @keyframes lh-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes lh-stream {
    to {
      stroke-dashoffset: -7;
    }
  }
</style>
