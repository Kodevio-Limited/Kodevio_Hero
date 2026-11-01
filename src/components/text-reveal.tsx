"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * Orbix text motion (measured): their entry animations are block fades/rises,
 * while their per-character "roll" (SplitText chars, masked, yPercent -100)
 * uses duration 0.26s, stagger 0.015, ease power2.inOut — and their card entry
 * uses duration 1.15s, ease power3.out. For headings/body we use a masked
 * per-line slide: yPercent 110 → 0, 0.75s, expo.out, 0.08s line stagger,
 * triggered when the element's top passes 88% of the viewport, once.
 * Only transform is animated (mask hides the line before it slides in).
 */
export default function TextReveal({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const splits: SplitText[] = [];
    let ctx: gsap.Context | null = null;
    const revealEls = gsap.utils.toArray<HTMLElement>("[data-reveal]");

    // Hold the space with opacity only until the lines are split, so the copy
    // never flashes at full strength for a frame before the reveal starts.
    revealEls.forEach((el) => el.classList.add("reveal-pending"));

    const build = () => {
      if (cancelled) return;
      const els = revealEls;
      ctx = gsap.context(() => {
        els.forEach((el) => {
          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "reveal-line",
          });
          splits.push(split);
          el.classList.remove("reveal-pending");

          const lineEls = split.lines as HTMLElement[];
          const tween = gsap.from(lineEls, {
            yPercent: 110,
            duration: 0.75,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
            onStart: () => {
              lineEls.forEach((line) => {
                line.style.willChange = "transform";
              });
            },
            onComplete: () => {
              lineEls.forEach((line) => {
                line.style.willChange = "auto";
              });
            },
          });
          // If the element is already past the trigger point, the tween may
          // complete immediately; make sure the promote hint is not left on.
          if (tween.progress() === 1) {
            lineEls.forEach((line) => {
              line.style.willChange = "auto";
            });
          }
        });
        // Line wrapping can change heights by a pixel; re-measure pins once.
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, els[0]?.parentElement ?? document.body);
    };

    // Split after fonts settle so line breaks match the final layout.
    Promise.resolve(document.fonts?.ready)
      .catch(() => undefined)
      .then(() => requestAnimationFrame(build));

    return () => {
      cancelled = true;
      splits.forEach((s) => s.revert());
      revealEls.forEach((el) => el.classList.remove("reveal-pending"));
      ctx?.revert();
    };
  }, [enabled]);

  return null;
}
