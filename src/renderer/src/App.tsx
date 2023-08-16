import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [key, setKey] = useState('')

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => setKey(event.key)

    window.addEventListener('keypress', handler)
    return () => window.removeEventListener('keypress', handler)
  }, [])

  return <div className="container">Tecla: {key}</div>
}

export default App
