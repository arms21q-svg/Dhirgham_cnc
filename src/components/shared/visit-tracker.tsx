"use client";

import { useEffect } from "react";

export function VisitTracker() {
  useEffect(() => {
    fetch("/api/visit", { credentials: "same-origin" }).catch(() => {});
  }, []);

  return null;
}
