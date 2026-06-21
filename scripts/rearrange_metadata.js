const path = require('path');
const __dirname_root = path.join(__dirname, '..');
const fs = require('fs');
const ROOT = __dirname_root;
const BASE_URL = 'https://kedicare.netlify.app';

function rearrangeMetadata(filePath, fileName) {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf8');

    // Extract title
    let title = "Kedi Healthcare | AI Health News, Smart Product Recommendations & Quiz";
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1];

    // Remove old head contents EXCEPT scripts/links (css, tailwind, fonts)
    // We will extract all <meta> and <title> and <link rel="canonical">
    html = html.replace(/<title>[\s\S]*?<\/title>/ig, '');
    html = html.replace(/<meta[^>]+>/ig, '');
    html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/ig, '');

    // The new block
    const canonicalUrl = `${BASE_URL}/${fileName === 'index.html' ? '' : fileName}`;
    
    const newHeadBlock = `
    <!-- PRIMARY METADATA -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="Kedi Healthcare delivers clinical AI-powered health diagnostics, product intelligence, and herbal protocol recommendations across nutrition, vitality, pharma, and wellness.">
    <meta name="keywords" content="Kedi Healthcare, Kedi-J, clinical diagnostics, health intelligence, AI health quiz, herbal wellness products">
    
    <!-- ADVANCED SEO & SEARCH STRATEGY -->
    <meta name="short-tail-keywords" content="health news, AI quiz, wellness products, Kedi health">
    <meta name="long-tail-keywords" content="best clinical herbal supplements in Nigeria, Kedi health products for high blood pressure, AI-powered health product recommendation engine">
    <meta name="search-tags" content="health feed, product recommendations, wellness quiz, medical news">
    <meta name="smart-tags" content="AI health quiz, product upsell, health newspaper, wellness intelligence">
    <meta name="data-keywords" content="health AI, smart upsell, product catalog, wellness news, nutrition insights">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${canonicalUrl}">

    <!-- OPEN GRAPH (SOCIAL MEDIA) -->
    <meta property="og:site_name" content="Kedi Healthcare">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="Kedi Healthcare delivers clinical AI-powered health diagnostics, product intelligence, and herbal protocol recommendations.">
    <meta property="og:image" content="${BASE_URL}/assets/img/logo/logo.svg">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">

    <!-- TWITTER CARDS -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="Kedi Healthcare delivers clinical AI-powered health diagnostics and herbal protocol recommendations.">
    <meta name="twitter:image" content="${BASE_URL}/assets/img/logo/logo.svg">

    <!-- GEO LOCATION (NIGERIA/GLOBAL) -->
    <meta name="geo.region" content="NG">
    <meta name="geo.placename" content="Lagos, Nigeria">
    <meta name="geo.position" content="6.5244;3.3792">
    <meta name="ICBM" content="6.5244, 3.3792">

    <!-- SCHEMA.ORG DATA -->
    <meta name="data-schema" content="NewsArticle, Product, BreadcrumbList, Organization, FAQPage, WebSite">
    `;

    // Inject just after <head>
    html = html.replace(/<head>/i, `<head>\n${newHeadBlock}`);
    
    fs.writeFileSync(filePath, html, 'utf8');
}

const allFiles = fs.readdirSync(ROOT);
let count = 0;
allFiles.forEach(f => {
    if (f.endsWith('.html')) {
        rearrangeMetadata(path.join(ROOT, f), f);
        count++;
    }
});

console.log(`Successfully rearranged and injected organized metadata into ${count} HTML files.`);
