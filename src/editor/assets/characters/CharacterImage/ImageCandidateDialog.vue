<!-- src/editor/assets/characters/CharacterImage/ImageCandidateDialog.vue -->
<!-- レイヤーのパス候補を、検索付きの一覧から選ぶ。既定は「このキャラクターの画像」だけを出す -->
<template>
  <BaseDialog
    :open="open"
    :title="t('characterImage.candidate.title')"
    size="2xl"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <input
          v-model="query"
          type="text"
          class="input input-sm flex-1"
          :placeholder="t('characterImage.candidate.search')"
        />
        <div class="tooltip tooltip-left" :data-tip="t('characterImage.candidate.reload')">
          <button
            type="button"
            class="btn btn-sm btn-ghost btn-square"
            :aria-label="t('characterImage.candidate.reload')"
            :disabled="isLoading"
            @click="emit('reload')"
          >
            <span v-if="isLoading" class="loading loading-spinner loading-xs" />
            <RefreshCw v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <label class="flex items-center gap-2 text-xs cursor-pointer">
        <input v-model="includeOthers" type="checkbox" class="checkbox checkbox-xs" />
        {{ t('characterImage.candidate.showOthers', { n: othersCount }) }}
      </label>

      <p v-if="files.length === 0 && !isLoading" class="text-xs text-base-content/50">
        {{ t('characterImage.candidate.noList') }}
      </p>

      <div class="max-h-[50vh] overflow-y-auto space-y-3">
        <section v-for="group in groups" :key="group.key" class="space-y-1">
          <h4 class="text-xs font-medium text-base-content/70">
            {{ groupTitle(group.key) }}
          </h4>
          <ul class="space-y-0.5">
            <li v-for="candidate in group.candidates" :key="candidate.path">
              <button
                type="button"
                class="btn btn-ghost btn-xs w-full justify-start gap-2 font-mono font-normal"
                :disabled="candidate.used"
                @click="emit('select', candidate.path)"
              >
                <span class="truncate">{{ candidate.path }}</span>
                <span v-if="candidate.path === currentPath" class="badge badge-xs badge-primary shrink-0">
                  {{ t('characterImage.candidate.current') }}
                </span>
                <span v-else-if="candidate.used" class="badge badge-xs shrink-0">
                  {{ t('characterImage.candidate.used') }}
                </span>
              </button>
            </li>
          </ul>
        </section>
        <p v-if="groups.length === 0 && files.length > 0" class="text-xs text-base-content/50">
          {{ t('characterImage.candidate.empty') }}
        </p>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { RefreshCw } from 'lucide-vue-next'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { buildImageCandidates, type ImageCandidateGroupKey } from './composables/imageCandidates'

  const { t } = useI18n()

  const props = defineProps<{
    open: boolean
    /** サーバの画像一覧 (空なら未取得・取得失敗) */
    files: readonly string[]
    isLoading: boolean
    characterKey: string
    /** このキャラクターの他の感情で使っているパス */
    characterPaths: readonly string[]
    /** この感情の、編集中のレイヤー以外で使っているパス */
    usedPaths: readonly string[]
    /** 編集中のレイヤーの現在のパス */
    currentPath: string
  }>()

  const emit = defineEmits<{
    'update:open': [open: boolean]
    select: [path: string]
    reload: []
  }>()

  const query = ref('')
  const includeOthers = ref(false)

  const result = computed(() =>
    buildImageCandidates({
      files: props.files,
      characterKey: props.characterKey,
      characterPaths: props.characterPaths,
      usedPaths: props.usedPaths,
      query: query.value,
      includeOthers: includeOthers.value,
    })
  )
  const groups = computed(() => result.value.groups)
  const othersCount = computed(() => result.value.othersCount)

  const groupTitle = (key: ImageCandidateGroupKey) =>
    key === 'sameCharacter'
      ? t('characterImage.candidate.groupSameCharacter')
      : key === 'characterFolder'
        ? t('characterImage.candidate.groupFolder', { key: props.characterKey })
        : t('characterImage.candidate.groupOthers')
</script>
