import Image from "next/image";
import { imageManifest } from "@/lib/image-manifest";

/**
 * Wraps next/image with a warm, on-brand placeholder for any slot that
 * doesn't have a real file yet at /public/images/<slot>.<ext>. Layout never
 * shifts when real photography lands because the aspect ratio is fixed by
 * `ratio` regardless of which branch renders.
 *
 * Real files: drop an image at /public/images/<slot>.jpg (or .png/.webp)
 * and it's used automatically — no code change needed. See ASSETS.md for
 * the full shot list.
 *
 * Which slots have real files is resolved at BUILD time, by
 * scripts/generate-image-manifest.mjs (wired to `prebuild`), not by
 * touching the filesystem at render time. That matters: this used to call
 * node:fs, which works on a Node server but silently returns nothing on
 * filesystem-less runtimes (Cloudflare Workers, edge) — so every real photo
 * would quietly render as a placeholder in production. A plain object
 * lookup behaves the same everywhere.
 */

type Props = {
  slot: string;
  ratio: number; // width / height, e.g. 3/2
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "sage" | "crust" | "cream";
};

function hashSlot(slot: string) {
  let h = 0;
  for (let i = 0; i < slot.length; i++) {
    h = (h * 31 + slot.charCodeAt(i)) >>> 0;
  }
  return h;
}

function findRealAsset(slot: string): string | null {
  return imageManifest[slot] ?? null;
}

export function BakeryImage({
  slot,
  ratio,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  tone = "sage",
}: Props) {
  const resolvedSrc = findRealAsset(slot);

  if (!resolvedSrc && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      `[BakeryImage] Missing asset for slot "${slot}" — using placeholder. See ASSETS.md.`
    );
  }

  const paddingBottom = `${(1 / ratio) * 100}%`;
  const hash = hashSlot(slot);

  const toneColors: Record<string, [string, string]> = {
    sage: ["#BDD0A8", "#64794F"],
    crust: ["#E3B98A", "#8A5320"],
    cream: ["#FAF8F2", "#ACC098"],
  };
  const [c1, c2] = toneColors[tone];
  const angle = 25 + (hash % 40);

  return (
    <div
      className={`relative w-full overflow-hidden bg-sage-light/40 ${className}`}
      style={{ paddingBottom }}
    >
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          role="img"
          aria-label={alt}
          style={{
            background: `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)`,
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full opacity-25"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id={`grain-${hash}`}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="0.6" fill="#232B14" opacity="0.15" />
                <circle cx="4" cy="3" r="0.5" fill="#FAF8F2" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grain-${hash})`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <span className="font-display text-sm italic text-olive-ink/50">
              {alt}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
