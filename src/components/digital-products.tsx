"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PROJECTS = [
  {
    id: 1,
    title: "Calorie Tracker | Mobile App",
    description:
      "Lifted is a mobile wellness app designed to help users stay consistent with their health goals.",
    image: "/digital-products/3f3d7.png",
    bg: "bg-gradient-to-b from-[#ffecd8] to-[#ff8200]",
    hasBaseBanner: true,
  },
  {
    id: 2,
    title: "Sales Analytics | SaaS Platform",
    description:
      "A high-velocity dashboard empowering venture-backed revenue teams to track pipeline velocity in real time.",
    image: "/digital-products/a4489.png",
    bg: "bg-[#f5f6f8]",
  },
  {
    id: 3,
    title: "Brand Identity & Merch",
    description:
      "Distinct packaging, design systems, and identity assets for an organic modern streetwear label.",
    image: "/digital-products/6126f.png",
    bg: "bg-[#eef2f6]",
  },
  {
    id: 4,
    title: "Fintech Mobile Wallet",
    description:
      "Next-generation contactless payment and asset tracking platform built for instant borderless transfers.",
    image: "/digital-products/0802a.png",
    bg: "bg-[#f8fafc]",
  },
  {
    id: 5,
    title: "Cloud Infrastructure Portal",
    description:
      "Self-service enterprise dashboard for orchestrating Kubernetes clusters and monitoring real-time telemetry.",
    image: "/digital-products/488ee.png",
    bg: "bg-[#f1f5f9]",
  },
  {
    id: 6,
    title: "Logistics & Fleet Dispatch",
    description:
      "On-demand multi-modal delivery routing platform connecting enterprise merchants with local courier fleets.",
    image: "/digital-products/adc93.png",
    bg: "bg-[#f4f4f5]",
  },
];

export default function DigitalProductsSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".figma-case-card", rootRef.current);
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [enabled]);

  return (
    <section
      ref={rootRef}
      id="products"
      aria-label="Digital Products"
      className="relative mx-auto w-full max-w-[1763px] bg-white px-6 sm:px-12 lg:px-0 lg:py-28"
    >
      {/* Header matching Figma node 565:577 */}
      <div className="mx-auto flex max-w-[930px] flex-col items-center text-center">
        {/* Folder Icon Badge */}
        <div className="flex size-[50px] items-center justify-center rounded-[8px] border-2 border-[#9a96ff] p-2">
          <Image
            src="/digital-products/a48e9.svg"
            alt="Folder Icon"
            width={30}
            height={30}
            className="size-[30px]"
          />
        </div>

        <h2
          data-reveal
          className="mt-8 font-['Poppins',sans-serif] text-[36px] sm:text-[48px] lg:text-[60px] font-medium leading-[1.3] text-[#2d2f33]"
        >
          Digital Products Engineered for Real Business Impact
        </h2>

        <p
          data-reveal
          className="mt-6 max-w-[908px] font-['Satoshi'] text-[20px] sm:text-[24px] lg:text-[28px] font-normal leading-[1.4] text-black"
        >
          Explore how we’ve helped ambitious brands design, build, and scale high converting web platforms, mobile apps, and AI-powered solutions.
        </p>

        <div className="mt-8">
          <a
            href="#all-work"
            className="inline-flex h-[59px] items-center justify-center gap-2 rounded-[57px] px-9 py-4 font-['Satoshi'] text-[20px] font-bold text-white shadow-[0px_4px_16px_rgba(104,97,238,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
            style={{
              backgroundImage:
                "linear-gradient(168.14deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
            }}
          >
            <span>See all work</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* 6 Project Cards Grid (3 columns x 2 rows, exact Figma card geometry) */}
      <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[13px]">
        {PROJECTS.map((proj) => (
          <article
            key={proj.id}
            className="figma-case-card group relative block w-full aspect-[579/564] select-none text-left transition-[translate] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 focus:outline-none"
          >
            {/* SVG Background: Exact Figma Subtract Path with bottom-right circular cutout */}
            <svg
              viewBox="0 0 586.6 571.6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.07)] transition-[filter] duration-200 group-hover:drop-shadow-[0_12px_28px_rgba(104,97,238,0.18)]"
            >
              <path
                d="M562.8 2.8C573.846 2.8 582.8 11.7543 582.8 22.8V430.131C582.8 445.126 560.123 455.106 545.429 452.116C541.187 451.253 536.797 450.8 532.3 450.8C496.125 450.8 466.8 480.125 466.8 516.3C466.8 520.797 467.253 525.187 468.116 529.429C471.106 544.123 461.126 566.8 446.131 566.8H23.8C12.7543 566.8 3.8 557.846 3.8 546.8V22.8C3.8 11.7543 12.7543 2.8 23.8 2.8H562.8Z"
                fill="white"
              />
            </svg>

            {/* Mockup Container: Figma left 15.5px (2.68%), top 15px (2.66%), w 548px (94.65%), h 283px (50.18%) */}
            <div
              className={`absolute left-[2.68%] top-[2.66%] w-[94.65%] h-[50.18%] rounded-[10px] overflow-hidden ${proj.bg} flex items-center justify-center shadow-inner`}
            >
              {proj.hasBaseBanner && (
                <div className="absolute bottom-0 inset-x-0 h-[22.6%] pointer-events-none">
                  <Image
                    src="/digital-products/cc271.png"
                    alt="Banner base"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative w-full h-full p-[3%]">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-md transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
            </div>

            {/* Title & Description: Figma left 16px (2.76%), top 320px (56.74%), w 514px (88.77%) */}
            <div className="absolute left-[2.76%] top-[56.74%] w-[88.77%] flex flex-col gap-[8px] sm:gap-[12px]">
              <h3 className="font-['Satoshi'] text-[17px] sm:text-[20px] lg:text-[24px] font-medium text-black leading-[1.3] truncate">
                {proj.title}
              </h3>
              <p className="font-['Satoshi'] text-[13px] sm:text-[15px] lg:text-[18px] font-normal text-[#2d2f33] leading-[1.4] line-clamp-2">
                {proj.description}
              </p>
            </div>

            {/* Dashed line: Figma left 16px (2.76%), top 459px (81.38%), w 450px (77.72%) */}
            <div className="absolute left-[2.76%] top-[81.38%] w-[77.72%] border-b border-dashed border-[#b9b9b9]" />

            {/* "View Case Study": Figma left 16px (2.76%), top 493px (87.41%) */}
            <a
              href="#case-study"
              className="absolute left-[2.76%] top-[87.41%] font-['Satoshi'] text-[15px] sm:text-[17px] lg:text-[19px] font-medium text-[#686868] transition-colors duration-200 hover:text-[#6861ee] group-hover:text-[#6861ee]"
            >
              View Case Study
            </a>

            {/* Floating Circle Arrow Link Button: Figma 100px circle at right 0, bottom 0
                Concentric with the 65.5px radius cutout notch, leaving a 15.5px clear gap! */}
            <a
              href="#case-study"
              aria-label={`View ${proj.title} case study`}
              className="absolute right-0 bottom-0 w-[17.27%] h-[17.73%] min-w-[68px] min-h-[68px] flex items-center justify-center rounded-full bg-[#2D2F33] text-white shadow-lg transition-[scale,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#6861ee] group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(104,97,238,0.4)] cursor-pointer"
            >
              <svg
                viewBox="0 0 36 36"
                fill="none"
                className="size-[42%] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path
                  d="M6 18H30M21 9L30 18L21 27"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="rotate(-45 18 18)"
                />
              </svg>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
