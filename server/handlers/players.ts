import { DeskThing } from '@deskthing/server'
import type { SocketData } from '@deskthing/types'
import { setActivePlayerId } from '../ma/activePlayer'
import { pushPlayers, pushSong } from '../ma/client'

export const registerPlayerHandlers = () => {
  DeskThing.on('selectPlayer', async (data: SocketData) => {
    const playerId = (data.payload as { playerId: string } | undefined)?.playerId
    if (!playerId) return

    setActivePlayerId(playerId)
    await pushPlayers()
    await pushSong()
  })
}
