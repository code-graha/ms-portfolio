/**
 * Build: src/index.html + assets/js/data.js  ->  index.html, sitemap.xml, robots.txt, llms.txt, site.webmanifest
 *
 * Everything a search engine or AI crawler needs (profile text, all 58 designs with alt text,
 * services, FAQ, JSON-LD) is written into static HTML, so it is readable without running JavaScript.
 *
 * Run: npm run build   (or: node scripts/build.mjs)
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => { fs.writeFileSync(path.join(ROOT, p), s); console.log('  wrote', p); };

/* ---------- load the same data + templates the browser uses ---------- */
const ctx = vm.createContext({});
vm.runInContext(read('assets/js/data.js'), ctx, { filename: 'data.js' });
vm.runInContext(read('assets/js/templates.js'), ctx, { filename: 'templates.js' });
const { SITE, PROFILE, SERVICES, FAQ, BRANDS, CATS, projects } = ctx.PORTFOLIO;
const TPL = ctx.TPL;
const esc = TPL.esc;

const URL_ = SITE.url.replace(/\/$/, '');
const abs = (p) => URL_ + '/' + encodeURI(p.replace(/^\//, ''));
const OG = abs(SITE.ogImage);
const today = new Date().toISOString().slice(0, 10);
const version = Date.now().toString(36);

/* ---------- missing-file check ---------- */
const missing = projects.flatMap((p) => [p.img, p.thumb, p.thumb2x]).filter((f) => !fs.existsSync(path.join(ROOT, f)));
if (missing.length) {
  console.error('Missing image files (run `npm run images`?):\n  ' + missing.join('\n  '));
  process.exit(1);
}

/* ---------- HTML fragments ---------- */
const SERVICE_STYLES = [
  { box: 'border border-black/10', icon: 'bg-coral-soft text-coral', text: 'text-ink/60' },
  { box: 'bg-ink text-white', icon: 'bg-white/10 text-coral', text: 'text-white/60' },
  { box: 'border border-black/10', icon: 'bg-coral-soft text-coral', text: 'text-ink/60' },
  { box: 'bg-mist', icon: 'bg-white text-coral', text: 'text-ink/60' },
];
const servicesHTML = SERVICES.map((s, i) => {
  const st = SERVICE_STYLES[i % SERVICE_STYLES.length];
  return `<button type="button" data-cat="${esc(s.cat)}" class="service-card flex flex-col rounded-3xl ${st.box} p-7 text-left transition hover:-translate-y-1 hover:shadow-lg">
        <span class="grid h-12 w-12 place-items-center rounded-2xl ${st.icon}" aria-hidden="true"><i class="fa-solid ${s.icon}"></i></span>
        <h3 class="mt-6 text-lg font-bold">${esc(s.name)}</h3>
        <p class="mt-2 text-sm leading-relaxed ${st.text}">${esc(s.text)}</p>
        <span class="mt-5 text-sm font-bold text-coral">See ${esc(s.cat.toLowerCase())} work <i class="fa-solid fa-arrow-right ml-1 text-xs" aria-hidden="true"></i></span>
      </button>`;
}).join('\n      ');

const faqHTML = FAQ.map((f, i) => `<details class="faq-item group py-5"${i === 0 ? ' open' : ''}>
          <summary class="flex cursor-pointer items-start justify-between gap-6">
            <h3 class="text-base font-bold sm:text-lg">${esc(f.q)}</h3>
            <span class="faq-icon mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist text-xs transition group-hover:bg-black/10" aria-hidden="true"><i class="fa-solid fa-plus"></i></span>
          </summary>
          <p class="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink/60">${esc(f.a)}</p>
        </details>`).join('\n        ');

const socials = (dark) => {
  const inner = TPL.socialsHTML(dark);
  return inner ? `<div class="${dark ? 'flex gap-2' : 'ml-1 flex items-center gap-1'}">${inner}</div>` : '';
};
const cvButton = PROFILE.cv
  ? `<a href="${esc(PROFILE.cv)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-mist px-6 py-3.5 text-sm font-bold transition hover:bg-black/10"><i class="fa-regular fa-file-lines" aria-hidden="true"></i> Download CV</a>`
  : '';
const phoneTile = PROFILE.phone
  ? `<div class="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p class="text-xs font-semibold text-white/50">Call or WhatsApp</p>
            <a href="tel:${esc(PROFILE.phone.replace(/\s+/g, ''))}" class="mt-1 inline-block font-bold transition hover:text-coral"><i class="fa-solid fa-phone mr-2 text-xs text-coral" aria-hidden="true"></i>${esc(PROFILE.phone)}</a>
          </div>`
  : '';

const firstPage = projects.filter((p) => !p.x).length;

/* ---------- JSON-LD ---------- */
const sameAs = Object.values(PROFILE.socials).filter(Boolean);
const tools = PROFILE.tools;
const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite', '@id': `${URL_}/#website`, url: `${URL_}/`,
      name: SITE.shortTitle, description: SITE.description, inLanguage: SITE.lang,
      publisher: { '@id': `${URL_}/#person` },
    },
    {
      '@type': 'ProfilePage', '@id': `${URL_}/#webpage`, url: `${URL_}/`,
      name: SITE.title, description: SITE.description, inLanguage: SITE.lang,
      isPartOf: { '@id': `${URL_}/#website` },
      about: { '@id': `${URL_}/#person` }, mainEntity: { '@id': `${URL_}/#person` },
      primaryImageOfPage: { '@id': `${URL_}/#ogimage` },
      dateModified: today,
    },
    {
      '@type': 'ImageObject', '@id': `${URL_}/#ogimage`, url: OG, contentUrl: OG,
      width: 1200, height: 630, caption: SITE.ogImageAlt,
    },
    {
      '@type': 'Person', '@id': `${URL_}/#person`,
      name: PROFILE.name, givenName: PROFILE.givenName, familyName: PROFILE.familyName,
      jobTitle: PROFILE.jobTitle, description: PROFILE.bio, url: `${URL_}/`,
      email: `mailto:${PROFILE.email}`,
      ...(PROFILE.phone ? { telephone: PROFILE.phone } : {}),
      image: PROFILE.photo ? abs(PROFILE.photo) : { '@id': `${URL_}/#ogimage` },
      address: { '@type': 'PostalAddress', addressCountry: PROFILE.countryCode },
      nationality: { '@type': 'Country', name: PROFILE.location },
      hasOccupation: {
        '@type': 'Occupation', name: PROFILE.jobTitle,
        occupationLocation: { '@type': 'Country', name: PROFILE.location },
        skills: [...SERVICES.map((s) => s.name), ...tools].join(', '),
      },
      knowsAbout: [...SERVICES.map((s) => s.name), 'Product mockups', 'Beauty and personal-care branding', 'Pet-care packaging', ...tools],
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@type': 'ProfessionalService', '@id': `${URL_}/#service`,
      name: `${PROFILE.name} — Graphic Design`, description: SITE.description,
      url: `${URL_}/`, email: PROFILE.email, image: OG,
      ...(PROFILE.phone ? { telephone: PROFILE.phone } : {}),
      founder: { '@id': `${URL_}/#person` },
      address: { '@type': 'PostalAddress', addressCountry: PROFILE.countryCode },
      areaServed: { '@type': 'Country', name: PROFILE.location },
      knowsAbout: SERVICES.map((s) => s.name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'Graphic design services',
        itemListElement: SERVICES.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.name, description: s.text, serviceType: s.cat, provider: { '@id': `${URL_}/#person` } },
        })),
      },
    },
    {
      '@type': 'ItemList', '@id': `${URL_}/#portfolio`,
      name: `Portfolio of ${PROFILE.name}`,
      description: `${projects.length} graphic design works for ${Object.keys(BRANDS).length} brands: ${CATS.join(', ')}.`,
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'ImageObject', '@id': `${URL_}/#${p.file.replace(/\.[^.]+$/, '')}`,
          name: p.t, description: p.d, caption: p.alt,
          contentUrl: abs(p.img), thumbnailUrl: abs(p.thumb2x),
          width: p.w, height: p.h,
          encodingFormat: p.img.endsWith('.png') ? 'image/png' : 'image/jpeg',
          genre: p.c, about: { '@type': 'Brand', name: p.b },
          creator: { '@id': `${URL_}/#person` }, creditText: PROFILE.name,
        },
      })),
    },
    // FAQPage schema must match visible content, so it's only included when the FAQ section is shown.
    ...(SITE.showFaq ? [{
      '@type': 'FAQPage', '@id': `${URL_}/#faq`,
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    }] : []),
  ],
};

/* ---------- index.html ---------- */
const tokens = {
  LANG: SITE.lang, TITLE: esc(SITE.title), SHORT_TITLE: esc(SITE.shortTitle), DESCRIPTION: esc(SITE.description),
  URL: URL_, LOCALE: SITE.locale, OG_IMAGE: OG, OG_ALT: esc(SITE.ogImageAlt), THEME_COLOR: SITE.themeColor,
  NAME: esc(PROFILE.name), GIVEN_NAME: esc(PROFILE.givenName), FAMILY_NAME: esc(PROFILE.familyName),
  INITIALS: esc(PROFILE.initials), STATUS: esc(PROFILE.status), BIO: esc(PROFILE.bio), EMAIL: esc(PROFILE.email),
  LOCATION: esc(PROFILE.location), COUNTRY_CODE: PROFILE.countryCode, YEAR: String(new Date().getFullYear()),
  STAT_DESIGNS: String(projects.length), STAT_BRANDS: String(Object.keys(BRANDS).length), STAT_CATS: String(CATS.length),
  AVATAR: TPL.avatarHTML(), TOOLS: TPL.toolsHTML(), CV_BUTTON: cvButton, PHONE_TILE: phoneTile,
  SOCIALS_LIGHT: socials(false), SOCIALS_DARK: socials(true),
  CHIPS: TPL.chipsHTML('all', 0),
  GRID: '\n' + projects.map((p, i) => TPL.cardHTML(p, i, false)).join('\n') + '\n',
  RESULT_COUNT: `Showing ${firstPage} of ${projects.length}`, LOAD_MORE: `Load ${projects.length - firstPage} more`,
  SERVICES: servicesHTML, FAQ: faqHTML,
  LCP_THUMB: projects[0].thumb, LCP_SRCSET: `${projects[0].thumb} 480w, ${projects[0].thumb2x} 960w`,
  CREDIT_NAME: esc(SITE.credit.name), CREDIT_URL: esc(SITE.credit.url),
  VERSION: version,
  JSONLD: JSON.stringify(jsonld).replace(/</g, '\\u003c'),
};

let html = read('src/index.html').replace(/<!--\s*SOURCE TEMPLATE[\s\S]*?-->\n/, '');
// FAQ section + its nav links: keep (just drop the markers) or remove entirely.
html = SITE.showFaq
  ? html.replace(/<!--FAQ:(START|END)-->/g, '')
  : html.replace(/[ \t]*<!-- FAQ \(shown only[^\n]*\n/, '').replace(/[ \t]*<!--FAQ:START-->[\s\S]*?<!--FAQ:END-->\n?/g, '');
html = html.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => {
  if (!(k in tokens)) throw new Error('Unknown template token ' + m);
  return tokens[k];
});
html = html.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Generated by scripts/build.mjs from src/index.html — do not edit directly. -->');

console.log('Building…');
write('index.html', html);

/* ---------- sitemap.xml (with image sitemap entries) ---------- */
const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${URL_}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image><image:loc>${xmlEsc(OG)}</image:loc></image:image>
${projects.map((p) => `    <image:image><image:loc>${xmlEsc(abs(p.img))}</image:loc></image:image>`).join('\n')}
  </url>
</urlset>
`);

/* ---------- robots.txt ---------- */
write('robots.txt', `# ${SITE.shortTitle}
User-agent: *
Allow: /
Disallow: /src/
Disallow: /scripts/
Disallow: /archive/
Disallow: /my-work/
Disallow: /node_modules/

# AI search & answer engines are welcome (generative engine optimisation)
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Bingbot
Allow: /

Sitemap: ${URL_}/sitemap.xml
`);

/* ---------- llms.txt (https://llmstxt.org) ---------- */
const byBrand = Object.keys(BRANDS).map((b) => {
  const items = projects.filter((p) => p.b === b);
  return `### ${b}\n${BRANDS[b]}\n\n` + items.map((p) => `- [${p.t}](${abs(p.img)}): ${p.c}, ${p.w}×${p.h}px`).join('\n');
}).join('\n\n');
write('llms.txt', `# ${PROFILE.name} — ${PROFILE.jobTitle}

> ${SITE.description}

${PROFILE.bio}

## Key facts

- Name: ${PROFILE.name}
- Role: Freelance ${PROFILE.jobTitle.toLowerCase()}
- Based in: ${PROFILE.location}
- Availability: ${PROFILE.status}
- Email: ${PROFILE.email}${PROFILE.phone ? `\n- Phone: ${PROFILE.phone}` : ''}
- Website: ${URL_}/
- Tools: ${PROFILE.tools.join(', ')}
- Clients: ${Object.keys(BRANDS).join(', ')}
- Portfolio size: ${projects.length} designs (${CATS.map((c) => `${projects.filter((p) => p.c === c).length} ${c.toLowerCase()}`).join(', ')})${sameAs.length ? `\n- Profiles: ${sameAs.join(', ')}` : ''}

## Services

${SERVICES.map((s) => `- **${s.name}**: ${s.text}`).join('\n')}

## How to hire

Email ${PROFILE.email} with your product, the formats you need (packaging, banners, social posts or a logo) and your timeline.
Process: 1) share your brief, 2) review concepts and give feedback, 3) receive print-ready and web-ready files.

## FAQ

${FAQ.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Portfolio

${byBrand}

## Optional

- [Sitemap](${URL_}/sitemap.xml)
- Site crafted and managed by [${SITE.credit.name}](${SITE.credit.url})
`);

/* ---------- web app manifest ---------- */
write('site.webmanifest', JSON.stringify({
  name: SITE.shortTitle, short_name: PROFILE.name, description: SITE.description,
  start_url: '/', scope: '/', display: 'browser', lang: SITE.lang,
  background_color: '#ffffff', theme_color: SITE.themeColor,
  icons: [
    { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/assets/img/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n');

console.log('Done.');
