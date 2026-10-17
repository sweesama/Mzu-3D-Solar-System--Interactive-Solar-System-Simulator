// Crops a region of NASA MOLA Mars topography into a small binary the browser can load.
//
// Input : megt90n000eb.img  (MOLA MEGDR, 16 pixels/degree, 5760 x 2880, 16-bit big-endian, metres)
//         Download from https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg016/
// Output: textures/mars_mola_jezero_16ppd.bin  (640 x 640, 16-bit little-endian signed, metres)
//
// Usage : node build_mars_dem.cjs <path-to-megt90n000eb.img>
//
// The crop is 40 x 40 degrees centred on Jezero crater (18.4 N, 77.5 E), the area the Mars
// expedition's far horizon is built from. Pixel rows run north to south, columns west to east.

const fs = require('fs');
const path = require('path');

const WIDTH = 5760, HEIGHT = 2880, PPD = 16;
const CENTER_LAT = 18.4, CENTER_LON = 77.5, SIZE = 640;

const input = process.argv[2];
if (!input) { console.error('Usage: node build_mars_dem.cjs <megt90n000eb.img>'); process.exit(1); }
const raw = fs.readFileSync(input);
if (raw.length !== WIDTH * HEIGHT * 2) { console.error(`Unexpected file size ${raw.length}`); process.exit(1); }

// Map lat/lon to pixel. Row 0 is the north pole; this file's longitude runs 0-360 east from column 0
// (checked: the highest point, Olympus Mons at 226 E, sits in column ~3620 of 5760).
const topRow = Math.round(1440 - (CENTER_LAT + SIZE / PPD / 2) * PPD);
const leftCol = Math.round((((CENTER_LON - SIZE / PPD / 2) % 360) + 360) % 360 * PPD);

const out = Buffer.alloc(SIZE * SIZE * 2);
let min = Infinity, max = -Infinity;
for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
        const srcRow = Math.min(HEIGHT - 1, Math.max(0, topRow + row));
        const srcCol = (leftCol + col + WIDTH) % WIDTH;
        const value = raw.readInt16BE((srcRow * WIDTH + srcCol) * 2);
        min = Math.min(min, value); max = Math.max(max, value);
        out.writeInt16LE(value, (row * SIZE + col) * 2);
    }
}
const target = path.join(__dirname, 'textures', 'mars_mola_jezero_16ppd.bin');
fs.writeFileSync(target, out);
console.log(`Wrote ${target} (${out.length} bytes), elevation ${min} m to ${max} m`);
