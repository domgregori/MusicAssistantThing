import { DeskThing } from '@deskthing/client'
import type { SongData } from '@deskthing/types'
import { useEffect, useState } from 'react'
import { musicControls } from '../hooks/useMusic'

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

type Props = {
  song: SongData | null
}

export const NowPlaying: React.FC<Props> = ({ song }) => {
  const [progressMs, setProgressMs] = useState(song?.track_progress ?? 0)

  useEffect(() => {
    setProgressMs(song?.track_progress ?? 0)
  }, [song?.track_progress, song?.id])

  useEffect(() => {
    if (!song?.is_playing) return
    const interval = setInterval(() => setProgressMs((value) => value + 1000), 1000)
    return () => clearInterval(interval)
  }, [song?.is_playing])

  const proxiedThumbnail = DeskThing.useProxy(song?.thumbnail ?? '')

  if (!song) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400">
        <p>Nothing playing</p>
      </div>
    )
  }

  const duration = song.track_duration ?? 0
  const progressPct = duration > 0 ? Math.min(100, (progressMs / duration) * 100) : 0
  const thumbnail = song.thumbnail ? proxiedThumbnail : undefined

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 py-4 text-white">
      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl bg-slate-800 shadow-lg">
        {thumbnail ? (
          <img src={thumbnail} alt={song.album ?? song.track_name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl">🎵</span>
        )}
      </div>

      <div className="w-full max-w-sm text-center">
        <p className="truncate text-lg font-bold">{song.track_name}</p>
        <p className="truncate text-sm text-slate-300">{song.artist ?? 'Unknown artist'}</p>
        {song.device && <p className="truncate text-xs text-slate-500">{song.device}</p>}
      </div>

      <div className="w-full max-w-sm">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div className="h-full bg-emerald-400" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>{formatTime(progressMs)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button onClick={musicControls.previous} className="text-3xl active:scale-90">
          ⏮
        </button>
        <button
          onClick={song.is_playing ? musicControls.pause : musicControls.play}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl active:scale-90"
        >
          {song.is_playing ? '⏸' : '▶'}
        </button>
        <button onClick={musicControls.next} className="text-3xl active:scale-90">
          ⏭
        </button>
      </div>

      <div className="flex w-full max-w-sm items-center gap-3">
        <span className="text-sm">🔉</span>
        <input
          type="range"
          min={0}
          max={100}
          value={song.volume}
          onChange={(event) => musicControls.setVolume(Number(event.target.value))}
          className="flex-1"
        />
        <span className="text-sm">🔊</span>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={() => musicControls.setShuffle(!song.shuffle_state)}
          className={song.shuffle_state ? 'text-emerald-400' : 'text-slate-400'}
        >
          🔀 Shuffle
        </button>
        <button
          onClick={() => musicControls.setRepeat(song.repeat_state === 'off' ? 'all' : song.repeat_state === 'all' ? 'track' : 'off')}
          className={song.repeat_state !== 'off' ? 'text-emerald-400' : 'text-slate-400'}
        >
          🔁 Repeat{song.repeat_state === 'track' ? ' 1' : ''}
        </button>
        <button onClick={musicControls.like} className={song.liked ? 'text-rose-400' : 'text-slate-400'}>
          ♥ Like
        </button>
      </div>
    </div>
  )
}
