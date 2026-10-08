import { DeskThing } from '@deskthing/client'
import type { SocketData } from '@deskthing/types'
import { useEffect, useState } from 'react'
import type { MaStatusPayload } from '../types'

export const useMaStatus = () => {
  const [status, setStatus] = useState<MaStatusPayload>({ state: 'disconnected' })

  useEffect(() => {
    return DeskThing.on('maStatus', (data: SocketData) => {
      setStatus(data.payload as MaStatusPayload)
    })
  }, [])

  return status
}
