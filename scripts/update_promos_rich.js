const path = require('path');
const fs = require('fs');

const ogTags = `
    <!-- PROMO RICH SNIPPET START -->
    <meta property="og:title" content="KEDI 2026 Perform and Win Award 🏆">
    <meta property="og:description" content="Register and upgrade to Three Star Consultant to win amazing prizes! TVs, Refrigerators, Air Conditioners and more!">
    <meta property="og:image" content="https://kedicare.netlify.app/assets/img/promo/kedi-2026-award.jpg">
    <meta property="og:url" content="https://kedicare.netlify.app/">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="KEDI 2026 Perform and Win Award 🏆">
    <meta name="twitter:description" content="Register and upgrade to Three Star Consultant to win amazing prizes! TVs, Refrigerators, Air Conditioners and more!">
    <meta name="twitter:image" content="https://kedicare.netlify.app/assets/img/promo/kedi-2026-award.jpg">
    <!-- PROMO RICH SNIPPET END -->
`;

const promoHtml = `
<!-- KEDI PROMO BANNER START -->
<style>
.kedi-promo-banner {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12px;
    margin: 30px auto;
    max-width: 1200px;
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    z-index: 10;
}
.kedi-promo-banner:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
}
.kedi-promo-banner-content {
    display: flex;
    align-items: center;
    gap: 20px;
}
.promo-thumbs-wrapper {
    display: flex;
    gap: 10px;
}
.kedi-promo-banner-thumb {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.kedi-promo-banner-text h4 {
    color: white;
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    font-weight: 800;
}
.kedi-promo-banner-text p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
}
.kedi-promo-banner-actions {
    display: flex;
    gap: 10px;
}
.kedi-promo-btn {
    background: white;
    color: #10B981;
    border: none;
    padding: 8px 16px;
    border-radius: 50px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    gap: 5px;
}
.kedi-promo-btn:hover {
    background: #f0fdf4;
}
.kedi-promo-btn.share {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}
.kedi-promo-btn.share:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Modal Styles */
.kedi-promo-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    z-index: 99999;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}
.kedi-promo-modal.active {
    display: flex;
}
.kedi-promo-modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    gap: 20px;
    animation: promoZoom 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow-y: auto;
    padding: 20px;
}
@keyframes promoZoom {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
.kedi-promo-modal-img {
    max-width: 100%;
    height: auto;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    flex: 1;
}
.kedi-promo-modal-close {
    position: fixed;
    top: 20px;
    right: 30px;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    border: 2px solid white;
    color: white;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.kedi-promo-modal-close:hover {
    background: #10B981;
}
@media (max-width: 992px) {
    .kedi-promo-modal-content {
        flex-direction: column;
    }
}
@media (max-width: 768px) {
    .kedi-promo-banner {
        flex-direction: column;
        text-align: center;
        padding: 20px;
        margin: 15px;
    }
    .kedi-promo-banner-content {
        flex-direction: column;
        margin-bottom: 15px;
    }
}
</style>

<div class="container px-md-0">
    <div class="kedi-promo-banner" onclick="openPromoModal()">
        <div class="kedi-promo-banner-content">
            <div class="promo-thumbs-wrapper">
                <img src="assets/img/promo/kedi-2026-award.jpg" alt="Promo 1" class="kedi-promo-banner-thumb">
                <img src="assets/img/promo/kedi-promo-2.jpg" alt="Promo 2" class="kedi-promo-banner-thumb">
            </div>
            <div class="kedi-promo-banner-text">
                <h4>KEDI 2026 Perform and Win Award 🏆</h4>
                <p>Register and upgrade to Three Star Consultant to win amazing prizes. Offer valid March 10th - May 31st, 2026.</p>
            </div>
        </div>
        <div class="kedi-promo-banner-actions">
            <button class="kedi-promo-btn" onclick="event.stopPropagation(); openPromoModal()"><i class="fas fa-eye"></i> View Posters</button>
            <button class="kedi-promo-btn share" onclick="event.stopPropagation(); sharePromo()"><i class="fas fa-share-alt"></i> Share</button>
        </div>
    </div>
</div>

<div class="kedi-promo-modal" id="kediPromoModal" onclick="closePromoModal()">
    <button class="kedi-promo-modal-close" onclick="closePromoModal()"><i class="fas fa-times"></i></button>
    <div class="kedi-promo-modal-content" onclick="event.stopPropagation()">
        <img src="assets/img/promo/kedi-2026-award.jpg" alt="Kedi Promo 1 Full" class="kedi-promo-modal-img">
        <img src="assets/img/promo/kedi-promo-2.jpg" alt="Kedi Promo 2 Full" class="kedi-promo-modal-img">
    </div>
</div>

<script>
function openPromoModal() {
    document.getElementById('kediPromoModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closePromoModal() {
    document.getElementById('kediPromoModal').classList.remove('active');
    document.body.style.overflow = '';
}
function sharePromo() {
    if (navigator.share) {
        navigator.share({
            title: 'KEDI 2026 Perform and Win Award',
            text: 'Register and upgrade to Three Star Consultant to win amazing prizes! TVs, Refrigerators, Air Conditioners and more! Offer valid till May 31st, 2026.',
            url: window.location.href
        }).catch(console.error);
    } else {
        alert('Share feature is not supported on this browser. Copy the page URL to share!');
    }
}
</script>
<!-- KEDI PROMO BANNER END -->
`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 1. Inject Rich Snippets into <head>
    if (!html.includes('PROMO RICH SNIPPET START')) {
        if (html.includes('</head>')) {
            html = html.replace('</head>', ogTags + '\n</head>');
            modified = true;
        }
    } else {
        // Replace existing rich snippets if we need to update
        html = html.replace(/<!-- PROMO RICH SNIPPET START -->[\s\S]*?<!-- PROMO RICH SNIPPET END -->/, ogTags.trim());
        modified = true;
    }

    // 2. Update Banner
    if (html.includes('KEDI PROMO BANNER START')) {
        // Replace existing
        html = html.replace(/<!-- KEDI PROMO BANNER START -->[\s\S]*?<!-- KEDI PROMO BANNER END -->/, promoHtml.trim());
        modified = true;
    } else {
        // New inject
        if (html.includes('<main>')) {
            html = html.replace('<main>', '<main>\n' + promoHtml);
            modified = true;
        } else if (html.includes('<div class="body_wrap">')) {
            html = html.replace('<div class="body_wrap">', '<div class="body_wrap">\n' + promoHtml);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(file, html, 'utf8');
        console.log('Updated promo logic in ' + file);
    }
});
