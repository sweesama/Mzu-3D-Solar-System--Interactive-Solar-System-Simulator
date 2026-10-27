// 把耶鲁亮星星表（Yale Bright Star Catalog, BSC5，公共领域）转换成网页用的小二进制文件。
// 源文件：http://tdc-www.harvard.edu/catalogs/BSC5 （J2000 坐标，9110 颗肉眼可见的恒星）
// 用法：node build_star_catalog.cjs <BSC5 文件路径>
// 输出：textures/bsc5_stars.bin，每颗星 8 字节：
//   Uint16 赤经（0..65535 对应 0..360°）、Int16 赤纬（-32767..32767 对应 -90..90°）、
//   Int16 星等×100、Uint8 色温索引（0..255 对应 2000..40000 K，按对数刻度）、Uint8 保留
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) { console.error('用法：node build_star_catalog.cjs <BSC5 文件路径>'); process.exit(1); }
const buf = fs.readFileSync(src);

// 文件头 7 个 Int32（小端）：STAR0, STAR1, STARN, STNUM, MPROP, NMAG, NBENT
const starCount = Math.abs(buf.readInt32LE(8));
const entrySize = buf.readInt32LE(24);
if (entrySize !== 32) throw new Error('意外的星表条目长度 ' + entrySize);

// 光谱型 → 表面温度（开尔文）。每类给出 0 和 9 子型的温度，中间线性插值。
const CLASS_TEMP = { O: [45000, 31000], B: [30000, 10500], A: [9800, 7400], F: [7200, 6000], G: [5900, 5300], K: [5250, 3900], M: [3850, 2400] };
function temperatureOf(spec) {
    const range = CLASS_TEMP[spec[0]];
    if (!range) return 6000;                         // 未知光谱型：按类太阳处理
    const sub = /[0-9]/.test(spec[1]) ? Number(spec[1]) : 5;
    return range[0] + (range[1] - range[0]) * sub / 9;
}

const out = Buffer.alloc(starCount * 8);
let kept = 0;
for (let i = 0; i < starCount; i++) {
    const o = 28 + i * entrySize;
    const ra = buf.readDoubleLE(o + 4);             // 弧度
    const dec = buf.readDoubleLE(o + 12);           // 弧度
    const spec = buf.toString('ascii', o + 20, o + 22);
    const mag = buf.readInt16LE(o + 22) / 100;
    if (ra === 0 && dec === 0) continue;            // 星表里被撤销的条目（新星、非恒星）坐标为 0
    const t = temperatureOf(spec);
    const w = kept * 8;
    out.writeUInt16LE(Math.round((ra / (Math.PI * 2)) * 65535) & 0xffff, w);
    out.writeInt16LE(Math.round((dec / (Math.PI / 2)) * 32767), w + 2);
    out.writeInt16LE(Math.round(mag * 100), w + 4);
    out.writeUInt8(Math.round(Math.log(t / 2000) / Math.log(20) * 255), w + 6);
    kept++;
}
const dest = path.join(__dirname, 'textures', 'bsc5_stars.bin');
fs.writeFileSync(dest, out.subarray(0, kept * 8));
console.log(`写出 ${kept} 颗恒星 → ${dest}（${kept * 8} 字节）`);
