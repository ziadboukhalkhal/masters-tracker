import { useState, useEffect } from 'react'

const ETAT_OPTIONS = [
  'En attente',
  'Candidature envoyée',
  'Entretien',
  'Accepté',
  'Refusé',
  "Liste d'attente",
]

const EMPTY_FORM = {
  uni: '',
  formation: '',
  ville: '',
  mail: '',
  etat: 'En attente',
  site: '',
  deadline: '',
  dateApplied: '',
  notes: '',
}

export default function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM })
  const [errors, setErrors] = useState({})

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
    if (!form.etat) newErrors.etat = true
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
            <select
              style={{ ...inputStyle(errors.etat), appearance: 'none', cursor: 'pointer' }}
              value={form.etat}
              onChange={e => set('etat', e.target.value)}
            >
              {ETAT_OPTIONS.map(opt => (
                <option key={opt} value={opt} style={{ background: 'var(--card)' }}>
                  {opt}
                </option>
              ))}
            </select>
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

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Deadline">
              <input
                type="date"
                style={{ ...inputStyle(false), colorScheme: 'inherit' }}
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
              />
            </Field>
            <Field label="Date candidature">
              <input
                type="date"
                style={{ ...inputStyle(false), colorScheme: 'inherit' }}
                value={form.dateApplied}
                onChange={e => set('dateApplied', e.target.value)}
              />
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              style={{ ...inputStyle(false), minHeight: '90px', resize: 'vertical' }}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Informations supplémentaires..."
            />
          </Field>

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
