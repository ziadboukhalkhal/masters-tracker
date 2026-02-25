import { useState, useEffect, useRef } from 'react'

export default function ChecklistPanel({ app, onUpdate, onClose }) {
  const [items, setItems] = useState(app.checklist ?? [])
  const [newText, setNewText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function save(next) {
    setItems(next)
    onUpdate(next)
  }

  function toggle(id) {
    save(items.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  function remove(id) {
    save(items.filter(i => i.id !== id))
  }

  function addItem(e) {
    e.preventDefault()
    const text = newText.trim()
    if (!text) return
    const next = [...items, { id: crypto.randomUUID(), text, done: false }]
    save(next)
    setNewText('')
    inputRef.current?.focus()
  }

  const done = items.filter(i => i.done).length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 fade-in"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col slide-in"
        style={{
          width: 'min(400px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              Procédure finale
            </h2>
            <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>
              {app.formation || app.uni || '—'}
              {app.uni && app.formation ? ` · ${app.uni}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {items.length > 0 && (
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                {done}/{items.length}
              </span>
            )}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {items.length > 0 && (
          <div className="px-6 pt-4 flex-shrink-0">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round((done / items.length) * 100)}%`,
                  background: 'var(--red)',
                }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-center py-12" style={{ color: 'var(--muted)' }}>
              Aucune étape. Ajoutez vos prochaines démarches.
            </p>
          )}
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl group"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all"
                style={{
                  border: `2px solid ${item.done ? 'var(--red)' : 'var(--border)'}`,
                  background: item.done ? 'var(--red)' : 'transparent',
                }}
              >
                {item.done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </button>
              <span
                className="flex-1 text-sm leading-relaxed"
                style={{
                  color: item.done ? 'var(--muted)' : 'var(--text)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.text}
              </span>
              <button
                onClick={() => remove(item.id)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-lg transition-opacity"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add item */}
        <form
          onSubmit={addItem}
          className="flex-shrink-0 px-6 py-4 flex gap-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <input
            ref={inputRef}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Nouvelle étape..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0"
            style={{ background: 'var(--red)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
          >
            Ajouter
          </button>
        </form>
      </div>
    </>
  )
}
