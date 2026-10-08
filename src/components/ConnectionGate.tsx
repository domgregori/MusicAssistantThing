import type { MaStatusPayload } from '../types'

type Props = {
  status: MaStatusPayload
}

const MESSAGE: Record<MaStatusPayload['state'], string> = {
  disconnected: 'Set your Music Assistant server URL and access token in this app\'s settings to get started.',
  connecting: 'Connecting to Music Assistant…',
  connected: 'Connected.',
  error: 'Could not connect to Music Assistant.',
}

export const ConnectionGate: React.FC<Props> = ({ status }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-8 text-center text-white">
      <span className="text-4xl">{status.state === 'error' ? '⚠️' : '🎧'}</span>
      <p className="text-slate-200">{MESSAGE[status.state]}</p>
      {status.message && <p className="text-sm text-slate-400">{status.message}</p>}
    </div>
  )
}
