import { useState, useEffect } from 'react'

const ETAT_OPTIONS = [
  'En attente',
  'Envoyée',
  'Campus',
  'Accepté',
  'Refusé',
]

const EMPTY_FORM = {
  uni: '',
  formation: '',
  ville: '',
  mail: '',
  etat: ['En attente'],
  checklist: [],
  site: '',
  dateApplied: '',
  notes: '',
}

export default function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial, checklist: initial.checklist ?? [] } : { ...EMPTY_FORM })
  const [errors, setErrors] = useState({})
  const [newStep, setNewStep] = useState('')

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }))
  }

  function validate() {
    const newErrors = {}
    if (!form.uni.trim()) newErrors.uni = true
    if (!form.formation.trim()) newErrors.formation = true
    if (!form.etat || form.etat.length === 0) newErrors.etat = true
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSave(form)
    onClose()
  }

  const inputStyle = (hasError) => ({
    background: 'var(--card)',
    border: `1px solid ${hasError ? 'var(--red)' : 'var(--border)'}`,
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    transition: 'border-color 0.15s',
  })

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
        className="fixed top-0 right-0 h-full z-50 overflow-y-auto slide-in"
        style={{
          width: 'min(480px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>
            {initial ? 'Modifier la candidature' : 'Nouvelle candidature'}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Université */}
          <Field label="Université *" error={errors.uni}>
            <input
              style={inputStyle(errors.uni)}
              value={form.uni}
              onChange={e => set('uni', e.target.value)}
              placeholder="ex. Université Paris-Saclay"
            />
          </Field>

          {/* Formation */}
          <Field label="Formation *" error={errors.formation}>
            <input
              style={inputStyle(errors.formation)}
              value={form.formation}
              onChange={e => set('formation', e.target.value)}
              placeholder="ex. M2 Informatique"
            />
          </Field>

          {/* Ville */}
          <Field label="Ville">
            <input
              style={inputStyle(false)}
              value={form.ville}
              onChange={e => set('ville', e.target.value)}
              placeholder="ex. Paris"
            />
          </Field>

          {/* Email */}
          <Field label="Email de contact">
            <input
              type="email"
              style={inputStyle(false)}
              value={form.mail}
              onChange={e => set('mail', e.target.value)}
              placeholder="contact@universite.fr"
            />
          </Field>

          {/* État */}
          <Field label="État *" error={errors.etat}>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {ETAT_OPTIONS.map(opt => {
                const active = form.etat.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? form.etat.filter(s => s !== opt)
                        : [...form.etat, opt]
                      set('etat', next)
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: active ? '600' : '400',
                      cursor: 'pointer',
                      border: `1px solid ${active ? 'var(--red)' : 'var(--border)'}`,
                      background: active ? 'var(--red-glow)' : 'var(--card)',
                      color: active ? 'var(--red)' : 'var(--muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {errors.etat && (
              <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>
                Sélectionnez au moins un état
              </p>
            )}
          </Field>

          {/* Site */}
          <Field label="Site web">
            <input
              type="url"
              style={inputStyle(false)}
              value={form.site}
              onChange={e => set('site', e.target.value)}
              placeholder="https://..."
            />
          </Field>

          {/* Date candidature */}
          <Field label="Date candidature">
            <input
              type="date"
              style={{ ...inputStyle(false), colorScheme: 'inherit' }}
              value={form.dateApplied}
              onChange={e => set('dateApplied', e.target.value)}
            />
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              style={{ ...inputStyle(false), minHeight: '90px', resize: 'vertical' }}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Informations supplémentaires..."
            />
          </Field>

          {/* Procédure finale */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold tracking-wider" style={{ color: 'var(--muted)' }}>PROCÉDURE FINALE</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              {form.checklist.length > 0 && (
                <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                  {form.checklist.filter(i => i.done).length}/{form.checklist.length}
                </span>
              )}
            </div>

            {form.checklist.length > 0 && (
              <div className="mb-3 space-y-1.5">
                {form.checklist.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg group"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <button
                      type="button"
                      onClick={() => set('checklist', form.checklist.map(i => i.id === item.id ? { ...i, done: !i.done } : i))}
                      className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{
                        border: `1.5px solid ${item.done ? 'var(--red)' : 'var(--border)'}`,
                        background: item.done ? 'var(--red)' : 'transparent',
                      }}
                    >
                      {item.done && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                    <span
                      className="flex-1 text-sm"
                      style={{
                        color: item.done ? 'var(--muted)' : 'var(--text)',
                        textDecoration: item.done ? 'line-through' : 'none',
                      }}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => set('checklist', form.checklist.filter(i => i.id !== item.id))}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center rounded transition-opacity"
                      style={{ color: 'var(--muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                value={newStep}
                onChange={e => setNewStep(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const text = newStep.trim()
                    if (!text) return
                    set('checklist', [...form.checklist, { id: crypto.randomUUID(), text, done: false }])
                    setNewStep('')
                  }
                }}
                placeholder="Ajouter une étape..."
                style={{ ...inputStyle(false), flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  const text = newStep.trim()
                  if (!text) return
                  set('checklist', [...form.checklist, { id: crypto.randomUUID(), text, done: false }])
                  setNewStep('')
                }}
                className="flex items-center justify-center w-10 rounded-xl flex-shrink-0"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-glow)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'var(--red)', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--red-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
            >
              {initial ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: error ? 'var(--red)' : 'var(--muted)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
