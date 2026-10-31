<!-- src/editor/shell/SaveMenu.vue -->
<!-- 保存の主ボタン + ▾メニュー。状況ごとの出し分けは useSaveActions にまとめてある -->
<template>
  <div class="join">
    <div class="indicator join-item">
      <span v-if="hasChanged" class="indicator-item badge badge-secondary badge-sm">{{
        t('navigation.hasChanged')
      }}</span>
      <button
        class="btn join-item"
        :class="[primary.class, !hasChanged ? 'btn-soft' : '', primary.large ? 'btn-lg' : 'btn-sm']"
        :disabled="primary.disabled"
        :title="primary.tip"
        @click="primary.run"
      >
        <span v-if="isBusy" class="loading loading-spinner loading-xs"></span>
        <Save v-else class="w-4 h-4" />
        {{ primary.label }}
      </button>
    </div>

    <!-- 保存先の選択(メニューがあるときだけ) -->
    <div v-if="menu.length > 0" class="dropdown dropdown-end join-item">
      <button tabindex="0" class="btn btn-sm btn-square" :class="primary.class" :title="t('shell.save.more')">
        <ChevronDown class="w-4 h-4" />
      </button>
      <ul
        tabindex="0"
        class="dropdown-content menu z-50 w-64 rounded-md border border-base-300 bg-base-200 text-base-content shadow-lg p-1"
      >
        <li v-for="entry in menu" :key="entry.id">
          <button class="flex items-center gap-2 text-xs" :disabled="isBusy" @click="runMenu(entry.run)">
            <component :is="entry.icon" class="w-4 h-4" />
            {{ entry.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ChevronDown, Save } from 'lucide-vue-next'
  import { useSaveActions } from './useSaveActions'

  const { t } = useI18n()
  const { hasChanged, isBusy, primary, menu } = useSaveActions()

  // 実行後にフォーカスを外して dropdown を閉じる
  const runMenu = (run: () => void | Promise<unknown>) => {
    ;(document.activeElement as HTMLElement)?.blur()
    void run()
  }
</script>
