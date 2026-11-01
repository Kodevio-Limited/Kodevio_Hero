"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/*
 * Figma node 324:24339 "See pricing" — 2052 × 1091, white background:
 *   • top photo row     y 0    → 262  (cards 170×160, x step 203, wave)
 *   • centre copy       (510, 357) 1055 wide: heading 60/1.4 (2 lines),
 *                       subtitle y 204 (28/1.4, 937 wide), button y 318 (295×59)
 *   • bottom photo row  y 829  → 1091 (same geometry, mirrored wave)
 *
 * Motion: no pin, no scroll link. Each photo travels along the Figma wave
 * y = A + A·sin(2πx / λ + phase) while its x advances, so every card rises
 * over a crest and dips into a trough as it crosses the row. Rows move in
 * opposite directions, wrap seamlessly, slow to 30% on hover, and pause when
 * off screen or when the tab is hidden.
 */
const WAVE_CARD_SPAN = 5; // one full wavelength spans five cards (matches Figma)

/* Figma wave: 102px crest-to-trough, one period every five 203px steps. */
function geometry(compact: boolean) {
  const w = compact ? 120 : 170;
  const h = compact ? 113 : 160;
  const gap = compact ? 22 : 33;
  const step = w + gap;
  const wavelength = step * WAVE_CARD_SPAN;
  const amplitude = compact ? 36 : 51;
  const setWidth = step * ROW.length;
  return { w, h, gap, step, wavelength, amplitude, setWidth };
}

type Geometry = ReturnType<typeof geometry>;

/* y is measured downward, 0 = highest point of the wave. */
function waveY(x: number, g: Geometry, phase: number) {
  return g.amplitude + g.amplitude * Math.sin((2 * Math.PI * x) / g.wavelength + phase);
}

/* Tangent of the curve, damped to a few degrees so cards read as tilted
 * rather than flipped. */
function waveAngle(x: number, g: Geometry, phase: number) {
  const slope =
    g.amplitude * ((2 * Math.PI) / g.wavelength) * Math.cos((2 * Math.PI * x) / g.wavelength + phase);
  const deg = (Math.atan(slope) * 180) / Math.PI;
  return Math.max(-4, Math.min(4, deg * 0.28));
}

/* Phase is anchored to the crest card of the original Figma artwork so the
 * first painted frame matches the static layout. */
function wavePhase(direction: "top" | "bottom", g: Geometry) {
  const anchor = direction === "top" ? 2 : 5;
  return Math.PI / 2 - (2 * Math.PI * (anchor * g.step)) / g.wavelength;
}

function mod(value: number, m: number) {
  return ((value % m) + m) % m;
}

const ROW = [
  { src: "/pricing/iphone16-hand.png", alt: "iPhone 16 Mockup in Hand" },
  { src: "/pricing/keyboard-tablet.png", alt: "Tablet with Keyboard Mockup" },
  { src: "/pricing/iphone13-kit.png", alt: "iPhone 13 App Screen" },
  { src: "/pricing/fca0b16c65191b5b817637fc81ca78475bdcffe2.png", alt: "Purple Mobile Mockup" },
  { src: "/pricing/28c62c9970af4400edf9e0926f3050fc3e9c41f4.png", alt: "Dark Hand Phone Mockup" },
  { src: "/pricing/c7fb6603c95cba7362e60c2b519807465a614c79.png", alt: "Laptop on Couch Mockup" },
  { src: "/pricing/fa5f552aca29692de15305d3273d75b95b59919b.png", alt: "Clean App Screen" },
  { src: "/pricing/billboard-mockup.png", alt: "Outdoor Billboard Mockup" },
  { src: "/pricing/68b6eab3e496359b7f81e247d1c9db46b565414e.jpg", alt: "Wireframe Sketches on Desk" },
  { src: "/pricing/c4fbf36d4385ab83d355f183807b2506e1d24115.png", alt: "App UI Showcase" },
];

const BUTTON_GRADIENT =
  "linear-gradient(171.81deg, rgb(154,150,255) 8.4213%, rgb(104,97,238) 47.735%, rgb(88,81,234) 87.048%)";

function Row({ direction, compact }: { direction: "top" | "bottom"; compact: boolean }) {
  // Duplicated once so the strip is two full sets wide — every card wraps
  // around the row width without leaving a gap.
  const items = [...ROW, ...ROW];
  const g = geometry(compact);
  const phase = wavePhase(direction, g);

  return (
    <div
      className={`pricing-row relative w-full overflow-hidden ${compact ? "h-[190px]" : "h-[262px]"} ${
        direction === "top" && !compact ? "pl-[55px]" : ""
      }`}
      data-direction={direction}
    >
      {items.map((item, idx) => {
        const baseX = idx * g.step;
        const y = waveY(baseX, g, phase).toFixed(2);
        const angle = waveAngle(baseX, g, phase).toFixed(2);

        return (
          <div
            key={`${direction}-${idx}`}
            data-x={baseX}
            className="pricing-photo absolute left-0 top-0 overflow-hidden rounded-[20px] bg-[#f8f9fa]"
            style={{
              width: `${g.w}px`,
              height: `${g.h}px`,
              transform: `translate3d(${baseX}px, ${y}px, 0) rotate(${angle}deg)`,
            }}
          >
            <Image src={item.src} alt={item.alt} fill sizes={`${g.w}px`} className="object-cover" />
          </div>
        );
      })}
    </div>
  );
}

export default function PricingSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Fit the fixed Figma canvas into one screen (zoom keeps text crisp). */
  useEffect(() => {
    if (compact) {
      blockRef.current?.style.removeProperty("zoom");
      return;
    }
    const el = blockRef.current;
    if (!el) return;
    const apply = () => {
      const scale = Math.min(1, (window.innerWidth - 16) / 2052, (window.innerHeight - 24) / 1091);
      el.style.setProperty("zoom", String(Math.max(0.55, scale)));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [compact]);

  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const g = geometry(compact);
      const total = g.setWidth * 2; // two duplicated sets = the seamless track
      const loopSpeed = g.setWidth / 20; // one full set in ~20s, constant

      const rows = gsap.utils.toArray<HTMLElement>(".pricing-row", root);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || rows.length === 0) return;

      type MovingItem = { el: HTMLElement; baseX: number; dy: number };
      type RowRuntime = {
        items: MovingItem[];
        dir: 1 | -1;
        phase: number;
        speed: { value: number };
        offset: number;
      };

      const runtime: RowRuntime[] = rows.map((rowEl) => {
        const dir: 1 | -1 = rowEl.dataset.direction === "bottom" ? 1 : -1;
        const phase = wavePhase(dir === 1 ? "bottom" : "top", g);
        const items: MovingItem[] = gsap.utils
          .toArray<HTMLElement>(".pricing-photo", rowEl)
          .map((el) => ({ el, baseX: Number(el.dataset.x ?? "0"), dy: 0 }));

        // Entry offset: photos fade in while rising into the wave.
        items.forEach((item) => {
          item.dy = 32;
          gsap.set(item.el, { opacity: 0 });
        });

        return { items, dir, phase, speed: { value: 1 }, offset: 0 };
      });

      const place = (row: RowRuntime, item: MovingItem) => {
        // Wrap around the duplicated row width, with both wrap boundaries
        // exactly one card outside the visible strip so the jump is never seen.
        // The wave is periodic over the row width, so y and tilt stay continuous.
        const x = mod(item.baseX + row.offset * row.dir + g.w, total) - g.w;
        const y = waveY(x, g, row.phase) + item.dy;
        const angle = waveAngle(x, g, row.phase);
        item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
      };

      runtime.forEach((row) => row.items.forEach((item) => place(row, item)));

      /* ---- Entry: fade + slide, 0.8s power3.out, 0.06s stagger ---- */
      let entered = false;
      const playEntry = () => {
        if (entered) return;
        entered = true;
        runtime.forEach((row) => {
          row.items.forEach((item, i) => {
            gsap.to(item, { dy: 0, duration: 0.8, ease: "power3.out", delay: i * 0.06 });
            gsap.to(item.el, { opacity: 1, duration: 0.8, ease: "power3.out", delay: i * 0.06 });
          });
        });
      };

      /* ---- Per-frame travel: one ticker callback, transforms only ---- */
      let visible = false;
      let hidden = document.hidden;

      const tick = (_time: number, deltaTime: number) => {
        if (!visible || hidden) return;
        const dt = Math.min(deltaTime, 50) / 1000;
        runtime.forEach((row) => {
          row.offset = mod(row.offset + loopSpeed * row.speed.value * dt, total);
          row.items.forEach((item) => place(row, item));
        });
      };
      gsap.ticker.add(tick);

      /* Start / stop with viewport visibility (and play the entry once). */
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? false;
          root.classList.toggle("pricing-active", visible);
          if (visible) playEntry();
        },
        { rootMargin: "120px 0px" },
      );
      io.observe(root);

      const onVisibility = () => {
        hidden = document.hidden;
      };
      document.addEventListener("visibilitychange", onVisibility);

      /* ---- Hover: ease down to 30% speed instead of stopping ---- */
      const offs: Array<() => void> = [];
      rows.forEach((rowEl, i) => {
        const row = runtime[i];
        if (!row) return;
        const enter = () =>
          gsap.to(row.speed, { value: 0.3, duration: 0.22, ease: "power2.out", overwrite: true });
        const leave = () =>
          gsap.to(row.speed, { value: 1, duration: 0.22, ease: "power2.out", overwrite: true });
        rowEl.addEventListener("pointerenter", enter);
        rowEl.addEventListener("pointerleave", leave);
        offs.push(() => {
          rowEl.removeEventListener("pointerenter", enter);
          rowEl.removeEventListener("pointerleave", leave);
        });
      });

      return () => {
        gsap.ticker.remove(tick);
        root.classList.remove("pricing-active");
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        offs.forEach((off) => off());
      };
    }, rootRef);

    return () => ctx.revert();
  }, [enabled, compact]);

  const copyBlock = (
    <div
      className={
        compact
          ? "flex w-full flex-col items-center px-5 text-center"
          : "absolute left-[510px] top-[357px] flex w-[1055px] flex-col items-center text-center"
      }
    >
      <h2
        data-reveal
        className={`font-['Poppins',sans-serif] font-medium leading-[1.4] text-[#2d2f33] ${
          compact ? "text-[30px]" : "text-[60px]"
        }`}
      >
        Get A Full SaaS Design Team For Less Than Hiring In-House
      </h2>
      <p
        data-reveal
        className={`font-['Satoshi'] font-normal leading-[1.4] text-[#2d2f33] ${
          compact ? "mt-6 max-w-[560px] text-[17px]" : "mt-[36px] w-[937px] text-[28px]"
        }`}
      >
        SaaS teams lose time managing designers, developers, and communication. We join your team
        to design, build, and launch faster.
      </p>
      <a
        href="#pricing-plans"
        className={`inline-flex items-center justify-center gap-2 rounded-[57px] font-['Satoshi'] text-[20px] font-bold text-white ${
          compact ? "mt-7 h-[49px] px-6 text-[16px]" : "mt-[36px] h-[59px] w-[295px]"
        }`}
        style={{ backgroundImage: BUTTON_GRADIENT, boxShadow: "0 4px 16.3px rgba(0,0,0,0.12)" }}
      >
        See pricing &amp; availability
      </a>
    </div>
  );

  return (
    <section
      ref={rootRef}
      id="pricing"
      aria-label="See Pricing"
      className="relative w-full overflow-hidden bg-white"
    >
      <div className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-white">
        {compact ? (
          <div key="compact" className="flex w-full flex-col gap-8 py-10">
            <Row direction="top" compact />
            {copyBlock}
            <Row direction="bottom" compact />
          </div>
        ) : (
          <div key="desktop" ref={blockRef} className="relative h-[1091px] w-[2052px] shrink-0">
            <div className="absolute inset-x-0 top-0">
              <Row direction="top" compact={false} />
            </div>
            {copyBlock}
            <div className="absolute inset-x-0 top-[829px]">
              <Row direction="bottom" compact={false} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
