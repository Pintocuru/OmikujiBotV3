//

export interface ServiceMetaStoreType {
  subscribe(fn: (meta: MetaUpdateEvent) => void): () => void
  subscribeError(fn: (error: unknown) => void): () => void
  getStatus(): MetaServiceStatus
  getLastError(): unknown
  getCurrent(): NormalizedMeta | null
  getPeak(): { upVote: number; viewer: number }
  // Dev only
  _devSetMeta?(meta: Partial<NormalizedMeta>): void
}

export type MetaServiceStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface NormalizedMeta {
  isLive: boolean
  upVote: number
  viewer: number
  follower: number
  startTime: number | null
}

export interface MetaUpdateEvent {
  current: NormalizedMeta
  previous: NormalizedMeta | null
  peak: {
    upVote: number
    viewer: number
  }
  peakChanged: {
    upVote: boolean
    viewer: boolean
  }
}
