<!-- src/editor/dev/TestComment/TestComment.vue -->
<template>
  <div class="card bg-base-200 border border-base-300 shadow-2xl w-full">
    <div class="card-body gap-2 p-2">
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-base-300 cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <h1 class="text-sm flex items-center gap-2">テストコメント</h1>

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
          <span class="text-xs opacity-60">想定ユーザー数 (1〜{{ MOCK_USER_POOL_MAX }}人)</span>
          <div class="join w-full">
            <button
              v-for="n in MOCK_USER_POOL_PRESETS"
              :key="n"
              class="btn btn-xs join-item flex-1"
              :class="userCount === n ? 'btn-accent' : 'btn-outline'"
              @click="userCount = n"
            >
              {{ n }}人
            </button>
            <input
              type="number"
              min="1"
              :max="MOCK_USER_POOL_MAX"
              v-model.number="userCount"
              class="input input-bordered input-xs join-item w-16 text-center"
            />
            <button class="btn btn-xs btn-outline join-item" title="名前とIDを作り直す" @click="rebuildPool">
              再生成
            </button>
          </div>
          <div class="join w-full">
            <button
              v-for="mode in pickModes"
              :key="mode"
              class="btn btn-xs join-item flex-1"
              :class="pickMode === mode ? 'btn-accent' : 'btn-outline'"
              @click="pickMode = mode"
            >
              {{ MOCK_USER_PICK_MODE_LABELS[mode] }}
            </button>
          </div>
        </div>

        <!-- 配信テーマ -->
        <div class="flex flex-col gap-1">
          <span class="text-xs opacity-60">配信テーマ</span>
          <select v-model="selectedTheme" class="select select-bordered select-xs w-full">
            <option v-for="key in COMMENT_THEME_KEYS" :key="key" :value="key">
              {{ COMMENT_THEMES[key].label }}
            </option>
            <option value="custom">カスタム(自由入力)</option>
          </select>
          <textarea
            v-if="selectedTheme === 'custom'"
            v-model="customText"
            rows="4"
            class="textarea textarea-bordered textarea-xs w-full"
            placeholder="1行に1コメント(空のときは雑談になります)"
          />
        </div>

        <!-- Interval -->
        <div class="join">
          <label class="label pr-2">
            <span class="label-text text-xs opacity-60"> INTERVAL (SEC) </span>
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
          <button @click="sendComment" class="btn btn-xs btn-outline join-item flex-1">送信</button>

          <button
            @click="toggleRunning"
            class="btn btn-xs join-item flex-1"
            :class="isRunning ? 'btn-error' : 'btn-primary'"
          >
            {{ isRunning ? 'STOP' : 'AUTO' }}
          </button>

          <button @click="burstSend" class="btn btn-xs btn-warning join-item flex-1">×100</button>
        </div>

        <!-- 直近の送信 -->
        <p class="text-xs opacity-60 truncate" :title="lastComment">{{ count }}件 / {{ lastComment }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, shallowRef, computed, watch, onUnmounted } from 'vue'
  import {
    COMMENT_THEMES,
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
  import { ServiceMetaWatcher } from '@/sdk/subscribe/GetServiceMeta'
  import { CommentPickSchema } from '@/types/subscribe'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  // 投稿先サービス: わんコメのサービス一覧の先頭の id を使う(取得は1回だけ)
  let servicePromise: Promise<string | null> | null = null
  function resolveServiceId(): Promise<string | null> {
    servicePromise ??= ServiceMetaWatcher.getInstance()
      .fetchServices()
      .then((services) => services[0]?.id ?? null)
      .catch((e) => {
        console.error(e)
        return null
      })
    return servicePromise
  }

  const isRunning = ref(false)
  const intervalSec = ref(2)
  const count = ref(0)
  const lastComment = ref('(テストコメントが入ります)')
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

    const serviceId = await resolveServiceId()
    if (!serviceId) {
      servicePromise = null // 次回また取得し直す
      lastComment.value = '投稿先のサービスが取得できません(わんコメを確認してください)'
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

  async function burstSend() {
    for (let i = 0; i < 100; i++) setTimeout(sendComment, i * 5)
  }

  onUnmounted(clearTimer)
</script>
