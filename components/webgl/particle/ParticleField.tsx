"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { buildStalkField } from "./geometry";
import { particleFragmentShader, particleVertexShader } from "./shaders";
import {
  setTargetsFromProgress,
  tickUniforms,
  uniformCurrent,
} from "@/lib/particle-uniforms";
import { idleState, tickDriftBoost } from "@/lib/idle-drift";

type Props = {
  stalkCount: number;
  particlesPerStalk: number;
  mode: "scroll" | "autonomous" | "static";
};

const AUTONOMOUS_PERIOD = 26; // seconds for a full float->bloom->float loop

export function ParticleField({ stalkCount, particlesPerStalk, mode }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const clockRef = useRef(0);

  const field = useMemo(
    () => buildStalkField(stalkCount, particlesPerStalk),
    [stalkCount, particlesPerStalk]
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(field.aSeedPos.slice(), 3));
    geo.setAttribute("aStalkId", new THREE.BufferAttribute(field.aStalkId, 1));
    geo.setAttribute("aAlong", new THREE.BufferAttribute(field.aAlong, 1));
    geo.setAttribute("aStalkDelay", new THREE.BufferAttribute(field.aStalkDelay, 1));
    geo.setAttribute("aStalkHeight", new THREE.BufferAttribute(field.aStalkHeight, 1));
    geo.setAttribute("aSeedPos", new THREE.BufferAttribute(field.aSeedPos, 3));
    geo.setAttribute("aFloatPos", new THREE.BufferAttribute(field.aFloatPos, 3));
    geo.setAttribute("aJitter", new THREE.BufferAttribute(field.aJitter, 3));
    geo.setAttribute("aIsHead", new THREE.BufferAttribute(field.aIsHead, 1));
    geo.setAttribute("aPetalAngle", new THREE.BufferAttribute(field.aPetalAngle, 1));
    geo.setAttribute("aBend", new THREE.BufferAttribute(field.aBend, 2));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 20);
    return geo;
  }, [field]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSettle: { value: 0 },
      uGrowth: { value: 0 },
      uBloom: { value: 0 },
      uBaseSize: { value: 6.0 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      uDriftBoost: { value: 1.0 },
    }),
    []
  );

  useFrame((_, delta) => {
    clockRef.current += delta;

    if (mode === "autonomous") {
      const t = clockRef.current % AUTONOMOUS_PERIOD;
      // 0..1 rise, hold, fall — spends most of the loop grown/bloomed and
      // dips back to floating briefly, so the page still feels alive.
      const phase = t / AUTONOMOUS_PERIOD;
      const progress =
        phase < 0.55
          ? phase / 0.55
          : phase < 0.8
          ? 1
          : 1 - (phase - 0.8) / 0.2;
      setTargetsFromProgress(Math.min(1, Math.max(0, progress)));
    }
    // mode "scroll" — targets are set externally by the scroll driver.
    // mode "static" — targets were set once and left alone.

    if (mode !== "static") {
      tickDriftBoost(performance.now());
      tickUniforms();
    }

    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uTime.value = clockRef.current;
      u.uSettle.value = uniformCurrent.settle;
      u.uGrowth.value = uniformCurrent.growth;
      u.uBloom.value = uniformCurrent.bloom;
      u.uDriftBoost.value = idleState.driftBoost;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
