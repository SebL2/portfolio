import { useMemo } from 'react'
import * as THREE from 'three'
import { Instance, Instances } from '@react-three/drei'
import { HOLDS, surfaceZ, WALL } from '../data/holds'

/** Deterministic RNG so the filler holds don't reshuffle on hot reload. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FILLER_COUNT = 130
/** Keep filler rocks at least this far (world units) from route holds. */
const HOLD_CLEARANCE = 1.3

interface FillerRock {
  position: THREE.Vector3
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

function buildFillerRocks(): FillerRock[] {
  const rand = mulberry32(1337)
  const palette = ['#4b5563', '#57534e', '#52525b', '#475569']
  const rocks: FillerRock[] = []
  const xMax = WALL.width / 2 - 1
  const yMin = WALL.bottom + 0.5
  const yMax = WALL.bottom + WALL.height - 0.5
  let guard = 0

  while (rocks.length < FILLER_COUNT && guard++ < FILLER_COUNT * 20) {
    const x = (rand() * 2 - 1) * xMax
    const y = yMin + rand() * (yMax - yMin)
    if (HOLDS.some((h) => Math.hypot(h.x - x, h.y - y) < HOLD_CLEARANCE)) {
      continue
    }
    const s = 0.1 + rand() * 0.2
    rocks.push({
      // Slightly embedded so every rock sits flush against the bumpy wall
      position: new THREE.Vector3(x, y, surfaceZ(x, y) - 0.05),
      rotation: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      scale: [s, s * (0.5 + rand() * 0.4), s * (0.8 + rand() * 0.5)],
      color: palette[Math.floor(rand() * palette.length)],
    })
  }
  return rocks
}

interface RockWallProps {
  /** Clicking bare rock dismisses the open detail card. */
  onWallClick: () => void
}

export function RockWall({ onWallClick }: RockWallProps) {
  const centerY = WALL.bottom + WALL.height / 2

  // High-poly plane displaced with the shared surface function, then
  // recompute normals for the faceted rock look.
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WALL.width, WALL.height, 220, 260)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      // Geometry is local; world y = local y + centerY
      pos.setZ(i, surfaceZ(pos.getX(i), pos.getY(i) + centerY))
    }
    geo.computeVertexNormals()
    return geo
  }, [centerY])

  const rocks = useMemo(buildFillerRocks, [])

  return (
    <group>
      <mesh
        geometry={geometry}
        position={[0, centerY, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onWallClick()
        }}
      >
        <meshStandardMaterial color="#3d4350" roughness={0.95} flatShading />
      </mesh>

      <Instances limit={FILLER_COUNT} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {rocks.map((rock, i) => (
          <Instance
            key={i}
            position={rock.position}
            rotation={rock.rotation}
            scale={rock.scale}
            color={rock.color}
          />
        ))}
      </Instances>
    </group>
  )
}
