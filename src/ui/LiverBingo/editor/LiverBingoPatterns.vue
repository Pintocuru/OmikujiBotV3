<!-- src/ui/LiverBingo/editor/LiverBingoPatterns.vue -->
<template>
  <div class="space-y-3">
    <!-- 保存先 -->
    <p class="text-xs opacity-70">
      {{
        t(isServer ? 'uiSettings.liverBingo.patterns.storage.server' : 'uiSettings.liverBingo.patterns.storage.browser')
      }}
    </p>

    <!-- 今の設定を、新しいパターンとして保存 -->
    <div class="flex gap-2">
      <input
        v-model="newName"
        type="text"
        maxlength="100"
        class="input input-bordered input-sm w-full"
        :placeholder="t('uiSettings.liverBingo.patterns.namePlaceholder')"
        @keydown.enter="saveNew"
      />
      <button
        type="button"
        class="btn btn-secondary btn-sm shrink-0"
        :disabled="busy || newName.trim() === ''"
        @click="saveNew"
      >
        {{ t('uiSettings.liverBingo.patterns.save') }}
      </button>
    </div>

    <p v-if="error" class="text-sm text-error">{{ t(`uiSettings.liverBingo.patterns.error.${error}`) }}</p>
    <p v-else-if="message" class="text-sm text-success">{{ message }}</p>

    <!-- 保存済み -->
    <p v-if="!loading && patterns.length === 0 && !error" class="text-sm opacity-70">
      {{ t('uiSettings.liverBingo.patterns.empty') }}
    </p>

    <ul v-if="patterns.length > 0" class="space-y-2">
      <li v-for="pattern in patterns" :key="pattern.id" class="rounded border border-base-300 p-3">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="truncate font-semibold">{{ pattern.name }}</div>
            <div class="text-xs opacity-70">
              {{
                t('uiSettings.liverBingo.patterns.summary', {
                  size: pattern.cardSize,
                  fixed: pattern.fixedCount,
                  random: pattern.randomCount,
                })
              }}
              / {{ formatDate(pattern.updatedAt) }}
            </div>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="btn btn-primary btn-xs" :disabled="busy" @click="apply(pattern)">
              {{ t('uiSettings.liverBingo.patterns.apply') }}
            </button>
            <button type="button" class="btn btn-xs" :disabled="busy" @click="overwrite(pattern)">
              {{ t('uiSettings.liverBingo.patterns.overwrite') }}
            </button>
            <button
              type="button"
              class="btn btn-error btn-xs btn-square"
              :disabled="busy"
              :aria-label="t('uiSettings.liverBingo.patterns.remove')"
              @click="removePattern(pattern)"
            >
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, toRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Trash2 } from 'lucide-vue-next'
  import type { LiverBingoPatternContentType, LiverBingoPatternInfoType } from '@/types/ui'
  import { useLiverBingoPatterns } from './patterns/useLiverBingoPatterns'

  const props = defineProps<{
    /** 今のカードの設定(保存する中身) */
    current: LiverBingoPatternContentType
    /** サーバーに接続しているか(true ならサーバー、false ならこのブラウザに保存する) */
    isServer: boolean
  }>()

  const emit = defineEmits<{
    /** 保存済みのパターンを、今のカードの設定に読み込む */
    apply: [content: LiverBingoPatternContentType]
  }>()

  const { t, locale } = useI18n()
  const { patterns, loading, error, save, load, remove } = useLiverBingoPatterns(toRef(props, 'isServer'))

  const newName = ref('')
  const message = ref('')
  const busy = ref(false)

  const formatDate = (time: number) => new Date(time).toLocaleString(locale.value)

  // 操作の結果を知らせる(失敗のときは useLiverBingoPatterns の error が出る)
  const withBusy = async (task: () => Promise<string | null>) => {
    busy.value = true
    message.value = ''
    const result = await task()
    if (result) message.value = result
    busy.value = false
  }

  const saveNew = () =>
    withBusy(async () => {
      const name = newName.value.trim()
      if (name === '') return null
      if (!(await save(name, props.current))) return null
      newName.value = ''
      return t('uiSettings.liverBingo.patterns.result.saved', { name })
    })

  const overwrite = (pattern: LiverBingoPatternInfoType) =>
    withBusy(async () => {
      if (!window.confirm(t('uiSettings.liverBingo.patterns.overwriteConfirm', { name: pattern.name }))) return null
      if (!(await save(pattern.name, props.current, pattern.id))) return null
      return t('uiSettings.liverBingo.patterns.result.overwritten', { name: pattern.name })
    })

  const apply = (info: LiverBingoPatternInfoType) =>
    withBusy(async () => {
      if (!window.confirm(t('uiSettings.liverBingo.patterns.applyConfirm', { name: info.name }))) return null
      const pattern = await load(info.id)
      if (!pattern) return null
      emit('apply', { cardSize: pattern.cardSize, seeds: pattern.seeds, randomSeeds: pattern.randomSeeds })
      return t('uiSettings.liverBingo.patterns.result.applied', { name: info.name })
    })

  const removePattern = (pattern: LiverBingoPatternInfoType) =>
    withBusy(async () => {
      if (!window.confirm(t('uiSettings.liverBingo.patterns.removeConfirm', { name: pattern.name }))) return null
      if (!(await remove(pattern.id))) return null
      return t('uiSettings.liverBingo.patterns.result.removed', { name: pattern.name })
    })
</script>
