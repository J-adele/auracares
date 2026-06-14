const path = require('path');
const fs = require('fs');
const bank = JSON.parse(fs.readFileSync('assets/js/question-bank.json', 'utf8'));

if (!fs.existsSync('seo-q')) fs.mkdirSync('seo-q');

// Generate first 500 SEO pages (one per unique question slug)
let count = 0;
for (const q of bank.questions.slice(0, 500)) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${q.question} | Aura Herbs Clinical Q&A</title>
<meta name="description" content="${q.question} Learn about ${q.topic} symptoms, risk levels, and the best Aura clinical protocol for treatment.">
<meta property="og:title" content="${q.question}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Aura Herbs">
<meta name="robots" content="index, follow">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"${q.question}","acceptedAnswer":{"@type":"Answer","text":"${q.topic} is a key clinical indicator in the ${q.categoryLabel} category. Risk level: ${q.riskLevel}. The recommended Aura clinical protocol is ${q.product}."}}]}
</script>
<style>
body{font-family:Outfit,sans-serif;background:#05070A;color:white;max-width:800px;margin:0 auto;padding:40px 24px;}
a{color:#10B981;text-decoration:none;}.chip{display:inline-block;padding:8px 16px;border-radius:100px;background:rgba(16,185,129,0.1);color:#10B981;font-size:12px;font-weight:700;margin:4px;border:1px solid rgba(16,185,129,0.2);}
.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:24px;margin:20px 0;}
</style>
</head>
<body>
<a href="../ai-doctor.html" style="display:inline-block;margin-bottom:32px;font-size:13px;font-weight:700;">← Back to AI Doctor</a>
<span class="chip">${q.categoryLabel}</span>
<span class="chip" style="background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.2);">${q.riskLevel}</span>
<h1 style="font-size:clamp(22px,4vw,36px);font-weight:900;margin:20px 0;line-height:1.3;">${q.question}</h1>
<div class="card">
  <p style="color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;margin-bottom:12px;">Clinical Context</p>
  <p style="line-height:1.8;color:#d1d5db;">${q.topic} is a significant clinical indicator within the <strong style="color:white;">${q.categoryLabel}</strong> diagnostic pathway. This question carries a clinical weight of <strong style="color:#10B981;">${q.weight} point${q.weight>1?'s':''}</strong> in our disease-based scoring system.</p>
</div>
<div class="card">
  <p style="color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;margin-bottom:12px;">Answer Options</p>
  <div>${q.options.map(o=>`<span class="chip" style="background:rgba(255,255,255,0.05);color:#d1d5db;border-color:rgba(255,255,255,0.1);">${o}</span>`).join('')}</div>
</div>
<div class="card" style="border-color:rgba(16,185,129,0.2);">
  <p style="color:#10B981;font-size:12px;font-weight:700;text-transform:uppercase;margin-bottom:12px;">Recommended Protocol</p>
  <p style="color:#d1d5db;">Based on your response to this question, the Aura clinical protocol <strong style="color:white;text-transform:capitalize;">${q.product?.replace(/-/g,' ')}</strong> may be recommended as part of your personalized health plan.</p>
  <a href="../product-template.html?id=${q.product}" style="display:inline-block;margin-top:16px;background:#10B981;color:white;padding:12px 24px;border-radius:50px;font-weight:800;font-size:14px;">View ${q.product?.replace(/-/g,' ')} Protocol →</a>
</div>
<div style="margin-top:40px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.05);">
  <h2 style="font-size:18px;font-weight:900;margin-bottom:16px;">Take the Full Diagnostic</h2>
  <p style="color:#9ca3af;margin-bottom:20px;">This question is part of our AI-powered ${q.categoryLabel} assessment with ${bank.categories.find(c=>c.key===q.category)?.count||0}+ questions.</p>
  <a href="../ai-doctor.html" style="display:inline-block;background:#10B981;color:white;padding:14px 28px;border-radius:16px;font-weight:800;">Start Free AI Diagnosis →</a>
</div>
</body>
</html>`;
  fs.writeFileSync(`seo-q/${q.seoSlug}.html`, html, 'utf8');
  count++;
}

// Generate sitemap for SEO pages
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${bank.questions.slice(0,500).map(q=>`  <url><loc>https://www.auraherbs.netlify.app/seo-q/${q.seoSlug}.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync('seo-questions-sitemap.xml', sitemap, 'utf8');

console.log(`Created ${count} SEO question pages in /seo-q/`);
console.log('SEO sitemap: seo-questions-sitemap.xml');
