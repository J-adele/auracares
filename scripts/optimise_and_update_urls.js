/**
 * KEDI HEALTHCARE — Master Optimiser + URL Updater
 * Replaces all old domain refs with kedicare.netlify.app
 * Injects performance best-practices into every HTML page
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const OLD_DOMAINS = [
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
  'https://kedicare.netlify.app',
];
const NEW_DOMAIN = 'https://kedicare.netlify.app';
const NEW_DOMAIN_BARE = 'kedicare.netlify.app';

// Resource hint block injected into every <head>
const PERF_HINTS = `
    <!-- ⚡ Performance Preconnects -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://wa.me">
    <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com">
    <!-- PWA / SEO -->
    <meta name="theme-color" content="#4d231c">
    <link rel="canonical" href="CANONICAL_URL">`;

// Critical performance CSS appended to kedi-optimise.css injection
const PERF_CSS_INLINE = `
    <style id="kedi-perf-critical">
      /* Critical above-fold paint optimisation */
      img{content-visibility:auto}
      .section-below-fold{content-visibility:auto;contain-intrinsic-size:0 400px}
      *{-webkit-tap-highlight-color:transparent}
      a,button{touch-action:manipulation}
      /* Skeleton shimmer for lazy sections */
      .lazy-section{opacity:0;transform:translateY(20px);transition:opacity .4s ease,transform .4s ease}
      .lazy-section.visible{opacity:1;transform:none}
    </style>`;

// Lazy-load observer snippet injected before </body>
const LAZY_OBSERVER_SCRIPT = `
    <script id="kedi-lazy-observer">
      (function(){
        if(!('IntersectionObserver' in window))return;
        var els=document.querySelectorAll('.section-below-fold,.lazy-section');
        var io=new IntersectionObserver(function(entries){
          entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
        },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
        els.forEach(function(el){io.observe(el);});
      })();
    </script>`;

// Service Worker registration snippet
const SW_REGISTER_SCRIPT = `
    <script id="kedi-sw-register">
      if('serviceWorker' in navigator){
        window.addEventListener('load',function(){
          navigator.serviceWorker.register('/service-worker.js').catch(function(){});
        });
      }
    </script>`;

// ── Helper: collect all HTML files recursively ──────────────────
function getAllHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    // Skip node_modules, .git, .netlify
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.netlify'].includes(f)) return;
      getAllHtmlFiles(full, files);
    } else if (f.endsWith('.html')) {
      files.push(full);
    }
  });
  return files;
}

// ── Helper: replace all old URLs with new domain ────────────────
function replaceUrls(html) {
  OLD_DOMAINS.forEach(old => {
    // Replace full URL forms first
    const escapedFull = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(escapedFull, 'g'), NEW_DOMAIN);
  });
  // Fix any double-replaced https://kedicare.netlify.app → no double slash
  html = html.replace(/https:\/\/kedicare\.netlify\.app\/\//g, 'https://kedicare.netlify.app/');
  return html;
}

// ── Helper: add loading="lazy" to below-fold images ─────────────
function lazyLoadImages(html) {
  // Add lazy to img tags that do NOT have fetchpriority="high" or loading already set
  html = html.replace(/<img(?![^>]*loading=)(?![^>]*fetchpriority="high")([^>]*?)>/g,
    (match, attrs) => {
      // Don't lazy-load tiny tracking pixels or avatars < 10px
      if (/width=["']?\d{1,2}["']?/.test(attrs) && !/width=["']?[1-9]\d{2,}/.test(attrs)) return match;
      return `<img loading="lazy"${attrs}>`;
    });
  return html;
}

// ── Helper: inject preconnects + canonical ───────────────────────
function injectPerfHints(html, filePath) {
  if (html.includes('rel="preconnect"') && html.includes('kedi-perf-critical')) return html;

  // Derive canonical URL from file path
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const canonical = `${NEW_DOMAIN}/${relPath}`;
  const hints = PERF_HINTS.replace('CANONICAL_URL', canonical);

  // Inject after <meta charset...> line if found, otherwise before </head>
  if (html.includes('<meta charset')) {
    html = html.replace(/(<meta charset[^>]+>)/i, `$1${hints}`);
  } else {
    html = html.replace('</head>', `${hints}\n</head>`);
  }

  // Inject critical perf CSS before </head>
  if (!html.includes('kedi-perf-critical')) {
    html = html.replace('</head>', `${PERF_CSS_INLINE}\n</head>`);
  }

  return html;
}

// ── Helper: inject lazy observer + SW registration before </body>
function injectBodyScripts(html) {
  if (!html.includes('kedi-lazy-observer')) {
    html = html.replace('</body>', `${LAZY_OBSERVER_SCRIPT}\n</body>`);
  }
  if (!html.includes('kedi-sw-register')) {
    html = html.replace('</body>', `${SW_REGISTER_SCRIPT}\n</body>`);
  }
  return html;
}

// ── Helper: add defer to non-critical scripts ────────────────────
function deferScripts(html) {
  // Add defer to script tags that don't have async/defer and are not inline
  html = html.replace(/<script(?![^>]*\bdefer\b)(?![^>]*\basync\b)(?![^>]*\btype=["']module["'])([^>]+src=["'][^"']+["'][^>]*)>/g,
    (match, attrs) => {
      // Skip jQuery, Bootstrap, critical libs that must be sync
      if (/jquery|bootstrap\.bundle|slick\.js|swiper\.min/i.test(attrs)) return match;
      return `<script defer${attrs}>`;
    });
  return html;
}

// ── Helper: update og:url and twitter:url meta ───────────────────
function updateOgUrl(html, canonical) {
  html = html.replace(/<meta property="og:url" content="[^"]*"/g,
    `<meta property="og:url" content="${canonical}"`);
  return html;
}

// ── Helper: update sitemaps & JSON files ─────────────────────────
function updateTextFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;
  OLD_DOMAINS.forEach(old => {
    const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(escaped, 'g'), NEW_DOMAIN);
  });
  if (content !== before) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// ── Main: update all JS / JSON / XML / txt files ─────────────────
const TEXT_EXTENSIONS = ['.js', '.json', '.xml', '.txt', '.toml', '.md'];
function updateAllTextFiles(dir) {
  let count = 0;
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.netlify', 'seo-q'].includes(f)) return;
      count += updateAllTextFiles(full);
    } else if (TEXT_EXTENSIONS.includes(path.extname(f).toLowerCase())) {
      if (updateTextFile(full)) count++;
    }
  });
  return count;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════
console.log('\n🚀 Kedi Healthcare — Master Optimiser + URL Updater');
console.log('════════════════════════════════════════════════════\n');

// 1. Update all non-HTML text files (JS, JSON, XML, TXT, etc.)
console.log('1️⃣  Updating URLs in JS / JSON / XML / config files...');
const textCount = updateAllTextFiles(ROOT);
console.log(`   ✅ Updated ${textCount} text/config files.\n`);

// 2. Update service-worker.js cache name to match new domain
const swPath = path.join(ROOT, 'service-worker.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf8');
  sw = sw.replace(/CACHE_NAME\s*=\s*['"][^'"]+['"]/,
    `CACHE_NAME = 'kedicare-v2'`);
  sw = replaceUrls(sw);
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log('   ✅ Updated service-worker.js cache name.\n');
}

// 3. Process every HTML file
console.log('2️⃣  Optimising HTML pages...');
const htmlFiles = getAllHtmlFiles(ROOT);
let htmlCount = 0;
let skipCount = 0;

htmlFiles.forEach(filePath => {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const before = html;

  // a) Replace all old URLs
  html = replaceUrls(html);

  // b) Inject performance hints + canonical
  html = injectPerfHints(html, filePath);

  // c) Lazy-load below-fold images
  html = lazyLoadImages(html);

  // d) Defer non-critical scripts
  html = deferScripts(html);

  // e) Inject lazy observer + SW registration
  html = injectBodyScripts(html);

  // f) Update og:url
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const canonical = `${NEW_DOMAIN}/${relPath}`;
  html = updateOgUrl(html, canonical);

  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf8');
    htmlCount++;
    const shortPath = relPath.length > 55 ? '...' + relPath.slice(-52) : relPath;
    console.log(`   ✅ ${shortPath}`);
  } else {
    skipCount++;
  }
});

// 4. Update sitemaps specifically (root-level XMLs)
console.log('\n3️⃣  Updating sitemaps...');
['sitemap.xml', 'sitemap-index.xml', 'seo-questions-sitemap.xml',
 'image-sitemap.xml', 'video-sitemap.xml', 'social-sitemap.xml',
 'promo-sitemap.xml'].forEach(f => {
  const fp = path.join(ROOT, f);
  if (fs.existsSync(fp) && updateTextFile(fp)) {
    console.log(`   ✅ ${f}`);
  }
});

// 5. Update llms.txt and robots.txt
console.log('\n4️⃣  Updating robots.txt and llms.txt...');
['robots.txt', 'llms.txt'].forEach(f => {
  const fp = path.join(ROOT, f);
  if (fs.existsSync(fp) && updateTextFile(fp)) {
    console.log(`   ✅ ${f}`);
  }
});

// 6. Summary
console.log('\n════════════════════════════════════════════════════');
console.log(`🎉 Done!`);
console.log(`   HTML pages optimised : ${htmlCount}`);
console.log(`   HTML pages unchanged : ${skipCount}`);
console.log(`   Text/config updated  : ${textCount}`);
console.log(`   New domain           : ${NEW_DOMAIN}`);
console.log('════════════════════════════════════════════════════\n');
