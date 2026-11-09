<!-- src/editor/content/summary/CharacterSummary.vue -->
<!-- 選択中アイテムに関係するシナリオで使われているキャラクター。クリックでキャラクター管理へ移動し、一括変更もできる -->
<template>
  <!-- タイトル & キー名 -->
  <SettingItem layout="vertical" icon="Users" labelKey="connections.summary.characters">
    <div v-if="characters.length" class="flex gap-3 overflow-x-auto pb-2">
      <button
        v-for="character in characters"
        :key="character.key"
        type="button"
        class="flex w-20 shrink-0 flex-col items-center gap-1 rounded-lg p-1"
        :class="character.exists ? 'cursor-pointer hover:bg-base-300' : 'cursor-default'"
        :disabled="!character.exists"
        :title="character.exists ? character.name : t('connections.summary.undefinedCharacter', { key: character.key })"
        @click="goToCharacter(character)"
      >
        <div class="relative h-12 w-12 overflow-hidden rounded-lg bg-base-300">
          <LayerImage v-if="character.images.length" :layers="character.images" />
          <!-- キーが見つからない場合はハテナアイコン -->
          <div v-else class="flex h-full w-full items-center justify-center text-base-content/50">
            <ImageOff v-if="character.exists" class="h-6 w-6" />
            <CircleHelp v-else class="h-7 w-7 text-warning" />
          </div>
        </div>

        <span class="w-full truncate text-center text-xs font-medium">{{ character.name }}</span>
        <span v-if="!character.exists" class="w-full truncate text-center text-[0.65rem] text-warning">
          {{ t('connections.summary.undefinedCharacter', { key: character.key }) }}
        </span>
        <span v-else-if="!character.images.length" class="w-full truncate text-center text-[0.65rem] opacity-60">
          {{ t('connections.summary.noImage') }}
        </span>
      </button>
    </div>
    <p v-else class="text-sm opacity-60">{{ t('connections.summary.noCharacters') }}</p>

    <div v-if="allTargets.length" class="mt-2 flex flex-wrap gap-2">
      <CharacterChanger :targets="allTargets" />
      <IconKeyChanger :targets="allTargets" />
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { CircleHelp, ImageOff } from 'lucide-vue-next'
  import { useCharacterStats } from '@/editor/helpers/CharacterChanger/composables/useCharacterStats'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useCharacterTargets } from '../composables/useCharacterTargets'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()
  const navigationStore = useNavigationStore()
  const { getCharacter, getCharacterName, iconSrc } = useCharacterLookup()
  const { allTargets } = useCharacterTargets()
  const { uniqueCharacterKeys } = useCharacterStats(allTargets)

  const characters = computed(() =>
    uniqueCharacterKeys.value.map((key) => {
      const character = getCharacter(key)
      return {
        key,
        exists: !!character,
        name: character ? getCharacterName(key) || key : '？',
        images: character ? iconSrc(key, 'default') : [],
      }
    })
  )

  // キャラクター管理(characters)の該当キャラクターへ移動する
  const goToCharacter = (character: { key: string; exists: boolean }) => {
    if (!character.exists) return
    navigationStore.selectCategory('characters')
    navigationStore.selectItem(character.key)
  }
</script>
