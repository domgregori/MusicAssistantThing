import { DeskThing } from '@deskthing/server'
import { DESKTHING_EVENTS, type AppSettings } from '@deskthing/types'
import { registerLibraryHandlers } from './handlers/library'
import { registerMusicHandlers } from './handlers/music'
import { registerPlayerHandlers } from './handlers/players'
import { initMaClient, teardownMaClient } from './ma/client'
import { SETTING_SERVER_URL, SETTING_TOKEN, setupSettings } from './ma/settings'

let lastConnectionKey: string | null = null

// Uses the settings passed in directly - re-fetching via DeskThing.getSettings()
// here would trigger another 'settings' event and loop forever.
const applySettings = (settings: AppSettings | null | undefined) => {
  const url = (settings?.[SETTING_SERVER_URL]?.value as string | undefined)?.trim()
  const token = (settings?.[SETTING_TOKEN]?.value as string | undefined)?.trim()

  const key = url && token ? `${url}|${token}` : null
  if (key === lastConnectionKey) return
  lastConnectionKey = key

  if (url && token) {
    initMaClient(url, token)
  } else {
    teardownMaClient()
  }
}

const start = async () => {
  await setupSettings()
  registerMusicHandlers()
  registerPlayerHandlers()
  registerLibraryHandlers()

  DeskThing.on(DESKTHING_EVENTS.SETTINGS, (settings) => {
    applySettings(settings as unknown as AppSettings)
  })

  applySettings(await DeskThing.getSettings())
}

const stop = async () => {
  teardownMaClient()
}

DeskThing.on(DESKTHING_EVENTS.START, start)
DeskThing.on(DESKTHING_EVENTS.STOP, stop)
