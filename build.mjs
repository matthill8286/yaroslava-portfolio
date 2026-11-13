// Static site generator for Yaroslava Dzihim's portfolio. No dependencies.
// node build.mjs  ->  dist/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist');
const cases = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/cases.json'), 'utf8'));
const diagrams = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/diagrams.json'), 'utf8'));

const ORDER = ['inner-glow', 'jbc', 'dalitis', 'thallo', 'pcela'];
const SITE = 'Yaroslava Dzihim';
const EMAIL = 'yaroslavadzihim@gmail.com';
const CV = '/Yaroslava_Dzihim_CV.pdf';
const LIVE = {
  jbc: 'https://jbcprojects.com/',
  dalitis: 'https://www.andreasdalitis.com.cy/',
  thallo: 'https://www.thallobuilding.com/',
  pcela: 'https://pcela-flower.ru/',
};
const SOCIAL = [
  ['LinkedIn', 'https://www.linkedin.com/in/yaroslava-dzihim-441299277/'],
  ['Behance', 'https://www.behance.net/yaroslavadzihim'],
  ['Dribbble', 'https://dribbble.com/yaroslavadzihim'],
  ['Instagram', 'https://www.instagram.com/yaaaroslaaavaaa'],
];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = (name) => {
  const p = path.join(ROOT, 'public/img', name + '.jpg');
  return fs.existsSync(p) ? `/img/${name}.jpg` : `/img/${name}.png`;
};

// ---------- layout ----------
function layout({ title, description, body, page, ogImage = '/img/cover-inner-glow.jpg' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#111"/><text x="16" y="21" text-anchor="middle" font-family="Arial" font-weight="700" font-size="13" fill="#fff">YD</text></svg>')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/styles.css">
</head>
<body data-page="${page}">
${nav(page)}
<main id="main">
${body}
</main>
${contact()}
<script src="/main.js" defer></script>
</body>
</html>`;
}

function nav(page) {
  const l = (href, label, key) => `<a href="${href}"${page === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<header class="nav">
  <a class="brand" href="/"><span class="brand-mark">YD</span><span class="brand-name">${SITE}</span></a>
  <p class="status"><span class="dot"></span>Available for new projects · Limassol <time data-clock>--:--</time></p>
  <nav class="links" aria-label="Main">${l('/work/', 'Work', 'work')}${l('/about/', 'About', 'about')}<a href="#contact">Contact</a></nav>
  <button class="inspect" role="switch" aria-checked="false" title="Inspect mode (⌘I)"><span class="switch" aria-hidden="true"><i></i></span>Inspect mode <kbd>⌘I</kbd></button>
  <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
</header>
<div class="menu" id="menu" hidden>
  <nav aria-label="Mobile">
    <a href="/">Home <span>→</span></a>
    <a href="/work/">Work <span>→</span></a>
    <a href="/about/">About <span>→</span></a>
  </nav>
  <div class="menu-foot">
    <p class="eyebrow">Have a product in mind?</p>
    <a class="menu-mail" href="mailto:${EMAIL}">${EMAIL}</a>
    <a class="btn btn-dark" href="${CV}" target="_blank" rel="noopener">Download CV ↓</a>
  </div>
</div>`;
}

function contact() {
  return `<footer class="contact" id="contact">
  <div class="wrap">
    <p class="eyebrow">Have a product in mind?</p>
    <h2 class="contact-title">Let's design<br>the next <em>one.</em></h2>
    <div class="contact-actions">
      <button class="copy" data-copy="${EMAIL}"><span>${EMAIL}</span><span class="chip" data-copy-label>Copy</span></button>
      <a class="btn btn-outline-light" href="${CV}" target="_blank" rel="noopener">Download CV <span aria-hidden="true">↓</span></a>
    </div>
    <div class="contact-grid">
      <div><p class="eyebrow">Based in</p><p>London, UK</p><p>Limassol, Cyprus</p></div>
      <div><p class="eyebrow">Contact</p><p><a href="tel:+447765859993">+44 7765 859993</a></p><p><a href="tel:+35797497860">+357 97 497860</a></p></div>
      <div><p class="eyebrow">Elsewhere</p>${SOCIAL.map(([n, u]) => `<p><a href="${u}" target="_blank" rel="noopener">${n}</a></p>`).join('')}</div>
      <div><p class="eyebrow">Local time</p><p><time data-clock>--:--</time> · Limassol</p><p>© 2026 ${SITE}</p></div>
    </div>
  </div>
</footer>`;
}

// ---------- home ----------
function home() {
  const rows = ORDER.map((s, i) => {
    const c = cases[s];
    const kind = { 'inner-glow': 'App · 2026', pcela: 'E‑commerce · 2025' }[s] || 'Website · 2026';
    return `<a class="row" href="/work/${s}/" data-preview="${img('cover-' + s)}">
      <span class="row-i">${String(i + 1).padStart(2, '0')}</span>
      <span class="row-t">${esc(c.title)}</span>
      <span class="row-m">${kind}</span>
      <span class="row-a" aria-hidden="true">↗</span>
      <img class="row-img" src="${img('cover-' + s)}" alt="" loading="lazy">
    </a>`;
  }).join('');
  const steps = [
    ['Research', 'Interviews, analytics, competitor review. I start with what people actually do, not what we assume.'],
    ['Hypotheses', 'Each idea gets an impact, a risk and two options to compare before anything is drawn.'],
    ['Design', 'Flows, wireframes, then UI built on a component system that developers can trust.'],
    ['Test', 'Prototype sessions and live metrics. What does not work goes back to step 02.'],
  ];
  return layout({
    page: 'home',
    title: `${SITE} — UI/UX & Product Designer`,
    description: 'UI/UX and product designer based in London and Limassol. Websites, products and the systems behind them.',
    body: `
<section class="hero wrap">
  <div class="hero-top"><span class="mono">Portfolio / 2026 — v4.0</span><span class="mono">UI/UX &amp; Product designer</span></div>
  <h1 class="hero-title">I design web products<br>and the <span class="rot" aria-live="polite"><span class="rot-word" data-words="systems,flows,details,logic">systems</span><i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><span class="dims mono">480 × 138</span><span class="fcursor fc-top" aria-hidden="true"><svg width="16" height="20" viewBox="0 0 16 20"><path d="M1 1v15l4-4 3 7 3-1.4-3-6.6h6z" style="fill:#4338ca;stroke:#fff" stroke-width="1.2"/></svg><b>Yaroslava</b></span></span><br>behind them.</h1>
  <div class="hero-foot">
    <p class="lead">UI/UX and product designer based in London and Limassol. For 4+ years I have been turning complex flows into clear, usable websites and products — for SaaS, fintech and e‑commerce teams.</p>
    <span class="mono muted">Scroll to explore ↓</span>
  </div>
</section>

<section class="work-list wrap" aria-labelledby="sw">
  <div class="sec-head"><h2 id="sw" class="h-xl">Selected work <sup>(05)</sup></h2><span class="mono muted hide-m">Hover a project to preview ↘</span></div>
  <div class="rows" data-rows>${rows}<img class="preview" alt="" aria-hidden="true"></div>
</section>

<section class="about-me wrap">
  <div class="about-copy">
    <p class="eyebrow">About me</p>
    <h2 class="h-lg">${SITE}</h2>
    <p>I work on websites, dashboards, platforms and design systems — from research and user flows to final UI and developer handoff.</p>
    <p class="muted">Before design I worked as a lawyer. It taught me to read the fine print, ask the awkward questions and explain complicated things simply.</p>
    <a class="link-arrow" href="/about/">More about me <span>→</span></a>
  </div>
  <div class="cards" data-cards>
    <div class="card c-accent" style="--x:6%;--y:4%;--r:-4deg"><b>4+</b><span>years in UI/UX</span></div>
    <div class="card" style="--x:56%;--y:0%;--r:3deg"><span class="eyebrow">Based in</span><b class="sm">London ⇄ Limassol</b></div>
    <div class="card c-dark" style="--x:30%;--y:30%;--r:-2deg"><span class="eyebrow">Ex‑lawyer</span><b class="sm">Reads the fine print</b></div>
    <div class="card" style="--x:72%;--y:32%;--r:4deg"><b class="sm">EN · RU · UA</b></div>
    <div class="card" style="--x:0%;--y:58%;--r:-3deg"><span class="eyebrow">Focus</span><b class="sm">SaaS<br>Fintech<br>E‑commerce</b></div>
    <div class="card" style="--x:62%;--y:62%;--r:2deg"><b>10+</b><span>products shipped</span></div>
    <p class="cards-hint mono muted">Drag the cards around</p>
  </div>
</section>

<section class="process dark">
  <div class="wrap">
    <div class="sec-head"><h2 class="h-xl">How I work —<br>in <em>auto layout</em></h2><p class="muted">Every project follows the same four steps. The gaps between them are where the decisions happen.</p></div>
    <ol class="steps">${steps.map(([t, d], i) => `<li><span class="mono muted">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    <span class="mono tag-dark">Horizontal · gap 40 · padding 24</span>
  </div>
</section>

<section class="numbers wrap">
  <div><h2 class="h-xl">Numbers,<br>not <em>adjectives.</em></h2><p class="muted">A few facts about my work so far, written the way I keep a design file: as properties and variables.</p></div>
  <div class="panel" role="table" aria-label="Facts">
    <div class="panel-tabs"><span class="on">Design</span><span>Prototype</span><span>Inspect</span></div>
    <p class="panel-h">Component properties</p>
    <div class="kv"><span>Years designing</span><b>4+</b></div>
    <div class="kv"><span>Components documented</span><b>50+</b></div>
    <div class="kv"><span>Products shipped</span><b>10+</b></div>
    <p class="panel-h">Variables</p>
    <div class="kv"><span>Location</span><code>London · Limassol</code></div>
    <div class="kv"><span>Focus</span><code>SaaS · Fintech · E‑commerce</code></div>
    <div class="kv"><span>Languages</span><code>EN · RU · UA</code></div>
  </div>
</section>`,
  });
}

// ---------- work ----------
const WORK = [
  ['inner-glow', 'Inner Glow AI', 'App · 2026', 'Product', 'Mental health app with an AI companion. 200+ screens, from research to a design system.'],
  ['jbc', 'JBC Projects', 'Website · 2026', 'Websites', 'Stadium and arena consultancy, London & Cardiff.'],
  ['dalitis', 'Andreas Dalitis & Sons', 'Website · 2026', 'Websites', 'Construction and property developer, Limassol, since 1983.'],
  ['thallo', 'Thallo Building', 'Website · 2026', 'Websites', 'Green office building in Larnaca, 2,068 m².'],
  ['pcela', 'Pcela Flower', 'E‑commerce · 2025', 'E‑commerce', 'Flower delivery in St. Petersburg in 90 minutes.'],
  ['property-one', 'Property One', 'Design system · 2024', 'Design systems', '30+ documented components with states and specs for handoff.', true],
  ['offlight', 'Offlight', 'Product', 'Product', 'Platform for creative talent: directory with filters, profiles and multi-step registration.', true],
  ['decaar', 'Decaar', 'E‑commerce · 2026', 'E‑commerce', '25+ page B2B skincare store with a partner area and consultation flow.', true],
  ['kamino', 'KAMINO', 'Website · 2026', 'Websites', 'Premium golf brand with craft-led product pages.', true],
];
function work() {
  const cats = ['All', 'Websites', 'E‑commerce', 'Product', 'Design systems'];
  const count = (c) => (c === 'All' ? WORK.length : WORK.filter((w) => w[3] === c).length);
  const card = ([s, t, m, cat, d, soon]) => {
    const inner = `<div class="pc-label"><span class="mono">#&nbsp; ${esc(t)}</span><span class="mono muted">${m}</span></div>
      <div class="pc-img"><img src="${img('cover-' + s)}" alt="${esc(t)} — cover" loading="lazy">${soon ? `<span class="soon">In progress · shown after release</span>` : ''}</div>
      <div class="pc-title"><h3>${esc(t)}</h3><span class="chip ${soon ? 'chip-muted' : ''}">${soon ? 'Coming soon' : 'Case study'}</span></div>
      <p class="muted">${esc(d)}</p>`;
    return soon
      ? `<article class="pc is-soon" data-cat="${cat}">${inner}</article>`
      : `<a class="pc" href="/work/${s}/" data-cat="${cat}">${inner}</a>`;
  };
  return layout({
    page: 'work',
    title: `Work — ${SITE}`,
    description: 'All projects 2022 — 2026: product design, websites, e‑commerce and design systems.',
    body: `
<section class="page-head wrap">
  <p class="mono muted">All projects · 2022 — 2026</p>
  <h1 class="h-xxl">Work <sup>(09)</sup></h1>
</section>
<section class="wrap work-grid-wrap">
  <div class="filters" role="toolbar" aria-label="Filter projects">${cats.map((c, i) => `<button class="filter" aria-pressed="${i === 0}" data-filter="${c}">${c} <span>${count(c)}</span></button>`).join('')}</div>
  <div class="grid" data-grid>${WORK.map(card).join('')}</div>
</section>`,
  });
}

// ---------- about ----------
function about() {
  const versions = [
    ['Current version', '04.2026 — now', 'Product Designer · Inner Glow', 'End-to-end design of an AI mental health app: research, AI interaction model, 200+ screens, component library.'],
    ['v5', '2025 — now', 'UI/UX & Product Designer · Absolute Websites', 'Client websites and product interfaces: Decaar, JBC Projects, Andreas Dalitis & Sons, Thallo, KAMINO.'],
    ['v4', '12.2025 — 2026', 'UI/UX & Product Designer · IMPKT.', 'Product and interface design for client projects.'],
    ['v3', '10.2023 — 10.2025', 'UI/UX Designer · MH Development', 'Web and mobile interfaces with product managers and developers, from wireframes to release.'],
    ['v2', '10.2022 — now', 'UI/UX Designer · Freelance', 'Websites, landing pages and product interfaces. Built the Property One design system.'],
    ['v1', '08.2020 — 09.2022', 'Lawyer · Regional Centre for Emergency Medical Aid', 'Legal documentation and court work. Where I learned structure, detail and plain language.'],
  ];
  const libs = [
    ['UX', ['User research & testing', 'User flows & journeys', 'Information architecture', 'Wireframes & prototypes', 'Conversion-focused design']],
    ['UI', ['High-fidelity interfaces', 'Typography & hierarchy', 'Responsive, mobile-first', 'Developer-ready handoff']],
    ['Products', ['Dashboards & platforms', 'E‑commerce', 'AI-powered flows', 'Onboarding & registration']],
    ['Systems & tools', ['Design systems & components', 'Figma & FigJam', 'Hotjar, Mouseflow, Maze', 'After Effects & Premiere', 'Claude, ChatGPT, Figma AI']],
  ];
  return layout({
    page: 'about',
    title: `About — ${SITE}`,
    description: 'UI/UX and product designer, ex-lawyer, based in London and Limassol.',
    ogImage: '/img/portrait.jpg',
    body: `
<section class="about-hero wrap">
  <figure class="portrait"><figcaption class="pc-label"><span class="mono">#&nbsp; yaroslava.jpg</span><span class="mono muted">520 × 650</span></figcaption><img src="/img/portrait.jpg" alt="Portrait of Yaroslava Dzihim" width="520" height="650"></figure>
  <div class="about-text">
    <p class="eyebrow">About</p>
    <h1 class="h-xl">From messy flows<br>to a few<br><em>clear steps.</em></h1>
    <p>I work on websites, dashboards, platforms and design systems — from research and user flows to final UI and developer handoff.</p>
    <p>Before design I worked as a lawyer. It taught me to read the fine print, ask the awkward questions and explain complicated things simply — habits I now bring to every product.</p>
    <p>Most of my work is on data-heavy interfaces: dashboards, e‑commerce, platforms and the design systems that hold them together. I like the part where a messy flow finally clicks into a few clear steps.</p>
    <p class="muted">Next, I want to go deeper into SaaS and fintech.</p>
  </div>
</section>
<section class="versions wrap">
  <div class="sec-side"><h2 class="h-lg">Version history</h2><p class="muted">Where I’ve worked, newest first.</p></div>
  <div class="vh"><div class="vh-head"><span>Version history</span><span aria-hidden="true">✕</span></div>
    <ol>${versions.map(([v, d, r, t], i) => `<li${i === 0 ? ' class="current"' : ''}><div class="vh-meta"><span class="chip ${i === 0 ? 'chip-accent' : ''}">${v}</span><span class="mono muted">${d}</span></div><h3>${esc(r)}</h3><p class="muted">${esc(t)}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="libraries dark">
  <div class="wrap">
    <h2 class="h-lg lib-title">Enabled libraries <em>skills &amp; tools</em></h2>
    <div class="libs">${libs.map(([n, items]) => `<div class="lib"><div class="lib-h"><b>${n}</b><span class="mono muted">${items.length} items</span></div><ul>${items.map((x) => `<li><span>${esc(x)}</span><button class="switch" role="switch" aria-checked="true" aria-label="${esc(x)}"><i></i></button></li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>
<section class="facts wrap">
  <div><p class="eyebrow">Education</p><p>Master of Law — University of Customs and Finance, 2016–2022</p></div>
  <div><p class="eyebrow">Languages</p><p>English — Upper Intermediate · Russian — Fluent · Ukrainian — Fluent</p></div>
  <div><p class="eyebrow">Based in</p><p>London, UK · Limassol, Cyprus</p></div>
  <div><p class="eyebrow">Contact</p><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
</section>`,
  });
}

// ---------- case diagrams ----------
function flowSVG(f, cls) {
  const s = [];
  s.push(`<svg class="flow ${cls}" viewBox="0 0 ${f.w} ${f.h}" role="img" aria-label="Visitor flow diagram">`);
  s.push(`<rect width="${f.w}" height="${f.h}" fill="${f.bg || '#f7f7f7'}" rx="0"/>`);
  for (const [x, y, d, st, sw] of f.p) s.push(`<path d="${d}" transform="translate(${x} ${y})" fill="none" stroke="${st || '#111'}" stroke-width="${sw || 1.2}" stroke-linejoin="round"/>`);
  if (f.d) {
    const [x, y, w, h, st, fl] = f.d;
    s.push(`<polygon points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}" fill="${fl || '#fff'}" stroke="${st}" stroke-width="1.4"/>`);
    s.push(`<foreignObject x="${x + w * 0.18}" y="${y}" width="${w * 0.64}" height="${h}"><div class="fo fo-d">${esc(f.dt ? f.dt[4] : '')}</div></foreignObject>`);
  }
  for (const [x, y, w, h, t, fl, st, tc] of f.n) {
    s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="0" fill="${fl}" stroke="${st}"/>`);
    s.push(`<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div class="fo" style="color:${tc}">${esc(t)}</div></foreignObject>`);
  }
  for (const [x, y, w, h, t] of f.l) {
    s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="0" fill="#fff" stroke="#e5e5e5"/>`);
    s.push(`<text x="${x + w / 2}" y="${y + h / 2 + 3.5}" text-anchor="middle" class="fl">${esc(t)}</text>`);
  }
  s.push('</svg>');
  return s.join('');
}
function wireSVG(w) {
  const r = w.r.map(([x, y, ww, h, fl, st, rr, el]) => el
    ? `<ellipse cx="${x + ww / 2}" cy="${y + h / 2}" rx="${ww / 2}" ry="${h / 2}" fill="${fl || 'none'}" ${st ? `stroke="${st}"` : ''}/>`
    : `<rect x="${x}" y="${y}" width="${ww}" height="${h}" rx="${rr}" fill="${fl || 'none'}" ${st ? `stroke="${st}"` : ''}/>`).join('');
  return `<svg class="wire" viewBox="0 0 ${w.w} ${w.h}" role="img" aria-label="Wireframe"><rect width="${w.w}" height="${w.h}" fill="${w.bg || '#fff'}"/>${r}</svg>`;
}
function emotionSVG(vals) {
  const n = vals.length, W = 1000, H = 120;
  const xs = vals.map((_, i) => ((i + 0.5) / n) * W);
  const pts = vals.map((v, i) => `${xs[i]},${v}`).join(' ');
  return `<svg class="emo" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="${W}" y1="100" y2="100" style="stroke:#e5e5e5;stroke-dasharray:4 4" vector-effect="non-scaling-stroke"/><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/>${vals.map((v, i) => `<circle cx="${xs[i]}" cy="${v}" r="5" fill="var(--accent)" vector-effect="non-scaling-stroke"/>`).join('')}</svg>`;
}

// ---------- case ----------
function sec(id, label, inner, extra = '') {
  return `<section class="cs" id="${id}" ${extra}><p class="cs-label mono">${esc(label)}</p><div class="cs-body">${inner}</div></section>`;
}
function caseStudy(slug, idx) {
  const c = cases[slug], S = c.sections, D = diagrams[slug];
  const next = cases[ORDER[(idx + 1) % ORDER.length]];
  const nextSlug = ORDER[(idx + 1) % ORDER.length];
  const out = [];

  const meta = c.meta.map(([k, v]) => {
    if (k === 'LIVE' && LIVE[slug]) v = `<a href="${LIVE[slug]}" target="_blank" rel="noopener">${esc(v)}</a>`; else v = esc(v);
    return `<div><dt class="mono muted">${esc(k)}</dt><dd>${v}</dd></div>`;
  }).join('');

  // Problem
  const P = S['Problem'];
  out.push(sec('problem', P.label, `<p class="big">${esc(P.text)}</p><blockquote class="hmw">${esc(P.hmw)}</blockquote>`, 'data-toc="Problem"'));
  // Research
  const R = S['Research'];
  out.push(sec('research', R.label, `<div class="stats">${R.stats.map(([n, l]) => `<div><b>${esc(n)}</b><span class="muted">${esc(l)}</span></div>`).join('')}</div><p class="finding">${esc(R.finding)}</p>`, 'data-toc="Research"'));
  // Audience
  const A = S['Audience'];
  out.push(sec('audience', A.label, `<p class="intro">${esc(A.intro)}</p><div class="personas">${A.personas.map(({ texts: t }) => `<article class="persona"><div class="p-top"><span class="avatar">${esc(t[0])}</span><h3>${esc(t[1])}</h3></div><p class="quote">${esc(t[2])}</p><p class="eyebrow">${esc(t[3])}</p><p>${esc(t[4])}</p><p class="key mono">${esc(t[5])}</p></article>`).join('')}</div>`));
  // Journey
  const J = S['Journey map'];
  const stages = J.rows[0].cells, rest = J.rows.slice(1);
  const table = `<div class="jm-table" role="table"><div class="jm-row jm-emo" role="row"><span class="jm-l mono" role="rowheader">EMOTION</span><div class="jm-curve">${emotionSVG(J.emotion)}</div></div>${J.rows.map((r) => `<div class="jm-row${r.label === 'STAGE' ? ' jm-stage' : ''}${r.label === 'DESIGN RESPONSE' ? ' jm-resp' : ''}" role="row"><span class="jm-l mono" role="rowheader">${esc(r.label)}</span>${r.cells.map((x) => `<span class="jm-c" role="cell">${esc(x)}</span>`).join('')}</div>`).join('')}</div>`;
  const cards = `<ol class="jm-cards">${stages.map((st, i) => `<li><h3><span class="mono muted">${String(i + 1).padStart(2, '0')}</span> ${esc(st)}</h3>${rest.map((r) => `<p class="eyebrow">${esc(r.label)}</p><p${r.label === 'DESIGN RESPONSE' ? ' class="resp"' : ''}>${esc(r.cells[i])}</p>`).join('')}</li>`).join('')}</ol>`;
  out.push(sec('journey', J.label, `<p class="intro">${esc(J.intro)}</p><div class="jm-emo-m">${emotionSVG(J.emotion)}<div class="jm-emo-l">${stages.map((s) => `<span>${esc(s)}</span>`).join('')}</div></div>${table}${cards}`));
  // Hypotheses
  const H = S['Hypotheses'];
  out.push(sec('hypotheses', H.label, `<p class="intro">${esc(H.intro)}</p><p class="mono accent set-label">${esc(H.setLabel)}</p><ol class="hyps">${H.items.map(([id, t, ml, m, imp]) => `<li><span class="hid">${esc(id)}</span><p>${esc(t)}</p><div class="hm"><span class="eyebrow">${esc(ml)}</span><span>${esc(m)}</span></div><span class="chip ${/High/.test(imp) ? 'chip-accent' : ''}">${esc(imp)}</span></li>`).join('')}</ol>`, 'data-toc="Hypotheses"'));
  // Prioritisation
  const Q = S['Prioritisation'];
  const hypText = Object.fromEntries(H.items.map((h) => [h[0], h[1]]));
  const quad = Q.quads.filter((q) => !/→|↑/.test(q[0]));
  out.push(sec('prioritisation', Q.label, `<p class="intro">${esc(Q.intro)}</p><div class="matrix">${quad.map(([t]) => `<div class="q"><span class="mono">${esc(t)}</span></div>`).join('')}<span class="ax ax-y mono">IMPACT ↑</span><span class="ax ax-x mono">EFFORT →</span>${Q.chips.map(([id, x, y]) => `<span class="mchip" style="left:${(x / Q.w) * 100}%;top:${(y / Q.h) * 100}%"><b>${esc(id)}</b><span class="hide-m">${esc((hypText[id] || '').split(/[,.—]/)[0].slice(0, 38))}…</span></span>`).join('')}</div><ol class="legend">${Q.chips.slice().sort((a, b) => a[0].localeCompare(b[0], 'en', { numeric: true })).map(([id]) => `<li><b>${esc(id)}</b><span>${esc(hypText[id] || '')}</span></li>`).join('')}</ol>`));
  // Flow
  const F = S['Visitor flow'];
  out.push(sec('flow', F.label, `<p class="intro">${esc(F.intro)}</p><div class="diagram">${flowSVG(D.flowD, 'flow-d')}${flowSVG(D.flowM, 'flow-m')}</div>`, 'data-toc="Flow"'));
  // Sitemap
  const M = S['Sitemap'];
  out.push(sec('sitemap', M.label, `<p class="intro">${esc(M.intro)}</p><div class="sitemap"><div class="sm-root">${esc(D.sitemap.root)}</div><ul class="sm-sections" style="--n:${D.sitemap.sections.length}">${D.sitemap.sections.map((s) => `<li><span class="sm-sec">${esc(s.name)}</span>${s.pages.length ? `<ul class="sm-pages">${s.pages.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</li>`).join('')}</ul></div>`));
  // Wireframes
  const Wf = S['Wireframes to UI'];
  out.push(sec('wireframes', Wf.label, `<p class="intro">${esc(Wf.intro)}</p><div class="pair"><figure><figcaption class="mono">#&nbsp; Wireframe</figcaption>${wireSVG(D.wire)}</figure><span class="pair-arrow" aria-hidden="true">→</span><figure><figcaption class="mono">#&nbsp; Final UI</figcaption><img src="${img(slug + '-ui')}" alt="${esc(c.title)} final UI" loading="lazy"></figure></div>`));
  // Solution
  const So = S['Solution'];
  const pinsFor = (k) => So.pins.filter(([, x]) => (k === 0 ? x < 508 : x >= 508)).map(([n, x, y]) => `<span class="pin" style="left:${(((k ? x - 508 : x) + 15) / 492) * 100}%;top:${((y + 15) / 620) * 100}%">${esc(n)}</span>`).join('');
  out.push(sec('solution', So.label, `<div class="sol-imgs">${['a', 'b'].map((k, i) => `<figure class="sol-img"><img src="${img(slug + '-sol-' + k)}" alt="${esc(c.title)} solution screens ${i + 1}" loading="lazy">${pinsFor(i)}</figure>`).join('')}</div><ol class="notes">${So.notes.map(([n, t, d]) => `<li><span class="pin pin-static">${esc(n)}</span><div><h3>${esc(t)}</h3><p class="muted">${esc(d)}</p></div></li>`).join('')}</ol>`, 'data-toc="Solution"'));
  // Screens
  const Sc = S['Screens'];
  const shots = Sc.shots.map((s, i) => ({ ...s, file: img(`${slug}-shot-${i + 1}`) }));
  const fig = (s, cls) => `<figure class="shot ${cls}"><figcaption class="pc-label"><span class="mono">${esc(s.label[0])}</span>${s.label[1] ? `<span class="mono muted">${esc(s.label[1])}</span>` : ''}</figcaption><img src="${s.file}" alt="${esc(s.label[0].replace('#', '').trim())}" loading="lazy"></figure>`;
  out.push(sec('screens', Sc.label, `<p class="intro">${esc(Sc.intro)}</p><div class="shots">${fig(shots[0], 'wide')}<div class="shots-2">${fig(shots[1], '')}${fig(shots[2], '')}</div><div class="shots-4">${shots.slice(3).map((s) => fig(s, 'mob')).join('')}</div></div>`));
  // Measure
  const Me = S['What we measure'];
  const [head, ...rows] = Me.table;
  out.push(sec('measure', Me.label, `<p class="intro">${esc(Me.intro)}</p><div class="mtable" role="table"><div class="mrow mhead" role="row">${head.map((h) => `<span role="columnheader" class="mono">${esc(h)}</span>`).join('')}</div>${rows.map((r) => `<div class="mrow" role="row">${r.map((x, i) => `<span role="cell" data-label="${esc(head[i])}">${esc(x).replace('CHANGED THE DESIGN', '<em class="chip chip-accent">Changed the design</em>')}</span>`).join('')}</div>`).join('')}</div>`));
  // Results
  const Re = S['Results'];
  out.push(sec('results', Re.label, `<div class="results">${Re.cols.map(([t, d]) => `<div><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`, 'data-toc="Results"'));

  const toc = ['Problem', 'Research', 'Hypotheses', 'Flow', 'Solution', 'Results'];
  const ids = { Problem: 'problem', Research: 'research', Hypotheses: 'hypotheses', Flow: 'flow', Solution: 'solution', Results: 'results' };
  return layout({
    page: 'case',
    title: `${c.title} — Case study — ${SITE}`,
    description: c.intro,
    ogImage: img('cover-' + slug),
    body: `
<div class="case-bar wrap"><a href="/work/" class="mono">← All work</a><span class="mono muted hide-m">${esc(c.crumb)}</span><a href="/work/${nextSlug}/" class="mono">Next case →</a></div>
<header class="case-head wrap">
  <p class="mono muted">${esc(c.eyebrow)}</p>
  <h1 class="h-xxl"><span class="sel">${esc(c.title)}<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><span class="fcursor" aria-hidden="true"><svg width="16" height="20" viewBox="0 0 16 20"><path d="M1 1v15l4-4 3 7 3-1.4-3-6.6h6z" style="fill:#4338ca;stroke:#fff" stroke-width="1.2"/></svg><b>Yaroslava</b></span></span></h1>
  <p class="case-intro">${esc(c.intro)}</p>
  <dl class="meta">${meta}</dl>
</header>
<figure class="case-hero wrap">
  <figcaption class="pc-label"><span class="mono">${esc(c.heroLabel[0])}</span><span class="mono muted">${esc(c.heroLabel[1] || '')}</span></figcaption>
  <video src="/video/${slug}.mp4" poster="/video/${slug}.jpg" autoplay muted loop playsinline preload="metadata" aria-label="${esc(c.title)} design showreel"></video>
</figure>
<nav class="toc" aria-label="Case contents"><ol>${toc.map((t) => `<li><a href="#${ids[t]}" data-toc-link="${ids[t]}">${t}</a></li>`).join('')}</ol><span class="toc-bar"><i></i></span></nav>
<div class="case wrap">${out.join('\n')}</div>
<a class="next-case" href="/work/${nextSlug}/"><span class="wrap"><span class="mono muted">${esc(c.next[0])}</span><span class="next-t">${esc(next.title)} <span aria-hidden="true">→</span></span></span></a>`,
  });
}

// ---------- write ----------
function write(rel, html) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
fs.rmSync(OUT, { recursive: true, force: true });
copyDir(path.join(ROOT, 'public'), OUT);
fs.copyFileSync(path.join(ROOT, 'src/styles.css'), path.join(OUT, 'styles.css'));
fs.copyFileSync(path.join(ROOT, 'src/main.js'), path.join(OUT, 'main.js'));
write('index.html', home());
write('work/index.html', work());
write('about/index.html', about());
ORDER.forEach((s, i) => write(`work/${s}/index.html`, caseStudy(s, i)));
write('404.html', layout({ page: '404', title: `Not found — ${SITE}`, description: 'Page not found', body: `<section class="page-head wrap"><p class="mono muted">404</p><h1 class="h-xxl">This frame is empty.</h1><p><a class="link-arrow" href="/">Back home <span>→</span></a></p></section>` }));
console.log('built', fs.readdirSync(OUT));
