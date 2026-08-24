import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { Suspense } from "react";
import { WebGLSupportProvider } from "@/lib/webgl-support-context";
import { CanvasRoot } from "@/components/webgl/CanvasRoot";
import { AnnouncementBar } from "@/components/chrome/AnnouncementBar";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  weight: "variable",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://breadcrumbstoblooms.com"),
  title: {
    default: "Breadcrumbs to Blooms — Sourdough by Monica",
    template: "%s — Breadcrumbs to Blooms",
  },
  description:
    "Small-batch, long-fermented sourdough baked weekly in a home kitchen in Jurupa Valley, California. Preorder this week's bake, find our next pop-up, or read Monica's story.",
  openGraph: {
    title: "Breadcrumbs to Blooms — Sourdough by Monica",
    description:
      "Small-batch, long-fermented sourdough baked weekly in Jurupa Valley, California.",
    url: "https://breadcrumbstoblooms.com",
    siteName: "Breadcrumbs to Blooms",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breadcrumbs to Blooms — Sourdough by Monica",
    description:
      "Small-batch, long-fermented sourdough baked weekly in Jurupa Valley, California.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Breadcrumbs to Blooms",
  description:
    "Small-batch, long-fermented sourdough sold weekly by preorder in Jurupa Valley, California.",
  email: "breadcrumbstoblooms@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jurupa Valley",
    addressRegion: "CA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.9986,
    longitude: -117.4845,
  },
  areaServed: "Jurupa Valley and Riverside, California",
  sameAs: ["https://www.instagram.com/breadcrumbs_to_blooms/"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-cream text-olive">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-crust focus:px-4 focus:py-2 focus:text-cream-warm"
        >
          Skip to content
        </a>
        <WebGLSupportProvider>
          <Suspense fallback={null}>
            <CanvasRoot />
          </Suspense>
          <div className="relative z-10 flex min-h-full flex-col">
            <AnnouncementBar />
            <Nav />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </WebGLSupportProvider>
      </body>
    </html>
  );
}
