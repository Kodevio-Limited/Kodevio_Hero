"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/*
 * Figma node 502:2113 "Client review" — 1918 × 1088, white:
 *   • header at (78, 0): 50×50 icon (border #9a96ff), 39px gap, heading
 *     Poppins Medium 60/1.4, 676 wide (2 lines)
 *   • card rail at y 299, h 657: cards 454×657, 26px gaps, first card at x -229
 *   • arrows at (1650, 1004): two 84×84 circles
 *   Card: r18, image cover, bottom gradient (323 tall, blur 13.75), logo lockup
 *   187×55, name Satoshi Bold 28 #fff, role Satoshi Medium 21 #f2f2f2, and a
 *   117px play button at (168, 212).
 *
 * Motion: pinned; the rail glides left as the user scrolls until the last card
 * is centred, then the pin releases. Hover plays that card's video with sound,
 * leaving pauses + resets it. Only one video plays at a time. Tap toggles on
 * touch (and is the gesture that unlocks audio if hover playback was blocked).
 */
const REVIEWS = [
  { id: 1, name: "Daniel Brooks", role: "CEO @ Northwind", image: "/client-reviews/posters/poster-0.jpg", video: "/client-reviews/video/review-audio-0.mp4", webm: "/client-reviews/video/review-audio-0.webm" },
  { id: 2, name: "Liam Carter", role: "CTO @ Founderly", image: "/client-reviews/posters/poster-1.jpg", video: "/client-reviews/video/review-audio-1.mp4", webm: "/client-reviews/video/review-audio-1.webm" },
  { id: 3, name: "Noah Williams", role: "Founder @ Atlas", image: "/client-reviews/posters/poster-2.jpg", video: "/client-reviews/video/review-audio-2.mp4", webm: "/client-reviews/video/review-audio-2.webm" },
  { id: 4, name: "Sofia Ramirez", role: "Head of Design @ Bloom", image: "/client-reviews/posters/poster-3.jpg", video: "/client-reviews/video/review-audio-3.mp4", webm: "/client-reviews/video/review-audio-3.webm" },
  { id: 5, name: "Maya Chen", role: "Product Lead @ Northstar", image: "/client-reviews/posters/poster-4.jpg", video: "/client-reviews/video/review-audio-4.mp4", webm: "/client-reviews/video/review-audio-4.webm" },
  { id: 6, name: "Ethan Park", role: "COO @ Vector", image: "/client-reviews/posters/poster-5.jpg", video: "/client-reviews/video/review-audio-5.mp4", webm: "/client-reviews/video/review-audio-5.webm" },
  { id: 7, name: "Marcus Lee", role: "VP Product @ Lumen", image: "/client-reviews/posters/poster-6.jpg", video: "/client-reviews/video/review-audio-6.mp4", webm: "/client-reviews/video/review-audio-6.webm" },
  { id: 8, name: "Ava Thompson", role: "Marketing Director @ Nova", image: "/client-reviews/posters/poster-7.jpg", video: "/client-reviews/video/review-audio-7.mp4", webm: "/client-reviews/video/review-audio-7.webm" },
];

const CARD_W = 454;
const CARD_H = 657;
const GAP = 26;
const RAIL_START = -229;
const RAIL_MOVE = 1667; // brings the 8th card flush to the right edge (fully revealed)
const COMPACT_RAIL_MOVE = 1742;

export default function ClientReviewSection({ enabled = true }: { enabled?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const playingRef = useRef<HTMLVideoElement | null>(null);
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
      const scale = Math.min(1, (window.innerWidth - 24) / 1918, (window.innerHeight - 40) / 1088);
      el.style.setProperty("zoom", String(Math.max(0.55, scale)));
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
          const rail = railRef.current!;
          if (media.conditions?.isReduced) {
            gsap.set(rail, { x: compact ? -COMPACT_RAIL_MOVE : RAIL_START });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: compact ? "+=190%" : "+=225%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            rail,
            { x: compact ? 0 : RAIL_START },
            { x: compact ? -COMPACT_RAIL_MOVE : RAIL_START - RAIL_MOVE, ease: "power1.inOut" },
            0,
          );

          return () => {
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

  const coarsePointer = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const reset = (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.muted = false;
  };

  const play = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (playingRef.current && playingRef.current !== video) reset(playingRef.current);
    playingRef.current = video;
    if (video.ended) video.currentTime = 0;

    // Hover playback with sound. If the browser blocks audible autoplay on the
    // first hover (before any page interaction), fall back to muted playback so
    // the visual still runs; the next user gesture unlocks the audio.
    video.muted = false;
    video.volume = 1;
    void video.play().catch(() => {
      video.muted = true;
      void video.play().catch(() => {
        if (playingRef.current === video) playingRef.current = null;
      });
    });
  };

  const handleEnter = (index: number) => {
    if (coarsePointer()) return;
    play(index);
  };
  const handleLeave = (index: number) => {
    if (coarsePointer()) return;
    const video = videoRefs.current[index];
    reset(video);
    if (playingRef.current === video) playingRef.current = null;
  };
  const handleTap = (index: number) => {
    // Also works with a mouse: if the browser blocked audible hover playback,
    // this click is the gesture that unlocks sound.
    const video = videoRefs.current[index];
    if (!video) return;
    if (!video.paused) {
      reset(video);
      if (playingRef.current === video) playingRef.current = null;
    } else {
      play(index);
    }
  };
  const handleEnded = (index: number) => {
    const video = videoRefs.current[index];
    if (playingRef.current === video) playingRef.current = null;
    if (video) video.currentTime = 0;
  };

  return (
    <section
      ref={rootRef}
      id="reviews"
      aria-label="Client Reviews"
      className="relative w-full overflow-hidden bg-white"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-white"
      >
        {compact ? (
          // Distinct keys stop React from reusing the desktop node, whose
          // imperative inline `zoom` would otherwise shrink the compact stack.
          <div key="compact" className="flex w-full flex-col gap-6 py-10">
            <div className="px-5">
              <div className="flex size-[40px] items-center justify-center rounded-[8px] border-2 border-[#9a96ff]">
                <svg viewBox="0 0 24 24" fill="none" className="size-5 text-[#9a96ff]" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 data-reveal className="mt-4 font-['Poppins',sans-serif] text-[27px] font-medium leading-[1.3] text-[#2d2f33]">
                Hear what our customers are saying
              </h2>
            </div>

            <div className="w-full overflow-hidden">
              <div ref={railRef} className="flex w-max gap-4 px-5">
                {REVIEWS.map((review, i) => (
                  <div key={review.id} className="w-[250px] shrink-0">
                    <ReviewCard
                      review={review}
                      compact
                      videoRef={(el) => { videoRefs.current[i] = el; }}
                      onEnter={() => handleEnter(i)}
                      onLeave={() => handleLeave(i)}
                      onTap={() => handleTap(i)}
                      onEnded={() => handleEnded(i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={blockRef} className="relative h-[1088px] w-[1918px] shrink-0">
            {/* Header */}
            <div className="absolute left-[78px] top-0 w-[676px]">
              <div className="flex size-[50px] items-center justify-center rounded-[8px] border-2 border-[#9a96ff]">
                <svg viewBox="0 0 24 24" fill="none" className="size-[30px] text-[#9a96ff]" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 data-reveal className="mt-[39px] w-[676px] font-['Poppins',sans-serif] text-[60px] font-medium leading-[1.4] text-[#2d2f33]">
                Hear what our customers are saying
              </h2>
            </div>

            {/* Card rail */}
            <div className="absolute left-0 top-[299px] h-[657px] w-full overflow-hidden">
              <div ref={railRef} className="flex w-max" style={{ gap: GAP }}>
                {REVIEWS.map((review, i) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    compact={false}
                    videoRef={(el) => { videoRefs.current[i] = el; }}
                    onEnter={() => handleEnter(i)}
                    onLeave={() => handleLeave(i)}
                    onTap={() => handleTap(i)}
                    onEnded={() => handleEnded(i)}
                  />
                ))}
              </div>
            </div>

            {/* Arrows */}
            <div className="absolute left-[1650px] top-[1004px] flex gap-[25px]">
              <button
                type="button"
                aria-label="Previous reviews"
                onClick={() => window.scrollBy({ top: -window.innerHeight, behavior: "smooth" })}
                className="flex size-[84px] items-center justify-center rounded-full bg-[#f1f1f1] text-[#2d2f33] transition-opacity duration-200 hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-[21px]" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
                className="flex size-[84px] items-center justify-center rounded-full text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(167.63deg, rgb(154,150,255) 8.4213%, rgb(104,97,238) 47.735%, rgb(88,81,234) 87.048%)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="size-[21px]" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  compact,
  videoRef,
  onEnter,
  onLeave,
  onTap,
  onEnded,
}: {
  review: (typeof REVIEWS)[number];
  compact: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onEnter: () => void;
  onLeave: () => void;
  onTap: () => void;
  onEnded: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-[18px] bg-[#eeeefd]"
      style={{ width: compact ? 250 : CARD_W, height: compact ? 362 : CARD_H }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={onTap}
    >
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        onPlaying={(event) => setIsPlaying(event.currentTarget.videoWidth > 0)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded();
        }}
        className="absolute inset-0 h-full w-full object-cover"
      >
        {/* WebM first so Chromium builds without H.264 still show the picture;
            Safari falls through to the MP4. */}
        <source src={review.webm} type='video/webm; codecs="vp9, opus"' />
        <source src={review.video} type='video/mp4; codecs="avc1.640028, mp4a.40.2"' />
      </video>

      {/* Separate poster layer: some browsers keep the video's `poster` image
          painted over the first frames. Fading this out on `playing` guarantees
          the moving video is what the user sees. */}
      <Image
        src={review.image}
        alt=""
        fill
        sizes={compact ? "250px" : "454px"}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-0 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Play button */}
      <div className="pointer-events-none absolute inset-x-0 top-[32.26%] flex justify-center transition-opacity duration-200 group-hover:opacity-0">
        <div className="flex size-[117px] items-center justify-center rounded-full border border-white/60 bg-white/30 backdrop-blur-md max-sm:size-[70px]">
          <svg viewBox="0 0 24 24" fill="white" className="size-[56px] translate-x-1 max-sm:size-[32px]">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {/* Bottom scrim — Figma 369:14483: 323px, gradient 0/25%/25%, blur 27.5px
          masked so the blur itself fades in (no hard top edge). */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[323px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 51%, rgba(0,0,0,0.25) 100%)",
          backdropFilter: "blur(27.5px)",
          WebkitBackdropFilter: "blur(27.5px)",
          maskImage: "linear-gradient(to bottom, transparent, black 51%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 51%)",
        }}
      >
        <div className="absolute left-[33px] top-[136px] flex flex-col gap-[22px]">
          <div className="flex items-center gap-2">
            <span className="relative block size-[47.68px] shrink-0">
              <Image src="/client-reviews/svg_3.svg" alt="" fill sizes="48px" className="object-contain" />
            </span>
            <span className="whitespace-nowrap font-['Satoshi'] text-[20px] font-bold uppercase leading-none tracking-[0.06em] text-white max-sm:text-[15px]">
              {review.role.includes("@") ? review.role.split("@ ")[1] : review.role}
            </span>
          </div>
          <div className="flex flex-col gap-[9px]">
            <h3 className="font-['Satoshi'] text-[28px] font-bold text-white max-sm:text-[18px]">
              {review.name}
            </h3>
            <p className="font-['Satoshi'] text-[21px] font-medium text-[#f2f2f2] max-sm:text-[14px]">
              {review.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
