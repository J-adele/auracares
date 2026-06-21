const fs = require('fs');
const path = require('path');

// Global override for fs.writeFileSync to handle Windows EBUSY locks
const originalWriteFileSync = fs.writeFileSync;
fs.writeFileSync = function(filePath, content, options) {
  for (let i = 0; i < 10; i++) {
    try {
      return originalWriteFileSync(filePath, content, options);
    } catch (err) {
      if ((err.code === 'EBUSY' || err.code === 'EPERM') && i < 9) {
        // Synchronous sleep for 200ms
        const start = Date.now();
        while (Date.now() - start < 200) {}
      } else {
        throw err;
      }
    }
  }
};

const rootDir = path.resolve(__dirname, '..');
const packageDir = path.join(rootDir, 'health-seo-package');

console.log('🚀 Starting Health SEO Package generation...');

// Helper: Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. Create Directories
const subDirs = [
  'faq',
  'content/disease-guides',
  'content/symptom-guides',
  'content/treatment-guides',
  'content/prevention-guides',
  'keywords',
  'ai-search/schema-markup',
  'sitemap',
  'metadata',
  'deployment'
];

ensureDir(packageDir);
subDirs.forEach(sub => ensureDir(path.join(packageDir, sub)));
console.log('✓ Directories initialized.');

// 2. Parse llms.txt FAQs
const llmsPath = path.join(rootDir, 'llms.txt');
if (!fs.existsSync(llmsPath)) {
  console.error('❌ Error: llms.txt not found in root.');
  process.exit(1);
}

const llmsContent = fs.readFileSync(llmsPath, 'utf8');

// Find Frequently Asked Questions section
const faqIndex = llmsContent.indexOf('## Frequently Asked Questions');
const faqSection = faqIndex !== -1 ? llmsContent.substring(faqIndex) : '';

// Split blocks by double newline
const blocks = faqSection.split(/\r?\n\r?\n/);
const faqs = [];
const diseaseFaqs = {};

blocks.forEach(block => {
  const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  let question = '';
  let answer = '';
  let paa = '';
  let pasf = '';

  lines.forEach(line => {
    if (line.match(/^Q\d+:/)) {
      question = line.replace(/^Q\d+:\s*/, '');
    } else if (line.match(/^A\d+:/)) {
      answer = line.replace(/^A\d+:\s*/, '');
    } else if (line.startsWith('People Also Ask:')) {
      paa = line.replace(/^People Also Ask:\s*/, '');
    } else if (line.startsWith('People Also Search For:')) {
      pasf = line.replace(/^People Also Search For:\s*/, '');
    }
  });

  if (question && answer) {
    const faqObj = { question, answer, paa, pasf };
    faqs.push(faqObj);

    // Group by condition
    let condition = 'general';
    if (pasf) {
      const firstTerm = pasf.split(',')[0].trim();
      condition = firstTerm
        .replace(/\s+(symptoms|treatment|prevention|management|causes|prevention.*|approach.*)$/i, '')
        .trim();
    }
    condition = condition.toLowerCase().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-');
    if (!diseaseFaqs[condition]) {
      diseaseFaqs[condition] = [];
    }
    diseaseFaqs[condition].push(faqObj);
  }
});

// CSV Helper
function escapeCSV(field) {
  if (!field) return '""';
  const escaped = field.replace(/"/g, '""');
  return `"${escaped}"`;
}

// Write FAQ CSVs
console.log(`✓ Parsed ${faqs.length} FAQs. Writing condition-specific CSV files...`);
Object.keys(diseaseFaqs).forEach(condition => {
  const csvPath = path.join(packageDir, 'faq', `${condition}.csv`);
  const rows = ['"Question","Answer","People Also Ask","People Also Search For"'];
  diseaseFaqs[condition].forEach(f => {
    rows.push(`${escapeCSV(f.question)},${escapeCSV(f.answer)},${escapeCSV(f.paa)},${escapeCSV(f.pasf)}`);
  });
  fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');
});
console.log(`✓ FAQ CSVs written to health-seo-package/faq/ (${Object.keys(diseaseFaqs).length} conditions).`);

// 3. Split content/ files from health/
const healthDir = path.join(rootDir, 'health');
if (!fs.existsSync(healthDir)) {
  console.error('❌ Error: health/ directory not found.');
  process.exit(1);
}

const healthFiles = fs.readdirSync(healthDir).filter(f => f.endsWith('.md'));
console.log(`✓ Found ${healthFiles.length} markdown articles in health/. Processing splits...`);

const medicalKb = [];
const symptomsList = [];
const protocolsList = [];
const aiTrainingData = [];

// Header extraction helpers
function parseMarkdownSections(content) {
  const lines = content.split(/\r?\n/);
  let currentHeader = 'Title';
  const sections = { Title: [] };

  lines.forEach(line => {
    const titleMatch = line.match(/^#\s+(.*)/);
    const headerMatch = line.match(/^##\s+(.*)/);

    if (titleMatch) {
      currentHeader = 'Title';
      sections[currentHeader] = sections[currentHeader] || [];
      sections[currentHeader].push(titleMatch[1].trim());
    } else if (headerMatch) {
      currentHeader = headerMatch[1].trim().toLowerCase();
      sections[currentHeader] = [];
    } else {
      sections[currentHeader] = sections[currentHeader] || [];
      sections[currentHeader].push(line);
    }
  });

  // Join lines back
  for (const k in sections) {
    if (k === 'Title') {
      sections[k] = sections[k][0] || 'Condition';
    } else {
      sections[k] = sections[k].join('\n').trim();
    }
  }
  return sections;
}

healthFiles.forEach(file => {
  const filePath = path.join(healthDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = parseMarkdownSections(content);
  const conditionName = sections.Title || file.replace('.md', '');

  // Extract sections
  const vitalInfo = sections['vital information'] || '';
  const overview = sections['overview'] || sections['definition'] || sections['description'] || `Overview description of ${conditionName}.`;
  const symptoms = sections['symptoms'] || `Common symptoms include generalized discomfort associated with ${conditionName}.`;
  const causes = sections['causes'] || `Causes of ${conditionName} may include genetic factors, lifestyle, and environmental exposure.`;
  const diagnosis = sections['diagnosis'] || `Diagnosis is established via clinical examination and laboratory findings.`;
  const treatment = sections['treatment'] || sections['recommended approach'] || sections['recommended products'] || sections['associated products'] || `Treatment focuses on symptomatology management and professional consultation.`;
  const prevention = sections['prevention'] || `Prevention strategies involve maintaining a balanced diet, exercise, and routine screenings.`;
  const references = sections['references'] || `- World Health Organization resources.\n- Centers for Disease Control and Prevention guidelines.`;

  // Format split contents
  const diseaseGuide = `# ${conditionName} - Disease Guide\n\n## Overview\n${overview}\n\n## Causes\n${causes}\n\n## Diagnosis\n${diagnosis}\n\n## References\n${references}`;
  const symptomGuide = `# ${conditionName} - Symptoms\n\n${symptoms}`;
  const treatmentGuide = `# ${conditionName} - Treatment & Protocols\n\n${treatment}`;
  const preventionGuide = `# ${conditionName} - Prevention\n\n${prevention}`;

  fs.writeFileSync(path.join(packageDir, 'content/disease-guides', file), diseaseGuide, 'utf8');
  fs.writeFileSync(path.join(packageDir, 'content/symptom-guides', file), symptomGuide, 'utf8');
  fs.writeFileSync(path.join(packageDir, 'content/treatment-guides', file), treatmentGuide, 'utf8');
  fs.writeFileSync(path.join(packageDir, 'content/prevention-guides', file), preventionGuide, 'utf8');

  // Push to compiled listings for AI Search
  medicalKb.push(`## ${conditionName}\n\n${overview}\n\n**Causes:**\n${causes}\n\n**Diagnosis:**\n${diagnosis}\n\n**References:**\n${references}`);
  symptomsList.push(`## ${conditionName} Symptoms\n\n${symptoms}`);
  protocolsList.push(`## ${conditionName} Treatment Protocols\n\n${treatment}`);

  // Build AI training entry
  aiTrainingData.push(`### Condition: ${conditionName}
Category: ${sections['category'] || 'General Wellness'}
Associated Products: ${sections['associated products'] || sections['recommended products'] || 'General supplements'}

Overview:
${overview}

Symptoms:
${symptoms}

Causes:
${causes}

Diagnosis:
${diagnosis}

Treatment:
${treatment}

Prevention:
${prevention}`);
});

console.log('✓ Splitting content guides completed.');

// 4. Keywords CSV Generation
console.log('✓ Creating keyword CSV files...');

// PAA.csv
const paaRows = ['"Keyword","Question","Answer"'];
faqs.forEach(f => {
  if (f.paa) {
    const kw = f.pasf ? f.pasf.split(',')[0].trim().replace(/\s+(symptoms|treatment|prevention)$/i, '') : 'health';
    paaRows.push(`${escapeCSV(kw)},${escapeCSV(f.paa)},${escapeCSV(f.answer)}`);
  }
});
fs.writeFileSync(path.join(packageDir, 'keywords/paa.csv'), paaRows.join('\n'), 'utf8');

// PASF.csv
const pasfRows = ['"Keyword","Search Query"'];
faqs.forEach(f => {
  if (f.pasf) {
    const kw = f.pasf.split(',')[0].trim().replace(/\s+(symptoms|treatment|prevention)$/i, '');
    const queries = f.pasf.split(',').map(q => q.trim());
    queries.forEach(q => {
      pasfRows.push(`${escapeCSV(kw)},${escapeCSV(q)}`);
    });
  }
});
fs.writeFileSync(path.join(packageDir, 'keywords/pasf.csv'), pasfRows.join('\n'), 'utf8');

// Long Tail Keywords.csv
const longTailRows = ['"Keyword","Target Page","Intent"'];
const longTails = [
  { kw: "best clinical herbal supplements in Nigeria", page: "/shop.html", intent: "commercial" },
  { kw: "Aura Herbs products for high blood pressure", page: "/product-cardibetter.html", intent: "transactional" },
  { kw: "where to buy Reishi and Revive capsules", page: "/shop.html", intent: "transactional" },
  { kw: "Aura Herbs clinical protocols and products", page: "/kedi.html", intent: "commercial" },
  { kw: "buy Reishi capsules online in Nigeria", page: "/product-reishi.html", intent: "transactional" },
  { kw: "natural remedies for diabetes Sango Otta", page: "/product-diawell.html", intent: "transactional" },
  { kw: "Kedi herbal products for immune baseline", page: "/product-reishi.html", intent: "commercial" }
];
longTails.forEach(lt => {
  longTailRows.push(`${escapeCSV(lt.kw)},${escapeCSV(lt.page)},${escapeCSV(lt.intent)}`);
});
fs.writeFileSync(path.join(packageDir, 'keywords/long-tail-keywords.csv'), longTailRows.join('\n'), 'utf8');

// Nigeria Trends.csv
const trendRows = ['"Keyword","Search Volume","Intent"'];
const trends = [
  { kw: "malaria treatment guidelines Nigeria", vol: "High", intent: "informational" },
  { kw: "kedi products for female infertility", vol: "Medium", intent: "commercial" },
  { kw: "cost of Cardibetter in Nigeria", vol: "High", intent: "transactional" },
  { kw: "best herbal medicine for high blood pressure", vol: "High", intent: "informational" },
  { kw: "Kenny Infinix Health Centre Otta", vol: "Low", intent: "navigational" },
  { kw: "herbal cure for typhoid fever in Nigeria", vol: "High", intent: "informational" },
  { kw: "Re-vive capsules price in Nigeria", vol: "High", intent: "transactional" },
  { kw: "Golden Six capsules benefits and side effects", vol: "Medium", intent: "informational" },
  { kw: "Kedi Gynapharm capsules for infection", vol: "High", intent: "transactional" },
  { kw: "where to buy Kedi products in Ogun State", vol: "Medium", intent: "navigational" }
];
trends.forEach(t => {
  trendRows.push(`${escapeCSV(t.kw)},${escapeCSV(t.vol)},${escapeCSV(t.intent)}`);
});
fs.writeFileSync(path.join(packageDir, 'keywords/nigeria-trends.csv'), trendRows.join('\n'), 'utf8');

console.log('✓ Keywords CSVs populated.');

// 5. AI-Search Compile
console.log('✓ Populating AI-Search resources...');
fs.copyFileSync(llmsPath, path.join(packageDir, 'ai-search/llms.txt'));

// Update fire.md links and copy
const firePath = path.join(rootDir, 'fire.md');
if (fs.existsSync(firePath)) {
  let fireContent = fs.readFileSync(firePath, 'utf8');

  // Cut everything from ## Health Discovery onwards
  const discoveryIndex = fireContent.indexOf('## Health Discovery');
  if (discoveryIndex !== -1) {
    fireContent = fireContent.substring(0, discoveryIndex);
  }

  // Generate updated listings
  const sortedFiles = [...healthFiles].sort();

  let newDiscoverySection = `## Health Discovery & SEO Package

### AI & Crawler Resources
- https://kedicare.netlify.app/health-seo-package/ai-search/llms.txt
- https://kedicare.netlify.app/health-seo-package/ai-search/fire.md
- https://kedicare.netlify.app/health-seo-package/ai-search/ai-training-data.md
- https://kedicare.netlify.app/health-seo-package/ai-search/medical-knowledge-base.md
- https://kedicare.netlify.app/health-seo-package/ai-search/treatment-protocols.md
- https://kedicare.netlify.app/health-seo-package/ai-search/symtom-guides.md

### Sitemaps Directory
- https://kedicare.netlify.app/sitemap-index.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/pages-sitemap.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/blog-sitemap.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/markdown-sitemap.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/schema-sitemap.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/images-sitemap.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/videos-sitemap.xml
- https://kedicare.netlify.app/health-seo-package/sitemap/ai-resources-sitemap.xml

### Disease Guides
${sortedFiles.map(f => `- https://kedicare.netlify.app/health-seo-package/content/disease-guides/${f}`).join('\n')}

### Symptom Guides
${sortedFiles.map(f => `- https://kedicare.netlify.app/health-seo-package/content/symptom-guides/${f}`).join('\n')}

### Treatment Protocols
${sortedFiles.map(f => `- https://kedicare.netlify.app/health-seo-package/content/treatment-guides/${f}`).join('\n')}

### Prevention Guides
${sortedFiles.map(f => `- https://kedicare.netlify.app/health-seo-package/content/prevention-guides/${f}`).join('\n')}
`;

  fireContent += newDiscoverySection;

  // Write back to root fire.md
  fs.writeFileSync(firePath, fireContent, 'utf8');
  console.log('✓ Wired links inside root fire.md.');

  // Copy to package
  fs.writeFileSync(path.join(packageDir, 'ai-search/fire.md'), fireContent, 'utf8');
}

// Generate ai-training-data.md
const trainingContent = `# AI Training Data - Aura Cares (Kedicare)

This file contains consolidated QA models, wellness challenges, and clinical condition parameters designed for training and fine-tuning language models.

## Section 1: Frequently Asked Questions (FAQ Model)

${faqs.map((f, i) => `### Question Model ${i + 1}
**Question:** ${f.question}
**Answer:** ${f.answer}
**PAA:** ${f.paa}
**PASF:** ${f.pasf}`).join('\n\n')}

## Section 2: Clinical Conditions Profiles

${aiTrainingData.join('\n\n')}
`;
fs.writeFileSync(path.join(packageDir, 'ai-search/ai-training-data.md'), trainingContent, 'utf8');

// Generate medical-knowledge-base.md
const kbContent = `# Medical Knowledge Base - Aura Cares (Kedicare)

A consolidated encyclopedia of all clinical conditions, definition parameters, etiology, diagnosis, and authority references.

${medicalKb.join('\n\n')}
`;
fs.writeFileSync(path.join(packageDir, 'ai-search/medical-knowledge-base.md'), kbContent, 'utf8');

// Generate treatment-protocols.md
const protContent = `# Treatment & Clinical Protocols - Aura Cares (Kedicare)

Consolidated list of natural herbal supplements, therapies, zero-gravity massage chair, and BCM device applications for chronic conditions.

${protocolsList.join('\n\n')}
`;
fs.writeFileSync(path.join(packageDir, 'ai-search/treatment-protocols.md'), protContent, 'utf8');

// Generate symtom-guides.md
const symContent = `# Symptoms Guides - Aura Cares (Kedicare)

Consolidated list of symptomatological markers and common indicators for diagnosis.

${symptomsList.join('\n\n')}
`;
fs.writeFileSync(path.join(packageDir, 'ai-search/symtom-guides.md'), symContent, 'utf8');

// Copy Schemas
const schemasDir = path.join(rootDir, 'schemas');
if (fs.existsSync(schemasDir)) {
  const schemaMappings = {
    'organization-schema.json': 'organization.json',
    'physician-schema.json': 'physician.json',
    'medical-webpage-schema.json': 'medical-webpage.json',
    'medical-condition-schema.json': 'medical-condition.json',
    'faq-schema.json': 'faq.json'
  };
  Object.keys(schemaMappings).forEach(src => {
    const srcPath = path.join(schemasDir, src);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(packageDir, 'ai-search/schema-markup', schemaMappings[src]));
    }
  });
}
console.log('✓ AI-Search resources populated.');

// 6. Sitemaps Generation
console.log('✓ Creating XML sitemaps...');
const DOMAIN = 'https://kedicare.netlify.app';

// Static pages
const staticPages = [
  'index.html', 'about.html', 'contact.html', 'shop.html', 'cart.html',
  'checkout.html', 'checkout-v2.html', 'account.html', 'admin.html',
  'ai-doctor.html', 'franchise.html', 'order-tracker.html', 'quiz.html',
  'roi-calculator.html', 'health-challenges.html', 'token.html'
];
const pagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${DOMAIN}/${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === 'index.html' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/pages-sitemap.xml'), pagesSitemap, 'utf8');

// Blogs sitemap
const blogs = ['blog.html', 'blog-immune-system.html', 'blog-male-vitality.html', 'blog-metabolic-health.html'];
const blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogs.map(blog => `  <url>
    <loc>${DOMAIN}/${blog}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/blog-sitemap.xml'), blogSitemap, 'utf8');

// Markdown sitemap
const markdownSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${healthFiles.map(file => `  <url>
    <loc>${DOMAIN}/health/${file}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/markdown-sitemap.xml'), markdownSitemap, 'utf8');

// Schema sitemap
const schemasListForSitemap = ['organization.json', 'physician.json', 'medical-webpage.json', 'medical-condition.json', 'faq.json'];
const schemaSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${schemasListForSitemap.map(schema => `  <url>
    <loc>${DOMAIN}/health-seo-package/ai-search/schema-markup/${schema}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/schema-sitemap.xml'), schemaSitemap, 'utf8');

// Refined Image Sitemap
const images = [
  'assets/img/product/Reishi.png', 'assets/img/product/Revive.png',
  'assets/img/product/Cordy Active.png', 'assets/img/product/Golden-Hypha.png',
  'assets/img/product/Diawell.png', 'assets/img/product/Golden six.png',
  'assets/img/product/Gastrifort.png', 'assets/img/product/CONSTILEASE.png',
  'assets/img/product/tooth-paste.jpg'
];
const imagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${DOMAIN}/shop.html</loc>
${images.map(img => `    <image:image>
      <image:loc>${DOMAIN}/${img}</image:loc>
      <image:title>${path.basename(img, path.extname(img))}</image:title>
    </image:image>`).join('\n')}
  </url>
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/images-sitemap.xml'), imagesSitemap, 'utf8');

// Refined Video Sitemap
const videosSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${DOMAIN}/kedi.html</loc>
    <video:video>
      <video:content_loc>https://www.youtube.com/watch?v=kedi-overview</video:content_loc>
      <video:title>Kedi Healthcare Products Overview</video:title>
      <video:description>Clinical product guidelines and herbal therapy benefits for cellular repair.</video:description>
    </video:video>
  </url>
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/videos-sitemap.xml'), videosSitemap, 'utf8');

// AI Resources Sitemap
const aiResources = ['llms.txt', 'fire.md', 'ai-training-data.md', 'medical-knowledge-base.md', 'treatment-protocols.md', 'symtom-guides.md'];
const aiResourcesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${aiResources.map(res => `  <url>
    <loc>${DOMAIN}/health-seo-package/ai-search/${res}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(packageDir, 'sitemap/ai-resources-sitemap.xml'), aiResourcesSitemap, 'utf8');

console.log('✓ Sitemaps written.');

// 7. Metadata JSON Generation
console.log('✓ Extracting metadata from page headers...');

const pageMeta = {};
staticPages.concat(blogs).forEach(page => {
  const filePath = path.join(rootDir, page);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i) || html.match(/<meta\s+property="og:description"\s+content="(.*?)"/i);
    
    pageMeta[page] = {
      title: titleMatch ? titleMatch[1] : 'Aura Cares - Kedicare',
      description: descMatch ? descMatch[1] : 'Aura Cares provides reliable herbal medicine protocols, symptom checking, and wellness calculators.',
      url: `${DOMAIN}/${page}`
    };
  }
});
fs.writeFileSync(path.join(packageDir, 'metadata/pages-metadata.json'), JSON.stringify(pageMeta, null, 2), 'utf8');

// Condition metadata
const conditionMeta = {};
healthFiles.forEach(file => {
  const filePath = path.join(healthDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = parseMarkdownSections(content);
  const conditionName = sections.Title || file.replace('.md', '');
  
  conditionMeta[file.replace('.md', '')] = {
    condition: conditionName,
    category: sections.category || 'General Health',
    associatedProducts: (sections['associated products'] || sections['recommended products'] || 'None').split(',').map(p => p.trim()),
    description: sections.overview || sections.definition || `Information on symptoms and prevention for ${conditionName}.`
  };
});
fs.writeFileSync(path.join(packageDir, 'metadata/condition-metadata.json'), JSON.stringify(conditionMeta, null, 2), 'utf8');

console.log('✓ Metadata generated.');

// 8. Deployment resources
console.log('✓ Preparing deployment assets...');
const netlifyTomlPath = path.join(rootDir, 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
  fs.copyFileSync(netlifyTomlPath, path.join(packageDir, 'deployment/netlify.toml'));
}

const deploymentReadme = `# Deployment Guide - Health SEO Package

This directory contains deployment assets and sitemap/headers configurations.

## Netlify Configuration
The \`netlify.toml\` file coordinates redirection, custom serverless endpoints, and Cache-Control parameters:
- \`/api/questions/*\` redirects to internal lambda functions.
- Specific cache‑control mappings optimize SEO crawler delivery.

## Sitemap Index Wiring
To submit these sitemaps to Google Search Console or Bing Webmaster Tools, update your main \`sitemap-index.xml\` or submit them separately:
1. \`https://kedicare.netlify.app/health-seo-package/sitemap/pages-sitemap.xml\`
2. \`https://kedicare.netlify.app/health-seo-package/sitemap/blog-sitemap.xml\`
3. \`https://kedicare.netlify.app/health-seo-package/sitemap/markdown-sitemap.xml\`
4. \`https://kedicare.netlify.app/health-seo-package/sitemap/schema-sitemap.xml\`
5. \`https://kedicare.netlify.app/health-seo-package/sitemap/images-sitemap.xml\`
6. \`https://kedicare.netlify.app/health-seo-package/sitemap/videos-sitemap.xml\`
7. \`https://kedicare.netlify.app/health-seo-package/sitemap/ai-resources-sitemap.xml\`
`;
fs.writeFileSync(path.join(packageDir, 'deployment/README.md'), deploymentReadme, 'utf8');

console.log('🎉 Generation complete! Everything has been successfully saved inside health-seo-package/.');
