import { useState } from 'react'
import { useApplications } from '../hooks/useApplications.js'
import ApplicationTable from './ApplicationTable.jsx'
import ApplicationForm from './ApplicationForm.jsx'
import ThemeSwitcher from './ThemeSwitcher.jsx'

const ETAT_COUNTS = [
  { label: 'Accepté', color: '#22c55e', glow: 'rgba(34,197,94,0.15)' },
  { label: 'En attente', color: '#6b7280', glow: 'rgba(107,114,128,0.1)' },
  { label: 'Envoyée', color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  { label: 'Campus', color: '#f97316', glow: 'rgba(249,115,22,0.15)' },
  { label: 'Refusé', color: '#dc2626', glow: 'rgba(220,38,38,0.15)' },
]

export default function Tracker({ theme, setTheme }) {
  const { applications, loading, error, addApplication, updateApplication, deleteApplication } = useApplications()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  function handleAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(app) {
    setEditing(app)
    setFormOpen(true)
  }

  function handleSave(formData) {
    if (editing) {
      updateApplication(editing.id, formData)
    } else {
      addApplication(formData)
    }
  }

  function handleClose() {
    setFormOpen(false)
    setEditing(null)
  }

  const filtered = search.trim()
    ? applications.filter(app => {
        const q = search.toLowerCase()
        return (
          app.uni?.toLowerCase().includes(q) ||
          app.formation?.toLowerCase().includes(q) ||
          app.ville?.toLowerCase().includes(q) ||
          (app.etat ?? []).some(s => s.toLowerCase().includes(q))
        )
      })
    : applications

  // Stats — count how many formations include each status
  const statsByEtat = {}
  for (const app of applications) {
    for (const s of (app.etat ?? [])) {
      statsByEtat[s] = (statsByEtat[s] || 0) + 1
    }
  }

  // Formations with a checklist
  const appsWithChecklist = applications.filter(a => a.checklist?.length > 0)

  // Procedure totals
  const totalSteps = appsWithChecklist.reduce((acc, a) => acc + a.checklist.length, 0)
  const doneSteps = appsWithChecklist.reduce((acc, a) => acc + a.checklist.filter(i => i.done).length, 0)

  function logout() {
    sessionStorage.removeItem('auth')
    localStorage.removeItem('auth')
    window.location.reload()
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30"
        style={{ background: 'var(--header-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: 'var(--red-glow)', border: '1px solid rgba(220,38,38,0.3)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Masters Tracker
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {applications.length} candidature{applications.length !== 1 ? 's' : ''}
            </span>
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <button
              onClick={logout}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--card)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats row */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

            {/* Total candidatures */}
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--red-glow)'.replace('var(--red-glow)', 'rgba(220,38,38,0.25)') }}
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--red)' }}>
                {applications.length}
              </div>
              <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>
                Total candidatures
              </div>
            </div>

            {/* Procédures */}
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${totalSteps > 0 ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-end gap-1.5">
                <span className="text-2xl font-bold" style={{ color: totalSteps > 0 ? '#22c55e' : 'var(--muted)' }}>
                  {doneSteps}
                </span>
                {totalSteps > 0 && (
                  <span className="text-sm font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
                    / {totalSteps}
                  </span>
                )}
              </div>
              {totalSteps > 0 && (
                <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.round((doneSteps / totalSteps) * 100)}%`, background: '#22c55e' }}
                  />
                </div>
              )}
              <div className="text-xs mt-1 leading-tight" style={{ color: 'var(--muted)' }}>
                Procédures
              </div>
            </div>

            {/* Status cards */}
            {ETAT_COUNTS.map(({ label, color, glow }) => {
              const count = statsByEtat[label] || 0
              return (
                <div
                  key={label}
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${count > 0 ? glow.replace('0.15', '0.4') : 'var(--border)'}`,
                  }}
                >
                  <div className="text-2xl font-bold" style={{ color: count > 0 ? color : 'var(--muted)' }}>
                    {count}
                  </div>
                  <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted)' }}>
                    {label}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Procedure cards */}
        {appsWithChecklist.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
              PROCÉDURES EN COURS
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {appsWithChecklist.map(app => {
                const done = app.checklist.filter(i => i.done).length
                const total = app.checklist.length
                const pct = Math.round((done / total) * 100)
                const isComplete = done === total
                return (
                  <button
                    key={app.id}
                    onClick={() => handleEdit(app)}
                    className="text-left rounded-2xl p-4 transition-all"
                    style={{
                      background: 'var(--surface)',
                      border: `1px solid ${isComplete ? 'rgba(34,197,94,0.35)' : 'var(--border)'}`,
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = isComplete ? 'rgba(34,197,94,0.6)' : 'var(--red)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = isComplete ? 'rgba(34,197,94,0.35)' : 'var(--border)'}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                          {app.formation || app.uni || '—'}
                        </p>
                        {app.formation && app.uni && (
                          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>
                            {app.uni}
                          </p>
                        )}
                      </div>
                      <span
                        className="flex-shrink-0 text-xs font-bold tabular-nums"
                        style={{ color: isComplete ? '#22c55e' : 'var(--red)' }}
                      >
                        {pct}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: isComplete ? '#22c55e' : 'var(--red)',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {done}/{total} étape{total !== 1 ? 's' : ''}
                      </span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {(app.etat ?? []).map(s => (
                          <span
                            key={s}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: 'var(--muted)' }}
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          <div className="flex-1" />

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'var(--red)', color: '#fff', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Ajouter
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24" style={{ color: 'var(--muted)' }}>
            <svg className="animate-spin mr-3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
              <path d="M21 12a9 9 0 00-9-9"/>
            </svg>
            <span className="text-sm">Chargement...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl" style={{ border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#fca5a5' }}>Erreur de connexion</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{error}</p>
          </div>
        ) : (
          <>
            <ApplicationTable
              applications={filtered}
              onEdit={handleEdit}
              onDelete={deleteApplication}
            />
            {search && filtered.length === 0 && (
              <p className="text-center text-sm py-4" style={{ color: 'var(--muted)' }}>
                Aucun résultat pour &ldquo;{search}&rdquo;
              </p>
            )}
          </>
        )}
      </main>

      {/* Form modal */}
      {formOpen && (
        <ApplicationForm
          initial={editing}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

    </div>
  )
}
