"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { AI, SLAB } from "./platformParts";

/**
 * The platform, as an object: one foundation slab, a glowing AI layer on top of
 * it, and six area modules that dock onto it. Modules that are not connected
 * yet hover above as outlines: they can be added later, on the same foundation.
 *
 * The scene itself draws no text. The parent passes `labels`, a list of DOM
 * elements (0-5 the modules, 6 the slab, 7 the AI layer); every frame each one
 * is moved onto its block by projecting the block's position to the screen.
 */

function moveLabel(el: HTMLElement, x: number, y: number) {
  el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  // Labels stay invisible until they have a place.
  if (!el.dataset.placed) el.dataset.placed = "1";
}

type Pick = (k: number) => void;
// Hover is a mouse idea: on touch it would stick after the finger lifts.
const mouse = (e: ThreeEvent<PointerEvent>) =>
  e.nativeEvent.pointerType === "mouse";

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
  onHover,
  onPick,
}: {
  index: number;
  color: string;
  on: boolean;
  focus: boolean;
  still: boolean;
  onHover?: Pick;
  onPick?: Pick;
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
    () => new THREE.Color("#311718").lerp(new THREE.Color(color), 0.16),
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
    <group
      ref={group}
      name={`module-${index}`}
      position={[SLOTS[index][0], FLOAT_Y, SLOTS[index][1]]}
    >
      <mesh
        geometry={box}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (mouse(e)) onHover?.(index);
        }}
        onPointerOut={(e) => mouse(e) && onHover?.(-1)}
        onClick={(e) => {
          e.stopPropagation();
          onPick?.(index);
        }}
      >
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
  labels,
  onHover,
  onPick,
}: {
  colors: string[];
  on: number;
  focus: number;
  still: boolean;
  labels?: RefObject<(HTMLElement | null)[]>;
  onHover?: Pick;
  onPick?: Pick;
}) {
  const rig = useRef<THREE.Group>(null);
  const ai = useRef<THREE.MeshStandardMaterial>(null);
  const rimMat = useRef<THREE.LineBasicMaterial>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  const rimBase = useMemo(() => new THREE.Color("#4F2C2C"), []);
  const rimLit = useMemo(() => new THREE.Color("#F97316"), []);
  const invalidate = useThree((s) => s.invalidate);
  // With the loop paused (off screen, reduced motion) a new state still needs one frame.
  useEffect(() => invalidate(), [invalidate, on, focus]);
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
  const fit = useThree((s) => Math.min(0.9, s.size.width / s.size.height / 1.66));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = rig.current;
    if (g && !still) {
      // Slow idle sway, plus a little follow on the pointer.
      const ry = -0.62 + Math.sin(t * 0.22) * 0.07 + state.pointer.x * 0.16;
      const rx = state.pointer.y * -0.05;
      g.rotation.y += (ry - g.rotation.y) * 0.05;
      g.rotation.x += (rx - g.rotation.x) * 0.05;
    }
    if (ai.current)
      ai.current.emissiveIntensity =
        (0.3 + (still ? 0 : Math.sin(t * 1.6) * 0.09)) *
        (focus === AI ? 2.4 : 1);
    if (rimMat.current)
      rimMat.current.color.copy(focus === SLAB ? rimLit : rimBase);

    // Move each HTML label onto its part of the object.
    const els = labels?.current;
    if (!g || !els) return;
    g.updateWorldMatrix(true, true);
    const { width, height } = state.size;
    const put = (i: number, from: THREE.Object3D, x: number, y: number, z: number) => {
      const el = els[i];
      if (!el) return;
      from.localToWorld(v.set(x, y, z)).project(state.camera);
      const px = (v.x * 0.5 + 0.5) * width;
      const py = (-v.y * 0.5 + 0.5) * height;
      moveLabel(el, px, py);
    };
    for (const child of g.children) {
      if (!child.name.startsWith("module-")) continue;
      // Centre of the module's top face.
      put(Number(child.name.slice(7)), child, 0, 0.31, 0);
    }
    put(SLAB, g, 0, -0.28, 2.5); // front bottom edge of the slab
    put(AI, g, -3.4, 0.39, 1.9); // left end of the glowing layer
  });

  const part = (k: number) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (mouse(e)) onHover?.(k);
    },
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      if (mouse(e)) onHover?.(-1);
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onPick?.(k);
    },
  });

  return (
    <group
      ref={rig}
      rotation={[0, -0.62, 0]}
      position={[0, -0.5, 0]}
      scale={fit}
    >
      <mesh geometry={base} {...part(SLAB)}>
        <meshStandardMaterial color="#2B1315" roughness={0.5} metalness={0.3} />
      </mesh>
      <lineSegments geometry={rim}>
        <lineBasicMaterial ref={rimMat} color="#4F2C2C" />
      </lineSegments>
      <mesh geometry={layer} position={[0, 0.34, 0]} {...part(AI)}>
        <meshStandardMaterial
          ref={ai}
          color="#2A1206"
          emissive="#F97316"
          emissiveIntensity={0.3}
          roughness={0.45}
        />
      </mesh>
      <pointLight
        position={[0, 0.9, 0]}
        color="#F97316"
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
          onHover={onHover}
          onPick={onPick}
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
  labels,
  onHover,
  onPick,
}: {
  colors: string[];
  on: number;
  /** 0-5 a module, SLAB, AI, or -1 for none. */
  focus: number;
  running: boolean;
  still: boolean;
  /** DOM labels to keep on the blocks: 0-5 modules, then SLAB and AI. */
  labels?: RefObject<(HTMLElement | null)[]>;
  onHover?: Pick;
  onPick?: Pick;
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
      <Rig
        colors={colors}
        on={on}
        focus={focus}
        still={still}
        labels={labels}
        onHover={onHover}
        onPick={onPick}
      />
    </Canvas>
  );
}
