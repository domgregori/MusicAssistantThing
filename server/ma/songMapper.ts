import { SongAbilities, type SongData } from '@deskthing/types'
import type { MusicAssistantClient, Player, PlayerQueue } from 'music-assistant-client'
import { getActivePlayerId } from './activePlayer'
import { getMaClient } from './client'

const toRepeatState = (mode: PlayerQueue['repeat_mode'] | undefined): 'off' | 'all' | 'track' => {
  if (mode === 'all') return 'all'
  if (mode === 'one') return 'track'
  return 'off'
}

const buildFromPlayer = (ma: MusicAssistantClient, player: Player, queue: PlayerQueue | undefined): SongData => {
  const media = player.current_media

  return {
    version: 2,
    track_name: media?.title ?? queue?.current_item?.name ?? 'Nothing Playing',
    album: media?.album ?? null,
    artist: media?.artist ?? null,
    playlist: null,
    playlist_id: null,
    shuffle_state: queue?.shuffle_enabled ?? null,
    repeat_state: toRepeatState(queue?.repeat_mode),
    is_playing: player.playback_state === 'playing',
    source: 'musicassistantthing',
    abilities: [
      SongAbilities.PLAY,
      SongAbilities.PAUSE,
      SongAbilities.STOP,
      SongAbilities.NEXT,
      SongAbilities.PREVIOUS,
      SongAbilities.SHUFFLE,
      SongAbilities.REPEAT,
      SongAbilities.CHANGE_VOLUME,
      SongAbilities.LIKE,
    ],
    // DeskThing's built-in player expects milliseconds.
    track_duration: media?.duration != null ? media.duration * 1000 : null,
    track_progress: media?.elapsed_time != null ? media.elapsed_time * 1000 : null,
    volume: player.volume_level ?? 0,
    thumbnail: media?.image_url ? ma.resolveImageUrl(media.image_url) : null,
    device: player.display_name ?? player.name,
    device_id: player.player_id,
    id: queue?.current_item?.queue_item_id ?? media?.queue_item_id ?? null,
  }
}

export const buildSongData = async (): Promise<SongData | null> => {
  const ma = getMaClient()
  if (!ma) return null

  const playerId = await getActivePlayerId()
  if (!playerId) return null

  const player = ma.players.get(playerId)
  if (!player) return null

  return buildFromPlayer(ma, player, ma.queues.get(playerId))
}
