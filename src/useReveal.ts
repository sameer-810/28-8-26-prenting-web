import { useEffect } from "react";

/**
 * Fades sections in as they scroll into view.
 *
 * 1. It respects `prefers-reduced-motion`. A parent who has asked their phone
 *    to stop animating things has asked this page too, and vestibular triggers
 *    are not a matter of taste. When it is set, every section is revealed
 *    immediately and no observer is created at all.
 *
 * 2. Everything is revealed if IntersectionObserver is missing or the observer
 *    never fires. A reveal-on-scroll effect that fails closed leaves a page
 *    that is blank and looks broken — the failure mode has to be "no animation",
 *    never "no content".
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealAll = () => nodes.forEach((n) => n.setAttribute("data-revealed", "true"));

    const reduced =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver !== "function") {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        }
      },
      // Fires slightly before the section reaches the fold, so the fade has
      // finished by the time it is actually being read.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    nodes.forEach((n) => observer.observe(n));

    /**
     * A backstop. If something goes wrong — a browser quirk, a section already
     * past the viewport on load, an observer that never fires — the page must
     * not stay invisible.
     */
    const timer = setTimeout(revealAll, 2500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
