<!-- src/ui/bot/FlashBanner/editor/FlashBannerEditor.vue -->
<template>
  <!-- プレビュー(クリックで短文・長文を切り替えて、スクロールを試せる) -->
  <HudPreview>
    <div class="cursor-pointer" @click="isLong = !isLong">
      <FlashBannerSelector
        :key="`${flashBanner.component}-${flashBanner.scrollSpeed}-${flashBanner.scrollReturnMode}-${isLong}`"
        editorPreview
        :settings="flashBanner"
        :message="sampleMessage"
        :color="flashBanner.color"
        :label-class="blinkClass"
        :fontFamily="fontFamily"
      />
    </div>
    <template #hudLeft>
      <div class="rounded bg-black/50 px-1 text-xs text-white">{{ t('uiSettings.flashBanner.previewHint') }}</div>
    </template>
  </HudPreview>

  <!-- 表示コンポーネントの選択 -->
  <DisplayStyleSelector
    :modelValue="flashBanner.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定(キャラがいないとき) -->
  <SettingItem
    labelKey="uiSettings.flashBanner.color.label"
    descriptionKey="uiSettings.flashBanner.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="flashBanner.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <!-- ラベル -->
    <SettingItem
      labelKey="uiSettings.flashBanner.label.label"
      descriptionKey="uiSettings.flashBanner.label.description"
      :showReset="true"
      @reset="resetField('label')"
    >
      <input
        type="text"
        class="input input-bordered w-full"
        :value="flashBanner.label"
        @input="(e) => update('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- ラベル・アイコンを右側にするか -->
    <SettingItem
      labelKey="uiSettings.flashBanner.showItemOnRight.label"
      descriptionKey="uiSettings.flashBanner.showItemOnRight.description"
    >
      <label class="flex cursor-pointer items-center">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="flashBanner.showItemOnRight"
          @change="(e) => update('showItemOnRight', (e.target as HTMLInputElement).checked)"
        />
        <span class="ml-2">
          {{ t(flashBanner.showItemOnRight ? 'uiSettings.flashBanner.right' : 'uiSettings.flashBanner.left') }}
        </span>
      </label>
    </SettingItem>
  </div>

  <!-- アイコンサイズ -->
  <SettingItem
    labelKey="uiSettings.flashBanner.iconSize.label"
    descriptionKey="uiSettings.flashBanner.iconSize.description"
    :showReset="true"
    @reset="resetField('iconSize')"
  >
    <div class="flex items-center gap-4">
      <input
        type="range"
        :min="FLASH_BANNER_ICON_SIZE.min"
        :max="FLASH_BANNER_ICON_SIZE.max"
        step="2"
        class="range range-primary flex-1"
        :value="flashBanner.iconSize"
        @input="(e) => update('iconSize', Number((e.target as HTMLInputElement).value))"
      />
      <div class="w-16 text-right">{{ flashBanner.iconSize * 4 }}px</div>
    </div>
  </SettingItem>

  <!-- スクロール速度 -->
  <SettingItem
    labelKey="uiSettings.flashBanner.scrollSpeed.label"
    descriptionKey="uiSettings.flashBanner.scrollSpeed.description"
    :showReset="true"
    @reset="resetField('scrollSpeed')"
  >
    <div class="flex items-center gap-4">
      <input
        type="range"
        :min="FLASH_BANNER_SCROLL_SPEED.min"
        :max="FLASH_BANNER_SCROLL_SPEED.max"
        step="10"
        class="range range-primary flex-1"
        :value="flashBanner.scrollSpeed"
        @input="(e) => update('scrollSpeed', Number((e.target as HTMLInputElement).value))"
      />
      <div class="w-24 text-right">
        {{ t('uiSettings.flashBanner.scrollSpeed.unit', { speed: flashBanner.scrollSpeed }) }}
      </div>
    </div>
  </SettingItem>

  <!-- スクロール折り返し(往復型のタイプだけ) -->
  <SettingItem
    v-if="usesScrollReturn"
    labelKey="uiSettings.flashBanner.scrollReturnMode.label"
    descriptionKey="uiSettings.flashBanner.scrollReturnMode.description"
    :showReset="true"
    @reset="resetField('scrollReturnMode')"
  >
    <div class="flex gap-4">
      <label v-for="mode in flashBannerReturnModes" :key="mode" class="flex cursor-pointer items-center gap-2">
        <input
          type="radio"
          name="flashBannerScrollReturnMode"
          class="radio radio-primary"
          :checked="flashBanner.scrollReturnMode === mode"
          @change="update('scrollReturnMode', mode)"
        />
        <span class="flex flex-col">
          <span class="font-medium">{{ t(`uiSettings.flashBanner.scrollReturnMode.${mode}.label`) }}</span>
          <span class="text-base-content/60 text-xs">
            {{ t(`uiSettings.flashBanner.scrollReturnMode.${mode}.description`) }}
          </span>
        </span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import {
    FLASH_BANNER_ICON_SIZE,
    FLASH_BANNER_SCROLL_SPEED,
    FlashBannerSchema,
    flashBannerReturnModes,
    type FlashBannerType,
  } from '@/types/ui'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import FlashBannerSelector from '../FlashBannerSelector.vue'
  import { getFlashBannerComponent, getFlashBannerComponentSets } from '../FlashBannerRegistry'
  import { useDelayedBlink } from '../composables/useDelayedBlink'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore

  const fontFamily = computed(() => data.value.ui.fontFamily)
  const flashBanner = computed(() => FlashBannerSchema.parse(data.value.ui.settings.flashBanner ?? {}))

  // プレビューの文言(クリックで長文に切り替えて、スクロールを確かめる)
  const isLong = ref(false)
  const sampleMessage = computed(() =>
    t(isLong.value ? 'uiSettings.flashBanner.sampleLong' : 'uiSettings.flashBanner.sampleShort')
  )

  // 切り替え時のラベル点滅(文言が変わったとき)
  const { blinkClass, triggerBlink, stopBlink } = useDelayedBlink()
  watch(isLong, () => triggerBlink(true))
  onUnmounted(stopBlink)

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = flashBanner.value.component
    if (!getFlashBannerComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getFlashBannerComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // 往復スクロール(scrollReturnMode)を使うタイプか(未登録の ID は使わない扱い)
  const usesScrollReturn = computed(() => getFlashBannerComponent(flashBanner.value.component)?.isScrollReturn ?? false)

  // 更新関数
  const update = <K extends keyof FlashBannerType>(field: K, value: FlashBannerType[K]) => {
    updateItemSettings('flashBanner', { [field]: value })
  }

  const resetField = (field: keyof FlashBannerType) => {
    update(field, FlashBannerSchema.parse({})[field])
  }
</script>
