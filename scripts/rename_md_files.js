const fs = require('fs');
const path = require('path');

const healthDir = path.resolve(__dirname, '../health');

const renames = [
    { old: "addison's.md", new: "addisons.md" },
    { old: "alzheimers.md", new: "alzheimmers.md" },
    { old: "carpaltunnel.md", new: "capaltunnel.md" },
    { old: "chronicfatigue.md", new: "chronicfatique.md" },
    { old: "diabeticretinopathy.md", new: "diabeticretinipathy.md" },
    { old: "maculardegeneration.md", new: "masculardegeneration.md" },
    { old: "syphilis.md", new: "sypilis.md" }
];

renames.forEach(r => {
    const oldPath = path.join(healthDir, r.old);
    const newPath = path.join(healthDir, r.new);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${r.old} -> ${r.new}`);
    } else {
        console.log(`Skipped (already renamed or doesn't exist): ${r.old}`);
    }
});
