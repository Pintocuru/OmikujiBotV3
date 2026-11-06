<!-- src/editor/assets/placeholders/PlaceholderPreview.vue -->
<template>
  <div class="tooltip tooltip-bottom" :data-tip="t('placeholder.previewTooltip')">
    <button @click="handleDraw" class="btn btn-sm btn-info" :disabled="!values.length">
      <Dices class="w-4 h-4" />
      {{ t('placeholder.drawTest') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { handelNormalizedValues, WeightValueType, WeightValuesArrayType } from '@/types/OmikujiData'
  import { processTestPlaceholder } from '@/editor/helpers/shared/processTestPlaceholder'

  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
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
    const items = handelNormalizedValues(props.values)
    const drawn = drawByWeight(items)
    if (!drawn) return null
    return { drawn, percent: calcWeightPercentages(items)[items.indexOf(drawn)] }
  }

  // 結果表示
  const showResult = (drawn: WeightValueType, percent: number, message: string) => {
    swalToast.success({
      title: t('placeholder.drawResultTitle'),
      html: t('placeholder.drawResultHtml', { content: message, weight: drawn.weight, percent }),
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
    if (!result?.drawn.content) return showError()

    const message = processTestPlaceholder(result.drawn.content, placeholdersMap.value)
    showResult(result.drawn, result.percent, message.text)
    postSpeech(message.text)
  }
</script>
