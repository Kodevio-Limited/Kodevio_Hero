"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Figma node 324:36262 "How we Work" — 1765 × 624, white:
 *   Left column (723 wide): 50×50 icon, 39px gap, heading Poppins Medium 60/1.4
 *   (2 lines), 40px gap, body Satoshi 28/1.4 (2 lines), 40px gap, 308×59 CTA.
 *   Right folder (910×624 at x=855): coloured folder shape, title at (36,45)
 *   Satoshi 33, body (36,115) Satoshi 23, white panel (36,246) 838×342 r14,
 *   3 × 115px tool tiles at (35,35)/(187.88,35)/(340.76,35), "PRODUCES:" at
 *   (35,191) Satoshi Medium 23 #989898, tags at y 251 (h56, r9).
 *
 * Motion: pinned; one folder card visible at a time. The Optimise & Grow card
 * sits on top (matching the Figma stack); scrolling flips it away and brings
 * the next folder in, each in its own colour. After all four have shown the
 * pin releases. Scrubbed, so scrolling up reverses the sequence.
 */
const PHASES = [
  {
    id: 1,
    title: "Discover & Strategy",
    description:
      "We explore your vision, user needs, and competitive market to build an actionable product strategy ensuring every design choice and technical feature drives real business growth.",
    folder: "/how-we-work/folder_peach.svg",
    color: "#F3AFAA",
    badge: "rgba(243, 175, 170, 0.25)",
    produces: ["Discovery Report", "User Personas", "Content Hierarchy"],
    icons: [
      { name: "Figma", bg: "#F24E1E", letter: "F", svg: null as string | null },
      { name: "Notion", bg: "#000000", letter: "N", svg: null },
      { name: "Miro", bg: "#FFD02F", letter: "M", svg: null },
    ],
  },
  {
    id: 2,
    title: "Design & Refine",
    description:
      "We transform strategic goals into beautiful, intuitive interfaces. Through rapid prototyping and continuous feedback, we craft engaging user journeys that reflect your brand identity.",
    folder: "/how-we-work/folder_lavender.svg",
    color: "#CDB3FF",
    badge: "rgba(205, 179, 255, 0.25)",
    produces: ["Visual Direction", "UI Screens", "Design System"],
    icons: [
      { name: "Figma", bg: "#A259FF", letter: "F", svg: null },
      { name: "Spline", bg: "#FF3366", letter: "S", svg: null },
      { name: "Adobe", bg: "#FF0000", letter: "A", svg: null },
    ],
  },
  {
    id: 3,
    title: "Build & Integrate",
    description:
      "Our engineering team translates approved designs into scalable, pixel-perfect code using modern tech stacks. We integrate essential APIs, custom AI models, and secure database layers.",
    folder: "/how-we-work/folder_blue.svg",
    color: "#ABDEFE",
    badge: "rgba(171, 222, 254, 0.25)",
    produces: ["Code Base", "CMS Integration", "Component Docs"],
    icons: [
      { name: "Next.js", bg: "#000000", letter: "N", svg: null },
      { name: "Supabase", bg: "#3ECF8E", letter: "S", svg: null },
      { name: "Tailwind", bg: "#06B6D4", letter: "T", svg: null },
    ],
  },
  {
    id: 4,
    title: "Optimise & Grow",
    description:
      "We closely study user behavior, implement continuous performance improvements, and refine your product experience to boost engagement and turn more visitors into customers.",
    folder: "/how-we-work/folder_green.svg",
    color: "#D0F49D",
    badge: "rgba(208, 244, 157, 0.35)",
    produces: ["CRO Recommendations", "A/B Test Plan", "Launch Report"],
    icons: [
      { name: "Claude", bg: "#D77655", letter: "", svg: "/how-we-work/svg_4.svg" },
      { name: "ChatGPT", bg: "#0EA982", letter: "", svg: "/how-we-work/svg_12.svg" },
      { name: "Ideogram", bg: "#eb1000", letter: "", svg: "/how-we-work/ideogram_icon.svg" },
    ],
  },
];

// Cards animate in phase order (1 → 2 → 3 → 4); later cards paint on top.
const CARD_ORDER = [...PHASES];

const BUTTON_GRADIENT =
  "linear-gradient(171.81deg, rgb(154,150,255) 8.4213%, rgb(104,97,238) 47.735%, rgb(88,81,234) 87.048%)";

function FolderCard({
  phase,
  compact,
}: {
  phase: (typeof PHASES)[number];
  compact: boolean;
}) {
  const iconSize = compact ? 64 : 115;

  return (
    <div
      className={`folder-card relative w-full ${
        compact ? "rounded-[18px] p-5 pb-6" : "h-[624px] w-[910px]"
      }`}
      style={compact ? { backgroundColor: phase.color } : undefined}
    >
      {/* Folder silhouette (Figma asset) — desktop only, exact shape */}
      {!compact && (
        <Image
          src={phase.folder}
          alt=""
          fill
          sizes="910px"
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
          aria-hidden="true"
        />
      )}

      <div className={compact ? "relative" : "absolute left-[36px] top-[45px] w-[848px]"}>
        <h3
          className={`font-['Satoshi'] font-bold text-[#2d2f33] ${
            compact ? "text-[22px]" : "h-[46px] text-[33px] leading-[1.4]"
          }`}
        >
          {phase.title}
        </h3>
        <p
          className={`font-['Satoshi'] font-normal text-[#2d2f33] ${
            compact ? "mt-2 text-[14px] leading-[1.5]" : "mt-[24px] h-[96px] w-[848px] text-[23px] leading-[1.4]"
          }`}
        >
          {phase.description}
        </p>
      </div>

      {/* White panel */}
      <div
        className={
          compact
            ? "relative mt-4 rounded-[12px] bg-white p-4"
            : "absolute left-[36px] top-[246px] h-[342px] w-[838px] overflow-hidden rounded-[14px] bg-white"
        }
      >
        <div className={`flex gap-[8.878px] ${compact ? "" : "pl-[35px] pt-[35px]"}`}>
          {phase.icons.map((icon) => (
            <div
              key={icon.name}
              className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-[18px]"
              style={{
                width: iconSize,
                height: iconSize,
                backgroundColor: icon.bg,
              }}
            >
              {icon.svg ? (
                <Image
                  src={icon.svg}
                  alt={icon.name}
                  width={iconSize}
                  height={iconSize}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[42px] font-bold text-white">{icon.letter}</span>
              )}
            </div>
          ))}
        </div>

        <div className={compact ? "mt-5" : "absolute left-[35px] top-[191px] w-[613px]"}>
          <p
            className={`font-['Satoshi'] font-medium text-[#989898] ${
              compact ? "text-[12px]" : "text-[23px] leading-[1.4]"
            }`}
          >
            PRODUCES:
          </p>
          <div className={`flex flex-nowrap gap-[12px] ${compact ? "mt-2" : "mt-[28px]"}`}>
            {phase.produces.map((tag) => (
              <span
                key={tag}
                className={`shrink-0 whitespace-nowrap rounded-[9px] font-['Satoshi'] font-medium text-[#4b4b4b] ${
                  compact ? "px-2 py-1.5 text-[11px]" : "p-[12px] text-[23px] leading-[1.4]"
                }`}
                style={{ backgroundColor: phase.badge }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowWeWorkSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (compact) {
      blockRef.current?.style.removeProperty("zoom");
      return;
    }
    const el = blockRef.current;
    if (!el) return;
    const apply = () => {
      const scale = Math.min(1, (window.innerWidth - 48) / 1765, (window.innerHeight - 64) / 624);
      el.style.setProperty("zoom", String(Math.max(0.5, scale)));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [compact]);

  useEffect(() => {
    if (!enabled) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        {
          isMotion: "(prefers-reduced-motion: no-preference)",
          isReduced: "(prefers-reduced-motion: reduce)",
        },
        (media) => {
          const cards = gsap.utils.toArray<HTMLElement>(".folder-card", rootRef.current);

          if (media.conditions?.isReduced) {
            // Reduced motion: final card visible, no pin.
            cards.forEach((card, i) => gsap.set(card, { yPercent: 0, opacity: i === cards.length - 1 ? 1 : 0 }));
            return;
          }

          // Card states are set by GSAP only; hidden cards sit below the clip.
          // On compact layouts the cards are shorter than their 640px stage,
          // so a percentage offset is not enough to clear the clip — use a full
          // pixel offset there instead.
          const hiddenYPercent = compact ? 0 : 112;
          const hiddenY = compact ? 900 : 0;

          cards.forEach((card, i) => {
            gsap.set(card, {
              yPercent: i === 0 ? 0 : hiddenYPercent,
              y: i === 0 ? 0 : hiddenY,
              scale: i === 0 ? 1 : 0.94,
              opacity: 1,
              rotationY: 0,
              transformOrigin: "50% 50%",
              force3D: true,
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: "+=260%",
              pin: true,
              pinSpacing: true,
              // A little more lag than before: the card glides after the wheel
              // instead of tracking every raw scroll tick.
              scrub: 1.05,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                rootRef.current?.classList.toggle("is-pin-active", self.isActive);
              },
            },
          });

          // Card 1 stays put. Each next card lifts up over the stack, easing
          // from 94% so the pop-up has a soft landing and settles 24px lower,
          // leaving the layers underneath peeking out.
          cards.forEach((card, i) => {
            if (i === 0) return;
            tl.fromTo(
              card,
              { yPercent: hiddenYPercent, y: hiddenY, scale: 0.94 },
              { yPercent: 0, y: i * 24, scale: 1, ease: "power2.out", duration: 1.15 },
              (i - 1) * 0.9,
            );
          });

          // Release the pin as soon as the last card settles — no static hold.

          return () => {
            rootRef.current?.classList.remove("is-pin-active");
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );
    }, rootRef);

    let alive = true;
    Promise.resolve(document.fonts?.ready)
      .catch(() => undefined)
      .then(() => {
        if (alive) requestAnimationFrame(() => ScrollTrigger.refresh());
      });

    return () => {
      alive = false;
      ctx.revert();
      mm.revert();
    };
  }, [enabled, compact]);

  return (
    <section
      ref={rootRef}
      id="how-we-work"
      aria-label="How We Work"
      className="relative w-full overflow-hidden bg-white"
    >
      <div
        ref={pinRef}
        className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-white px-4"
      >
        {compact ? (
          // Distinct keys keep React from reusing the desktop node (which
          // carries an imperative `zoom` that must not survive into compact).
          <div key="compact" className="flex w-full max-w-[520px] flex-col gap-8 py-10">
            <div className="flex flex-col items-start">
              <div className="flex size-[40px] items-center justify-center rounded-[8px] border-2 border-[#989898]">
                <svg viewBox="0 0 24 24" fill="none" className="size-5 text-[#2d2f33]" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#2d2f33" />
                </svg>
              </div>
              <h2 className="mt-5 font-['Poppins',sans-serif] text-[28px] font-medium leading-[1.3] text-[#2d2f33]">
                How We Bring Your Vision to Life
              </h2>
              <p className="mt-4 font-['Satoshi'] text-[15px] leading-[1.5] text-black">
                Four clear phases that keep you in the loop at every milestone from our first
                strategy call to post-launch scaling.
              </p>
            </div>
            <div className="relative h-[640px] overflow-hidden">
              {CARD_ORDER.map((phase) => (
                <div key={phase.id} className="absolute inset-x-0 top-0">
                  <FolderCard phase={phase} compact />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={blockRef} className="relative flex h-[624px] w-[1765px] shrink-0 items-start justify-between">
            {/* Left column */}
            <div className="w-[723px] pt-0">
              <div className="flex size-[50px] items-center justify-center rounded-[8px] border-2 border-[#989898]">
                <svg viewBox="0 0 24 24" fill="none" className="size-[30px] text-[#2d2f33]" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#2d2f33" />
                </svg>
              </div>

              <h2 className="mt-[39px] w-[723px] font-['Poppins',sans-serif] text-[60px] font-medium leading-[1.4] text-[#2d2f33]">
                How We Bring Your Vision to Life
              </h2>

              <p className="mt-[40px] w-[723px] font-['Satoshi'] text-[28px] font-normal leading-[1.4] text-black">
                Four clear phases that keep you in the loop at every milestone from our first
                strategy call to post-launch scaling.
              </p>

              <a
                href="#contact"
                className="mt-[40px] inline-flex h-[59px] w-[308px] items-center justify-center gap-[7px] rounded-[57px] font-['Satoshi'] text-[20px] font-bold text-white"
                style={{ backgroundImage: BUTTON_GRADIENT, boxShadow: "0 4px 8.15px rgba(0,0,0,0.12)" }}
              >
                Explore AI Capabilities
                <svg viewBox="0 0 24 24" fill="none" className="size-[24px]" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Right folder stack — phase 4 ends on top */}
            <div className="relative h-[700px] w-[910px] overflow-hidden">
              {CARD_ORDER.map((phase) => (
                <div key={phase.id} className="absolute inset-0">
                  <FolderCard phase={phase} compact={false} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
