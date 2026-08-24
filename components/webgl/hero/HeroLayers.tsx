"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { doughFragmentShader, doughVertexShader } from "./doughShader";

// ---------------------------------------------------------------------
// Layer 1 — Volumetric light: implemented as layered soft-edged additive
// planes (the spec's explicit fallback) rather than a raymarched quad —
// see NOTES.md / PLAN.md for why. Warm shaft raking from upper-left,
// angle drifting on a ~40s period.
// ---------------------------------------------------------------------
export function LightShaft({ intensity = 1 }: { intensity?: number }) {
  const group = useRef<THREE.Group>(null);

  const planes = useMemo(
    () => [
      { width: 5.5, height: 16, opacity: 0.16, z: -3 },
      { width: 3.2, height: 14, opacity: 0.22, z: -2 },
      { width: 1.6, height: 12, opacity: 0.28, z: -1 },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (group.current) {
      const drift = Math.sin(clock.elapsedTime * ((Math.PI * 2) / 40)) * 0.08;
      group.current.rotation.z = -0.55 + drift;
    }
  });

  return (
    <group ref={group} position={[-3.5, 3.5, -2]} rotation={[0, 0, -0.55]}>
      {planes.map((p, i) => (
        <mesh key={i} position={[0, 0, p.z]}>
          <planeGeometry args={[p.width, p.height]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              uOpacity: { value: p.opacity * intensity },
              uColorA: { value: new THREE.Color("#FAF8F2") },
              uColorB: { value: new THREE.Color("#BDD0A8") },
            }}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec2 vUv;
              uniform float uOpacity;
              uniform vec3 uColorA;
              uniform vec3 uColorB;
              void main() {
                float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
                edge = smoothstep(0.0, 1.0, edge);
                float fall = 1.0 - vUv.y;
                vec3 color = mix(uColorB, uColorA, edge);
                gl_FragColor = vec4(color, edge * fall * uOpacity);
              }
            `}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------
// Layer 2 — Flour haze: large, soft, low-opacity billboarded points at
// varying depths, additive, slow turbulent drift.
// ---------------------------------------------------------------------
export function FlourHaze({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      seeds[i] = Math.random() * 100;
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            pos.x += sin(uTime * 0.05 + aSeed) * 0.4;
            pos.y += cos(uTime * 0.04 + aSeed * 1.3) * 0.3;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (90.0 + aSeed) * uPixelRatio * (12.0 / -mv.z);
            vAlpha = 0.06 + 0.09 * fract(aSeed * 0.37);
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            float soft = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vec3(0.98, 0.97, 0.94), soft * vAlpha);
          }
        `}
      />
    </points>
  );
}

// ---------------------------------------------------------------------
// Layer 4 — The dough surface: subdivided plane, lower-right third,
// custom fbm crust shader + the corrected scoring SDF.
// ---------------------------------------------------------------------
export function DoughSurface({ displacement }: { displacement: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisplacement: { value: displacement ? 1 : 0 },
      uCrust: { value: new THREE.Color("#B5742F") },
      uCrustDeep: { value: new THREE.Color("#8A5320") },
      uFlour: { value: new THREE.Color("#FAF8F2") },
      uLightDir: { value: new THREE.Vector3(-1, 1, 0.6) },
    }),
    [displacement]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[3.4, -3.6, -1.5]} rotation={[-0.15, -0.5, 0.12]}>
      <planeGeometry args={[7, 6, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={doughVertexShader}
        fragmentShader={doughFragmentShader}
      />
    </mesh>
  );
}
