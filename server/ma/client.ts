import { DeskThing } from '@deskthing/server'
import { MusicAssistantClient, type ConnectionState } from 'music-assistant-client'
import WebSocket from 'ws'
import type { MaConnectionState, PlayerSummary } from '../types'
import { getActivePlayerId } from './activePlayer'
import { buildSongData } from './songMapper'

let client: MusicAssistantClient | null = null

export const getMaClient = () => client

const toMaConnectionState = (state: ConnectionState): MaConnectionState => {
  if (state === 'connected') return 'connected'
  if (state === 'stopped') return 'disconnected'
  if (state === 'auth_failed') return 'error'
  return 'connecting'
}

const pushStatus = (state: ConnectionState) => {
  DeskThing.send({
    type: 'maStatus',
    payload: {
      state: toMaConnectionState(state),
      message: state === 'auth_failed' ? 'Authentication failed - check the access token' : undefined,
    },
  })
}

export const pushPlayers = async () => {
  if (!client) return

  const activePlayerId = await getActivePlayerId()
  const players: PlayerSummary[] = Array.from(client.players.values()).map((player) => ({
    player_id: player.player_id,
    name: player.display_name ?? player.name,
    active: player.player_id === activePlayerId,
    playback_state: player.playback_state,
  }))

  DeskThing.send({ type: 'players', payload: players })
}

export const pushSong = async () => {
  const song = await buildSongData()
  if (song) DeskThing.sendSong(song)
}

const handleUpdate = () => {
  pushPlayers()
  pushSong()
}

export const teardownMaClient = () => {
  client?.stop()
  client = null
}

export const initMaClient = (url: string, token: string) => {
  teardownMaClient()

  client = new MusicAssistantClient({
    url,
    token,
    webSocketFactory: (socketUrl) => new WebSocket(socketUrl),
    logger: console,
  })

  client.onStateChange(pushStatus)
  client.on('player_added', handleUpdate)
  client.on('player_updated', handleUpdate)
  client.on('player_removed', handleUpdate)
  client.on('queue_updated', handleUpdate)
  client.on('queue_items_updated', handleUpdate)

  client.start()
}
