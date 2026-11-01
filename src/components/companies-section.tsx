"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
 * Figma node 324:24031 "Company Logo" (1583 × 446):
 *  - 2 rows × 4 cards, 392 × 192, 5px gaps, white cards, radius 12
 *  - 29px below the grid: caption Satoshi Medium 20px #989898
 *  - section background #F8F8F8
 *
 * Reveal (measured on orbix.studio): their hero is `position: sticky` and the
 * logo section simply scrolls over it — no pin, no transform, no scroll-jacking.
 * We mirror that: the hero is sticky (page.tsx) and this section overlays it.
 *
 * Flip loop (measured on orbix.studio): rotateY in the negative direction,
 * ~1.05s to travel 180° with a long ease-out tail (≈expo.out), cards staggered
 * by ~0.22s, each card's next flip ~4.26s after the previous one. Because we
 * must always end on the same logo (no back-logo design), each card performs a
 * continuous 360° turn instead of their 180°-hold-180° (see report).
 */
const CARD_W = 392;
const CARD_H = 192;

const COMPANIES = [
  { id: 1, name: "Company 1", src: "/companies/Compnay1.png", w: 151, h: 162 },
  { id: 2, name: "Company 2", src: "/companies/compnay2.png", w: 168, h: 156 },
  { id: 3, name: "Company 3", src: "/companies/compnay3.png", w: 147, h: 164 },
  { id: 4, name: "Company 4", src: "/companies/compnay4.png", w: 151, h: 123 },
  { id: 5, name: "Company 5", src: "/companies/compnay5.png", w: 107, h: 152 },
  { id: 6, name: "Company 6", src: "/companies/compnay6.png", w: 133, h: 135 },
  { id: 7, name: "Company 7", src: "/companies/compnay7.png", w: 135, h: 154 },
  { id: 8, name: "Company 8", src: "/companies/Group.png", w: 134, h: 170 },
];

/* Auto flip loop: 360° on Y, 1.2s power2.inOut, 0.25s stagger, 3s rest. */
const FLIP_DURATION = 1.2;
const STAGGER = 0.25;
const REST = 3;

function CompanyCard({ company }: { company: (typeof COMPANIES)[number] }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        aspectRatio: `${CARD_W} / ${CARD_H}`,
        perspective: "1600px",
      }}
    >
      <div className="flip-inner relative flex h-full w-full items-center justify-center [transform-style:preserve-3d]">
        {/* Front + back faces share the same logo: exactly Orbix's technique
            (backface hidden), so the mark is never mirrored or blank mid-flip.
            The hairline border is what makes each white card read as a square
            against the #F8F8F8 section, matching Figma 324:24031. */}
        <div className="card-face absolute inset-0 flex items-center justify-center rounded-[12px] border border-[#e9e9e9] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.035)] [backface-visibility:hidden]">
          <Image
            src={company.src}
            alt={company.name}
            width={company.w}
            height={company.h}
            draggable={false}
            style={{ width: `${(company.w / CARD_W) * 100}%`, height: "auto" }}
            className="object-contain"
          />
        </div>
        <div className="card-face absolute inset-0 flex items-center justify-center rounded-[12px] border border-[#e9e9e9] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.035)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <Image
            src={company.src}
            alt={company.name}
            width={company.w}
            height={company.h}
            draggable={false}
            style={{ width: `${(company.w / CARD_W) * 100}%`, height: "auto" }}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function CompaniesSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const ioRef = useRef<IntersectionObserver | null>(null);
  const syncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".flip-inner", root ?? undefined);

    if (reduce) {
      gsap.set(cards, { rotationY: 0 });
      return;
    }

    let visible = false;
    let tl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        transformOrigin: "50% 50%",
        force3D: true,
      });

      tl = gsap.timeline({ repeat: -1, repeatDelay: REST, paused: true });
      cards.forEach((el, i) => {
        tl!.fromTo(
          el,
          { rotationY: 0 },
          {
            rotationY: -360,
            duration: FLIP_DURATION,
            ease: "power3.inOut",
            force3D: true,
          },
          i * STAGGER,
        );
      });
      timelineRef.current = tl;

      const sync = () => {
        if (!tl) return;
        const active = visible && !document.hidden;
        root?.classList.toggle("is-flipping", active);
        if (active) tl.play();
        else tl.pause();
      };

      // Pause when off-screen…
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          sync();
        },
        { threshold: 0.15 },
      );
      if (root) io.observe(root);

      // …and when the tab is hidden.
      document.addEventListener("visibilitychange", sync);
      ioRef.current = io;
      syncRef.current = sync;
    }, rootRef);

    return () => {
      ctx.revert();
      ioRef.current?.disconnect();
      root?.classList.remove("is-flipping");
      document.removeEventListener("visibilitychange", syncRef.current ?? (() => {}));
      timelineRef.current = null;
    };
  }, [enabled]);

  return (
    <section
      ref={rootRef}
      id="companies"
      aria-label="Trusted Companies"
      className="relative z-10 w-full bg-[#f8f8f8] px-4 pt-16 pb-20 sm:px-8 sm:pt-20 lg:pt-[84px] lg:pb-[140px]"
    >
      {/* Figma 324:24031 — 1583 wide: 2×4 grid (5px gaps) + 29px + caption */}
      <div className="mx-auto flex w-full max-w-[1583px] flex-col items-center gap-[29px]">
        <div className="grid w-full grid-cols-2 gap-[5px] sm:grid-cols-4">
          {COMPANIES.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {/* Caption — Satoshi Medium 20px #989898, 29px below the grid */}
        <p className="w-full text-center font-['Satoshi'] text-[18px] leading-[1.4] font-medium text-[#989898] sm:text-[20px]">
          Chosen by 105+ SaaS Startups and Product Teams
        </p>
      </div>
    </section>
  );
}
