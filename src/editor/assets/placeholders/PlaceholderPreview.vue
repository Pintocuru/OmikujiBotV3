<!-- src/editor/assets/placeholders/PlaceholderPreview.vue -->
<template>
  <div class="tooltip tooltip-bottom" :data-tip="t('placeholder.previewTooltip')">
    <button @click="handleDraw" class="btn btn-info" :disabled="!values.length">
      <Dices class="w-4 h-4" />
      {{ t('placeholder.drawTest') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { handelNormalizedValues, WeightValuesArrayType } from '@/types'
  import { processTestPlaceholder } from '@/editor/assets/PostFlow/preview/TestPlaceholderProcessor'

  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { Dices } from 'lucide-vue-next'
  import { addWeightPercentages, drawOmikuji, OmikujiWeightItem } from '@/common/omikuji/DrawOmikuji'
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
    const normalized = handelNormalizedValues(props.values)
    const no2 = addWeightPercentages(normalized)
    return drawOmikuji(no2)
  }

  // 結果表示
  const showResult = (drawn: OmikujiWeightItem, message: string) => {
    const { weight = 1, weightPercent = 0 } = drawn

    swalToast.success({
      title: t('placeholder.drawResultTitle'),
      html: t('placeholder.drawResultHtml', { content: message, weight, percent: weightPercent }),
      timer: 15000,
    })
  }

  const showError = () => {
    swalToast.error({
      title: t('placeholder.drawResultTitle'),
      text: t('placeholder.drawFailed'),
    })
  }

  // メイン処理
  const handleDraw = () => {
    const result = draw()
    if (!result?.content) return showError()

    const message = processTestPlaceholder(result.content, placeholdersMap.value)
    showResult(result, message.text)
    postSpeech(message.text)
  }
</script>
