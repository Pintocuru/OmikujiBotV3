<!-- src/editor/preview/TestComment/TestComment.vue -->
<template>
  <div class="card bg-base-200 border border-base-300 shadow-2xl w-full">
    <div class="card-body gap-2 p-2">
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-base-300 cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <h1 class="text-sm flex items-center gap-2">{{ t('editorPreview.testComment.title') }}</h1>

        <div class="flex items-center gap-1">
          <span class="text-xs opacity-60">
            {{ collapsed ? '▶' : '▼' }}
          </span>
        </div>
      </div>

      <!-- Accordion Body -->
      <template v-if="!collapsed">
        <!-- 想定ユーザー数 -->
        <div class="flex flex-col gap-1">
          <span class="text-xs opacity-60">
            {{ t('editorPreview.testComment.expectedUsers', { max: MOCK_USER_POOL_MAX }) }}
          </span>
          <div class="join w-full">
            <button
              v-for="n in MOCK_USER_POOL_PRESETS"
              :key="n"
              class="btn btn-xs btn-neutral join-item flex-1"
              :class="userCount === n ? 'btn-accent' : 'btn-neutral btn-outline'"
              @click="userCount = n"
            >
              {{ t('editorPreview.testComment.people', { count: n }) }}
            </button>
            <input
              type="number"
              min="1"
              :max="MOCK_USER_POOL_MAX"
              v-model.number="userCount"
              class="input input-bordered input-xs join-item w-16 text-center"
            />
            <button
              class="btn btn-xs btn-outline btn-neutral join-item tooltip tooltip-top"
              :data-tip="t('editorPreview.testComment.rebuildPool')"
              @click="rebuildPool"
            >
              {{ t('editorPreview.testComment.rebuild') }}
            </button>
          </div>
          <div class="join w-full">
            <button
              v-for="mode in pickModes"
              :key="mode"
              class="btn btn-xs join-item flex-1"
              :class="pickMode === mode ? 'btn-accent' : 'btn-neutral btn-outline'"
              @click="pickMode = mode"
            >
              {{ t(`editorPreview.testComment.pickMode.${mode}`) }}
            </button>
          </div>
        </div>

        <!-- 配信テーマ -->
        <div class="flex flex-col gap-1">
          <span class="text-xs opacity-60">{{ t('editorPreview.testComment.theme') }}</span>
          <select v-model="selectedTheme" class="select select-bordered select-xs w-full">
            <option v-for="key in COMMENT_THEME_KEYS" :key="key" :value="key">
              {{ t(`editorPreview.testComment.themes.${key}`) }}
            </option>
            <option value="custom">{{ t('editorPreview.testComment.customTheme') }}</option>
          </select>
          <textarea
            v-if="selectedTheme === 'custom'"
            v-model="customText"
            rows="4"
            class="textarea textarea-bordered textarea-xs w-full"
            :placeholder="t('editorPreview.testComment.customPlaceholder')"
          />
        </div>

        <!-- Interval -->
        <div class="join">
          <label class="label pr-2">
            <span class="label-text text-xs opacity-60">{{ t('editorPreview.testComment.interval') }}</span>
          </label>

          <input
            type="number"
            step="0.1"
            min="0.1"
            v-model.number="intervalSec"
            class="input input-bordered input-xs"
          />
        </div>

        <!-- Buttons -->
        <div class="join w-full">
          <button @click="sendComment" class="btn btn-xs btn-outline btn-neutral join-item flex-1">
            {{ t('editorPreview.testComment.send') }}
          </button>

          <button
            @click="toggleRunning"
            class="btn btn-xs join-item flex-1"
            :class="isRunning ? 'btn-ghost' : 'btn-primary'"
          >
            {{ isRunning ? t('editorPreview.testComment.stop') : t('editorPreview.testComment.auto') }}
          </button>

          <button @click="burstSend" class="btn btn-xs btn-warning join-item flex-1">×100</button>
        </div>

        <!-- 直近の送信 -->
        <p class="text-xs opacity-60 truncate" :title="lastCommentDisplay">
          {{
            t(
              count === 1
                ? 'editorPreview.testComment.sentCountOne'
                : 'editorPreview.testComment.sentCountOther',
              { count }
            )
          }}
          / {{ lastCommentDisplay }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, shallowRef, computed, watch, onUnmounted } from 'vue'
  import {
    COMMENT_THEME_KEYS,
    CommentThemeKey,
    createMockUserPool,
    MockUserPickMode,
    MOCK_USER_PICK_MODE_LABELS,
    MOCK_USER_POOL_MAX,
    MOCK_USER_POOL_PRESETS,
    pickTestComment,
  } from '@/common/MockUser'
  import { postComment } from '@/sdk/post/PostOneComme'
  import { getPostServiceId, resetPostServiceId } from '@/sdk/service/getPostServiceId'
  import { CommentPickSchema } from '@/types/subscribe'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const isRunning = ref(false)
  const intervalSec = ref(2)
  const count = ref(0)
  const lastComment = ref('')
  const lastCommentDisplay = computed(
    () => lastComment.value || t('editorPreview.testComment.initialComment')
  )
  const collapsed = ref(false)

  // 想定ユーザー数: 変更するとユーザープールを作り直す
  const userCount = ref(50)
  const pickModes = Object.keys(MOCK_USER_PICK_MODE_LABELS) as MockUserPickMode[]
  const pickMode = ref<MockUserPickMode>('regular')
  const pool = shallowRef(createMockUserPool(userCount.value))

  function rebuildPool() {
    pool.value = createMockUserPool(userCount.value)
  }
  watch(userCount, rebuildPool)

  // 配信テーマ
  const selectedTheme = ref<CommentThemeKey | 'custom'>('chat')
  const customText = ref('')
  const customComments = computed(() =>
    customText.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  let timer: ReturnType<typeof setTimeout> | null = null

  function toggleRunning() {
    isRunning.value = !isRunning.value
    if (isRunning.value) loop()
    else clearTimer()
  }

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = null
  }

  function loop() {
    if (!isRunning.value) return

    timer = setTimeout(
      async () => {
        await sendComment()
        loop()
      },
      Math.max(100, intervalSec.value * 1000)
    )
  }

  async function sendComment() {
    const user = pool.value.pick(pickMode.value)
    const comment =
      selectedTheme.value === 'custom'
        ? pickTestComment('chat', customComments.value)
        : pickTestComment(selectedTheme.value)

    const serviceId = await getPostServiceId()
    if (!serviceId) {
      resetPostServiceId() // 次回また取得し直す
      lastComment.value = t('editorPreview.testComment.unavailableService')
      if (isRunning.value) toggleRunning()
      return
    }

    try {
      await postComment(
        {
          service: { id: serviceId },
          comment: CommentPickSchema.parse({
            userId: user.userId,
            name: user.userName,
            comment,
            profileImage: getAvatarUrl(user.userName),
          }),
        },
        -5
      )

      count.value++
      lastComment.value = `${user.userName}: ${comment}`
    } catch (e) {
      console.error(e)
    }
  }

  function burstSend() {
    for (let i = 0; i < 100; i++) setTimeout(sendComment, i * 5)
  }

  onUnmounted(clearTimer)
</script>
