<!-- src/editor/events/core/OmikujiSections.vue -->
<template>
  <!-- おみくじ設定 -->
  <SectionCard
    id="section-omikujiSet"
    icon="ListChecks"
    label-key="categorySections.omikujiSet.label"
    description-key="categorySections.omikujiSet.description"
  >
    <div class="space-y-4">
      <!-- みくじ箱の選択(イベント側のみ) -->
      <slot name="choice" />

      <MikujiSettings v-if="hasMikujiBox" :omikujiKey="omikujiKey" />
      <!-- 存在しないみくじ箱を参照しているとき -->
      <NoParamsCard
        v-else-if="omikujiKey"
        iconName="Package"
        :message="t('eventCore.boxChoiceEditor.omikujiKey.none')"
        :sub="t('eventCore.omikujiSections.keyMissing')"
      />
      <!-- 未選択のとき -->
      <NoParamsCard
        v-else
        :message="t('eventCore.boxChoiceEditor.omikujiKey.none')"
        :sub="t('eventCore.omikujiSections.keyUnselected')"
      />
    </div>
  </SectionCard>

  <!-- シナリオ設定 -->
  <SectionCard
    v-if="box.selectedItem?.kind === 'steps'"
    id="section-scenario"
    icon="Box"
    label-key="categorySections.scenario.label"
    description-key="categorySections.scenario.description"
  >
    <ScenarioChoiceEditor :modelValue="box.selectedItem" @update:modelValue="box.updateSelected" />
    <ScenarioStepsEditor v-if="scenario" v-model="steps" :current-key="scenario.key" />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import ScenarioChoiceEditor from './ScenarioChoiceEditor.vue'
  import MikujiSettings from '@/editor/assets/mikuji/MikujiSettings.vue'
  import ScenarioStepsEditor from '@/editor/assets/ScenarioStep/ScenarioStepsEditor.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useBoxOmikujiList } from '@/editor/assets/mikuji/composables/useBoxOmikujiList'
  import { EventCategoryType } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    omikujiKey: string
    category: EventCategoryType | 'mikuji'
  }>()

  const { updateAsset } = useOmikujiStore()
  const { getAsset, hasAsset } = useGetAssetData()

  const hasMikujiBox = computed(() => !!props.omikujiKey && hasAsset('mikuji', props.omikujiKey))

  const box = reactive(useBoxOmikujiList(computed(() => props.omikujiKey)))

  const scenario = computed(() => {
    const item = box.selectedItem
    if (!item || item.kind !== 'steps' || !item.stepKey) return null
    return getAsset('scenarios', item.stepKey) ?? null
  })

  const steps = computed({
    get: () => scenario.value?.steps ?? [],
    set: (newSteps) => {
      if (!scenario.value) return
      updateAsset('scenarios', scenario.value.key, { steps: [...newSteps] })
    },
  })
</script>
