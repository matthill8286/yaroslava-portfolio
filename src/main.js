(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Limassol clock
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Nicosia' });
  const tick = () => $$('[data-clock]').forEach((t) => (t.textContent = fmt.format(new Date())));
  tick(); setInterval(tick, 15000);

  // Mobile menu
  const burger = $('.burger'), menu = $('#menu');
  if (burger && menu) {
    const set = (open) => { burger.setAttribute('aria-expanded', open); menu.hidden = !open; document.body.style.overflow = open ? 'hidden' : ''; };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', (e) => e.key === 'Escape' && set(false));
    addEventListener('resize', () => innerWidth > 767 && set(false));
  }

  // Copy email
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const label = $('[data-copy-label]', b);
    try { await navigator.clipboard.writeText(b.dataset.copy); label.textContent = 'Copied ✓'; }
    catch { location.href = 'mailto:' + b.dataset.copy; return; }
    b.classList.add('done');
    setTimeout(() => { label.textContent = 'Copy'; b.classList.remove('done'); }, 1600);
  }));

  // Rotating word
  const rot = $('.rot-word');
  if (rot && !reduce) {
    const words = rot.dataset.words.split(','); let i = 0;
    setInterval(() => {
      rot.classList.add('out');
      setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 300);
    }, 2400);
  }

  // Project hover preview (desktop)
  const rows = $('[data-rows]');
  if (rows && matchMedia('(hover: hover)').matches) {
    const pv = $('.preview', rows);
    $$('.row', rows).forEach((r) => {
      r.addEventListener('mouseenter', () => { pv.src = r.dataset.preview; rows.classList.add('has-preview'); });
      r.addEventListener('mouseleave', () => rows.classList.remove('has-preview'));
    });
    rows.addEventListener('mousemove', (e) => {
      const b = rows.getBoundingClientRect();
      pv.style.left = (e.clientX - b.left) + 'px'; pv.style.top = (e.clientY - b.top) + 'px';
    });
  }

  // Draggable fact cards (desktop)
  const deck = $('[data-cards]');
  if (deck && matchMedia('(min-width: 768px)').matches) {
    let z = 10;
    $$('.card', deck).forEach((c) => {
      c.addEventListener('pointerdown', (e) => {
        const b = deck.getBoundingClientRect(), cb = c.getBoundingClientRect();
        const ox = e.clientX - cb.left, oy = e.clientY - cb.top;
        c.setPointerCapture(e.pointerId); c.classList.add('drag'); c.style.zIndex = ++z;
        const move = (ev) => {
          const x = Math.max(0, Math.min(b.width - cb.width, ev.clientX - b.left - ox));
          const y = Math.max(0, Math.min(b.height - cb.height, ev.clientY - b.top - oy));
          c.style.left = x + 'px'; c.style.top = y + 'px';
        };
        const up = () => { c.classList.remove('drag'); c.removeEventListener('pointermove', move); };
        c.addEventListener('pointermove', move);
        c.addEventListener('pointerup', up, { once: true });
        c.addEventListener('pointercancel', up, { once: true });
      });
    });
  }

  // Work filters
  const grid = $('[data-grid]');
  if (grid) {
    const btns = $$('[data-filter]');
    const apply = (f) => {
      btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.filter === f));
      $$('.pc', grid).forEach((c) => (c.hidden = !(f === 'All' || c.dataset.cat === f)));
    };
    btns.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
  }

  // Case contents + progress
  const links = $$('[data-toc-link]');
  if (links.length) {
    const bar = $('.toc-bar i'), main = $('.case');
    const secs = links.map((l) => document.getElementById(l.dataset.tocLink));
    const onScroll = () => {
      const r = main.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      bar.style.width = (p * 100).toFixed(1) + '%';
      let cur = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
      links.forEach((l, i) => l.classList.toggle('on', i === cur));
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Reveal on scroll
  if (!reduce && 'IntersectionObserver' in window) {
    const els = $$('.cs, .row, .pc, .persona, .steps li, .lib, .vh li, .facts > div');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal'); io.observe(el); } });
  }
})();
