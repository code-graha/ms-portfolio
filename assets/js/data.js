/* =====================================================================
   PORTFOLIO DATA — the single source of truth for the site.
   After editing this file run:  npm run build
   (re-renders index.html, structured data, sitemap.xml and llms.txt).
   ===================================================================== */
(function (root) {
  'use strict';

  /* ---------- Site / SEO settings ---------- */
  const SITE = {
    url: 'https://mohitsingh.freegraha.in',      // no trailing slash
    title: 'Mohit Singh — Graphic Designer for Packaging, Banners & Social Media | India',
    shortTitle: 'Mohit Singh — Graphic Designer',
    description: 'Mohit Singh is a freelance graphic designer in India creating product packaging, e-commerce banners, social media creatives and logos for beauty, personal-care and pet-care brands.',
    ogImage: '/assets/img/og-image.jpg',
    ogImageAlt: 'Mohit Singh — graphic designer portfolio: packaging, banners and social media design',
    locale: 'en_IN',
    lang: 'en-IN',
    themeColor: '#111111',
    credit: { name: 'WebGraha', url: 'https://webgraha.com' },
    showFaq: false,            // true = show the "Questions, answered" section, its nav links and FAQPage schema
  };

  /* ---------- Personal info (leave '' to hide a field) ---------- */
  const PROFILE = {
    name: 'Mohit Singh',
    givenName: 'Mohit',
    familyName: 'Singh',
    initials: 'ms',
    jobTitle: 'Graphic Designer',
    photo: '',                 // e.g. 'assets/img/mohit.jpg'
    status: 'Available for freelance projects',
    location: 'India',
    countryCode: 'IN',
    bio: 'Freelance graphic designer for beauty, personal-care and pet-care brands. I design product labels and packaging, e-commerce banners, social media campaigns and logos — taking a product from shelf-ready to launch-ready.',
    email: 'mohitdhondial@gmail.com',
    phone: '',                 // e.g. '+91 98xxx xxxxx'
    cv: '',                    // e.g. 'assets/mohit-singh-cv.pdf'
    tools: ['Adobe Photoshop', 'Adobe Premiere Pro', 'Canva', 'AI tools'],
    socials: { behance: '', instagram: '', linkedin: '', dribbble: '' },
  };

  /* ---------- Services (also used for structured data) ---------- */
  const SERVICES = [
    { cat: 'Packaging', name: 'Packaging & label design', icon: 'fa-box-open',
      text: 'Bottle, jar, soap-wrap and pet-care labels with print-ready files and photoreal product mockups.' },
    { cat: 'Web Banners', name: 'E-commerce banner design', icon: 'fa-display',
      text: 'Website hero banners, sale and launch campaigns, sized for Shopify, Amazon and marketplace storefronts.' },
    { cat: 'Social Media', name: 'Social media creatives', icon: 'fa-hashtag',
      text: 'Scroll-stopping product composites, benefit carousels and teaser posts for Instagram and Facebook.' },
    { cat: 'Logo Design', name: 'Logo & brand identity', icon: 'fa-pen-ruler',
      text: 'Logos and wordmarks with the colour, type and usage rules a growing brand needs.' },
  ];

  /* ---------- FAQ (shown on the page + FAQPage schema for answer engines) ---------- */
  const FAQ = [
    { q: 'Who is Mohit Singh?',
      a: 'Mohit Singh is a freelance graphic designer based in India. He designs product packaging, e-commerce banners, social media creatives and logos, mainly for beauty, personal-care and pet-care brands.' },
    { q: 'What design services does Mohit Singh offer?',
      a: 'Four core services: packaging and label design, e-commerce and website banner design, social media creatives for Instagram and Facebook, and logo and brand identity design.' },
    { q: 'Which brands has Mohit Singh designed for?',
      a: 'His portfolio includes work for Medimade Wellness (banners, campaigns and pet-care packaging), Coronation Herbal (skin and body-care packaging), Earthy Secrets (logo and social media campaigns) and Mr. Jerry Pet Grooming (logo).' },
    { q: 'What tools does Mohit Singh use?',
      a: PROFILE.tools.slice(0, -1).join(', ') + ' and ' + PROFILE.tools.slice(-1) + '.' },
    { q: 'How do I hire Mohit Singh for a design project?',
      a: `Email ${PROFILE.email} with your product, the formats you need (packaging, banners, social posts or a logo) and your timeline. He replies with ideas and a quote.` },
    { q: 'What does a project with Mohit Singh look like?',
      a: 'Three steps: you share a brief (product, audience, sizes and deadline), you review first concepts and give feedback, then you receive final print-ready and web-ready files.' },
  ];

  /* ---------- Clients ---------- */
  const BRANDS = {
    'Medimade Wellness': 'Medimade Wellness — a D2C range of botanical hair, skin and pet-care products.',
    'Coronation Herbal': 'Coronation Herbal — herbal skin and body care.',
    'Earthy Secrets':    'Earthy Secrets — a natural body-care brand with the line "Love from Nature".',
    'Mr. Jerry':         'Mr. Jerry — a pet grooming service.',
  };

  const CATS = ['Web Banners', 'Social Media', 'Packaging', 'Logo Design'];
  const CAT_DESC = {
    'Web Banners':  'Website and marketplace banner for the brand\'s e-commerce storefront, built to carry the product, the offer and the brand in one glance.',
    'Social Media': 'Social media creative — product composite and art direction for Instagram and Facebook feeds.',
    'Packaging':    'Label and packaging design, presented as a photoreal product mockup.',
    'Logo Design':  'Logo and wordmark design exploration.',
  };

  /* ---------- Work: [file in projects/, title, category, brand, width, height, hidden-until-"load more"?]
     New image? Put it in projects/, run `python scripts/images.py` for thumbnails, add a row here, run `npm run build`. */
  const WORK = [
    ['medimade-summer-essentials-campaign-banner.jpg', 'Summer Essentials Campaign Banner', 'Web Banners', 'Medimade Wellness', 3001, 601],
    ['earthy-secrets-rose-soothing-body-wash.jpg', 'Rose Soothing Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500],
    ['coronation-herbal-skin-and-body-scrub-bottle.jpg', 'Skin & Body Scrub Bottle', 'Packaging', 'Coronation Herbal', 1800, 2398],
    ['mr-jerry-pet-grooming-logo.png', 'Mr. Jerry Pet Grooming Logo', 'Logo Design', 'Mr. Jerry', 1215, 1215],
    ['medimade-gentle-safe-cat-shampoo.jpg', 'Gentle + Safe Cat Shampoo', 'Packaging', 'Medimade Wellness', 1500, 1500],
    ['earthy-secrets-cool-mint-refreshing-body-wash.jpg', 'Cool Mint Refreshing Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500],
    ['medimade-anti-dandruff-shampoo-banner.jpg', 'Anti-Dandruff Shampoo Banner', 'Web Banners', 'Medimade Wellness', 1920, 688],
    ['coronation-herbal-luxury-soap-range.jpg', 'Luxury Soap Range', 'Packaging', 'Coronation Herbal', 750, 750],
    ['earthy-secrets-logo.jpg', 'Earthy Secrets Logo', 'Logo Design', 'Earthy Secrets', 928, 541],
    ['medimade-summer-essentials-post.jpg', 'Summer Essentials Post', 'Social Media', 'Medimade Wellness', 1500, 1500],
    ['earthy-secrets-apple-cider-vinegar-body-wash.jpg', 'Apple Cider Vinegar Body Wash', 'Social Media', 'Earthy Secrets', 2000, 2000],
    ['medimade-acv-foaming-face-wash-banner.jpg', 'ACV Foaming Face Wash Banner', 'Web Banners', 'Medimade Wellness', 1920, 688],
    ['coronation-herbal-coffee-skin-and-body-scrub.jpg', 'Coffee Skin & Body Scrub', 'Packaging', 'Coronation Herbal', 1800, 2398],
    ['earthy-secrets-lavender-and-mint-calming-body-wash.jpg', 'Lavender & Mint Calming Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500],
    ['medimade-clean-cuddly-germicidal-dog-shampoo.png', 'Clean + Cuddly Germicidal Dog Shampoo', 'Packaging', 'Medimade Wellness', 1714, 1560],
    ['medimade-charcoal-gel-scrub-banner.jpg', 'Charcoal Gel Scrub Banner', 'Web Banners', 'Medimade Wellness', 1920, 688],
    ['earthy-secrets-water-lily-and-mogra-body-wash.jpg', 'Water Lily & Mogra Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500],
    ['coronation-herbal-aloe-vera-foaming-face-wash.jpg', 'Aloe Vera Foaming Face Wash', 'Packaging', 'Coronation Herbal', 750, 750],
    ['mr-jerry-logo-variation.png', 'Mr. Jerry Logo — Variation', 'Logo Design', 'Mr. Jerry', 1518, 1518],
    ['earthy-secrets-honey-and-almond-nourishing-body-wash.jpg', 'Honey & Almond Nourishing Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500],
    ['medimade-coconut-hair-mask-banner.jpg', 'Coconut Hair Mask Banner', 'Web Banners', 'Medimade Wellness', 1920, 688],
    ['medimade-puppy-pamper-conditioning-shampoo.jpg', 'Puppy + Pamper Conditioning Shampoo', 'Packaging', 'Medimade Wellness', 1500, 1500],
    ['earthy-secrets-calming-body-wash-benefits-post.jpg', 'Calming Body Wash — Benefits Post', 'Social Media', 'Earthy Secrets', 1500, 1500],
    ['coronation-herbal-de-tan-cleanser-home-page-banner.jpg', 'De-Tan Cleanser Home Page Banner', 'Web Banners', 'Coronation Herbal', 1500, 750],
    // — revealed by "Load more" —
    ['medimade-biotin-shampoo-banner.jpg', 'Biotin Shampoo Banner', 'Web Banners', 'Medimade Wellness', 1920, 688, 1],
    ['earthy-secrets-tea-tree-and-ginger-body-wash.jpg', 'Tea Tree & Ginger Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['medimade-cat-shampoo-200-ml.png', 'Cat Shampoo — 200 ml', 'Packaging', 'Medimade Wellness', 1714, 1560, 1],
    ['earthy-secrets-logo-concept.jpg', 'Earthy Secrets Logo — Concept', 'Logo Design', 'Earthy Secrets', 540, 540, 1],
    ['medimade-rice-water-hair-mask-banner.jpg', 'Rice Water Hair Mask Banner', 'Web Banners', 'Medimade Wellness', 1920, 688, 1],
    ['earthy-secrets-ubtan-body-wash.jpg', 'Ubtan Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['coronation-herbal-herbal-shampoo.jpg', 'Herbal Shampoo', 'Packaging', 'Coronation Herbal', 750, 751, 1],
    ['medimade-coffee-and-chocolate-body-wash-banner.jpg', 'Coffee & Chocolate Body Wash Banner', 'Web Banners', 'Medimade Wellness', 1920, 688, 1],
    ['earthy-secrets-neem-and-aloe-body-wash.jpg', 'Neem & Aloe Body Wash', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['medimade-puppy-pamper-shampoo-200-ml.png', 'Puppy + Pamper Shampoo — 200 ml', 'Packaging', 'Medimade Wellness', 1714, 1560, 1],
    ['mr-jerry-logo-alternate.png', 'Mr. Jerry Logo — Alternate', 'Logo Design', 'Mr. Jerry', 1218, 1218, 1],
    ['medimade-refer-and-earn-banner.jpg', 'Refer & Earn Banner', 'Web Banners', 'Medimade Wellness', 1920, 688, 1],
    ['earthy-secrets-launch-teaser-coming-soon.jpg', 'Launch Teaser — Coming Soon', 'Social Media', 'Earthy Secrets', 2000, 2000, 1],
    ['coronation-herbal-body-scrub.jpg', 'Body Scrub', 'Packaging', 'Coronation Herbal', 750, 750, 1],
    ['medimade-summer-essentials-post-alt.jpg', 'Summer Essentials Post — Alt', 'Social Media', 'Medimade Wellness', 1500, 1500, 1],
    ['medimade-new-launch-banner.jpg', 'New Launch Banner', 'Web Banners', 'Medimade Wellness', 1920, 520, 1],
    ['earthy-secrets-body-wash-benefits-post-2.jpg', 'Body Wash — Benefits Post 2', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['medimade-gentle-deodorizer-dog-shampoo.png', 'Gentle + Deodorizer Dog Shampoo', 'Packaging', 'Medimade Wellness', 1714, 1560, 1],
    ['earthy-secrets-logo-concept-2.jpg', 'Earthy Secrets Logo — Concept 2', 'Logo Design', 'Earthy Secrets', 540, 540, 1],
    ['medimade-exciting-deals-banner.jpg', 'Exciting Deals Banner', 'Web Banners', 'Medimade Wellness', 1920, 520, 1],
    ['earthy-secrets-rose-body-wash-alt.jpg', 'Rose Body Wash — Alt', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['medimade-summer-essentials-banner-v2.jpg', 'Summer Essentials Banner — V2', 'Web Banners', 'Medimade Wellness', 3000, 600, 1],
    ['earthy-secrets-body-wash-benefits-post-3.jpg', 'Body Wash — Benefits Post 3', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['earthy-secrets-logo-concept-3.jpg', 'Earthy Secrets Logo — Concept 3', 'Logo Design', 'Earthy Secrets', 540, 540, 1],
    ['medimade-coming-soon-banner.jpg', 'Coming Soon Banner', 'Web Banners', 'Medimade Wellness', 1920, 520, 1],
    ['earthy-secrets-apple-cider-vinegar-body-wash-alt.jpg', 'Apple Cider Vinegar Body Wash — Alt', 'Social Media', 'Earthy Secrets', 2000, 2000, 1],
    ['medimade-summer-essentials-banner-v3.jpg', 'Summer Essentials Banner — V3', 'Web Banners', 'Medimade Wellness', 3000, 600, 1],
    ['earthy-secrets-body-wash-benefits-post-4.jpg', 'Body Wash — Benefits Post 4', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['earthy-secrets-logo-concept-4.jpg', 'Earthy Secrets Logo — Concept 4', 'Logo Design', 'Earthy Secrets', 770, 499, 1],
    ['medimade-brand-promise-strip.png', 'Brand Promise Strip', 'Web Banners', 'Medimade Wellness', 1921, 521, 1],
    ['earthy-secrets-honey-and-almond-body-wash-alt.jpg', 'Honey & Almond Body Wash — Alt', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['earthy-secrets-body-wash-benefits-post-5.jpg', 'Body Wash — Benefits Post 5', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
    ['medimade-summer-essentials-banner-v4.jpg', 'Summer Essentials Banner — V4', 'Web Banners', 'Medimade Wellness', 3000, 600, 1],
    ['earthy-secrets-body-wash-benefits-post-6.jpg', 'Body Wash — Benefits Post 6', 'Social Media', 'Earthy Secrets', 1500, 1500, 1],
  ];

  const CAT_NOUN = { 'Web Banners': 'web banner', 'Social Media': 'social media post', 'Packaging': 'packaging', 'Logo Design': 'logo' };
  const PER_PAGE_ALT = (p) => `${p.t} — ${CAT_NOUN[p.c]} design for ${p.b} by ${PROFILE.name}`;

  const projects = WORK.map(([file, t, c, b, w, h, x], i) => {
    const stem = file.replace(/\.[^.]+$/, '');
    const p = {
      k: 'w' + i, file, t, c, b, w, h, x: !!x,
      img: 'projects/' + file,
      thumb: 'projects/thumbs/' + stem + '-480.webp',
      thumb2x: 'projects/thumbs/' + stem + '-960.webp',
      wide: w / h > 2.1,
      d: CAT_DESC[c] + ' ' + BRANDS[b],
    };
    p.alt = PER_PAGE_ALT(p);
    return p;
  });

  root.PORTFOLIO = { SITE, PROFILE, SERVICES, FAQ, BRANDS, CATS, CAT_DESC, projects };
})(typeof window !== 'undefined' ? window : globalThis);
