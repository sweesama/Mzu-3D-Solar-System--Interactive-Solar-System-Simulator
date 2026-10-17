// Turns a small patch of the HiRISE Jezero DTM into a ground-detail file for the Mars expedition.
//
// Source : DTEEC_023247_1985_022957_1985_U01.IMG (HiRISE DTM, 1 m/pixel, 19987 x 8030, 32-bit float, metres)
//          https://hirise-pds.lpl.arizona.edu/PDS/DTM/ESP/ORB_023200_023299/ESP_023247_1985_ESP_022957_1985/
// Output : textures/mars_hirise_jezero_2m.bin  (500 x 500, 16-bit little-endian signed, centimetres)
//
// Only the rows that cover the crop are read, using HTTP range requests, so the full 642 MB file is never downloaded.
// The output stores the *detail* of the ground (height minus its 50 m average), not absolute elevation, so it adds
// real micro-relief on top of the expedition's existing hand-placed terrain without moving stations or the route.
//
// Usage: node build_mars_hirise.cjs

const fs = require('fs');
const path = require('path');

const URL_IMG = 'https://hirise-pds.lpl.arizona.edu/PDS/DTM/ESP/ORB_023200_023299/ESP_023247_1985_ESP_022957_1985/DTEEC_023247_1985_022957_1985_U01.IMG';
const LINES = 19987, SAMPLES = 8030, RECORD_BYTES = 32120, DATA_START = RECORD_BYTES; // image starts at record 2
const MAX_LAT = 18.520587995465, MIN_LAT = 18.180011460397, WEST_LON = 77.54843337, EAST_LON = 77.69009287;
const CENTER_LAT = 18.4, CENTER_LON = 77.62;
const CROP_M = 1000, OUT = 500, STEP = 2; // 1 km window, 2 m per output sample

const lonPerPx = (EAST_LON - WEST_LON) / SAMPLES, latPerPx = (MAX_LAT - MIN_LAT) / LINES;
const centreCol = Math.round((CENTER_LON - WEST_LON) / lonPerPx);
const centreRow = Math.round((MAX_LAT - CENTER_LAT) / latPerPx);
const half = CROP_M / 2;
const row0 = centreRow - half, col0 = centreCol - half;

// The server drops long transfers, so the band is read in ~1 MB chunks, each retried on failure.
async function readRange(start, end, attempts = 5) {
    for (let i = 1; i <= attempts; i++) {
        try {
            const res = await fetch(URL_IMG, { headers: { Range: `bytes=${start}-${end}` } });
            if (res.status !== 206) throw new Error(`HTTP ${res.status}`);
            return Buffer.from(await res.arrayBuffer());
        } catch (error) {
            if (i === attempts) throw error;
            console.warn(`Chunk ${start} failed (${error.message}), retry ${i}`);
        }
    }
}

async function main() {
    const rows = CROP_M, ROWS_PER_CHUNK = 32;
    const parts = [];
    for (let r = 0; r < rows; r += ROWS_PER_CHUNK) {
        const n = Math.min(ROWS_PER_CHUNK, rows - r);
        const start = DATA_START + (row0 + r) * RECORD_BYTES;
        parts.push(await readRange(start, start + n * RECORD_BYTES - 1));
    }
    const band = Buffer.concat(parts);
    console.log(`Downloaded ${band.length} bytes`);
    console.log(`Read ${band.length} bytes for rows ${row0}..${row0 + rows - 1}, cols ${col0}..${col0 + CROP_M - 1}`);

    // 1 m full-resolution crop, read little-endian float32 (PDS PC_REAL)
    const full = new Float32Array(CROP_M * CROP_M);
    for (let r = 0; r < CROP_M; r++) for (let c = 0; c < CROP_M; c++) {
        full[r * CROP_M + c] = band.readFloatLE(r * RECORD_BYTES + (col0 + c) * 4);
    }
    // 2 m average
    const coarse = new Float32Array(OUT * OUT);
    for (let r = 0; r < OUT; r++) for (let c = 0; c < OUT; c++) {
        let sum = 0, n = 0;
        for (let dr = 0; dr < STEP; dr++) for (let dc = 0; dc < STEP; dc++) {
            const v = full[(r * STEP + dr) * CROP_M + c * STEP + dc];
            if (Number.isFinite(v) && v > -1e6) { sum += v; n++; }
        }
        coarse[r * OUT + c] = n ? sum / n : NaN;
    }
    // Fill any gap with the local value before blurring
    for (let i = 0; i < coarse.length; i++) if (!Number.isFinite(coarse[i])) coarse[i] = coarse.find(Number.isFinite) || 0;

    // Detail = height minus a 50 m box average (25 samples of 2 m, separable blur)
    const R = 25;
    const tmp = new Float32Array(OUT * OUT), blur = new Float32Array(OUT * OUT);
    for (let r = 0; r < OUT; r++) for (let c = 0; c < OUT; c++) {
        let s = 0, n = 0;
        for (let k = -R; k <= R; k++) { const cc = c + k; if (cc >= 0 && cc < OUT) { s += coarse[r * OUT + cc]; n++; } }
        tmp[r * OUT + c] = s / n;
    }
    for (let c = 0; c < OUT; c++) for (let r = 0; r < OUT; r++) {
        let s = 0, n = 0;
        for (let k = -R; k <= R; k++) { const rr = r + k; if (rr >= 0 && rr < OUT) { s += tmp[rr * OUT + c]; n++; } }
        blur[r * OUT + c] = s / n;
    }
    const out = Buffer.alloc(OUT * OUT * 2);
    let min = Infinity, max = -Infinity, sumSq = 0;
    for (let i = 0; i < OUT * OUT; i++) {
        const cm = Math.max(-32000, Math.min(32000, Math.round((coarse[i] - blur[i]) * 100)));
        min = Math.min(min, cm); max = Math.max(max, cm); sumSq += cm * cm;
        out.writeInt16LE(cm, i * 2);
    }
    const target = path.join(__dirname, 'textures', 'mars_hirise_jezero_2m.bin');
    fs.writeFileSync(target, out);
    console.log(`Wrote ${target} (${out.length} bytes). Detail range ${min / 100} m to ${max / 100} m, RMS ${(Math.sqrt(sumSq / (OUT * OUT)) / 100).toFixed(2)} m`);
}

main().catch(error => { console.error(error); process.exit(1); });
