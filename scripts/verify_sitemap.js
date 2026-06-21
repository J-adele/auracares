const fs = require('fs');
const path = require('path');

const sitemapPath = path.resolve(__dirname, '../sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
    console.error('FAIL: sitemap.xml does not exist!');
    process.exit(1);
}

const content = fs.readFileSync(sitemapPath, 'utf8');

// Basic XML structure checks
if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.error('FAIL: sitemap.xml does not start with standard XML declaration.');
    process.exit(1);
}

if (!content.includes('<urlset') || !content.includes('</urlset>')) {
    console.error('FAIL: sitemap.xml is missing <urlset> or </urlset> tags.');
    process.exit(1);
}

// Count and validate <url> blocks
const urlBlocks = content.match(/<url>[\s\S]*?<\/url>/g) || [];
console.log(`Checking ${urlBlocks.length} sitemap URLs...`);

let mdCount = 0;
let nonMdCount = 0;
let errors = 0;

urlBlocks.forEach((block, idx) => {
    // Check inner tags
    const locMatch = block.match(/<loc>(.*?)<\/loc>/);
    const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
    const changefreqMatch = block.match(/<changefreq>(.*?)<\/changefreq>/);
    const priorityMatch = block.match(/<priority>(.*?)<\/priority>/);

    if (!locMatch) {
        console.error(`FAIL: URL block at index ${idx} is missing <loc> tag.`);
        errors++;
        return;
    }

    const loc = locMatch[1];
    if (loc.toLowerCase().endsWith('.md')) {
        mdCount++;
    } else {
        nonMdCount++;
    }

    if (!lastmodMatch) {
        console.error(`FAIL: URL ${loc} is missing <lastmod> tag.`);
        errors++;
    } else {
        // Validate date format YYYY-MM-DD
        const dateStr = lastmodMatch[1];
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.error(`FAIL: URL ${loc} has invalid date format: "${dateStr}"`);
            errors++;
        }
    }

    if (!changefreqMatch) {
        console.error(`FAIL: URL ${loc} is missing <changefreq> tag.`);
        errors++;
    }

    if (!priorityMatch) {
        console.error(`FAIL: URL ${loc} is missing <priority> tag.`);
        errors++;
    }
});

console.log(`Validation results:`);
console.log(`- Total URLs: ${urlBlocks.length}`);
console.log(`- Markdown URLs: ${mdCount}`);
console.log(`- Non-markdown URLs: ${nonMdCount}`);
console.log(`- Total errors found: ${errors}`);

if (errors > 0) {
    process.exit(1);
} else {
    console.log('SUCCESS: sitemap.xml is valid!');
}
