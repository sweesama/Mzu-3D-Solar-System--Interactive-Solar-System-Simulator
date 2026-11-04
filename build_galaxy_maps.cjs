// 把两份真实观测数据转换成网页用的两张小数据图（银道坐标、等距圆柱投影，第 0 列为银经 0°、向东增加，第 0 行为银纬 +90°）。
// textures/galaxy_dust.png（灰度 2048×1024）：星际尘埃红化 E(B-V)，来自 Schlegel, Finkbeiner & Davis (1998)
//   全天尘埃图，NASA LAMBDA 提供的 HEALPix 版本 lambda_sfd_ebv.fits（Nside 512，约 7 角分）。
//   编码：(log10(E) + 2.5) / 4.5 * 255，即 E 从 0.003 到 100 星等。
// textures/galaxy_stars.png（RGB 1024×512）：Gaia DR3 实测恒星光，单位"每平方度相当于几颗 0 等星"。
//   R：7 <= G < 13 等恒星（每个天区全部恒星）；G：13 <= G < 20 等恒星（抽样后换算回全部）；
//   编码：(log10(亮度) + 5.0) / 4.5 * 255（实测范围约 1e-5.7 到 1e-0.8）。
//   B：同一分辨率下平均（并模糊）后的 E(B-V)，编码同尘埃图。三个通道都做了 σ≈0.4° 的模糊。
// 网页里银河的亮度来自 Gaia（真实恒星光），暗带来自 SFD（真实尘埃），程序噪声只补充更细的纹理。
// 这两张是数据图，不是照片：每个像素存的是测量值，由着色器换算成颜色。
//
// 用法：node build_galaxy_maps.cjs <lambda_sfd_ebv.fits> <gaia_bright.csv> <gaia_faint.csv> <faintScale>
//   gaia_*.csv 由 Gaia 档案馆 ADQL 查询得到，列为 hpx,n,f（HEALPix 第 7 级、ICRS 坐标，嵌套编号）：
//   SELECT GAIA_HEALPIX_INDEX(7, source_id) AS hpx, COUNT(*) AS n, SUM(POWER(10.0, -0.4*phot_g_mean_mag)) AS f
//   FROM gaiadr3.gaia_source WHERE <星等条件> GROUP BY hpx
//   faintScale：暗星抽样比例的倒数（例如 random_index < 50000000 时约为 1811709771 / 50000000）
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const [sfdPath, brightPath, faintPath, faintScaleArg] = process.argv.slice(2);
if (!sfdPath || !brightPath || !faintPath) {
    console.error('用法：node build_galaxy_maps.cjs <lambda_sfd_ebv.fits> <gaia_bright.csv> <gaia_faint.csv> <faintScale>');
    process.exit(1);
}
const faintScale = Number(faintScaleArg || 1);
const W = 2048, H = 1024;

// ---------- HEALPix（嵌套编号）：方向 → 像素编号 ----------
function spread(v) { let r = 0; for (let i = 0; i < 16; i++) r += ((v >> i) & 1) * Math.pow(4, i); return r; }
function ang2pixNest(nside, z, phi) {
    const za = Math.abs(z);
    let tt = (phi % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) / (Math.PI / 2);
    let face, ix, iy;
    if (za <= 2 / 3) {
        const t1 = nside * (0.5 + tt), t2 = nside * z * 0.75;
        const jp = Math.floor(t1 - t2), jm = Math.floor(t1 + t2);
        const ifp = Math.floor(jp / nside), ifm = Math.floor(jm / nside);
        face = ifp === ifm ? (ifp | 4) : (ifp < ifm ? ifp : ifm + 8);
        ix = jm & (nside - 1);
        iy = nside - (jp & (nside - 1)) - 1;
    } else {
        const ntt = Math.min(3, Math.floor(tt)), tp = tt - ntt, tmp = nside * Math.sqrt(3 * (1 - za));
        const jp = Math.min(nside - 1, Math.floor(tp * tmp)), jm = Math.min(nside - 1, Math.floor((1 - tp) * tmp));
        if (z >= 0) { face = ntt; ix = nside - jm - 1; iy = nside - jp - 1; } else { face = ntt + 8; ix = jp; iy = jm; }
    }
    return face * nside * nside + spread(ix) + 2 * spread(iy);
}

// ---------- 读取 SFD 尘埃图（FITS 二进制表，大端 float32） ----------
function readSfd(file) {
    const buf = fs.readFileSync(file);
    let offset = 0, headers = 0;
    // 跳过主头和扩展头：每个头由 2880 字节的块组成，以 END 卡片结束
    while (headers < 2) {
        let end = false;
        while (!end) {
            for (let c = 0; c < 36; c++) if (buf.toString('ascii', offset + c * 80, offset + c * 80 + 3) === 'END') end = true;
            offset += 2880;
        }
        headers++;
    }
    const npix = 12 * 512 * 512, ebv = new Float32Array(npix);
    for (let i = 0; i < npix; i++) ebv[i] = buf.readFloatBE(offset + i * 8);
    return ebv;
}

// ---------- 读取 Gaia 统计（hpx,n,f） ----------
function readGaia(file, scale) {
    const map = new Float64Array(12 * 128 * 128);
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/).slice(1)) {
        const [hpx, , f] = line.split(',');
        if (hpx !== undefined && f) map[Number(hpx)] = Number(f) * scale;
    }
    return map;
}

// 银道坐标 → ICRS 赤道坐标（IAU 标准转换矩阵的转置）
const A = [[-0.0548755604, -0.8734370902, -0.4838350155], [0.4941094279, -0.4448296300, 0.7469822445], [-0.8676661490, -0.1980763734, 0.4559837762]];
function galToIcrs(v) { return [0, 1, 2].map(j => A[0][j] * v[0] + A[1][j] * v[1] + A[2][j] * v[2]); }

const ebv = readSfd(sfdPath);
const bright = readGaia(brightPath, 1), faint = readGaia(faintPath, faintScale);
const pixArea7 = 41252.96 / (12 * 128 * 128);                  // 第 7 级每个像素的面积（平方度）

const enc = (v, lo, span) => Math.max(0, Math.min(255, Math.round((Math.log10(Math.max(v, 1e-30)) - lo) / span * 255)));
const dirOf = (x, y, w, h) => {
    const b = (0.5 - (y + 0.5) / h) * Math.PI, l = ((x + 0.5) / w) * 2 * Math.PI;
    return { l, v: [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)] };
};

// 尘埃图：2048×1024 灰度
const dust = Buffer.alloc(W * H), dustValue = new Float32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const { l, v } = dirOf(x, y, W, H);
    dustValue[y * W + x] = ebv[ang2pixNest(512, v[2], l)];
    dust[y * W + x] = enc(dustValue[y * W + x], -2.5, 4.5);
}
// 恒星光图：1024×512。R = 亮星，G = 暗星，B = 同样分辨率下平均后的尘埃（网页用它减去"粗尘埃"，
// 只把比 Gaia 天区更细的尘埃细节叠加到 Gaia 实测亮度上，避免重复计算消光：Gaia 测到的本来就是被尘埃挡过之后的光）
const SW = 1024, SH = 512;
const channels = [new Float32Array(SW * SH), new Float32Array(SW * SH), new Float32Array(SW * SH)];
for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    const q = galToIcrs(dirOf(x, y, SW, SH).v);
    const p7 = ang2pixNest(128, q[2], Math.atan2(q[1], q[0]));
    const i = y * SW + x;
    channels[0][i] = bright[p7] / pixArea7;
    channels[1][i] = faint[p7] / pixArea7;
    channels[2][i] = (dustValue[2 * y * W + 2 * x] + dustValue[2 * y * W + 2 * x + 1] + dustValue[(2 * y + 1) * W + 2 * x] + dustValue[(2 * y + 1) * W + 2 * x + 1]) / 4;
}
// 高斯模糊（σ ≈ 1.2 像素 ≈ 0.4°）：抹掉 HEALPix 天区的菱形边缘，并让三张图的分辨率一致；经度方向首尾相接
const kernel = [-3, -2, -1, 0, 1, 2, 3].map(k => Math.exp(-k * k / (2 * 1.2 * 1.2)));
const ksum = kernel.reduce((a, b) => a + b, 0);
for (const ch of channels) {
    const tmp = new Float32Array(SW * SH);
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
        let s = 0; for (let k = -3; k <= 3; k++) s += kernel[k + 3] * ch[y * SW + ((x + k + SW) % SW)];
        tmp[y * SW + x] = s / ksum;
    }
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
        let s = 0; for (let k = -3; k <= 3; k++) s += kernel[k + 3] * tmp[Math.min(SH - 1, Math.max(0, y + k)) * SW + x];
        ch[y * SW + x] = s / ksum;
    }
}
const stars = Buffer.alloc(SW * SH * 3);
for (let i = 0; i < SW * SH; i++) {
    stars[i * 3] = enc(channels[0][i], -5.0, 4.5);
    stars[i * 3 + 1] = enc(channels[1][i], -5.0, 4.5);
    stars[i * 3 + 2] = enc(channels[2][i], -2.5, 4.5);
}

// 抽查几个已知位置，确认坐标没有弄错
const probe = (lDeg, bDeg) => {
    const u = ((lDeg % 360 + 360) % 360) / 360, t = 0.5 - bDeg / 180;
    const d = dust[Math.floor(t * H) * W + Math.floor(u * W)], i = (Math.floor(t * SH) * SW + Math.floor(u * SW)) * 3;
    const ebvValue = Math.pow(10, d / 255 * 4.5 - 2.5).toFixed(3);
    return `E(B-V)=${ebvValue}  亮星=${stars[i]}  暗星=${stars[i + 1]}`;
};
for (const [name, l, b] of [['银心', 0, 0], ['银心上方 20°', 0, 20], ['北银极', 0, 89], ['煤袋星云', 301, -1], ['煤袋旁 6°', 307, -1], ['巴德窗口', 1, -3.9], ['盾牌座星云', 27.5, -2.5], ['反银心', 180, 0], ['大麦哲伦云', 280.5, -32.9]]) {
    console.log(name.padEnd(10), probe(l, b));
}

// ---------- 写 PNG（每行自动选择 PNG 滤波器，压缩更小） ----------
function crc32(buf) { let c, crc = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function writePng(file, pixels, w, h, channels) {
    const stride = w * channels, raw = Buffer.alloc(h * (stride + 1));
    const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
    for (let y = 0; y < h; y++) {
        let best = null, bestScore = Infinity;
        for (let type = 0; type < 5; type++) {
            const row = Buffer.alloc(stride + 1); row[0] = type; let score = 0;
            for (let x = 0; x < stride; x++) {
                const cur = pixels[y * stride + x], a = x >= channels ? pixels[y * stride + x - channels] : 0;
                const b = y > 0 ? pixels[(y - 1) * stride + x] : 0, c = y > 0 && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
                const pred = type === 0 ? 0 : type === 1 ? a : type === 2 ? b : type === 3 ? (a + b) >> 1 : paeth(a, b, c);
                const out = (cur - pred) & 0xff; row[x + 1] = out; score += out < 128 ? out : 256 - out;
            }
            if (score < bestScore) { bestScore = score; best = row; }
        }
        best.copy(raw, y * (stride + 1));
    }
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = channels === 1 ? 0 : 2;
    const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
    fs.writeFileSync(file, png);
    console.log(`写出 ${file}（${(png.length / 1024).toFixed(0)} KB）`);
}
writePng(path.join(__dirname, 'textures', 'galaxy_dust.png'), dust, W, H, 1);
writePng(path.join(__dirname, 'textures', 'galaxy_stars.png'), stars, SW, SH, 3);
