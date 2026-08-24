"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

/**
 * Mouse dollies the camera on a damped spring, ~2° max, 0.06 lerp (§6).
 * Mobile device-orientation parallax is opt-in behind a permission
 * prompt that's asked at most once; if denied (or unsupported), the
 * camera just holds its ambient position — never a second prompt.
 */
export function CameraRig({ enableOrientation }: { enableOrientation: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const askedRef = useRef(false);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = nx;
      target.current.y = ny;
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    let cleanupOrientation: (() => void) | undefined;

    if (enableOrientation && typeof window !== "undefined") {
      const DeviceOrientationEventTyped = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<"granted" | "denied">;
          })
        | undefined;

      function bindOrientation() {
        function onOrient(e: DeviceOrientationEvent) {
          if (e.gamma == null || e.beta == null) return;
          target.current.x = Math.max(-1, Math.min(1, e.gamma / 30));
          target.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
        }
        window.addEventListener("deviceorientation", onOrient);
        cleanupOrientation = () =>
          window.removeEventListener("deviceorientation", onOrient);
      }

      if (
        DeviceOrientationEventTyped &&
        typeof DeviceOrientationEventTyped.requestPermission === "function"
      ) {
        if (!askedRef.current) {
          askedRef.current = true;
          // Only actually prompted from a user gesture in most browsers;
          // this best-effort call is a no-op if not triggered by one, and
          // is never retried.
          DeviceOrientationEventTyped.requestPermission()
            .then((state) => {
              if (state === "granted") bindOrientation();
            })
            .catch(() => {
              /* denied or unsupported — ambient drift only */
            });
        }
      } else {
        bindOrientation();
      }
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      cleanupOrientation?.();
    };
  }, [enableOrientation]);

  useFrame(() => {
    current.current.x += (target.current.x - current.current.x) * 0.06;
    current.current.y += (target.current.y - current.current.y) * 0.06;
    const maxRad = (2 * Math.PI) / 180;
    camera.rotation.y = -current.current.x * maxRad;
    camera.rotation.x = -current.current.y * maxRad;
    camera.position.x = current.current.x * 0.3;
    camera.position.y = 0.3 - current.current.y * 0.2;
  });

  return null;
}
