import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import {
  CAMERA_DISTANCE,
  HOLDS,
  ROUTE_BOTTOM,
  ROUTE_TOP,
  routeXAt,
  type HoldDef,
  type SectionId,
} from '../data/holds'

export interface ClimbRequest {
  hold: HoldDef
  /** Monotonic counter so re-clicking the same hold still triggers a flight */
  seq: number
}

interface ClimbRigProps {
  climbRequest: ClimbRequest | null
  /** Fired when a click-initiated flight settles on its hold. */
  onFocusReached: (section: SectionId) => void
  /** Fired whenever the nearest-section-in-range changes (scroll or click). */
  onActiveChange: (section: SectionId | null) => void
}

const MIN_Y = ROUTE_BOTTOM - 0.4
const MAX_Y = ROUTE_TOP + 0.8
const ARRIVE_RADIUS = 1.4
const WHEEL_SPEED = 0.008
const TOUCH_SPEED = 0.02

/**
 * Vertical-only camera movement. A single `target.y` value is the source
 * of truth: scrolling and touch-dragging nudge it, clicking a hold tweens
 * it with GSAP (user input interrupts the tween). Each frame the camera
 * eases toward the target height and sways horizontally along the route.
 */
export function ClimbRig({
  climbRequest,
  onFocusReached,
  onActiveChange,
}: ClimbRigProps) {
  const camera = useThree((state) => state.camera)
  const target = useRef({ y: ROUTE_BOTTOM })
  const tween = useRef<gsap.core.Tween | null>(null)
  const active = useRef<SectionId | null>(null)

  // Scroll & touch input — manual input always interrupts an automated flight
  useEffect(() => {
    const interrupt = () => {
      tween.current?.kill()
      tween.current = null
    }
    const climbBy = (dy: number) => {
      target.current.y = THREE.MathUtils.clamp(
        target.current.y + dy,
        MIN_Y,
        MAX_Y,
      )
    }
    const onWheel = (e: WheelEvent) => {
      interrupt()
      // Scroll down advances up the wall, matching normal page-scroll flow
      climbBy(e.deltaY * WHEEL_SPEED)
    }
    let lastTouchY: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (lastTouchY === null) return
      const dy = lastTouchY - e.touches[0].clientY
      lastTouchY = e.touches[0].clientY
      interrupt()
      climbBy(dy * TOUCH_SPEED)
    }
    const onTouchEnd = () => {
      lastTouchY = null
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  // Click-to-hold flight
  useEffect(() => {
    if (!climbRequest) return
    tween.current?.kill()
    tween.current = gsap.to(target.current, {
      y: climbRequest.hold.y,
      duration: 1.4,
      ease: 'power3.inOut',
      onComplete: () => {
        tween.current = null
        onFocusReached(climbRequest.hold.id)
      },
    })
    return () => {
      tween.current?.kill()
      tween.current = null
    }
  }, [climbRequest, onFocusReached])

  useFrame((_, delta) => {
    const y = target.current.y
    camera.position.y += (y - camera.position.y) * Math.min(1, delta * 5)
    const swayX = routeXAt(camera.position.y) * 0.5
    camera.position.x += (swayX - camera.position.x) * Math.min(1, delta * 3)
    camera.position.z = CAMERA_DISTANCE
    // Look straight at the wall, biased slightly upward — the next hold
    // up the route stays on screen.
    camera.lookAt(camera.position.x, camera.position.y + 0.8, 0)

    let nearest: SectionId | null = null
    for (const hold of HOLDS) {
      if (Math.abs(y - hold.y) < ARRIVE_RADIUS) nearest = hold.id
    }
    if (nearest !== active.current) {
      active.current = nearest
      onActiveChange(nearest)
    }
  })

  return null
}
