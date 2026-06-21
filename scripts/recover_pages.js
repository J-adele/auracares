const path = require('path');
const __dirname_root = path.join(__dirname, '..');
const https = require('https');
const fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function recover() {
    try {
        console.log("Recovering kedi.html...");
        await download('https://kedicare.netlify.app/kedi.html', path.join(__dirname_root, 'kedi.html'));
        console.log("Recovering home-3.html...");
        await download('https://kedicare.netlify.app/home-3.html', path.join(__dirname_root, 'home-3.html'));
        console.log("Recovering Farforlife.html...");
        await download('https://kedicare.netlify.app/Farforlife.html', path.join(__dirname_root, 'Farforlife.html'));
        
        // Make kedi the index
        fs.copyFileSync(path.join(__dirname_root, 'kedi.html'), path.join(__dirname_root, 'index.html'));
        console.log("Recovered files and set index.html to kedi.html successfully.");
    } catch (e) {
        console.error("Recovery failed:", e);
    }
}

recover();
