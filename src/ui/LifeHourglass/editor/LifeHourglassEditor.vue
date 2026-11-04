<!-- src/ui/LifeHourglass/editor/LifeHourglassEditor.vue -->
<template>
  <SectionCard
    label="命の砂時計"
    icon="Hourglass"
    variant="warning"
    :description="isExperimental ? '実験中のUIです。気に入れば安定版に昇格し、失敗すれば削除されます。' : undefined"
  >
    <!-- プレビュー -->
    <HudPreview :isAdminOnly="true">
      <LifeHourglassSelector :settings="lifeHourglass" :grains="0" editorPreview />
    </HudPreview>

    <!-- 表示コンポーネントの選択 -->
    <DisplayStyleSelector
      :modelValue="lifeHourglass.component"
      :options="componentOptions"
      @update:modelValue="(val) => update('component', val)"
    />

    <!-- 隅のメッセージ -->
    <SettingItem label="隅のメッセージ" description="画面の隅に、世界観の小さなメッセージを表示します" layout="vertical">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="lifeHourglass.showMessage"
        @change="(e) => update('showMessage', (e.target as HTMLInputElement).checked)"
      />
    </SettingItem>

    <!-- 前回までの砂粒の引き継ぎ -->
    <SettingItem
      label="前回までの砂粒を引き継ぐ"
      :description="carryOverDescription"
      layout="vertical"
      :showWarning="!isPersistent"
    >
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="lifeHourglass.carryOver"
        :disabled="!isPersistent"
        @change="(e) => update('carryOver', (e.target as HTMLInputElement).checked)"
      />
    </SettingItem>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useLifeHourglassStore } from '@/ui/LifeHourglass/composables/useLifeHourglassStore'
  import { isExperimentalUiKind } from '@/types/OmikujiData'
  import { LifeHourglassSchema, type LifeHourglassType } from '@/types/ui'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import LifeHourglassSelector from '@/ui/LifeHourglass/LifeHourglassSelector.vue'
  import { getLifeHourglassComponent, getLifeHourglassComponentSets } from '../LifeHourglassRegistry'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore

  const lifeHourglass = computed(() => LifeHourglassSchema.parse(data.value.ui.settings.lifeHourglass ?? {}))

  // 実験中の UI であることを表示に反映させる
  const isExperimental = isExperimentalUiKind('lifeHourglass')

  // 保存先が仮実装(メモリのみ)の間は、引き継ぎのトグルを無効にする
  const { isPersistent } = storeToRefs(useLifeHourglassStore())
  const carryOverDescription = computed(() =>
    isPersistent
      ? 'ON: 前回までの通算を表示します / OFF: 今回の配信ぶんだけを表示します'
      : 'サーバーがないため、現在は使用できません(起動しごとに 0 に戻ります)'
  )

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = lifeHourglass.value.component
    if (!getLifeHourglassComponent(currentId)) options[currentId] = { label: `未登録: ${currentId}` }
    for (const set of Object.values(getLifeHourglassComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: definition.label }
    }
    return options
  })

  // 更新関数
  const update = <K extends keyof LifeHourglassType,>(field: K, value: LifeHourglassType[K]) => {
    updateItemSettings('lifeHourglass', { [field]: value })
  }
</script>
