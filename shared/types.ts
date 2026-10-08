export type MaConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

export type MaStatusPayload = {
  state: MaConnectionState
  message?: string
}

export type PlayerSummary = {
  player_id: string
  name: string
  active: boolean
  playback_state: string
}

export type LibraryResultItem = {
  uri: string
  name: string
  subtitle?: string
  mediaType: string
  image?: string
}

export type LibraryCategory = 'artist' | 'album' | 'playlist' | 'track'

export type LibraryResults = {
  category?: LibraryCategory
  items: LibraryResultItem[]
}
