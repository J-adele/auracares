// scripts/generate_challenges.js
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'health_challenges.json');
const outDir = path.join(__dirname, '..', 'content', 'health_challenges');

// Ensure output directory exists
fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

data.forEach(ch => {
  const fileName = `${ch.id}.md`;
  const filePath = path.join(outDir, fileName);
  const markdown = `# ${ch.name}\n\n## Overview\n*Placeholder description for ${ch.name}.*\n\n## Category\n${ch.category}\n\n## Associated Products\n${ch.products.map(p => `- ${p}`).join('\n')}\n\n## References\n- Placeholder reference.\n`;
  fs.writeFileSync(filePath, markdown, 'utf8');
});

console.log(`Generated ${data.length} markdown files in ${outDir}`);
