"use client";

import BottomDock from "@/components/bottom-dock";
import CeoSection from "@/components/ceo-section";
import ClientReviewSection from "@/components/client-review";
import CompaniesSection from "@/components/companies-section";
import DigitalProductsSection from "@/components/digital-products";
import HeroSection from "@/components/hero-section";
import HowWeWorkSection from "@/components/how-we-work";
import OtherBrandsSection from "@/components/other-brands";
import WhyBrandsTrustSection from "@/components/why-brands-trust";
import PricingSection from "@/components/pricing-section";
import SplashScreen from "@/components/splash-screen";
import SmoothScroll from "@/components/smooth-scroll";
import TextReveal from "@/components/text-reveal";
import TransitionSection from "@/components/transition-section";
import CompanyReveal from "@/components/company-reveal";
import WhatWeDoSection from "@/components/what-we-do";
import { useCallback, useEffect, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [heroEntered, setHeroEntered] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [heroCovered, setHeroCovered] = useState(false);
  // The floating dock flips to a white pill while a dark service card is on screen.
  const [dockInverted, setDockInverted] = useState(false);

  // On any load/refresh: land on the hero, never on a restored mid-page scroll.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);
    (window as unknown as { lenis?: { scrollTo: (n: number, o?: { immediate?: boolean }) => void } }).lenis?.scrollTo(0, {
      immediate: true,
    });
  }, []);

  // Stable callbacks: an unstable handler identity used to re-run the splash
  // timers on every parent render, which could keep the splash alive forever.
  const handleTransitionStart = useCallback(() => setHeroEntered(true), []);
  const handleSplashComplete = useCallback(() => setSplashFinished(true), []);

  useEffect(() => {
    // Single refresh, only after the splash is gone and fonts/images settled.
    // (Never refresh from inside a ScrollTrigger callback — that recurses.)
    if (!splashFinished) return;
    let cancelled = false;

    // Re-assert the top position immediately before the first refresh, so no
    // pin-spacer / Lenis / restoration state can leave us at "What we do".
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);
    (window as unknown as { lenis?: { scrollTo: (n: number, o?: { immediate?: boolean }) => void } }).lenis?.scrollTo(0, {
      immediate: true,
    });

    const refresh = () => {
      if (cancelled) return;
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      (window as unknown as { lenis?: { resize: () => void } }).lenis?.resize();
    };
    Promise.resolve(document.fonts?.ready)
      .catch(() => undefined)
      .then(() => requestAnimationFrame(refresh));
    return () => {
      cancelled = true;
    };
  }, [splashFinished]);

  useEffect(() => {
    // One rAF-throttled scroll listener instead of a setState on every event.
    let frame = 0;
    let last: boolean | null = null;
    let lastCovered: boolean | null = null;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const next = y > 550;
      if (next !== last) {
        last = next;
        setScrolledPastHero(next);
      }
      // Pause the hero ambient loops only once the company section has fully
      // covered it; pausing at 550px would freeze clouds still in view.
      const covered = y > 1050;
      if (covered !== lastCovered) {
        lastCovered = covered;
        setHeroCovered(covered);
      }
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {!splashFinished && (
        <SplashScreen
          onTransitionStart={handleTransitionStart}
          onComplete={handleSplashComplete}
        />
      )}
      <main className="relative min-h-screen bg-white text-[#2d2f33] overflow-x-clip">
        {/* Lenis smooth scroll, synced to GSAP ScrollTrigger */}
        <SmoothScroll />
        {/* Masked line-slide reveal for section headings / body copy */}
        <TextReveal enabled={splashFinished} />
        {/* Section 1: Hero Section — stays completely still; content slides over it */}
        <div className="sticky top-0 z-0">
          <HeroSection
            isEntered={heroEntered}
            isNavVisible={!scrolledPastHero}
            paused={heroCovered}
          />
        </div>

        {/* Transition band + Company Logos — slide up over the sticky hero */}
        {/* All content after the hero sits on an opaque layer so the sticky hero
          never shows through at the sides of max-width sections. */}
      <div className="relative z-10 bg-white">
      <CompanyReveal enabled={splashFinished}>
          <TransitionSection />
          <CompaniesSection enabled={splashFinished} />
        </CompanyReveal>

        {/* Section 3: CEO & Platform Stats — pinned quote/stats after splash */}
        <CeoSection enabled={splashFinished} />

        {/* Section 4: See Pricing & Availability */}
        <PricingSection enabled={splashFinished} />

        {/* Section 5: How We Work (Folder Tabs) */}
        <HowWeWorkSection enabled={splashFinished} />

        {/* Section 6: Client Reviews (Video Testimonials) */}
        <ClientReviewSection enabled={splashFinished} />

        {/* Section 7: What We Do (Signature Contrast Dark Showcase) */}
        <WhatWeDoSection enabled={splashFinished} onDarkSlideChange={setDockInverted} />

        {/* Section 8: Specialist Brands (KodeMount & KodeOrbit) */}
        <OtherBrandsSection />

        {/* Section 9: Digital Products (Case Studies Grid — Figma 565:576) */}
        <DigitalProductsSection enabled={splashFinished} />

        {/* Section 10: Why Brands Trust Us (Figma 678:17744) */}
        <WhyBrandsTrustSection enabled={splashFinished} />
      </div>

        {/* Floating Bottom Navigation Dock */}
        <BottomDock visible={scrolledPastHero} inverted={dockInverted} />
      </main>
    </>
  );
}
