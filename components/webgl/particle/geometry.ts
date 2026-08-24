// Builds the stalk field once, at init: every per-particle attribute the
// spec calls for (§5.2), baked into typed arrays for BufferAttributes.
// Nothing here runs per-frame — the shader does all the motion.

export type StalkFieldData = {
  count: number;
  aStalkId: Float32Array;
  aAlong: Float32Array;
  aStalkDelay: Float32Array;
  aStalkHeight: Float32Array;
  aSeedPos: Float32Array; // vec3
  aFloatPos: Float32Array; // vec3
  aJitter: Float32Array; // vec3
  aIsHead: Float32Array;
  aPetalAngle: Float32Array;
  aBend: Float32Array; // vec2 (xz bend direction for this stalk's curve)
};

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shallow noise-curved ground line, not flat — sampled with a simple sine
// stack so it's deterministic between JS (geometry) and doesn't need to
// match the shader exactly (it's just where seeds are planted).
function groundY(x: number, z: number) {
  return (
    Math.sin(x * 0.35 + z * 0.6) * 0.18 +
    Math.sin(x * 0.9 - z * 0.2) * 0.07
  );
}

export function buildStalkField(
  stalkCount: number,
  particlesPerStalk: number,
  seed = 1337
): StalkFieldData {
  const rand = mulberry32(seed);
  const count = stalkCount * particlesPerStalk;

  const aStalkId = new Float32Array(count);
  const aAlong = new Float32Array(count);
  const aStalkDelay = new Float32Array(count);
  const aStalkHeight = new Float32Array(count);
  const aSeedPos = new Float32Array(count * 3);
  const aFloatPos = new Float32Array(count * 3);
  const aJitter = new Float32Array(count * 3);
  const aIsHead = new Float32Array(count);
  const aPetalAngle = new Float32Array(count);
  const aBend = new Float32Array(count * 2);

  // Field footprint: wide-ish, shallow in Z (depth), centered slightly
  // right/low so it reads well behind left-aligned hero copy on desktop.
  const FIELD_WIDTH = 13;
  const FIELD_DEPTH = 5;

  for (let s = 0; s < stalkCount; s++) {
    const sx = (rand() - 0.5) * FIELD_WIDTH;
    const sz = (rand() - 0.5) * FIELD_DEPTH - 0.5;
    const sy = groundY(sx, sz) - 1.4; // soil line sits below viewport center

    const height = 0.6 + rand() * 0.8; // 0.6..1.4
    // Nearer stalks (larger z, closer to camera) start slightly earlier —
    // depth-based stagger, not left-to-right sweep — plus jitter.
    const depthNorm = (sz + FIELD_DEPTH / 2) / FIELD_DEPTH; // 0..1
    const delay = Math.min(
      1,
      Math.max(0, (1 - depthNorm) * 0.6 + rand() * 0.4)
    );

    const bendX = (rand() - 0.5) * 0.5;
    const bendZ = (rand() - 0.5) * 0.3;

    // Float centroid: scattered through a lit volume above/around the field.
    const floatCx = sx + (rand() - 0.5) * 1.5;
    const floatCy = 1.0 + rand() * 3.2;
    const floatCz = sz + (rand() - 0.5) * 2.0;

    for (let p = 0; p < particlesPerStalk; p++) {
      const idx = s * particlesPerStalk + p;
      const along = particlesPerStalk === 1 ? 0 : p / (particlesPerStalk - 1);
      const isHead = along > 0.78 ? 1 : 0;

      aStalkId[idx] = s;
      aAlong[idx] = along;
      aStalkDelay[idx] = delay;
      aStalkHeight[idx] = height;
      aIsHead[idx] = isHead;
      aPetalAngle[idx] = rand() * Math.PI * 2;

      aSeedPos[idx * 3 + 0] = sx;
      aSeedPos[idx * 3 + 1] = sy;
      aSeedPos[idx * 3 + 2] = sz;

      aFloatPos[idx * 3 + 0] = floatCx + (rand() - 0.5) * 0.6;
      aFloatPos[idx * 3 + 1] = floatCy + (rand() - 0.5) * 0.8;
      aFloatPos[idx * 3 + 2] = floatCz + (rand() - 0.5) * 0.6;

      aJitter[idx * 3 + 0] = rand();
      aJitter[idx * 3 + 1] = rand();
      aJitter[idx * 3 + 2] = rand();

      aBend[idx * 2 + 0] = bendX;
      aBend[idx * 2 + 1] = bendZ;
    }
  }

  return {
    count,
    aStalkId,
    aAlong,
    aStalkDelay,
    aStalkHeight,
    aSeedPos,
    aFloatPos,
    aJitter,
    aIsHead,
    aPetalAngle,
    aBend,
  };
}
