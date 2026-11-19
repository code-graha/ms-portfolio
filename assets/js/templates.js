/* =====================================================================
   HTML templates shared by the browser (main.js) and the build script
   (scripts/build.mjs pre-renders them into index.html for SEO).
   ===================================================================== */
(function (root) {
  'use strict';
  const { PROFILE, CATS, projects } = root.PORTFOLIO;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const SIZES = '(min-width: 1536px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw';
  const EAGER = 4; // first cards load immediately; everything else is lazy

  function imgAttrs(p, i) {
    return `src="${p.thumb}" srcset="${p.thumb} 480w, ${p.thumb2x} 960w" sizes="${SIZES}" ` +
      (i < EAGER ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') + ' decoding="async"';
  }

  function thumbHTML(p, i) {
    const hover = 'transition duration-500 group-hover:scale-[1.04]';
    // Very wide banners: blurred backdrop + full banner on top, so nothing gets cropped.
    if (p.wide) {
      return `<div class="relative aspect-[2/1] w-full overflow-hidden">
        <img src="${p.thumb}" alt="" aria-hidden="true" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-xl">
        <img ${imgAttrs(p, i)} alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" class="lazy-img relative h-full w-full object-contain ${hover}">
      </div>`;
    }
    return `<img ${imgAttrs(p, i)} alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" style="aspect-ratio:${p.w}/${p.h}" class="lazy-img h-auto w-full object-cover ${hover}">`;
  }

  function saveBtnHTML(p, on) {
    return `<button type="button" data-save="${p.k}" aria-pressed="${on}" aria-label="${on ? 'Remove from saved' : 'Save design'}" class="save-btn pointer-events-none shrink-0 rounded-full px-4 py-2.5 text-xs font-bold text-white transition group-hover:pointer-events-auto group-focus-within:pointer-events-auto ${on ? 'bg-ink hover:bg-black' : 'bg-coral hover:bg-coral-dark'}"><i class="${on ? 'fa-solid' : 'fa-regular'} fa-heart mr-1" aria-hidden="true"></i>${on ? 'Saved' : 'Save'}</button>`;
  }

  function cardHTML(p, i, saved) {
    return `<article id="${p.file.replace(/\.[^.]+$/, '')}" data-key="${p.k}" data-cat="${esc(p.c)}" data-brand="${esc(p.b)}"${p.x ? ' data-more' : ''} class="project-card group mb-3 cursor-pointer break-inside-avoid sm:mb-4"${p.x ? ' hidden' : ''}>
    <figure class="relative overflow-hidden rounded-2xl bg-mist">
      ${thumbHTML(p, i)}
      <button type="button" data-open="${p.k}" class="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-coral" aria-label="View design: ${esc(p.t)}"></button>
      <div class="pointer-events-none absolute inset-0 flex flex-col justify-between bg-black/45 p-3 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <div class="flex items-start justify-between gap-2">
          <span class="truncate rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold">${p.w}×${p.h}</span>
          ${saveBtnHTML(p, !!saved)}
        </div>
        <div class="flex items-center justify-between gap-2">
          <span class="truncate rounded-full bg-white px-3.5 py-2 text-xs font-bold">View design</span>
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs"><i class="fa-solid fa-expand" aria-hidden="true"></i></span>
        </div>
      </div>
    </figure>
    <div class="px-1 pb-1 pt-2.5">
      <h3 class="truncate text-sm font-bold">${esc(p.t)}</h3>
      <p class="mt-0.5 flex items-center gap-1.5 text-xs text-ink/50">
        <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-coral"></span><span class="shrink-0 font-semibold text-ink/70">${esc(p.c)}</span><span>·</span><span class="truncate">${esc(p.b)}</span>
      </p>
    </div>
  </article>`;
  }

  function chipsHTML(active, savedCount) {
    return ['all', ...CATS, 'saved'].map((f) => {
      const on = f === active;
      const n = f === 'all' ? projects.length : f === 'saved' ? savedCount : projects.filter((p) => p.c === f).length;
      const label = f === 'all' ? 'All'
        : f === 'saved' ? `<i class="${savedCount ? 'fa-solid' : 'fa-regular'} fa-heart mr-1 text-coral" aria-hidden="true"></i>Saved`
        : esc(f);
      return `<button type="button" data-filter="${esc(f)}" aria-pressed="${on}" class="chip shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${on ? 'bg-ink text-white' : 'bg-mist text-ink hover:bg-black/10'}">${label} <span class="ml-1 text-xs ${on ? 'text-white/60' : 'text-ink/40'}">${n}</span></button>`;
    }).join('');
  }

  const SOCIAL_ICONS = { behance: 'fa-behance', instagram: 'fa-instagram', linkedin: 'fa-linkedin-in', dribbble: 'fa-dribbble' };
  const SOCIAL_NAMES = { behance: 'Behance', instagram: 'Instagram', linkedin: 'LinkedIn', dribbble: 'Dribbble' };
  function socialsHTML(dark) {
    return Object.entries(PROFILE.socials).filter(([, url]) => url).map(([k, url]) =>
      `<a href="${esc(url)}" target="_blank" rel="noopener me" aria-label="${PROFILE.name} on ${SOCIAL_NAMES[k]}" class="grid h-11 w-11 place-items-center rounded-full transition ${dark ? 'bg-white/10 hover:bg-white/20' : 'text-ink/60 hover:bg-mist hover:text-ink'}"><i class="fa-brands ${SOCIAL_ICONS[k]}" aria-hidden="true"></i></a>`
    ).join('');
  }

  function avatarHTML() {
    return PROFILE.photo
      ? `<img src="${esc(PROFILE.photo)}" alt="${esc(PROFILE.name)}, ${esc(PROFILE.jobTitle)}" width="160" height="160" class="h-full w-full rounded-full object-cover">`
      : `<span class="grid h-full w-full place-items-center rounded-full bg-coral-soft font-serif text-3xl italic text-coral" aria-hidden="true">${esc(PROFILE.initials)}</span>`;
  }

  function toolsHTML() {
    return PROFILE.tools.map((t) => `<li class="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold">${esc(t)}</li>`).join('');
  }

  root.TPL = { esc, cardHTML, saveBtnHTML, chipsHTML, socialsHTML, avatarHTML, toolsHTML };
})(typeof window !== 'undefined' ? window : globalThis);
