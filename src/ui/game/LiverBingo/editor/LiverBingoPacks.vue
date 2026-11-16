<!-- src/ui/LiverBingo/editor/LiverBingoPacks.vue -->
<template>
  <div class="space-y-3">
    <!-- 一覧 -->
    <template v-if="!selected">
      <button type="button" class="btn btn-secondary btn-sm" :disabled="loading" @click="loadIndex">
        {{ loading ? t('uiSettings.liverBingo.packs.loading') : t('uiSettings.liverBingo.packs.load') }}
      </button>

      <p v-if="failed" class="text-sm text-error">{{ t('uiSettings.liverBingo.packs.indexError') }}</p>
      <p v-else-if="result" class="text-sm text-success">{{ result }}</p>

      <ul v-if="packs.length > 0" class="space-y-2">
        <li v-for="pack in packs" :key="pack.file" class="rounded border border-base-300 p-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="font-semibold">{{ pack.name }}</div>
              <p v-if="pack.description" class="text-sm opacity-70">{{ pack.description }}</p>
              <div class="mt-1 flex flex-wrap gap-1">
                <span v-for="tag in pack.tags" :key="tag" class="badge badge-ghost badge-sm">{{ tag }}</span>
              </div>
            </div>
            <button type="button" class="btn btn-sm shrink-0" :disabled="opening !== ''" @click="open(pack)">
              {{
                opening === pack.file
                  ? t('uiSettings.liverBingo.packs.loading')
                  : t('uiSettings.liverBingo.packs.select')
              }}
            </button>
          </div>
        </li>
      </ul>
      <p v-if="packError" class="text-sm text-error">{{ t('uiSettings.liverBingo.packs.packError') }}</p>
    </template>

    <!-- 選んだパックの中身と取り込み -->
    <template v-else>
      <div class="flex items-center justify-between gap-3">
        <div class="font-semibold">{{ selected.info.name }}</div>
        <button type="button" class="btn btn-ghost btn-sm" @click="selected = null">
          {{ t('uiSettings.liverBingo.packs.back') }}
        </button>
      </div>

      <p class="text-sm opacity-70">
        {{ t('uiSettings.liverBingo.packs.count', { count: selected.pack.items.length }) }}
      </p>
      <div class="flex max-h-48 flex-wrap gap-1 overflow-y-auto rounded border border-base-300 p-2">
        <span v-for="(item, index) in selected.pack.items" :key="index" class="badge badge-outline">
          {{ item.title }}
        </span>
      </div>

      <label v-if="selected.pack.fixed.length > 0" class="flex cursor-pointer items-start gap-2 text-sm">
        <input v-model="withFixed" type="checkbox" class="checkbox checkbox-sm mt-0.5" />
        <span>
          {{ t('uiSettings.liverBingo.packs.withFixed', { count: selected.pack.fixed.length }) }}
          <span class="block text-xs opacity-70">{{ t('uiSettings.liverBingo.packs.withFixedNote') }}</span>
        </span>
      </label>

      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-primary btn-sm" @click="addItems">
          {{ t('uiSettings.liverBingo.packs.add') }}
        </button>
        <button type="button" class="btn btn-sm" @click="replaceItems">
          {{ t('uiSettings.liverBingo.packs.replace') }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { LiverBingoItemType, LiverBingoSeedType } from '@/types/ui'
  import type { LiverBingoPackInfoType, LiverBingoPackType } from './packs/LiverBingoPackSchema'
  import { addPackItems, replaceFixedSeeds, replacePackItems } from './packs/packImport'
  import { useLiverBingoPacks } from './packs/useLiverBingoPacks'

  const props = defineProps<{
    randomSeeds: LiverBingoItemType[]
    cardSize: number
  }>()

  const emit = defineEmits<{
    /** seeds は、固定項目も取り込むときだけ入る */
    apply: [patch: { randomSeeds: LiverBingoItemType[]; seeds?: LiverBingoSeedType[] }]
  }>()

  const { t } = useI18n()
  const { packs, loading, failed, loadIndex, loadPack } = useLiverBingoPacks()

  const selected = ref<{ info: LiverBingoPackInfoType; pack: LiverBingoPackType } | null>(null)
  const opening = ref('') // 読み込み中のパックのファイル名
  const packError = ref(false)
  const withFixed = ref(true)
  const result = ref('')

  const open = async (info: LiverBingoPackInfoType) => {
    opening.value = info.file
    packError.value = false
    result.value = ''
    const pack = await loadPack(info.file)
    opening.value = ''
    if (pack) selected.value = { info, pack }
    else packError.value = true
  }

  // 固定項目も取り込むときの、固定項目の置き換え(入りきらなかった分は結果の文言で知らせる)
  const fixedPatch = () => {
    if (!selected.value || !withFixed.value || selected.value.pack.fixed.length === 0) return { patch: {}, text: '' }
    const { seeds, skipped } = replaceFixedSeeds(selected.value.pack.fixed, props.cardSize)
    const text = skipped > 0 ? t('uiSettings.liverBingo.packs.result.fixedSkipped', { skipped }) : ''
    return { patch: { seeds }, text }
  }

  const finish = (text: string) => {
    result.value = text
    selected.value = null
  }

  const addItems = () => {
    if (!selected.value) return
    const { items, added, skipped } = addPackItems(props.randomSeeds, selected.value.pack.items)
    const fixed = fixedPatch()
    emit('apply', { randomSeeds: items, ...fixed.patch })
    finish([t('uiSettings.liverBingo.packs.result.added', { added, skipped }), fixed.text].filter(Boolean).join(' '))
  }

  const replaceItems = () => {
    if (!selected.value) return
    if (props.randomSeeds.length > 0 && !window.confirm(t('uiSettings.liverBingo.packs.replaceConfirm'))) return
    const items = replacePackItems(selected.value.pack.items)
    const fixed = fixedPatch()
    emit('apply', { randomSeeds: items, ...fixed.patch })
    finish(
      [t('uiSettings.liverBingo.packs.result.replaced', { count: items.length }), fixed.text].filter(Boolean).join(' ')
    )
  }
</script>
