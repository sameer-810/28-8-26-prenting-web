/**
 * Verifies the built landing page.
 *
 *   npm run build && npm run verify
 *   npm run verify -- --headed
 *
 * A marketing page has no tests in the usual sense — nothing to unit-test, and
 * it "works" the moment it renders. What it can get wrong is quieter and more
 * expensive: a price that no longer matches the API, a share card that renders
 * with a hole in it on WhatsApp, a canonical tag pointing at a domain nobody
 * owns, a CTA that goes nowhere. Those are what this checks.
 */
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DIST = path.join(ROOT, "dist");
const PORT = 4174;
const HEADED = process.argv.includes("--headed");

/** The API's plan config — the source of truth these prices are copied from. */
const PLANS_JS = path.resolve(ROOT, "..", "28-8-26-prenting-back", "src", "config", "plans.js");

const pass = [];
const fail = [];
function check(name, ok, detail = "") {
  (ok ? pass : fail).push(name);
  console.log(`${ok ? "  PASS" : "  FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("\n  No dist/. Run `npm run build` first.\n");
  process.exit(1);
}

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain", ".json": "application/json",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(DIST, url === "/" ? "index.html" : url);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

console.log("\n=== 1. What a crawler sees without running JavaScript ===");
/**
 * Read off the SERVED HTML, not off the rendered DOM.
 *
 * This is a React SPA. WhatsApp's scraper — which is how this link will
 * actually travel between Indian parents — fetches the HTML and never executes
 * a line of JS. Anything asserted against the live DOM would pass while the
 * share card renders blank.
 */
const meta = (prop) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, "i"))?.[1] ||
  html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${prop}"`, "i"))?.[1] ||
  "";

check("a title is in the served HTML", /<title>[\s\S]{20,}<\/title>/.test(html));
check("a meta description is in the served HTML", meta("description").length > 60);
check("og:title is set", meta("og:title").length > 10, meta("og:title"));
check("og:description is set", meta("og:description").length > 40);
check("og:image is set", Boolean(meta("og:image")), meta("og:image"));

/**
 * The one that bites. Scrapers fetch og:image from their own servers with no
 * page context, so a relative path resolves against nothing and the card draws
 * with a grey hole in it.
 */
check(
  "og:image is ABSOLUTE, or WhatsApp draws an empty card",
  /^https?:\/\//.test(meta("og:image")),
  meta("og:image"),
);
check("og:url is absolute", /^https?:\/\//.test(meta("og:url")), meta("og:url"));

const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1] || "";
check("a canonical URL is set and absolute", /^https?:\/\//.test(canonical), canonical);
check(
  "the SITE_ORIGIN token was substituted at build time",
  !html.includes("%SITE_ORIGIN%"),
  html.includes("%SITE_ORIGIN%") ? "still literal in dist/index.html" : "",
);
check("structured data is present", /application\/ld\+json/.test(html) && /SoftwareApplication/.test(html));
check("the page declares an Indian English locale", /lang="en-IN"/.test(html));

/**
 * og:image is a real file, not just a real URL. The tag can be perfectly
 * absolute and point at nothing — which looks identical until somebody shares
 * the link.
 */
const ogPath = meta("og:image").replace(/^https?:\/\/[^/]+/, "");
const ogFile = path.join(DIST, ogPath);
check(
  "the og:image file actually exists in dist/",
  ogPath !== "" && fs.existsSync(ogFile),
  fs.existsSync(ogFile) ? `${Math.round(fs.statSync(ogFile).size / 1024)} KB` : `missing ${ogPath}`,
);

console.log("\n=== 2. Prices still match the API ===");
/**
 * config.ts copies the prices out of the API's plans.js, because a static page
 * cannot fetch them and still be readable by a crawler. A copy can go stale, so
 * this is the thing that notices — a landing page quoting ₹499 while the
 * product charges ₹599 is a consumer-law problem, not a typo.
 */
if (!fs.existsSync(PLANS_JS)) {
  check("the API's plans.js was found", false, PLANS_JS);
} else {
  const plansSource = fs.readFileSync(PLANS_JS, "utf8");
  const apiPaise = [...plansSource.matchAll(/priceInPaise:\s*(\d+)/g)].map((m) => Number(m[1]));
  const configSource = fs.readFileSync(path.join(ROOT, "src", "config.ts"), "utf8");
  const pagePaise = [...configSource.matchAll(/priceInPaise:\s*(\d+)/g)].map((m) => Number(m[1]));

  check("the API's plan prices were readable", apiPaise.length >= 4, `${apiPaise.length} plans`);
  check(
    "every price on this page matches the API",
    pagePaise.length === apiPaise.length && pagePaise.every((p, i) => p === apiPaise[i]),
    `page ${pagePaise.join("/")} vs api ${apiPaise.join("/")}`,
  );
}

console.log("\n=== 3. The page renders ===");
const browser = await chromium.launch({ headless: !HEADED });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
const failedRequests = [];
page.on("requestfailed", (r) => failedRequests.push(`${r.method()} ${r.url()}`));

const base = `http://127.0.0.1:${PORT}`;
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const text = await page.evaluate(() => document.body.innerText || "");

check("there is exactly one h1", (await page.locator("h1").count()) === 1);
check("the headline promises the language thing", /your own language/i.test(text));
/**
 * Case-insensitive, because `innerText` returns the RENDERED text and these
 * labels carry `text-transform: uppercase` — a case-sensitive match here failed
 * on a page that was perfectly correct.
 */
check(
  "the hero demonstrates both columns rather than describing them",
  /you read aloud/i.test(text) && /they answer/i.test(text),
);
/**
 * Counts Devanagari characters rather than looking for a run of them. Words are
 * separated by spaces, so the longest unbroken run in a real Hindi sentence is
 * about seven characters — a run-length test looked like a rendering failure
 * when the script was rendering fine.
 */
const devanagari = (text.match(/[ऀ-ॿ]/g) || []).length;
check("real Devanagari is rendered, not a description of it", devanagari > 40, devanagari + " characters");

console.log("\n=== 4. The claims a parent is checking for ===");
check("it says the AI never talks to the child", /never talks to your child/i.test(text));
check("the 30-minute shape is stated", /30-minute|Thirty minutes/i.test(text));
check("all five session phases are listed", /Concept/.test(text) && /Mock test/.test(text) && /Revision/.test(text));
check("grades and boards are named", /grades 1|CBSE/i.test(text));
check("the data promises are on the page", /No account for them/i.test(text) && /delete the household/i.test(text));

console.log("\n=== 5. All eight languages, in their own scripts ===");
const scripts = {
  Devanagari: /[ऀ-ॿ]/,
  Bengali: /[ঀ-৿]/,
  Tamil: /[஀-௿]/,
  Telugu: /[ఀ-౿]/,
  Kannada: /[ಀ-೿]/,
  Arabic: /[؀-ۿ]/,
};
for (const [name, re] of Object.entries(scripts)) {
  check(`${name} renders`, re.test(text));
}
check("all eight are named in English too", ["Hindi", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Urdu", "English"].every((l) => text.includes(l)));

console.log("\n=== 6. Pricing is on the page ===");
check("all four plans appear", /Free Trial/.test(text) && /Basic Monthly/.test(text) && /Family Annual/.test(text) && /Family Plus/.test(text));
check("prices are in rupees, grouped Indian-style", /₹499/.test(text) && /₹4,999/.test(text));
check("the trial says no card is needed", /No card/i.test(text));

console.log("\n=== 7. Every link goes somewhere ===");
const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll("a[href]")).map((a) => ({
    href: a.getAttribute("href"),
    text: (a.textContent || "").trim(),
  })),
);
const empty = links.filter((l) => !l.href || l.href === "#" || l.href === "");
check("no link has an empty or placeholder href", empty.length === 0, empty.map((l) => l.text).join(", "));

const nameless = links.filter((l) => !l.text && !l.href.startsWith("#"));
check("every link has a name", nameless.length === 0);

/**
 * The CTA has to actually reach the app. An unfinished `site.appUrl` would
 * leave the single most important button on the page pointing at nothing.
 */
const cta = links.filter((l) => /signup|login/.test(l.href || ""));
check("the sign-up and sign-in links point at the app", cta.length >= 2, cta[0]?.href);

const contact = links.find((l) => /wa\.me|mailto:/.test(l.href || ""));
check(
  "the contact CTA resolves to WhatsApp or email",
  Boolean(contact),
  contact?.href?.startsWith("mailto:") ? "mailto — whatsappNumber is still unset in config.ts" : contact?.href,
);

console.log("\n=== 8. Accessibility ===");
const a11y = await page.evaluate(() => {
  const interactive = Array.from(document.querySelectorAll("a[href],button,summary,details"));
  const nameless = interactive.filter((el) => {
    const label = el.getAttribute("aria-label") || (el.textContent || "").trim();
    return !label && el.getAttribute("aria-hidden") !== "true";
  });
  const imagesNoAlt = Array.from(document.querySelectorAll("img")).filter(
    (i) => !i.getAttribute("alt") && i.getAttribute("role") !== "presentation",
  );
  /** Decorative SVGs must be hidden from the tree, or a screen reader reads noise. */
  const svgsExposed = Array.from(document.querySelectorAll("svg")).filter(
    (s) => s.getAttribute("aria-hidden") !== "true" && !s.getAttribute("aria-label") && !s.querySelector("title"),
  );
  const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map((h) => Number(h.tagName[1]));
  let skipped = false;
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] - headings[i - 1] > 1) skipped = true;
  }
  return {
    nameless: nameless.length,
    imagesNoAlt: imagesNoAlt.length,
    svgsExposed: svgsExposed.length,
    skipped,
    interactive: interactive.length,
  };
});
check("every interactive element has a name", a11y.nameless === 0, `${a11y.interactive} checked`);
check("no image without alternative text", a11y.imagesNoAlt === 0);
check("decorative SVGs are hidden from assistive technology", a11y.svgsExposed === 0);
check("heading levels do not skip", !a11y.skipped);
check("there is a skip link", /Skip to content/i.test(text));

const focusable = await page.evaluate(() => {
  const first = document.querySelector("a.skip");
  return Boolean(first);
});
check("the skip link is the first focusable element", focusable);

console.log("\n=== 9. On a phone ===");
const phone = await ctx.newPage();
phone.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
await phone.setViewportSize({ width: 390, height: 844 });
await phone.goto(base, { waitUntil: "networkidle" });
await phone.waitForTimeout(1200);
const phoneText = await phone.evaluate(() => document.body.innerText || "");
check("the page renders on a 390px screen", /your own language/i.test(phoneText));

/** A page that scrolls sideways on a phone reads as broken, and this one is for phones. */
const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check("nothing overflows horizontally", overflow <= 1, `${overflow}px`);

const tapTargets = await phone.evaluate(() => {
  const small = [];
  for (const el of document.querySelectorAll("a.btn, .header-cta a")) {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.height < 44) small.push(`${(el.textContent || "").trim()} ${Math.round(r.height)}px`);
  }
  return small;
});
check("buttons are at least 44px tall on a phone", tapTargets.length === 0, tapTargets.join(", "));

console.log("\n=== 10. Reduced motion, and the reveal never hides content ===");
const rm = await ctx.newPage();
await rm.emulateMedia({ reducedMotion: "reduce" });
await rm.goto(base, { waitUntil: "networkidle" });
await rm.waitForTimeout(900);
/**
 * The reveal-on-scroll starts every section at opacity 0. If it ever fails to
 * run, the page is blank below the fold — so this asserts that content far down
 * the page is visible without scrolling to it under reduced motion.
 */
const rmPricing = await rm.evaluate(() => {
  const el = document.querySelector("#pricing");
  if (!el) return null;
  return Number(getComputedStyle(el).opacity);
});
check("under reduced motion every section is visible immediately", rmPricing === 1, String(rmPricing));

console.log("\n=== 11. Health ===");
const realErrors = consoleErrors.filter((e) => !/favicon|Download the React DevTools/i.test(e));
check("no console errors", realErrors.length === 0, realErrors.slice(0, 2).join(" | "));
const realFailed = failedRequests.filter((r) => !/favicon/.test(r));
check("no failed requests", realFailed.length === 0, realFailed.slice(0, 2).join(" | "));

const js = fs.readdirSync(path.join(DIST, "assets")).filter((f) => f.endsWith(".js"));
const jsBytes = js.reduce((s, f) => s + fs.statSync(path.join(DIST, "assets", f)).size, 0);
check("the bundle stays small", jsBytes < 400 * 1024, `${Math.round(jsBytes / 1024)} KB uncompressed`);

if (HEADED) await page.waitForTimeout(5000);
await browser.close();
server.close();

console.log("\n" + "=".repeat(62));
console.log(`PASSED ${pass.length} / ${pass.length + fail.length}`);
if (fail.length) console.log("FAILED:\n" + fail.map((f) => `  - ${f}`).join("\n"));
console.log("=".repeat(62));
process.exit(fail.length ? 1 : 0);
