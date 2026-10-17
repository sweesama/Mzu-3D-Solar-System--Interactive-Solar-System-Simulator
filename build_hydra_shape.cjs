// Turns the published Hydra shape model into a small mesh for the web.
//
// Source : Porter et al., "Shape Model of Hydra", figshare 12779975, CC BY 4.0
//          https://figshare.com/articles/online_resource/Shape_Model_of_Hydra/12779975
//          File: hydra_shf1k3_hipoly.stl.gz (ASCII STL, ~52,000 triangles, km units)
// Output : models/hydra_shape.json  { positions: [x,y,z,...], indices: [a,b,c,...] }
//          Normalised so the longest half-extent is 1.
//
// The mesh is decimated by vertex clustering on a grid, which keeps the overall outline and
// the elongated shape while staying small enough for a browser.
//
// Usage: node build_hydra_shape.cjs <path-to-hydra.stl>   (decompressed ASCII STL)

const fs = require('fs');
const path = require('path');

const input = process.argv[2];
const name = process.argv[3] || 'hydra';
if (!input) { console.error('Usage: node build_hydra_shape.cjs <model.stl> [name]'); process.exit(1); }
const text = fs.readFileSync(input, 'utf8');
const re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g;
const verts = [];
let m;
while ((m = re.exec(text))) verts.push([+m[1], +m[2], +m[3]]);
const triCount = verts.length / 3;

const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (const v of verts) for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], v[k]); max[k] = Math.max(max[k], v[k]); }
const centre = min.map((v, k) => (v + max[k]) / 2);
const halfExtent = min.map((v, k) => (max[k] - v) / 2);
const scale = Math.max(...halfExtent);

// Vertex clustering: every vertex is snapped to a grid cell; each cell becomes one averaged vertex.
const CELL_KM = 3.5;
const cellIndex = new Map(), cellSum = [], cellCount = [];
const keyOf = v => v.map((c, k) => Math.floor((c - min[k]) / CELL_KM)).join(',');
const remap = verts.map(v => {
    const key = keyOf(v);
    if (!cellIndex.has(key)) {
        cellIndex.set(key, cellSum.length);
        cellSum.push([0, 0, 0]); cellCount.push(0);
    }
    const id = cellIndex.get(key);
    cellSum[id][0] += v[0]; cellSum[id][1] += v[1]; cellSum[id][2] += v[2]; cellCount[id]++;
    return id;
});

const indices = [];
for (let t = 0; t < triCount; t++) {
    const a = remap[t * 3], b = remap[t * 3 + 1], c = remap[t * 3 + 2];
    if (a !== b && b !== c && a !== c) indices.push(a, b, c);
}

const positions = [], uvs = [];
cellSum.forEach((s, i) => {
    const p = [0, 1, 2].map(k => ((s[k] / cellCount[i]) - centre[k]) / scale);
    for (const c of p) positions.push(Number(c.toFixed(4)));
    // Equirectangular UVs from the direction around the body, so a cylindrical map wraps the shape
    const len = Math.hypot(p[0], p[1], p[2]) || 1;
    uvs.push(Number((Math.atan2(p[2], p[0]) / (2 * Math.PI) + 0.5).toFixed(4)), Number((0.5 - Math.asin(p[1] / len) / Math.PI).toFixed(4)));
});

const outFile = path.join(__dirname, 'models', `${name}_shape.json`);
fs.writeFileSync(outFile, JSON.stringify({ positions, uvs, indices }));
console.log(`Source ${triCount} triangles -> ${indices.length / 3} triangles, ${positions.length / 3} vertices`);
console.log(`Wrote ${outFile} (${fs.statSync(outFile).size} bytes)`);
