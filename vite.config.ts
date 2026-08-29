import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * ============================================================================
 * OWNER: THE ONE LINE TO CHANGE WHEN THE LAUNCH DOMAIN IS DECIDED
 * ============================================================================
 *
 * The site's own address, with scheme and no trailing slash. Every absolute URL
 * on the page is built from it: `<link rel="canonical">`, `og:url`, `og:image`
 * and the JSON-LD `url`. Change it here and rebuild — there is nowhere else to
 * look.
 *
 * It currently says `https://parentai.app`, WHICH MAY NOT BE OWNED YET. If the
 * site launches on its Vercel address and this is left as-is, every crawler
 * reads the page as a duplicate of a domain that does not resolve, and the
 * canonical tag hands the ranking to nobody. Whatever the site is actually
 * served from is what belongs here — a Vercel URL is a perfectly good answer
 * until an apex domain is bought.
 *
 *   e.g. "https://parentai.app"  or  "https://parentai-landing.vercel.app"
 *
 * Absolute is not optional for the share tags. WhatsApp is how this link will
 * actually travel between Indian parents, and WhatsApp fetches og:image from
 * its own servers, where a relative "/og.png" resolves against nothing and the
 * card renders with a hole in it.
 */
const SITE_ORIGIN = "https://parentai.app";

/**
 * Substitutes %SITE_ORIGIN% in index.html at dev-server and build time.
 *
 * index.html is deliberately static: this is a React SPA, and anything a
 * crawler or a WhatsApp scraper needs must be in the SERVED HTML rather than
 * rendered by JavaScript they will never run. Static markup with one
 * substituted token keeps that property while giving the domain a single home.
 */
function siteOrigin() {
  return {
    name: "parentai-site-origin",
    transformIndexHtml: {
      /**
       * `order: "pre"` is load-bearing rather than tidiness.
       *
       * Vite's build-html step walks every href/src and runs `decodeURI` on it.
       * Left until after that step, the literal `%SI…` reads as a malformed
       * percent-escape and the build dies with "URI malformed". Substituting
       * first means Vite only ever sees a finished absolute URL.
       */
      order: "pre" as const,
      handler(html: string) {
        return html.replaceAll("%SITE_ORIGIN%", SITE_ORIGIN);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), siteOrigin()],
  build: {
    // One route, nothing to code-split. A single chunk beats a chunk graph
    // here: fewer round trips before the hero paints, on a connection that is
    // often a phone on mobile data.
    chunkSizeWarningLimit: 700,
  },
});
