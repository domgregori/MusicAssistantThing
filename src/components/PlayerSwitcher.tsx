import type { PlayerSummary } from '../../shared/types'

type Props = {
  players: PlayerSummary[]
  onSelect: (playerId: string) => void
}

export const PlayerSwitcher: React.FC<Props> = ({ players, onSelect }) => {
  if (players.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400">
        <p>No players found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto px-4 py-4">
      {players.map((player) => (
        <button
          key={player.player_id}
          onClick={() => onSelect(player.player_id)}
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-left ${
            player.active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
          }`}
        >
          <span className="truncate font-medium">{player.name}</span>
          <span className="text-xs uppercase text-slate-400">{player.playback_state}</span>
        </button>
      ))}
    </div>
  )
}
