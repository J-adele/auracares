const fs = require('fs');
const path = require('path');

const BASE_URL = "https://kedicare.netlify.app";
const SITE_NAME = "Aura Herbs";
const TW_HANDLE = "@auraherbs";
const DEFAULT_IMG = "assets/img/product/kedi.jpg";

const PAGES = {
  "index.html": {
    url: `${BASE_URL}/index.html`,
    type: "website",
    title: "Aura Herbs – Clinical Treatment Portal",
    desc: "Access verified medical-grade herbal treatment protocols. Scientifically optimised for maximum therapeutic efficacy by Aura Herbs Global.",
    img: "assets/img/product/kedi.jpg",
    img_alt: "Aura Herbs Clinical Protocol Products"
  },
  "about.html": {
    url: `${BASE_URL}/about.html`,
    type: "website",
    title: "Our Clinical Mission | Aura Herbs",
    desc: "Discover the mission behind Aura Herbs Clinical Global. Bridging ancient herbal wisdom with modern clinical science for lasting health results.",
    img: "assets/img/product/kedi.jpg",
    img_alt: "Aura Herbs Clinical Mission"
  },
  "shop.html": {
    url: `${BASE_URL}/shop.html`,
    type: "website",
    title: "Clinical Protocols Catalog | Aura Herbs",
    desc: "Browse our complete range of medical-grade herbal treatment protocols. Scientifically validated formulas for optimal health and longevity.",
    img: "assets/img/product/kedi_pro_list.jpg",
    img_alt: "Aura Herbs Product Catalog"
  },
  "shop-left-sidebar.html": {
    url: `${BASE_URL}/shop-left-sidebar.html`,
    type: "website",
    title: "Browse Clinical Protocols | Aura Herbs",
    desc: "Filter and explore our full catalog of clinical herbal treatment protocols. Find the right formula for your health goals.",
    img: "assets/img/product/kedi_pro_list.jpg",
    img_alt: "Aura Herbs Protocol Catalog with Filters"
  },
  "shop-single.html": {
    url: `${BASE_URL}/shop-single.html`,
    type: "product",
    title: "Clinical Protocol | Aura Herbs",
    desc: "Detailed clinical information about our medical-grade herbal treatment protocol. Scientifically formulated for proven health outcomes.",
    img: "assets/img/product/kedi.jpg",
    img_alt: "Aura Herbs Clinical Protocol"
  },
  "cart.html": {
    url: `${BASE_URL}/cart.html`,
    type: "website",
    title: "Your Cart | Aura Herbs",
    desc: "Review your selected clinical herbal protocols and proceed to secure checkout. Premium health solutions delivered worldwide.",
    img: "assets/img/product/kedi.jpg",
    img_alt: "Aura Herbs Shopping Cart"
  },
  // Add other pages as needed following the same structure
};

function buildOgBlock(cfg) {
  const absImg = `${BASE_URL}/${cfg.img}`;
  return `
<!-- ===== Social Rich Preview Meta Tags ===== -->
<!-- Open Graph -->
<meta property="og:type" content="${cfg.type}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${cfg.url}">
<meta property="og:title" content="${cfg.title}">
<meta property="og:description" content="${cfg.desc}">
<meta property="og:image" content="${absImg}">
<meta property="og:image:secure_url" content="${absImg}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${cfg.img_alt}">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="${TW_HANDLE}">
<meta name="twitter:creator" content="${TW_HANDLE}">
<meta name="twitter:title" content="${cfg.title}">
<meta name="twitter:description" content="${cfg.desc}">
<meta name="twitter:image" content="${absImg}">
<meta name="twitter:image:alt" content="${cfg.img_alt}">
<!-- Pinterest -->
<meta name="pinterest:description" content="${cfg.desc}">
<meta name="pinterest:media" content="${absImg}">
`;
}

function injectIntoFile(filePath, cfg) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  // Remove any existing OG/Twitter blocks (simple heuristic)
  html = html.replace(/<!-- ===== Social Rich Preview Meta Tags ===== -->[\s\S]*?<!-- Pinterest -->/g, '');
  const ogBlock = buildOgBlock(cfg);
  // Insert after </title> if present, else after <meta name="description">
  const titleClose = html.indexOf('</title>');
  let insertPos = -1;
  if (titleClose !== -1) {
    insertPos = titleClose + '</title>'.length;
  } else {
    const descMeta = html.search(/<meta\s+name=["']description["'][^>]*>/i);
    if (descMeta !== -1) {
      insertPos = descMeta + html.slice(descMeta).match(/>/).index + 1;
    }
  }
  if (insertPos !== -1) {
    html = html.slice(0, insertPos) + ogBlock + html.slice(insertPos);
  } else {
    // fallback: after <head>
    const headIdx = html.search(/<head[^>]*>/i);
    if (headIdx !== -1) {
      const afterHead = html.indexOf('>', headIdx) + 1;
      html = html.slice(0, afterHead) + ogBlock + html.slice(afterHead);
    } else {
      // prepend
      html = ogBlock + html;
    }
  }
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Injected OG tags into ${filePath}`);
}

function main() {
  const root = path.resolve(__dirname);
  for (const [page, cfg] of Object.entries(PAGES)) {
    const filePath = path.join(root, page);
    injectIntoFile(filePath, cfg);
  }
}

main();
