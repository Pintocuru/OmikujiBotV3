<!-- src/editor/assets/scenarios/gameScript/GameScriptParamFields.vue -->
<template>
  <!-- 宣言された項目ごとの入力欄 -->
  <SettingItem
    v-for="input in meta.inputs"
    :key="input.key"
    icon="Code2"
    :label-key="`mapText.gameParams.${gameKey}.${input.key}.label`"
    :description-key="`mapText.gameParams.${gameKey}.${input.key}.description`"
  >
    <select
      v-if="input.type === 'enum'"
      class="select select-bordered select-sm w-full"
      :value="parsed.values[input.key] ?? input.default"
      @change="setValue(input.key, ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in optionsOf(input)" :key="option" :value="option">
        {{ option === '' ? t('scenarioStep.gameScript.optionNone') : option }}
      </option>
    </select>
    <input
      v-else-if="input.type === 'number'"
      type="number"
      class="input input-bordered input-sm w-full"
      :min="input.min"
      :max="input.max"
      :placeholder="input.default === undefined ? '' : String(input.default)"
      :value="parsed.values[input.key] ?? ''"
      @input="setValue(input.key, ($event.target as HTMLInputElement).value)"
    />
    <input
      v-else
      type="text"
      class="input input-bordered input-sm w-full"
      :placeholder="input.default ?? ''"
      :value="parsed.values[input.key] ?? ''"
      @input="setValue(input.key, ($event.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- [[変数名]] などを使うときの直接入力 -->
  <SettingItem
    icon="Code2"
    label-key="scenarioStep.gameScript.paramRawLabel"
    description-key="scenarioStep.gameScript.paramRawDesc"
  >
    <input
      :value="queryString"
      type="text"
      class="input input-bordered input-sm w-full"
      :placeholder="t('scenarioStep.gameScript.paramPlaceholder')"
      @input="emit('update:queryString', ($event.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- ゲームが書き込む変数 -->
  <SettingItem
    v-if="outputs.length > 0"
    icon="ListChecks"
    label-key="scenarioStep.gameScript.outputsLabel"
    description-key="scenarioStep.gameScript.outputsDesc"
  >
    <ul class="flex flex-col gap-1 text-sm">
      <li v-for="output in outputs" :key="output.name" class="flex flex-wrap items-center gap-2">
        <code class="rounded bg-base-100 px-1">{{ placeholderOf(output) }}</code>
        <span>{{ output.label ?? t(`mapText.gameOutputs.${gameKey}.${output.name}`) }}</span>
      </li>
    </ul>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import type { GameScriptKey } from '@/types/OmikujiData'
  import type { GameInputField, GameOutputVariable, GameScriptMeta } from '@/games/types'
  import { buildQueryString, parseQueryFields } from '@/games/shared/queryFields'

  const { t } = useI18n()

  const props = defineProps<{
    gameKey: GameScriptKey
    meta: GameScriptMeta
    queryString: string
  }>()

  const emit = defineEmits<{ 'update:queryString': [value: string] }>()

  const parsed = computed(() => parseQueryFields(props.queryString, props.meta.inputs))

  // 固定の出力変数 + 入力値で決まる出力変数
  const outputs = computed<GameOutputVariable[]>(() => [
    ...props.meta.outputs,
    ...(props.meta.dynamicOutputs?.(parsed.value.values) ?? []),
  ])

  const setValue = (key: string, value: string) => {
    const { values, extra } = parsed.value
    emit('update:queryString', buildQueryString({ ...values, [key]: value }, extra, props.meta.inputs))
  }

  // 現在の値が選択肢にないとき([[変数名]] など)は、その値を選択肢に足して、表示が崩れないようにする
  const optionsOf = (input: Extract<GameInputField, { type: 'enum' }>): string[] => {
    const current = parsed.value.values[input.key]
    return current && !input.options.includes(current) ? [...input.options, current] : [...input.options]
  }

  const placeholderOf = (output: GameOutputVariable): string =>
    output.perUser ? `[[${output.name}_<<userId>>]]` : `[[${output.name}]]`
</script>
