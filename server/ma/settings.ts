import { DeskThing } from '@deskthing/server'
import { SETTING_TYPES } from '@deskthing/types'

export const SETTING_SERVER_URL = 'maServerUrl'
export const SETTING_TOKEN = 'maToken'

export const setupSettings = async () => {
  await DeskThing.initSettings({
    [SETTING_SERVER_URL]: {
      id: SETTING_SERVER_URL,
      type: SETTING_TYPES.STRING,
      label: 'Music Assistant Server URL',
      description: 'e.g. http://192.168.1.10:8095',
      value: '',
    },
    [SETTING_TOKEN]: {
      id: SETTING_TOKEN,
      type: SETTING_TYPES.STRING,
      label: 'Access Token',
      description: 'Long-lived token from Music Assistant → Settings → Profile',
      value: '',
    },
  })
}
