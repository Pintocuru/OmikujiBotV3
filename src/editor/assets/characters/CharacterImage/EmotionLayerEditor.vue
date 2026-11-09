<!-- src/editor/assets/characters/CharacterImage/EmotionLayerEditor.vue -->
<template>
  <div class="space-y-2">
    <div class="flex items-center gap-1 mb-1">
      <div class="text-xs font-medium text-base-content/70">{{ t('characterImage.layer.title') }}</div>
      <HelpButton :title="t('characterImage.help.title')">
        <ImageSettingsInfo />
      </HelpButton>
    </div>

    <button type="button" class="btn btn-sm btn-secondary gap-2 w-full" @click="handleAddLayer">
      <Plus class="w-4 h-4" />
      {{ t('characterImage.layer.add') }}
    </button>

    <EmotionLayerRow
      v-for="(layer, index) in layers"
      :key="index"
      :path="layer"
      :index="index"
      :total="layers.length"
      :is-first="index === 0"
      :detecting="detecting"
      :warning="index === 0 ? detectWarning : ''"
      @update:path="handleLayerUpdate(index, $event)"
      @detect="runDetect(false)"
      @pick="pickingIndex = index"
      @move-up="handleMoveUp(index)"
      @move-down="handleMoveDown(index)"
      @remove="handleRemoveLayer(index)"
    />

    <ImageCandidateDialog
      :open="pickingIndex !== null"
      :files="imageFiles"
      :is-loading="isLoading"
      :character-key="selectedItemKey"
      :character-paths="otherEmotionPaths"
      :used-paths="usedPaths"
      :current-path="pickingIndex !== null ? (layers[pickingIndex] ?? '') : ''"
      @update:open="pickingIndex = null"
      @select="handlePick"
      @reload="reload"
    />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, onMounted, ref, watch } from 'vue'
  import { Plus } from 'lucide-vue-next'
  import HelpButton from '@/editor/parts/HelpButton.vue'
  import EmotionLayerRow from './EmotionLayerRow.vue'
  import ImageSettingsInfo from './ImageSettingsInfo.vue'
  import ImageCandidateDialog from './ImageCandidateDialog.vue'
  import { detectImagePath } from './composables/detectImagePath'
  import { useImageFiles } from './composables/useImageFiles'

  const { t } = useI18n()

  const props = defineProps<{
    src: string[]
    emotionKey: string
    selectedItemKey: string
    /** このキャラクターの他の感情で使っているパス (候補の1番目のグループ) */
    otherEmotionPaths: string[]
  }>()

  const emit = defineEmits<{
    'update:src': [src: string[]]
  }>()

  const layers = computed(() => (Array.isArray(props.src) ? props.src : []))

  const { imageFiles, isLoading, ensureLoaded, reload } = useImageFiles()

  // ── 画像の自動検出 (1枚目のみ) ───────────────────────────────────────────
  const detecting = ref(false)
  const detectWarning = ref('')

  const isFirstEmpty = () => !(layers.value[0] ?? '').trim()

  const setLayer = (index: number, path: string) => {
    const n = [...layers.value]
    n[index] = path
    emit('update:src', n)
  }

  // silent: ダイアログを開いたときの自動検出。見つからなくても警告は出さず、待っている間に入力されていたら何もしない
  const runDetect = async (silent: boolean) => {
    detecting.value = true
    detectWarning.value = ''
    try {
      await ensureLoaded()
      const found = await detectImagePath({
        characterKey: props.selectedItemKey,
        emotionKey: props.emotionKey,
        files: imageFiles.value,
      })
      if (found) {
        if (!silent || isFirstEmpty()) setLayer(0, found)
      } else if (!silent) {
        detectWarning.value = t('characterImage.layer.detectNotFound', {
          base: `${props.selectedItemKey}/${props.emotionKey}`,
        })
      }
    } finally {
      detecting.value = false
    }
  }

  // 1枚目が変わったら、古い警告は消す
  watch(
    () => layers.value[0],
    () => (detectWarning.value = '')
  )

  onMounted(() => {
    if (isFirstEmpty()) void runDetect(true)
  })

  // ── 候補の選択 ─────────────────────────────────────────────────────────────
  const pickingIndex = ref<number | null>(null)

  // 選んでいるレイヤー以外で、この感情が使っているパス (重複して選ばせない)
  const usedPaths = computed(() => layers.value.filter((path, i) => i !== pickingIndex.value && path.trim() !== ''))

  const handlePick = (path: string) => {
    if (pickingIndex.value === null) return
    setLayer(pickingIndex.value, path)
    pickingIndex.value = null
  }

  // ── レイヤー操作 ───────────────────────────────────────────────────────────
  const handleLayerUpdate = (index: number, value: string) => setLayer(index, value)
  const handleAddLayer = () => emit('update:src', [...layers.value, ''])
  const handleRemoveLayer = (index: number) =>
    emit(
      'update:src',
      layers.value.filter((_, i) => i !== index)
    )
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const n = [...layers.value]
    ;[n[index - 1], n[index]] = [n[index], n[index - 1]]
    emit('update:src', n)
  }
  const handleMoveDown = (index: number) => {
    if (index === layers.value.length - 1) return
    const n = [...layers.value]
    ;[n[index], n[index + 1]] = [n[index + 1], n[index]]
    emit('update:src', n)
  }
</script>
