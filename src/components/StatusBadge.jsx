const STATUS_STYLES = {
  'En attente': {
    bg: 'rgba(107,114,128,0.15)',
    border: 'rgba(107,114,128,0.4)',
    color: '#9ca3af',
    dot: '#6b7280',
  },
  'Candidature envoyée': {
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.35)',
    color: '#93c5fd',
    dot: '#3b82f6',
  },
  'Campus': {
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    color: '#fdba74',
    dot: '#f97316',
  },
  'Accepté': {
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.35)',
    color: '#86efac',
    dot: '#22c55e',
  },
  'Refusé': {
    bg: 'rgba(220,38,38,0.12)',
    border: 'rgba(220,38,38,0.35)',
    color: '#fca5a5',
    dot: '#dc2626',
  },
}

const DEFAULT_STYLE = {
  bg: 'rgba(107,114,128,0.1)',
  border: 'rgba(107,114,128,0.3)',
  color: '#9ca3af',
  dot: '#6b7280',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || DEFAULT_STYLE

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: style.dot }}
      />
      {status}
    </span>
  )
}
