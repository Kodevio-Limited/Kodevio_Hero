"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Figma node 694:17772 — service rail 3688×1080:
 * Exact 1:1 interlocking 5-card puzzle matching Figma:
 *   1. UI/UX Design     (light, 790px, left: 0px,    z: 20) with Subtract SVG
 *   2. App Development  (dark,  725px, left: 757px,  z: 10) with rounded-[32px]
 *   3. Web Development  (light, 790px, left: 1449px, z: 20) with Subtract SVG
 *   4. AI Integration   (dark,  725px, left: 2206px, z: 10) with rounded-[32px]
 *   5. Logo & Branding  (light, 790px, left: 2898px, z: 20) with Subtract SVG
 *
 * The white cards overlap the black cards by 33px. Their Subtract SVGs contain
 * the inverse rounded notches between y=81 and y=998 that frame the dark cards,
 * creating the crisp, visible dividing lines and interlocking top/bottom tabs.
 */
const LINES = ["Everything You Need", "to Design, Build, and", "Scale Digital Products"];

// Rail geometry in the unzoomed 1080px design space. Used only to decide which
// card sits under the floating dock, so its light/dark variant always matches.
const CARD_LAYOUT = [
  { left: 0, width: 790, dark: false },
  { left: 757, width: 725, dark: true },
  { left: 1449, width: 790, dark: false },
  { left: 2206, width: 725, dark: true },
  { left: 2898, width: 790, dark: false },
];

// The pinned timeline is just the rail: it starts moving on the first pixel
// after the pin engages, so the hand-off from "fixed" to "animating" is hidden.
const TIMELINE_UNITS = 3.2;
const RAIL_START_AT = 0;
const RAIL_DURATION = 3.2;

export default function WhatWeDoSection({
  enabled = true,
  onDarkSlideChange,
}: {
  enabled?: boolean;
  onDarkSlideChange?: (isDark: boolean) => void;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  // The rail is 1080px tall in Figma. Scale it to the viewport height (instead
  // of subtracting the dock height) so the cards fill the screen edge to edge.
  const [zoom, setZoom] = useState(0.86);

  const darkSlideCallbackRef = useRef(onDarkSlideChange);
  useEffect(() => {
    darkSlideCallbackRef.current = onDarkSlideChange;
  }, [onDarkSlideChange]);

  useEffect(() => {
    const updateZoom = () => {
      const vh = window.innerHeight;
      setZoom(Math.max(0.6, Number((vh / 1080).toFixed(4))));
    };
    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = gsap.utils.toArray<HTMLElement>(".what-line", rootRef.current);
      const rail = rootRef.current!.querySelector<HTMLElement>(".what-rail")!;
      const stage = rootRef.current!.querySelector<HTMLElement>(".what-heading-stage");

      const railStartX = () => window.innerWidth / zoom;
      const railEndX = () => -(rail.offsetWidth - window.innerWidth / zoom);
      const setDark = (isDark: boolean) => darkSlideCallbackRef.current?.(isDark);

      let lastDark: boolean | null = null;

      const syncDock = (rawProgress: number) => {
        const progress = Math.min(1, Math.max(0, rawProgress));
        const railProgress = Math.min(
          1,
          Math.max(0, (progress * TIMELINE_UNITS - RAIL_START_AT) / RAIL_DURATION),
        );
        // Match the rail tween's power1.inOut ease so the dock flips exactly
        // when the card under it changes.
        const eased =
          railProgress < 0.5
            ? 2 * railProgress * railProgress
            : 1 - Math.pow(-2 * railProgress + 2, 2) / 2;
        const railX = railStartX() + (railEndX() - railStartX()) * eased;
        // The screen point the dock sits over, expressed in the rail's design
        // coordinates (the rail is scaled by CSS `zoom`).
        const center = window.innerWidth / (2 * zoom) - railX;
        const card = CARD_LAYOUT.find(
          (item) => center >= item.left && center <= item.left + item.width,
        );
        const isDark = card ? card.dark : true;

        if (isDark !== lastDark) {
          lastDark = isDark;
          setDark(isDark);
        }
      };

      if (isReduced) {
        gsap.set(lines, { opacity: 1, yPercent: 0 });
        if (stage) gsap.set(stage, { opacity: 0 });
        if (rail) gsap.set(rail, { opacity: 1, x: railEndX() });
        setDark(false);
        return;
      }

      gsap.set(lines, { opacity: 0, yPercent: 100 });
      gsap.set(rail, { opacity: 1, x: railStartX() });

      // Reveal the intro copy during the section's entrance — before the pin
      // catches it. By the time the screen locks, the lines are already in and
      // the rail starts moving immediately.
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top 92%",
          end: "top top",
          scrub: 0.5,
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=420%",
          pin: true,
          pinSpacing: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: (self) => syncDock(self.progress),
          onEnterBack: (self) => syncDock(self.progress),
          onUpdate: (self) => syncDock(self.progress),
          onLeave: () => {
            lastDark = false;
            setDark(false);
          },
          onLeaveBack: () => {
            lastDark = false;
            setDark(false);
          },
        },
      });

      tl.to(stage, { opacity: 0, ease: "power2.in", duration: 0.35 }, 0)
        .to(rail, { x: () => railEndX(), ease: "power1.inOut", duration: RAIL_DURATION }, RAIL_START_AT);
    }, rootRef);

    return () => {
      ctx.revert();
      darkSlideCallbackRef.current?.(false);
    };
  }, [enabled, zoom]);

  return (
    <section
      ref={rootRef}
      id="services"
      aria-label="What We Do"
      className="relative w-full overflow-hidden bg-black"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black"
      >
        {/* Black intro stage */}
        <div className="what-heading-stage relative z-30 flex w-full max-w-[803px] flex-col items-center gap-[35px] px-5 text-center">
          <div className="flex size-[50px] shrink-0 items-center justify-center rounded-[8px] border-2 border-[#7974ee]">
            <svg viewBox="0 0 24 24" fill="none" className="size-[30px] text-[#7974ee]" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
            </svg>
          </div>

          <h2 className="w-full font-['Poppins',sans-serif] text-[34px] font-medium leading-[1.4] text-white sm:text-[46px] lg:text-[60px]">
            {LINES.map((line, idx) => (
              <span key={idx} className="block overflow-hidden py-[2px]">
                <span className="what-line block">{line}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Full service rail — exact 1:1 Figma 694:17772 interlocking card rail */}
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <div className="what-rail relative h-[1080px] w-[3688px] shrink-0" style={{ zoom }}>
            {/* ---------------- CARD 1: UI/UX Design (Light) ---------------- */}
            <article
              className="absolute left-0 top-0 z-20 h-[1080px] w-[790px]"
              aria-label="UI/UX Design"
            >
              {/* Figma Subtract SVG Background with Interlocking Notches */}
              <img
                src="/what-we-do/svg_4.svg"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full w-full flex-col items-center pt-[142px] text-center">
                <div className="flex w-[634px] flex-col items-center gap-[26px]">
                  <h3 className="w-full font-['Poppins',sans-serif] text-[57px] font-medium leading-[1.4] text-[#2d2f33]">
                    UI/UX Design
                  </h3>
                  <p className="w-full font-['Satoshi',sans-serif] text-[23px] font-normal leading-[1.4] text-[#686868]">
                    UI/UX Design, App Design, Website Design, Dashboard Design, Wireframing &amp; Prototyping, Interaction Design, and Product Design.
                  </p>
                </div>

                <a
                  href="#contact"
                  className="mt-[37px] flex h-[59px] items-center justify-center gap-[7px] rounded-[57px] px-[34px] py-[16px] font-['Satoshi',sans-serif] text-[20px] font-bold text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(166.67deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
                  }}
                >
                  <span>See More</span>
                  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Desk with keyboard & wireframe sketchbook */}
                <div className="absolute bottom-[121px] left-1/2 h-[475px] w-[502px] -translate-x-1/2 overflow-hidden rounded-[16px]">
                  <Image
                    src="/what-we-do/raw_11.jpeg"
                    alt="UI/UX Design"
                    fill
                    sizes="502px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </article>

            {/* ---------------- CARD 2: App Development (Dark) ---------------- */}
            <article
              className="absolute left-[757px] top-0 z-10 h-[1080px] w-[725px] overflow-hidden rounded-[32px] bg-[#0d0d0d]"
              aria-label="App Development"
            >
              <div className="relative z-10 flex h-full w-full flex-col items-center pt-[142px] text-center">
                <div className="flex w-[634px] flex-col items-center gap-[26px]">
                  <h3 className="whitespace-nowrap font-['Poppins',sans-serif] text-[57px] font-medium leading-[1.4] text-white">
                    App Development
                  </h3>
                  <p className="w-full font-['Satoshi',sans-serif] text-[23px] font-normal leading-[1.4] text-[#f2f2f2]">
                    We design user-friendly experiences for iPhone, Android, Flutter, and React Native apps, so your product feels polished, easy to use, and built for growth.
                  </p>
                </div>

                <a
                  href="#contact"
                  className="mt-[37px] flex h-[59px] items-center justify-center gap-[7px] rounded-[57px] px-[34px] py-[16px] font-['Satoshi',sans-serif] text-[20px] font-bold text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(166.67deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
                  }}
                >
                  <span>See More</span>
                  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* iPhone mockup on purple gradient with bottom frosted glass blur */}
                <div className="absolute top-[484px] left-1/2 h-[475px] w-[502px] -translate-x-1/2 overflow-hidden rounded-[16px] bg-gradient-to-b from-[#f8f2fe] to-[#ce96ff]">
                  <div className="absolute top-[23px] left-1/2 h-[507px] w-[275px] -translate-x-1/2">
                    <Image
                      src="/what-we-do/raw_0.png"
                      alt="App Development"
                      fill
                      sizes="275px"
                      className="object-cover"
                    />
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-0 h-[160px] w-full backdrop-blur-[14px] bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.25)]" />
                </div>
              </div>
            </article>

            {/* ---------------- CARD 3: Web Development (Light) ---------------- */}
            <article
              className="absolute left-[1449px] top-0 z-20 h-[1080px] w-[790px]"
              aria-label="Web Development"
            >
              {/* Figma Subtract SVG Background with Interlocking Notches */}
              <img
                src="/what-we-do/svg_4.svg"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full w-full flex-col items-center pt-[142px] text-center">
                <div className="flex w-[634px] flex-col items-center gap-[26px]">
                  <h3 className="w-full font-['Poppins',sans-serif] text-[57px] font-medium leading-[1.4] text-[#2d2f33]">
                    Web Development
                  </h3>
                  <p className="w-full font-['Satoshi',sans-serif] text-[23px] font-normal leading-[1.4] text-[#686868]">
                    Frontend Development, Backend Development, Full Stack Solutions, Mobile App Development, Custom Web Applications, API Integration.
                  </p>
                </div>

                <a
                  href="#contact"
                  className="mt-[37px] flex h-[59px] items-center justify-center gap-[7px] rounded-[57px] px-[34px] py-[16px] font-['Satoshi',sans-serif] text-[20px] font-bold text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(166.67deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
                  }}
                >
                  <span>See More</span>
                  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Tablet dashboard mockup on warm coral gradient */}
                <div className="absolute bottom-[121px] left-1/2 h-[475px] w-[502px] -translate-x-1/2 overflow-hidden rounded-[16px] bg-gradient-to-b from-[#ffd9d0] to-[#fe6946]">
                  <div className="absolute bottom-0 left-1/2 h-[380px] w-[502px] -translate-x-1/2">
                    <Image
                      src="/what-we-do/raw_1.png"
                      alt="Web Development"
                      fill
                      sizes="502px"
                      className="object-contain"
                    />
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-0 h-[160px] w-full backdrop-blur-[14px] bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.25)]" />
                </div>
              </div>
            </article>

            {/* ---------------- CARD 4: AI Integration (Dark) ---------------- */}
            <article
              className="absolute left-[2206px] top-0 z-10 h-[1080px] w-[725px] overflow-hidden rounded-[32px] bg-[#0d0d0d]"
              aria-label="AI Integration"
            >
              <div className="relative z-10 flex h-full w-full flex-col items-center pt-[142px] text-center">
                <div className="flex w-[634px] flex-col items-center gap-[26px]">
                  <h3 className="whitespace-nowrap font-['Poppins',sans-serif] text-[57px] font-medium leading-[1.4] text-white">
                    AI Integration
                  </h3>
                  <p className="w-full font-['Satoshi',sans-serif] text-[23px] font-normal leading-[1.4] text-[#f2f2f2]">
                    Our team integrates AI into product experiences where it creates real value simplifying workflows, improving decisions, and making products smarter, faster, and easier to use.
                  </p>
                </div>

                <a
                  href="#contact"
                  className="mt-[37px] flex h-[59px] items-center justify-center gap-[7px] rounded-[57px] px-[34px] py-[16px] font-['Satoshi',sans-serif] text-[20px] font-bold text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(166.67deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
                  }}
                >
                  <span>See More</span>
                  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Orange phone mockup on concrete steps */}
                <div className="absolute top-[484px] left-1/2 h-[475px] w-[502px] -translate-x-1/2 overflow-hidden rounded-[16px] bg-gradient-to-b from-[#ffecd8] to-[#ff8200]">
                  <Image
                    src="/what-we-do/raw_6.png"
                    alt="AI Integration"
                    fill
                    sizes="502px"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>

            {/* ---------------- CARD 5: Logo & Branding (Light) ---------------- */}
            <article
              className="absolute left-[2898px] top-0 z-20 h-[1080px] w-[790px]"
              aria-label="Logo & Branding"
            >
              {/* The last card has no neighbour on its right, so close the outer
                  notch with white instead of letting the black section show
                  through as a strip at the end of the rail. */}
              <div
                className="pointer-events-none absolute right-0 top-[52px] h-[975px] w-[48px] bg-white"
                aria-hidden="true"
              />

              {/* Figma Subtract SVG Background with Interlocking Notches */}
              <img
                src="/what-we-do/svg_4.svg"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full w-full flex-col items-center pt-[142px] text-center">
                <div className="flex w-[634px] flex-col items-center gap-[26px]">
                  <h3 className="w-full font-['Poppins',sans-serif] text-[57px] font-medium leading-[1.4] text-[#2d2f33]">
                    Logo &amp; Branding
                  </h3>
                  <p className="w-full font-['Satoshi',sans-serif] text-[23px] font-normal leading-[1.4] text-[#686868]">
                    Logo Design, Full Branding, Business Branding, 3D Logo, Custom Logo, Visual Identity, Brand Strategy, Social Media Branding, and Brand Guidelines.
                  </p>
                </div>

                <a
                  href="#contact"
                  className="mt-[37px] flex h-[59px] items-center justify-center gap-[7px] rounded-[57px] px-[34px] py-[16px] font-['Satoshi',sans-serif] text-[20px] font-bold text-white shadow-[0px_4px_8.15px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(166.67deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
                  }}
                >
                  <span>See More</span>
                  <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {/* Tote bag on bush under blue sky */}
                <div className="absolute bottom-[121px] left-1/2 h-[475px] w-[502px] -translate-x-1/2 overflow-hidden rounded-[16px] bg-gradient-to-b from-[#ffecd8] to-[#ff8200]">
                  <Image
                    src="/what-we-do/raw_2.png"
                    alt="Logo & Branding"
                    fill
                    sizes="502px"
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
