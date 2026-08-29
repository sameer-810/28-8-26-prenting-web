/**
 * Generates public/og.png — the 1200×630 card WhatsApp, Facebook, LinkedIn and
 * Slack draw when somebody shares this link.
 *
 *   npm run og
 *
 * WHY IT IS GENERATED RATHER THAN DESIGNED ONCE
 *
 * The card carries the same headline as the page. Hand-made in a design tool,
 * it goes out of step the first time the headline is edited, and nobody
 * notices — the page looks right and only the shared card is wrong, which is
 * the copy most people actually read first.
 *
 * Rendered with Playwright's Chromium, which is already a dev dependency for
 * `npm run verify`, so this adds no new tooling.
 *
 * RE-RUN IT whenever the h1 or og:title changes.
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "..", "public", "og.png");

/**
 * The card, as a self-contained page.
 *
 * It shows the two-column split rather than a logo on a colour, because that
 * arrangement IS the product's idea and it survives being seen at thumbnail
 * size in a chat list — which is where this image is mostly seen.
 */
const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px;
    background: linear-gradient(150deg, #F2F8EF 0%, #FFFDF9 55%);
    font-family: Inter, sans-serif;
    color: #1F1C17;
    padding: 62px 68px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand span { font-family: Fraunces, serif; font-weight: 600; font-size: 28px; color: #375A31; }
  h1 {
    font-family: Fraunces, serif; font-weight: 600; font-size: 62px;
    line-height: 1.08; letter-spacing: -0.02em; max-width: 15ch;
  }
  h1 em { font-style: italic; color: #375A31; }
  .row { display: flex; gap: 26px; align-items: flex-end; justify-content: space-between; }
  .cols {
    display: flex; gap: 0; background: #FFFDF9;
    border: 1px solid #DED8CA; border-radius: 16px; overflow: hidden;
    box-shadow: 0 22px 46px -28px rgba(31,28,23,.4); width: 560px;
  }
  .col { padding: 18px 20px; flex: 1; }
  .col + .col { border-left: 1px solid #DED8CA; }
  .lab {
    font-size: 11px; font-weight: 600; letter-spacing: .07em;
    text-transform: uppercase; color: #928B7C; margin-bottom: 9px;
  }
  /* 1.65 — Devanagari's shirorekha collides with the line above at Latin's ratio. */
  .hi { font-family: "Noto Sans Devanagari", sans-serif; font-size: 17px; line-height: 1.65; }
  .q { font-size: 17px; font-weight: 500; margin-bottom: 10px; }
  .opt {
    border: 1px solid #DED8CA; border-radius: 8px; padding: 6px 10px;
    font-size: 15px; margin-bottom: 6px;
  }
  .ok { border-color: #5E9151; background: #F2F8EF; color: #263D22; font-weight: 600; }
  .tag { font-size: 19px; color: #6B6559; max-width: 15ch; }
</style>
</head>
<body>
  <div class="brand">
    <svg width="34" height="34" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="9" fill="#4A7740"/>
      <path d="M9 22c0-7 5-12 14-12 0 9-5 13-11 13-1.1 0-2-.4-3-1z" fill="#E4F0DF"/>
      <path d="M10 23c3-4 6-6 9-7" stroke="#4A7740" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    </svg>
    <span>ParentAI</span>
  </div>

  <div class="row">
    <div>
      <h1>Teach your child tonight — <em>in your own language.</em></h1>
      <p class="tag" style="margin-top:18px">A 30-minute plan, ready in seconds.</p>
    </div>

    <div class="cols">
      <div class="col">
        <p class="lab">You read aloud</p>
        <p class="hi">आज हम भिन्नों को जोड़ना सीखेंगे। याद रखिए — हम तभी जोड़ सकते हैं जब नीचे की संख्या एक जैसी हो।</p>
      </div>
      <div class="col">
        <p class="lab">They answer</p>
        <p class="q">What is 1/4 + 2/4?</p>
        <div class="opt">3/8</div>
        <div class="opt ok">3/4</div>
        <div class="opt">2/8</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  // 1× on purpose. Scrapers downscale this to a chat thumbnail; a 2× render
  // triples the bytes for detail nobody sees, and WhatsApp rejects large images
  // outright rather than resizing them.
  deviceScaleFactor: 1,
});
await page.setContent(HTML, { waitUntil: "networkidle" });
/** Webfonts settle after `networkidle`; screenshotting too early bakes in the fallback. */
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: OUT });
await browser.close();

console.log(`\n  wrote ${path.relative(process.cwd(), OUT)}  (1200×630)\n`);
