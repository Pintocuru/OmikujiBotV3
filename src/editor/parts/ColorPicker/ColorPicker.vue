<!-- src/editor/parts/ColorPicker/ColorPicker.vue -->
<template>
  <div class="bg-base-300 p-4 flex flex-col space-y-4">
    <!-- タブ -->
    <div role="tablist" class="tabs tabs-box tabs-sm flex-wrap">
      <button
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab-active': activeTab === 'my' }"
        @click="activeTab = 'my'"
      >
        {{ t('editorUi.colorPicker.tabs.my') }}
      </button>
      <button
        v-for="tab in COLOR_PRESET_TABS"
        :key="tab.key"
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ t(`editorUi.colorPicker.tabs.${tab.key}`) }}
      </button>
    </div>

    <!-- マイカラー(お気に入り + 最近使った色) -->
    <div v-if="activeTab === 'my'" class="flex flex-col gap-3">
      <section class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold">{{ t('editorUi.colorPicker.my.favorites') }}</h4>
          <button type="button" class="btn btn-sm" @click="toggleFavorite(currentSet)">
            {{
              isFavorite(currentSet)
                ? t('editorUi.colorPicker.my.removeCurrent')
                : t('editorUi.colorPicker.my.addCurrent')
            }}
          </button>
        </div>
        <div v-if="favorites.length" class="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <ColorThemeChip
            v-for="(set, i) in favorites"
            :key="`fav-${i}`"
            :theme="set"
            :favorite="true"
            :favorite-title="t('editorUi.colorPicker.my.removeFavorite')"
            @select="applySet(set)"
            @toggle-favorite="toggleFavorite(set)"
          />
        </div>
        <p v-else class="text-xs text-base-content/60">{{ t('editorUi.colorPicker.my.emptyFavorites') }}</p>
      </section>

      <section class="flex flex-col gap-2">
        <h4 class="text-sm font-bold">{{ t('editorUi.colorPicker.my.recent') }}</h4>
        <div v-if="recent.length" class="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <ColorThemeChip
            v-for="(set, i) in recent"
            :key="`recent-${i}`"
            :theme="set"
            :favorite="isFavorite(set)"
            :favorite-title="
              isFavorite(set) ? t('editorUi.colorPicker.my.removeFavorite') : t('editorUi.colorPicker.my.addFavorite')
            "
            @select="applySet(set)"
            @toggle-favorite="toggleFavorite(set)"
          />
        </div>
        <p v-else class="text-xs text-base-content/60">{{ t('editorUi.colorPicker.my.emptyRecent') }}</p>
      </section>
    </div>

    <!-- プリセット -->
    <div v-else class="grid grid-cols-4 sm:grid-cols-6 gap-2">
      <ColorThemeChip
        v-for="theme in activeThemes"
        :key="theme.label"
        :theme="theme"
        :title="theme.label"
        :favorite="isFavorite(theme)"
        :favorite-title="
          isFavorite(theme) ? t('editorUi.colorPicker.my.removeFavorite') : t('editorUi.colorPicker.my.addFavorite')
        "
        @select="applySet(theme)"
        @toggle-favorite="toggleFavorite(theme)"
      />
    </div>

    <!-- カラーピッカー -->
    <div class="flex flex-wrap gap-2">
      <div v-for="{ label, key } in colorFields" :key="key" class="form-control flex-1 min-w-16">
        <label class="label">
          <span class="label-text text-sm">{{ t(`editorUi.colorPicker.fields.${label}`) }}</span>
        </label>

        <input
          type="color"
          class="input input-bordered h-12 w-full"
          :value="modelValue[key]"
          @input="onUpdate(key, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { CharacterColorType } from '@/types/OmikujiData'
  import { COLOR_PRESET_TABS, type ColorSet, type PresetTabKey } from './presets'
  import { colorFields } from '@/editor/maps/parts/ColorPicker'
  import ColorThemeChip from './ColorThemeChip.vue'
  import { useColorHistory } from './useColorHistory'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: CharacterColorType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterColorType]
  }>()

  const { recent, favorites, pushRecent, isFavorite, toggleFavorite } = useColorHistory()

  // 現在の4色(お気に入り登録・履歴保存に使う)
  const toSet = (v: CharacterColorType): ColorSet => ({
    name: v.name,
    text: v.text,
    background: v.background,
    accent: v.accent,
  })
  const currentSet = computed(() => toSet(props.modelValue))

  // 保存があれば「マイカラー」、なければ最初のプリセットタブから開く
  const activeTab = ref<'my' | PresetTabKey>(
    recent.value.length || favorites.value.length ? 'my' : COLOR_PRESET_TABS[0].key
  )
  const activeThemes = computed(() => COLOR_PRESET_TABS.find((tab) => tab.key === activeTab.value)?.themes ?? [])

  // 色入力は連続して発火するので、操作が止まってから履歴に追加する
  const RECENT_DEBOUNCE_MS = 800
  let recentTimer: ReturnType<typeof setTimeout> | undefined

  const onUpdate = (key: keyof CharacterColorType, value: string) => {
    const next = { ...props.modelValue, [key]: value }
    emit('update:modelValue', next)

    clearTimeout(recentTimer)
    recentTimer = setTimeout(() => pushRecent(toSet(next)), RECENT_DEBOUNCE_MS)
  }

  const applySet = (set: ColorSet) => {
    clearTimeout(recentTimer)
    emit('update:modelValue', { ...props.modelValue, ...toSet(set) })
    pushRecent(toSet(set))
  }

  onBeforeUnmount(() => {
    // 閉じる直前の操作も取りこぼさない
    if (recentTimer !== undefined) {
      clearTimeout(recentTimer)
      pushRecent(currentSet.value)
    }
  })
</script>
