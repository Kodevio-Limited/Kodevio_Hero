"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WhyBrandsTrustSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".trust-card", rootRef.current);
      gsap.fromTo(
        cards,
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
      id="why-trust"
      aria-label="Why Brands Trust Us"
      className="relative mx-auto w-full max-w-[1765px] bg-white px-6 py-20 sm:px-12 lg:py-28"
    >
      <div className="flex flex-col gap-6 lg:gap-[23px]">
        {/* Top Row: Heading Block on Left + 2 Cards on Right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-[23px] items-stretch">
          {/* Header Block (Spans ~4.5 cols on desktop, 657px in Figma) */}
          <div className="flex flex-col justify-between rounded-[24px] lg:col-span-5 pr-0 lg:pr-6 py-2">
            <div>
              {/* Badge */}
              <div className="flex size-[50px] items-center justify-center rounded-[8px] border-2 border-[#9a96ff] p-2">
                <Image
                  src="/why-trust/1568e.svg"
                  alt="Shield"
                  width={30}
                  height={30}
                  className="size-[30px]"
                />
              </div>

              {/* Title */}
              <h2
                data-reveal
                className="mt-8 font-['Poppins',sans-serif] text-[34px] sm:text-[46px] lg:text-[56px] xl:text-[60px] font-medium leading-[1.25] text-[#2d2f33]"
              >
                Why 200+ Global Brands Trust Us With Their Vision
              </h2>
            </div>

            {/* Subcopy */}
            <p
              data-reveal
              className="mt-6 lg:mt-8 max-w-[622px] font-['Satoshi'] text-[18px] sm:text-[22px] lg:text-[26px] font-normal leading-[1.4] text-black"
            >
              From rapid agile delivery to rock-solid architecture, here is what sets our design and engineering team apart from traditional agencies.
            </p>
          </div>

          {/* Top Right: 2 Equal Cards (Spans ~7 cols on desktop, each 525px in Figma) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-[23px] lg:col-span-7">
            {/* Card 1: Conversion-Driven UI/UX */}
            <div
              className="trust-card group relative flex min-h-[420px] lg:min-h-[484px] flex-col justify-between overflow-hidden rounded-[20px] p-8 lg:p-10 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_36px_rgba(233,107,15,0.22)] hover:-translate-y-1"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgb(251, 175, 120) 0%, rgb(242, 141, 67) 50%, rgb(238, 124, 41) 75%, rgb(233, 107, 15) 100%)",
              }}
            >
              <h3 className="font-['Satoshi'] text-[30px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.2] text-white">
                Conversion-Driven UI/UX
              </h3>
              <p className="mt-8 font-['Satoshi'] text-[18px] sm:text-[22px] lg:text-[26px] font-normal leading-[1.4] text-white">
                We craft custom, intuitive interfaces tailored to your brand identity that guide visitors smoothly toward action.
              </p>
            </div>

            {/* Card 2: Rapid Agile Delivery */}
            <div className="trust-card group relative flex min-h-[420px] lg:min-h-[484px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#ebf86f] p-8 lg:p-10 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_36px_rgba(235,248,111,0.35)] hover:-translate-y-1">
              <h3 className="font-['Satoshi'] text-[30px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.2] text-black">
                Rapid Agile Delivery
              </h3>
              <p className="mt-8 font-['Satoshi'] text-[18px] sm:text-[22px] lg:text-[26px] font-normal leading-[1.4] text-[#1e1e1e]">
                Through iterative sprints, real-time progress tracking, and clear communication, we take your product from concept to launch.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Wide Card (1216px) + Dark Card (525px) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-[23px] items-stretch mt-0 lg:mt-2">
          {/* Card 3: Future-Proof Code That Scales (Spans 8 cols on desktop) */}
          <div className="trust-card group relative flex min-h-[440px] lg:min-h-[484px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#7d91f5] p-8 lg:p-11 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] lg:col-span-8 transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_36px_rgba(125,145,245,0.3)] hover:-translate-y-1">
            <div className="relative z-10 max-w-[420px] lg:max-w-[460px]">
              <h3 className="font-['Satoshi'] text-[30px] sm:text-[36px] lg:text-[40px] font-medium leading-[1.2] text-white">
                Future-Proof Code That Scales
              </h3>
            </div>

            <div className="relative z-10 max-w-[420px] lg:max-w-[460px] mt-8">
              <p className="font-['Satoshi'] text-[18px] sm:text-[22px] lg:text-[24px] font-normal leading-[1.4] text-white">
                Built with React, Next.js, and modular components, our software architecture grows effortlessly alongside your user base without technical debt.
              </p>
            </div>

            {/* Illustration Graphic at right */}
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-1/2 sm:block md:w-[55%] lg:w-[60%]">
              <Image
                src="/why-trust/6613c.png"
                alt="Code Architecture Mockup"
                fill
                sizes="(max-width: 1024px) 50vw, 724px"
                className="object-contain object-right-bottom transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 4: Ultra-Fast Speed (Spans 4 cols on desktop) */}
          <div className="trust-card group relative flex min-h-[420px] lg:min-h-[484px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#0d1f1f] p-8 lg:p-10 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] lg:col-span-4 transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_36px_rgba(13,31,31,0.5)] hover:-translate-y-1">
            {/* Background Wave Graphic */}
            <div className="pointer-events-none absolute inset-0 opacity-80 mix-blend-screen transition-opacity duration-200 group-hover:opacity-100">
              <Image
                src="/why-trust/40191.svg"
                alt="Wave"
                fill
                className="object-cover object-center"
              />
            </div>

            <h3 className="relative z-10 font-['Satoshi'] text-[30px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.2] text-white">
              Ultra-Fast Speed
            </h3>

            <p className="relative z-10 mt-8 font-['Satoshi'] text-[18px] sm:text-[22px] lg:text-[26px] font-normal leading-[1.4] text-[#f2f2f2]">
              We optimize every line of code so your platform loads in under a second maximizing user retention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
