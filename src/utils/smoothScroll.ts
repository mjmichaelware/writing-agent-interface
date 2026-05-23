import { bus } from "@/core/runtimeEngine";

/**
 * Custom smooth scroll implementation using requestAnimationFrame and cubic-bezier easing.
 * Emits EventBus scroll event and handles the physics of the transition.
 */
export const smoothScroll = (targetId: string) => {
  const target = document.getElementById(targetId);
  if (!target) return;

  // Emit bus event as requested by Mandate Section 6
  bus.emit("scroll:to", { targetId });

  const start = window.pageYOffset;
  const targetPosition = target.getBoundingClientRect().top + start;
  const distance = targetPosition - start;
  const duration = 1200; // 1.2 seconds per mandate
  let startTime: number | null = null;

  // Easing: cubic-bezier(0.22, 1, 0.36, 1)
  // Approximated by 1 - (1 - x)^4 (Quartic ease-out)
  const ease = (t: number) => {
    return 1 - Math.pow(1 - t, 4);
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = ease(progress);

    window.scrollTo(0, start + distance * easeProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};
