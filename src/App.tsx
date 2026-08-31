import { site, plans, languages, phases, contactHref, contactLabel, signupHref, signinHref } from "./config";
import { useReveal } from "./useReveal";

/**
 * The ParentAI marketing page.
 *
 * A parent in an Indian household, on a phone, probably on WhatsApp, probably
 * forwarded this by another parent from a school group. They are not evaluating
 * an ed-tech category. They have a specific worry — their child is behind in
 * maths, or the exam is on Thursday — and about forty seconds of patience.
 *
 * So the page answers, in order: what is this, what happens tonight, why is it
 * not another app that ignores me, what does it cost. The single hardest thing
 * to communicate is that the AI never talks to the child, and that is the one
 * claim the hero demonstrates rather than asserts — a real Hindi script beside
 * real English questions, because a parent recognises that arrangement
 * instantly and no sentence about "the Parent Guidance Layer" ever will.
 */
export default function App() {
  useReveal();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Proof />
        <HowItWorks />
        <Session />
        <Languages />
        <Progress />
        <Safety />
        <Pricing />
        <Faq />
        <Cta />
      </main>

      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="wrap header-inner">
        <a className="brand" href="/" aria-label="ParentAI home">
          <Mark />
          <span>ParentAI</span>
        </a>
        <nav className="header-nav" aria-label="Sections">
          <a href="#how">How it works</a>
          <a href="#languages">Languages</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="header-cta">
          <a className="btn btn-ghost" href={signinHref}>
            Sign in
          </a>
          <a className="btn btn-primary" href={signupHref}>
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">For parents of children in grades 1–8</p>
          <h1>
            Teach your child tonight —<br />
            <em>in your own language.</em>
          </h1>
          <p className="lede">
            Tell ParentAI what they're studying, or photograph the page. In about four seconds you
            get tonight's 30-minute lesson: what to say, in <strong>your</strong> language, and
            what to ask, in <strong>theirs</strong>.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-lg" href={signupHref}>
              Start free for 7 days
            </a>
            <a className="btn btn-secondary btn-lg" href={contactHref()}>
              {contactLabel}
            </a>
          </div>
          <p className="hero-note">No card needed. Works on the phone you already have.</p>
        </div>

        {/*
          The one claim the page demonstrates instead of describing: two
          columns, two languages, two audiences, on one screen. A parent
          recognises this arrangement in about a second — which is roughly a
          second faster than any sentence explaining it.
        */}
        <div className="hero-demo" aria-hidden="false">
          <div className="demo-card">
            <div className="demo-head">
              <span className="demo-topic">Adding fractions</span>
              <span className="demo-timer">30:00</span>
            </div>
            <div className="demo-cols">
              <div className="demo-col">
                <p className="demo-label">You read aloud</p>
                <p className="demo-hindi" lang="hi">
                  आज हम भिन्नों को जोड़ना सीखेंगे। याद रखिए — हम तभी जोड़ सकते हैं जब नीचे की
                  संख्या एक जैसी हो।
                </p>
              </div>
              <div className="demo-col">
                <p className="demo-label">They answer</p>
                <p className="demo-question">What is 1/4 + 2/4?</p>
                <div className="demo-options">
                  <span>3/8</span>
                  <span className="is-correct">3/4</span>
                  <span>2/8</span>
                </div>
              </div>
            </div>
            <p className="demo-foot">
              Your script in Hindi. Their practice in English, the way school asks it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The objection that arrives before any feature does.
 *
 * Every other product in this category is an app for the child. A parent who
 * has already bought one and watched it become another screen their child hides
 * behind will not read a feature list until this is answered.
 */
function Proof() {
  return (
    <section className="band" data-reveal aria-labelledby="proof-heading">
      <div className="wrap">
        {/*
          A real h2, visually hidden rather than omitted.

          The three cards below were h3s sitting directly under the page's h1,
          which is a skipped level: somebody navigating by headings hears the
          hero and then lands two levels down with nothing naming the section
          they are in. The design does not want a visible title on this band —
          it reads as three statements, not as a titled section — so the
          heading is present for the accessibility tree and absent from the
          page. `.sr-only` positions it off-screen rather than `display: none`,
          which would hide it from screen readers too and change nothing.
        */}
        <h2 id="proof-heading" className="sr-only">
          Why ParentAI is different
        </h2>
        <div className="proof">
          <div className="proof-item">
            <h3>The AI never talks to your child</h3>
            <p>
              It talks to you. Children have no account, no login and no screen of their own here —
              they have you, holding a plan that knows what to do next.
            </p>
          </div>
          <div className="proof-item">
            <h3>You don't need to know the subject</h3>
            <p>
              The script is written to be read out loud by somebody meeting the topic for the first
              time, with the analogy and the common mistake already in it.
            </p>
          </div>
          <div className="proof-item">
            <h3>Thirty minutes, then it stops</h3>
            <p>
              A session is paced and ends. It is designed to fit a weeknight after work, not to
              maximise the time anyone spends in it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Say what they're studying",
      body: "Type it, say it, or photograph the page from their textbook or homework diary. ParentAI works out which topic that is on your child's board and grade.",
    },
    {
      n: "2",
      title: "Get tonight's plan",
      body: "A 30-minute session in five parts, built around that exact topic — grounded in the page you photographed if you sent one.",
    },
    {
      n: "3",
      title: "Sit down and teach",
      body: "Follow it phase by phase. You read, they practise, and the last five minutes are built from the questions they actually got wrong.",
    },
  ];

  return (
    <section id="how" className="section" data-reveal>
      <div className="wrap">
        <h2 className="section-title">Three steps, most evenings</h2>
        <p className="section-lede">
          The whole thing is designed around a parent who got home twenty minutes ago.
        </p>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n} className="step">
              <span className="step-n" aria-hidden="true">
                {s.n}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Session() {
  return (
    <section className="section section-alt" data-reveal>
      <div className="wrap">
        <h2 className="section-title">What half an hour looks like</h2>
        <p className="section-lede">
          The same five phases every time, so a child knows where they are and a parent never has to
          decide what comes next.
        </p>
        <ol className="phases">
          {phases.map((p) => (
            <li key={p.title} className="phase">
              <span className="phase-time">{p.minutes} min</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="phase-note">
          The revision at the end is not a repeat. It is generated from the questions your child got
          wrong that evening, which is the whole reason it is last.
        </p>
      </div>
    </section>
  );
}

function Languages() {
  return (
    <section id="languages" className="section" data-reveal>
      <div className="wrap">
        <h2 className="section-title">Your language. Their school's medium.</h2>
        <p className="section-lede">
          Most Indian families live this split every evening: the parent thinks in Marathi, the exam
          is in English. ParentAI writes both sides — not a translation of one into the other.
        </p>
        <ul className="langs">
          {languages.map((l) => (
            <li key={l.code} className="lang">
              <span className="lang-endonym" lang={l.code}>
                {l.endonym}
              </span>
              <span className="lang-english">{l.english}</span>
            </li>
          ))}
        </ul>
        <p className="phase-note">
          Each script is written fresh in your language. A lesson translated word-for-word from
          English reads like a translation, and a child hears it.
        </p>
      </div>
    </section>
  );
}

function Progress() {
  return (
    <section className="section section-alt" data-reveal>
      <div className="wrap">
        <div className="split">
          <div>
            <h2 className="section-title">You'll know whether it's working</h2>
            <p className="section-lede">
              Not a score out of ten. Accuracy, pace and consistency over weeks and months — daily,
              weekly, monthly and yearly — so "is he actually improving?" has an answer.
            </p>
            <ul className="ticks">
              <li>Which skills are solid and which keep coming back wrong</li>
              <li>A streak that forgives one missed day a week, because life happens</li>
              <li>A printable report for the parent–teacher meeting</li>
            </ul>
          </div>
          <div className="progress-card">
            <div className="progress-row">
              <span>Fluency</span>
              <strong>Proficient</strong>
            </div>
            <div className="progress-bar" role="img" aria-label="Fluency: proficient, 80 out of 100">
              <span style={{ width: "80%" }} />
            </div>
            <div className="progress-stats">
              <div>
                <strong>29</strong>
                <span>sessions</span>
              </div>
              <div>
                <strong>75%</strong>
                <span>accuracy</span>
              </div>
              <div>
                <strong>11</strong>
                <span>topics mastered</span>
              </div>
            </div>
            <p className="progress-note">An example, not a real child's record.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Said plainly, because parents of young children ask it and because the
 * product genuinely answers it. Every claim here is enforced somewhere in the
 * code rather than promised here — see docs/01-product-spec.md, DECISION 1.
 */
function Safety() {
  return (
    <section className="section" data-reveal>
      <div className="wrap">
        <h2 className="section-title">What we hold about your child</h2>
        <div className="safety">
          <div className="safety-item">
            <h3>No account for them</h3>
            <p>
              Your child is a profile inside your account, not a user of ours. No login, no email,
              no phone number, nothing they could be contacted through.
            </p>
          </div>
          <div className="safety-item">
            <h3>You can take it all back</h3>
            <p>
              Export everything as a file, or delete the household outright — and deletion means
              deleted, including the photographs of worksheets.
            </p>
          </div>
          <div className="safety-item">
            <h3>Nothing is sold or advertised</h3>
            <p>
              No third-party advertising, no data sold, no marketing email unless you switch it on
              yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="section section-alt" data-reveal>
      <div className="wrap">
        <h2 className="section-title">Pricing</h2>
        <p className="section-lede">
          Seven days free, no card. After that, less per month than one tuition class.
        </p>
        <div className="plans">
          {plans.map((p) => (
            <div key={p.code} className={`plan${p.badge ? " plan-featured" : ""}`}>
              {p.badge ? <span className="plan-badge">{p.badge}</span> : null}
              <h3>{p.name}</h3>
              <p className="plan-price">
                <strong>{p.price}</strong> <span>{p.interval}</span>
              </p>
              <p className="plan-children">{p.children}</p>
              <ul>
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <a className={`btn ${p.badge ? "btn-primary" : "btn-secondary"}`} href={signupHref}>
                {p.code === "trial" ? "Start free" : "Choose this"}
              </a>
            </div>
          ))}
        </div>
        <p className="phase-note">Prices in Indian rupees, inclusive of tax. Cancel any time.</p>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "I'm not good at maths myself. Will this work?",
      a: "That is who it is written for. The script tells you what to say, in order, with the analogy and the mistake children usually make already in it. You are reading and encouraging, not teaching from memory.",
    },
    {
      q: "Which boards and grades?",
      a: "Grades 1 to 8 across CBSE, ICSE and the major state boards. You pick your child's board when you add them, and topics are matched to that syllabus.",
    },
    {
      q: "Does my child need a phone?",
      a: "No. There is one device — yours — and one plan on it. Your child never signs in to anything.",
    },
    {
      q: "What if the internet drops mid-session?",
      a: "The evening's plan is saved to your phone when the session starts, so it keeps running. Answers sync when you are back online.",
    },
    {
      q: "Can both parents use it?",
      a: "Yes. A household can have more than one parent signed in, sharing the same children and the same history.",
    },
    {
      q: "What happens after the free trial?",
      a: "Nothing automatic — there is no card on file. You choose a plan when you are ready, and your history is waiting either way.",
    },
  ];

  return (
    <section className="section" data-reveal>
      <div className="wrap">
        <h2 className="section-title">Questions parents ask</h2>
        <div className="faq">
          {items.map((it) => (
            <details key={it.q}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="cta" data-reveal>
      <div className="wrap cta-inner">
        <h2>Try it on tonight's homework</h2>
        <p>Seven days free. No card. Takes about two minutes to set up.</p>
        <div className="hero-actions">
          <a className="btn btn-primary btn-lg" href={signupHref}>
            Start free
          </a>
          <a className="btn btn-ghost btn-lg" href={contactHref()}>
            {contactLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <a className="brand" href="/" aria-label="ParentAI home">
            <Mark />
            <span>ParentAI</span>
          </a>
          <p className="footer-note">
            Guided learning for Indian families. Built for the parent, not around the child.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#languages">Languages</a>
          <a href="#pricing">Pricing</a>
          <a href={signinHref}>Sign in</a>
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </nav>

        {/*
          The badges are rendered only once a real URL exists. A store badge
          that 404s a parent is worse than no badge — and while both are empty
          the page simply does not claim there is an app to download.
        */}
        {site.playStoreUrl || site.appStoreUrl ? (
          <div className="footer-stores">
            {site.playStoreUrl ? (
              <a className="btn btn-secondary" href={site.playStoreUrl}>
                Get it on Google Play
              </a>
            ) : null}
            {site.appStoreUrl ? (
              <a className="btn btn-secondary" href={site.appStoreUrl}>
                Download on the App Store
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="wrap footer-legal">
        <span>
          © {new Date().getFullYear()} {site.company}
        </span>
      </div>
    </footer>
  );
}

/** The logo mark — inline SVG, so it costs no request and inherits the theme. */
function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#4A7740" />
      {/* A leaf: the cultivation metaphor the whole product is built on. */}
      <path
        d="M9 22c0-7 5-12 14-12 0 9-5 13-11 13-1.1 0-2-.4-3-1z"
        fill="#E4F0DF"
      />
      <path d="M10 23c3-4 6-6 9-7" stroke="#4A7740" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
