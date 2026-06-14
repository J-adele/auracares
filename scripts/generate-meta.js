const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BASE_URL = 'https://kedicare.netlify.app';

// 1. Create a sandbox context to evaluate products.js and combo-data.js
const sandbox = {
    window: {},
    document: {},
    localStorage: {
        getItem: () => 'NGN',
        setItem: () => {}
    }
};
vm.createContext(sandbox);

// Helper to load and run scripts in sandbox
function loadScript(filePath) {
    const absolutePath = path.resolve(__dirname, '..', filePath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`Script not found: ${absolutePath}`);
        return false;
    }
    const code = fs.readFileSync(absolutePath, 'utf8');
    try {
        vm.runInContext(code, sandbox, { filename: filePath });
        return true;
    } catch (err) {
        console.error(`Error executing ${filePath}:`, err);
        return false;
    }
}

console.log('Evaluating clinical databases...');
loadScript('assets/js/products.js');
loadScript('assets/js/combo-data.js');

const KEDI_PRODUCTS = sandbox.window.KEDI_PRODUCTS || sandbox.KEDI_PRODUCTS || [];
const KEDI_PROTOCOLS = sandbox.window.KEDI_PROTOCOLS || sandbox.KEDI_PROTOCOLS || [];
const AURA_COMBO_DATA = sandbox.window.AURA_COMBO_DATA || sandbox.AURA_COMBO_DATA || {};

console.log(`Loaded ${KEDI_PRODUCTS.length} products.`);
console.log(`Loaded ${KEDI_PROTOCOLS.length} protocols.`);

let comboCount = 0;
const combosList = [];
for (const tab in AURA_COMBO_DATA) {
    AURA_COMBO_DATA[tab].forEach(combo => {
        combosList.push(combo);
        comboCount++;
    });
}
console.log(`Loaded ${comboCount} clinical combos.`);

// HTML Template for pre-rendered pages
function generatePageHTML({ title, desc, image, redirectUrl, canonicalUrl }) {
    // Clean and verify image path
    let imgUrl = image;
    if (imgUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('data:')) {
        imgUrl = `${BASE_URL}/${imgUrl.replace(/^\//, '').replace(/^(\.\.\/)+/, '')}`;
    }
    if (!imgUrl) {
        imgUrl = `${BASE_URL}/assets/img/product/kedi.jpg`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Aura Herbs Clinical Portal</title>
    <meta name="description" content="${desc}">

    <!-- ===== Social Rich Preview Meta Tags ===== -->
    <!-- Open Graph -->
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="Aura Herbs">
    <meta property="og:locale" content="en_US">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${imgUrl}">
    <meta property="og:image:secure_url" content="${imgUrl}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${title}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@auraherbs">
    <meta name="twitter:creator" content="@auraherbs">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${imgUrl}">
    <meta name="twitter:image:alt" content="${title}">

    <!-- Pinterest -->
    <meta name="pinterest:description" content="${desc}">
    <meta name="pinterest:media" content="${imgUrl}">

    <!-- Instant Client-Side Redirect -->
    <script>
        window.location.replace("${redirectUrl}");
    </script>

    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: #05070a;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            max-width: 500px;
            padding: 40px;
        }
        .logo {
            font-size: 32px;
            font-weight: 900;
            color: #10b981;
            margin-bottom: 20px;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(16, 185, 129, 0.1);
            border-top: 5px solid #10b981;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 30px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        p {
            color: #94a3b8;
            font-size: 15px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <div class="logo">Aura Herbs</div>
        <h1>Initializing Clinical Protocol</h1>
        <p>Connecting to Aura Herbs clinical intelligence node. Redirecting you to the verified protocol interface...</p>
    </div>
</body>
</html>`;
}

const rootDir = path.resolve(__dirname, '..');

// 2. Generate Product pages (into products/ subfolder)
console.log('Generating product sharing pages inside /products/ folder...');
const productsDir = path.join(rootDir, 'products');
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir);

KEDI_PRODUCTS.forEach(product => {
    const title = `${product.name} Protocol`;
    const desc = `${product.desc} Category: ${product.category}. Member Price Available.`;
    const image = product.img;
    // Relative redirect since file is inside products/ subfolder
    const redirectUrl = `../shop-single.html?id=${product.id}`;
    const canonicalUrl = `${BASE_URL}/products/product-${product.id}.html`;

    const htmlContent = generatePageHTML({ title, desc, image, redirectUrl, canonicalUrl });
    fs.writeFileSync(path.join(productsDir, `product-${product.id}.html`), htmlContent, 'utf8');
});
console.log(`Generated ${KEDI_PRODUCTS.length} product static pages inside /products/ folder.`);

// 3. Generate Protocol pages (into protocols/ subfolder)
console.log('Generating protocol sharing pages inside /protocols/ folder...');
const protocolsDir = path.join(rootDir, 'protocols');
if (!fs.existsSync(protocolsDir)) fs.mkdirSync(protocolsDir);

KEDI_PROTOCOLS.forEach(protocol => {
    const title = `${protocol.name} Synergy Pack`;
    const desc = protocol.desc || `Clinical protocol for ${protocol.category}. Synergistic multi-product treatment.`;
    
    // Resolve image using the first product
    let image = '';
    if (protocol.productIds && protocol.productIds.length > 0) {
        const firstProduct = KEDI_PRODUCTS.find(p => p.id === protocol.productIds[0]);
        if (firstProduct) {
            image = firstProduct.img;
        }
    }

    // Relative redirect since file is inside protocols/ subfolder
    const redirectUrl = `../shop-single.html?id=${protocol.id}`;
    const canonicalUrl = `${BASE_URL}/protocols/protocol-${protocol.id}.html`;

    const htmlContent = generatePageHTML({ title, desc, image, redirectUrl, canonicalUrl });
    fs.writeFileSync(path.join(protocolsDir, `protocol-${protocol.id}.html`), htmlContent, 'utf8');
});
console.log(`Generated ${KEDI_PROTOCOLS.length} protocol static pages inside /protocols/ folder.`);

// 4. Generate Combo pages
console.log('Generating clinical combo sharing pages inside /combos/ folder...');
const combosDir = path.join(rootDir, 'combos');
if (!fs.existsSync(combosDir)) {
    fs.mkdirSync(combosDir);
}

// Clean up old root files if any exist
const rootFiles = fs.readdirSync(rootDir);
rootFiles.forEach(file => {
    if (file.startsWith('combo-') && file.endsWith('.html')) {
        try {
            fs.unlinkSync(path.join(rootDir, file));
        } catch (e) {
            console.error(`Error deleting old combo file: ${file}`, e);
        }
    }
});

combosList.forEach(combo => {
    const slug = combo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = combo.title;
    const desc = combo.benefits || `Clinical synergistic protocol for treatment. Includes ${combo.included ? combo.included.join(', ') : 'multiple protocols'}.`;
    
    // Resolve image
    let image = '';
    if (combo.images && combo.images.length > 0) {
        const firstImg = combo.images[0];
        image = firstImg.startsWith('http') || firstImg.startsWith('assets/') ? firstImg : `assets/img/product/${firstImg}`;
    }

    // Since this is in the combos/ folder, redirect must go up one level to index.html
    const redirectUrl = `../index.html?combo=${encodeURIComponent(combo.title)}`;
    const canonicalUrl = `${BASE_URL}/combos/${slug}.html`;

    const htmlContent = generatePageHTML({ title, desc, image, redirectUrl, canonicalUrl });
    fs.writeFileSync(path.join(combosDir, `${slug}.html`), htmlContent, 'utf8');
});
console.log(`Generated ${combosList.length} combo static pages inside /combos/ folder.`);

console.log('All rich sharing pre-rendered files successfully generated!');
