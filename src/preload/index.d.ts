import { ElectronAPI } from '@electron-toolkit/preload'
import { UiohookKey } from 'uiohook-napi'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    uiHook: {
      UiohookKey: typeof UiohookKey
    }
  }
}
