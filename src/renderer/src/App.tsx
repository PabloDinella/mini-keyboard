import { useEffect, useState } from 'react'
import { UiohookKeyboardEvent } from 'uiohook-napi'

function App(): JSX.Element {
  const [pressedKeys, setPressedKeys] = useState<JSX.Element[]>([])

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'uihooks-keydown',
      (_, event: UiohookKeyboardEvent & { key: string }) => {
        const ctrlKey = event.ctrlKey ? 'Ctrl' : ''
        const altKey = event.altKey ? 'Alt' : ''
        const shiftKey = event.shiftKey ? 'Shift' : ''
        const metaKey = event.metaKey ? 'Meta' : ''

        const shortcutText = ctrlKey + altKey + shiftKey + metaKey

        console.log(event)

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
            {/* {shortcutText && <kbd>{event.key}</kbd>} */}

            {/* {!shortcutText && <strong>{event.key}</strong>} */}

            <strong>{event.key}</strong>
          </>
        )

        setPressedKeys((prevKeys) => {
          if (prevKeys.length > 10) {
            return [...prevKeys.slice(1), key]
          }

          return [...prevKeys, key]
        })
      }
    )

    return () => window.electron.ipcRenderer.removeAllListeners('uihooks-keydown')
  }, [])

  return <div className="container">{pressedKeys}</div>
}

export default App
