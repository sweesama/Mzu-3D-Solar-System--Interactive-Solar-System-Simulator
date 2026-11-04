// 从 Gaia 档案馆（ESA，免登录）下载两份天区亮度统计，供 build_galaxy_maps.cjs 使用。
// 匿名查询每次最多返回 50,000 行，而第 7 级 HEALPix 有 196,608 个天区，所以按天区编号分 4 段查询。
// Gaia 的 source_id 除以 2^45 就是第 7 级（ICRS、嵌套编号）天区编号，所以可以直接按 source_id 分段。
// 用法：node fetch_gaia_maps.cjs <输出目录>
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || '.';
const TAP = 'https://gea.esac.esa.int/tap-server/tap/sync';
const STEP = 2 ** 45, CHUNK = 49152;
const QUERIES = {
    gaia_bright: 'phot_g_mean_mag >= 7 AND phot_g_mean_mag < 13',
    gaia_faint: 'random_index < 50000000 AND phot_g_mean_mag >= 13 AND phot_g_mean_mag < 20'
};

async function run() {
    for (const [name, where] of Object.entries(QUERIES)) {
        const lines = ['hpx,n,f'];
        for (let k = 0; k < 4; k++) {
            const lo = BigInt(k * CHUNK) * BigInt(STEP), hi = BigInt((k + 1) * CHUNK) * BigInt(STEP);
            const query = `SELECT GAIA_HEALPIX_INDEX(7, source_id) AS hpx, COUNT(*) AS n, SUM(POWER(10.0, -0.4*phot_g_mean_mag)) AS f FROM gaiadr3.gaia_source WHERE ${where} AND source_id >= ${lo} AND source_id < ${hi} GROUP BY hpx`;
            const body = new URLSearchParams({ REQUEST: 'doQuery', LANG: 'ADQL', FORMAT: 'csv', QUERY: query });
            const res = await fetch(TAP, { method: 'POST', body });
            const text = await res.text();
            if (!res.ok) throw new Error(`${name} 第 ${k + 1} 段失败：${res.status} ${text.slice(0, 300)}`);
            const rows = text.trim().split(/\r?\n/).slice(1);
            if (rows.length >= 50000) throw new Error(`${name} 第 ${k + 1} 段被截断`);
            lines.push(...rows);
            console.log(`${name} 第 ${k + 1}/4 段：${rows.length} 个天区`);
        }
        fs.writeFileSync(path.join(out, name + '.csv'), lines.join('\n'));
    }
}
run().catch((err) => { console.error(err); process.exit(1); });
