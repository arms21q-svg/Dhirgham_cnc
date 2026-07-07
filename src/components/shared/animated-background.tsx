export function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-navy/[0.02] via-transparent to-gold/[0.02] dark:from-navy-light/[0.04] dark:to-gold/[0.03]" />

      <div
        className="absolute inset-0 opacity-25 dark:opacity-12"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(26,58,92,0.1) 0.75px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 45%, black 15%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 45%, black 15%, transparent 72%)",
        }}
      />

      {/* Static gradients — no blur filters or animations (GPU-friendly) */}
      <div className="absolute -top-40 -start-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(26,58,92,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(45,90,138,0.08)_0%,transparent_70%)]" />
      <div className="absolute -bottom-40 -end-40 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(201,169,98,0.07)_0%,transparent_70%)]" />
    </div>
  );
}
