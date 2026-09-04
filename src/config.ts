/**
 * Everything on this page that is a business decision rather than a design one.
 *
 * One file on purpose: the WhatsApp number, the app URL and the store links are
 * things the owner changes, and finding them should never mean reading JSX.
 * Anything marked TODO is a real value nobody could invent — the page renders
 * honestly without it, and each one degrades to something that still works
 * rather than to a dead link.
 */

/* ============================================================================
   TODO — OWNER: FILL THESE IN BEFORE THE PAGE GOES LIVE

     1. whatsappNumber — the number parents reach you on. ⚠ weakens every CTA
     2. playStoreUrl   — once the Android app is published
     3. appStoreUrl    — once the iOS app is published
     4. appUrl         — only if the app moves off its Vercel address

   The launch domain for canonical/og:url is NOT here — it lives in
   vite.config.ts as SITE_ORIGIN, because index.html needs it at build time and
   index.html is deliberately static.
   ========================================================================= */

export const site = {
  /**
   * Where "Start free" and "Sign in" send people — the live app.
   * TODO(owner): change if the app gets its own domain, e.g. "https://app.parentai.app".
   */
  appUrl: "https://28-8-26-prenting-front.vercel.app",

  /**
   * ⚠ TODO(owner) — THE WHATSAPP NUMBER PARENTS CAN REACH YOU ON.
   *
   * Digits only, country code first, no "+", no spaces, no dashes:
   *
   *     whatsappNumber: "919876543210",
   *
   * (Anything pasted in is stripped to digits below, so a number copied out of
   * a phone's contact card still works.)
   *
   * WHAT IT COSTS WHILE EMPTY: "Ask us anything" becomes a mailto: link. This
   * page is aimed at Indian parents, who will be reading it ON WhatsApp, having
   * been forwarded it by another parent. Email is a much weaker second.
   */
  whatsappNumber: "",

  /** Pre-filled, so the first message says which page it came from. */
  whatsappMessage:
    "Hi, I saw ParentAI and I'd like to try it with my child. Can you tell me more?",

  supportEmail: "hello@parentai.app",
  company: "ParentAI",

  /**
   * ⚠ TODO(owner) — the store listings, once published. The whole URL, from
   * the Play Console's "Copy store listing link" / App Store Connect.
   *
   * WHAT IT COSTS WHILE EMPTY: the badge is omitted. A missing badge is better
   * than a button that 404s a parent, but the page then never mentions there is
   * an app at all — so this matters more here than on most sites, because
   * "runs on the phone you already have" is part of the pitch.
   */
  playStoreUrl: "",
  appStoreUrl: "",
};

/**
 * Digits only, whatever was pasted. A number copied off a phone arrives as
 * "+91 98765 43210", and wa.me fails silently on every non-digit — which looks
 * exactly like the number being wrong.
 */
const waDigits = site.whatsappNumber.replace(/\D/g, "");

/** WhatsApp deep link, or a mailto fallback while the number is unset. */
export function contactHref(): string {
  if (waDigits) {
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(site.whatsappMessage)}`;
  }
  return `mailto:${site.supportEmail}?subject=${encodeURIComponent(
    "ParentAI",
  )}&body=${encodeURIComponent(site.whatsappMessage)}`;
}

/** So the button can honestly say what it will do. */
export const contactLabel = waDigits ? "Ask us on WhatsApp" : "Email us";

export const signupHref = `${site.appUrl}/signup`;
export const signinHref = `${site.appUrl}/login`;

/**
 * The plans, mirrored from the API's `config/plans.js`.
 *
 * COPIED, AND THEREFORE ABLE TO GO STALE — which is why this comment exists.
 * The app fetches its prices from the API so a price change never leaves an old
 * build quoting the wrong number at the moment of payment. A marketing page
 * cannot do that: it is static by design, so a crawler and a WhatsApp scraper
 * can read it. If a price changes in `plans.js`, it changes here too, and
 * `npm run verify` fails if the two disagree.
 */
export const plans = [
  {
    code: "trial",
    name: "Free Trial",
    price: "Free",
    interval: "for 7 days",
    priceInPaise: 0,
    children: "1 child",
    highlights: ["Everything in Basic", "No card needed"],
    badge: null as string | null,
  },
  {
    code: "basic_monthly",
    name: "Basic Monthly",
    price: "₹499",
    interval: "per month",
    priceInPaise: 49900,
    children: "1 child",
    highlights: ["Daily 30-minute sessions", "All 8 languages", "Daily & weekly progress"],
    badge: null,
  },
  {
    code: "family_annual",
    name: "Family Annual",
    price: "₹4,999",
    interval: "per year",
    priceInPaise: 499900,
    children: "Up to 2 children",
    highlights: [
      "Everything in Basic",
      "Monthly and yearly progress",
      "Annual report & readiness certificate",
    ],
    badge: "Best value",
  },
  {
    code: "family_plus",
    name: "Family Plus",
    price: "₹8,999",
    interval: "per year",
    priceInPaise: 899900,
    children: "Up to 6 children",
    highlights: ["Everything in Annual", "Higher AI capacity", "Skill roadmaps"],
    badge: null,
  },
];

/**
 * The eight languages, with endonyms.
 *
 * Written in their own scripts because that IS the pitch: a parent scanning
 * this page for their own language recognises मराठी faster than "Marathi", and
 * seeing it rendered properly is the proof that the product means it.
 */
export const languages = [
  { code: "hi", english: "Hindi", endonym: "हिन्दी" },
  { code: "mr", english: "Marathi", endonym: "मराठी" },
  { code: "bn", english: "Bengali", endonym: "বাংলা" },
  { code: "ta", english: "Tamil", endonym: "தமிழ்" },
  { code: "te", english: "Telugu", endonym: "తెలుగు" },
  { code: "kn", english: "Kannada", endonym: "ಕನ್ನಡ" },
  { code: "ur", english: "Urdu", endonym: "اردو" },
  { code: "en", english: "English", endonym: "English" },
];

/** The five phases of a session, from the product spec. Thirty minutes total. */
export const phases = [
  { minutes: "10", title: "Concept", body: "You read a short script aloud, in your language." },
  { minutes: "8", title: "Teaching", body: "You work one example through with them." },
  { minutes: "6", title: "Practice", body: "Five questions, in their school medium." },
  { minutes: "3", title: "Mock test", body: "Three more, unaided, to see what stuck." },
  { minutes: "3", title: "Revision", body: "Built from exactly what they got wrong." },
];

/* Says it once, in the one place a developer running the site will see it.
   `import.meta.env.DEV` keeps it out of the production bundle entirely. */
if (import.meta.env.DEV) {
  const missing = [
    !waDigits && "site.whatsappNumber (src/config.ts) — CTAs fall back to email",
    !site.playStoreUrl && "site.playStoreUrl (src/config.ts) — Play badge hidden",
    !site.appStoreUrl && "site.appStoreUrl (src/config.ts) — App Store badge hidden",
  ].filter(Boolean);
  if (missing.length) {
    console.warn(
      `[parentai] launch values still unset:\n  - ${missing.join("\n  - ")}\n` +
        "  - SITE_ORIGIN (vite.config.ts) — check it matches the real domain",
    );
  }
}
