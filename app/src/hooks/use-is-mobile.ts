"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void, breakpoint: number) {
  const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(breakpoint: number) {
  return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile(breakpoint = 1024) {
  return useSyncExternalStore(
    (cb) => subscribe(cb, breakpoint),
    () => getSnapshot(breakpoint),
    getServerSnapshot
  );
}
