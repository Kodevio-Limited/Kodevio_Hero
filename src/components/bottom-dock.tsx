"use client";

import Image from "next/image";
import { useEffect, useState, type TransitionEvent } from "react";

const NAV_ITEMS = [
  { label: "Brands", href: "#brands", hasSubmenu: true },
  { label: "Products", href: "#products", hasSubmenu: true },
  { label: "Services", href: "#services", hasSubmenu: false },
  { label: "Company", href: "#ceo", hasSubmenu: true },
];

export default function BottomDock({
  visible = true,
  inverted = false,
}: {
  visible?: boolean;
  /** Light pill for dark sections — keeps the dock readable on black cards. */
  inverted?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  const openMenu = () => {
    setClosing(false);
    setMenuEntered(false);
    setMenuOpen(true);
    // Mount in the hidden state first, then flip one frame later so the
    // entrance actually transitions instead of snapping into place.
    requestAnimationFrame(() => setMenuEntered(true));
  };

  const closeMenu = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuOpen(false);
      setClosing(false);
      setMenuEntered(false);
      return;
    }
    setClosing(true);
  };

  const handleMenuTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !closing) return;
    setMenuOpen(false);
    setClosing(false);
    setMenuEntered(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <aside
      aria-label="Floating navigation dock"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-[transform,translate,scale,rotate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-28 opacity-0 pointer-events-none"
      }`}
    >
      {/* Expanded Popup Menu (Figma node 369:1461, 512px x 660px, radius 55px) */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onTransitionEnd={handleMenuTransitionEnd}
          className={`absolute bottom-full mb-4 left-1/2 w-[min(512px,calc(100vw-32px))] -translate-x-1/2 rounded-[55px] bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-[#eeeeee] transition-[transform,translate,scale,rotate,opacity] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            menuEntered && !closing
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-[0.98]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
            <span className="font-['Satoshi'] text-[20px] font-medium text-[#989898]">
              Menu
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="flex size-10 items-center justify-center rounded-full bg-[#f4f4f4] text-[#666] hover:bg-[#e8e8e8] transition-colors duration-200 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between font-['Satoshi'] text-[28px] sm:text-[31px] font-medium text-black transition-colors duration-200 hover:text-[#6861ee]"
              >
                <span>{item.label}</span>
                {item.hasSubmenu && (
                  <svg viewBox="0 0 24 24" fill="none" className="size-6 -rotate-90 text-black">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          {/* Get Started Button */}
          <div className="mt-12">
            <a
              href="#contact"
              onClick={closeMenu}
              className="flex h-[59px] w-full items-center justify-center gap-2 rounded-[57px] font-['Satoshi'] text-[20px] font-bold text-white shadow-[0px_4px_16px_rgba(104,97,238,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "linear-gradient(167.63deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
              }}
            >
              <span>Get Started</span>
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Floating Pill Dock (Figma node 369:1446, 464px x 75px, radius 154px, bg #0d0d0d) */}
      <div
        className={`flex h-[75px] w-[min(464px,calc(100vw-32px))] items-center justify-between rounded-[154px] px-6 backdrop-blur-md transition-colors duration-300 ${
          inverted
            ? "bg-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06]"
            : "bg-[#0d0d0d] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        }`}
      >
        {/* Left: official Kodevio logo mark */}
        <a href="#" aria-label="Kodevio home" className="flex items-center shrink-0">
          <Image
            src="/hero/kodevio-logo-icon.svg"
            alt="Kodevio Logo"
            width={34}
            height={42}
            className="h-[34px] w-auto object-contain"
          />
        </a>

        {/* Center: Home Button Capsule */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`flex items-center gap-2.5 rounded-[43px] px-5 py-2.5 transition-[transform,translate,scale,rotate,background-color,color] duration-200 active:scale-95 cursor-pointer ${
            inverted
              ? "bg-[#f2f2f2] text-black hover:bg-[#e8e8e8]"
              : "bg-[#1e1e1e] text-white hover:bg-[#282828]"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="font-['Satoshi'] text-[19px] font-medium leading-[1.4]">
            Home
          </span>
        </button>

        {/* Right: Divider & Menu/Close Button */}
        <div className="flex items-center gap-4">
          <div className={`h-7 w-[1px] transition-colors duration-200 ${inverted ? "bg-black/12" : "bg-white/20"}`} />
          <button
            type="button"
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            className={`flex items-center gap-2.5 transition-[transform,translate,scale,rotate,color] duration-200 active:scale-95 cursor-pointer ${
              inverted ? "text-black hover:text-black/70" : "text-white hover:text-white/80"
            }`}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
              </svg>
            )}
            <span className="font-['Satoshi'] text-[19px] font-medium leading-[1.4]">
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
