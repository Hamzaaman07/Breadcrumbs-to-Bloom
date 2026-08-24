import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

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
 * This is a server component (no client JS, no runtime fetch) — the
 * filesystem check happens once at render time on the server, so there's
 * no placeholder-then-real flash and it works whether the parent tree is
 * a server or client component (pass it down as children/props into a
 * "use client" parent rather than importing it there directly).
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

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function hashSlot(slot: string) {
  let h = 0;
  for (let i = 0; i < slot.length; i++) {
    h = (h * 31 + slot.charCodeAt(i)) >>> 0;
  }
  return h;
}

function findRealAsset(slot: string): string | null {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    for (const ext of EXTENSIONS) {
      const filePath = path.join(imagesDir, `${slot}.${ext}`);
      if (fs.existsSync(filePath)) {
        return `/images/${slot}.${ext}`;
      }
    }
  } catch {
    // fs unavailable (e.g. edge runtime) — fall through to placeholder
  }
  return null;
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
