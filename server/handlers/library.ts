import { DeskThing } from '@deskthing/server'
import type { SocketData } from '@deskthing/types'
import type { MA, MusicAssistantClient } from 'music-assistant-client'
import { getActivePlayerId } from '../ma/activePlayer'
import { getMaClient } from '../ma/client'
import type { LibraryCategory, LibraryResultItem } from '../types'

type AnyLibraryItem = MA.Track | MA.Album | MA.Artist | MA.Playlist | MA.ItemMapping

const CATEGORY_TO_LIBRARY_TYPE: Record<LibraryCategory, 'track' | 'album' | 'artist' | 'playlist'> = {
  track: 'track',
  album: 'album',
  artist: 'artist',
  playlist: 'playlist',
}

const imageOf = (ma: MusicAssistantClient, item: AnyLibraryItem): string | undefined => {
  const mapping = item as Partial<MA.ItemMapping>
  const full = item as Partial<MA.Track>
  const proxyId = mapping.image?.proxy_id ?? full.metadata?.images?.[0]?.proxy_id
  return proxyId ? ma.imageProxyUrl(proxyId) : undefined
}

const subtitleOf = (item: AnyLibraryItem): string | undefined => {
  if ('artists' in item && item.artists?.length) {
    return item.artists.map((artist) => artist.name).join(', ')
  }
  return undefined
}

const toResultItem = (ma: MusicAssistantClient, item: AnyLibraryItem): LibraryResultItem => ({
  uri: item.uri ?? '',
  name: item.name,
  subtitle: subtitleOf(item),
  mediaType: item.media_type ?? 'unknown',
  image: imageOf(ma, item),
})

export const registerLibraryHandlers = () => {
  DeskThing.on('library', async (data: SocketData) => {
    const ma = getMaClient()
    if (!ma) return

    try {
      if (data.request === 'search') {
        const { query } = data.payload as { query: string }
        const results = await ma.search(query, { limit: 8 })
        const items = [
          ...(results.tracks ?? []),
          ...(results.albums ?? []),
          ...(results.artists ?? []),
          ...(results.playlists ?? []),
        ].map((item) => toResultItem(ma, item))

        DeskThing.send({ type: 'library', request: 'searchResults', payload: { items } })
      } else if (data.request === 'browse') {
        const { category } = data.payload as { category: LibraryCategory }
        const items = await ma.libraryItems(CATEGORY_TO_LIBRARY_TYPE[category], { limit: 40 })

        DeskThing.send({
          type: 'library',
          request: 'browseResults',
          payload: { category, items: items.map((item) => toResultItem(ma, item)) },
        })
      } else if (data.request === 'play') {
        const { uri } = data.payload as { uri: string }
        const playerId = await getActivePlayerId()
        if (playerId && uri) await ma.playMedia(playerId, uri, 'replace')
      }
    } catch (error) {
      console.error('[MusicAssistantThing] library command failed', error)
    }
  })
}
