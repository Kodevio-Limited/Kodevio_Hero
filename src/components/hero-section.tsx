"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LivingGrass from "@/components/living-grass";

/* Exact icon geometry pulled from Figma (node 1:2 subtree) */
function ArrowUpRight({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5.96249 17.2485L18.0378 6.75153M9.57323 6.15962L18.0378 6.75153L17.4459 15.2161"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ className = "h-5 w-[19px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 19 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M15.4356 6.6582L9.5 12.748L3.56436 6.6582C3.45834 6.54952 3.3162 6.48869 3.16821 6.48869C3.02023 6.48869 2.87809 6.54952 2.77207 6.6582C2.6627 6.76902 2.60156 6.91745 2.60156 7.07195C2.60156 7.22645 2.6627 7.37488 2.77207 7.4857L9.08623 13.9492C9.19705 14.0626 9.34548 14.126 9.5 14.126C9.65452 14.126 9.80295 14.0626 9.91377 13.9492L16.2279 7.4857C16.3373 7.37488 16.3984 7.22645 16.3984 7.07195C16.3984 6.91745 16.3373 6.76902 16.2279 6.6582C16.1219 6.54952 15.9798 6.48869 15.8318 6.48869C15.6838 6.48869 15.5416 6.54952 15.4356 6.6582Z"
        fill="#e9e9e9"
      />
    </svg>
  );
}

function Star({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M22.533 10.8825L18.3045 15.0045L19.3035 20.8245C19.3402 21.028 19.3317 21.2371 19.2785 21.437C19.2254 21.6369 19.1289 21.8226 18.996 21.981C18.8602 22.1416 18.6914 22.2711 18.5013 22.3609C18.3111 22.4507 18.1038 22.4987 17.8935 22.5015C17.6613 22.5005 17.4328 22.4434 17.2275 22.335L12.0015 19.5855L6.7755 22.3335C6.48425 22.4793 6.15283 22.5242 5.83328 22.4612C5.51373 22.3982 5.22415 22.2309 5.01 21.9855C4.87586 21.8271 4.77834 21.6411 4.7244 21.4406C4.67047 21.2402 4.66146 21.0303 4.698 20.826L5.697 15.006L1.4685 10.884C1.27558 10.6994 1.13905 10.4638 1.07478 10.2046C1.01052 9.94545 1.02117 9.67336 1.1055 9.42C1.18515 9.16406 1.3361 8.93612 1.54066 8.7629C1.74523 8.58969 1.99493 8.47837 2.2605 8.442L8.1045 7.593L10.7175 2.298C11.2095 1.299 12.792 1.299 13.284 2.298L15.897 7.593L21.741 8.442C22.0058 8.47789 22.255 8.58832 22.4595 8.76041C22.664 8.93251 22.8154 9.15918 22.896 9.414C22.9812 9.66797 22.9924 9.94098 22.9281 10.2011C22.8638 10.4611 22.7268 10.6975 22.533 10.8825Z"
        fill="#FFE23F"
      />
    </svg>
  );
}

const BTN_GRADIENT =
  "linear-gradient(167.63deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)";

function CtaButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#contact"
      className={`relative z-30 flex h-[59px] cursor-pointer items-center justify-center gap-[3px] rounded-[57px] px-[34px] py-4 text-white transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] active:scale-[0.98] motion-reduce:transition-none ${className}`}
      style={{
        backgroundImage: BTN_GRADIENT,
        /* Figma: 0 4px 16.3px rgba(0,0,0,0.12) with spread 11 */
        boxShadow: "0 4px 16.3px 11px rgba(0,0,0,0.12)",
      }}
    >
      <span className="font-[Satoshi] text-[20px] font-bold leading-[1.4] whitespace-nowrap">
        {children}
      </span>
      <ArrowUpRight />
    </a>
  );
}

const NAV_LINKS = [
  { label: "Brands", hasMenu: true },
  { label: "Products", hasMenu: true },
  { label: "Services", hasMenu: false },
  { label: "Company", hasMenu: true },
];

export default function HeroSection({
  isEntered = true,
  isNavVisible = true,
  paused = false,
}: {
  isEntered?: boolean;
  isNavVisible?: boolean;
  paused?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settled, setSettled] = useState(false);
  const copyRef = useRef<HTMLDivElement>(null);
  const [logoTop, setLogoTop] = useState<number>(455);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    let frame = 0;

    const updatePos = () => {
      frame = 0;
      const hero = copy.closest("#hero");
      if (!hero) return;
      const rect = copy.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const copyBottom = rect.bottom - heroRect.top;
      // Keep just a little gap with the Contact Us button (~26px). Re-measure
      // when the copy block reflows (font load / resize) so the 3D logo never
      // lands at a stale position.
      setLogoTop(Math.round(copyBottom + 26));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updatePos);
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(copy);
    const hero = copy.closest("#hero");
    if (hero) ro.observe(hero);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Kodevio hero"
      /* Full-bleed per Figma node 324:23968 — exact 1378px height on 1920px canvas.
         Requires scrolling through the full hero height, so the bottom dissolve
         is placed at the bottom of the 1378px hero and NOT visible on initial load. */
      className={`relative w-full overflow-hidden transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        settled ? "" : "will-change-transform motion-reduce:will-change-auto"
      } ${paused ? "hero-paused" : ""} ${
        isEntered
          ? "translate-y-0"
          : "translate-y-full"
      }`}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && (event.propertyName === "transform" || event.propertyName === "translate")) {
          setSettled(true);
        }
      }}
      style={{
        /* Sky sampled straight from the original hero clip's poster frame
           (public/hero/hero-figma-2752.png), so the screen keeps the exact
           colours it had while the video played. The meadow plate is a
           cut-out, so this gradient is what shows above its horizon. */
        background:
          "linear-gradient(180deg, #70b7d8 0%, #81b9d5 10.8%, #a4c2d5 26.9%, #c0ced7 37.7%, #bdbcd1 48.4%, #b8b7cb 53.8%, #cfe4f2 78%, #d9effd 100%)",
        height: "max(100vh, calc(100vw * 1378 / 1920))",
        minHeight: "850px",
      }}
    >
      {/*
        Clouds layer — moving cloud system (part 3 of 3: grass / logo / clouds)
        Crisp, crystal-clear, high-contrast cumulus clouds drifting across the sky
      */}
      <div className="hero-sky-clouds" aria-hidden="true">
        {/* Tier 1: Primary crisp drifting cloud bank */}
        <div className="cloud-track cloud-track-primary">
          <div className="cloud-slice">
            <Image
              src="/hero/clouds-crisp.webp"
              alt=""
              width={2752}
              height={850}
              priority
              className="cloud-img"
            />
          </div>
          <div className="cloud-slice">
            <Image
              src="/hero/clouds-crisp.webp"
              alt=""
              width={2752}
              height={850}
              priority
              className="cloud-img"
            />
          </div>
        </div>

        {/* Tier 2: Distant parallax clouds for cinematic atmospheric depth */}
        <div className="cloud-track cloud-track-secondary">
          <div className="cloud-slice">
            <Image
              src="/hero/clouds-crisp.webp"
              alt=""
              width={2752}
              height={850}
              className="cloud-img cloud-img-secondary"
            />
          </div>
          <div className="cloud-slice">
            <Image
              src="/hero/clouds-crisp.webp"
              alt=""
              width={2752}
              height={850}
              className="cloud-img cloud-img-secondary"
            />
          </div>
        </div>
      </div>

      {/*
        Grass layer & 3D Logo (parts 1 & 2 of 3: grass / logo / clouds)
        - Cut-out meadow plate
        - 3D Kodevio Logo planted in the middle of the grass
        - Animated SVG blades and daisies swaying in front of the logo
      */}
      <div className="hero-grass" aria-hidden="true">
        <Image
          src="/hero/meadow.png"
          alt=""
          width={2752}
          height={1536}
          priority
          sizes="108vw"
          className="meadow"
        />

        {/* 3D Kodevio Logo planted in the middle of the grass, just below Contact Us */}
        <div
          className="hero-k-logo-wrap"
          style={{ top: `${logoTop}px` }}
        >
          <div className="relative w-full">
            <Image
              src="/hero/k-shape-3d.webp"
              alt="Kodevio 3D Icon"
              width={758}
              height={1083}
              priority
              className="hero-k-logo-img"
            />
            {/* Ground contact shadow where the logo embeds into the earth */}
            <div className="hero-k-ground-shadow" aria-hidden="true" />
            {/* Foreground grass tuft & flowers rooting the base into the soil */}
            <svg
              className="hero-k-root-grass"
              viewBox="0 0 320 60"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Natural grass blades & daisy blossoms overlapping the bottom legs */}
              <g fill="#276332">
                <path d="M10 60 C12 40 18 20 22 5 C20 25 18 45 14 60 Z" />
                <path d="M35 60 C38 35 46 15 52 0 C48 22 44 42 40 60 Z" />
                <path d="M70 60 C68 38 60 18 55 2 C62 20 65 40 72 60 Z" />
                <path d="M110 60 C114 36 122 14 130 0 C125 22 120 42 116 60 Z" />
                <path d="M145 60 C143 38 135 18 130 5 C138 22 142 42 148 60 Z" />
                <path d="M185 60 C188 35 196 15 204 2 C198 22 194 42 190 60 Z" />
                <path d="M225 60 C223 38 215 18 208 4 C216 22 220 42 228 60 Z" />
                <path d="M260 60 C264 36 272 14 280 0 C275 22 270 42 266 60 Z" />
                <path d="M295 60 C293 38 285 20 280 8 C287 25 291 43 298 60 Z" />
              </g>
              <g fill="#4c8a35">
                <path d="M20 60 C24 38 32 18 38 6 C34 25 30 44 26 60 Z" />
                <path d="M55 60 C58 36 68 16 75 4 C70 24 66 44 62 60 Z" />
                <path d="M95 60 C92 38 84 20 78 8 C86 25 90 43 98 60 Z" />
                <path d="M130 60 C134 38 142 18 148 4 C144 24 140 44 136 60 Z" />
                <path d="M170 60 C168 38 160 20 154 8 C162 25 166 43 174 60 Z" />
                <path d="M205 60 C208 36 218 16 226 2 C220 22 216 42 212 60 Z" />
                <path d="M245 60 C243 38 235 20 228 8 C236 25 240 43 248 60 Z" />
                <path d="M280 60 C284 38 292 20 298 6 C294 25 290 44 286 60 Z" />
              </g>
              {/* Small white daisy blossoms at the root base */}
              <g transform="translate(68, 42) scale(0.7)">
                <circle cx="0" cy="0" r="12" fill="white" />
                <circle cx="0" cy="0" r="4.5" fill="#FFE23F" />
              </g>
              <g transform="translate(182, 38) scale(0.8)">
                <circle cx="0" cy="0" r="12" fill="white" />
                <circle cx="0" cy="0" r="4.5" fill="#FFE23F" />
              </g>
              <g transform="translate(252, 45) scale(0.65)">
                <circle cx="0" cy="0" r="12" fill="white" />
                <circle cx="0" cy="0" r="4.5" fill="#FFE23F" />
              </g>
            </svg>
          </div>
        </div>

        <LivingGrass />
      </div>

      {/* Top scrim — Figma 10:298: black 28% → transparent at 53.59% */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 53.59%)",
        }}
      />

      {/* ---------- Top nav bar (1159 × 75, radius 154) ---------- */}
      <header
        className={`fixed top-[27px] left-1/2 z-40 w-[min(1159px,calc(100%-32px))] -translate-x-1/2 transition-[transform,translate,scale,rotate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isNavVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        {/* ---------- Top nav bar (Figma: 1159×75, radius 154, glass white 31%) ---------- */}
        <nav
          aria-label="Primary"
          className="relative flex h-[75px] items-center justify-between overflow-visible rounded-[154px] bg-white/45 pr-2 pl-[38px] backdrop-blur-lg"
        >
          <a href="#" aria-label="Kodevio home" className="shrink-0">
            <Image
              src="/navbar/kodevio-logo.svg"
              alt="Kodevio"
              width={141}
              height={33}
              priority
              className="h-[33px] w-[141px] object-contain"
            />
          </a>

          {/* Desktop links — Satoshi Regular 20px #686868, gap 59px.
              Figma 324:23973: group spans x288.5–839.5, i.e. its center is
              15.5px left of the nav's center. */}
          <ul className="absolute top-1/2 left-[calc(50%-15.5px)] hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[59px] lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href="#"
                  className="flex items-center gap-[3px] font-[Satoshi] text-[20px] leading-[1.4] font-medium text-[#e9e9e9] transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                  {link.hasMenu && <ChevronDown />}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <CtaButton className="hidden !h-[59px] !px-[34px] sm:flex">
              Get Started
            </CtaButton>
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-[59px] items-center justify-center rounded-full text-[#686868] transition-colors duration-200 hover:bg-black/5 lg:hidden"
              style={{ backgroundImage: BTN_GRADIENT }}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <ul className="menu-drop absolute top-[83px] right-0 left-0 flex flex-col gap-1 rounded-[24px] bg-white p-3 shadow-xl lg:hidden">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href="#"
                    className="flex items-center justify-between rounded-2xl px-5 py-3 font-[Satoshi] text-[18px] text-[#686868] transition-colors duration-200 hover:bg-black/5"
                  >
                    {link.label}
                    {link.hasMenu && <ChevronDown />}
                  </a>
                </li>
              ))}
              <li className="pt-1 sm:hidden">
                <CtaButton className="w-full">Get Started</CtaButton>
              </li>
            </ul>
          )}
        </nav>
      </header>

      {/* ---------- Hero copy (top 138px, width 997, headline 851) ---------- */}
      <div
        ref={copyRef}
        className="absolute top-[138px] left-1/2 z-30 flex w-[min(997px,calc(100%-40px))] -translate-x-1/2 flex-col items-center gap-[25px] pointer-events-auto sm:top-[138px]"
      >
        <h1 className="hero-enter w-full max-w-[851px] text-center font-[Satoshi] text-[clamp(2rem,1.05rem+4.4vw,3.75rem)] leading-[1.39] font-medium text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.18)]">
          We Build Software That Moves Businesses Forward
        </h1>

        {/* Social proof */}
        <div className="hero-enter hero-delay-1 flex max-w-full flex-wrap items-center justify-center gap-x-[17px] gap-y-3 px-2">
          <div className="flex items-center" aria-label="Customer avatars">
            {[
              { src: "/hero/avatar-1.png", alt: "Customer" },
              { src: "/hero/avatar-2.png", alt: "Customer" },
              { src: "/hero/avatar-3.png", alt: "Customer" },
            ].map((a, i) => (
              <Image
                key={a.src}
                src={a.src}
                alt={a.alt}
                width={52}
                height={52}
                className={`size-[44px] rounded-full object-cover sm:size-[52px] ${i > 0 ? "-ml-3" : ""}`}
              />
            ))}
            <span
              className="-ml-3 flex size-[44px] items-center justify-center rounded-full font-[Inter,sans-serif] text-[16px] text-[#757575] sm:size-[52px] sm:text-[18px]"
              style={{ background: "#F1F1F1" }}
              aria-label="4 more customers"
            >
              +4
            </span>
          </div>
          <div className="flex w-auto flex-col items-center gap-[11px] sm:items-start">
            <div className="flex items-center gap-2" aria-label="5 out of 5 stars">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            <p className="text-center font-[Satoshi] text-[16px] leading-[1.4] font-medium whitespace-normal text-white sm:whitespace-nowrap">
              Trusted by 200+ Teams
            </p>
          </div>
        </div>

        <div className="hero-enter hero-delay-2">
          <CtaButton>Contact Us</CtaButton>
        </div>
      </div>

      {/* Bottom white dissolve — Figma 324:23998 (top: 1120px to 1378px, height: 258px) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[258px]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 40%, rgba(255, 255, 255, 0.85) 75%, #ffffff 100%)",
        }}
      />
    </section>
  );
}
