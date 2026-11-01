"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Figma node 324:24260 "Ceo Talking" — 1749 × 926 on a #F8F8F8 background:
 *
 *   Quote row (0 → 565)
 *     • quote icon   50×50  at (0, 0)      (rotated 180°)
 *     • quote text   1477w  at (82, 25)    Poppins Medium 45 / 1.4
 *     • profile      204w   at (1463, 281) image 204×211 r20, gap 11,
 *                                          name Poppins Medium 23 #2e3134,
 *                                          gap 8, role Poppins 16 #686868
 *     • quote icon   50×50  at (1699, 310) (flipped vertically)
 *
 *   Stats row (635 → 926, gap 70, group 1697.5 wide at x≈25.75)
 *     • 1px #d9d9d9 rules: horizontal full width; verticals at 425/850 (235 tall)
 *       and 1275 (291 tall)
 *     • 4 cards 260 wide at x = 82 / 507.5 / 932.5 / 1357.5, y = 44:
 *       icon row (brackets 20.7×56.2 + 64.8 icon, gap 8.878) → 24px →
 *       number Poppins Medium 45 black → 2px → label Satoshi Medium 19 #989898
 *
 * Sequence while pinned:
 *   1. words dim → bold (unchanged, scroll-scrubbed)
 *   2. ONLY after the text finishes: stats reveal + count-up, time-based
 *      (1.8s power2.out, 0.15s stagger) and played exactly once — no scroll
 *      coupling, no card flips
 *   3. short hold, then the pin releases and the page scrolls on
 *
 * The whole 1749×926 block is uniformly scaled with `zoom` so it always fits
 * one screen — the layout keeps Figma's exact proportions and text stays crisp.
 */
const QUOTE_WORDS = [
  "Great", "software", "isn't", "measured", "by", "lines", "of", "code",
  "it's", "measured", "by", "the", "growth", "it", "unlocks.",
  "At", "KODEVIO_LOGO", "we", "blend", "intuitive", "UX", "with", "ultra", "fast", "engineering",
  "and", "custom", "AI.", "Every", "detail", "is", "built", "to", "elevate", "your", "brand.",
  "You", "bring", "the", "vision;", "we’ll", "engineer", "the", "reality."
];

const STATS = [
  { id: "upwork", icon: "/ceo/stat_upwork.svg", label: "Job Success Score on Upwork", count: "number", to: 100, digits: 0, suffix: "%" },
  { id: "fiverr", icon: "/ceo/stat_fiverr.svg", label: "5-Star Reviews on Fiverr", count: "number", to: 450, digits: 0, suffix: "+" },
  { id: "rated", icon: "/ceo/stat_crown.svg", label: "Seller Status Across Platforms", count: "text" },
  { id: "rating", icon: "/ceo/stat_star.svg", label: "Average Client Rating", count: "number", to: 5, digits: 1, suffix: "" },
] as const;

const STAT_LEFT = [82, 507.5, 932.5, 1357.5]; // Figma card x positions inside the stats group

/* Each glyph is 50 wide × 36.9164 tall inside a 50×50 Figma box. */
function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center ${className}`}>
      <Image src="/ceo/quote.svg" alt="" width={50} height={37} className="h-[36.9164px] w-[50px]" aria-hidden="true" />
    </span>
  );
}

/* Word reveal built from a gray base and a dark overlay. The overlay only
 * changes opacity, so the whole quote stays on the compositor (no text paint
 * or background-position animation). */
function Word({ children }: { children: string }) {
  return (
    <span className="word relative mr-[0.25em] inline-block align-baseline font-medium">
      <span className="text-[#b9b9b9]">{children}</span>
      <span
        aria-hidden="true"
        className="word-fill pointer-events-none absolute inset-0 text-[#2d2f33] opacity-0"
      >
        {children}
      </span>
    </span>
  );
}

function QuoteText({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={`font-['Poppins',sans-serif] font-medium leading-[1.4] ${
        compact ? "text-[21px]" : "text-[45px]"
      }`}
    >
      {QUOTE_WORDS.map((word, i) => {
        if (word === "KODEVIO_LOGO") {
          return (
            <span
              key={i}
              className={`ml-[0.02em] mr-[0.24em] inline-flex -translate-y-[3px] align-middle ${
                compact ? "h-[24px] w-[102px]" : "h-[47.5px] w-[202px]"
              }`}
            >
              <Image
                src="/brand/logo_purple.png"
                alt="Kodevio"
                width={202}
                height={48}
                className="h-full w-full object-contain object-left"
              />
            </span>
          );
        }
        return <Word key={i}>{word}</Word>;
      })}
    </p>
  );
}

function Profile({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center gap-4" : "flex w-[204px] flex-col gap-[11px]"}>
      <div
        className={`overflow-hidden rounded-[20px] bg-[#dfdfdf] ${
          compact ? "h-[92px] w-[88px] shrink-0" : "h-[211px] w-[204px]"
        }`}
      >
        <Image
          src="/ceo/florian-krumm-euZ2n8dGUcQ-unsplash 1.png"
          alt="Farvez Hossen"
          width={204}
          height={211}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <h3 className={`font-['Poppins',sans-serif] font-medium text-[#2e3134] ${compact ? "text-[18px]" : "text-[23px]"} leading-[1.4]`}>
          Farvez Hossen
        </h3>
        <p className={`whitespace-nowrap font-['Poppins',sans-serif] font-normal text-[#686868] ${compact ? "text-[13px]" : "text-[16px]"} leading-[1.4]`}>
          Co-Founder, Kodevio Limited
        </p>
      </div>
    </div>
  );
}

function Stat({
  stat,
  compact = false,
  numberRef,
  unitRef,
  topRatedRef,
}: {
  stat: (typeof STATS)[number];
  compact?: boolean;
  numberRef: (el: HTMLSpanElement | null) => void;
  unitRef: (el: HTMLSpanElement | null) => void;
  topRatedRef: (el: HTMLSpanElement | null) => void;
}) {
  const bracketW = compact ? 12 : 20.716;
  const bracketH = compact ? 32 : 56.229;
  const iconSize = compact ? 38 : 64.811;

  return (
    <div className={`stat-card flex items-center justify-center ${compact ? "px-1" : ""}`}>
      <div className={`flex flex-col items-center gap-[24px] ${compact ? "w-full" : "w-[260px]"}`}>
        <div className="stat-bracket flex h-[64.811px] items-center justify-center gap-[8.878px]">
          <Image src="/ceo/bracket_left.svg" alt="" width={21} height={56} style={{ width: bracketW, height: bracketH }} />
          <Image src={stat.icon} alt="" width={65} height={65} style={{ width: iconSize, height: iconSize }} />
          <Image src="/ceo/bracket_right.svg" alt="" width={21} height={56} style={{ width: bracketW, height: bracketH }} />
        </div>

        <div className="flex w-full flex-col items-center gap-[2px] leading-[1.4]">
          <h4
            className={`stat-number font-['Poppins',sans-serif] text-[45px] font-medium text-black [font-variant-numeric:tabular-nums] ${
              compact ? "text-[30px]" : ""
            }`}
          >
            {stat.count === "number" ? (
              <>
                <span ref={numberRef} className="tracking-tight">
                  0
                </span>
                <span ref={unitRef} className="stat-unit">
                  {stat.suffix}
                </span>
              </>
            ) : (
              <span className="inline-block overflow-hidden align-top">
                <span ref={topRatedRef} className="inline-block">
                  Top Rated
                </span>
              </span>
            )}
          </h4>
          <p
            className={`w-full text-center font-['Satoshi'] font-medium text-[#989898] ${
              compact ? "text-[13px]" : "whitespace-nowrap text-[19px]"
            }`}
          >
            {stat.label}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CeoSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const unitRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const topRatedRef = useRef<HTMLSpanElement | null>(null);

  // Compact layout below 1024px (state changes only on breakpoint crossing).
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Scale the fixed 1749×926 Figma block so it always fits one screen.
   * `zoom` (not transform) keeps text rasterised at native resolution. */
  useEffect(() => {
    if (compact) {
      blockRef.current?.style.removeProperty("zoom");
      return;
    }
    const el = blockRef.current;
    if (!el) return;
    const apply = () => {
      const scale = Math.min(
        1,
        (window.innerWidth - 48) / 1749,
        (window.innerHeight - 56) / 926,
      );
      el.style.setProperty("zoom", String(Math.max(0.55, scale)));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [compact]);

  useEffect(() => {
    // Heavy scroll setup waits until the splash has finished/unmounted.
    if (!enabled) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          isMotion: "(prefers-reduced-motion: no-preference)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (media) => {
          const scope = pinRef.current!;
          const numEls = numberRefs.current;

          const dividers = gsap.utils.toArray<HTMLElement>(".stat-divider", scope);
          const verticals = gsap.utils.toArray<HTMLElement>(".stat-vertical", scope);
          const cards = gsap.utils.toArray<HTMLElement>(".stat-card", scope);
          const brackets = gsap.utils.toArray<HTMLElement>(".stat-bracket", scope);
          const units = gsap.utils.toArray<HTMLElement>(".stat-unit", scope);

          if (media.conditions?.isReduced) {
            // Final state, no pin, no animation.
            gsap.set(scope.querySelectorAll(".word-fill"), { opacity: 1 });
            gsap.set(dividers, { scaleX: 1, transformOrigin: "left center" });
            gsap.set(verticals, { scaleY: 1, transformOrigin: "top center" });
            gsap.set([...cards, ...brackets, ...units], { opacity: 1, y: 0 });
            if (topRatedRef.current) gsap.set(topRatedRef.current, { yPercent: 0 });
            STATS.forEach((s, i) => {
              if (s.count !== "number") return;
              const el = numEls[i];
              if (el) el.textContent = s.to.toFixed(s.digits);
            });
            return;
          }

          const wordEls = gsap.utils.toArray<HTMLElement>(".word-fill", scope);

          // Stats components are visible from the start; count-up starts concurrently with text reveal
          gsap.set(dividers, { scaleX: 1, transformOrigin: "left center" });
          gsap.set(verticals, { scaleY: 1, transformOrigin: "top center" });
          gsap.set(cards, { opacity: 1, y: 0 });
          gsap.set(brackets, { opacity: 1, y: 0 });
          gsap.set(units, { opacity: 1 });
          if (topRatedRef.current) gsap.set(topRatedRef.current, { yPercent: 0 });

          // Start words in the dim/unrevealed state
          gsap.set(wordEls, { opacity: 0 });

          /* ---- Stats count-up — runs concurrently when text reveal starts ---- */
          let statsPlayed = false;
          let statsTl: gsap.core.Timeline | null = null;

          const resetStats = () => {
            statsPlayed = false;
            statsTl?.kill();
            STATS.forEach((s, i) => {
              if (s.count !== "number") return;
              const el = numEls[i];
              if (el) el.textContent = (0).toFixed(s.digits);
            });
          };

          const playStats = () => {
            if (statsPlayed) return;
            statsPlayed = true;

            statsTl = gsap.timeline({ defaults: { ease: "power2.out" } });

            // Count-ups: 1.6s, power2.out, 0.1s stagger
            STATS.forEach((s, i) => {
              if (s.count !== "number") return;
              const start = 0.05 + i * 0.1;
              const el = numEls[i];
              if (el) {
                const proxy = { v: 0 };
                statsTl!.to(
                  proxy,
                  {
                    v: s.to,
                    duration: 1.6,
                    ease: "power2.out",
                    onUpdate: () => {
                      el.textContent = proxy.v.toFixed(s.digits);
                    },
                  },
                  start,
                );
              }
            });
          };

          const tl = gsap.timeline({
            defaults: { ease: "power1.out" },
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              // Keep the pin just long enough for the quote + count-up. A long
              // tail after the numbers finish reads as a frozen screen.
              end: compact ? "+=160%" : "+=180%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onLeaveBack: resetStats,
            },
          });

          /* ---- 1. Word reveal — starts on the first pin pixel ---- */
          tl.to(
            wordEls,
            {
              opacity: 1,
              duration: 0.22,
              stagger: 0.06,
              ease: "power1.out",
            },
            0
          );

          /* ---- 2. Count-up starts with the quote, so the pin is never idle ---- */
          tl.call(playStats, [], 0);

          /* No trailing hold: the pin releases as the count-up settles. */

          return () => {
            statsTl?.kill();
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );
    }, rootRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [enabled, compact]);

  return (
    <section ref={rootRef} id="ceo" aria-label="Leadership & Impact" className="relative w-full bg-white">
      <div
        ref={pinRef}
        className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-white px-4"
      >
        {compact ? (
          /* ---------- Compact layout (<1024px) ---------- */
          <div className="flex w-full max-w-[560px] flex-col gap-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <QuoteMark className="rotate-180 scale-[0.6]" />
                <QuoteText compact />
              </div>
              <Profile compact />
            </div>

            <div className="relative">
              <div className="stat-divider h-px w-full bg-[#d9d9d9]" />
              <div className="grid grid-cols-2 gap-x-2 gap-y-7 pt-7">
                {STATS.map((stat, i) => (
                  <Stat
                    key={stat.id}
                    stat={stat}
                    compact
                    numberRef={(el) => { numberRefs.current[i] = el; }}
                    unitRef={(el) => { unitRefs.current[i] = el; }}
                    topRatedRef={(el) => { topRatedRef.current = el; }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ---------- Figma-exact desktop block (1749 × 926) ---------- */
          <div ref={blockRef} className="relative h-[926px] w-[1749px] shrink-0">
            {/* ---- Quote row ---- */}
            <QuoteMark className="absolute left-0 top-0" />

            <div className="absolute left-[82px] top-[25px] w-[1477px]">
              <QuoteText />
            </div>

            <div className="absolute left-[1463px] top-[281px]">
              <Profile />
            </div>

            <QuoteMark className="absolute left-[1699px] top-[310px] rotate-180" />

            {/* ---- Stats row (top 635 = row 565 + 70 gap) ---- */}
            <div className="absolute left-[25.75px] top-[635px] h-[291px] w-[1697.5px]">
              <div className="stat-divider absolute left-0 top-0 h-px w-full origin-left bg-[#d9d9d9]" />
              <div className="stat-vertical absolute left-[425px] top-0 h-[235px] w-px origin-top bg-[#d9d9d9]" />
              <div className="stat-vertical absolute left-[850px] top-0 h-[235px] w-px origin-top bg-[#d9d9d9]" />
              <div className="stat-vertical absolute left-[1275px] top-0 h-[291px] w-px origin-top bg-[#d9d9d9]" />

              {STATS.map((stat, i) => (
                <div
                  key={stat.id}
                  className="absolute top-[44px] w-[260px]"
                  style={{ left: STAT_LEFT[i] }}
                >
                  <Stat
                    stat={stat}
                    numberRef={(el) => { numberRefs.current[i] = el; }}
                    unitRef={(el) => { unitRefs.current[i] = el; }}
                    topRatedRef={(el) => { topRatedRef.current = el; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
