const fs = require('fs');
const path = require('path');

const workspaceDir = path.resolve(__dirname, '..');
const sitemapPath = path.join(workspaceDir, 'sitemap.xml');
const domain = 'https://kedicare.netlify.app';

// 1. Find the 209 markdown files from fire.md and resolve their modification dates
function getMdFilesFromFire() {
    const firePath = path.join(workspaceDir, 'fire.md');
    if (!fs.existsSync(firePath)) {
        console.error('fire.md not found!');
        process.exit(1);
    }
    const content = fs.readFileSync(firePath, 'utf8');
    const sectionStart = content.indexOf('## Health Discovery');
    if (sectionStart === -1) {
        console.error('## Health Discovery section not found in fire.md!');
        process.exit(1);
    }
    
    const lines = content.substring(sectionStart).split('\n');
    const urls = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('- ')) {
            const url = line.substring(2).trim();
            if (url.includes('/health/')) {
                urls.push(url);
            }
        } else if (line.startsWith('##') || line.startsWith('#')) {
            break;
        }
    }
    
    // Deduplicate
    const uniqueUrls = [...new Set(urls)];
    
    // Map to relative paths and get lastmod
    const fileList = [];
    uniqueUrls.forEach(url => {
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        const relPath = `health/${filename}`;
        
        let fileToStat = path.join(workspaceDir, relPath);
        // Fallback mappings if the file with this exact spelling does not exist on disk
        if (!fs.existsSync(fileToStat)) {
            if (filename === 'lingcancer.md') {
                fileToStat = path.join(workspaceDir, 'health/lungcancer.md');
            } else if (filename === 'testicularcancar.md') {
                fileToStat = path.join(workspaceDir, 'health/testicularcancer.md');
            }
        }
        
        let lastmod = new Date().toISOString().split('T')[0];
        if (fs.existsSync(fileToStat)) {
            const stat = fs.statSync(fileToStat);
            lastmod = stat.mtime.toISOString().split('T')[0];
        } else {
            console.warn(`Warning: File not found on disk for URL: ${url}`);
        }
        
        fileList.push({ relPath, lastmod });
    });
    
    return fileList;
}

// 2. Define the exact list of 44 non-markdown URLs to preserve
const nonMdUrlsList = [
    { loc: 'https://kedicare.netlify.app/', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/404.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/about.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/account.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/ad-showcase.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/admin-community.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/ai-doctor.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/auth.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/blog-immune-system.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/blog-male-vitality.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/blog-metabolic-health.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/blog.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/cart.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/checkout-v2.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/checkout.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/contact.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/email-centre.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/Farforlife.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/franchise.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/home-3.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/kedi.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://kedicare.netlify.app/news-single.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/notifications.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-cardibetter.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-colon-cleanser.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-constilease.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-diawell.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-golden-hypha.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-golden-six.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-haemocare.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-lirich.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-lycovite.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-magilim.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-refresh-tea.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-reishi.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-revive.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-v-ca.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/product-vigor-essential.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/quiz.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/roi-calculator.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/shop-left-sidebar.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/shop-single.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/shop.html', lastmod: '2026-05-08', changefreq: 'weekly', priority: '0.8' },
    { loc: 'https://kedicare.netlify.app/llms.txt', lastmod: '2026-06-16', changefreq: 'monthly', priority: '0.5' }
];

const formattedNonMdUrls = nonMdUrlsList.map(item => {
    return `    <url>
        <loc>${item.loc}</loc>
        <lastmod>${item.lastmod}</lastmod>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority}</priority>
    </url>`;
});

// 3. Generate new markdown sitemap entries
const mdFiles = getMdFilesFromFire();
mdFiles.sort((a, b) => a.relPath.localeCompare(b.relPath));

const newMdUrls = mdFiles.map(f => {
    return `    <url>
        <loc>${domain}/${f.relPath}</loc>
        <lastmod>${f.lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>`;
});

// 4. Assemble the updated sitemap.xml
const newSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${formattedNonMdUrls.join('\n\n')}

${newMdUrls.join('\n\n')}

</urlset>
`;

fs.writeFileSync(sitemapPath, newSitemapContent, 'utf8');
console.log(`Successfully updated sitemap.xml:`);
console.log(`- Retained ${formattedNonMdUrls.length} non-markdown URLs.`);
console.log(`- Added ${newMdUrls.length} markdown URLs.`);
