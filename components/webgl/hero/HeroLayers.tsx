"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { doughFragmentShader, doughVertexShader } from "./doughShader";
import { uniformCurrent } from "@/lib/particle-uniforms";

// ---------------------------------------------------------------------
// Layer 1 — Volumetric light: implemented as layered soft-edged additive
// planes (the spec's explicit fallback) rather than a raymarched quad —
// see NOTES.md / PLAN.md for why. Warm shaft raking from upper-left,
// angle drifting on a ~40s period.
//
// All three hero layers below read uniformCurrent.heroFade every frame and
// fade themselves out with it, so that by ~60vh of scroll the page is
// handed to the particle field alone against cream (spec §6).
// ---------------------------------------------------------------------
export function LightShaft() {
  const group = useRef<THREE.Group>(null);

  const planes = useMemo(
    () => [
      { width: 5.5, height: 16, opacity: 0.16, z: -3 },
      { width: 3.2, height: 14, opacity: 0.22, z: -2 },
      { width: 1.6, height: 12, opacity: 0.28, z: -1 },
    ],
    []
  );

  const materials = useRef<THREE.ShaderMaterial[]>([]);

  useFrame(({ clock }) => {
    const fade = uniformCurrent.heroFade;
    if (group.current) {
      const drift = Math.sin(clock.elapsedTime * ((Math.PI * 2) / 40)) * 0.08;
      group.current.rotation.z = -0.55 + drift;
      // The shaft narrows as it recedes, rather than only dimming.
      group.current.scale.x = 0.35 + 0.65 * fade;
      group.current.visible = fade > 0.01;
    }
    materials.current.forEach((mat, i) => {
      if (mat) mat.uniforms.uOpacity.value = planes[i].opacity * fade;
    });
  });

  return (
    <group ref={group} position={[-3.5, 3.5, -2]} rotation={[0, 0, -0.55]}>
      {planes.map((p, i) => (
        <mesh key={i} position={[0, 0, p.z]}>
          <planeGeometry args={[p.width, p.height]} />
          <shaderMaterial
            ref={(m) => {
              if (m) materials.current[i] = m;
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              uOpacity: { value: p.opacity },
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
// Layer 2 — Flour haze: many large, very soft, very low-opacity
// billboarded sprites at varying depths. Atmosphere, not confetti — and
// deliberately not "floating orbs" (§2): per-sprite alpha is kept low
// enough that no individual sprite reads as an object, and the additive
// stack settles into a haze rather than blowing out to milky blobs.
// ---------------------------------------------------------------------
export function FlourHaze({ count }: { count: number }) {
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    // Deterministic PRNG so the haze is identical between renders.
    let s = 20260824;
    const rand = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (rand() - 0.5) * 16;
      positions[i * 3 + 1] = (rand() - 0.5) * 10;
      positions[i * 3 + 2] = (rand() - 0.5) * 7 - 1;
      seeds[i] = rand() * 100;
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFade: { value: 1 },
      uProjScale: { value: 1000 },
    }),
    []
  );

  useFrame(({ clock, size, camera }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uFade.value = uniformCurrent.heroFade;
    const persp = camera as THREE.PerspectiveCamera;
    uniforms.uProjScale.value =
      size.height / (2 * Math.tan((persp.fov * Math.PI) / 360));
  });

  return (
    <points frustumCulled={false}>
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
          uniform float uFade;
          uniform float uProjScale;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            pos.x += sin(uTime * 0.05 + aSeed) * 0.4;
            pos.y += cos(uTime * 0.04 + aSeed * 1.3) * 0.3;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            // Deliberately large and heavily overlapping: many big, very
            // faint gaussians average into smooth atmosphere, whereas
            // smaller/denser sprites read as discrete discs ("orbs", §2).
            float worldSize = 0.9 + 1.1 * fract(aSeed * 0.271);
            gl_PointSize = worldSize * uProjScale / -mv.z;
            // Opacity ceiling ~0.15 is the *stack* budget, so each sprite
            // sits an order of magnitude below it.
            vAlpha = (0.005 + 0.009 * fract(aSeed * 0.37)) * uFade;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            // Wide gaussian falloff — no rim at all, so nothing reads as a disc.
            float soft = exp(-d * d * 14.0) * smoothstep(0.5, 0.34, d);
            float a = soft * vAlpha;
            if (a < 0.002) discard;
            gl_FragColor = vec4(vec3(0.98, 0.97, 0.94), a);
          }
        `}
      />
    </points>
  );
}

// ---------------------------------------------------------------------
// Layer 4 — The dough surface: subdivided plane in the lower-right third,
// custom fbm crust shader + the scoring SDF, masked at its edges so it is
// cropped by the viewport as a texture and a presence rather than pasted
// on as a hard-edged wedge (spec §6).
// ---------------------------------------------------------------------
export function DoughSurface({ displacement }: { displacement: boolean }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDisplacement: { value: displacement ? 1 : 0 },
      uFade: { value: 1 },
      uCrust: { value: new THREE.Color("#B5742F") },
      uCrustDeep: { value: new THREE.Color("#8A5320") },
      uFlour: { value: new THREE.Color("#FAF8F2") },
      uLightDir: { value: new THREE.Vector3(-1, 1, 0.6) },
    }),
    [displacement]
  );

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
    const fade = uniformCurrent.heroFade;
    uniforms.uFade.value = fade;
    if (meshRef.current) {
      // Recedes as it dims, rather than only fading in place.
      meshRef.current.position.z = -1.5 - (1 - fade) * 2.5;
      meshRef.current.visible = fade > 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[3.4, -3.6, -1.5]} rotation={[-0.15, -0.5, 0.12]}>
      <planeGeometry args={[9, 8, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={doughVertexShader}
        fragmentShader={doughFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
