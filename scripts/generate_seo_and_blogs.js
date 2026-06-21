const path = require('path');
const fs = require('fs');
const domain = 'https://kedicare.netlify.app';

// 1. Create Blogs
const blogsToCreate = [
    {
        filename: 'blog-immune-system.html',
        title: 'How to Build an Unbreakable Immune System',
        description: 'Discover the clinical protocols to strengthen your immune response against daily challenges.',
        date: 'April 25, 2026',
        category: 'Immunity',
        author: 'Dr. Sarah Aura',
        content: `
            <h3>The Science of Cellular Defense</h3>
            <p>Your immune system is a complex network of cells, tissues, and organs that work together to defend against harmful pathogens. A compromised immune system can leave you vulnerable to frequent colds, flu, and fatigue.</p>
            <p>Clinical research highlights the profound impact of adaptogens, particularly Ganoderma Lucidum (Reishi mushroom), in modulating immune function. Reishi enhances the activity of white blood cells, the primary defenders against infection.</p>
            <h4>Key Strategies for Immune Armor:</h4>
            <ul class="post-list list-unstyled mb-30">
                <li><strong>Adequate Sleep:</strong> Cellular repair happens during deep sleep cycles.</li>
                <li><strong>Stress Management:</strong> Chronic cortisol suppresses immune response.</li>
                <li><strong>Clinical Supplementation:</strong> Utilizing potent compounds like Reishi and Golden Hypha.</li>
            </ul>
        `,
        upsellProduct: 'Reishi',
        upsellDesc: 'Immune Armor Bundle: Reishi + Golden Hypha for maximum cellular defense and vitality.',
        upsellPrice: '₦77,000'
    },
    {
        filename: 'blog-metabolic-health.html',
        title: 'The Ultimate Guide to Metabolic Reset',
        description: 'Learn how to restart your metabolism, burn fat effectively, and detoxify your digestive system.',
        date: 'April 22, 2026',
        category: 'Weight Management',
        author: 'Dr. James Aura',
        content: `
            <h3>Understanding Your Metabolism</h3>
            <p>Metabolic stagnation often occurs due to poor diet, sedentary lifestyles, and toxin buildup in the gut. A true metabolic reset focuses on optimizing liver function and improving insulin sensitivity.</p>
            <p>Weight management isn't just about cutting calories; it's about hormonal balance. Clinical formulations like Magilim work by accelerating lipid metabolism while naturally suppressing excessive appetite.</p>
            <h4>Steps to a Metabolic Reset:</h4>
            <ul class="post-list list-unstyled mb-30">
                <li><strong>Intermittent Fasting:</strong> Give your digestive tract time to rest.</li>
                <li><strong>Hydration:</strong> Essential for cellular metabolic processes.</li>
                <li><strong>Targeted Fat Burning:</strong> Using Magilim to enhance metabolic rate safely.</li>
            </ul>
        `,
        upsellProduct: 'Magilim',
        upsellDesc: 'Metabolic Reset: Magilim + Colon Cleanse Tea to burn fat and detoxify the gut.',
        upsellPrice: '₦52,000'
    },
    {
        filename: 'blog-male-vitality.html',
        title: 'Restoring Peak Male Vitality and Stamina',
        description: 'A comprehensive approach to overcoming fatigue, improving blood flow, and boosting male performance.',
        date: 'April 20, 2026',
        category: "Men's Health",
        author: 'Dr. Michael Aura',
        content: `
            <h3>The Core of Male Stamina</h3>
            <p>Male vitality is closely linked to cardiovascular health, testosterone levels, and psychological well-being. Modern stress and poor nutrition can severely impact stamina and physical performance.</p>
            <p>Traditional Chinese Medicine emphasizes the importance of Kidney essence (Jing) in maintaining male vigor. Modern clinical applications utilize potent herbs found in Re-Vive to restore this vital energy, improving blood flow and endurance.</p>
            <h4>Vitality Enhancement Protocol:</h4>
            <ul class="post-list list-unstyled mb-30">
                <li><strong>Resistance Training:</strong> Naturally boosts testosterone production.</li>
                <li><strong>Nitric Oxide Boosters:</strong> Foods and supplements that improve vascular health.</li>
                <li><strong>Clinical Support:</strong> Integrating Re-Vive into daily routines for lasting stamina.</li>
            </ul>
        `,
        upsellProduct: 'Revive',
        upsellDesc: 'Vigor Prime Bundle: Re-Vive + Vigor Essential for peak physical and reproductive stamina.',
        upsellPrice: '₦60,000'
    }
];

function createBlogs() {
    // We'll use news-single.html as a base template
    if (!fs.existsSync('./news-single.html')) return;
    let baseTemplate = fs.readFileSync('./news-single.html', 'utf8');

    blogsToCreate.forEach(blog => {
        let content = baseTemplate;
        
        // Replace Title
        content = content.replace(/<title>.*?<\/title>/g, `<title>Aura Herbs - ${blog.title}</title>`);
        
        // Replace H2
        content = content.replace(/<h2>I have been battling.*?<\/h2>/s, `<h2>${blog.title}</h2>`);
        
        // Replace Author and Date
        content = content.replace(/<span>Alaxandar \/ <span class="year">4 year<\/span><\/span>/g, `<span>${blog.author} / <span class="year">${blog.date}</span></span>`);
        
        // Replace Breadcrumb
        content = content.replace(/<span>Reishi cures Toilet Infection<\/span>/g, `<span>${blog.title}</span>`);

        // Replace the main article content (rough replacement)
        const articleStartRegex = /<p>I have been battling woth toilet infection since months.*?<div class="row mb-35 mt-20">/s;
        content = content.replace(articleStartRegex, `<p class="lead">${blog.description}</p>${blog.content}<div class="row mb-35 mt-20">`);

        // Inject Upselling Section just before </article>
        const upsellSection = `
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 30px; margin-top: 40px; margin-bottom: 40px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: rgba(16, 185, 129, 0.1); color: #10B981; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase;">Clinical Recommendation</span>
                <h3 style="font-size: 24px; font-weight: 800; margin-top: 10px; color: #111827;">Accelerate Your Results</h3>
            </div>
            <div style="display: flex; align-items: center; gap: 20px; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="flex-shrink: 0; width: 120px; height: 120px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <img src="assets/img/product/${blog.upsellProduct}.png" alt="${blog.upsellProduct}" style="max-height: 100px;">
                </div>
                <div>
                    <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin-bottom: 5px;">${blog.upsellProduct} Protocol</h4>
                    <p style="font-size: 14px; color: #4b5563; margin-bottom: 15px;">${blog.upsellDesc}</p>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #10B981; font-weight: 800; font-size: 20px;">${blog.upsellPrice}</span>
                        <a href="product-template.html?id=${blog.upsellProduct.toLowerCase()}" style="background: #10B981; color: #fff; padding: 8px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">Shop Now</a>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        content = content.replace('</article>', upsellSection + '</article>');
        
        // Inject SEO tags to the blog
        const seoTags = `
    <meta name="description" content="${blog.description}">
    <meta property="og:title" content="${blog.title}">
    <meta property="og:description" content="${blog.description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${domain}/${blog.filename}">
    <meta property="og:image" content="${domain}/assets/img/product/${blog.upsellProduct}.png">
    <meta name="twitter:card" content="summary_large_image">
        `;
        content = content.replace('</head>', seoTags + '</head>');

        fs.writeFileSync(blog.filename, content, 'utf8');
        console.log(`Created blog: ${blog.filename}`);
    });
}

// 2. SEO Generator and Sitemaps
function generateSEO() {
    const files = fs.readdirSync('./');
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    let sitemapUrls = [];
    let imageUrls = [];
    let videoUrls = [];
    
    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        // Ensure global SEO tags
        if (!content.includes('og:title')) {
            const titleMatch = content.match(/<title>(.*?)<\/title>/);
            const title = titleMatch ? titleMatch[1] : 'Aura Herbs';
            
            const globalSEO = `
    <meta property="og:title" content="${title}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${domain}/${file}">
    <meta property="og:site_name" content="Aura Herbs">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="robots" content="index, follow">
            `;
            content = content.replace('</head>', globalSEO + '</head>');
            fs.writeFileSync(file, content, 'utf8');
        }

        sitemapUrls.push(`
    <url>
        <loc>${domain}/${file}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${file === 'index.html' || file === 'kedi.html' ? '1.0' : '0.8'}</priority>
    </url>`);

        // Extract Images for Image Sitemap
        const imgMatches = [...content.matchAll(/<img[^>]+src="([^">]+)"/g)];
        if (imgMatches.length > 0) {
            let imagesXml = '';
            imgMatches.forEach(m => {
                let src = m[1];
                if (!src.startsWith('http') && !src.startsWith('data:')) {
                    imagesXml += `
        <image:image>
            <image:loc>${domain}/${src.replace(/^\/+/, '')}</image:loc>
        </image:image>`;
                }
            });
            
            if (imagesXml) {
                imageUrls.push(`
    <url>
        <loc>${domain}/${file}</loc>${imagesXml}
    </url>`);
            }
        }
        
        // Extract Videos for Video Sitemap
        const videoMatches = [...content.matchAll(/<a[^>]+href="([^">]+youtube\.com[^">]+)"[^>]*class="popup-video"/g)];
        if (videoMatches.length > 0) {
            let videosXml = '';
            videoMatches.forEach(m => {
                videosXml += `
        <video:video>
            <video:content_loc>${m[1]}</video:content_loc>
            <video:title>Aura Herbs Clinical Video</video:title>
            <video:description>Clinical documentation and success protocols from Aura Herbs.</video:description>
        </video:video>`;
            });
            if (videosXml) {
                videoUrls.push(`
    <url>
        <loc>${domain}/${file}</loc>${videosXml}
    </url>`);
            }
        }
    });

    // Write Sitemap.xml
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`;
    fs.writeFileSync('sitemap.xml', sitemapContent);
    console.log('Created sitemap.xml');

    // Write Image Sitemap
    const imageSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls.join('')}
</urlset>`;
    fs.writeFileSync('image-sitemap.xml', imageSitemapContent);
    console.log('Created image-sitemap.xml');

    // Write Video Sitemap
    const videoSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoUrls.join('')}
</urlset>`;
    fs.writeFileSync('video-sitemap.xml', videoSitemapContent);
    console.log('Created video-sitemap.xml');
    
    // Write Social Sitemap (just a text file with social links/structure or standard sitemap)
    const socialSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://www.facebook.com/auraherbs</loc></url>
    <url><loc>https://www.instagram.com/auraherbs</loc></url>
    <url><loc>https://twitter.com/auraherbs</loc></url>
    <url><loc>https://www.pinterest.com/auraherbs</loc></url>
    <url><loc>https://www.youtube.com/c/auraherbs</loc></url>
</urlset>`;
    fs.writeFileSync('social-sitemap.xml', socialSitemapContent);
    console.log('Created social-sitemap.xml');

    // Write Robots.txt
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
Sitemap: ${domain}/image-sitemap.xml
Sitemap: ${domain}/video-sitemap.xml
Sitemap: ${domain}/social-sitemap.xml
`;
    fs.writeFileSync('robots.txt', robotsContent);
    console.log('Created robots.txt');
    console.log('SEO Generation and Wiring Complete.');
}

createBlogs();
generateSEO();
