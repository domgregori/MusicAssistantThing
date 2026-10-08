import { DeskThing } from '@deskthing/client'
import type { SocketData } from '@deskthing/types'
import { useCallback, useState } from 'react'
import type { LibraryCategory, LibraryResultItem } from '../types'

const awaitLibraryResponse = (expectedRequest: 'searchResults' | 'browseResults'): Promise<LibraryResultItem[]> =>
  new Promise((resolve) => {
    const unsubscribe = DeskThing.on('library', (data: SocketData) => {
      if (data.request !== expectedRequest) return
      unsubscribe()
      resolve((data.payload as { items: LibraryResultItem[] } | undefined)?.items ?? [])
    })
  })

export const playLibraryItem = (uri: string) => {
  DeskThing.send({ type: 'library', request: 'play', payload: { uri } })
}

export const useLibrarySearch = () => {
  const [results, setResults] = useState<LibraryResultItem[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const response = awaitLibraryResponse('searchResults')
    DeskThing.send({ type: 'library', request: 'search', payload: { query } })
    setResults(await response)
    setLoading(false)
  }, [])

  return { results, loading, search }
}

export const useLibraryBrowse = () => {
  const [results, setResults] = useState<LibraryResultItem[]>([])
  const [loading, setLoading] = useState(false)

  const browse = useCallback(async (category: LibraryCategory) => {
    setLoading(true)
    const response = awaitLibraryResponse('browseResults')
    DeskThing.send({ type: 'library', request: 'browse', payload: { category } })
    setResults(await response)
    setLoading(false)
  }, [])

  return { results, loading, browse }
}
