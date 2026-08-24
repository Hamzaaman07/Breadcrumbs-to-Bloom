import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The react-hooks "purity"/"immutability"/"set-state-in-effect" rules
    // target React Compiler compatibility and assume a purely declarative
    // render model. This site is a WebGL/canvas experience built on
    // Three.js, react-three-fiber, GSAP and Lenis, where mutating a ref's
    // `.current`, a shader uniform's `.value`, or seeding a memoized typed
    // array inside useMemo are the correct, idiomatic patterns (and are
    // never used to drive React's own render output) — not accidental
    // impurity. Disabling these three rules is a deliberate call for this
    // codebase, not a blanket opt-out of hooks correctness; the rest of
    // react-hooks (deps, rules-of-hooks, etc.) stays on.
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
