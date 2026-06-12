import { useEffect, useState } from 'react'
import type { HoldDef } from '../data/holds'

interface DetailCardProps {
  /** The hold whose card should be shown; null fades the card out. */
  hold: HoldDef | null
  visible: boolean
  onClose: () => void
}

export function DetailCard({ hold, visible, onClose }: DetailCardProps) {
  // Keep the last hold around while fading out so the card doesn't go blank
  // mid-transition.
  const [rendered, setRendered] = useState<HoldDef | null>(hold)
  useEffect(() => {
    if (hold) setRendered(hold)
  }, [hold])

  const shown = visible && !!hold
  if (!rendered) return null

  return (
    <aside
      aria-hidden={!shown}
      className={`fixed right-6 top-1/2 z-10 w-[min(24rem,calc(100vw-3rem))] -translate-y-1/2 transition-all duration-500 ease-out ${
        shown
          ? 'translate-x-0 opacity-100'
          : 'pointer-events-none translate-x-6 opacity-0'
      }`}
    >
      <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: rendered.color }}
            >
              {rendered.tagline}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {rendered.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close and return to the wall"
            className="rounded-full border border-white/10 px-2.5 py-1 text-sm text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
          >
            ✕
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-300">
          {rendered.body}
        </p>
        <p className="mt-5 text-xs text-zinc-500">
          Keep scrolling to climb, or click the next glowing hold.
        </p>
      </div>
    </aside>
  )
}
