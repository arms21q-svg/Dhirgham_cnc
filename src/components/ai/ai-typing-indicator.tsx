"use client";

export function AiTypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-3 py-2"
      role="status"
      aria-label="Typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 animate-bounce rounded-full bg-gold/70"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
