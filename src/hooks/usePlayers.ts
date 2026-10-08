import { DeskThing } from '@deskthing/client'
import type { SocketData } from '@deskthing/types'
import { useEffect, useState } from 'react'
import type { PlayerSummary } from '../types'

export const usePlayers = () => {
  const [players, setPlayers] = useState<PlayerSummary[]>([])

  useEffect(() => {
    return DeskThing.on('players', (data: SocketData) => {
      setPlayers((data.payload as PlayerSummary[]) ?? [])
    })
  }, [])

  return players
}

export const selectPlayer = (playerId: string) => {
  DeskThing.send({ type: 'selectPlayer', payload: { playerId } })
}
