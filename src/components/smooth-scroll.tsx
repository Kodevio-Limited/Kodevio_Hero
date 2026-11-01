"use client";

/*
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger stayed
 * perfectly in sync (no separate rAF loops competing).
 * Skipped entirely when the user prefers reduced motion.
 */
import { useEffect } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    // Pinned sections add pin-spacers after Lenis is created; keep Lenis' scroll
    // limit in sync or wheel scrolling stops at the first pin's end.
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.addEventListener("refreshInit", onRefresh);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // Keep GSAP's default catch-up guard; disabling it made a dropped frame
    // (tab switch, heavy paint) snap the scroll-linked animations forward.
    gsap.ticker.lagSmoothing(500, 33);

    // Hard refresh must always start at the very top: kill browser scroll
    // restoration, any leftover hash, and ScrollTrigger's scroll memory.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Recalculate triggers once Lenis has its initial scroll position
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      lenis.destroy();
    };
  }, []);

  return null;
}
