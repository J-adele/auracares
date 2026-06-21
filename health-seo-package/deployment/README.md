# Deployment Guide - Health SEO Package

This directory contains deployment assets and sitemap/headers configurations.

## Netlify Configuration
The `netlify.toml` file coordinates redirection, custom serverless endpoints, and Cache-Control parameters:
- `/api/questions/*` redirects to internal lambda functions.
- Specific cache‑control mappings optimize SEO crawler delivery.

## Sitemap Index Wiring
To submit these sitemaps to Google Search Console or Bing Webmaster Tools, update your main `sitemap-index.xml` or submit them separately:
1. `https://kedicare.netlify.app/sitemap.xml`
2. `https://kedicare.netlify.app/sitemap-index.xml`
3. `https://kedicare.netlify.app/health-seo-package/sitemap/pages-sitemap.xml`
4. `https://kedicare.netlify.app/health-seo-package/sitemap/blog-sitemap.xml`
5. `https://kedicare.netlify.app/health-seo-package/sitemap/markdown-sitemap.xml`
6. `https://kedicare.netlify.app/health-seo-package/sitemap/schema-sitemap.xml`
7. `https://kedicare.netlify.app/health-seo-package/sitemap/images-sitemap.xml`
8. `https://kedicare.netlify.app/health-seo-package/sitemap/videos-sitemap.xml`
9. `https://kedicare.netlify.app/health-seo-package/sitemap/social-sitemap.xml`
10. `https://kedicare.netlify.app/health-seo-package/sitemap/ai-resources-sitemap.xml`
