import { DeskThing } from '@deskthing/client'
import { AUDIO_REQUESTS, SongEvent, type SongData } from '@deskthing/types'
import { useEffect, useState } from 'react'

export const useMusic = () => {
  const [song, setSong] = useState<SongData | null>(null)

  useEffect(() => {
    let cancelled = false

    DeskThing.getMusic().then((data) => {
      if (!cancelled && data) setSong(data)
    })

    const unsubscribe = DeskThing.on('music', (data) => {
      setSong(data.payload as SongData)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return song
}

const send = (request: AUDIO_REQUESTS, payload?: unknown) => {
  DeskThing.send({ type: SongEvent.SET, request, payload } as Parameters<typeof DeskThing.send>[0])
}

export const musicControls = {
  play: () => send(AUDIO_REQUESTS.PLAY),
  pause: () => send(AUDIO_REQUESTS.PAUSE),
  next: () => send(AUDIO_REQUESTS.NEXT),
  previous: () => send(AUDIO_REQUESTS.PREVIOUS),
  seek: (seconds: number) => send(AUDIO_REQUESTS.SEEK, seconds),
  setVolume: (volume: number) => send(AUDIO_REQUESTS.VOLUME, volume),
  setShuffle: (enabled: boolean) => send(AUDIO_REQUESTS.SHUFFLE, enabled),
  setRepeat: (mode: 'off' | 'all' | 'track') => send(AUDIO_REQUESTS.REPEAT, mode),
  like: () => send(AUDIO_REQUESTS.LIKE),
}
