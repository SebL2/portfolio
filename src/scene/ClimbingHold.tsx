import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import {
  holdPosition,
  surfaceNormal,
  type HoldDef,
} from '../data/holds'

interface ClimbingHoldProps {
  hold: HoldDef
  /** True while the camera is parked at this hold */
  isActive: boolean
  onSelect: (hold: HoldDef) => void
}

const UP = new THREE.Vector3(0, 1, 0)
const tmpScale = new THREE.Vector3()

/**
 * A clickable route hold. Distinguished from the grey filler rocks by
 * color, a breathing emissive pulse, and a label — these are the ones
 * you can climb to.
 */
export function ClimbingHold({ hold, isActive, onSelect }: ClimbingHoldProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  const innerRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  const { position, quaternion, pulsePhase } = useMemo(() => {
    const pos = holdPosition(hold)
    // Seat the hold on the local slope of the rock
    const quat = new THREE.Quaternion().setFromUnitVectors(
      UP,
      surfaceNormal(hold.x, hold.y),
    )
    return { position: pos, quaternion: quat, pulsePhase: hold.y * 1.7 }
  }, [hold])

  // Hover pop + breathing glow, without re-rendering React per frame
  useFrame((state, delta) => {
    const inner = innerRef.current
    if (inner) {
      const target = hovered || isActive ? 1.25 : 1
      inner.scale.lerp(
        tmpScale.set(target, target, target),
        Math.min(1, delta * 9),
      )
    }
    const mat = matRef.current
    if (mat) {
      mat.emissiveIntensity =
        hovered || isActive
          ? 0.55
          : 0.18 + 0.16 * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.4 + pulsePhase))
    }
  })

  return (
    <group position={position}>
      <group ref={innerRef}>
        <mesh
          quaternion={quaternion}
          scale={[1, 0.55, 1.2]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(hold)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <dodecahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            ref={matRef}
            color={hold.color}
            roughness={0.5}
            flatShading
            emissive={hold.color}
          />
        </mesh>
      </group>

      {/* Chalk-tag label floating just above and off the wall */}
      <Html
        center
        position={[0, 0.85, 0.4]}
        distanceFactor={9}
        className="pointer-events-none select-none"
      >
        <div
          className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur transition-colors duration-300 ${
            hovered || isActive
              ? 'border-white/40 bg-zinc-950/85 text-white'
              : 'border-white/10 bg-zinc-950/60 text-zinc-300'
          }`}
        >
          {hold.label}
        </div>
      </Html>
    </group>
  )
}
