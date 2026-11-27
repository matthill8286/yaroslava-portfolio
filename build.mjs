import crypto from 'node:crypto';
// Static site generator for Yaroslava Dzihim's portfolio. No dependencies.
// node build.mjs  ->  dist/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist');
const cases = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/cases.json'), 'utf8'));
const diagrams = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/diagrams.json'), 'utf8'));

const ORDER = ['harbour', 'strata', 'inner-glow', 'jbc', 'dalitis', 'thallo', 'pcela'];
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Poppins:wght@300;400&family=Pinyon+Script&display=swap">
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
    const kind = { harbour: 'Web app · 2026', strata: 'Product · 2026', 'inner-glow': 'App · 2026', pcela: 'E‑commerce · 2025' }[s] || 'Website · 2026';
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
  <h1 class="hero-title">I design web products<br>and the <span class="rot" aria-live="polite"><span class="rot-word" data-words="systems,flows,details,logic">systems</span><i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><span class="dims mono">480 × 138</span><span class="fcursor fc-drag" aria-hidden="true"><svg width="16" height="20" viewBox="0 0 16 20"><path d="M1 1v15l4-4 3 7 3-1.4-3-6.6h6z" style="fill:#4338ca;stroke:#fff" stroke-width="1.2"/></svg><b>Yaroslava</b></span></span><br>behind them.</h1>
  <div class="comment" role="note"><span class="c-av">YD</span><div><p class="c-h">Yaroslava · just now</p><p>Every project below shows the process, not just the pixels.</p></div></div>
  <span class="you" aria-hidden="true"><svg width="14" height="18" viewBox="0 0 16 20"><path d="M1 1v15l4-4 3 7 3-1.4-3-6.6h6z" style="fill:#8a8a8a;stroke:#fff" stroke-width="1.2"/></svg><b>You</b></span>
  <div class="hero-foot">
    <p class="lead">UI/UX and product designer based in London and Limassol. For 4+ years I have been turning complex flows into clear, usable websites and products — for SaaS, fintech and e‑commerce teams.</p>
    <span class="mono muted">Scroll to explore ↓</span>
  </div>
</section>

<section class="work-list wrap" aria-labelledby="sw">
  <div class="sec-head"><h2 id="sw" class="h-xl">Selected work <sup>(${String(ORDER.length).padStart(2, '0')})</sup></h2><span class="mono muted hide-m">Hover a project to preview ↘</span></div>
  <div class="rows" data-rows>${rows}<img class="preview" alt="" aria-hidden="true"></div>
  <a class="side-work" href="/work/platon-suites/">
    <span class="eyebrow">On the side · Brand &amp; print</span>
    <span class="sw-t">Platon Suites <span class="muted">— a 36-page brochure for a boutique residence in Limassol</span></span>
    <img src="/img/cover-platon-suites.jpg" alt="" loading="lazy">
    <span class="sw-a" aria-hidden="true">↗</span>
  </a>
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
    <ol class="steps">${steps.map(([t, d], i) => `<li><h3><span class="mono muted">${String(i + 1).padStart(2, '0')}</span>${t}</h3><p>${d}</p></li>`).join('')}</ol>
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
  ['harbour', 'Harbour', 'Web app · 2026', 'Product', 'Platform for car importers: every job, live GPS and a buyer portal. 140+ screens, built from scratch.'],
  ['strata', 'Strata', 'Product · 2026', 'Product', 'Site builder and CMS for companies that run many sites: one brand, one set of words, a full audit trail.'],
  ['inner-glow', 'Inner Glow AI', 'App · 2026', 'Product', 'Mental health app with an AI companion. 200+ screens, from research to a design system.'],
  ['jbc', 'JBC Projects', 'Website · 2026', 'Websites', 'Stadium and arena consultancy, London & Cardiff.'],
  ['dalitis', 'Andreas Dalitis & Sons', 'Website · 2026', 'Websites', 'Construction and property developer, Limassol, since 1983.'],
  ['thallo', 'Thallo Building', 'Website · 2026', 'Websites', 'Green office building in Larnaca, 2,068 m².'],
  ['pcela', 'Pcela Flower', 'E‑commerce · 2025', 'E‑commerce', 'Flower delivery in St. Petersburg in 90 minutes.'],
  ['platon-suites', 'Platon Suites', 'Brand & print · 2026', 'Brand & print', '36-page A4 brochure for ten boutique residences in Neapolis, Limassol.'],
  ['property-one', 'Property One', 'Design system · 2024', 'Design systems', '30+ documented components with states and specs for handoff.', true],
  ['offlight', 'Offlight', 'Product', 'Product', 'Platform for creative talent: directory with filters, profiles and multi-step registration.', true],
  ['decaar', 'Decaar', 'E‑commerce · 2026', 'E‑commerce', '25+ page B2B skincare store with a partner area and consultation flow.', true],
  ['kamino', 'KAMINO', 'Website · 2026', 'Websites', 'Premium golf brand with craft-led product pages.', true],
];
function work() {
  const cats = ['All', 'Websites', 'E‑commerce', 'Product', 'Design systems', 'Brand & print'];
  const count = (c) => (c === 'All' ? WORK.length : WORK.filter((w) => w[3] === c).length);
  const card = ([s, t, m, cat, d, soon]) => {
    const inner = `<div class="pc-label"><span class="mono">#&nbsp; ${esc(t)}</span><span class="mono muted">${esc(m)}</span></div>
      <div class="pc-img"><img src="${img('cover-' + s)}" alt="${esc(t)} — cover" loading="lazy">${soon ? `<span class="soon">In progress · shown after release</span>` : ''}</div>
      <div class="pc-title"><h3>${esc(t)}</h3><span class="chip ${soon ? 'chip-muted' : ''}">${soon ? 'Coming soon' : 'Case study'}</span></div>
      <p class="muted">${esc(d)}</p>`;
    return soon
      ? `<article class="pc is-soon" data-cat="${esc(cat)}">${inner}</article>`
      : `<a class="pc" href="/work/${s}/" data-cat="${esc(cat)}">${inner}</a>`;
  };
  return layout({
    page: 'work',
    title: `Work — ${SITE}`,
    description: 'All projects 2022 — 2026: product design, websites, e‑commerce and design systems.',
    body: `
<section class="page-head wrap">
  <p class="mono muted">All projects · 2022 — 2026</p>
  <h1 class="h-xxl">Work <sup>(${WORK.length})</sup></h1>
</section>
<section class="wrap work-grid-wrap">
  <div class="filters" role="toolbar" aria-label="Filter projects">${cats.map((c, i) => `<button class="filter" aria-pressed="${i === 0}" data-filter="${esc(c)}">${c} <span>${count(c)}</span></button>`).join('')}</div>
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
  const c0 = cases[slug], S = c0.sections, D = diagrams[slug];
  const nn = String(idx + 1).padStart(2, '0'), nn2 = String(((idx + 1) % ORDER.length) + 1).padStart(2, '0');
  const c = { ...c0, crumb: `Work / ${nn} — ${c0.title}`, eyebrow: c0.eyebrow.replace(/^CASE \d\d/, 'CASE ' + nn), next: [`NEXT CASE — ${nn2}`, ...(c0.next || []).slice(1)] };
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
  out.push(sec('flow', F.label, `<p class="intro">${esc(F.intro)}</p><div class="diagram">${c.flowImg ? `<div class="flow-scroll"><img class="flow-img" src="${c.flowImg}" alt="${esc(c.title)} user flow" loading="lazy"></div>` : `${flowSVG(D.flowD, 'flow-d')}${flowSVG(D.flowM, 'flow-m')}`}</div>`, 'data-toc="Flow"'));
  // Sitemap
  const M = S['Sitemap'];
  out.push(sec('sitemap', M.label, `<p class="intro">${esc(M.intro)}</p><div class="sitemap"><div class="sm-root">${esc(D.sitemap.root)}</div><ul class="sm-sections" style="--n:${D.sitemap.sections.length}">${D.sitemap.sections.map((s) => `<li><span class="sm-sec">${esc(s.name)}</span>${s.pages.length ? `<ul class="sm-pages">${s.pages.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</li>`).join('')}</ul></div>`));
  // Wireframes
  const Wf = S['Wireframes to UI'];
  out.push(sec('wireframes', Wf.label, `<p class="intro">${esc(Wf.intro)}</p><div class="pair"><figure><figcaption class="mono">#&nbsp; Wireframe</figcaption>${wireSVG(D.wire)}</figure><span class="pair-arrow" aria-hidden="true">→</span><figure><figcaption class="mono">#&nbsp; Final UI</figcaption><img src="${img(slug + '-ui')}" alt="${esc(c.title)} final UI" loading="lazy"></figure></div>`));
  // Solution
  const So = S['Solution'];
  const pinsFor = (k) => So.pinsPct ? So.pinsPct.filter((p) => p[1] === k).map(([n, , x, y]) => `<span class="pin" style="left:${x}%;top:${y}%">${esc(n)}</span>`).join('') : So.pins.filter(([, x]) => (k === 0 ? x < 508 : x >= 508)).map(([n, x, y]) => `<span class="pin" style="left:${(((k ? x - 508 : x) + 15) / 492) * 100}%;top:${((y + 15) / 620) * 100}%">${esc(n)}</span>`).join('');
  out.push(sec('solution', So.label, `<div class="sol-imgs">${['a', 'b'].map((k, i) => `<figure class="sol-img"><img src="${img(slug + '-sol-' + k)}" alt="${esc(c.title)} solution screens ${i + 1}" loading="lazy">${pinsFor(i)}</figure>`).join('')}</div><ol class="notes">${So.notes.map(([n, t, d]) => `<li><span class="pin pin-static">${esc(n)}</span><div><h3>${esc(t)}</h3><p class="muted">${esc(d)}</p></div></li>`).join('')}</ol>`, 'data-toc="Solution"'));
  // Screens
  const Sc = S['Screens'];
  const shots = Sc.shots.map((s, i) => ({ ...s, file: img(`${slug}-shot-${i + 1}`) }));
  const fig = (s, cls) => `<figure class="shot ${cls}"><figcaption class="pc-label"><span class="mono">${esc(s.label[0])}</span>${s.label[1] ? `<span class="mono muted">${esc(s.label[1])}</span>` : ''}</figcaption><img src="${s.file}" alt="${esc(s.label[0].replace('#', '').trim())}" loading="lazy"></figure>`;
  out.push(sec('screens', Sc.label, `<p class="intro">${esc(Sc.intro)}</p><div class="shots">${fig(shots[0], 'wide')}<div class="shots-2">${fig(shots[1], '')}${fig(shots[2], '')}</div>${c.desktopShots ? `<div class="shots-2">${shots.slice(3, 5).map((s) => fig(s, '')).join('')}</div><div class="shots-2">${shots.slice(5, 7).map((s) => fig(s, '')).join('')}</div>` : `<div class="shots-4">${shots.slice(3).map((s) => fig(s, 'mob')).join('')}</div>`}</div>`));
  // Mobile (optional)
  const Mo = S['Mobile'];
  if (Mo) out.push(sec('mobile', Mo.label, `<p class="intro">${esc(Mo.intro)}</p><figure class="shot"><figcaption class="pc-label"><span class="mono">#&nbsp; Owner app · phone</span><span class="mono muted">390 × 844</span></figcaption><img src="${Mo.img}" alt="${esc(c.title)} mobile screens" loading="lazy"></figure>`));
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
  <div class="vframe"><video src="/video/${slug}.mp4" poster="/video/${slug}.jpg" autoplay muted loop playsinline preload="metadata" aria-label="${esc(c.title)} design showreel"></video></div>
</figure>
<nav class="toc" aria-label="Case contents"><ol>${toc.map((t) => `<li><a href="#${ids[t]}" data-toc-link="${ids[t]}">${t}</a></li>`).join('')}</ol><span class="toc-bar"><i></i></span></nav>
<div class="case wrap">${out.join('\n')}</div>
<a class="next-case" href="/work/${nextSlug}/"><span class="wrap"><span class="mono muted">${esc(c.next[0])}</span><span class="next-t">${esc(next.title)} <span aria-hidden="true">→</span></span></span></a>`,
  });
}


// ---------- side project: brand & print ----------
function platon() {
  const out = [];
  const meta = [['CLIENT', 'Platon Properties'], ['ROLE', 'Layout · Art direction · Print prep'], ['FORMAT', 'A4 · 36 pages'], ['TYPE', 'Poppins + Pinyon Script'], ['PRINT', 'CMYK · perfect bound'], ['TOOLS', 'Figma']]
    .map(([k, v]) => `<div><dt class="mono muted">${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  // 01 Brief
  out.push(sec('brief', '01 — BRIEF', `<p class="big">Platon Properties needed one brochure for ten off-plan homes in Neapolis: for sales meetings, for agents, and for buyers who are not in Cyprus yet.</p>
    <dl class="brief-kv"><div><dt class="eyebrow">Audience</dt><dd>Buyers, investors and agents</dd></div><div><dt class="eyebrow">Tone</dt><dd>Calm, premium, close to the sea</dd></div><div><dt class="eyebrow">Used for</dt><dd>Sales meetings, viewings, PDF for agents</dd></div></dl>
    <blockquote class="hmw">How might we let buyers picture living in Platon Suites before the building is finished?</blockquote>`, 'data-toc="Brief"'));
  // 02 Research
  const F = [['Most brochures look the same', 'Renders, bullet points and a price list, with nothing about the area.'], ['Buyers ask about the street first', 'Distance to the sea, schools and shops comes before the floor plan.'], ['Investors need the numbers', 'Areas, verandas, parking and storage, in one clear table.'], ['The building is not finished', 'Renders and interiors have to carry the feeling of the finished home.'], ['Agents share it as a PDF', 'The layout has to work on a phone screen as well as on paper.']];
  out.push(sec('research', '02 — RESEARCH', `<p class="intro">Off-plan buyers buy a picture. I looked at how new homes in Limassol are sold today and at what buyers ask before they reserve.</p><ol class="notes">${F.map(([t, d], i) => `<li><span class="pin pin-static">${i + 1}</span><div><h3>${esc(t)}</h3><p class="muted">${esc(d)}</p></div></li>`).join('')}</ol>`, 'data-toc="Research"'));
  // 03 Concept
  out.push(sec('concept', '03 — CONCEPT', `<p class="big">Home, without settling for less.</p><p class="intro">The moodboard set the tone: warm light, stone and timber, the sea nearby. The first direction tested a photo-led cover before the final, quieter green one.</p>
    <div class="pair"><figure><figcaption class="mono">#&nbsp; Moodboard</figcaption><img src="/img/platon-moodboard.jpg" alt="Platon Suites moodboard" loading="lazy"></figure><span class="pair-arrow" aria-hidden="true">→</span><figure><figcaption class="mono">#&nbsp; First direction</figcaption><img src="/img/platon-first-direction.jpg" alt="Platon Suites first design direction" loading="lazy"></figure></div>`, 'data-toc="Concept"'));
  // 04 Journey
  const stages = ['See', 'Read', 'Visit', 'Compare', 'Reserve'];
  const rows = [['DOING', ['Sees a listing or an advert', 'Gets the brochure from an agent', 'Visits the site and the area', 'Compares plans and prices', 'Reserves a residence']],
    ['THINKING', ['“Is this area right for us?”', '“Can I picture living here?”', '“How far is the sea?”', '“Which unit fits us?”', '“Who is the developer?”']],
    ['PAIN POINT', ['Every project looks alike', 'Renders without context', 'Area facts scattered', 'Plans hard to compare', 'Little about the developer']],
    ['DESIGN RESPONSE', ['A calm, recognisable brand', 'Interiors in warm light', 'Map with walking times', 'One table per residence', 'A page on Platon Properties']]];
  const emo = [60, 80, 50, 85, 35];
  const table = `<div class="jm-table" role="table"><div class="jm-row jm-emo" role="row"><span class="jm-l mono" role="rowheader">EMOTION</span><div class="jm-curve">${emotionSVG(emo)}</div></div><div class="jm-row jm-stage" role="row"><span class="jm-l mono" role="rowheader">STAGE</span>${stages.map((x) => `<span class="jm-c" role="cell">${x}</span>`).join('')}</div>${rows.map(([l, cells]) => `<div class="jm-row${l === 'DESIGN RESPONSE' ? ' jm-resp' : ''}" role="row"><span class="jm-l mono" role="rowheader">${l}</span>${cells.map((x) => `<span class="jm-c" role="cell">${esc(x)}</span>`).join('')}</div>`).join('')}</div>`;
  const cards = `<ol class="jm-cards">${stages.map((st, i) => `<li><h3><span class="mono muted">${String(i + 1).padStart(2, '0')}</span> ${st}</h3>${rows.map(([l, c]) => `<p class="eyebrow">${l}</p><p${l === 'DESIGN RESPONSE' ? ' class="resp"' : ''}>${esc(c[i])}</p>`).join('')}</li>`).join('')}</ol>`;
  out.push(sec('journey', '04 — JOURNEY MAP', `<p class="intro">From an advert to a reserved home: what a buyer does, thinks and struggles with today, and the design decision that answers each step.</p><div class="jm-emo-m">${emotionSVG(emo)}<div class="jm-emo-l">${stages.map((s) => `<span>${s}</span>`).join('')}</div></div>${table}${cards}`));
  // 05 Structure
  const ST = [['Cover', 'Name, place and one line.'], ['Overview', 'Ten residences, and why the scale is small.'], ['Location', 'Neapolis on a map, with walking and driving times.'], ['Amenities and interiors', 'Pool, spa, living rooms and bedrooms in warm light.'], ['Residences by floor', 'A plan and a table for every unit.'], ['Developer and contact', 'Platon Properties, and a QR code to WhatsApp.']];
  out.push(sec('structure', '05 — STRUCTURE', `<p class="big">Thirty-six pages, one story.</p><p class="intro">The area first, then the building, the homes and the people behind them.</p><ol class="notes">${ST.map(([t, d], i) => `<li><span class="pin pin-static">${i + 1}</span><div><h3>${esc(t)}</h3><p class="muted">${esc(d)}</p></div></li>`).join('')}</ol>`, 'data-toc="Structure"'));
  // 06 Design bets
  const H = [['H1', 'Opening with the area, not the building, answers the first question buyers ask.', 'Location questions at viewings', 'High impact'], ['H2', 'A map with walking and driving times replaces a page of claims.', 'Map mentioned in buyer feedback', 'High impact'], ['H3', 'One table per residence makes units easy to compare.', 'Follow-up questions about areas', 'High impact'], ['H4', 'Warm interior renders sell the feeling before the building is finished.', 'Viewings booked after the brochure', 'High impact'], ['H5', 'A calm, consistent system makes a boutique developer look established.', 'Agent feedback', 'Medium impact'], ['H6', 'A layout that reads well as a PDF works for agents on WhatsApp.', 'Brochures sent as PDF', 'Medium impact']];
  out.push(sec('bets', '06 — DESIGN BETS', `<p class="intro">Each layout decision has a reason we can check with the sales team.</p><ol class="hyps">${H.map(([id, t, m, imp]) => `<li><span class="hid">${id}</span><p>${esc(t)}</p><div class="hm"><span class="eyebrow">METRIC</span><span>${esc(m)}</span></div><span class="chip ${/High/.test(imp) ? 'chip-accent' : ''}">${imp}</span></li>`).join('')}</ol>`));
  // 07 Brand system
  const C = [['Platon green', '#14261F'], ['Deep ink', '#0E1A15'], ['Stone', '#C9BCA8'], ['Paper', '#FFFFFF'], ['Warm light', '#B08052'], ['Sand', '#E8DECD']];
  out.push(sec('system', '07 — BRAND SYSTEM', `<p class="big">One green, two typefaces.</p><p class="intro">Deep Platon green and white, with warm photography doing the colour work. Poppins Light for text and spaced capitals, Pinyon Script for one word per page.</p>
    <div class="bsys"><div class="bs-card"><p class="eyebrow">Colour</p>${C.map(([n, h]) => `<div class="sw"><i style="background:${h}"></i><span>${n}</span><code class="muted">${h}</code></div>`).join('')}</div>
    <div class="bs-card"><p class="eyebrow">Type · Poppins + Pinyon Script</p><div class="ty"><b class="ty-caps">HEADLINE</b><span class="mono muted">Caps · light · wide</span></div><div class="ty"><b class="ty-script">this fast.</b><span class="mono muted">Pinyon Script · one word</span></div><div class="ty"><b class="ty-body">Body text</b><span class="mono muted">Poppins Light</span></div><div class="ty"><b class="ty-label">LABEL</b><span class="mono muted">Poppins Regular · caps</span></div></div></div>`, 'data-toc="System"'));
  // 08 Spreads
  const SP = [['Cover', 'Name, place and one line on deep Platon green.'], ['Location', 'Neapolis on a map, with walking and driving times.'], ['Overview', 'Ten residences, and why the scale is kept small.'], ['Residences by floor', 'A plan and a clear table for every unit.'], ['Specification', 'Finishes and amenities, grouped so they scan fast.'], ['Back cover', 'Contacts and a QR code straight to WhatsApp.']];
  out.push(sec('spreads', '08 — SPREADS', `<p class="intro">Six spreads from the final print file.</p><div class="spreads">${SP.map(([t, d], i) => `<figure><img src="/img/platon-spread-${i + 1}.jpg" alt="Platon Suites brochure — ${esc(t)}" loading="lazy"><figcaption><span class="mono muted">${String(i + 1).padStart(2, '0')}</span> <b>${esc(t)}</b> <span class="muted">${esc(d)}</span></figcaption></figure>`).join('')}</div>`, 'data-toc="Spreads"'));
  // 09 Print
  out.push(sec('print', '09 — PRINT', `<p class="big">Made for print.</p><div class="chips-row">${['A4 portrait', '36 pages', 'CMYK · FOGRA39', '3 mm bleed + crop marks', 'Laminated cover', 'Perfect bound · 4.5 mm spine'].map((x) => `<span class="chip">${x}</span>`).join('')}</div>`));
  // 10 Measure
  const MR = [['Location', 'H1', 'Location questions at viewings', 'Fewer'], ['Map', 'H2', 'Map mentioned in feedback', 'Often'], ['Plans', 'H3', 'Follow-ups about areas', 'Fewer'], ['Viewings', 'H4', 'Viewings booked after the brochure', 'More'], ['Sharing', 'H5 · H6', 'Brochures sent as PDF', 'Most leads']];
  const head = ['STAGE', 'BET', 'METRIC', 'TARGET'];
  out.push(sec('measure', '10 — WHAT WE MEASURE', `<p class="intro">Checked with the sales team after the first months of use.</p><div class="mtable" role="table"><div class="mrow mhead" role="row">${head.map((h) => `<span role="columnheader" class="mono">${h}</span>`).join('')}</div>${MR.map((r) => `<div class="mrow" role="row">${r.map((x, i) => `<span role="cell" data-label="${head[i]}">${esc(x)}</span>`).join('')}</div>`).join('')}</div>`));
  // 11 Result
  out.push(sec('result', '11 — RESULT', `<div class="results"><div><h3>Printed and in use</h3><p>A 36-page perfect-bound brochure with a laminated cover, used in sales meetings and viewings.</p></div><div><h3>Also made</h3><p>A screen PDF for agents to send on WhatsApp, and a short video walkthrough of the spreads.</p></div></div>`, 'data-toc="Result"'));

  const toc = ['Brief', 'Research', 'Concept', 'Structure', 'System', 'Spreads', 'Result'];
  const ids = { Brief: 'brief', Research: 'research', Concept: 'concept', Structure: 'structure', System: 'system', Spreads: 'spreads', Result: 'result' };
  return layout({
    page: 'case',
    title: `Platon Suites — Brand & print — ${SITE}`,
    description: 'A 36-page A4 print brochure for Platon Suites, ten boutique residences in Neapolis, Limassol.',
    ogImage: '/img/cover-platon-suites.jpg',
    body: `
<div class="case-bar wrap"><a href="/work/" class="mono">← All work</a><span class="mono muted hide-m">Side project · Brand &amp; print · 2026</span><a href="/work/strata/" class="mono">Next case →</a></div>
<header class="case-head wrap">
  <h1 class="h-xxl"><span class="sel">Platon Suites<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i></span></h1>
  <p class="case-intro">A print brochure that lets buyers picture living in ten homes that are not built yet.</p>
  <dl class="meta">${meta}</dl>
</header>
<figure class="case-hero wrap">
  <figcaption class="pc-label"><span class="mono"># Flip-through</span><span class="mono muted">20 spreads</span></figcaption>
  <div class="vframe"><video src="/video/platon-suites.mp4" poster="/video/platon-suites.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Platon Suites brochure flip-through"></video></div>
</figure>
<nav class="toc" aria-label="Case contents"><ol>${toc.map((t) => `<li><a href="#${ids[t]}" data-toc-link="${ids[t]}">${t}</a></li>`).join('')}</ol><span class="toc-bar"><i></i></span></nav>
<div class="case wrap">${out.join('\n')}</div>
<a class="next-case" href="/work/strata/"><span class="wrap"><span class="mono muted">Back to product work</span><span class="next-t">Strata <span aria-hidden="true">→</span></span></span></a>`,
  });
}

// ---------- write ----------
// Images and videos are cached for a year, so every URL carries a hash of the file:
// when a file changes, its URL changes and browsers fetch the new one.
const _ver = {};
function bust(html) {
  return html.replace(/(["'(])(\/(?:img|video)\/[^"')?\s]+)(?=["')])/g, (m, q, u) => {
    if (!(u in _ver)) {
      const fp = path.join(ROOT, 'public', u);
      _ver[u] = fs.existsSync(fp) ? crypto.createHash('md5').update(fs.readFileSync(fp)).digest('hex').slice(0, 8) : '';
    }
    return _ver[u] ? `${q}${u}?v=${_ver[u]}` : m;
  });
}
function write(rel, html) {
  html = bust(html);
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
write('work/platon-suites/index.html', platon());
write('404.html', layout({ page: '404', title: `Not found — ${SITE}`, description: 'Page not found', body: `<section class="page-head wrap"><p class="mono muted">404</p><h1 class="h-xxl">This frame is empty.</h1><p><a class="link-arrow" href="/">Back home <span>→</span></a></p></section>` }));
console.log('built', fs.readdirSync(OUT));
