<!-- src/generator/App.vue -->
<template>
  <div class="bg-base-100 transparent-bg overflow-hidden">
    <!-- 接続状態インジケーター（全状態で常時マウント） -->
    <ConnectionStatusIndicator :status="appStore.status" />

    <!-- 初期化完了後のメイン表示 -->
    <div
      v-if="appStore.status === 'ready'"
      class="h-screen overflow-hidden"
      :class="[fontFamily]"
      data-theme="transparent"
    >
      <!-- このビルドで未登録の UI / layout / gameScript をデータが使っている: 無表示にせず「データ不一致」を表示 -->
      <DataMismatchNotice v-if="mismatches.length > 0" :unsupported="mismatches" class="m-2" />

      <!-- layout 指定あり: 専用レイアウトに委譲 -->
      <component v-if="layoutComponent" :is="layoutComponent" />

      <!-- 通常: settings に設定のある UI を表示 -->
      <template v-else v-for="item in activeComponents" :key="item.kind">
        <component :is="item.component" />
      </template>
    </div>

    <ErrorInfo v-else-if="appStore.status === 'error'" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { uiKinds, useFontFamily } from '@/types'
  import { useAppInitializer } from '@/generator/composables/useAppInitializer'
  import { useRuleProcessor } from '@/generator/composables/useRuleProcessor'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import ErrorInfo from '@/common/ErrorInfo/ErrorInfo.vue'
  import ConnectionStatusIndicator from '@/common/ErrorInfo/ConnectionStatusIndicator.vue'
  import { getLayoutLoader, getUiLoader } from '@/ui/uiRegistry'
  import DataMismatchNotice from '@/common/buildValidation/DataMismatchNotice.vue'
  import { defineGuardedAsyncComponent } from '@/common/buildValidation/guardedAsyncComponent'
  import { validateAgainstBuild } from '@/common/buildValidation/validateAgainstBuild'

  const appStore = useAppStore()
  const fontFamily = computed(() => useFontFamily(appStore.data.ui.fontFamily))

  // settings に設定がある UI だけ表示
  const activeComponents = computed(() => {
    const { settings } = appStore.data.ui
    return uiKinds
      .filter((kind) => settings[kind])
      .flatMap((kind) => {
        const loader = getUiLoader(kind)
        return loader ? [{ kind, component: defineGuardedAsyncComponent(loader, { type: 'ui', key: kind }) }] : [] // 未登録の UI は mismatches で通知
      })
  })

  // layout ベース
  const layoutComponent = computed(() => {
    const { layout } = appStore.data.ui
    const loader = layout ? getLayoutLoader(layout) : undefined
    return loader ? defineGuardedAsyncComponent(loader, { type: 'layout', key: layout }) : null
  })

  // データと登録内容(registry)から決まるため、store に持たず computed で求める(エディターの読み込み検証と同じ関数)
  const mismatches = computed(() => validateAgainstBuild(appStore.data))

  const { initialize } = useAppInitializer()
  onMounted(initialize)
  useRuleProcessor()
</script>
