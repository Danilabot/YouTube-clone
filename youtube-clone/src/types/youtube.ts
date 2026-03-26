// YouTube Data API v3 — типы ответов

export interface Thumbnail {
  url: string
  width?: number
  height?: number
}

export interface Thumbnails {
  default?: Thumbnail
  medium?: Thumbnail
  high?: Thumbnail
  standard?: Thumbnail
  maxres?: Thumbnail
}

// ─── Video ───────────────────────────────────────────────────────────────────

export interface VideoSnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: Thumbnails
  channelTitle: string
  categoryId: string
  tags?: string[]
  defaultLanguage?: string
}

export interface VideoContentDetails {
  duration: string        // ISO 8601, напр. "PT10M30S"
  dimension?: string
  definition?: string
  caption?: string
  licensedContent?: boolean
}

export interface VideoStatistics {
  viewCount: string
  likeCount?: string
  dislikeCount?: string
  favoriteCount?: string
  commentCount?: string
}

export interface YouTubeVideo {
  kind: 'youtube#video'
  etag: string
  id: string
  snippet: VideoSnippet
  contentDetails: VideoContentDetails
  statistics: VideoStatistics
}

// ─── Channel ─────────────────────────────────────────────────────────────────

export interface ChannelSnippet {
  title: string
  description: string
  customUrl?: string
  publishedAt: string
  thumbnails: Thumbnails
  country?: string
}

export interface ChannelStatistics {
  viewCount: string
  subscriberCount: string
  hiddenSubscriberCount?: boolean
  videoCount: string
}

export interface ChannelBrandingSettings {
  channel?: Record<string, string>
  image?: {
    bannerExternalUrl?: string
  }
}

export interface YouTubeChannel {
  kind: 'youtube#channel'
  etag: string
  id: string
  snippet: ChannelSnippet
  statistics: ChannelStatistics
  brandingSettings?: ChannelBrandingSettings
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface CommentSnippet {
  textDisplay: string
  authorDisplayName: string
  authorProfileImageUrl: string
  likeCount: number
  publishedAt: string
  updatedAt?: string
}

export interface YouTubeComment {
  kind: 'youtube#comment'
  etag: string
  id: string
  snippet: CommentSnippet
}

export interface CommentThreadSnippet {
  videoId: string
  topLevelComment: YouTubeComment
  canReply: boolean
  totalReplyCount: number
  isPublic: boolean
}

export interface YouTubeCommentThread {
  kind: 'youtube#commentThread'
  etag: string
  id: string
  snippet: CommentThreadSnippet
}

// ─── Search result ────────────────────────────────────────────────────────────

export interface SearchResultId {
  kind: string
  videoId?: string
  channelId?: string
  playlistId?: string
}

export interface SearchResultSnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: Thumbnails
  channelTitle: string
}

export interface YouTubeSearchResult {
  kind: 'youtube#searchResult'
  etag: string
  id: SearchResultId
  snippet: SearchResultSnippet
}

// ─── Paginated response ───────────────────────────────────────────────────────

export interface YouTubeShortsResponse {
  items: YouTubeVideo[]
  nextPageToken: string | null
}
