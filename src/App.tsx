import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Experience } from './scene/Experience'
import type { ClimbRequest } from './scene/ClimbRig'
import { DetailCard } from './components/DetailCard'
import {
  CAMERA_DISTANCE,
  CAMERA_FOV,
  HOLDS,
  ROUTE_BOTTOM,
  type HoldDef,
  type SectionId,
} from './data/holds'

export default function App() {
  const [climbRequest, setClimbRequest] = useState<ClimbRequest | null>(null)
  const climbSeq = useRef(0)
  // Set by ClimbRig whenever the camera is parked within reach of a hold —
  // covers both scroll arrivals and click flights.
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const [cardDismissed, setCardDismissed] = useState(false)

  const handleSelectHold = useCallback((hold: HoldDef) => {
    climbSeq.current += 1
    setClimbRequest({ hold, seq: climbSeq.current })
    setCardDismissed(false)
  }, [])

  const handleFocusReached = useCallback((section: SectionId) => {
    console.debug(`[climb] focus reached: ${section}`)
  }, [])

  const handleActiveChange = useCallback((section: SectionId | null) => {
    setActiveSection(section)
    setCardDismissed(false)
  }, [])

  const handleDismissCard = useCallback(() => setCardDismissed(true), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismissCard()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleDismissCard])

  const activeHold = HOLDS.find((h) => h.id === activeSection) ?? null
  const toppedOut = activeSection === 'contact'

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0b0d12]">
      {/* R3F's Canvas resizes with this container and keeps the camera
          aspect/projection in sync automatically on window resize. */}
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, ROUTE_BOTTOM, CAMERA_DISTANCE],
          fov: CAMERA_FOV,
          near: 0.1,
          far: 80,
        }}
      >
        <Experience
          climbRequest={climbRequest}
          activeSection={activeSection}
          onSelectHold={handleSelectHold}
          onFocusReached={handleFocusReached}
          onActiveChange={handleActiveChange}
          onWallClick={handleDismissCard}
        />
      </Canvas>

      {/* 2D HTML overlays */}
      <header className="pointer-events-none fixed left-6 top-6 z-10">
        <h1 className="text-lg font-bold tracking-tight text-white">Seb Liu</h1>
        <p className="text-sm text-zinc-400">
          Creative developer · climber of walls, real and virtual
        </p>
      </header>

      {/* Topped-out remark at the summit */}
      <div
        aria-hidden={!toppedOut}
        className={`pointer-events-none fixed left-1/2 top-16 z-10 -translate-x-1/2 transition-all duration-700 ${
          toppedOut ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <p className="rounded-full border border-white/15 bg-zinc-950/75 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
          🏔️ You topped out — thanks for climbing all the way.
        </p>
      </div>

      {/* Route rail: the four holds, top of the wall at the top of the rail */}
      <nav className="fixed left-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-4">
        {[...HOLDS].reverse().map((hold) => {
          const isActive = activeSection === hold.id
          return (
            <button
              key={hold.id}
              onClick={() => handleSelectHold(hold)}
              className="group flex items-center gap-3"
            >
              <span
                className={`h-3 w-3 rounded-full border transition-all ${
                  isActive ? 'scale-125 border-transparent' : 'border-white/30 bg-transparent'
                }`}
                style={isActive ? { backgroundColor: hold.color } : undefined}
              />
              <span
                className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-zinc-500 group-hover:text-zinc-200'
                }`}
              >
                {hold.label}
              </span>
            </button>
          )
        })}
      </nav>

      <p className="pointer-events-none fixed bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-xs tracking-wide text-zinc-500">
        Scroll to climb · click a glowing hold to pull up to it · Esc to close
      </p>

      <DetailCard
        hold={activeHold}
        visible={!!activeHold && !cardDismissed}
        onClose={handleDismissCard}
      />
    </main>
  )
}
