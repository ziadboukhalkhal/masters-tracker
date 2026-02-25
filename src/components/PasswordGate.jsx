import { useState, useRef } from 'react'

const PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'admin'

export default function PasswordGate({ onAuth }) {
  const [value, setValue] = useState('')
  const [remember, setRemember] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (value === PASSWORD) {
      onAuth(remember)
    } else {
      setError(true)
      setShaking(true)
      setValue('')
      setTimeout(() => setShaking(false), 500)
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.08) 0%, transparent 70%)',
        }}
      />

      <div
        className={`relative w-full max-w-sm mx-4 rounded-2xl p-8 ${shaking ? 'shake' : ''}`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 0 40px rgba(220,38,38,0.1)',
        }}
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'var(--red-glow)', border: '1px solid rgba(220,38,38,0.3)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Masters Tracker
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Accès restreint — entrez le mot de passe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false) }}
              placeholder="Mot de passe"
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: 'var(--card)',
                border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
                color: 'var(--text)',
                boxShadow: error ? '0 0 0 3px rgba(220,38,38,0.15)' : 'none',
              }}
            />
            {error && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--red)' }}>
                Mot de passe incorrect
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-red-600"
            />
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              Se souvenir de moi
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: 'var(--red)',
              color: '#fff',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
          >
            Accéder
          </button>
        </form>
      </div>
    </div>
  )
}
