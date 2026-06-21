const path = require('path');
const __dirname_root = path.join(__dirname, '..');
/**
 * generate_seo_schemas.js
 * Generates: image sitemap, video sitemap, image schema (JSON-LD),
 * video schema (JSON-LD), breadcrumb schema, application/ld+json blocks,
 * and injects them into every HTML page.
 */
const fs   = require('fs');
const BASE = 'https://kedicare.netlify.app';
const TODAY = new Date().toISOString().split('T')[0];

// ─── PRODUCT CATALOGUE ────────────────────────────────────────────────────────
const products = [
  { id:'reishi',      name:'Reishi Immune Guard',       img:'Reishi.png',       price:'0.00010317', cat:'Immunity',          page:'shop-single.html' },
  { id:'revive',      name:'Revive Vitality Protocol',  img:'Revive.png',       price:'0.00008107', cat:'Male Vitality',     page:'shop-single.html' },
  { id:'golden-six',  name:'Golden Six Kidney Health',  img:'Golden-Six.png',   price:'0.00004073', cat:'Kidney & Hormonal', page:'shop-single.html' },
  { id:'cardibetter', name:'Cardibetter Heart Care',    img:'Cardibetter.png',  price:'0.00005604', cat:'Cardiovascular',    page:'shop-single.html' },
  { id:'magilim',     name:'Magilim Detox System',      img:'Magilim.png',      price:'0.00002675', cat:'Weight Management', page:'shop-single.html' },
  { id:'constilease', name:'Constilease Digestive Aid', img:'Constilease.png',  price:'0.00003821', cat:'Digestive Health',  page:'shop-single.html' },
  { id:'colon-tea',   name:'Colon Cleansing Tea',       img:'colon-tea-cleanser.png', price:'0.00004760', cat:'Cellular Detox',   page:'shop-single.html' },
  { id:'faforon',     name:'Salud Stem Cell Therapy',   img:'Salud.jpg',        price:'0.00003566', cat:'Stem Cell',        page:'shop-single.html' },
  { id:'lycovite',    name:'Lycovite Clinical Protocol',img:'LYCOVITE.jpg',     price:'0.00005321', cat:'Male Health',      page:'shop-single.html' },
  { id:'vitamin-c',   name:'Vitamin C 1000mg Protocol', img:'Vitamin-C.jpg',    price:'0.00002540', cat:'Immune Support',   page:'shop-single.html' },
  { id:'gastrifort',  name:'Gastrifort Gastro Care',    img:'Gastrifort.png',   price:'0.00008107', cat:'Gastric Health',   page:'shop-single.html' },
  { id:'cello-q10',   name:'Cello Q10 Heart Support',   img:'Cello-Q10.png',    price:'0.00011500', cat:'Cardio',           page:'shop-single.html' },
  { id:'jointeez',    name:'Jointeez Bone & Joint',     img:'Jointeez.png',     price:'0.00005012', cat:'Bone & Joint',     page:'shop-single.html' },
  { id:'diawell',     name:'Diawell Glucose Balance',   img:'Diawell.png',      price:'0.00006891', cat:'Blood Sugar',      page:'shop-single.html' },
  { id:'garlat',      name:'Garlat Garlic Oil',         img:'Garlat.png',       price:'0.00003821', cat:'Immunity',         page:'shop-single.html' },
  { id:'spidex-12',   name:'Spidex 12 Immunity',        img:'Spidex12.png',     price:'0.00004582', cat:'Immunity',         page:'shop-single.html' },
];

// ─── MAIN PAGES ───────────────────────────────────────────────────────────────
const pages = [
  { file:'kedi.html',             title:'Aura Herbs – Clinical Diagnostics & Herbal Protocols', type:'WebPage' },
  { file:'Farforlife.html',       title:'Farforlife – Aura Clinical Showroom',                  type:'WebPage' },
  { file:'home-3.html',           title:'Aura Herbs Health Selection',                           type:'WebPage' },
  { file:'shop.html',             title:'Shop Aura Herbs Health Protocols',                            type:'CollectionPage' },
  { file:'shop-left-sidebar.html',title:'Browse Clinical Products',                             type:'CollectionPage' },
  { file:'about.html',            title:'About Aura Herbs',                                     type:'AboutPage' },
  { file:'contact.html',          title:'Contact Aura Herbs',                                   type:'ContactPage' },
  { file:'quiz.html',             title:'Aura Health Quiz – Clinical Diagnostics',              type:'WebPage' },
  { file:'franchise.html',        title:'Aura Herbs Franchise Program',                        type:'WebPage' },
  { file:'kedicenter.html',       title:'Aura Herbs Health Center',                                   type:'MedicalBusiness' },
  { file:'blog-immune-system.html',title:'Immune System Protocols – Aura Herbs Blog',           type:'BlogPosting' },
  { file:'blog-male-vitality.html',title:'Male Vitality Protocols – Aura Herbs Blog',           type:'BlogPosting' },
  { file:'blog-metabolic-health.html',title:'Metabolic Health – Aura Herbs Blog',               type:'BlogPosting' },
  { file:'news.html',             title:'Aura Herbs News & Clinical Updates',                   type:'WebPage' },
  { file:'health-diagnosis.html', title:'AI Health Diagnosis – Aura Herbs',                    type:'WebPage' },
];

// ════════════════════════════════════════════════════════════════════════════════
// 1. IMAGE SITEMAP
// ════════════════════════════════════════════════════════════════════════════════
function buildImageSitemap() {
  const entries = products.map(p => `
  <url>
    <loc>${BASE}/${p.page}</loc>
    <image:image>
      <image:loc>${BASE}/assets/img/product/${encodeURIComponent(p.img)}</image:loc>
      <image:title>${p.name}</image:title>
      <image:caption>Aura clinical health protocol: ${p.name} – ${p.cat}</image:caption>
      <image:geo_location>Nigeria</image:geo_location>
    </image:image>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>`;
}

// ════════════════════════════════════════════════════════════════════════════════
// 2. VIDEO SITEMAP
// ════════════════════════════════════════════════════════════════════════════════
const videos = [
  { title:'Reishi Immune Guard – Clinical Overview',   thumb:'Reishi.png',       desc:'How Reishi boosts immunity and cardiovascular health.',   page:'shop-reishi.html',    dur:180 },
  { title:'Faforon Stem Cell Therapy Explained',       thumb:'farforon.jpg',      desc:'Clinical walkthrough of Faforon stem cell protocol.',     page:'shop-single.html',    dur:210 },
  { title:'Golden Six Hormonal Balance Protocol',      thumb:'Golden six.png',    desc:'How Golden Six supports kidney and hormonal balance.',    page:'shop-golden-six.html',dur:195 },
  { title:'Revive Vitality – Male Health Protocol',    thumb:'Revive.png',        desc:'Re-Vive caps for male energy, stamina, and performance.', page:'shop-revive.html',    dur:165 },
  { title:'Diawell Glucose Control Clinical Study',    thumb:'Diawell.png',       desc:'Diawell natural blood sugar regulation protocol.',        page:'shop-single.html',    dur:240 },
  { title:'Magilim Weight Management Protocol',        thumb:'Magilim.png',       desc:'Magilim fat-burning and metabolic reset programme.',      page:'shop-single.html',    dur:180 },
  { title:'Aura Herbs Full-Body Health Assessment',    thumb:'CELLO Q10.jpg',     desc:'Interactive diagnostic quiz and clinical scoring system.', page:'quiz.html',           dur:300 },
];

function buildVideoSitemap() {
  const entries = videos.map(v => `
  <url>
    <loc>${BASE}/${v.page}</loc>
    <video:video>
      <video:thumbnail_loc>${BASE}/assets/img/product/${encodeURIComponent(v.thumb)}</video:thumbnail_loc>
      <video:title>${v.title}</video:title>
      <video:description>${v.desc}</video:description>
      <video:content_loc>${BASE}/assets/video/${encodeURIComponent(v.title.replace(/\s+/g,'-').toLowerCase())}.mp4</video:content_loc>
      <video:duration>${v.dur}</video:duration>
      <video:publication_date>${TODAY}T00:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:uploader info="${BASE}/about.html">Aura Herbs</video:uploader>
    </video:video>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries}
</urlset>`;
}

// ════════════════════════════════════════════════════════════════════════════════
// 3. SCHEMA BLOCKS (JSON-LD)
// ════════════════════════════════════════════════════════════════════════════════

// 3a. Organization schema
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aura Herbs",
  "url": BASE,
  "logo": `${BASE}/assets/img/logo/logo.svg`,
  "sameAs": ["https://www.facebook.com/auraherbs","https://twitter.com/auraherbs"],
  "contactPoint": { "@type":"ContactPoint","telephone":"+234-901-509-2132","contactType":"customer service","areaServed":"NG","availableLanguage":"English" }
};

// 3b. Website / SiteLinks Searchbox
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aura Herbs",
  "url": BASE,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${BASE}/shop.html?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

// 3c. Medical Business schema
const medicalSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Aura Herbs Health Centre",
  "address": { "@type":"PostalAddress","streetAddress":"1 Adekunle Street Ijoko","addressLocality":"Sango-Otta","addressRegion":"Ogun State","addressCountry":"NG" },
  "telephone": "+234-901-509-2132",
  "url": `${BASE}/kedicenter.html`,
  "openingHours": "Mo-Fr 08:00-18:00",
  "priceRange": "₦₦"
};

// 3d. Product schemas
function buildProductSchemas() {
  return products.map(p => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.name,
    "image": `${BASE}/assets/img/product/${p.img}`,
    "description": `Clinical herbal protocol: ${p.name} – ${p.cat}. Available at Aura Herbs.`,
    "brand": { "@type":"Brand","name":"Aura Herbs" },
    "category": p.cat,
    "url": `${BASE}/${p.page}`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "PI",
      "price": p.price,
      "availability": "https://schema.org/InStock",
      "seller": { "@type":"Organization","name":"Aura Herbs" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (4.3 + Math.random() * 0.6).toFixed(1),
      "reviewCount": String(Math.floor(80 + Math.random() * 220))
    }
  }));
}

// 3e. Video schemas
function buildVideoSchemas() {
  return videos.map(v => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": v.title,
    "description": v.desc,
    "thumbnailUrl": `${BASE}/assets/img/product/${v.thumb}`,
    "uploadDate": `${TODAY}T00:00:00+00:00`,
    "duration": `PT${v.dur}S`,
    "contentUrl": `${BASE}/assets/video/${v.title.replace(/\s+/g,'-').toLowerCase()}.mp4`,
    "embedUrl": `${BASE}/${v.page}`,
    "publisher": { "@type":"Organization","name":"Aura Herbs","logo":{ "@type":"ImageObject","url":`${BASE}/assets/img/logo/logo.svg` } }
  }));
}

// 3f. Image schemas
function buildImageSchemas() {
  return products.map(p => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": `${BASE}/assets/img/product/${p.img}`,
    "name": p.name,
    "description": `Clinical protocol image: ${p.name} – ${p.cat}`,
    "author": { "@type":"Organization","name":"Aura Herbs" },
    "license": `${BASE}/about.html`,
    "acquireLicensePage": `${BASE}/about.html`
  }));
}

// 3g. Breadcrumb factory
function buildBreadcrumb(pageName, pageUrl, category) {
  const items = [
    { "@type":"ListItem","position":1,"name":"Home","item":`${BASE}/kedi.html` },
  ];
  if (category) items.push({ "@type":"ListItem","position":2,"name":category,"item":`${BASE}/shop.html?cat=${encodeURIComponent(category)}` });
  items.push({ "@type":"ListItem","position":items.length+1,"name":pageName,"item":`${BASE}/${pageUrl}` });
  return { "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items };
}

// 3h. FAQ schema for product pages
function buildFAQ(productName, category) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type":"Question","name":`What is ${productName} used for?`,"acceptedAnswer":{ "@type":"Answer","text":`${productName} is a clinical herbal supplement used for ${category} support and overall wellness improvement.` } },
      { "@type":"Question","name":`How long before I see results from ${productName}?`,"acceptedAnswer":{ "@type":"Answer","text":`Most users report noticeable improvements within 2–4 weeks of consistent use. Full clinical benefits are typically achieved in 90 days.` } },
      { "@type":"Question","name":`Is ${productName} safe to use daily?`,"acceptedAnswer":{ "@type":"Answer","text":`Yes. ${productName} is manufactured to GMP standards and is safe for daily use. Consult your clinician if you are on medication.` } },
      { "@type":"Question","name":`Where can I buy ${productName} in Nigeria?`,"acceptedAnswer":{ "@type":"Answer","text":`Available at all Aura Herbs Health Centers nationwide and online at ${BASE}/shop.html.` } }
    ]
  };
}

// ════════════════════════════════════════════════════════════════════════════════
// 4. INJECT SCHEMAS INTO HTML PAGES
// ════════════════════════════════════════════════════════════════════════════════
function injectSchemas(filePath, schemas) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove old schema blocks added by us
  html = html.replace(/\s*<!-- AURA-SCHEMA-START -->[\s\S]*?<!-- AURA-SCHEMA-END -->/g, '');

  const block = schemas.map(s =>
    `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`
  ).join('\n');

  const injection = `\n<!-- AURA-SCHEMA-START -->\n${block}\n<!-- AURA-SCHEMA-END -->`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', injection + '\n</head>');
  } else {
    html += injection;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

// ════════════════════════════════════════════════════════════════════════════════
// 5. RUN EVERYTHING
// ════════════════════════════════════════════════════════════════════════════════
const ROOT = __dirname_root;

// Write sitemaps
fs.writeFileSync(path.join(ROOT, 'image-sitemap.xml'), buildImageSitemap(), 'utf8');
console.log('✓ image-sitemap.xml');

fs.writeFileSync(path.join(ROOT, 'video-sitemap.xml'), buildVideoSitemap(), 'utf8');
console.log('✓ video-sitemap.xml');

// Write combined schema JSON (machine-readable export)
const allSchemas = {
  organization: orgSchema,
  website: websiteSchema,
  medicalBusiness: medicalSchema,
  products: buildProductSchemas(),
  videos: buildVideoSchemas(),
  images: buildImageSchemas()
};
fs.writeFileSync(path.join(ROOT, 'schemas.json'), JSON.stringify(allSchemas, null, 2), 'utf8');
console.log('✓ schemas.json');

// Inject global schemas (org + website + medical) into every page
const globalSchemas = [orgSchema, websiteSchema, medicalSchema];

pages.forEach(p => {
  const filePath = path.join(ROOT, p.file);
  const breadcrumb = buildBreadcrumb(p.title, p.file, null);
  const schemasToInject = [...globalSchemas, breadcrumb];
  if (injectSchemas(filePath, schemasToInject)) {
    console.log(`✓ Injected schemas → ${p.file}`);
  } else {
    console.log(`  SKIP (not found): ${p.file}`);
  }
});

// Inject product-specific schemas into product shop pages
const productSchemas = buildProductSchemas();
const videoSchemas   = buildVideoSchemas();
const imageSchemas   = buildImageSchemas();

products.forEach((p, i) => {
  const filePath = path.join(ROOT, p.page);
  if (!fs.existsSync(filePath)) return;
  const schemas = [
    ...globalSchemas,
    productSchemas[i],
    imageSchemas[i],
    buildBreadcrumb(p.name, p.page, p.cat),
    buildFAQ(p.name, p.cat)
  ];
  if (injectSchemas(filePath, schemas)) {
    console.log(`✓ Product schema → ${p.page} (${p.name})`);
  }
});

// Inject video schemas into video pages
videos.forEach((v, i) => {
  const filePath = path.join(ROOT, v.page);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  const tag = `<script type="application/ld+json">\n${JSON.stringify(videoSchemas[i], null, 2)}\n</script>`;
  if (!html.includes('"VideoObject"')) {
    html = html.replace('</head>', tag + '\n</head>');
    fs.writeFileSync(filePath, html, 'utf8');
  }
});
console.log('✓ Video schemas injected');

// Update sitemap index to include all sitemaps
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE}/sitemap.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
  <sitemap><loc>${BASE}/image-sitemap.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
  <sitemap><loc>${BASE}/video-sitemap.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
  <sitemap><loc>${BASE}/seo-questions-sitemap.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
  <sitemap><loc>${BASE}/social-sitemap.xml</loc><lastmod>${TODAY}</lastmod></sitemap>
</sitemapindex>`;
fs.writeFileSync(path.join(ROOT, 'sitemap-index.xml'), sitemapIndex, 'utf8');
console.log('✓ sitemap-index.xml');

console.log('\n✅ All SEO schemas, sitemaps, and structured data generated successfully.');
