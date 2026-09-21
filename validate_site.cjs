const fs = require('fs');
const path = require('path');

const root = __dirname;
const pages = ['index', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'moon'];
const errors = [];
const titles = new Set();
const canonicals = new Set();
const vm = require('node:vm');
const assert = require('node:assert/strict');
function loadBrowserModule(file, name) {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  return context[name];
}
const qualityPolicy = loadBrowserModule('quality-policy.js', 'SolarQualityPolicy');
const lunar = loadBrowserModule('lunar-terrain.js', 'LunarTerrain');
const surface = lunar.createSurface(960, 192);
assert.equal(lunar.noise(12.5, -9.1), lunar.noise(12.5, -9.1));
assert.ok(lunar.height(0, -42) < lunar.height(45, -42), 'Crater floor must be below its rim');
for (const [x, z] of [[0, 6], [-65, 8], [105, 40], [-260, -200], [300, 0]]) {
  assert.ok(Number.isFinite(lunar.sampleSurface(surface, x, z)), 'Terrain must have finite heights');
}
const seedA = lunar.random(42);
const seedB = lunar.random(42);
for (let i = 0; i < 20; i++) assert.equal(seedA(), seedB(), 'Generation must be reproducible');
const flat = { size: 960, segments: 2, heights: new Float32Array(9) };
const blocked = lunar.move(flat, { x: 0, z: 0 }, 10, 0, [{ x: 3, z: 0, radius: 1 }]);
assert.ok(blocked.x < 1.7, 'Walking must not tunnel through a boulder');
const edge = lunar.move(flat, { x: 299, z: 0 }, 5, 0, []);
assert.ok(Math.hypot(edge.x, edge.z) <= lunar.WALK_RADIUS, 'Walking must stay inside the scene');
const triangle = { size: 2, segments: 1, heights: new Float32Array([0, 2, 4, 10]) };
assert.equal(lunar.sampleSurface(triangle, -0.5, -0.5), 1.5);
assert.equal(lunar.sampleSurface(triangle, 0.5, 0.5), 6.5);
const slope = { size: 2, segments: 1, heights: new Float32Array([0, 20, 0, 20]) };
assert.equal(lunar.move(slope, { x: -0.8, z: 0 }, 0.5, 0, []).x, -0.8, 'Steep slopes must block walking');
assert.equal(lunar.GRAVITY, 1.62);
const jumper = lunar.createWalker(flat, { x: 0, z: 0 });
lunar.updateWalker(flat, jumper, { jump: true }, 0.5, []);
assert.ok(Math.abs(jumper.y - (lunar.JUMP_SPEED * 0.5 - 0.5 * lunar.GRAVITY * 0.5 ** 2)) < 1e-9, 'Jump must follow a ballistic arc in metres');
const verticalBefore = jumper.vy;
lunar.updateWalker(flat, jumper, { jump: true }, 0.01, []);
assert.ok(jumper.vy < verticalBefore, 'No double jump while airborne');
for (let i = 0; i < 240; i++) lunar.updateWalker(flat, jumper, {}, 1 / 60, []);
assert.equal(jumper.y, 0, 'Landing must stop at the terrain');
assert.equal(jumper.vy, 0);
assert.equal(jumper.grounded, true);
const at30 = lunar.createWalker(flat, { x: 0, z: 0 });
const at120 = lunar.createWalker(flat, { x: 0, z: 0 });
for (let i = 0; i < 30; i++) lunar.updateWalker(flat, at30, { jump: i === 0 }, 1 / 30, []);
for (let i = 0; i < 120; i++) lunar.updateWalker(flat, at120, { jump: i === 0 }, 1 / 120, []);
assert.ok(Math.abs(at30.y - at120.y) < 1e-9, 'Jump height must not depend on frame rate');
const walker = lunar.createWalker(flat, { x: 0, z: 0 });
lunar.updateWalker(flat, walker, { right: 1, yaw: 0 }, 1 / 60, []);
assert.ok(walker.vx > 0 && walker.vx < lunar.WALK_SPEED, 'Walking must accelerate rather than start instantly');
for (let i = 0; i < 120; i++) lunar.updateWalker(flat, walker, {}, 1 / 60, []);
assert.equal(walker.vx, 0, 'Releasing movement must stop the walker');
assert.ok(Math.abs(walker.bob) < 0.001, 'Standing still must settle the camera');
const aerial = lunar.createWalker(flat, { x: 0, z: 0 });
aerial.vx = 1;
lunar.updateWalker(flat, aerial, { jump: true, right: -1 }, 0.5, []);
assert.ok(Math.abs(aerial.x - 0.5) < 1e-8, 'Airborne movement preserves takeoff momentum, not flight steering');
const wallWalker = lunar.createWalker(flat, { x: 0, z: 0 });
for (let i = 0; i < 240; i++) lunar.updateWalker(flat, wallWalker, { right: 1, yaw: 0, jump: i === 60 }, 1 / 60, [{ x: 3, z: 0, radius: 1 }]);
assert.ok(wallWalker.x < 1.7, 'Jumping must not bypass rock collision');
const expedition = loadBrowserModule('lunar-expedition.js', 'LunarExpedition');
assert.equal(expedition.parseProgress('not-json').length, 0);
assert.equal(expedition.parseProgress('{}').length, 0);
assert.equal(expedition.parseProgress('["crater","crater","invalid"]').length, 1);
assert.equal(expedition.canDiscover({ x: -12, z: 6, grounded: false }, 0), false);
assert.equal(expedition.canDiscover({ x: 0, z: 6, grounded: true }, 0), false);
assert.equal(expedition.canDiscover({ x: -12, z: 6, grounded: true }, 0), true);
assert.equal(expedition.recordDiscovery([], { x: 200, z: 100, grounded: true }, 0).length, 0);
const firstDiscovery = expedition.recordDiscovery([], { x: -12, z: 6, grounded: true }, 0);
assert.equal(expedition.recordDiscovery(firstDiscovery, { x: -12, z: 6, grounded: true }, 0).length, 1);
for (const segments of [192, 288, 384]) {
  const routeSurface = lunar.createSurface(960, segments);
  for (const [from, to] of expedition.edges) {
    const a = expedition.nodes[from], b = expedition.nodes[to];
    for (const [start, end] of [[a, b], [b, a]]) {
      const distance = Math.hypot(end.x - start.x, end.z - start.z);
      let p = start;
      for (let d = 0; d < distance; d += 0.25) {
        const fraction = Math.min(1, (d + 0.25) / distance);
        const next = { x: start.x + (end.x - start.x) * fraction, z: start.z + (end.z - start.z) * fraction };
        const actual = lunar.move(routeSurface, p, next.x - p.x, next.z - p.z, []);
        assert.ok(Math.hypot(actual.x - next.x, actual.z - next.z) < 0.001, `Route ${from}-${to} must be walkable at ${segments} segments`);
        p = next;
      }
    }
  }
}
const direction = expedition.guidance({ x: 0, z: 6 }, 0);
assert.ok(direction.distance > 0 && Number.isFinite(direction.x));
assert.ok(expedition.isOnRoute({ x: -6, z: 6 }, 1));
const moonHtml = fs.readFileSync(path.join(root, 'moon.html'), 'utf8');
assert.match(moonHtml, /id="discover-button"/);
assert.match(moonHtml, /id="discovery-dialog"/);
assert.match(moonHtml, /lunar-expedition\.js/);
assert.match(moonHtml, /id="jump-button"/);
assert.match(moonHtml, /id="motion-button"/);
assert.match(moonHtml, /lunar-terrain\.js/);
assert.match(moonHtml, /moon\.js/);
assert.match(moonHtml, /id="return-orbit"/);
assert.match(moonHtml, /id="touch-pad"/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="moon\.html"/);

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
  const heading = capture(html, /<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/i, 'visible H1', file);
  const robots = capture(html, /<meta name="robots" content="([^"]+)">/i, 'robots directive', file);
  if (!robots.split(/\s*,\s*/).includes('index') || /noindex/i.test(robots)) errors.push(`${file}: public page must allow indexing`);
  capture(html, /<meta property="og:title" content="([^"]+)">/i, 'og:title', file);
  const image = capture(html, /<meta property="og:image" content="([^"]+)">/i, 'og:image', file);
  capture(html, /<meta name="twitter:card" content="([^"]+)">/i, 'Twitter card', file);
  if (image.startsWith('https://www.3dsolarsystem.net/')) {
    const asset = image.slice('https://www.3dsolarsystem.net/'.length);
    if (!fs.existsSync(path.join(root, asset))) errors.push(`${file}: sharing image does not exist`);
  }
  if (page === 'moon' && !/Moon/i.test(heading)) errors.push(`${file}: heading must identify the Moon expedition`);
  if (/id="seo-content"|SEO Content for Crawlers|style="display:\s*none/i.test(html)) errors.push(`${file}: hidden crawler-only content found`);
  if (/GA_MEASUREMENT_ID|ca-pub-XXXXXXXXXX/i.test(html)) errors.push(`${file}: analytics or advertising placeholder found`);
  if (/\b(ultimate|professional-grade|smooth 60fps|ultra-realistic|therapeutic solar system)\b/i.test(html)) errors.push(`${file}: unsupported marketing claim found`);
  if (page !== 'moon' && !/data-focus="Mercury"[\s\S]*data-focus="Neptune"/i.test(html)) errors.push(`${file}: planet navigation is incomplete`);
  const qualityId = page === 'moon' ? 'moon-quality' : 'quality-select';
  if (!new RegExp(`<select id="${qualityId}"[\\s\\S]*value="auto"[\\s\\S]*value="high"[\\s\\S]*value="balanced"[\\s\\S]*value="low"`, 'i').test(html)) {
    errors.push(`${file}: accessible quality selector is incomplete`);
  }
  const engine = page === 'moon' ? 'moon' : 'main';
  if (!new RegExp(`<script src="quality-policy\\.js"></script>[\\s\\S]*<script src="${engine}\\.js"></script>`, 'i').test(html)) {
    errors.push(`${file}: quality policy must load before the scene engine`);
  }
  if (page !== 'moon' && !/href="moon\.html"/.test(html)) errors.push(`${file}: missing Moon expedition link`);

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

console.log(`Validated ${pages.length} pages: unique titles/canonicals, visible content, valid metadata, sitemap coverage, and factual claims. Lunar terrain, movement, and entry-point checks passed.`);
