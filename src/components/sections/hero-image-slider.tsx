"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RemoteImage } from "@/components/shared/remote-image";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
};

type HeroImageSliderProps = {
  slides: HeroSlide[];
  badge: string;
  isRtl?: boolean;
  intervalMs?: number;
};

export function HeroImageSlider({
  slides,
  badge,
  isRtl = false,
  intervalMs = 5000,
}: HeroImageSliderProps) {
  const [active, setActive] = useState(0);
  const count = slides.length;

  const goNext = useCallback(() => {
    setActive((index) => (index + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    setActive((index) => (index - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = window.setInterval(goNext, intervalMs);
    return () => window.clearInterval(timer);
  }, [count, goNext, intervalMs]);

  if (count === 0) return null;

  const current = slides[active];
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="relative mx-auto w-full max-w-lg animate-fade-up-delayed">
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-gold/20 via-transparent to-navy-light/30" />

      <div className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative aspect-[4/3] w-full bg-navy-dark">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out",
                index === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
              )}
              aria-hidden={index !== active}
            >
              <RemoteImage
                src={slide.imageUrl}
                alt={slide.title}
                fill
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
              />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/20 to-transparent" />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute top-1/2 start-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-dark/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              aria-label="Previous slide"
            >
              <PrevIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute top-1/2 end-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy-dark/80 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              aria-label="Next slide"
            >
              <NextIcon className="size-4" />
            </button>

            <div className="absolute top-3 start-3 z-10 rounded-full bg-navy-dark/70 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
              {active + 1} / {count}
            </div>

            <div className="absolute top-3 end-3 z-10 flex gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === active
                      ? "w-6 bg-gold"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Slide ${index + 1}`}
                  aria-current={index === active}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-4 start-4 end-4 rounded-xl border border-white/10 bg-navy-dark/80 p-4 backdrop-blur-sm">
          <p className="text-xs font-medium text-gold">{badge}</p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">{current.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-white/75">{current.caption}</p>
        </div>
      </div>
    </div>
  );
}
