<!-- src/editor/apps/dataPacks/DataPacks.vue -->
<template>
  <!-- ローディング -->
  <div v-if="loading" class="flex items-center gap-2 py-6 justify-center text-base-content/60">
    <span class="loading loading-spinner loading-sm" />
    <span class="text-sm">{{ t('dataPacks.loading') }}</span>
  </div>

  <!-- エラー -->
  <div v-else-if="error" class="alert alert-error text-sm">
    <span>{{ error }}</span>
  </div>

  <template v-else>
    <!-- Githubからダウンロードしてくれてありがとう！ -->
    <InformationCard variant="warning" icon="primary">
      <p>
        {{ t('dataPacks.intro.thanks') }}<br />
        {{ t('dataPacks.intro.free') }}<br />
        {{ t('dataPacks.intro.support') }}
      </p>
    </InformationCard>

    <div v-if="allTags.length > 0" class="flex flex-wrap items-center gap-2 mb-4">
      <span class="text-xs text-base-content/50">{{ t('dataPacks.filter.label') }}</span>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="badge badge-sm cursor-pointer transition-colors"
        :class="selectedTags.includes(tag) ? 'badge-primary' : 'badge-outline'"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
      <button v-if="selectedTags.length > 0" class="badge badge-sm badge-ghost cursor-pointer" @click="clearTags">
        ✕ {{ t('dataPacks.filter.clear') }}
      </button>
    </div>

    <!-- 空 -->
    <NoParamsCard v-if="isEmpty" :message="t('dataPacks.filter.empty')" />

    <!-- 一覧グリッド -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DataPackCard
        v-for="pack in packs"
        :key="pack.path"
        :pack="pack"
        :disabled="importManager.isLoading.value"
        :selected-tags="selectedTags"
        @replace="onReplace(pack)"
        @partial-load="onPartialLoad(pack)"
        @tag-click="toggleTag"
      />
    </div>
  </template>

  <!-- 更新ボタン -->
  <div class="mt-4 flex justify-end">
    <button class="btn btn-sm btn-outline" :disabled="loading" @click="fetchAll">
      <span v-if="loading" class="loading loading-spinner loading-xs" />
      <span v-else>{{ t('dataPacks.refresh') }}</span>
    </button>
  </div>

  <!-- インポートプレビューモーダル（部分読み込み用） -->
  <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { OmikujiDataType } from '@/types/OmikujiData'
  import { DataPackEntry } from '@/editor/types'
  import { useDataPacks } from './useDataPacks'
  import DataPackCard from './DataPackCard.vue'
  import ConfigImportModal from '@/editor/helpers/presetsImport/ConfigImportModal.vue'
  import { useImportManager } from '@/editor/helpers/presetsImport/composables/useImportManager'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  const { t } = useI18n()

  const { packs, loading, error, isEmpty, fetchAll, allTags, selectedTags, toggleTag, clearTags } = useDataPacks()
  const importManager = useImportManager()
  const omikujiStore = useOmikujiStore()

  onMounted(fetchAll)

  async function onReplace(pack: DataPackEntry) {
    const result = await swalModal.confirmDelete({
      title: t('dataPacks.replaceConfirm.title'),
      text: t('dataPacks.replaceConfirm.text', { name: pack.meta.name }),
      confirmButtonText: t('dataPacks.replaceConfirm.confirm'),
    })
    if (!result.isConfirmed) return

    try {
      const res = await importManager.loadFromJsonData(pack.json)
      if (!res.success) {
        await swalModal.error({
          title: t('dataPacks.loadError.title'),
          text:
            res.error === 'invalid-metadata'
              ? t('dataPacks.loadError.invalidMetadata')
              : res.error || t('dataPacks.loadError.unknown'),
        })
        return
      }

      // 現在値を退避
      const current = omikujiStore.data
      const settings = current.settings
      const id = current.meta.id

      // 読み込みデータに上書き
      const data = res.data as OmikujiDataType
      const merged: OmikujiDataType = {
        ...data,
        meta: {
          ...data.meta,
          id,
        },
        settings,
      }

      if (!omikujiStore.loadData(merged)) return // 読み込み拒否(エラー表示済み)
      omikujiStore.resetChangeState()

      await swalModal.success({
        title: t('dataPacks.loaded.title'),
        text: t('dataPacks.loaded.text', { name: pack.meta.name }),
      })
    } catch (err) {
      console.error('[DataPacks] replace error:', err)
      await swalModal.error({
        title: t('dataPacks.replaceFailed.title'),
        text: t('dataPacks.replaceFailed.console'),
      })
    }
  }

  async function onPartialLoad(pack: DataPackEntry) {
    try {
      const res = await importManager.loadFromJsonData(pack.json)
      if (!res.success) {
        await swalModal.error({
          title: t('dataPacks.loadError.title'),
          text:
            res.error === 'invalid-metadata'
              ? t('dataPacks.loadError.invalidMetadata')
              : res.error || t('dataPacks.loadError.unknown'),
        })
        return
      }
      importManager.generatePreview()
      importManager.openPreviewModal()
    } catch (err) {
      console.error('[DataPacks] partial-load error:', err)
      await swalModal.error({
        title: t('dataPacks.partialLoadFailed.title'),
        text: t('dataPacks.partialLoadFailed.console'),
      })
    }
  }
</script>
