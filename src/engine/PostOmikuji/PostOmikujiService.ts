// src/engine/PostOmikuji/PostOmikujiService.ts
import { BOT_ICON } from './BotIcon'
import { ServiceMetaStore } from '@/generator/stores/MetaState/MetaStateService'
import { CharacterManager } from '@/engine/CharacterManager/CharacterManager'
import { Service } from '@onecomme.com/onesdk/types/Service'
import { generateDummyVisitRecords } from '@/common/MockUser/MockGenerators'
import { ServiceAPI } from '@/sdk/service/ServiceAPI'
import { CharacterType, OmikujiDataType, PostFlowMessageType, PostFlowType } from '@/types/OmikujiData'
import { executeWordParty } from '@/sdk/post/PostWordParty'
import { postComment, postSpeech, postSystemMessage } from '@/sdk/post/PostOneComme'
import { SendCommentSchema, SendCommentType } from '@/types/subscribe'
import { POST_SETTINGS } from '@/sdk/PostSettings'

const MAX_REPEAT_COUNT = 30

/**
 * メッセージ投稿を管理するクラス
 */
export class PostOmikujiService {
  private readonly serviceAPI = ServiceAPI.getInstance()
  private readonly serviceMetaStore = ServiceMetaStore.getInstance()
  private readonly characterManager: CharacterManager
  private readonly basicDelaySeconds: number
  private services: Service[] = []
  private createdServiceIds = new Set<string>()

  constructor(omikujiData: OmikujiDataType) {
    this.characterManager = new CharacterManager(omikujiData.assets.characters)
    this.basicDelaySeconds = omikujiData.settings.generator.basicDelaySeconds
  }

  /**
   * 複数の投稿アクションを並列実行
   */
  async post(posts: PostFlowType[]): Promise<void> {
    this.services = (await this.serviceAPI.getServices()) ?? []
    await Promise.all(posts.map((post) => this.processPost(post)))
  }

  //  Private: ディスパッチ
  private async processPost(post: PostFlowType): Promise<void> {
    // enableSecondary が false なら全部投稿
    if (post.kind === 'message') await this.processMessagePost(post)

    // コメントテスター の投稿
    if (post.kind === 'bot') {
      const dummyUser = generateDummyVisitRecords(1)[0]
      await postSystemMessage(post.message, {
        username: post.botName ? post.botName : dummyUser.userName,
        delaySeconds: post.delaySeconds,
      })
    }

    // WordParty の投稿
    if (post.kind === 'wordParty') {
      await executeWordParty({
        wordPartyId: post.wordPartyId,
        repeat: this.resolveRepeatCount(post.repeat),
        delaySeconds: post.delaySeconds ?? 0,
      })
    }
  }

  //  Private: メッセージ投稿
  private async processMessagePost(post: PostFlowMessageType): Promise<void> {
    const bubble = cleanPostMessage(post.message)
    if (!bubble) return

    const { delaySeconds = 0, characterKey } = post
    const character = this.characterManager.getCharacter(characterKey)
    const displayOption = character?.displayOption

    if (!displayOption) return // キャラクターが設定されていない場合は何もしない

    if (displayOption.mode === 'comment') {
      const frameId = await this.resolveFrameId(character)
      if (frameId) {
        this.postAsComment(bubble, character?.displayName, delaySeconds, frameId, displayOption.imageBase64)
      } else {
        postSpeech(bubble, this.withBasicDelay(delaySeconds))
      }
      return
    }

    if (displayOption.mode === 'voice') {
      postSpeech(bubble, this.withBasicDelay(delaySeconds))
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
      postComment(sendComment, this.withBasicDelay(delaySeconds))
    } catch (error) {
      const msg = `キャラクターコメント投稿エラー: ${error}`
      console.error(msg)
      postSystemMessage(msg)
    }
  }

  private withBasicDelay(delay: number = 0): number {
    return delay + this.basicDelaySeconds
  }

  //  Private: サービス管理

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

  //  Private: ユーティリティ

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

function cleanPostMessage(raw: string): string {
  return raw
    ? raw
        .replace(/\{\{[^}]+\}\}/g, '')
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
