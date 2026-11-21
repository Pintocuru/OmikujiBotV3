<!-- src/console/shell/ConsoleHeader.vue -->
<template>
  <header class="flex items-center justify-between p-2 bg-primary text-primary-content shadow-md z-40">
    <div class="flex items-center gap-4 min-w-0">
      <!-- タイトル -->
      <h1 class="font-extrabold text-lg whitespace-nowrap">おみくじBOT コンソール</h1>

      <!-- 各種コンテンツ: 製品版は 1 列のタブ、開発版はカテゴリごとのサブメニュー -->
      <nav :role="isDev ? undefined : 'tablist'" aria-label="コンソール画面" class="flex items-center gap-1 min-w-0">
        <template v-for="group in groups" :key="group.category ?? 'all'">
          <!-- 開発版: カテゴリのボタンを押すと、その画面の一覧が開く -->
          <div v-if="group.category" class="dropdown">
            <div
              tabindex="0"
              role="button"
              class="flex items-center gap-1 px-2 py-1 text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer"
              :class="
                isActive(group)
                  ? 'border-primary-content font-semibold'
                  : 'border-transparent opacity-80 hover:opacity-100'
              "
            >
              {{ group.label }}
              <template v-if="isActive(group) && current">
                <span class="opacity-60" aria-hidden="true">›</span>
                <component
                  :is="resolveLucideIcon(getConsoleViewMeta(current).icon)"
                  class="w-4 h-4"
                  aria-hidden="true"
                />
                {{ getConsoleViewMeta(current).label }}
              </template>
              <ChevronDown class="w-3 h-3" aria-hidden="true" />
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 text-base-content rounded-box z-50 mt-1 w-56 p-1 shadow-lg"
            >
              <li v-for="key in group.keys" :key="key">
                <button type="button" :class="{ 'menu-active': key === current }" @click="selectAndClose(key)">
                  <component :is="resolveLucideIcon(getConsoleViewMeta(key).icon)" class="w-4 h-4" aria-hidden="true" />
                  {{ getConsoleViewMeta(key).label }}
                  <span v-if="getConsoleViewMeta(key).launch === 'window'" aria-hidden="true">↗</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- 製品版: そのままタブで並べる -->
          <template v-else>
            <button
              v-for="key in group.keys"
              :key="key"
              type="button"
              role="tab"
              :aria-selected="key === current"
              class="flex items-center gap-1 px-2 py-1 text-sm border-b-2 transition-colors whitespace-nowrap"
              :class="
                key === current
                  ? 'border-primary-content font-semibold'
                  : 'border-transparent opacity-80 hover:opacity-100'
              "
              @click="emit('select', key)"
            >
              <component :is="resolveLucideIcon(getConsoleViewMeta(key).icon)" class="w-4 h-4" aria-hidden="true" />
              {{ getConsoleViewMeta(key).label }}
              <span v-if="getConsoleViewMeta(key).launch === 'window'" aria-hidden="true">↗</span>
            </button>
          </template>
        </template>
      </nav>
    </div>

    <!-- 右側 -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- サーバーとの接続状態 -->
      <ServerStatus />

      <!-- テーマ切り替えボタン -->
      <div class="tooltip tooltip-left" :data-tip="themeTitle">
        <button type="button" class="btn btn-sm btn-square" :aria-label="themeTitle" @click="toggleTheme">
          <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronDown, Moon, Sun } from '@lucide/vue'
  import { isDev } from '@/common/AppEnv'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useConsoleTheme } from '../composables/useConsoleTheme'
  import { useServerConnection } from '../composables/useServerConnection'
  import { consoleCategoryMap, getConsoleViewMeta, type ConsoleViewKey } from '../maps/ConsoleViewMap'
  import type { ConsoleViewCategory } from '../types'
  import ServerStatus from './ServerStatus.vue'

  const props = defineProps<{
    keys: ConsoleViewKey[]
    current: ConsoleViewKey | undefined
  }>()

  const emit = defineEmits<{
    select: [key: ConsoleViewKey]
  }>()

  const { isDark, themeTitle, toggleTheme } = useConsoleTheme()
  const { connected } = useServerConnection()

  // 別ウィンドウで開く画面は、サーバーに接続できているときだけ表示する
  const visibleKeys = computed(() =>
    props.keys.filter((key) => getConsoleViewMeta(key).launch !== 'window' || connected.value)
  )

  type TabGroup = { category?: ConsoleViewCategory; label?: string; keys: ConsoleViewKey[] }

  // 製品版は項目が少ないので、グループ分けせず 1 列で並べる。開発版はカテゴリごと (空のカテゴリは出さない)
  const groups = computed<TabGroup[]>(() => {
    if (!isDev) return [{ keys: visibleKeys.value }]
    return (Object.keys(consoleCategoryMap) as ConsoleViewCategory[])
      .map((category) => ({
        category,
        label: consoleCategoryMap[category],
        keys: visibleKeys.value.filter((key) => getConsoleViewMeta(key).category === category),
      }))
      .filter((group) => group.keys.length > 0)
  })

  // 表示中の画面が属するカテゴリか (別ウィンドウで開く画面は current にならないので、embedded のカテゴリだけ強調される)
  const isActive = (group: TabGroup) => !!props.current && group.keys.includes(props.current)

  // daisyUI の dropdown はフォーカスで開閉するので、選んだらフォーカスを外して閉じる
  const selectAndClose = (key: ConsoleViewKey) => {
    emit('select', key)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }
</script>
