import * as THREE from 'three'

/** Wall dimensions in world units. The wall stands in the XY plane at z≈0. */
export const WALL = {
  width: 16,
  height: 18.5,
  bottom: -4,
}

export const CAMERA_DISTANCE = 6.5
export const CAMERA_FOV = 58

export type SectionId = 'intro' | 'about' | 'projects' | 'contact'

export interface HoldDef {
  id: SectionId
  label: string
  /** Horizontal position on the wall */
  x: number
  /** Height on the wall — the route runs bottom (intro) to top (contact) */
  y: number
  color: string
  tagline: string
  body: string
}

/** The route, ordered bottom to top. Keep sorted by `y` ascending. */
export const HOLDS: HoldDef[] = [
  {
    id: 'intro',
    label: 'Intro',
    x: 0.3,
    y: 0,
    color: '#f59e0b',
    tagline: 'Belay on.',
    body: 'Welcome — this portfolio is a rock wall. Scroll to climb, or click the next glowing hold to pull up to it. The grey holds are just texture; the bright ones are the route. The top is closer than it looks.',
  },
  {
    id: 'about',
    label: 'About',
    x: -1.9,
    y: 4,
    color: '#38bdf8',
    tagline: 'The human behind the holds.',
    body: 'I build playful, performance-obsessed interfaces for the web. By day I ship production React; by night I chase plastic up overhanging walls. This site is both hobbies glued together.',
  },
  {
    id: 'projects',
    label: 'Projects',
    x: 1.7,
    y: 8,
    color: '#34d399',
    tagline: 'Selected sends.',
    body: 'Interactive 3D product configurators, WebGL data visualizations, and a handful of award-nominated marketing sites. Each project picked because it taught me a new trick.',
  },
  {
    id: 'contact',
    label: 'Contact',
    x: -0.8,
    y: 12,
    color: '#fb7185',
    tagline: 'The final hold.',
    body: 'Booking freelance and collaboration work for late 2026. The fastest way to reach me is email — I reply within a day unless I am somewhere with more rock than reception.',
  },
]

export const ROUTE_BOTTOM = HOLDS[0].y
export const ROUTE_TOP = HOLDS[HOLDS.length - 1].y

/**
 * Height of the wall surface at (x, y): a gentle horizontal bulge so the
 * wall reads as a buttress rather than a billboard, plus layered sine
 * noise for rocky relief. The wall mesh, hold placement, and decorative
 * rocks all sample this same function so everything sits flush.
 */
export function surfaceZ(x: number, y: number): number {
  const bulge = -0.012 * x * x
  const relief =
    0.22 * Math.sin(x * 1.7 + y * 0.8) * Math.sin(y * 1.3) +
    0.12 * Math.sin(x * 3.9 - y * 2.6) +
    0.06 * Math.sin((x + y) * 7.3)
  return bulge + relief
}

/** Outward surface normal at (x, y), via central differences. */
export function surfaceNormal(x: number, y: number): THREE.Vector3 {
  const e = 0.01
  const dzdx = (surfaceZ(x + e, y) - surfaceZ(x - e, y)) / (2 * e)
  const dzdy = (surfaceZ(x, y + e) - surfaceZ(x, y - e)) / (2 * e)
  return new THREE.Vector3(-dzdx, -dzdy, 1).normalize()
}

export function holdPosition(hold: HoldDef): THREE.Vector3 {
  return new THREE.Vector3(hold.x, hold.y, surfaceZ(hold.x, hold.y))
}

/**
 * Horizontal drift of the route at a given height — piecewise linear
 * between holds. The camera sways along this so the climb traverses
 * side to side like a real route instead of riding a straight elevator.
 */
export function routeXAt(y: number): number {
  if (y <= HOLDS[0].y) return HOLDS[0].x
  for (let i = 0; i < HOLDS.length - 1; i++) {
    const a = HOLDS[i]
    const b = HOLDS[i + 1]
    if (y <= b.y) {
      return THREE.MathUtils.lerp(a.x, b.x, (y - a.y) / (b.y - a.y))
    }
  }
  return HOLDS[HOLDS.length - 1].x
}
