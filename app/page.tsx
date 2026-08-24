import { Hero } from "@/components/sections/Hero";
import { ThisWeeksBake } from "@/components/sections/ThisWeeksBake";
import { BreadWorthWaiting } from "@/components/sections/BreadWorthWaiting";
import { MeetMonica } from "@/components/sections/MeetMonica";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FindUsAroundTown } from "@/components/sections/FindUsAroundTown";
import { FromTheBakery } from "@/components/sections/FromTheBakery";
import { NeverMissABake } from "@/components/sections/NeverMissABake";
import { BakeryImage } from "@/components/media/BakeryImage";
import { pillars } from "@/content/products";

export default function Home() {
  const pillarImages = pillars.map((p) => (
    <BakeryImage key={p.slug} slot={p.imageSlot} ratio={16 / 9} alt="" className="h-full" tone="crust" />
  ));

  return (
    <>
      <Hero
        fallbackImage={
          <BakeryImage
            slot="hero-fallback-loaf"
            ratio={16 / 9}
            alt="A warm, hand-scored sourdough loaf on a linen-lined counter"
            className="h-full"
            tone="crust"
            priority
          />
        }
      />
      <ThisWeeksBake />
      <BreadWorthWaiting images={pillarImages} />
      <MeetMonica />
      <HowItWorks />
      <FindUsAroundTown />
      <FromTheBakery />
      <NeverMissABake />
    </>
  );
}
