export async function fireChallengeConfetti() {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const confetti = (await import("canvas-confetti")).default;

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#9945ff", "#14f195", "#00d1ff", "#f946ff"],
  });
}
