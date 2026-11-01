"use client";

import { useEffect, useRef, useState } from "react";

/*
 * High-fidelity normalized outline points extracted from Figma concept:
 * KM_POINTS (KodeMount) & KO_POINTS (KodeOrbit)
 */
const KM_POINTS: number[] = [0.325,0.556,0.178,0.691,0.552,0.754,0.503,0.673,0.337,0.402,0.222,0.616,0.394,0.733,0.713,0.893,0.313,0.295,0.295,0.321,0.352,0.236,0.671,0.123,0.319,0.366,0.453,0.701,0.434,0.267,0.455,0.277,0.22,0.743,0.564,0.265,0.43,0.471,0.733,0.689,0.721,0.111,0.333,0.265,0.743,0.275,0.291,0.608,0.358,0.382,0.368,0.244,0.337,0.248,0.574,0.255,0.36,0.727,0.731,0.754,0.733,0.248,0.737,0.337,0.364,0.422,0.265,0.608,0.558,0.234,0.358,0.554,0.206,0.648,0.178,0.669,0.743,0.707,0.717,0.766,0.558,0.15,0.364,0.535,0.547,0.295,0.291,0.372,0.554,0.826,0.58,0.22,0.388,0.422,0.741,0.531,0.663,0.867,0.541,0.283,0.267,0.802,0.244,0.77,0.574,0.806,0.574,0.879,0.618,0.893,0.426,0.246,0.499,0.299,0.566,0.17,0.574,0.19,0.283,0.358,0.741,0.45,0.343,0.545,0.208,0.721,0.582,0.111,0.671,0.103,0.735,0.19,0.319,0.283,0.717,0.473,0.347,0.731,0.655,0.893,0.638,0.101,0.701,0.101,0.44,0.501,0.731,0.515,0.576,0.82,0.644,0.865,0.733,0.883,0.673,0.887,0.511,0.281,0.317,0.335,0.285,0.578,0.578,0.147,0.315,0.566,0.226,0.754,0.305,0.764,0.323,0.317,0.253,0.6,0.729,0.624,0.743,0.141,0.739,0.202,0.727,0.297,0.388,0.703,0.56,0.115,0.36,0.218,0.739,0.291,0.705,0.38,0.358,0.754,0.737,0.374,0.426,0.519,0.495,0.281,0.311,0.594,0.568,0.709,0.717,0.162,0.735,0.4,0.701,0.418,0.552,0.721,0.741,0.804,0.552,0.162,0.384,0.22,0.418,0.236,0.267,0.59,0.539,0.646,0.588,0.725,0.659,0.109,0.293,0.339,0.733,0.665,0.725,0.23,0.493,0.644,0.549,0.695,0.679,0.135,0.552,0.25,0.475,0.269,0.345,0.291,0.723,0.453,0.343,0.572,0.4,0.711,0.319,0.39,0.727,0.487,0.451,0.505,0.333,0.75,0.59,0.895,0.552,0.133,0.713,0.242,0.741,0.317,0.378,0.43,0.489,0.659,0.685,0.897,0.404,0.236,0.253,0.79,0.727,0.57,0.578,0.204,0.188,0.661,0.485,0.677,0.438,0.697,0.743,0.782,0.651,0.877,0.55,0.176,0.705,0.537,0.709,0.745,0.285,0.762,0.743,0.859,0.545,0.269,0.715,0.305,0.343,0.382,0.303,0.384,0.741,0.479,0.18,0.644,0.6,0.109,0.62,0.133,0.737,0.222,0.727,0.125,0.566,0.131,0.632,0.125,0.358,0.396,0.741,0.463,0.234,0.727,0.725,0.604,0.483,0.293,0.741,0.434,0.521,0.65,0.572,0.853,0.719,0.873,0.596,0.133,0.543,0.679,0.743,0.83,0.556,0.877,0.733,0.158,0.406,0.446,0.727,0.436,0.556,0.766,0.733,0.59,0.345,0.766,0.378,0.743,0.519,0.301,0.372,0.396,0.741,0.42,0.741,0.549,0.273,0.618,0.21,0.673,0.321,0.776,0.725,0.826,0.446,0.683,0.715,0.731,0.562,0.863,0.687,0.111,0.446,0.253,0.572,0.295,0.719,0.422,0.356,0.412,0.4,0.511,0.305,0.786,0.459,0.265,0.327,0.293,0.418,0.501,0.398,0.535,0.321,0.58,0.731,0.774,0.598,0.869,0.737,0.495,0.299,0.578,0.713,0.636,0.737,0.721,0.582,0.782,0.424,0.436,0.711,0.519,0.204,0.628,0.725,0.642,0.515,0.669,0.289,0.792,0.717,0.39,0.731,0.541,0.238,0.614,0.568,0.212,0.527,0.311,0.432,0.531,0.56,0.673,0.705,0.701,0.432,0.711,0.422,0.719,0.572,0.836,0.196,0.689,0.424,0.275,0.701,0.4,0.416,0.705,0.303,0.368,0.719,0.717,0.608,0.881,0.709,0.149,0.329,0.38,0.194,0.636,0.743,0.562,0.491,0.309,0.549,0.655,0.709,0.8,0.614,0.105,0.552,0.214,0.194,0.713,0.606,0.897,0.739,0.176,0.721,0.35,0.56,0.784,0.651,0.121,0.446,0.471,0.461,0.667,0.705,0.455,0.741,0.634,0.238,0.75,0.35,0.265,0.404,0.699,0.729,0.794,0.554,0.846,0.386,0.406,0.408,0.432,0.246,0.638,0.388,0.721,0.554,0.798,0.576,0.893,0.442,0.453,0.743,0.58,0.695,0.875,0.721,0.263,0.699,0.115,0.622,0.877,0.386,0.523,0.337,0.303,0.709,0.36,0.715,0.834,0.721,0.323,0.711,0.651,0.307,0.315,0.743,0.735,0.463,0.687,0.721,0.699,0.572,0.747,0.743,0.61,0.558,0.277,0.416,0.453,0.297,0.594,0.564,0.814,0.713,0.214,0.331,0.766,0.55,0.739,0.238,0.792,0.715,0.131,0.202,0.733,0.226,0.772,0.55,0.814,0.378,0.236,0.741,0.844,0.741,0.127,0.737,0.236,0.218,0.634,0.707,0.255,0.424,0.489,0.562,0.735,0.263,0.78,0.174,0.655,0.535,0.669,0.255,0.76,0.582,0.24,0.719,0.56,0.717,0.851,0.743,0.507,0.709,0.572,0.208,0.693,0.743,0.768,0.4,0.222,0.55,0.196,0.729,0.36,0.715,0.503,0.368,0.562,0.729,0.677,0.582,0.158,0.741,0.257,0.313,0.347,0.25,0.802,0.735,0.651,0.634,0.895,0.281,0.345];
const KO_POINTS: number[] = [0.269,0.39,0.747,0.364,0.309,0.331,0.75,0.398,0.752,0.828,0.749,0.337,0.172,0.535,0.323,0.343,0.75,0.606,0.531,0.277,0.885,0.307,0.877,0.386,0.818,0.388,0.36,0.531,0.558,0.55,0.727,0.119,0.844,0.35,0.648,0.469,0.398,0.515,0.319,0.39,0.244,0.398,0.125,0.545,0.602,0.109,0.648,0.129,0.848,0.246,0.323,0.327,0.39,0.505,0.655,0.109,0.626,0.111,0.824,0.374,0.354,0.39,0.127,0.505,0.749,0.269,0.937,0.323,0.156,0.473,0.743,0.477,0.424,0.485,0.432,0.709,0.749,0.784,0.42,0.299,0.422,0.453,0.285,0.527,0.38,0.752,0.729,0.242,0.871,0.255,0.331,0.315,0.735,0.434,0.206,0.465,0.18,0.511,0.392,0.582,0.248,0.608,0.568,0.855,0.554,0.226,0.752,0.24,0.487,0.257,0.263,0.372,0.814,0.438,0.537,0.491,0.663,0.531,0.226,0.578,0.422,0.218,0.507,0.269,0.545,0.277,0.543,0.293,0.35,0.329,0.289,0.366,0.794,0.394,0.707,0.495,0.626,0.529,0.257,0.741,0.566,0.82,0.59,0.871,0.552,0.15,0.558,0.261,0.747,0.309,0.331,0.358,0.469,0.507,0.741,0.129,0.747,0.149,0.549,0.176,0.931,0.263,0.853,0.265,0.863,0.323,0.636,0.473,0.598,0.539,0.578,0.545,0.493,0.679,0.396,0.721,0.392,0.218,0.725,0.352,0.248,0.386,0.139,0.497,0.428,0.527,0.366,0.762,0.786,0.234,0.881,0.271,0.695,0.434,0.214,0.44,0.406,0.495,0.747,0.495,0.479,0.519,0.382,0.598,0.739,0.598,0.287,0.6,0.556,0.671,0.723,0.689,0.81,0.238,0.875,0.283,0.717,0.422,0.382,0.428,0.117,0.523,0.232,0.638,0.533,0.665,0.952,0.291,0.812,0.362,0.414,0.432,0.665,0.513,0.523,0.56,0.279,0.756,0.402,0.299,0.364,0.321,0.244,0.517,0.228,0.6,0.206,0.63,0.422,0.723,0.675,0.855,0.448,0.23,0.731,0.301,0.311,0.349,0.79,0.451,0.43,0.505,0.299,0.531,0.42,0.58,0.752,0.721,0.61,0.865,0.475,0.279,0.337,0.289,0.345,0.349,0.673,0.444,0.752,0.45,0.511,0.497,0.752,0.58,0.564,0.76,0.739,0.287,0.315,0.368,0.152,0.499,0.721,0.505,0.341,0.568,0.416,0.596,0.503,0.655,0.75,0.677,0.257,0.715,0.576,0.743,0.743,0.804,0.588,0.115,0.564,0.129,0.358,0.25,0.869,0.295,0.796,0.38,0.172,0.554,0.697,0.867,0.343,0.319,0.303,0.358,0.461,0.705,0.947,0.313,0.236,0.412,0.317,0.533,0.145,0.552,0.578,0.723,0.564,0.731,0.337,0.78,0.568,0.794,0.675,0.115,0.75,0.18,0.77,0.234,0.483,0.689,0.644,0.857,0.681,0.873,0.549,0.198,0.434,0.224,0.436,0.291,0.394,0.438,0.578,0.495,0.729,0.558,0.743,0.851,0.65,0.871,0.901,0.356,0.311,0.38,0.372,0.412,0.743,0.424,0.703,0.446,0.257,0.582,0.56,0.836,0.347,0.269,0.885,0.376,0.186,0.436,0.489,0.582,0.554,0.701,0.584,0.859,0.693,0.135,0.729,0.214,0.917,0.259,0.865,0.396,0.648,0.453,0.713,0.121,0.806,0.4,0.747,0.511,0.347,0.754,0.368,0.515,0.222,0.679,0.248,0.695,0.394,0.747,0.626,0.851,0.685,0.451,0.721,0.527,0.362,0.584,0.214,0.667,0.311,0.786,0.905,0.327,0.659,0.448,0.594,0.473,0.558,0.485,0.543,0.57,0.315,0.578,0.537,0.646,0.667,0.125,0.558,0.164,0.564,0.281,0.354,0.283,0.457,0.285,0.731,0.38,0.198,0.424,0.432,0.475,0.273,0.598,0.323,0.78,0.729,0.416,0.737,0.503,0.224,0.505,0.729,0.638,0.507,0.679,0.576,0.774,0.768,0.41,0.208,0.451,0.489,0.657,0.226,0.659,0.509,0.285,0.39,0.321,0.743,0.741,0.729,0.754,0.739,0.194,0.673,0.457,0.24,0.594,0.242,0.713,0.273,0.735,0.754,0.204,0.737,0.261,0.834,0.422,0.333,0.545,0.499,0.564,0.752,0.566,0.749,0.651,0.572,0.214,0.83,0.242,0.855,0.337,0.408,0.311,0.925,0.329,0.36,0.416,0.703,0.513,0.309,0.558,0.442,0.592,0.901,0.263,0.945,0.273,0.364,0.335,0.729,0.624,0.745,0.772,0.75,0.253,0.218,0.406,0.733,0.814,0.741,0.232,0.467,0.244,0.279,0.374,0.574,0.806,0.598,0.855,0.495,0.275,0.434,0.459,0.374,0.531,0.436,0.721,0.747,0.35,0.238,0.622,0.556,0.806,0.604,0.133,0.566,0.25,0.616,0.465,0.473,0.584,0.277,0.586,0.729,0.721,0.703,0.109,0.885,0.323,0.737,0.343,0.6,0.487,0.208,0.481,0.517,0.295,0.378,0.305,0.372,0.398,0.527,0.507,0.24,0.578,0.257,0.598,0.75,0.758,0.277,0.77,0.723,0.869,0.168,0.495,0.57,0.188,0.412,0.515,0.408,0.741,0.883,0.293,0.327,0.303,0.754,0.418,0.596,0.554,0.299,0.568,0.455,0.691,0.644,0.523,0.341,0.531,0.347,0.602,0.39,0.25,0.339,0.404,0.715,0.44,0.556,0.499,0.457,0.574,0.297,0.782,0.752,0.222,0.317,0.315,0.176,0.444,0.729,0.485,0.212,0.493,0.19,0.566,0.325,0.378,0.204,0.57,0.303,0.584,0.384,0.731,0.23,0.695,0.558,0.719,0.721,0.853,0.422,0.24,0.764,0.467,0.487,0.568,0.448,0.251,0.612,0.483,0.909,0.343,0.517,0.576,0.752,0.622,0.325,0.758,0.711,0.875,0.408,0.218,0.679,0.523,0.741,0.632,0.657,0.851,0.214,0.614,0.752,0.537,0.442,0.525,0.727,0.139,0.634,0.541,0.24,0.679,0.863,0.277,0.301,0.602,0.206,0.65,0.396,0.529,0.554,0.772,0.44,0.497,0.4,0.596,0.752,0.693,0.725,0.253,0.495,0.501,0.735,0.832,0.836,0.253,0.166,0.457,0.622,0.547,0.568,0.562,0.622,0.875,0.335,0.339,0.719,0.394,0.802,0.446,0.632,0.461,0.747,0.162,0.743,0.457,0.392,0.414,0.451,0.485,0.378,0.238,0.747,0.386,0.679,0.507,0.271,0.721,0.552,0.25,0.723,0.733,0.267,0.61,0.741,0.614,0.574,0.15,0.723,0.15,0.374,0.739,0.467,0.259,0.339,0.586,0.634,0.865,0.511,0.511,0.329,0.602,0.236,0.65,0.754,0.814,0.834,0.382,0.733,0.707,0.782,0.4,0.56,0.683,0.689,0.109,0.638,0.137,0.578,0.699,0.426,0.442,0.368,0.23,0.434,0.578,0.733,0.859,0.444,0.509,0.416,0.531,0.576,0.125,0.729,0.164,0.741,0.562,0.267,0.574,0.55,0.653,0.364,0.273,0.584,0.784,0.64,0.109,0.824,0.43,0.491,0.515,0.749,0.84,0.57,0.713,0.737,0.317,0.535,0.554,0.158,0.55,0.303,0.76,0.709,0.848,0.505,0.58,0.471,0.57,0.483,0.669,0.404,0.578,0.455,0.523,0.255,0.521,0.164,0.507,0.752,0.325,0.257,0.394,0.55,0.214,0.556,0.139];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Normalized point within the brand box (0 to 1)
  normX: number;
  normY: number;
  group: "mount" | "orbit" | "ambient";
  baseRadius: number;
  radius: number;
  color: string;
  phase: number;
  floatSpeed: number;
  wanderAngle: number;
  alpha: number;
}

export default function OtherBrandsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mountBoxRef = useRef<HTMLDivElement | null>(null);
  const orbitBoxRef = useRef<HTMLDivElement | null>(null);

  const [hoveredBrand, setHoveredBrand] = useState<"mount" | "orbit" | null>(null);
  const hoveredBrandRef = useRef<"mount" | "orbit" | null>(null);

  useEffect(() => {
    hoveredBrandRef.current = hoveredBrand;
  }, [hoveredBrand]);

  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let secWidth = 0;
    let secHeight = 0;

    let mountBox = { x: 0, y: 0, w: 480, h: 480 };
    let orbitBox = { x: 0, y: 0, w: 480, h: 480 };

    const updateGeometry = () => {
      const sRect = section.getBoundingClientRect();
      secWidth = sRect.width;
      secHeight = sRect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(secWidth * dpr);
      canvas.height = Math.round(secHeight * dpr);
      canvas.style.width = `${secWidth}px`;
      canvas.style.height = `${secHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (mountBoxRef.current) {
        const mRect = mountBoxRef.current.getBoundingClientRect();
        mountBox = {
          x: mRect.left - sRect.left,
          y: mRect.top - sRect.top,
          w: mRect.width,
          h: mRect.height,
        };
      }
      if (orbitBoxRef.current) {
        const oRect = orbitBoxRef.current.getBoundingClientRect();
        orbitBox = {
          x: oRect.left - sRect.left,
          y: oRect.top - sRect.top,
          w: oRect.width,
          h: oRect.height,
        };
      }
    };

    updateGeometry();
    const ro = new ResizeObserver(updateGeometry);
    ro.observe(section);
    if (mountBoxRef.current) ro.observe(mountBoxRef.current);
    if (orbitBoxRef.current) ro.observe(orbitBoxRef.current);

    // Build particle field
    const particles: Particle[] = [];

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Keep the desktop dot field as designed; trim density on small screens
    // where the extra points cost more than they add visually.
    const density = window.innerWidth < 768 ? 0.55 : 1;
    // 1. KodeMount logo particles (dot field sampled from the outline)
    const kmCount = Math.round(1500 * density);
    for (let i = 0; i < kmCount; i++) {
      const b = (i % 300) * 2;
      const jitter = 0.012;
      const normX = KM_POINTS[b] + (Math.random() - 0.5) * jitter;
      const normY = KM_POINTS[b + 1] + (Math.random() - 0.5) * jitter;
      particles.push({
        x: Math.random() * secWidth,
        y: Math.random() * secHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        normX,
        normY,
        group: "mount",
        baseRadius: 0.5 + Math.random() * 0.3,
        radius: 0.6,
        color: "#2563eb",
        phase: Math.random() * Math.PI * 2,
        floatSpeed: 0.015 + Math.random() * 0.025,
        wanderAngle: 0,
        alpha: 0.72,
      });
    }

    // 2. KodeOrbit logo particles
    const koCount = Math.round(1500 * density);
    for (let i = 0; i < koCount; i++) {
      const b = (i % 300) * 2;
      const jitter = 0.012;
      const normX = KO_POINTS[b] + (Math.random() - 0.5) * jitter;
      const normY = KO_POINTS[b + 1] + (Math.random() - 0.5) * jitter;
      particles.push({
        x: Math.random() * secWidth,
        y: Math.random() * secHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        normX,
        normY,
        group: "orbit",
        baseRadius: 0.5 + Math.random() * 0.3,
        radius: 0.6,
        color: "#2563eb",
        phase: Math.random() * Math.PI * 2,
        floatSpeed: 0.015 + Math.random() * 0.025,
        wanderAngle: 0,
        alpha: 0.72,
      });
    }

    // 3. No orbiting/ambient particles — only the two logo dot fields.
    const ambientCount = Math.round(320 * density);
    for (let i = 0; i < ambientCount; i++) {
      particles.push({
        x: Math.random() * secWidth,
        y: Math.random() * secHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        normX: Math.random(),
        normY: Math.random(),
        group: "ambient",
        baseRadius: 1.5 + Math.random() * 1.5,
        radius: 1.8,
        color: "#2563eb",
        phase: Math.random() * Math.PI * 2,
        floatSpeed: 0.01 + Math.random() * 0.02,
        wanderAngle: Math.random() * Math.PI * 2,
        alpha: 0.4 + Math.random() * 0.25,
      });
    }

    let prevTime = performance.now();
    let isVisible = true;
    const io = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting; }, { threshold: 0 });
    io.observe(section);

    const loop = (time: number) => {
      const dt = reduceMotion ? 0 : Math.min((time - prevTime) / 16.666, 2.5);
      prevTime = time;
      if (!isVisible || document.hidden) {
        animId = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, secWidth, secHeight);

      const activeHover = hoveredBrandRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const isForming = p.group !== "ambient" && p.group === activeHover;
        p.phase += 0.01 * dt;

        if (isForming) {
          // Settle onto the logo outline (plain lerp: no spring wobble/jelly).
          const box = p.group === "mount" ? mountBox : orbitBox;
          const tx = box.x + p.normX * box.w;
          const ty = box.y + p.normY * box.h;
          p.x += (tx - p.x) * 0.16 * dt;
          p.y += (ty - p.y) * 0.16 * dt;
          p.vx *= Math.pow(0.7, dt);
          p.vy *= Math.pow(0.7, dt);
          p.alpha += (0.95 - p.alpha) * 0.1 * dt;
          p.radius += (p.baseRadius - p.radius) * 0.1 * dt;
        } else {
          // Free-floating drift (ambient + un-hovered logo particles).
          // Smooth steering instead of a random turn every frame; random
          // per-frame velocity is what made the drift look jittery.
          p.wanderAngle += 0.01 * dt;
          p.vx += Math.cos(p.wanderAngle + p.phase * 0.6) * 0.055 * dt;
          p.vy += Math.sin(p.wanderAngle + p.phase * 0.45) * 0.055 * dt;
          p.vx *= Math.pow(0.97, dt);
          p.vy *= Math.pow(0.97, dt);
          p.alpha += (0.55 - p.alpha) * 0.05 * dt;
          p.radius += (p.baseRadius * 0.9 - p.radius) * 0.05 * dt;
        }

        // Magnetic repulsion around the cursor (both states).
        if (mouse.active && !reduceMotion) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.hypot(mdx, mdy);
          const repelR = 120;
          if (dist < repelR && dist > 0) {
            const force = (1 - dist / repelR) * 3.6;
            p.x += (mdx / dist) * force * dt;
            p.y += (mdy / dist) * force * dt;
          }
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Wrap so the field never empties.
        if (p.x < -20) p.x = secWidth + 20;
        else if (p.x > secWidth + 20) p.x = -20;
        if (p.y < -20) p.y = secHeight + 20;
        else if (p.y > secHeight + 20) p.y = -20;

        // Render dot
        ctx.save();
        ctx.globalAlpha = Math.max(0.08, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const sRect = sectionRef.current?.getBoundingClientRect();
    if (!sRect) return;
    mouseRef.current = {
      x: e.clientX - sRect.left,
      y: e.clientY - sRect.top,
      active: true,
    };
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    setHoveredBrand(null);
  };

  return (
    <section
      ref={sectionRef}
      id="brands"
      aria-label="Specialist Brands"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[1765px] px-6 py-20 sm:px-12 lg:py-28 bg-white overflow-hidden"
    >
      {/* Full-section interactive particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Header (Specialist Brands Under One Roof) — kept pristine and in front */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[700px] mx-auto pointer-events-auto">
        {/* Building Office Icon Badge */}
        <div className="flex size-[50px] items-center justify-center rounded-[8px] border-2 border-[#9a96ff] p-2 bg-white/70 backdrop-blur-sm shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#9a96ff]" stroke="currentColor" strokeWidth="2">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        <h2 className="mt-8 font-[Poppins,sans-serif] text-[36px] sm:text-[48px] lg:text-[60px] font-medium leading-[1.3] text-[#2d2f33]">
          Specialist Brands Under One Roof
        </h2>
      </div>

      {/* Two Brands Showcase */}
      <div className="relative z-10 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start pointer-events-auto">
        {/* Brand 1: KodeMount */}
        <div
          className="group flex flex-col items-center text-center cursor-pointer"
          onMouseEnter={() => setHoveredBrand("mount")}
          onMouseLeave={() => setHoveredBrand((cur) => (cur === "mount" ? null : cur))}
        >
          {/* Logo target bounding box */}
          <div
            ref={mountBoxRef}
            className="relative size-[340px] sm:size-[440px] lg:size-[480px] flex items-center justify-center"
          />

          <h3 className="mt-6 font-[Poppins,sans-serif] text-[36px] sm:text-[45px] font-medium text-[#2d2f33] transition-colors duration-200 group-hover:text-[#2563eb]">
            KodeMount
          </h3>

          <p className="mt-4 max-w-[620px] font-[Satoshi] text-[20px] sm:text-[24px] lg:text-[26px] font-normal leading-[1.4] text-[#686868]">
            Kodemount is the ultimate peak of reliable software engineering. We build rock-solid systems, platforms, and core architectures that integrate clean code—bringing all your technical resources together into one unshakeable, high-performance foundation.
          </p>

          <div className="mt-8">
            <a
              href="#kodemount"
              className="inline-flex h-[59px] items-center justify-center gap-2 rounded-[57px] px-9 py-4 font-[Satoshi] text-[20px] font-bold text-white shadow-[0px_4px_16px_rgba(104,97,238,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              style={{
                backgroundImage:
                  "linear-gradient(170.25deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
              }}
            >
              <span>View KodeMount</span>
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Brand 2: KodeOrbit */}
        <div
          className="group flex flex-col items-center text-center cursor-pointer"
          onMouseEnter={() => setHoveredBrand("orbit")}
          onMouseLeave={() => setHoveredBrand((cur) => (cur === "orbit" ? null : cur))}
        >
          {/* Logo target bounding box */}
          <div
            ref={orbitBoxRef}
            className="relative size-[340px] sm:size-[440px] lg:size-[480px] flex items-center justify-center"
          />

          <h3 className="mt-6 font-[Poppins,sans-serif] text-[36px] sm:text-[45px] font-medium text-[#2d2f33] transition-colors duration-200 group-hover:text-[#2563eb]">
            KodeOrbit
          </h3>

          <p className="mt-4 max-w-[620px] font-[Satoshi] text-[20px] sm:text-[24px] lg:text-[26px] font-normal leading-[1.4] text-[#686868]">
            Kodeorbit is the central hub of a connected digital universe. We build high-velocity apps, plugins, and web solutions that revolve around clean code—bringing all your digital products together into one seamless, future-ready ecosystem.
          </p>

          <div className="mt-8">
            <a
              href="#kodeorbit"
              className="inline-flex h-[59px] items-center justify-center gap-2 rounded-[57px] px-9 py-4 font-[Satoshi] text-[20px] font-bold text-white shadow-[0px_4px_16px_rgba(104,97,238,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
              style={{
                backgroundImage:
                  "linear-gradient(169.79deg, rgb(154, 150, 255) 8.4213%, rgb(104, 97, 238) 47.735%, rgb(88, 81, 234) 87.048%)",
              }}
            >
              <span>View KodeOrbit</span>
              <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
