const THEMES = [
  { id: 'dark', color: '#dc2626', label: 'Sombre' },
  { id: 'light', color: '#2563eb', label: 'Clair' },
  { id: 'slate', color: '#22c55e', label: 'Slate' },
]

export default function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div className="flex items-center gap-1.5" title="Changer de thème">
      {THEMES.map(({ id, color, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          title={label}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: color,
            border: theme === id ? `2px solid var(--text)` : '2px solid transparent',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
            transition: 'transform 0.15s, border-color 0.15s',
            transform: theme === id ? 'scale(1.25)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  )
}
