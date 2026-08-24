"use client";

import { useFrame, useThree } from "@react-three/fiber";
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
  const debugRef = useRef(
    typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debug") === "1"
  );

  // World-space width the camera can actually see at the field's depth,
  // bucketed so a resize only rebuilds the field on a real change.
  const viewportWidth = useThree((s) => s.viewport.width);
  const fieldWidth = useMemo(
    () => Math.max(3, Math.round(viewportWidth * 1.3 * 2) / 2),
    [viewportWidth]
  );

  const field = useMemo(
    () => buildStalkField(stalkCount, particlesPerStalk, fieldWidth),
    [stalkCount, particlesPerStalk, fieldWidth]
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
      // World-space crumb size (see uProjScale in the vertex shader).
      uBaseSize: { value: 0.042 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
      uProjScale: { value: 1000 },
      uDriftBoost: { value: 1.0 },
    }),
    []
  );

  useFrame((state, delta) => {
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
      tickUniforms(delta);
    }

    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      u.uTime.value = clockRef.current;
      u.uSettle.value = uniformCurrent.settle;
      u.uGrowth.value = uniformCurrent.growth;
      u.uBloom.value = uniformCurrent.bloom;
      u.uDriftBoost.value = idleState.driftBoost;
      const cam = state.camera as THREE.PerspectiveCamera;
      u.uProjScale.value =
        state.size.height / (2 * Math.tan((cam.fov * Math.PI) / 360));
    }

    // Read-only diagnostic, only with ?debug=1 — lets the live phase values
    // be inspected in the console (and asserted by the screenshot harness)
    // instead of eyeballing whether the field really returned to Floating.
    if (debugRef.current) {
      (window as unknown as { __bbUniforms?: unknown }).__bbUniforms = {
        ...uniformCurrent,
      };
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
