const path = require('path');
const __dirname_root = path.join(__dirname, '..');
/**
 * generate_advanced_seo.js
 * Generates advanced SEO structures for:
 * - Long & Short Tail Keywords
 * - "People Also Ask" (FAQPage Schema)
 * - Trending / Search Engine Suggestions
 * - Google/Bing Search Schema (Sitelinks Searchbox)
 */
const fs = require('fs');
const BASE = 'https://www.auraherbs.netlify.app';

const shortTailKeywords = ["Aura Herbs", "Clinical Diagnostics", "Herbal Medicine", "Health Supplements"];
const longTailKeywords = [
  "best clinical herbal supplements in Nigeria",
  "Aura Herbs products for high blood pressure",
  "AI driven health diagnosis online",
  "where to buy Reishi and Revive capsules",
  "Aura Herbs clinical protocols and products"
];

// People Also Ask (PAA)
const paaData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Aura Herbs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aura Herbs provides high-quality clinical herbal medicine, diagnostic health quizzes, and wellness protocols globally."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI health quiz work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI health quiz analyzes your responses to recommend specific clinical protocols and smart product pairings for your wellbeing."
      }
    },
    {
      "@type": "Question",
      "name": "Are Aura Herbs products safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Aura Herbs protocols utilize products manufactured under strict GMP clinical guidelines and are widely used for comprehensive health support."
      }
    }
  ]
};

// Google/Bing Search Schema & Trending Suggestions
const searchSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aura Herbs",
  "url": BASE,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE}/shop.html?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  "keywords": [...shortTailKeywords, ...longTailKeywords].join(', ')
};

const trendingSuggestions = [
  "Aura Herbs Revive benefits",
  "Diawell for blood sugar",
  "Aura Herbs Golden Six",
  "Immune system protocols"
];

function injectAdvancedSeo(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove existing advanced SEO block
  html = html.replace(/\s*<!-- ADVANCED-SEO-START -->[\s\S]*?<!-- ADVANCED-SEO-END -->/g, '');

  const block = `
<!-- ADVANCED-SEO-START -->
<meta name="keywords" content="${[...shortTailKeywords, ...longTailKeywords, ...trendingSuggestions].join(', ')}">
<script type="application/ld+json">
${JSON.stringify(searchSchema, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(paaData, null, 2)}
</script>
<!-- ADVANCED-SEO-END -->
`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', block + '</head>');
  } else {
    html += block;
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

const ROOT = __dirname_root;
const targetPages = ['index.html', 'blog.html', 'quiz.html', 'kedi.html', 'home-3.html', 'Farforlife.html'];

targetPages.forEach(page => {
  const filePath = path.join(ROOT, page);
  if (injectAdvancedSeo(filePath)) {
    console.log(`✓ Injected advanced SEO into ${page}`);
  } else {
    console.log(`  SKIP (not found): ${page}`);
  }
});

console.log('✅ Advanced SEO generation complete.');
