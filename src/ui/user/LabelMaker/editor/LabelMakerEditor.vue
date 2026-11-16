<!-- src/ui/LabelMaker/editor/LabelMakerEditor.vue -->
<template>
  <!-- プレビュー (ダミーのユーザーで表示) -->
  <HudPreview :isAdminOnly="true">
    <LabelMakerSelector :users="previewUsers" :settings="labelMaker" :fontFamily="fontFamily" editorPreview />
  </HudPreview>

  <!-- 表示するコンポーネント -->
  <SettingItem
    labelKey="uiSettings.labelMaker.component.label"
    descriptionKey="uiSettings.labelMaker.component.description"
    layout="vertical"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="option in componentOptions"
        :key="option.id"
        class="badge badge-lg cursor-pointer whitespace-nowrap"
        :class="labelMaker.component === option.id ? (option.known ? 'badge-primary' : 'badge-error') : 'badge-outline'"
        :title="option.description"
        @click="update('component', option.id)"
      >
        {{ option.label }}
      </div>
    </div>
  </SettingItem>

  <!-- ユーザーの数え方 -->
  <SettingItem
    labelKey="uiSettings.labelMaker.target.label"
    descriptionKey="uiSettings.labelMaker.target.description"
    layout="vertical"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="target in labelMakerTargets"
        :key="target"
        class="badge badge-lg cursor-pointer whitespace-nowrap"
        :class="labelMaker.target === target ? 'badge-primary' : 'badge-outline'"
        @click="update('target', target)"
      >
        {{ t(`uiSettings.labelMaker.target.options.${target}`) }}
      </div>
    </div>
  </SettingItem>

  <!-- カラー設定 -->
  <SettingItem
    labelKey="uiSettings.labelMaker.color.label"
    descriptionKey="uiSettings.labelMaker.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="labelMaker.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- 表示件数 -->
  <SettingItem
    labelKey="uiSettings.labelMaker.limit.label"
    descriptionKey="uiSettings.labelMaker.limit.description"
    layout="vertical"
    :showReset="true"
    @reset="resetField('limit')"
  >
    <input
      type="number"
      min="1"
      max="100"
      class="input input-bordered w-24"
      :value="labelMaker.limit"
      @input="(e) => update('limit', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { LabelMakerSchema, labelMakerTargets, type LabelMakerType } from '@/types/ui'
  import { getLabelMakerComponent, getLabelMakerComponentSets } from '../LabelMakerRegistry'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import LabelMakerSelector from '@/ui/user/LabelMaker/LabelMakerSelector.vue'
  import { buildPreviewUsers } from '@/ui/user/LabelMaker/scripts/labelUsers'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const labelMaker = computed(() => LabelMakerSchema.parse(data.value.ui.settings.labelMaker ?? {}))
  const previewUsers = buildPreviewUsers()

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const currentDefinition = computed(() => getLabelMakerComponent(labelMaker.value.component))
  const componentOptions = computed(() => {
    const options: { id: string; label: string; description: string; known: boolean }[] = []
    if (!currentDefinition.value) {
      options.push({
        id: labelMaker.value.component,
        label: t('uiSettings.common.unregistered', { id: labelMaker.value.component }),
        description: t('uiSettings.common.unregisteredDescription'),
        known: false,
      })
    }
    for (const set of Object.values(getLabelMakerComponentSets())) {
      for (const [id, definition] of Object.entries(set)) {
        options.push({ id, label: t(definition.labelKey), description: t(definition.descriptionKey), known: true })
      }
    }
    return options
  })

  // 更新関数
  const update = <K extends keyof LabelMakerType>(field: K, value: LabelMakerType[K]) => {
    updateItemSettings('labelMaker', { [field]: value })
  }

  // リセット関数
  const resetField = (field: keyof LabelMakerType) => {
    update(field, LabelMakerSchema.parse({})[field])
  }
</script>
