"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

type Hold = {
  id: string;
  label: string;
  color: string;
  pos: [number, number, number];
  r: number;
};

// The route, ground -> summit. y increases up the wall; scroll flies the camera up.
const HOLDS: Hold[] = [
  { id: "start", label: "START", color: "#9ca3af", pos: [0, 0, -1.4], r: 0.85 },
  { id: "overview", label: "OVERVIEW", color: "#06b6d4", pos: [2.6, 8, -1.4], r: 0.85 },
  { id: "projects", label: "MY PROJECTS", color: "#22c55e", pos: [-2.6, 16, -1.4], r: 0.9 },
  { id: "stack", label: "TOOLBOX", color: "#a855f7", pos: [2.6, 24, -1.4], r: 0.8 },
  { id: "about", label: "ABOUT ME", color: "#3b82f6", pos: [-2.2, 32, -1.4], r: 0.85 },
  { id: "reach", label: "REACH ME", color: "#ef4444", pos: [1.8, 40, -1.4], r: 0.8 },
];

// A low-poly climbing-hold mesh: a squashed icosphere that bulges off the wall
// (flattened on z), shaped per "kind" (jug, sloper, crimp, pinch…).
type HoldShape = {
  pos: [number, number, number];
  scale: [number, number, number];
  rot: number;
  color: string;
  detail: number;
};

const PALETTE = [
  "#84cc16", "#6b8f3a", "#ea580c", "#f59e0b", "#ef4444", "#b91c1c",
  "#2563eb", "#38bdf8", "#7c3aed", "#a855f7", "#db2777", "#c9a36a",
  "#94a3b8", "#64748b",
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Many filler holds scattered across the wall so it reads like a real wall.
// (Generated client-side only — the canvas never SSRs, so no hydration risk.)
const FILLERS: HoldShape[] = (() => {
  const rng = mulberry32(20240608);
  return Array.from({ length: 60 }, () => {
    const base = 0.4 + rng() * 0.55;
    const kind = rng();
    let sx = 1,
      sy = 1,
      sz = 0.5;
    if (kind < 0.2) {
      sx = 1.5 + rng() * 0.6; // sloper / jug — wide & flat
      sy = 0.7;
      sz = 0.42;
    } else if (kind < 0.4) {
      sx = 1.25; // dome
      sy = 0.95;
      sz = 0.5;
    } else if (kind < 0.62) {
      sx = 1; // round blob
      sy = 1;
      sz = 0.55;
    } else if (kind < 0.82) {
      sx = 0.85; // crimp / foot — small & flat
      sy = 0.5;
      sz = 0.3;
    } else {
      sx = 0.7; // pinch — tall
      sy = 1.3;
      sz = 0.5;
    }
    return {
      // sit in FRONT of the wall panels so the holds lay on top of them
      pos: [rng() * 26 - 13, rng() * 40, -1.5 + rng() * 0.3],
      scale: [base * sx, base * sy, base * sz],
      rot: rng() * Math.PI * 2,
      color: PALETTE[Math.floor(rng() * PALETTE.length)],
      detail: rng() < 0.5 ? 0 : 1,
    };
  });
})();

// Big low-poly volumes (the angular grey/charcoal features bolted to a real
// bouldering wall). Kept out toward the sides so they frame the route without
// covering the labelled holds.
type Volume = {
  pos: [number, number, number];
  size: [number, number, number];
  rot: [number, number, number];
  color: string;
  kind: "box" | "wedge";
};

const VOLUMES: Volume[] = (() => {
  const rng = mulberry32(73);
  return Array.from({ length: 34 }, () => {
    // spread across the whole wall — they form the paneled wall surface,
    // sitting just in front of the flat plane and BEHIND the holds.
    const x = rng() * 30 - 15;
    const y = rng() * 42 - 1;
    const z = -1.95 + rng() * 0.22;
    const w = 1.8 + rng() * 2.6;
    const h = 2.2 + rng() * 3.2;
    const d = 0.35 + rng() * 0.55;
    const dark = rng() < 0.45;
    const g = dark ? 40 + Math.floor(rng() * 30) : 150 + Math.floor(rng() * 46);
    return {
      pos: [x, y, z],
      size: [w, h, d],
      rot: [(rng() - 0.5) * 0.35, (rng() - 0.5) * 0.35, (rng() - 0.5) * 1.1],
      color: `rgb(${g - 4}, ${g}, ${g + 8})`,
      kind: rng() < 0.78 ? "box" : "wedge",
    };
  });
})();

function Hold({
  position,
  scale,
  rot = 0,
  color,
  detail = 0,
  emissive = 0,
  hole = false,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rot?: number;
  color: string;
  detail?: number;
  emissive?: number;
  hole?: boolean;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  return (
    <group position={position} rotation={[0, 0, rot]}>
      <mesh
        scale={scale}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <icosahedronGeometry args={[1, detail]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55}
          metalness={0.05}
          emissive={color}
          emissiveIntensity={emissive}
          flatShading
        />
      </mesh>
      {hole && (
        <mesh position={[0, 0, scale[2] + 0.03]}>
          <circleGeometry args={[Math.min(scale[0], scale[1]) * 0.12, 10]} />
          <meshBasicMaterial color="#161616" />
        </mesh>
      )}
    </group>
  );
}

const TOP_Y = HOLDS[HOLDS.length - 1].pos[1];

const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function CameraRig({ scroll }: { scroll: MotionValue<number> }) {
  const { camera } = useThree();
  useFrame((_, dt) => {
    const p = Math.min(1, Math.max(0, scroll.get()));
    const targetY = p * TOP_Y;
    const targetX = Math.sin(p * Math.PI * 2) * 0.8;
    const k = Math.min(1, dt * 2.5);
    camera.position.y += (targetY + 1.2 - camera.position.y) * k;
    camera.position.x += (targetX - camera.position.x) * k;
    camera.position.z += (6 - camera.position.z) * k;
    camera.lookAt(0, camera.position.y + 3.2, -1.4);
  });
  return null;
}

function ChalkHand({ flip = 1 }: { flip?: number }) {
  const skin = "#e9e3d9";
  return (
    <group rotation={[-0.55, 0, flip * 0.25]} scale={flip === 1 ? [1, 1, 1] : [-1, 1, 1]}>
      {/* palm / back of hand */}
      <mesh>
        <boxGeometry args={[0.55, 0.62, 0.22]} />
        <meshStandardMaterial color={skin} roughness={0.95} flatShading />
      </mesh>
      {/* fingers */}
      {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0.02]} rotation={[(-0.3 - i * 0.04) * flip, 0, 0]}>
          <boxGeometry args={[0.1, 0.42, 0.14]} />
          <meshStandardMaterial color={skin} roughness={0.95} flatShading />
        </mesh>
      ))}
      {/* thumb */}
      <mesh position={[-0.32, 0.08, 0.05]} rotation={[0, 0, 0.8]}>
        <boxGeometry args={[0.1, 0.34, 0.13]} />
        <meshStandardMaterial color={skin} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

function FirstPersonHands() {
  const { camera } = useThree();
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    camera.add(group);
    return () => {
      camera.remove(group);
    };
  }, [camera]);
  return (
    <group ref={ref} position={[0, -1.15, -2.4]}>
      <group position={[-1.0, 0.1, 0]}>
        <ChalkHand flip={1} />
      </group>
      <group position={[1.0, 0.35, 0]}>
        <ChalkHand flip={-1} />
      </group>
    </group>
  );
}

function ArcadeLabel({ hold }: { hold: Hold }) {
  return (
    <Html
      position={[hold.pos[0] + hold.r + 0.4, hold.pos[1] + 0.1, hold.pos[2]]}
      center
      distanceFactor={12}
      zIndexRange={[0, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div
        className="select-none whitespace-nowrap rounded-md border px-3 py-1 font-mono text-sm font-bold uppercase tracking-widest backdrop-blur-sm"
        style={{
          color: hold.color,
          borderColor: `${hold.color}99`,
          background: "rgba(8,10,14,0.55)",
          boxShadow: `0 0 14px ${hold.color}66`,
          textShadow: `0 0 8px ${hold.color}aa`,
        }}
      >
        {hold.label}
      </div>
    </Html>
  );
}

function Wall() {
  return (
    <group>
      <mesh position={[0, TOP_Y / 2, -2]} receiveShadow>
        <planeGeometry args={[36, TOP_Y + 26, 1, 1]} />
        <meshStandardMaterial color="#c9ced6" roughness={1} metalness={0} flatShading />
      </mesh>
      {/* big angled volumes — the bolt-on features of a bouldering wall */}
      {VOLUMES.map((v, i) => (
        <mesh key={i} position={v.pos} rotation={v.rot}>
          {v.kind === "box" ? (
            <boxGeometry args={v.size} />
          ) : (
            <octahedronGeometry args={[Math.max(v.size[0], v.size[1]) * 0.6, 0]} />
          )}
          <meshStandardMaterial
            color={v.color}
            roughness={1}
            metalness={0}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function Route({ scroll }: { scroll: MotionValue<number> }) {
  const points = useMemo(
    () => HOLDS.map((h) => new THREE.Vector3(...h.pos)),
    [],
  );
  return (
    <>
      {/* glowing AR path */}
      <Line points={points} color="#38bdf8" lineWidth={2.5} />
      <Line points={points} color="#38bdf8" lineWidth={9} transparent opacity={0.18} />

      {FILLERS.map((f, i) => (
        <Hold
          key={`f${i}`}
          position={f.pos}
          scale={f.scale}
          rot={f.rot}
          color={f.color}
          detail={f.detail}
        />
      ))}

      {HOLDS.map((h) => (
        <Float key={h.id} speed={1.2} rotationIntensity={0.12} floatIntensity={0.5}>
          <Hold
            position={h.pos}
            scale={[h.r * 1.3, h.r * 1.05, h.r * 0.62]}
            color={h.color}
            detail={1}
            emissive={0.28}
            hole
            onClick={() => scrollToSection(h.id)}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          />
          <ArcadeLabel hold={h} />
        </Float>
      ))}

      <ProgressMarker scroll={scroll} />
    </>
  );
}

// A glowing ring that rides the path to the hold you're climbing toward.
function ProgressMarker({ scroll }: { scroll: MotionValue<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const p = Math.min(1, Math.max(0, scroll.get()));
    const f = p * (HOLDS.length - 1);
    const i = Math.min(HOLDS.length - 2, Math.floor(f));
    const t = f - i;
    const a = HOLDS[i].pos;
    const b = HOLDS[i + 1].pos;
    mesh.position.set(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t + 0.3,
    );
    mesh.rotation.z += 0.03;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.55, 0.06, 8, 24]} />
      <meshBasicMaterial color="#e2f6ff" />
    </mesh>
  );
}

export default function ClimbScene({ scroll }: { scroll: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 6], fov: 52 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0c0f15"]} />
      <fog attach="fog" args={["#0c0f15", 10, 46]} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 14, 8]} intensity={1.3} />
      <pointLight position={[-6, 6, 4]} intensity={40} color="#7dd3fc" distance={30} />

      <Wall />
      <Route scroll={scroll} />
      <FirstPersonHands />
      <CameraRig scroll={scroll} />
    </Canvas>
  );
}
