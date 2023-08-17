import { useEffect, useState } from 'react'
import { UiohookKeyboardEvent } from 'uiohook-napi'

function App(): JSX.Element {
  const [key, setKey] = useState<JSX.Element[]>([])

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'keydown',
      (_, event: UiohookKeyboardEvent & { key: string }) => {
        const ctrlKey = event.ctrlKey ? 'Ctrl' : ''
        const altKey = event.altKey ? 'Alt' : ''
        const shiftKey = event.shiftKey ? 'Shift' : ''
        const metaKey = event.metaKey ? 'Meta' : ''

        const shortcutText = ctrlKey + altKey + shiftKey + metaKey

        const UiohookKey = window.uiHook.UiohookKey

        const modifierKeys: number[] = [
          UiohookKey.Ctrl,
          UiohookKey.CtrlRight,
          UiohookKey.Shift,
          UiohookKey.ShiftRight,
          UiohookKey.Alt,
          UiohookKey.AltRight,
          UiohookKey.Meta
        ]

        const key = modifierKeys.includes(event.keycode) ? (
          <kbd>{event.key}</kbd>
        ) : (
          <>
            {shortcutText && (
              <kbd>
                {shortcutText}-{event.key}
              </kbd>
            )}

            {!shortcutText && <strong>{event.key}</strong>}
          </>
        )

        setKey((prevKeys) => {
          if (prevKeys.length > 10) {
            return [...prevKeys.slice(1), key]
          }

          return [...prevKeys, key]
        })
      }
    )
  }, [])

  return <div className="container">{key}</div>
}

export default App
