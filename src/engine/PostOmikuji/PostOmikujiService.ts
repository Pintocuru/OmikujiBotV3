// src/engine/PostOmikuji/PostOmikujiService.ts
import { BOT_ICON } from './BotIcon'
import { ServiceMetaStore } from '@/generator/stores/MetaState/MetaStateService'
import { CharacterResolver } from '@/engine/CharacterResolver/CharacterResolver'
import { Service } from '@onecomme.com/onesdk/types/Service'
import { ServiceAPI } from '@/sdk/service/ServiceAPI'
import { CharacterType, OmikujiDataType, ScenarioStepMessageType, ScenarioStepType } from '@/types/OmikujiData'
import { executeWordParty } from '@/sdk/post/PostWordParty'
import { postComment, postSpeech } from '@/sdk/post/PostOneComme'
import { SendCommentSchema, SendCommentType } from '@/types/subscribe'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import { stripUserIconMarkup } from '@/common/UserIconMarkup/userIconMarkup'
import { describeError, showErrorNotice } from '@/generator/scripts/Notice/showNotice'

const MAX_REPEAT_COUNT = 30

/**
 * メッセージ投稿を管理するクラス
 */
export class PostOmikujiService {
  private readonly serviceAPI = ServiceAPI.getInstance()
  private readonly serviceMetaStore = ServiceMetaStore.getInstance()
  private readonly characterResolver: CharacterResolver
  private readonly basicDelaySeconds: number
  private services: Service[] = []
  private createdServiceIds = new Set<string>()

  constructor(omikujiData: OmikujiDataType) {
    this.characterResolver = new CharacterResolver(omikujiData.assets.characters)
    this.basicDelaySeconds = omikujiData.settings.generator.basicDelaySeconds
  }

  /**
   * 複数の投稿ステップを並列実行
   */
  async post(posts: ScenarioStepType[]): Promise<void> {
    this.services = (await this.serviceAPI.getServices()) ?? []
    await Promise.all(posts.map((post) => this.processPost(post)))
  }

  // ディスパッチ
  private async processPost(post: ScenarioStepType): Promise<void> {
    // enableSecondary が false なら全部投稿
    if (post.kind === 'message') await this.processMessagePost(post)

    // WordParty の投稿
    if (post.kind === 'wordParty') {
      await executeWordParty({
        wordPartyId: post.wordPartyId,
        repeat: this.resolveRepeatCount(post.repeat),
        delaySeconds: post.delaySeconds ?? 0,
      })
    }
  }

  // メッセージ投稿
  private async processMessagePost(post: ScenarioStepMessageType): Promise<void> {
    const bubble = cleanPostMessage(post.message)
    if (!bubble) return

    const { delaySeconds = 0, characterKey } = post
    const character = this.characterResolver.getCharacter(characterKey)
    const displayOption = character?.displayOption

    if (!displayOption) return // キャラクターが設定されていない場合は何もしない

    if (displayOption.mode === 'comment') {
      const frameId = await this.resolveFrameId(character)
      if (frameId) {
        this.postAsComment(bubble, character?.displayName, delaySeconds, frameId, displayOption.imageBase64)
      } else {
        postSpeech(bubble, this.withBasicDelay(delaySeconds)).catch(notifyPostError)
      }
      return
    }

    if (displayOption.mode === 'voice') {
      postSpeech(bubble, this.withBasicDelay(delaySeconds)).catch(notifyPostError)
    }
    // none / rpgVoice はわんコメ側では何もしない
  }

  private postAsComment(
    bubble: string,
    displayName: string = 'おみくじBOT',
    delaySeconds: number,
    frameId: string,
    imageBase64: string
  ): void {
    try {
      const sendComment = buildCommentRequest(frameId, bubble, displayName, imageBase64)
      // 呼び出し元は完了を待たない設計。失敗は catch で通知する(console への記録は delayPost 側)
      postComment(sendComment, this.withBasicDelay(delaySeconds)).catch(notifyPostError)
    } catch (error) {
      const msg = `キャラクターコメント投稿エラー: ${error}`
      console.error(msg)
      showErrorNotice(msg)
    }
  }

  private withBasicDelay(delay: number = 0): number {
    return delay + this.basicDelaySeconds
  }

  // サービス管理
  /**
   * キャラクターの frameId を解決し、未作成なら新規作成して返す。
   * 利用可能な枠がない場合は null を返す。
   */
  private async resolveFrameId(character: CharacterType | null): Promise<string | null> {
    const frameId = character?.displayOption.frameId || this.services[0]?.id || null
    if (!frameId) return null

    const alreadyExists = this.services.some((s) => s.id === frameId) || this.createdServiceIds.has(frameId)

    if (!alreadyExists) {
      await this.createService(character, frameId)
    }
    return frameId
  }

  private async createService(character: CharacterType | null, frameId: string): Promise<void> {
    const name = character?.name ?? '新しい枠'
    const backgroundColor = character?.color.background

    if (!backgroundColor) {
      console.warn('背景色が設定されていないため、作成に失敗しました')
      return
    }

    const newService = await this.serviceAPI.createService(name, frameId, backgroundColor)
    if (newService) {
      this.createdServiceIds.add(frameId)
      this.services = (await this.serviceAPI.getServices()) ?? []
    }
  }

  // ユーティリティ
  private resolveRepeatCount(repeat?: number | 'viewer' | 'upVote'): number {
    if (!repeat) return 1
    if (typeof repeat === 'number') return Math.min(repeat, MAX_REPEAT_COUNT)

    const meta = this.serviceMetaStore.getCurrent()
    if (!meta) {
      console.warn('メタデータが取得できないため、repeat を 1 に設定します')
      return 1
    }
    const value = repeat === 'viewer' ? meta.viewer : meta.upVote
    return Math.min(Math.max(value, 1), MAX_REPEAT_COUNT)
  }
}

//  Module-level utilities

/** 待たずに投げた投稿の失敗を通知する(同じ文言は通知側で 1 件にまとまる) */
function notifyPostError(error: unknown): void {
  showErrorNotice(`わんコメへの投稿に失敗しました: ${describeError(error)}`)
}

function cleanPostMessage(raw: string): string {
  return raw
    ? stripUserIconMarkup(raw)
        .replace(/<<[^>]+>>/g, '')
        .trim()
    : ''
}

function buildCommentRequest(frameId: string, comment: string, name: string, imageBase64: string): SendCommentType {
  return SendCommentSchema.parse({
    service: { id: frameId },
    comment: {
      userId: POST_SETTINGS.botUserId,
      name,
      comment,
      profileImage: imageBase64,
      badges: [{ url: BOT_ICON, label: 'おみくじBOT' }],
      nickname: ' ',
    },
  })
}
