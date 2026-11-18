<!-- src/editor/assets/placeholders/PlaceholderPreview.vue -->
<template>
  <div class="tooltip tooltip-bottom" :data-tip="t('placeholder.previewTooltip')">
    <button @click="handleDraw" class="btn btn-sm btn-outline gap-2" :disabled="!values.length">
      <Dices class="w-4 h-4" />
      {{ t('placeholder.drawTest') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { handleNormalizedValues, WeightValueType, WeightValuesArrayType } from '@/types/OmikujiData'
  import { processTestPlaceholder } from '@/editor/helpers/shared/processTestPlaceholder'

  import { notify } from '@/common/Notice/notify'
  import { Dices } from 'lucide-vue-next'
  import { calcWeightPercentages, drawByWeight } from '@/engine/DrawOmikuji/DrawOmikuji'
  import { postSpeech } from '@/sdk/post/PostOneComme'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  const props = defineProps<{
    values: WeightValuesArrayType
  }>()

  const { getAssets } = useGetAssetData()
  const placeholdersMap = computed(() => getAssets('placeholders'))

  // 抽選実行
  const draw = () => {
    const items = handleNormalizedValues(props.values)
    const drawn = drawByWeight(items)
    if (!drawn) return null
    return { drawn, percent: calcWeightPercentages(items)[items.indexOf(drawn)] }
  }

  // 結果表示
  const showResult = (drawn: WeightValueType, percent: number, message: string) => {
    notify.success(t('placeholder.drawResultTitle'), {
      text: t('placeholder.drawResultText', { content: message, weight: drawn.weight, percent }),
      durationMs: 15000,
    })
  }

  const showError = () => {
    notify.error(t('placeholder.drawResultTitle'), { text: t('placeholder.drawFailed') })
  }

  // メイン処理
  const handleDraw = () => {
    const result = draw()
    if (!result?.drawn.content) return showError()

    const message = processTestPlaceholder(result.drawn.content, placeholdersMap.value)
    showResult(result.drawn, result.percent, message.text)
    postSpeech(message.text)
  }
</script>
