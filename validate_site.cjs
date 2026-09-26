const fs = require('fs');
const path = require('path');

const root = __dirname;
const pages = ['index', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'moon', 'mars-expedition', 'venus-expedition', 'mercury-expedition', 'jupiter-expedition', 'saturn-expedition', 'uranus-expedition'];
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
assert.equal(lunar.EARTH_GRAVITY, 9.8);
const heavy = lunar.createWalker(flat, { x: 0, z: 0 });
lunar.updateWalker(flat, heavy, { jump: true }, 0.2, [], lunar.EARTH_GRAVITY);
assert.ok(Math.abs(heavy.y - (lunar.JUMP_SPEED * 0.2 - 0.5 * lunar.EARTH_GRAVITY * 0.2 ** 2)) < 1e-9, 'Gravity override must change the jump arc');
const moonAudio = loadBrowserModule('lunar-audio.js', 'MoonAudio');
const silentAudio = moonAudio.create();
assert.equal(typeof silentAudio.start, 'function');
silentAudio.step(1); silentAudio.jump(); silentAudio.land(1); silentAudio.chime(); silentAudio.setEnabled(false);
const expedition = loadBrowserModule('lunar-expedition.js', 'LunarExpedition');
assert.equal(expedition.discoveries.length, 5);
assert.equal(expedition.parseProgress('not-json').length, 0);
assert.equal(expedition.parseProgress('{}').length, 0);
assert.equal(expedition.parseProgress('["crater","crater","invalid"]').length, 1);
assert.equal(expedition.canDiscover({ x: -12, z: 6, grounded: false }, 0), false);
assert.equal(expedition.canDiscover({ x: 0, z: 6, grounded: true }, 0), false);
assert.equal(expedition.canDiscover({ x: -12, z: 6, grounded: true }, 0), true);
assert.equal(expedition.canDiscover({ x: 32, z: -60, grounded: true }, 3), true);
assert.equal(expedition.canDiscover({ x: 141, z: -52, grounded: true }, 4), true);
assert.equal(expedition.recordDiscovery([], { x: 200, z: 100, grounded: true }, 0).length, 0);
const firstDiscovery = expedition.recordDiscovery([], { x: -12, z: 6, grounded: true }, 0);
assert.equal(expedition.recordDiscovery(firstDiscovery, { x: -12, z: 6, grounded: true }, 0).length, 1);
const mars = loadBrowserModule('mars-terrain.js', 'MarsTerrain');
assert.equal(mars.GRAVITY, 3.71);
assert.equal(mars.noise(12.5, -9.1), mars.noise(12.5, -9.1));
const marsSurface = mars.createSurface(960, 192);
for (const [x, z] of [[0, 6], [-85, -69], [-78, 108], [31, -63], [106, 101], [300, 0]]) {
  assert.ok(Number.isFinite(mars.sampleSurface(marsSurface, x, z)), 'Mars terrain must have finite heights');
}
const marsJumper = mars.createWalker(flat, { x: 0, z: 0 });
mars.updateWalker(flat, marsJumper, { jump: true }, 0.5, []);
assert.ok(Math.abs(marsJumper.y - (mars.JUMP_SPEED * 0.5 - 0.5 * mars.GRAVITY * 0.5 ** 2)) < 1e-9, 'Mars jump must follow a ballistic arc in metres');
for (let i = 0; i < 240; i++) mars.updateWalker(flat, marsJumper, {}, 1 / 60, []);
assert.equal(marsJumper.grounded, true, 'Mars landing must settle on the terrain');
const marsAudio = loadBrowserModule('mars-audio.js', 'MarsAudio');
const silentMarsAudio = marsAudio.create();
assert.equal(typeof silentMarsAudio.start, 'function');
silentMarsAudio.step(1); silentMarsAudio.jump(); silentMarsAudio.land(1); silentMarsAudio.chime(); silentMarsAudio.setEnabled(false);
const marsExpedition = loadBrowserModule('mars-expedition.js', 'MarsExpedition');
assert.equal(marsExpedition.discoveries.length, 5);
assert.equal(marsExpedition.parseProgress('not-json').length, 0);
assert.equal(marsExpedition.parseProgress('["strata","invalid"]').length, 1);
assert.equal(marsExpedition.canDiscover({ x: -85, z: -69, grounded: true }, 0), true);
assert.equal(marsExpedition.canDiscover({ x: 0, z: 6, grounded: true }, 0), false);
assert.equal(marsExpedition.canDiscover({ x: 31, z: -63, grounded: true }, 3), true);
assert.equal(marsExpedition.canDiscover({ x: 106, z: 101, grounded: true }, 4), true);
for (const segments of [192, 288, 384]) {
  const routeSurface = mars.createSurface(960, segments);
  for (const [from, to] of marsExpedition.edges) {
    const a = marsExpedition.nodes[from], b = marsExpedition.nodes[to];
    for (const [start, end] of [[a, b], [b, a]]) {
      const distance = Math.hypot(end.x - start.x, end.z - start.z);
      let p = start;
      for (let d = 0; d < distance; d += 0.25) {
        const fraction = Math.min(1, (d + 0.25) / distance);
        const next = { x: start.x + (end.x - start.x) * fraction, z: start.z + (end.z - start.z) * fraction };
        const actual = mars.move(routeSurface, p, next.x - p.x, next.z - p.z, []);
        assert.ok(Math.hypot(actual.x - next.x, actual.z - next.z) < 0.001, `Mars route ${from}-${to} must be walkable at ${segments} segments`);
        p = next;
      }
    }
  }
}
const marsDirection = marsExpedition.guidance({ x: 0, z: 6 }, 0);
assert.ok(marsDirection.distance > 0 && Number.isFinite(marsDirection.x));
const venus = loadBrowserModule('venus-terrain.js', 'VenusTerrain');
assert.equal(venus.GRAVITY, 8.87);
assert.equal(venus.noise(12.5, -9.1), venus.noise(12.5, -9.1));
const venusSurface = venus.createSurface(960, 192);
for (const [x, z] of [[0, 6], [-70, -50], [60, 90], [-40, 130], [110, -80], [300, 0]]) {
  assert.ok(Number.isFinite(venus.sampleSurface(venusSurface, x, z)), 'Venus terrain must have finite heights');
}
const venusJumper = venus.createWalker(flat, { x: 0, z: 0 });
venus.updateWalker(flat, venusJumper, { jump: true }, 0.2, []);
assert.ok(Math.abs(venusJumper.y - (venus.JUMP_SPEED * 0.2 - 0.5 * venus.GRAVITY * 0.2 ** 2)) < 1e-9, 'Venus jump must follow a ballistic arc in metres');
for (let i = 0; i < 240; i++) venus.updateWalker(flat, venusJumper, {}, 1 / 60, []);
assert.equal(venusJumper.grounded, true, 'Venus landing must settle on the terrain');
const venusAudio = loadBrowserModule('venus-audio.js', 'VenusAudio');
const silentVenusAudio = venusAudio.create();
assert.equal(typeof silentVenusAudio.start, 'function');
silentVenusAudio.step(1); silentVenusAudio.jump(); silentVenusAudio.land(1); silentVenusAudio.chime(); silentVenusAudio.setEnabled(false);
const venusExpedition = loadBrowserModule('venus-expedition.js', 'VenusExpedition');
assert.equal(venusExpedition.discoveries.length, 5);
assert.equal(venusExpedition.parseProgress('not-json').length, 0);
assert.equal(venusExpedition.parseProgress('["invalid"]').length, 0);
assert.equal(venusExpedition.parseProgress(JSON.stringify([venusExpedition.discoveries[0].id])).length, 1);
for (const [index, discovery] of venusExpedition.discoveries.entries()) {
  assert.ok(venusExpedition.canDiscover({ x: discovery.x, z: discovery.z, grounded: true }, index), `Venus discovery ${discovery.id} must be discoverable at its coordinates`);
  assert.equal(venusExpedition.canDiscover({ x: discovery.x, z: discovery.z, grounded: false }, index), false);
}
assert.equal(venusExpedition.canDiscover({ x: 0, z: 6, grounded: true }, 0), venusExpedition.discoveries[0].radius >= Math.hypot(0 - venusExpedition.discoveries[0].x, 6 - venusExpedition.discoveries[0].z));
for (const segments of [192, 288, 384]) {
  const routeSurface = venus.createSurface(960, segments);
  for (const [from, to] of venusExpedition.edges) {
    const a = venusExpedition.nodes[from], b = venusExpedition.nodes[to];
    for (const [start, end] of [[a, b], [b, a]]) {
      const distance = Math.hypot(end.x - start.x, end.z - start.z);
      let p = start;
      for (let d = 0; d < distance; d += 0.25) {
        const fraction = Math.min(1, (d + 0.25) / distance);
        const next = { x: start.x + (end.x - start.x) * fraction, z: start.z + (end.z - start.z) * fraction };
        const actual = venus.move(routeSurface, p, next.x - p.x, next.z - p.z, []);
        assert.ok(Math.hypot(actual.x - next.x, actual.z - next.z) < 0.001, `Venus route ${from}-${to} must be walkable at ${segments} segments`);
        p = next;
      }
    }
  }
}
const venusDirection = venusExpedition.guidance({ x: 0, z: 6 }, 0);
assert.ok(venusDirection.distance > 0 && Number.isFinite(venusDirection.x));
const mercuryTerrain = loadBrowserModule('mercury-terrain.js', 'MercuryTerrain');
assert.equal(mercuryTerrain.GRAVITY, 3.7);
assert.equal(mercuryTerrain.noise(12.5, -9.1), mercuryTerrain.noise(12.5, -9.1));
const mercurySurface = mercuryTerrain.createSurface(960, 192);
for (const [x, z] of [[0, 6], [-31, -25], [62, -72], [28, -30], [92, 96], [-33, -12], [300, 0]]) {
  assert.ok(Number.isFinite(mercuryTerrain.sampleSurface(mercurySurface, x, z)), 'Mercury terrain must have finite heights');
}
assert.ok(mercuryTerrain.height(-60, -55) < mercuryTerrain.height(-31, -25), 'Mercury crater floor must sit below its rim');
const mercuryJumper = mercuryTerrain.createWalker(flat, { x: 0, z: 0 });
mercuryTerrain.updateWalker(flat, mercuryJumper, { jump: true }, 0.5, []);
assert.ok(Math.abs(mercuryJumper.y - (mercuryTerrain.JUMP_SPEED * 0.5 - 0.5 * mercuryTerrain.GRAVITY * 0.5 ** 2)) < 1e-9, 'Mercury jump must follow a ballistic arc in metres');
for (let i = 0; i < 240; i++) mercuryTerrain.updateWalker(flat, mercuryJumper, {}, 1 / 60, []);
assert.equal(mercuryJumper.grounded, true, 'Mercury landing must settle on the terrain');
const mercuryAudio = loadBrowserModule('mercury-audio.js', 'MercuryAudio');
const silentMercuryAudio = mercuryAudio.create();
assert.equal(typeof silentMercuryAudio.start, 'function');
silentMercuryAudio.step(1); silentMercuryAudio.jump(); silentMercuryAudio.land(1); silentMercuryAudio.chime(); silentMercuryAudio.setEnabled(false);
const mercuryExpedition = loadBrowserModule('mercury-expedition.js', 'MercuryExpedition');
assert.equal(mercuryExpedition.discoveries.length, 5);
assert.equal(mercuryExpedition.parseProgress('not-json').length, 0);
assert.equal(mercuryExpedition.parseProgress('["invalid"]').length, 0);
assert.equal(mercuryExpedition.parseProgress(JSON.stringify([mercuryExpedition.discoveries[0].id])).length, 1);
for (const [index, discovery] of mercuryExpedition.discoveries.entries()) {
  assert.ok(mercuryExpedition.canDiscover({ x: discovery.x, z: discovery.z, grounded: true }, index), `Mercury discovery ${discovery.id} must be discoverable at its coordinates`);
  assert.equal(mercuryExpedition.canDiscover({ x: discovery.x, z: discovery.z, grounded: false }, index), false);
}
for (const segments of [192, 288, 384]) {
  const routeSurface = mercuryTerrain.createSurface(960, segments);
  for (const [from, to] of mercuryExpedition.edges) {
    const a = mercuryExpedition.nodes[from], b = mercuryExpedition.nodes[to];
    for (const [start, end] of [[a, b], [b, a]]) {
      const distance = Math.hypot(end.x - start.x, end.z - start.z);
      let p = start;
      for (let d = 0; d < distance; d += 0.25) {
        const fraction = Math.min(1, (d + 0.25) / distance);
        const next = { x: start.x + (end.x - start.x) * fraction, z: start.z + (end.z - start.z) * fraction };
        const actual = mercuryTerrain.move(routeSurface, p, next.x - p.x, next.z - p.z, []);
        assert.ok(Math.hypot(actual.x - next.x, actual.z - next.z) < 0.001, `Mercury route ${from}-${to} must be walkable at ${segments} segments`);
        p = next;
      }
    }
  }
}
const mercuryDirection = mercuryExpedition.guidance({ x: 0, z: 6 }, 0);
assert.ok(mercuryDirection.distance > 0 && Number.isFinite(mercuryDirection.x));
const jupiterAtmo = loadBrowserModule('jupiter-atmosphere.js', 'JupiterAtmo');
assert.equal(jupiterAtmo.GRAVITY, 24.79);
assert.equal(jupiterAtmo.EARTH_GRAVITY, 9.8);
assert.equal(jupiterAtmo.noise(12.5, -9.1), jupiterAtmo.noise(12.5, -9.1));
const jupiterSurface = jupiterAtmo.createSurface(960, 192);
for (const [x, z] of [[0, 6], [-18, -14], [62, 84], [-124, -44], [-95, 120], [0, -160], [300, 0]]) {
  assert.ok(Number.isFinite(jupiterAtmo.sampleSurface(jupiterSurface, x, z)), 'Jupiter deck must have finite heights');
}
assert.ok(jupiterAtmo.deckHeight(jupiterAtmo.storm.x, jupiterAtmo.storm.z) < jupiterAtmo.deckHeight(jupiterAtmo.storm.x + jupiterAtmo.storm.radius, jupiterAtmo.storm.z), 'Storm eye must dip below its rim');
const sinker = jupiterAtmo.createWalker(flat, { x: 0, z: 0, y: 260 });
for (let i = 0; i < 600; i++) jupiterAtmo.updateWalker(flat, sinker, {}, 1 / 60, []);
assert.ok(Math.abs(sinker.vy + jupiterAtmo.SINK_SPEED) < 0.01, 'Probe must settle at terminal sink rate');
const burner = jupiterAtmo.createWalker(flat, { x: 0, z: 0, y: 200 });
for (let i = 0; i < 600; i++) jupiterAtmo.updateWalker(flat, burner, { jump: true }, 1 / 60, []);
assert.ok(burner.vy > 0 && burner.y > 200 && burner.thrusting, 'Thrust must lift the probe');
const floorProbe = jupiterAtmo.createWalker(flat, { x: 0, z: 0, y: jupiterAtmo.MIN_ALTITUDE + 1 });
for (let i = 0; i < 300; i++) jupiterAtmo.updateWalker(flat, floorProbe, {}, 1 / 60, []);
assert.ok(floorProbe.y >= jupiterAtmo.MIN_ALTITUDE, 'Probe must not sink below the corridor floor');
const ceilingProbe = jupiterAtmo.createWalker(flat, { x: 0, z: 0, y: jupiterAtmo.MAX_ALTITUDE - 1 });
for (let i = 0; i < 300; i++) jupiterAtmo.updateWalker(flat, ceilingProbe, { jump: true }, 1 / 60, []);
assert.ok(ceilingProbe.y <= jupiterAtmo.MAX_ALTITUDE, 'Probe must not climb above the corridor ceiling');
const earthProbe = jupiterAtmo.createWalker(flat, { x: 0, z: 0, y: 260 });
for (let i = 0; i < 600; i++) jupiterAtmo.updateWalker(flat, earthProbe, {}, 1 / 60, [], jupiterAtmo.EARTH_GRAVITY);
assert.ok(Math.abs(earthProbe.vy + jupiterAtmo.SINK_SPEED * jupiterAtmo.EARTH_GRAVITY / jupiterAtmo.GRAVITY) < 0.01, 'Earth gravity must soften the sink rate');
const drifter = jupiterAtmo.createWalker(flat, { x: 0, z: 0, y: 200 });
for (let i = 0; i < 6000; i++) jupiterAtmo.updateWalker(flat, drifter, { forward: 1, yaw: 0 }, 1 / 60, []);
assert.ok(Math.hypot(drifter.x, drifter.z) <= jupiterAtmo.DRIFT_RADIUS + 1e-9, 'Drift must stay inside the descent corridor');
const jupiterAudio = loadBrowserModule('jupiter-audio.js', 'JupiterAudio');
const silentJupiterAudio = jupiterAudio.create();
assert.equal(typeof silentJupiterAudio.start, 'function');
silentJupiterAudio.setDescent(-2.6); silentJupiterAudio.jump(); silentJupiterAudio.thunder(); silentJupiterAudio.chime(); silentJupiterAudio.setEnabled(false);
const jupiterExpedition = loadBrowserModule('jupiter-expedition.js', 'JupiterExpedition');
assert.equal(jupiterExpedition.discoveries.length, 5);
assert.equal(jupiterExpedition.parseProgress('not-json').length, 0);
assert.equal(jupiterExpedition.parseProgress('["invalid"]').length, 0);
assert.equal(jupiterExpedition.parseProgress(JSON.stringify([jupiterExpedition.discoveries[0].id])).length, 1);
for (const [index, discovery] of jupiterExpedition.discoveries.entries()) {
  assert.ok(jupiterExpedition.canDiscover({ x: discovery.x, z: discovery.z, y: discovery.y, grounded: true }, index), `Jupiter discovery ${discovery.id} must be discoverable at its altitude`);
  assert.equal(jupiterExpedition.canDiscover({ x: discovery.x, z: discovery.z, y: discovery.y + 200, grounded: true }, index), false, `Jupiter discovery ${discovery.id} must reject a mismatched altitude`);
}
assert.equal(jupiterExpedition.canDiscover({ x: 0, z: 6, y: 260, grounded: true }, 0), false);
for (const [from, to] of jupiterExpedition.edges) {
  const a = jupiterExpedition.nodes[from], b = jupiterExpedition.nodes[to];
  for (const [start, end] of [[a, b], [b, a]]) {
    const distance = Math.hypot(end.x - start.x, end.z - start.z);
    let p = start;
    for (let d = 0; d < distance; d += 0.25) {
      const fraction = Math.min(1, (d + 0.25) / distance);
      const next = { x: start.x + (end.x - start.x) * fraction, z: start.z + (end.z - start.z) * fraction };
      const actual = jupiterAtmo.move(jupiterSurface, p, next.x - p.x, next.z - p.z, []);
      assert.ok(Math.hypot(actual.x - next.x, actual.z - next.z) < 0.001, `Jupiter route ${from}-${to} must be driftable`);
      p = next;
    }
  }
}
const jupiterDirection = jupiterExpedition.guidance({ x: 0, z: 6 }, 0);
assert.ok(jupiterDirection.distance > 0 && Number.isFinite(jupiterDirection.x));
const jupiterHtml = fs.readFileSync(path.join(root, 'jupiter-expedition.html'), 'utf8');
assert.match(jupiterHtml, /id="discover-button"/);
assert.match(jupiterHtml, /id="discovery-dialog"/);
assert.match(jupiterHtml, /jupiter-expedition\.js/);
assert.match(jupiterHtml, /jupiter-atmosphere\.js/);
assert.match(jupiterHtml, /jupiter-audio\.js/);
assert.match(jupiterHtml, /moon-discoveries\.js/);
assert.match(jupiterHtml, /jupiter\.js/);
assert.match(jupiterHtml, /id="visor"/);
assert.match(jupiterHtml, /id="gravity-button"/);
assert.match(jupiterHtml, /id="touch-pad"/);
assert.match(jupiterHtml, /id="return-orbit"/);
assert.match(jupiterHtml, /index\.html\?focus=Jupiter/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="jupiter-expedition\.html"/);
const mercuryHtml = fs.readFileSync(path.join(root, 'mercury-expedition.html'), 'utf8');
assert.match(mercuryHtml, /id="discover-button"/);
assert.match(mercuryHtml, /id="discovery-dialog"/);
assert.match(mercuryHtml, /mercury-expedition\.js/);
assert.match(mercuryHtml, /mercury-terrain\.js/);
assert.match(mercuryHtml, /mercury-audio\.js/);
assert.match(mercuryHtml, /moon-discoveries\.js/);
assert.match(mercuryHtml, /mercury\.js/);
assert.match(mercuryHtml, /id="visor"/);
assert.match(mercuryHtml, /id="gravity-button"/);
assert.match(mercuryHtml, /id="touch-pad"/);
assert.match(mercuryHtml, /id="return-orbit"/);
assert.match(mercuryHtml, /index\.html\?focus=Mercury/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="mercury-expedition\.html"/);
const saturnRings = loadBrowserModule('saturn-rings.js', 'SaturnRings');
const saturnExpedition = loadBrowserModule('saturn-expedition.js', 'SaturnExpedition');
assert.equal(saturnExpedition.discoveries.length, 5);
assert.equal(saturnExpedition.parseProgress('not-json').length, 0);
assert.equal(saturnExpedition.parseProgress('["ice","invalid"]').length, 1);
assert.equal(saturnExpedition.canDiscover({ x: 42, z: 196, y: 8 }, 1), true);
assert.equal(saturnExpedition.canDiscover({ x: 42, z: 196, y: 120 }, 1), false);
assert.equal(saturnRings.sampleSurface(null, 5, 5), 0);
const saturnBody = saturnRings.createWalker({ x: 0, z: 0 });
saturnBody.y = 50;
saturnRings.updateWalker(saturnBody, { forward: 0, right: 0, yaw: 0 }, 1 / 60);
assert.ok(Number.isFinite(saturnBody.x) && Number.isFinite(saturnBody.y));
assert.ok(saturnBody.y <= 50 + saturnRings.VERTICAL_SPEED + 1, 'Cruise must respect the altitude cap');
const saturnGuidance = saturnExpedition.guidance({ x: 0, z: 140 }, 0);
assert.ok(saturnGuidance.distance >= 0 && Number.isFinite(saturnGuidance.x));
const saturnHtml = fs.readFileSync(path.join(root, 'saturn-expedition.html'), 'utf8');
assert.match(saturnHtml, /id="discover-button"/);
assert.match(saturnHtml, /id="discovery-dialog"/);
assert.match(saturnHtml, /saturn-expedition\.js/);
assert.match(saturnHtml, /saturn-rings\.js/);
assert.match(saturnHtml, /saturn-audio\.js/);
assert.match(saturnHtml, /moon-discoveries\.js/);
assert.match(saturnHtml, /saturn\.js/);
assert.match(saturnHtml, /id="visor"/);
assert.match(saturnHtml, /id="gravity-button"/);
assert.match(saturnHtml, /id="touch-pad"/);
assert.match(saturnHtml, /id="return-orbit"/);
assert.match(saturnHtml, /index\.html\?focus=Saturn/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="saturn-expedition\.html"/);
assert.match(fs.readFileSync(path.join(root, 'saturn.html'), 'utf8'), /href="saturn-expedition\.html"/);
assert.ok(fs.existsSync(path.join(root, 'models', 'cassini.glb')), 'Cassini model must exist');
const uranusRings = loadBrowserModule('uranus-rings.js', 'UranusRings');
const uranusExpedition = loadBrowserModule('uranus-expedition.js', 'UranusExpedition');
assert.equal(uranusExpedition.discoveries.length, 5);
assert.equal(uranusExpedition.parseProgress('not-json').length, 0);
assert.equal(uranusExpedition.parseProgress('["epsilon","invalid"]').length, 1);
assert.equal(uranusExpedition.canDiscover({ x: 40, z: -410, y: 9 }, 1), true);
assert.equal(uranusExpedition.canDiscover({ x: 40, z: -410, y: 120 }, 1), false);
assert.equal(uranusRings.sampleSurface(null, 5, 5), 0);
const uranusBody = uranusRings.createWalker({ x: 0, z: 0 });
uranusBody.y = 50;
uranusRings.updateWalker(uranusBody, { forward: 0, right: 0, yaw: 0 }, 1 / 60);
assert.ok(Number.isFinite(uranusBody.x) && Number.isFinite(uranusBody.y));
assert.ok(uranusBody.y <= 50 + uranusRings.VERTICAL_SPEED + 1, 'Cruise must respect the altitude cap');
const uranusGuidance = uranusExpedition.guidance({ x: 0, z: 100 }, 0);
assert.ok(uranusGuidance.distance >= 0 && Number.isFinite(uranusGuidance.x));
const uranusHtml = fs.readFileSync(path.join(root, 'uranus-expedition.html'), 'utf8');
assert.match(uranusHtml, /id="discover-button"/);
assert.match(uranusHtml, /id="discovery-dialog"/);
assert.match(uranusHtml, /uranus-expedition\.js/);
assert.match(uranusHtml, /uranus-rings\.js/);
assert.match(uranusHtml, /uranus-audio\.js/);
assert.match(uranusHtml, /moon-discoveries\.js/);
assert.match(uranusHtml, /uranus\.js/);
assert.match(uranusHtml, /id="gravity-button"/);
assert.match(uranusHtml, /id="touch-pad"/);
assert.match(uranusHtml, /id="return-orbit"/);
assert.match(uranusHtml, /index\.html\?focus=Uranus/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="uranus-expedition\.html"/);
assert.match(fs.readFileSync(path.join(root, 'uranus.html'), 'utf8'), /href="uranus-expedition\.html"/);
assert.ok(fs.existsSync(path.join(root, 'models', 'voyager.glb')), 'Voyager model must exist');
const venusHtml = fs.readFileSync(path.join(root, 'venus-expedition.html'), 'utf8');
assert.match(venusHtml, /id="discover-button"/);
assert.match(venusHtml, /id="discovery-dialog"/);
assert.match(venusHtml, /venus-expedition\.js/);
assert.match(venusHtml, /venus-terrain\.js/);
assert.match(venusHtml, /venus-audio\.js/);
assert.match(venusHtml, /moon-discoveries\.js/);
assert.match(venusHtml, /venus\.js/);
assert.match(venusHtml, /id="visor"/);
assert.match(venusHtml, /id="gravity-button"/);
assert.match(venusHtml, /id="touch-pad"/);
assert.match(venusHtml, /id="return-orbit"/);
assert.match(venusHtml, /index\.html\?focus=Venus/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="venus-expedition\.html"/);
const marsHtml = fs.readFileSync(path.join(root, 'mars-expedition.html'), 'utf8');
assert.match(marsHtml, /id="discover-button"/);
assert.match(marsHtml, /id="discovery-dialog"/);
assert.match(marsHtml, /mars-expedition\.js/);
assert.match(marsHtml, /mars-terrain\.js/);
assert.match(marsHtml, /mars-audio\.js/);
assert.match(marsHtml, /moon-discoveries\.js/);
assert.match(marsHtml, /mars\.js/);
assert.match(marsHtml, /id="visor"/);
assert.match(marsHtml, /id="gravity-button"/);
assert.match(marsHtml, /id="touch-pad"/);
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /href="mars-expedition\.html"/);
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
assert.match(moonHtml, /lunar-audio\.js/);
assert.match(moonHtml, /id="visor"/);
assert.match(moonHtml, /id="gravity-button"/);
assert.match(moonHtml, /id="sound-button"/);
assert.match(moonHtml, /id="gravity-value"/);
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
  if (page === 'mars-expedition' && !/Mars/i.test(heading)) errors.push(`${file}: heading must identify the Mars expedition`);
  if (page === 'venus-expedition' && !/Venus/i.test(heading)) errors.push(`${file}: heading must identify the Venus expedition`);
  if (page === 'mercury-expedition' && !/Mercury/i.test(heading)) errors.push(`${file}: heading must identify the Mercury expedition`);
  if (page === 'jupiter-expedition' && !/Jupiter/i.test(heading)) errors.push(`${file}: heading must identify the Jupiter descent`);
  if (page === 'saturn-expedition' && !/Saturn/i.test(heading)) errors.push(`${file}: heading must identify the Saturn cruise`);
  if (page === 'uranus-expedition' && !/Uranus/i.test(heading)) errors.push(`${file}: heading must identify the Uranus flight`);
  if (/id="seo-content"|SEO Content for Crawlers|style="display:\s*none/i.test(html)) errors.push(`${file}: hidden crawler-only content found`);
  if (/GA_MEASUREMENT_ID|ca-pub-XXXXXXXXXX/i.test(html)) errors.push(`${file}: analytics or advertising placeholder found`);
  if (/\b(ultimate|professional-grade|smooth 60fps|ultra-realistic|therapeutic solar system)\b/i.test(html)) errors.push(`${file}: unsupported marketing claim found`);
  const isExpedition = page === 'moon' || page === 'mars-expedition' || page === 'venus-expedition' || page === 'mercury-expedition' || page === 'jupiter-expedition' || page === 'saturn-expedition' || page === 'uranus-expedition';
  if (!isExpedition && !/data-focus="Mercury"[\s\S]*data-focus="Neptune"/i.test(html)) errors.push(`${file}: planet navigation is incomplete`);
  const qualityId = isExpedition ? 'moon-quality' : 'quality-select';
  if (!new RegExp(`<select id="${qualityId}"[\\s\\S]*value="auto"[\\s\\S]*value="high"[\\s\\S]*value="balanced"[\\s\\S]*value="low"`, 'i').test(html)) {
    errors.push(`${file}: accessible quality selector is incomplete`);
  }
  const engine = page === 'moon' ? 'moon' : page === 'mars-expedition' ? 'mars' : page === 'venus-expedition' ? 'venus' : page === 'mercury-expedition' ? 'mercury' : page === 'jupiter-expedition' ? 'jupiter' : page === 'saturn-expedition' ? 'saturn' : page === 'uranus-expedition' ? 'uranus' : 'main';
  if (!new RegExp(`<script src="quality-policy\\.js"></script>[\\s\\S]*<script src="${engine}\\.js"></script>`, 'i').test(html)) {
    errors.push(`${file}: quality policy must load before the scene engine`);
  }
  if (!isExpedition && !/href="moon\.html"/.test(html)) errors.push(`${file}: missing Moon expedition link`);
  if (!isExpedition && !/href="mars-expedition\.html"/.test(html)) errors.push(`${file}: missing Mars expedition link`);
  if (!isExpedition && !/href="venus-expedition\.html"/.test(html)) errors.push(`${file}: missing Venus expedition link`);
  if (!isExpedition && !/href="mercury-expedition\.html"/.test(html)) errors.push(`${file}: missing Mercury expedition link`);
  if (!isExpedition && !/href="saturn-expedition\.html"/.test(html)) errors.push(`${file}: missing Saturn expedition link`);
  if (!isExpedition && !/href="uranus-expedition\.html"/.test(html)) errors.push(`${file}: missing Uranus expedition link`);

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
