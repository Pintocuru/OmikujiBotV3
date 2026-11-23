// src/console/game/OshikuraChain/composables/useTestComments.ts
// テストコメント: 想定ユーザー数のプールから投稿者を選び、わんコメにコメントを投稿する
// 投稿したコメントは、本番と同じ経路 (わんコメ → OneSDK の購読) でゲームに届く (editor の TestComment と同じ仕組み)
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { MOCK_USER_POOL_MAX, createMockUserPool, pickTestComment, type MockUserPickMode } from '@/common/MockUser'
import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
import { postComment } from '@/sdk/post/PostOneComme'
import { getPostServiceId, resetPostServiceId } from '@/sdk/service/getPostServiceId'
import { CommentPickSchema } from '@/types/subscribe'
import { oshikuraChainMessages } from '../maps/OshikuraChainMessageMap'

const MIN_INTERVAL_SECONDS = 0.1
const BURST_COUNT = 10
const BURST_GAP_MS = 20

export function useTestComments() {
  const userCount = ref(50)
  const pickMode = ref<MockUserPickMode>('regular')
  const intervalSeconds = ref(2)
  const isRunning = ref(false)
  const sentCount = ref(0)
  const notice = ref('')
  const pool = shallowRef(createMockUserPool(userCount.value))

  // 想定ユーザー数を変えたら、プールを作り直す (範囲外・空の入力は、範囲に収める)
  watch(userCount, (value) => {
    pool.value = createMockUserPool(Math.min(MOCK_USER_POOL_MAX, Math.max(1, Math.floor(value) || 1)))
  })

  let timer: ReturnType<typeof setTimeout> | null = null
  const clearTimer = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  const sendComment = async (): Promise<void> => {
    const user = pool.value.pick(pickMode.value)
    const serviceId = await getPostServiceId()
    if (!serviceId) {
      resetPostServiceId() // 次回また取得し直す
      notice.value = oshikuraChainMessages.test.unavailable
      if (isRunning.value) stop()
      return
    }
    try {
      await postComment(
        {
          service: { id: serviceId },
          comment: CommentPickSchema.parse({
            userId: user.userId,
            name: user.userName,
            comment: pickTestComment('chat'),
            profileImage: getAvatarUrl(user.userName),
          }),
        },
        -5
      )
      notice.value = ''
      sentCount.value++
    } catch (error) {
      console.error(error)
    }
  }

  const loop = () => {
    if (!isRunning.value) return
    timer = setTimeout(
      async () => {
        await sendComment()
        loop()
      },
      Math.max(MIN_INTERVAL_SECONDS, intervalSeconds.value) * 1000
    )
  }

  const stop = () => {
    isRunning.value = false
    clearTimer()
  }

  const toggleAuto = () => {
    if (isRunning.value) {
      stop()
      return
    }
    isRunning.value = true
    loop()
  }

  const burst = () => {
    for (let i = 0; i < BURST_COUNT; i++) setTimeout(sendComment, i * BURST_GAP_MS)
  }

  onBeforeUnmount(clearTimer)

  return { userCount, pickMode, intervalSeconds, isRunning, sentCount, notice, sendComment, toggleAuto, burst }
}
