<!-- src/editor/content/ItemEditor.vue -->
<!-- Events / Assets の 1 セクションのカテゴリ共通のエディター。中身は categoryContentMap の item で決まる -->
<template>
  <template v-if="selectedRecord">
    <!-- 補足(プラットフォームの注意など) -->
    <InformationCard v-if="content.noticeKey" variant="info" class="mt-4 p-4">
      {{ t(content.noticeKey) }}
    </InformationCard>

    <SubSection
      v-if="!isDisabled"
      :icon="content.section.icon"
      :title-key="content.section.labelKey"
      :description-key="content.section.descriptionKey"
    >
      <component :is="content.component" v-bind="bindings" />
    </SubSection>

    <!-- 無効のときのメッセージ(isEnabled を持つのは events だけ) -->
    <DisabledEventNotice v-else />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import type { BaseRecordType } from '@/types/core'
  import type { ItemContentDef } from '@/editor/types/apps'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useSelectedRecord } from '@/editor/content/composables/useSelectedRecord'
  import DisabledEventNotice from './DisabledEventNotice.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import SubSection from '@/editor/parts/SubSection.vue'

  const props = defineProps<{ content: ItemContentDef }>()

  const { t } = useI18n()
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  const { selectedRecord } = useSelectedRecord()

  // 無効にされたイベントは、設定を出さずに通知だけ出す
  const isDisabled = computed(() => (selectedRecord.value as { isEnabled?: boolean } | null)?.isEnabled === false)

  // 子エディターの更新を、選択中のアイテムへ書き戻す(modelField があればそのプロパティだけ更新する)
  const update = (value: unknown) => {
    const field = props.content.modelField
    if (!field) {
      selectedRecord.value = value as BaseRecordType
      return
    }
    // 配列は、同じ参照のまま書き込むと変更が伝わらないことがあるのでコピーする
    const next = Array.isArray(value) ? [...value] : value
    selectedRecord.value = { [field]: next } as unknown as BaseRecordType
  }

  // 子エディターに渡す props(v-model と、アイテムのキー)
  const bindings = computed(() => {
    const { modelField, keyProp } = props.content
    const record = selectedRecord.value as Record<string, unknown> | null
    const attrs: Record<string, unknown> = {}
    if (record && modelField !== null) {
      attrs.modelValue = modelField ? record[modelField] : record
      attrs['onUpdate:modelValue'] = update
    }
    if (keyProp && selectedItemKey.value) attrs[keyProp] = selectedItemKey.value
    return attrs
  })
</script>
