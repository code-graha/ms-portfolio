/* =====================================================================
   Page behaviour: navigation, filtering, search, saves, lightbox.
   Cards are pre-rendered into index.html by the build (good for SEO);
   this script only shows/hides them and wires up interactions.
   ===================================================================== */
(function () {
  'use strict';
  const { PROFILE, projects } = window.PORTFOLIO;
  const TPL = window.TPL;
  const $ = (id) => document.getElementById(id);
  const byKey = Object.fromEntries(projects.map((p) => [p.k, p]));

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('opacity-0', 'translate-y-4'), 2000);
  }

  /* ---------- lazy-image fade-in ---------- */
  function revealImages(scope) {
    scope.querySelectorAll('img.lazy-img:not(.is-loaded)').forEach((img) => {
      if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
      else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    });
  }

  /* ---------- copy email ---------- */
  const copyBtn = $('copy-email');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); }
    catch (_) {
      const ta = document.createElement('textarea');
      ta.value = PROFILE.email; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
    }
    const label = copyBtn.querySelector('span');
    label.textContent = 'Copied!';
    setTimeout(() => { label.textContent = 'Copy'; }, 1600);
  });
  $('year').textContent = new Date().getFullYear();

  /* ---------- navigation: active link + mobile menu ---------- */
  const NAV_ON = 'bg-ink text-white', NAV_OFF = 'text-ink/70 hover:bg-mist hover:text-ink';
  function paintNav(cur) {
    document.querySelectorAll('.nav-link').forEach((a) => {
      const on = a.dataset.nav === cur;
      a.className = 'nav-link rounded-full px-4 py-2.5 text-sm font-semibold transition ' + (on ? NAV_ON : NAV_OFF);
      on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.nav-link-m').forEach((a) => {
      const on = a.dataset.nav === cur;
      a.className = 'nav-link-m rounded-2xl px-4 py-3 text-base font-semibold transition ' + (on ? 'bg-mist text-ink' : 'text-ink/70 hover:bg-mist');
    });
  }
  const SPY = [['intro', 'intro'], ['work', 'work-anchor'], ['services', 'services'], ['faq', 'faq'], ['contact', 'contact']]
    .filter(([, id]) => $(id));   // sections can be switched off (e.g. FAQ)
  let spyTick = false;
  function spy() {
    spyTick = false;
    const line = window.innerHeight * 0.35;
    let cur = 'intro';
    for (const [name, id] of SPY) if ($(id).getBoundingClientRect().top <= line) cur = name;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact';
    paintNav(cur);
  }
  window.addEventListener('scroll', () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener('resize', () => { spy(); if (window.innerWidth >= 768) setMenu(false); });

  const menuBtn = $('menu-btn'), menu = $('mobile-menu');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}" aria-hidden="true"></i>`;
  }
  menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!menu.classList.contains('hidden') && !e.target.closest('#header')) setMenu(false); });

  /* ---------- saved designs (localStorage) ---------- */
  const STORE = 'ms-portfolio-saved';
  const saved = new Set((() => { try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch (_) { return []; } })()
    .filter((f) => projects.some((p) => p.file === f)));
  const isSaved = (p) => saved.has(p.file);
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify([...saved])); } catch (_) {} };

  function paintSaveButtons(p) {
    const tpl = document.createElement('template');
    tpl.innerHTML = TPL.saveBtnHTML(p, isSaved(p));
    const fresh = tpl.content.firstElementChild;
    document.querySelectorAll(`[data-save="${p.k}"]`).forEach((b) => {   // update in place: keeps keyboard focus
      b.className = fresh.className; b.innerHTML = fresh.innerHTML;
      b.setAttribute('aria-pressed', fresh.getAttribute('aria-pressed'));
      b.setAttribute('aria-label', fresh.getAttribute('aria-label'));
    });
  }
  function paintModalSave() {
    if (!current) return;
    const on = isSaved(byKey[current]), b = $('modal-save');
    b.innerHTML = `<i class="${on ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>`;
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', on ? 'Remove from saved' : 'Save design');
  }
  function toggleSave(k) {
    const p = byKey[k];
    isSaved(p) ? saved.delete(p.file) : saved.add(p.file);
    persist();
    toast(isSaved(p) ? 'Saved — find it under the ♥ Saved filter' : 'Removed from saved');
    paintSaveButtons(p); paintModalSave(); paintChips();
    if (active === 'saved') render();
  }

  /* ---------- grid: filter / search / load more ---------- */
  const grid = $('grid'), chipsEl = $('filter-chips'), searchInput = $('search-input');
  let active = 'all', query = '', expanded = false, visible = [];

  // Fallback: if the page wasn't built, render cards on the client.
  if (!grid.children.length) grid.innerHTML = projects.map((p, i) => TPL.cardHTML(p, i, false)).join('');
  const cards = Object.fromEntries([...grid.children].map((el) => [el.dataset.key, el]));
  projects.forEach((p) => { if (isSaved(p)) paintSaveButtons(p); });

  function matches() {
    const q = query.trim().toLowerCase();
    return projects.filter((p) =>
      (active === 'all' || (active === 'saved' ? isSaved(p) : p.c === active)) &&
      (!q || (p.t + ' ' + p.c + ' ' + p.b).toLowerCase().includes(q)));
  }

  function render() {
    const all = matches();
    const paged = active === 'all' && !query.trim() && !expanded;   // only the default view is shortened
    visible = paged ? all.filter((p) => !p.x) : all;
    const show = new Set(visible.map((p) => p.k));
    let n = 0;
    projects.forEach((p) => {
      const el = cards[p.k], on = show.has(p.k);
      if (on && el.hidden) {   // replay the entrance animation for newly shown cards
        el.classList.remove('card-in'); void el.offsetWidth;
        el.style.animationDelay = (n++ % 12) * 35 + 'ms';
        el.classList.add('card-in');
      }
      el.hidden = !on;
    });
    revealImages(grid);

    const empty = !visible.length;
    $('empty-state').classList.toggle('hidden', !empty);
    if (empty) {
      const savedView = active === 'saved' && !query.trim();
      $('empty-icon').className = savedView ? 'fa-regular fa-heart' : 'fa-solid fa-magnifying-glass';
      $('empty-title').textContent = savedView ? 'No saved designs yet' : 'No work matches that search';
      $('empty-text').textContent = savedView ? 'Tap the heart on any design to keep it here.' : 'Try another keyword or clear the filters.';
    }
    $('result-count').textContent = visible.length < all.length
      ? `Showing ${visible.length} of ${all.length}` : all.length + (all.length === 1 ? ' design' : ' designs');
    const remaining = all.length - visible.length;
    $('load-more-wrap').classList.toggle('hidden', remaining <= 0);
    $('load-more-label').textContent = `Load ${remaining} more`;
    $('search-clear').classList.toggle('hidden', !query);
    $('search-clear').classList.toggle('grid', !!query);
    $('search-kbd').classList.toggle('lg:block', !query);
  }

  function paintChips() { chipsEl.innerHTML = TPL.chipsHTML(active, saved.size); }

  function scrollToWork() {
    const top = $('work-anchor').getBoundingClientRect().top;
    if (top > 120 || top < -50) $('work-anchor').scrollIntoView();
  }
  function setFilter(f, opts) {
    active = f; paintChips(); render();
    if (opts && opts.scroll) scrollToWork();
  }

  chipsEl.addEventListener('click', (e) => {
    const ch = e.target.closest('.chip'); if (!ch) return;
    setFilter(ch.dataset.filter);
    if ($('work-anchor').getBoundingClientRect().top < -50) scrollToWork();
  });
  searchInput.addEventListener('input', (e) => {
    query = e.target.value; render();
    if ($('work-anchor').getBoundingClientRect().top > window.innerHeight * 0.6) scrollToWork();
  });
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); scrollToWork(); } });
  $('search-clear').addEventListener('click', () => { query = ''; searchInput.value = ''; render(); searchInput.focus(); });

  document.querySelectorAll('.brand-link').forEach((b) => b.addEventListener('click', () => {
    query = b.dataset.brand; searchInput.value = query; setFilter('all', { scroll: true });
  }));
  document.querySelectorAll('.service-card').forEach((b) => b.addEventListener('click', () => {
    query = ''; searchInput.value = ''; setFilter(b.dataset.cat, { scroll: true });
  }));
  $('clear-filters').addEventListener('click', () => { query = ''; searchInput.value = ''; setFilter('all'); });
  $('load-more').addEventListener('click', () => {
    const firstNew = visible.length;
    expanded = true; render();
    const p = visible[firstNew];
    if (p) cards[p.k].querySelector('[data-open]').focus({ preventScroll: true });
  });

  grid.addEventListener('click', (e) => {
    const sb = e.target.closest('.save-btn');
    if (sb) { e.stopPropagation(); toggleSave(sb.dataset.save); return; }
    const card = e.target.closest('.project-card');
    if (card) openModal(card.dataset.key, visible);
  });

  /* ---------- lightbox ---------- */
  const modal = $('modal');
  let current = null, modalList = [], lastFocus = null;
  const isModalOpen = () => !modal.classList.contains('hidden');

  function openModal(k, list) {
    const p = byKey[k];
    if (!isModalOpen()) lastFocus = document.activeElement;
    current = k;
    modalList = (list && list.some((x) => x.k === k)) ? list : projects.filter((x) => x.b === p.b);

    // Wide banners: image on top, details below. Everything else: side by side.
    $('modal-card').className = 'relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white ' + (p.wide ? '' : 'md:grid-cols-5 md:overflow-hidden');
    $('modal-media').className = 'relative flex min-h-[200px] items-center justify-center bg-mist ' + (p.wide ? '' : 'md:col-span-3');
    $('modal-body').className = 'flex flex-col p-6 sm:p-8 ' + (p.wide ? '' : 'md:col-span-2 md:overflow-y-auto');

    // Progressive: show the (cached) 960px thumbnail instantly, swap to the original when it arrives.
    const img = $('modal-img');
    img.className = 'w-full object-contain ' + (p.wide ? '' : 'max-h-[50vh] md:h-full md:max-h-[92vh]');
    img.width = p.w; img.height = p.h;
    img.src = p.thumb2x; img.alt = p.alt;
    const full = new Image();
    full.onload = () => { if (current === k) img.src = p.img; };
    full.src = p.img;

    $('modal-cat').textContent = p.c;
    $('modal-title').textContent = p.t;
    $('modal-client').textContent = 'Client — ' + p.b;
    $('modal-desc').textContent = p.d;
    $('modal-format').textContent = p.c.replace(/s$/, '') + ' · ' + p.w + '×' + p.h + ' px';
    $('modal-open').href = p.img;
    paintModalSave();

    const idx = modalList.findIndex((x) => x.k === k), multi = modalList.length > 1;
    ['modal-prev', 'modal-next', 'modal-pos'].forEach((id) => $(id).classList.toggle('hidden', !multi));
    $('modal-pos').textContent = `${idx + 1} / ${modalList.length}`;

    const more = projects.filter((x) => x.b === p.b && x.k !== k).slice(0, 12);
    $('modal-more-wrap').classList.toggle('hidden', !more.length);
    $('modal-more').innerHTML = more.map((x) =>
      `<button type="button" data-key="${x.k}" class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist outline-none ring-ink/80 transition hover:ring-2 focus-visible:ring-2" aria-label="View ${TPL.esc(x.t)}"><img src="${x.thumb}" alt="" width="64" height="64" loading="lazy" decoding="async" class="h-full w-full object-cover"></button>`
    ).join('');

    if (!isModalOpen()) {
      modal.classList.remove('hidden'); modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      $('modal-close').focus();
    }
    $('modal-card').scrollTop = 0;
  }
  function step(dir) {
    if (modalList.length < 2) return;
    const i = modalList.findIndex((x) => x.k === current);
    openModal(modalList[(i + dir + modalList.length) % modalList.length].k, modalList);
  }
  function closeModal() {
    if (!isModalOpen()) return;
    modal.classList.add('hidden'); modal.classList.remove('flex');
    document.body.style.overflow = '';
    current = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  $('modal-prev').addEventListener('click', () => step(-1));
  $('modal-next').addEventListener('click', () => step(1));
  $('modal-more').addEventListener('click', (e) => { const b = e.target.closest('[data-key]'); if (b) openModal(b.dataset.key, modalList); });
  $('modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  $('modal-save').addEventListener('click', () => { if (current) toggleSave(current); });

  /* ---------- keyboard ---------- */
  document.addEventListener('keydown', (e) => {
    if (isModalOpen()) {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') {   // keep focus inside the dialog
        const f = [...modal.querySelectorAll('button, a[href]')].filter((el) => el.offsetParent !== null);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (e.key === 'Escape') {
      if (!menu.classList.contains('hidden')) { setMenu(false); menuBtn.focus(); }
      else if (document.activeElement === searchInput) searchInput.blur();
      return;
    }
    const el = document.activeElement;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable;
    if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); searchInput.focus(); }
  });

  // Deep link: /#<design-id> opens that design.
  function openFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el && el.classList.contains('project-card')) {
      if (el.hidden) { expanded = true; render(); }
      openModal(el.dataset.key, visible);
    }
  }

  // Expose a tiny API for tests/debugging.
  window.PortfolioApp = { get saved() { return saved; }, get active() { return active; }, isModalOpen, byKey, STORE };

  paintChips(); render(); spy(); openFromHash();
})();
