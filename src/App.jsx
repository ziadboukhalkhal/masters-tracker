import { useState, useEffect } from 'react'
import PasswordGate from './components/PasswordGate.jsx'
import Tracker from './components/Tracker.jsx'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const { theme, setTheme } = useTheme()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem('auth')
    const persistent = localStorage.getItem('auth')
    if (session === '1' || persistent === '1') {
      setAuthed(true)
    }
  }, [])

  function handleAuth(remember) {
    if (remember) {
      localStorage.setItem('auth', '1')
    } else {
      sessionStorage.setItem('auth', '1')
    }
    setAuthed(true)
  }

  if (!authed) {
    return <PasswordGate onAuth={handleAuth} />
  }

  return <Tracker theme={theme} setTheme={setTheme} />
}
