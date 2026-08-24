import { noiseGLSL } from "../particle/noiseGLSL";

// The dough surface's scoring pattern, corrected from client reference
// photos of Monica's actual loaf: ONE central vertical stem, with N pairs
// of narrow, pointed, elongated "leaf" cuts fanning outward and slightly
// upward from the stem, symmetric left/right, evenly spaced, tapering
// smaller toward the top — a wheat-stalk/fern-frond reading, not a generic
// wheat-sheaf icon. Flour visibly pools in the cut valleys (a lighter ring
// at each cut's edge).
export const doughFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uDisplacement; // 1 = full fermentation displacement, 0 = static
uniform float uFade;
uniform vec3 uCrust;
uniform vec3 uCrustDeep;
uniform vec3 uFlour;
uniform vec3 uLightDir;

varying vec2 vUv;
varying vec3 vNormal;

${noiseGLSL}

// Signed distance to a thin rounded segment.
float sdSegment(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

// One tapered "leaf" cut: a pointed oval built from two segments meeting
// at a tip, angled outward from the stem.
float leafCut(vec2 p, vec2 base, float angle, float length_, float width) {
  vec2 dir = vec2(sin(angle), cos(angle));
  vec2 tip = base + dir * length_;
  vec2 mid = base + dir * length_ * 0.5;
  float d1 = sdSegment(p, base, mid, width);
  float d2 = sdSegment(p, mid, tip, width * 0.35);
  return min(d1, d2);
}

float scoringField(vec2 uv) {
  // uv in 0..1 across the visible dough panel; recenter so stem runs
  // vertically through the middle, slightly left of center for a natural
  // off-axis look.
  vec2 p = (uv - vec2(0.46, 0.5)) * vec2(1.0, 1.6);

  float stem = sdSegment(p, vec2(0.0, -0.42), vec2(0.0, 0.46), 0.012);
  float d = stem;

  const int PAIRS = 6;
  for (int i = 0; i < PAIRS; i++) {
    float t = float(i) / float(PAIRS - 1); // 0 at base, 1 near top
    float y = mix(-0.32, 0.36, t);
    float taper = mix(0.20, 0.09, t); // shorter/narrower toward the top
    float width = mix(0.016, 0.008, t);
    float angleOut = mix(0.9, 0.55, t); // more upright near the top

    vec2 base = vec2(0.0, y);
    float dl = leafCut(p, base, -angleOut, taper, width);
    float dr = leafCut(p, base, angleOut, taper, width);
    d = min(d, min(dl, dr));
  }

  return d;
}

void main() {
  vec2 crustUv = vUv * 3.0;
  float n = fbm(vec3(crustUv, uTime * 0.02));
  float crackle = fbm(vec3(crustUv * 4.0 + 10.0, uTime * 0.015));
  vec3 crustColor = mix(uCrustDeep, uCrust, clamp(n * 0.7 + crackle * 0.3, 0.0, 1.0));

  float score = scoringField(vUv);

  // The score is CUT INTO the crust, so it is read as depth, never as a
  // drawn line: inCut is how deep inside the incision this pixel is, and
  // nearCut is the soft shadowed shoulder just outside it. Nothing here
  // is ever brighter than the surrounding crust — an earlier version rang
  // a near-white band OUTSIDE the cut, which made the scoring read as
  // glowing outlines instead of valleys.
  float inCut = smoothstep(0.004, -0.010, score);
  float nearCut = 1.0 - smoothstep(0.0, 0.045, score);

  vec3 crumbColor = mix(uCrustDeep * 0.42, vec3(0.30, 0.17, 0.09), 0.45);
  vec3 color = mix(crustColor, crumbColor, inCut);

  // Ambient occlusion on the shoulder of each cut.
  color *= 1.0 - 0.28 * nearCut * (1.0 - inCut);

  // Flour caught pale in the recesses — dimmed by the valley it sits in,
  // so it lifts the crumb slightly without ever glowing.
  float dust = fbm(vec3(crustUv * 6.0, 3.0));
  color = mix(color, uFlour * 0.58, inCut * dust * 0.55);

  // Light overall dusting across the crust.
  color = mix(color, uFlour, dust * 0.10);

  float diffuse = clamp(dot(normalize(vNormal), normalize(uLightDir)), 0.0, 1.0);
  // Lifted overall so the loaf reads as warm baked crust in morning light
  // rather than a muddy brown mass.
  vec3 lit = color * (0.86 + diffuse * 0.5);

  // Edge mask: the loaf is cropped generously by the viewport rather than
  // pasted on as a hard-edged wedge, so its borders dissolve with a noisy
  // falloff instead of a straight diagonal.
  vec2 e = min(vUv, 1.0 - vUv);
  float edge = smoothstep(0.0, 0.30, e.x) * smoothstep(0.0, 0.26, e.y);
  float edgeNoise = fbm(vec3(vUv * 5.0, 7.0)) * 0.35 + 0.65;
  float alpha = clamp(edge * edgeNoise, 0.0, 1.0) * uFade;

  gl_FragColor = vec4(lit, alpha);
}
`;

export const doughVertexShader = /* glsl */ `
uniform float uTime;
uniform float uDisplacement;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec3 pos = position;
  // Slow sine displacement, ~8s period — barely perceptible fermentation.
  float wave = sin(uTime * (6.2831 / 8.0) + position.x * 2.0 + position.y * 1.3);
  pos.z += wave * 0.02 * uDisplacement;

  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;
