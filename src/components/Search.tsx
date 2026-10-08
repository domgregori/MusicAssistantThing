import { useState } from 'react'
import { useLibraryBrowse, useLibrarySearch, playLibraryItem } from '../hooks/useLibrary'
import type { LibraryCategory, LibraryResultItem } from '../../shared/types'

const KEYBOARD_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

const CATEGORIES: { id: LibraryCategory; label: string }[] = [
  { id: 'track', label: 'Tracks' },
  { id: 'album', label: 'Albums' },
  { id: 'artist', label: 'Artists' },
  { id: 'playlist', label: 'Playlists' },
]

const MEDIA_ICON: Record<string, string> = {
  track: '🎵',
  album: '💿',
  artist: '🎤',
  playlist: '📃',
}

const ResultsList: React.FC<{ items: LibraryResultItem[]; loading: boolean }> = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        <p>Loading…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        <p>No results</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
      {items.map((item) => (
        <button
          key={item.uri}
          onClick={() => playLibraryItem(item.uri)}
          className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2 text-left text-white active:bg-slate-700"
        >
          <span className="text-xl">{MEDIA_ICON[item.mediaType] ?? '🎧'}</span>
          <span className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            {item.subtitle && <p className="truncate text-xs text-slate-400">{item.subtitle}</p>}
          </span>
        </button>
      ))}
    </div>
  )
}

export const Search: React.FC = () => {
  const [mode, setMode] = useState<'search' | LibraryCategory>('search')
  const [query, setQuery] = useState('')
  const search = useLibrarySearch()
  const browse = useLibraryBrowse()

  const selectCategory = (next: 'search' | LibraryCategory) => {
    setMode(next)
    if (next !== 'search') browse.browse(next)
  }

  const submitSearch = () => {
    if (query.trim()) search.search(query)
  }

  const pressKey = (char: string) => setQuery((value) => value + char)
  const backspace = () => setQuery((value) => value.slice(0, -1))

  return (
    <div className="flex h-full w-full flex-col gap-2 px-3 py-3 text-white">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => selectCategory('search')}
          className={`shrink-0 rounded-full px-3 py-1 text-sm ${mode === 'search' ? 'bg-emerald-600' : 'bg-slate-800 text-slate-300'}`}
        >
          🔍 Search
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => selectCategory(category.id)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm ${mode === category.id ? 'bg-emerald-600' : 'bg-slate-800 text-slate-300'}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {mode === 'search' ? (
        <>
          <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-sm">{query || 'Type to search…'}</span>
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400">
                ✕
              </button>
            )}
          </div>

          <ResultsList items={search.results} loading={search.loading} />

          <div className="flex flex-col gap-1">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.split('').map((char) => (
                  <button
                    key={char}
                    onClick={() => pressKey(char)}
                    className="h-8 flex-1 rounded bg-slate-700 text-sm uppercase active:bg-slate-600"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex gap-1">
              <button onClick={() => pressKey(' ')} className="h-8 flex-[3] rounded bg-slate-700 text-sm active:bg-slate-600">
                space
              </button>
              <button onClick={backspace} className="h-8 flex-1 rounded bg-slate-700 text-sm active:bg-slate-600">
                ⌫
              </button>
              <button onClick={submitSearch} className="h-8 flex-1 rounded bg-emerald-600 text-sm active:bg-emerald-500">
                Go
              </button>
            </div>
          </div>
        </>
      ) : (
        <ResultsList items={browse.results} loading={browse.loading} />
      )}
    </div>
  )
}
