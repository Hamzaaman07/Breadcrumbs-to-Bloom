import { noiseGLSL } from "./noiseGLSL";

export const particleVertexShader = /* glsl */ `
attribute float aStalkId;
attribute float aAlong;
attribute float aStalkDelay;
attribute float aStalkHeight;
attribute vec3 aSeedPos;
attribute vec3 aFloatPos;
attribute vec3 aJitter;
attribute float aIsHead;
attribute float aPetalAngle;
attribute vec2 aBend;

uniform float uTime;
uniform float uSettle; // 0..1 floating -> seeded
uniform float uGrowth; // 0..1 seeded -> grown
uniform float uBloom;  // 0..1 grown -> bloomed
uniform float uBaseSize;
uniform float uPixelRatio;
uniform float uProjScale;
uniform float uDriftBoost; // idle drift amplitude boost after 6s untouched

varying vec3 vColor;
varying float vAlpha;

${noiseGLSL}

vec3 bezier(vec3 p0, vec3 p1, vec3 p2, float t) {
  vec3 a = mix(p0, p1, t);
  vec3 b = mix(p1, p2, t);
  return mix(a, b, t);
}

void main() {
  float hueJitter = (aJitter.x - 0.5) * 0.06;

  // ---- Floating ----
  float floatSpeed = 0.6 + aJitter.y * 0.8;
  vec3 largeDrift = vec3(
    fbm(aFloatPos * 0.25 + vec3(uTime * 0.03 * floatSpeed, 0.0, 0.0)),
    fbm(aFloatPos * 0.25 + vec3(0.0, uTime * 0.025 * floatSpeed, 17.0)),
    fbm(aFloatPos * 0.25 + vec3(0.0, 0.0, uTime * 0.02 * floatSpeed) + 42.0)
  ) - 0.5;
  vec3 smallShimmer = vec3(
    fbm(aFloatPos * 1.6 + uTime * 0.6 * floatSpeed),
    fbm(aFloatPos * 1.6 + uTime * 0.5 * floatSpeed + 5.0),
    fbm(aFloatPos * 1.6 + uTime * 0.55 * floatSpeed + 9.0)
  ) - 0.5;

  float driftAmp = 0.9 * uDriftBoost;
  vec3 floatOffset = largeDrift * driftAmp + smallShimmer * 0.18;

  // Whole field slow orbit
  float orbitAngle = uTime * 0.02;
  float ca = cos(orbitAngle);
  float sa = sin(orbitAngle);
  vec3 orbitedFloat = vec3(
    aFloatPos.x * ca - aFloatPos.z * sa,
    aFloatPos.y,
    aFloatPos.x * sa + aFloatPos.z * ca
  );

  vec3 floatingPos = orbitedFloat + floatOffset;

  // ---- Settling: float -> seed, physics-ish fall ----
  float fallStagger = clamp((uSettle - hash13(aSeedPos) * 0.35) / 0.65, 0.0, 1.0);
  float fallEase = 1.0 - pow(1.0 - fallStagger, 3.0); // eased fall
  float bounce = sin(fallStagger * 3.14159 * 2.2) * 0.05 * (1.0 - fallStagger) * step(0.001, fallStagger) * step(fallStagger, 0.98);
  vec3 driftedFloat = floatingPos + vec3(sin(uTime * 0.3 + aJitter.z * 6.28) * 0.15 * (1.0 - fallEase), 0.0, 0.0);
  vec3 settledPos = mix(driftedFloat, aSeedPos, fallEase);
  settledPos.y += bounce;

  // ---- Growing: fixed position along the stalk's bezier curve, gated by
  // an emergence front so the un-grown part does not exist yet. ----
  vec3 p0 = aSeedPos;
  vec3 p2 = aSeedPos + vec3(aBend.x * 0.6, aStalkHeight * 2.3, aBend.y * 0.6);
  vec3 p1 = aSeedPos + vec3(aBend.x * 1.1, aStalkHeight * 1.15, aBend.y * 1.1);
  vec3 grownPos = bezier(p0, p1, p2, aAlong);

  // Wind: low-freq noise, weighted by aAlong^2 so tips sway, bases planted.
  float windN = fbm(vec3(aSeedPos.x * 0.4, aSeedPos.z * 0.4, uTime * 0.15));
  float windAmt = (windN - 0.5) * 2.0 * 0.04 * (aAlong * aAlong);
  grownPos.x += windAmt;
  grownPos.z += windAmt * 0.6;

  // Grain-head migration into paired kernels once mature (before bloom).
  float stalkGrowthRaw = clamp((uGrowth - aStalkDelay * 0.45) / 0.55, 0.0, 1.0);
  float stalkGrowth = easeOutCubic(stalkGrowthRaw);
  float matureHead = smoothstep(0.75, 1.0, stalkGrowth) * aIsHead;
  float kernelSide = mod(floor(aJitter.z * 20.0), 2.0) < 1.0 ? 1.0 : -1.0;
  vec3 kernelOffset = vec3(kernelSide * 0.05, 0.0, kernelSide * 0.03) * matureHead;
  grownPos += kernelOffset;

  // ---- Blooming: heads fan out radially around the tip. ----
  // The fan is mostly screen-facing (x/y) with a little depth, so from the
  // front camera it opens as a flower head. Fanning purely in x/z (an
  // earlier version) foreshortened to a flat horizontal smear.
  vec3 tip = p2;
  float toTip = clamp((aAlong - 0.78) / 0.22, 0.0, 1.0);
  vec3 petalDir = vec3(
    cos(aPetalAngle),
    sin(aPetalAngle) * 0.8,
    sin(aPetalAngle) * 0.35
  );
  float petalR = 0.30 * toTip * uBloom * (0.7 + aJitter.x * 0.6);
  vec3 bloomOffset = petalDir * petalR;
  // Slight droop so the head reads as a heavy opened bloom, not a ring.
  bloomOffset.y -= abs(cos(aPetalAngle)) * 0.05 * uBloom * toTip;
  vec3 bloomedPos = mix(grownPos, tip + petalDir * 0.05 + bloomOffset, uBloom * aIsHead);

  // ---- Compose final position across the whole lifecycle ----
  vec3 pos = mix(settledPos, bloomedPos, clamp(uGrowth * 1.6, 0.0, 1.0));
  // Before any growth begins, snap fully to settledPos (grownPos==seed at
  // aAlong 0 anyway, so this mainly matters for particles further along
  // the stalk which must stay hidden/at-seed until their turn).
  pos = mix(pos, settledPos, 1.0 - smoothstep(0.0, 0.02, uGrowth + uBloom));

  // Emergence pop-out overshoot
  float emerged = smoothstep(aAlong - 0.06, aAlong + 0.02, stalkGrowth);
  float overshoot = sin(clamp(emerged, 0.0, 1.0) * 3.14159) * 0.06;
  vec3 outward = normalize(vec3(aBend.x + 0.001, 0.0, aBend.y + 0.001));
  pos += outward * overshoot * step(0.001, uGrowth);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // ---- Size: visible pre-growth (float/settle), gated by emergence once
  // growth starts, near/far depth sizing. ----
  float preGrowthVisible = 1.0 - smoothstep(0.0, 0.03, uGrowth);
  float sizeGate = max(preGrowthVisible, emerged);
  // uBaseSize is a WORLD size; uProjScale converts it to pixels for this
  // viewport/fov. (A previous hard-coded 240.0 constant here produced
  // ~240px points, which is why the field read as milky blobs instead of
  // crumbs.)
  float depthSize = uBaseSize * (uProjScale / -mvPosition.z);
  float headBoost = 1.0 + aIsHead * 0.6 * (0.4 + uBloom);
  gl_PointSize = max(1.0, depthSize * uPixelRatio * sizeGate * headBoost * (0.7 + aJitter.y * 0.6));

  // ---- Color ramp ----
  vec3 colFloat = vec3(0.961, 0.953, 0.914);
  vec3 colCrumb = vec3(0.788, 0.647, 0.420);
  vec3 colWheat = vec3(0.831, 0.663, 0.306);
  vec3 colWheatTip = vec3(0.902, 0.792, 0.549);
  vec3 colBloom = vec3(0.851, 0.659, 0.627);

  vec3 color = mix(colFloat, colCrumb, fallEase);
  vec3 wheatShade = mix(colWheat, colWheatTip, aAlong);
  color = mix(color, wheatShade, stalkGrowth);
  float headBloom = uBloom * aIsHead;
  color = mix(color, colBloom, headBloom);
  color *= (1.0 + hueJitter);

  vColor = color;
  vAlpha = sizeGate;
}
`;

export const particleFragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.15, d);
  float alpha = soft * vAlpha;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha);
}
`;
