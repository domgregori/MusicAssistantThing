export type Tab = 'now-playing' | 'players' | 'search'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'now-playing', label: 'Now Playing', icon: '🎵' },
  { id: 'players', label: 'Players', icon: '🔊' },
  { id: 'search', label: 'Search', icon: '🔍' },
]

type Props = {
  active: Tab
  onChange: (tab: Tab) => void
}

export const NavBar: React.FC<Props> = ({ active, onChange }) => {
  return (
    <div className="flex w-full shrink-0 border-t border-slate-800 bg-slate-900">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
            active === tab.id ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
