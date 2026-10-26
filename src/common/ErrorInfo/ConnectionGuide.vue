<!-- src/common/ErrorInfo/ConnectionGuide.vue -->
<template>
  <div v-if="store.guideVisible" class="guide">
    <h2>OBS 33 以降をお使いの場合</h2>
    <p>
      OBS 33 からのセキュリティ強化により、ローカルファイルからの わんコメ API 通信が遮断されるようになりました。
      (わんコメ 9.1.5 の対応事項と同じ変更です)
    </p>
    <ol>
      <li>このブラウザソースのプロパティを開く</li>
      <li>「ローカルファイル」のチェックを外す</li>
      <li>以下の URL を貼り付けて「OK」</li>
    </ol>
    <input id="guide-url" :value="store.templateUrl" readonly />
    <button @click="copy">URLをコピー</button>
  </div>
</template>

<script setup lang="ts">
  // http://absolute は非セキュアコンテキストのため
  // navigator.clipboard は使えない場合がある → 手動選択にフォールバック
  async function copy() {
    try {
      await navigator.clipboard.writeText(store.templateUrl)
    } catch {
      const el = document.querySelector('#guide-url') as HTMLInputElement
      el?.select()
      document.execCommand('copy')
    }
  }
</script>
