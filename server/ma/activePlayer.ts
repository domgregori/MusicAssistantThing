import { DeskThing } from '@deskthing/server'
import { getMaClient } from './client'

export const getActivePlayerId = async (): Promise<string | undefined> => {
  const ma = getMaClient()
  if (!ma) return undefined

  const data = await DeskThing.getData()
  const stored = data?.activePlayerId as string | undefined
  if (stored && ma.players.has(stored)) return stored

  return ma.players.values().next().value?.player_id
}

export const setActivePlayerId = (playerId: string) => {
  DeskThing.saveData({ activePlayerId: playerId })
}
