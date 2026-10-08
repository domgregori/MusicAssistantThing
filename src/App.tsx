import { useState } from 'react'
import { ConnectionGate } from './components/ConnectionGate'
import { NavBar, type Tab } from './components/NavBar'
import { NowPlaying } from './components/NowPlaying'
import { PlayerSwitcher } from './components/PlayerSwitcher'
import { Search } from './components/Search'
import { useMaStatus } from './hooks/useMaStatus'
import { useMusic } from './hooks/useMusic'
import { selectPlayer, usePlayers } from './hooks/usePlayers'

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>('now-playing')
  const status = useMaStatus()
  const song = useMusic()
  const players = usePlayers()

  const connected = status.state === 'connected'

  return (
    <div className="flex h-screen w-screen flex-col bg-slate-950">
      <div className="flex-1 overflow-hidden">
        {!connected ? (
          <ConnectionGate status={status} />
        ) : tab === 'now-playing' ? (
          <NowPlaying song={song} />
        ) : tab === 'players' ? (
          <PlayerSwitcher players={players} onSelect={selectPlayer} />
        ) : (
          <Search />
        )}
      </div>

      {connected && <NavBar active={tab} onChange={setTab} />}
    </div>
  )
}

export default App
