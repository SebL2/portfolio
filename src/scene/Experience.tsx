import { Stars } from '@react-three/drei'
import { ClimbRig, type ClimbRequest } from './ClimbRig'
import { RockWall } from './RockWall'
import { ClimbingHold } from './ClimbingHold'
import { HOLDS, type HoldDef, type SectionId } from '../data/holds'

interface ExperienceProps {
  climbRequest: ClimbRequest | null
  activeSection: SectionId | null
  onSelectHold: (hold: HoldDef) => void
  onFocusReached: (section: SectionId) => void
  onActiveChange: (section: SectionId | null) => void
  onWallClick: () => void
}

export function Experience({
  climbRequest,
  activeSection,
  onSelectHold,
  onFocusReached,
  onActiveChange,
  onWallClick,
}: ExperienceProps) {
  return (
    <>
      <color attach="background" args={['#0b0d12']} />
      {/* Distance fog swallows the top of the wall until you climb to it */}
      <fog attach="fog" args={['#0b0d12', 10, 24]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 12, 8]} intensity={1.4} color="#fff4e0" />
      <directionalLight position={[-6, -4, 6]} intensity={0.3} color="#7dd3fc" />

      <Stars radius={60} depth={30} count={2500} factor={3} fade speed={0.4} />

      <RockWall onWallClick={onWallClick} />

      {HOLDS.map((hold) => (
        <ClimbingHold
          key={hold.id}
          hold={hold}
          isActive={activeSection === hold.id}
          onSelect={onSelectHold}
        />
      ))}

      <ClimbRig
        climbRequest={climbRequest}
        onFocusReached={onFocusReached}
        onActiveChange={onActiveChange}
      />
    </>
  )
}
