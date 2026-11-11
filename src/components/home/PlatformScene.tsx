"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * The platform, as an object: one foundation slab, a glowing AI layer on top of
 * it, and six area modules that dock onto it. Modules that are not connected
 * yet hover above as outlines: they can be added later, on the same foundation.
 */

const REST_Y = 0.83;
const FLOAT_Y = 2.5;
const SLOTS: [number, number][] = [
  [-2.2, -1.12],
  [0, -1.12],
  [2.2, -1.12],
  [-2.2, 1.12],
  [0, 1.12],
  [2.2, 1.12],
];

const easeOutBack = (x: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

function Module({
  index,
  color,
  on,
  focus,
  still,
}: {
  index: number;
  color: string;
  on: boolean;
  focus: boolean;
  still: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.MeshStandardMaterial>(null);
  const edge = useRef<THREE.LineBasicMaterial>(null);
  // 0 = hovering outline, 1 = docked. Starts undocked so the first render drops in.
  const p = useRef(still && on ? 1 : 0);
  const wait = useRef(0);
  const last = useRef(on);

  const box = useMemo(
    () => new RoundedBoxGeometry(1.9, 0.62, 1.9, 4, 0.12),
    [],
  );
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.9, 0.62, 1.9)),
    [],
  );
  const tint = useMemo(() => new THREE.Color(color), [color]);
  const dark = useMemo(
    () => new THREE.Color("#1E1E20").lerp(new THREE.Color(color), 0.16),
    [color],
  );

  useFrame((state, dt) => {
    if (last.current !== on) {
      last.current = on;
      // Dock one after another, undock all at once.
      wait.current = on ? index * 0.09 : 0;
    }
    if (still) p.current = on ? 1 : 0;
    else if (wait.current > 0) wait.current -= dt;
    else
      p.current = THREE.MathUtils.clamp(
        p.current + (on ? dt * 1.5 : -dt * 2.6),
        0,
        1,
      );

    const k = p.current;
    const bob = still
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.9 + index * 1.3) * 0.09 * (1 - k);
    const lift = focus ? 0.16 : 0;
    if (group.current) {
      const y = THREE.MathUtils.lerp(
        FLOAT_Y + index * 0.05,
        REST_Y,
        on ? easeOutBack(k) : k * k,
      );
      group.current.position.y +=
        (y + bob + lift - group.current.position.y) * (still ? 1 : 0.35);
    }
    if (body.current) {
      body.current.opacity = 0.04 + k * 0.96;
      // Solid once docked, so a module hides what is behind it.
      body.current.depthWrite = k > 0.9;
      body.current.emissiveIntensity = (0.1 + k * 0.22) * (focus ? 2.6 : 1);
    }
    if (edge.current) edge.current.opacity = 0.3 + k * 0.5 + (focus ? 0.2 : 0);
  });

  return (
    <group ref={group} position={[SLOTS[index][0], FLOAT_Y, SLOTS[index][1]]}>
      <mesh geometry={box}>
        <meshStandardMaterial
          ref={body}
          color={dark}
          emissive={tint}
          emissiveIntensity={0.1}
          roughness={0.55}
          metalness={0.15}
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edge} color={tint} transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function Rig({
  colors,
  on,
  focus,
  still,
}: {
  colors: string[];
  on: number;
  focus: number;
  still: boolean;
}) {
  const rig = useRef<THREE.Group>(null);
  const ai = useRef<THREE.MeshStandardMaterial>(null);
  const base = useMemo(() => new RoundedBoxGeometry(7.2, 0.56, 5, 5, 0.16), []);
  const layer = useMemo(
    () => new RoundedBoxGeometry(6.8, 0.1, 4.6, 3, 0.05),
    [],
  );
  const rim = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(7.2, 0.56, 5)),
    [],
  );
  // The camera is framed for a wide stage; on a narrow one, shrink the object so it still fits.
  const fit = useThree((s) => Math.min(0.9, s.size.width / s.size.height / 1.7));

  useFrame((state) => {
    if (still) return;
    const t = state.clock.elapsedTime;
    if (rig.current) {
      // Slow idle sway, plus a little follow on the pointer.
      const ry = -0.62 + Math.sin(t * 0.22) * 0.07 + state.pointer.x * 0.16;
      const rx = state.pointer.y * -0.05;
      rig.current.rotation.y += (ry - rig.current.rotation.y) * 0.05;
      rig.current.rotation.x += (rx - rig.current.rotation.x) * 0.05;
    }
    if (ai.current)
      ai.current.emissiveIntensity = 0.3 + Math.sin(t * 1.6) * 0.09;
  });

  return (
    <group
      ref={rig}
      rotation={[0, -0.62, 0]}
      position={[0, -0.5, 0]}
      scale={fit}
    >
      <mesh geometry={base}>
        <meshStandardMaterial color="#19191B" roughness={0.5} metalness={0.3} />
      </mesh>
      <lineSegments geometry={rim}>
        <lineBasicMaterial color="#3A3A3C" />
      </lineSegments>
      <mesh geometry={layer} position={[0, 0.34, 0]}>
        <meshStandardMaterial
          ref={ai}
          color="#2A1206"
          emissive="#FF6A00"
          emissiveIntensity={0.3}
          roughness={0.45}
        />
      </mesh>
      <pointLight
        position={[0, 0.9, 0]}
        color="#FF6A00"
        intensity={5}
        distance={7}
      />
      {colors.map((c, k) => (
        <Module
          key={k}
          index={k}
          color={c}
          on={k < on}
          focus={k === focus}
          still={still}
        />
      ))}
    </group>
  );
}

export default function PlatformScene({
  colors,
  on,
  focus,
  running,
  still,
}: {
  colors: string[];
  on: number;
  focus: number;
  running: boolean;
  still: boolean;
}) {
  return (
    <Canvas
      frameloop={running ? "always" : "demand"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 6.4, 11.5], fov: 30 }}
      onCreated={({ camera }) => camera.lookAt(0, 0.5, 0)}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 9, 6]} intensity={2.2} />
      <directionalLight
        position={[-6, 3, -4]}
        intensity={0.6}
        color="#9E8CF2"
      />
      <Rig colors={colors} on={on} focus={focus} still={still} />
    </Canvas>
  );
}
