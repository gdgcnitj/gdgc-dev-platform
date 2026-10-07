"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function FaqAccordion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    if (!container || !Element.prototype.animate) return;
    const items = Array.from(container.querySelectorAll<HTMLDetailsElement>("details"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<HTMLDetailsElement, Animation>();
    const expanded = new Map(items.map((item) => [item, item.open]));

    // Native grouping is the fallback. Enhancement also animates the closing answer.
    items.forEach((item) => item.removeAttribute("name"));
    const finish = (item: HTMLDetailsElement) => {
      item.open = expanded.get(item) ?? false;
      item.classList.remove("club-faq-animating");
      animations.delete(item);
    };
    const toggle = (item: HTMLDetailsElement, open: boolean) => {
      const summary = item.querySelector("summary");
      if (!summary) return;
      const start = item.getBoundingClientRect().height;
      animations.get(item)?.cancel();
      expanded.set(item, open);
      item.dataset.expanded = String(open);
      summary.setAttribute("aria-expanded", String(open));
      if (preference.matches) {
        finish(item);
        return;
      }
      item.open = true;
      const border = parseFloat(getComputedStyle(item).borderTopWidth) + parseFloat(getComputedStyle(item).borderBottomWidth);
      const end = open ? item.scrollHeight + border : summary.getBoundingClientRect().height + border;
      item.classList.add("club-faq-animating");
      const animation = item.animate(
        { height: [`${start}px`, `${end}px`] },
        { duration: 240, easing: "cubic-bezier(0.2, 0, 0, 1)" },
      );
      animations.set(item, animation);
      animation.onfinish = () => finish(item);
    };
    const onClick = (event: MouseEvent) => {
      const summary = (event.target as Element).closest("summary");
      const item = summary?.parentElement as HTMLDetailsElement | null;
      if (!item || !items.includes(item)) return;
      event.preventDefault();
      const open = !expanded.get(item);
      if (open) {
        items.forEach((other) => {
          if (other !== item && expanded.get(other)) toggle(other, false);
        });
      }
      toggle(item, open);
    };
    const settle = () => {
      animations.forEach((animation, item) => {
        animation.cancel();
        finish(item);
      });
    };
    container.addEventListener("click", onClick);
    window.addEventListener("resize", settle);
    preference.addEventListener("change", settle);
    return () => {
      settle();
      items.forEach((item) => {
        item.setAttribute("name", "club-questions");
        delete item.dataset.expanded;
        item.querySelector("summary")?.removeAttribute("aria-expanded");
      });
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", settle);
      preference.removeEventListener("change", settle);
    };
  }, []);

  return <div ref={root} className="club-faq">{children}</div>;
}
