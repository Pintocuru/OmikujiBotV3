<!-- src/editor/apps/appInfo/settings/GeneratorSettingsEditor.vue -->
<template>
  <!-- ジェネレーター設定 -->
  <SubSectionHeader icon="Sparkles" title="ジェネレーター設定" description="UI・効果音など、配信挙動に関わる設定" />

  <!-- 基本ディレイ時間設定 -->
  <SettingItem
    label="投稿の基本遅延時間"
    description="BOTメッセージの表示や投稿を遅延（秒）"
    :showReset="true"
    @reset="resetMap.basicDelaySeconds"
  >
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs">
        <span>{{ settings.generator.basicDelaySeconds }}s</span>
      </div>

      <input
        type="range"
        min="0"
        max="3"
        step="0.5"
        class="range range-accent"
        :value="settings.generator.basicDelaySeconds"
        @input="(e) => updateField('basicDelaySeconds', Number((e.target as HTMLInputElement).value))"
      />
    </div>
  </SettingItem>

  <!-- 効果音を鳴らす -->
  <SettingItem label="効果音を鳴らす" description="BOTの効果音を再生するか">
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="settings.generator.soundEnabled"
        @change="handleMuteSound"
      />
      <span>{{ settings.generator.soundEnabled ? '音を鳴らす' : 'ミュートする' }}</span>
    </label>
  </SettingItem>

  <!-- VisitUserにユーザーを入れない -->
  <SettingItem
    label="ユーザーを記録しないリスト"
    description="BOTや管理者の名前を正規表現で指定"
    :showReset="true"
    @reset="resetMap.ignoreUserPattern"
  >
    <MessageTextEditor v-model="bubbleText" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsSchema, SoundKeyType } from '@/types'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import type { SettingsType } from '@/types/OmikujiData/SettingsSchema'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import MessageTextEditor from '@/editor/assets/postAction/Message/MessageTextEditor.vue'
  import { playSoundResolved } from '@/common/sounds'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const settings = computed(() => data.value.settings)

  const updateField = <K extends keyof SettingsType>(field: K, value: any) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  // 効果音切り替え
  const handleMuteSound = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked
    updateField('soundEnabled', checked)
  }

  // ignoreUserPattern の双方向バインディング
  const bubbleText = computed<string>({
    get: () => settings.value.ignoreUserPattern ?? '',
    set: (value: string) => {
      const normalized = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('|')
      updateField('ignoreUserPattern', normalized)
    },
  })

  const resetField = (field: keyof typeof settings.value) => {
    const defaults = SettingsSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    ignoreUserPattern: () => resetField('ignoreUserPattern'),
    basicDelaySeconds: () => resetField('basicDelaySeconds'),
    includeExternalComments: () => resetField('includeExternalComments'),
  }

  // 効果音: OFF → ON になったときにプレビュー再生
  const playRandomSound = () => {
    const keys = Object.keys(soundMap) as SoundKeyType[]
    if (keys.length === 0) return
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    playSoundResolved(randomKey)
  }

  watch(
    () => settings.value.soundEnabled,
    (newVal, oldVal) => {
      if (!oldVal && newVal) playRandomSound()
    }
  )
</script>
