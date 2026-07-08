"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: string;
  label: string;
};

function parseValue(raw: string): { target: number; suffix: string; decimals: number } {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { target: 0, suffix: raw, decimals: 0 };
  const num = match[1];
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { target: parseFloat(num), suffix: match[2], decimals };
}

export function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { target, suffix, decimals } = parseValue(value);
  const finalDisplay =
    decimals > 0 ? target.toFixed(decimals) : Math.round(target).toString();
  const [display, setDisplay] = useState(finalDisplay);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1600;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          setDisplay(
            decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString()
          );
          if (progress < 1) requestAnimationFrame(tick);
        }

        // Start from zero only once visible (async via rAF — not sync in effect body)
        requestAnimationFrame((now) => {
          setDisplay(decimals > 0 ? (0).toFixed(decimals) : "0");
          tick(now);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold text-gold md:text-5xl">
        {display}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-white/60 md:text-base">{label}</div>
    </div>
  );
}
