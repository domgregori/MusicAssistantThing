import { DeskThing } from '@deskthing/server'
import { AUDIO_REQUESTS, SongEvent } from '@deskthing/types'
import { getActivePlayerId } from '../ma/activePlayer'
import { getMaClient, pushSong } from '../ma/client'

export const registerMusicHandlers = () => {
  DeskThing.on(SongEvent.GET, async (data) => {
    if (data.request === AUDIO_REQUESTS.SONG || data.request === AUDIO_REQUESTS.REFRESH) {
      await pushSong()
    }
  })

  DeskThing.on(SongEvent.SET, async (data) => {
    const ma = getMaClient()
    const playerId = await getActivePlayerId()
    if (!ma || !playerId) return

    try {
      switch (data.request) {
        case AUDIO_REQUESTS.PLAY: {
          const mediaId = (data.payload as { id?: string } | undefined)?.id
          if (mediaId) await ma.playMedia(playerId, mediaId, 'replace')
          else await ma.play(playerId)
          break
        }
        case AUDIO_REQUESTS.PAUSE:
          await ma.pause(playerId)
          break
        case AUDIO_REQUESTS.STOP:
          await ma.stopPlayback(playerId)
          break
        case AUDIO_REQUESTS.NEXT:
          await ma.next(playerId)
          break
        case AUDIO_REQUESTS.PREVIOUS:
          await ma.previous(playerId)
          break
        case AUDIO_REQUESTS.SEEK:
          await ma.seek(playerId, data.payload as number)
          break
        case AUDIO_REQUESTS.FAST_FORWARD:
          await ma.skipSeconds(playerId, (data.payload as number | undefined) ?? 30)
          break
        case AUDIO_REQUESTS.REWIND:
          await ma.skipSeconds(playerId, -((data.payload as number | undefined) ?? 15))
          break
        case AUDIO_REQUESTS.VOLUME:
          await ma.setVolume(playerId, data.payload as number)
          break
        case AUDIO_REQUESTS.SHUFFLE:
          await ma.setShuffle(playerId, data.payload as boolean)
          break
        case AUDIO_REQUESTS.REPEAT:
          await ma.setRepeat(playerId, data.payload === 'track' ? 'one' : data.payload === 'all' ? 'all' : 'off')
          break
        case AUDIO_REQUESTS.LIKE:
          await ma.addCurrentlyPlayingToFavorites(playerId)
          break
      }
    } catch (error) {
      console.error('[MusicAssistantThing] music command failed', error)
    }

    await pushSong()
  })
}
