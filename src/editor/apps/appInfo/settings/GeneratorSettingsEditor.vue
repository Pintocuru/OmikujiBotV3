<!-- src/editor/apps/appInfo/settings/GeneratorSettingsEditor.vue -->
<template>
  <!-- ジェネレーター設定 -->
  <SubSectionHeader
    icon="Sparkles"
    :title="t('appInfoEditor.settings.generator.title')"
    :description="t('appInfoEditor.settings.generator.description')"
  />

  <!-- コメント購読タイプ -->
  <SettingItem
    icon="MessageSquare"
    v-if="isDev"
    variant="warning"
    :label="t('appInfoEditor.settings.generator.commentType.label')"
    :description="t('appInfoEditor.settings.generator.commentType.description')"
  >
    <select
      :value="settings.generator.commentType"
      @change="(e) => update('generator', { commentType: (e.target as HTMLSelectElement).value as CommentModeType })"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="type in commentModeTypes" :key="type" :value="type">
        {{ t(`appInfoEditor.settings.generator.commentType.options.${type}`) }}
      </option>
    </select>
  </SettingItem>

  <!-- 基本ディレイ時間設定 -->
  <SettingItem
    icon="Timer"
    :label="t('appInfoEditor.settings.generator.basicDelaySeconds.label')"
    :description="t('appInfoEditor.settings.generator.basicDelaySeconds.description')"
    :showReset="true"
    @reset="reset('generator', 'basicDelaySeconds')"
  >
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs">
        <span>{{ settings.generator.basicDelaySeconds }}s</span>
      </div>

      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        class="range range-accent"
        :value="settings.generator.basicDelaySeconds"
        @input="(e) => update('generator', { basicDelaySeconds: Number((e.target as HTMLInputElement).value) })"
      />
    </div>
  </SettingItem>

  <!-- 効果音を鳴らす -->
  <SettingItem
    icon="Volume2"
    :label="t('appInfoEditor.settings.generator.soundEnabled.label')"
    :description="t('appInfoEditor.settings.generator.soundEnabled.description')"
    :showReset="true"
    @reset="reset('generator', 'soundEnabled')"
  >
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="settings.generator.soundEnabled"
        @change="handleMuteSound"
      />
      <span>{{
        t(
          settings.generator.soundEnabled
            ? 'appInfoEditor.settings.generator.soundEnabled.on'
            : 'appInfoEditor.settings.generator.soundEnabled.off'
        )
      }}</span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { playSoundResolved } from '@/common/sounds'
  import { soundMap } from '@/maps/OmikujiData'
  import { commentModeTypes, type CommentModeType, type SoundKeyType } from '@/types/OmikujiData'
  import { isDev } from '@/types/env'

  const { t } = useI18n()
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateSettingsSection: update, resetSettingsField: reset } = omikujiStore

  const settings = computed(() => data.value.settings)

  // 効果音切り替え
  const handleMuteSound = (event: Event) => {
    update('generator', { soundEnabled: (event.target as HTMLInputElement).checked })
  }

  // 効果音: OFF → ON になったときにプレビュー再生
  const playRandomSound = () => {
    const keys = Object.keys(soundMap) as SoundKeyType[]
    if (keys.length === 0) return
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    playSoundResolved(randomKey)
  }

  watch(
    () => settings.value.generator.soundEnabled,
    (newVal, oldVal) => {
      if (!oldVal && newVal) playRandomSound()
    }
  )
</script>
