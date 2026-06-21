const path = require('path');
const fs = require('fs');

// 1. Create Promo Sitemap
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://kedicare.netlify.app/kedi.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://kedicare.netlify.app/assets/img/promo/kedi-2026-award.jpg</image:loc>
      <image:title>KEDI 2026 Perform and Win Award</image:title>
      <image:caption>Register and upgrade to Three Star Consultant to win amazing prizes!</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://kedicare.netlify.app/assets/img/promo/kedi-promo-2.jpg</image:loc>
      <image:title>KEDI 2026 Perform and Win Award - Placement Details</image:title>
      <image:caption>Win TVs, Refrigerators, Air Conditioners, and more!</image:caption>
    </image:image>
  </url>
</urlset>`;

fs.writeFileSync('promo-sitemap.xml', sitemapXml, 'utf8');
console.log('Created promo-sitemap.xml');


// 2. Create Schema (SaleEvent)
const promoSchema = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SaleEvent",
  "name": "KEDI 2026 Perform and Win Award",
  "description": "Register and upgrade to Three Star Consultant to win amazing prizes including TVs, Refrigerators, Air Conditioners and more! Plus Instant Upgrade Awards.",
  "image": [
    "https://kedicare.netlify.app/assets/img/promo/kedi-2026-award.jpg",
    "https://kedicare.netlify.app/assets/img/promo/kedi-promo-2.jpg"
  ],
  "startDate": "2026-03-10T00:00:00+01:00",
  "endDate": "2026-05-31T23:59:59+01:00",
  "location": {
    "@type": "Place",
    "name": "Kedi Healthcare (Kedi-J) - Kedi Healthcare Clinical Centers",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG"
    }
  },
  "offers": {
    "@type": "Offer",
    "url": "https://kedicare.netlify.app/kedi.html",
    "price": "0",
    "priceCurrency": "NGN",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-03-10T00:00:00+01:00",
    "validThrough": "2026-05-31T23:59:59+01:00"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Kedi Healthcare",
    "url": "https://kedicare.netlify.app"
  }
}
</script>
`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    
    if (html.includes('"@type": "SaleEvent"')) {
        return; // Schema already exists
    }
    
    if (html.includes('<!-- AURA-SCHEMA-END -->')) {
        // Inject before the end of schema block
        html = html.replace('<!-- AURA-SCHEMA-END -->', promoSchema.trim() + '\n<!-- AURA-SCHEMA-END -->');
        fs.writeFileSync(file, html, 'utf8');
        console.log('Injected SaleEvent Schema into ' + file);
    } else if (html.includes('</head>')) {
        // Fallback
        html = html.replace('</head>', promoSchema.trim() + '\n</head>');
        fs.writeFileSync(file, html, 'utf8');
        console.log('Injected SaleEvent Schema (fallback) into ' + file);
    }
});
