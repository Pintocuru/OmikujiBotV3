<!-- src/common/ErrorInfo/ConnectionGuide.vue -->
<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-2">
    <div class="card bg-base-100 border border-warning w-full max-w-2xl shadow-lg">
      <div class="card-body gap-4 p-4 sm:p-6">
        <h2 class="flex items-center justify-center gap-2 text-warning text-lg sm:text-xl font-bold">
          <ShieldAlert class="w-6 h-6 shrink-0" />
          導入方法の確認が必要です
          <span class="text-sm font-normal">/ Setup required</span>
        </h2>

        <div role="alert" class="alert alert-warning">
          <div>
            <p class="text-sm">
              OBS 33 以降では、ローカルファイルからの わんコメ との通信が遮断されます。
              このテンプレートは、下記の方法で導入してください。
            </p>
            <p class="text-xs">
              OBS 33+ blocks OneComme API access from local files. Please install this template as shown below.
            </p>
          </div>
        </div>

        <!-- 導入方法の画像 -->
        <figure class="rounded-lg border border-base-300 bg-base-200 p-2">
          <img :src="GUIDE_IMAGE_URL" alt="わんコメの導入方法 / How to install with OneComme" class="w-full h-auto" />
        </figure>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ShieldAlert } from 'lucide-vue-next'

  // GitHub 上の導入方法画像 (docs/images にファイルを追加してから、ファイル名を差し替える)
  const GUIDE_IMAGE_URL =
    'https://raw.githubusercontent.com/Pintocuru/OmikujiBotV3/HEAD/docs/images/obs-browser-source-guide.webp'
</script>
