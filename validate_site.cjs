const fs = require('fs');
const path = require('path');

const root = __dirname;
const pages = ['index', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const errors = [];
const titles = new Set();
const canonicals = new Set();
const qualityPolicy = require('./quality-policy.js');

function capture(html, expression, label, file) {
  const match = html.match(expression);
  if (!match) {
    errors.push(`${file}: missing ${label}`);
    return '';
  }
  return match[1].trim();
}

for (const page of pages) {
  const file = page === 'index' ? 'index.html' : `${page}.html`;
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const title = capture(html, /<title>([\s\S]*?)<\/title>/i, 'title', file);
  const description = capture(html, /<meta name="description" content="([^"]+)">/i, 'description', file);
  const canonical = capture(html, /<link rel="canonical" href="([^"]+)">/i, 'canonical', file);
  const ogUrl = capture(html, /<meta property="og:url" content="([^"]+)">/i, 'og:url', file);

  if (titles.has(title)) errors.push(`${file}: duplicate title: ${title}`);
  if (canonicals.has(canonical)) errors.push(`${file}: duplicate canonical: ${canonical}`);
  titles.add(title);
  canonicals.add(canonical);

  if (description.length < 90 || description.length > 180) errors.push(`${file}: description length is ${description.length}`);
  if (canonical !== ogUrl) errors.push(`${file}: og:url does not match canonical`);
  if (!/<h1>[^<]+<\/h1>/i.test(html)) errors.push(`${file}: no visible H1`);
  if (/id="seo-content"|SEO Content for Crawlers|style="display:\s*none/i.test(html)) errors.push(`${file}: hidden crawler-only content found`);
  if (/GA_MEASUREMENT_ID|ca-pub-XXXXXXXXXX/i.test(html)) errors.push(`${file}: analytics or advertising placeholder found`);
  if (/\b(ultimate|professional-grade|smooth 60fps|ultra-realistic|therapeutic solar system)\b/i.test(html)) errors.push(`${file}: unsupported marketing claim found`);
  if (!/data-focus="Mercury"[\s\S]*data-focus="Neptune"/i.test(html)) errors.push(`${file}: planet navigation is incomplete`);
  if (!/<select id="quality-select"[\s\S]*value="auto"[\s\S]*value="high"[\s\S]*value="balanced"[\s\S]*value="low"/i.test(html)) {
    errors.push(`${file}: accessible quality selector is incomplete`);
  }
  if (!/<script src="quality-policy\.js"><\/script>[\s\S]*<script src="main\.js"><\/script>/i.test(html)) {
    errors.push(`${file}: quality policy must load before the scene engine`);
  }

  const jsonLd = capture(html, /<script id="app-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/i, 'structured data', file);
  if (jsonLd) {
    try { JSON.parse(jsonLd); } catch (error) { errors.push(`${file}: invalid structured data JSON (${error.message})`); }
  }
}

const qualityScenarios = [
  {
    label: 'low-end mobile',
    signals: { deviceMemory: 2, hardwareThreads: 4, compactViewport: true, viewportPixels: 1400000 },
    expected: 'low'
  },
  {
    label: 'flagship mobile',
    signals: { deviceMemory: 8, hardwareThreads: 8, compactViewport: true, viewportPixels: 1800000 },
    expected: 'high'
  },
  {
    label: 'unknown mobile',
    signals: { deviceMemory: 0, hardwareThreads: 8, compactViewport: true, viewportPixels: 1800000 },
    expected: 'balanced'
  },
  {
    label: 'strong desktop with hidden memory signal',
    signals: { deviceMemory: 0, hardwareThreads: 12, compactViewport: false, viewportPixels: 3600000 },
    expected: 'high'
  },
  {
    label: 'high-resolution display',
    signals: { deviceMemory: 8, hardwareThreads: 8, compactViewport: false, viewportPixels: 9000000 },
    expected: 'balanced'
  },
  {
    label: 'data-saving device',
    signals: { deviceMemory: 16, hardwareThreads: 12, compactViewport: false, viewportPixels: 2000000, saveData: true },
    expected: 'low'
  }
];

for (const scenario of qualityScenarios) {
  const actual = qualityPolicy.chooseAutomaticQuality(scenario.signals);
  if (actual !== scenario.expected) {
    errors.push(`quality policy: ${scenario.label} expected ${scenario.expected}, received ${actual}`);
  }
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const canonical of canonicals) {
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`sitemap.xml: missing ${canonical}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site.webmanifest'), 'utf8'));
if (manifest.lang !== 'en') errors.push('site.webmanifest: lang must be en');
if (!manifest.icons.some(icon => icon.sizes === '192x192')) errors.push('site.webmanifest: missing 192x192 icon');
if (!manifest.icons.some(icon => icon.sizes === '512x512')) errors.push('site.webmanifest: missing 512x512 icon');

for (const file of ['llms.txt', 'llms-full.txt']) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  if (/\b(ultimate|professional-grade|smooth 60fps|ultra-realistic|therapeutic solar system)\b/i.test(text)) {
    errors.push(`${file}: unsupported marketing claim found`);
  }
}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${pages.length} pages: unique titles/canonicals, visible content, valid metadata, sitemap coverage, and factual claims.`);
