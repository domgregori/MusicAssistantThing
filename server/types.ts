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

export type ToAppCustomData =
  | { type: 'selectPlayer'; request?: undefined; payload: { playerId: string } }
  | { type: 'library'; request: 'search'; payload: { query: string } }
  | { type: 'library'; request: 'browse'; payload: { category: LibraryCategory } }
  | { type: 'library'; request: 'play'; payload: { uri: string } }

export type ToClientCustomData =
  | { type: 'maStatus'; request?: undefined; payload: MaStatusPayload }
  | { type: 'players'; request?: undefined; payload: PlayerSummary[] }
  | { type: 'library'; request: 'searchResults'; payload: LibraryResults }
  | { type: 'library'; request: 'browseResults'; payload: LibraryResults }
