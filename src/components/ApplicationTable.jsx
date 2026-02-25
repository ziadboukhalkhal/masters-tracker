import { useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

const COLUMNS = [
  { key: 'uni', label: 'Université' },
  { key: 'formation', label: 'Formation' },
  { key: 'ville', label: 'Ville' },
  { key: 'etat', label: 'État' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'dateApplied', label: 'Candidature' },
]

function formatDate(str) {
  if (!str) return '—'
  const [y, m, d] = str.split('-')
  return `${d}/${m}/${y}`
}

function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
        <path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/>
      </svg>
    )
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ transform: direction === 'desc' ? 'rotate(180deg)' : 'none', color: 'var(--red)' }}
    >
      <path d="M12 5v14M5 12l7-7 7 7"/>
    </svg>
  )
}

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [deletingId, setDeletingId] = useState(null)

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...applications].sort((a, b) => {
    const va = a[sortKey] ?? ''
    const vb = b[sortKey] ?? ''
    const cmp = String(va).localeCompare(String(vb), 'fr', { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  function confirmDelete(id) {
    if (deletingId === id) {
      onDelete(id)
      setDeletingId(null)
    } else {
      setDeletingId(id)
      // Auto-cancel after 3 seconds
      setTimeout(() => setDeletingId(prev => prev === id ? null : prev), 3000)
    }
  }

  if (applications.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 rounded-2xl"
        style={{ border: '1px dashed var(--border)', background: 'var(--surface)' }}
      >
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: 'var(--red-glow)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <p className="text-base font-medium mb-1" style={{ color: 'var(--text)' }}>
          Aucune candidature
        </p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Cliquez sur &ldquo;+ Ajouter&rdquo; pour commencer
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium cursor-pointer select-none transition-colors"
                  style={{ color: sortKey === col.key ? 'var(--text)' : 'var(--muted)', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = sortKey === col.key ? 'var(--text)' : 'var(--muted)'}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon direction={sortKey === col.key ? sortDir : null} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-medium text-right" style={{ color: 'var(--muted)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((app, idx) => (
              <tr
                key={app.id}
                style={{
                  background: idx % 2 === 0 ? 'var(--surface)' : '#111111',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--surface)' : '#111111'}
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {app.uni || '—'}
                    </span>
                    {app.mail && (
                      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {app.mail}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--text)' }}>
                    {app.formation || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    {app.ville || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.etat} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-sm"
                    style={{
                      color: app.deadline && new Date(app.deadline) < new Date() ? '#fca5a5' : 'var(--muted)',
                    }}
                  >
                    {formatDate(app.deadline)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    {formatDate(app.dateApplied)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {/* Site link */}
                    {app.site && (
                      <a
                        href={app.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                        style={{ color: 'var(--muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--text)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                        title="Ouvrir le site"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <path d="M15 3h6v6"/>
                          <path d="M10 14L21 3"/>
                        </svg>
                      </a>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => onEdit(app)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                      style={{ color: 'var(--muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--text)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                      title="Modifier"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => confirmDelete(app.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                      style={{
                        color: deletingId === app.id ? '#fca5a5' : 'var(--muted)',
                        background: deletingId === app.id ? 'rgba(220,38,38,0.15)' : 'transparent',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = deletingId === app.id ? 'rgba(220,38,38,0.25)' : 'var(--card)'; e.currentTarget.style.color = deletingId === app.id ? '#fca5a5' : '#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.background = deletingId === app.id ? 'rgba(220,38,38,0.15)' : 'transparent'; e.currentTarget.style.color = deletingId === app.id ? '#fca5a5' : 'var(--muted)' }}
                      title={deletingId === app.id ? 'Cliquez encore pour confirmer' : 'Supprimer'}
                    >
                      {deletingId === app.id ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
