"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements || !window.IntersectionObserver || !Element.prototype.animate) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new Set<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        seen.add(entry.target);
        if (preference.matches) continue;

        const element = entry.target as HTMLElement;
        const order = Number(element.dataset.revealOrder || 0);
        const portrait = element.dataset.reveal === "portrait";
        const animation = element.animate(
          portrait
            ? { opacity: [0, 1] }
            : { opacity: [0.72, 1], transform: ["translateY(8px)", "translateY(0)"] },
          {
            duration: portrait ? 420 : 360,
            delay: Math.min(order, 3) * 40,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.08 });

    // The page is always readable. Only animate a section when it enters view.
    const updatePreference = () => {
      if (preference.matches) root.current?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      observer.disconnect();
      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) seen.add(element);
        if (!preference.matches && !seen.has(element)) observer.observe(element);
      });
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  return <div ref={root} className="club-home">{children}</div>;
}
