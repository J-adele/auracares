const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packageDir = path.join(rootDir, 'health-seo-package');

console.log('🔍 Starting validation of Health SEO Package...');

let exitCode = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    exitCode = 1;
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

// 1. Verify Directory existence
assert(fs.existsSync(packageDir), 'health-seo-package/ exists');

const expectedDirs = [
  'faq',
  'content',
  'content/disease-guides',
  'content/symptom-guides',
  'content/treatment-guides',
  'content/prevention-guides',
  'keywords',
  'ai-search',
  'ai-search/schema-markup',
  'sitemap',
  'metadata',
  'deployment'
];

expectedDirs.forEach(dir => {
  assert(fs.existsSync(path.join(packageDir, dir)), `Directory health-seo-package/${dir} exists`);
});

// 2. Verify specific key files exist
const keyFiles = [
  'faq/diabetes.csv',
  'faq/hypertension.csv',
  'faq/malaria.csv',
  'keywords/paa.csv',
  'keywords/pasf.csv',
  'keywords/long-tail-keywords.csv',
  'keywords/nigeria-trends.csv',
  'ai-search/llms.txt',
  'ai-search/fire.md',
  'ai-search/ai-training-data.md',
  'ai-search/medical-knowledge-base.md',
  'ai-search/treatment-protocols.md',
  'ai-search/symtom-guides.md',
  'sitemap/pages-sitemap.xml',
  'sitemap/blog-sitemap.xml',
  'sitemap/markdown-sitemap.xml',
  'sitemap/schema-sitemap.xml',
  'sitemap/images-sitemap.xml',
  'sitemap/videos-sitemap.xml',
  'sitemap/ai-resources-sitemap.xml',
  'metadata/pages-metadata.json',
  'metadata/condition-metadata.json',
  'deployment/netlify.toml',
  'deployment/README.md'
];

keyFiles.forEach(kf => {
  const fullPath = path.join(packageDir, kf);
  assert(fs.existsSync(fullPath), `File health-seo-package/${kf} exists`);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    assert(size > 0, `File health-seo-package/${kf} is not empty (${size} bytes)`);
  }
});

// 3. Check split guide counts
const healthDir = path.join(rootDir, 'health');
if (fs.existsSync(healthDir)) {
  const origCount = fs.readdirSync(healthDir).filter(f => f.endsWith('.md')).length;
  console.log(`Original health/ markdown count: ${origCount}`);

  ['disease-guides', 'symptom-guides', 'treatment-guides', 'prevention-guides'].forEach(dir => {
    const fullDir = path.join(packageDir, 'content', dir);
    if (fs.existsSync(fullDir)) {
      const count = fs.readdirSync(fullDir).filter(f => f.endsWith('.md')).length;
      assert(count === origCount, `Count of files in content/${dir} (${count}) matches original count (${origCount})`);
    }
  });
}

// 4. Verify CSV formats
function checkCSVHeaders(filePath, expectedHeader) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const firstLine = content.split('\n')[0].trim();
  assert(firstLine === expectedHeader, `${path.basename(filePath)} has correct headers: ${firstLine}`);
}

checkCSVHeaders(path.join(packageDir, 'keywords/paa.csv'), '"Keyword","Question","Answer"');
checkCSVHeaders(path.join(packageDir, 'keywords/pasf.csv'), '"Keyword","Search Query"');
checkCSVHeaders(path.join(packageDir, 'keywords/long-tail-keywords.csv'), '"Keyword","Target Page","Intent"');
checkCSVHeaders(path.join(packageDir, 'keywords/nigeria-trends.csv'), '"Keyword","Search Volume","Intent"');

// 5. Verify JSON formats
function checkJSON(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    assert(true, `${path.basename(filePath)} is valid JSON`);
  } catch (e) {
    assert(false, `${path.basename(filePath)} is NOT valid JSON: ${e.message}`);
  }
}

checkJSON(path.join(packageDir, 'metadata/pages-metadata.json'));
checkJSON(path.join(packageDir, 'metadata/condition-metadata.json'));

const schemasList = ['organization.json', 'physician.json', 'medical-webpage.json', 'medical-condition.json', 'faq.json'];
schemasList.forEach(schema => {
  checkJSON(path.join(packageDir, 'ai-search/schema-markup', schema));
});

// 6. Verify XML format basics
function checkXML(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8').trim();
  const startsWithXml = content.startsWith('<?xml');
  const endsWithUrlset = content.endsWith('</urlset>');
  assert(startsWithXml && endsWithUrlset, `${path.basename(filePath)} has valid XML structure`);
}

fs.readdirSync(path.join(packageDir, 'sitemap')).forEach(xmlFile => {
  if (xmlFile.endsWith('.xml')) {
    checkXML(path.join(packageDir, 'sitemap', xmlFile));
  }
});

if (exitCode === 0) {
  console.log('🎉 ALL VALIDATIONS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ VALIDATION FAILED!');
}

process.exit(exitCode);
