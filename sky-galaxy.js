// 真实坐标的星空与银河（首页和探索页共用）。全部由 Three.js 实时生成，不使用银河照片。
//
// 1. 亮星：耶鲁亮星星表 BSC5 的 9096 颗真实恒星（textures/bsc5_stars.bin，由 build_star_catalog.cjs 生成），
//    位置、亮度（星等）、颜色（光谱型 → 色温）都来自星表，所以猎户座、北斗七星等星座都在真实的位置。
// 2. 暗星：数万颗肉眼极限以下的暗星，密度按银河结构分布（银心方向和银道面附近更密，被尘埃挡住的地方更稀）。
// 3. 银河光带：着色器按真实银道坐标（l, b）计算：薄盘 + 厚盘 + 银心核球，叠加有名的星云区域
//    （盾牌座星云、人马座大星云、天鹅座星云、船底座星云）、暗尘带（大暗隙、煤袋、蛇夫座暗云）、
//    红色发射星云（船底座、礁湖、北美、猎户座、巴纳德环）和大、小麦哲伦云、仙女座星系。
//
// 坐标系：场景的 XZ 平面是黄道面，+Y 指向黄道北极，黄经 0°（春分点）指向 +X（与 main.js 中行星公转方向一致）。
(function (root) {
    const DEG = Math.PI / 180;
    const OBLIQUITY = 23.4393 * DEG;                 // J2000 黄赤交角

    // 赤道坐标（赤经、赤纬，弧度）→ 场景方向向量
    function equatorialToScene(ra, dec, target) {
        const cd = Math.cos(dec);
        const x = cd * Math.cos(ra), y = cd * Math.sin(ra), z = Math.sin(dec);
        const ye = y * Math.cos(OBLIQUITY) + z * Math.sin(OBLIQUITY);   // 转到黄道坐标
        const ze = -y * Math.sin(OBLIQUITY) + z * Math.cos(OBLIQUITY);
        return (target || new THREE.Vector3()).set(x, ze, -ye);
    }

    // 银道坐标轴（J2000）：X 指向银心，Z 指向银河北极，Y 指向银经 90°
    const GAL_Z = equatorialToScene(192.85948 * DEG, 27.12825 * DEG);
    const GAL_X = equatorialToScene(266.40500 * DEG, -28.93617 * DEG);
    GAL_X.sub(GAL_Z.clone().multiplyScalar(GAL_X.dot(GAL_Z))).normalize();
    const GAL_Y = new THREE.Vector3().crossVectors(GAL_Z, GAL_X).normalize();

    const NOISE = `
        float hash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float vnoise(vec3 x){
            vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
        float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s / 0.97; }
    `;

    const bandVertex = 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
    const bandFragment = `
        uniform float uIntensity; uniform vec3 uGx; uniform vec3 uGy; uniform vec3 uGz; varying vec3 vDir;
        ${NOISE}
        // 银道坐标 (l, b)，单位：度；l 在 -180..180，0 为银心
        float blob(vec2 p, vec2 c, vec2 r){ vec2 d = p - c; d.x = mod(d.x + 180.0, 360.0) - 180.0; d.x *= cos(radians(p.y)); d /= r; return exp(-dot(d, d)); }
        float ring(vec2 p, vec2 c, float R, float w){ vec2 d = p - c; d.x = mod(d.x + 180.0, 360.0) - 180.0; d.x *= cos(radians(p.y)); float k = (length(d) - R) / w; return exp(-k * k); }
        float dither(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; }
        void main(){
            vec3 d = normalize(vDir);
            vec3 g = vec3(dot(d, uGx), dot(d, uGy), dot(d, uGz));
            float L = degrees(atan(g.y, g.x));
            float B = degrees(asin(clamp(g.z, -1.0, 1.0)));
            vec2 p = vec2(L, B);
            float inner = exp(-L * L / 3600.0);                      // 1 = 朝向银心的半边

            // 结构噪声：沿银道面拉长（垂直方向压缩），并用"域扭曲"把云团扭成丝缕状
            vec3 q = vec3(g.x, g.y, g.z * 2.2);
            float n1 = fbm(q * 3.0 + 4.1);
            vec3 w = vec3(fbm(q * 5.0 + 1.7), fbm(q * 5.0 + 8.3), fbm(q * 5.0 + 3.9)) - 0.5;
            float n2 = fbm(q * 11.0 + w * 2.4);                       // 尘埃丝的主要形状
            float n3 = fbm(g * 34.0 + 7.3);                           // 细小的星云颗粒
            float n4 = vnoise(g * 90.0) * 0.6 + vnoise(g * 190.0) * 0.4; // 更细的颗粒：模拟无数分辨不出的暗星

            // 恒星光：薄盘 + 厚盘 + 核球（核球是银心附近一大团偏黄的老年恒星，上下各延伸十几度）
            float h = 3.0 + 3.0 * inner;
            float disk = (0.28 + 0.72 * exp(-L * L / 3900.0)) * (0.66 * exp(-B * B / (h * h)) + 0.34 * exp(-abs(B) / 9.0));
            float bulge = exp(-1.6 * length(vec2(L / 12.0, (B + 1.0) / 8.5))) + 0.35 * exp(-1.4 * length(vec2(L / 26.0, B / 15.0)));
            float clouds = 0.70 * blob(p, vec2(27.5, -2.5), vec2(3.2, 2.2))   // 盾牌座星云
                         + 0.90 * blob(p, vec2(2.5, -5.0), vec2(5.0, 3.2))    // 人马座大星云
                         + 0.45 * blob(p, vec2(12.0, -0.8), vec2(1.3, 0.9))   // M24 小人马座星云
                         + 0.50 * blob(p, vec2(76.0, 1.5), vec2(7.0, 3.5))    // 天鹅座星云
                         + 0.50 * blob(p, vec2(-73.0, -1.0), vec2(7.0, 3.0))  // 船底座
                         + 0.35 * blob(p, vec2(-33.0, -1.5), vec2(5.0, 2.5))  // 矩尺座
                         + 0.30 * blob(p, vec2(-50.0, 0.0), vec2(6.0, 3.0));  // 半人马座
            float grain = mix(0.55, 1.45, n3) * mix(0.75, 1.25, n4);
            float mottling = mix(0.5, 1.4, n1) * grain;

            // 星际尘埃（光学厚度）：贴着银道面的暗带，在银心到天鹅座一侧最浓，并分叉成"大暗隙"。
            // 边缘用较窄的阈值，暗带轮廓清晰锐利，而不是一团团烟雾
            float lane = exp(-pow((B - 0.6) / (1.5 + 2.2 * inner), 2.0)) * (0.35 + 0.65 * exp(-pow((L - 18.0) / 50.0, 2.0)));
            float rift = exp(-pow((B - 2.8) / 2.0, 2.0)) * smoothstep(5.0, 22.0, L) * smoothstep(88.0, 62.0, L);
            float clump = smoothstep(0.40, 0.62, n2 + 0.3 * (n1 - 0.5));
            float fine = mix(0.55, 1.35, n3);
            float tau = (lane * 3.2 + rift * 2.4) * clump * fine
                      + 2.6 * blob(p, vec2(-58.8, -0.6), vec2(2.6, 2.0)) * mix(0.7, 1.2, n3) // 煤袋星云
                      + 2.4 * blob(p, vec2(-3.0, 6.5), vec2(3.2, 1.1)) * clump                // 烟斗星云
                      + 1.6 * blob(p, vec2(-6.5, 16.0), vec2(3.0, 2.2)) * fine                // 蛇夫座 ρ 暗云
                      + 1.8 * blob(p, vec2(-4.0, 11.0), vec2(1.1, 4.0)) * clump               // 连到银道面的暗云丝
                      + 1.5 * blob(p, vec2(89.0, 2.0), vec2(3.5, 2.0)) * clump                // 北煤袋
                      + 1.2 * blob(p, vec2(173.0, -14.0), vec2(8.0, 5.0)) * clump;            // 金牛座暗云
            float trans = exp(-tau);

            vec3 diskColor = mix(vec3(0.76, 0.82, 1.0), vec3(1.0, 0.92, 0.80), inner);
            vec3 col = (diskColor * (disk + clouds) * mottling + vec3(1.0, 0.84, 0.64) * bulge * 2.2 * grain) * trans;
            col *= mix(vec3(1.0, 0.82, 0.66), vec3(1.0), trans);     // 尘埃边缘的光略微变红（星际红化）

            // 红色发射星云（氢 α）
            float ha = 0.90 * blob(p, vec2(-72.4, -0.6), vec2(1.3, 1.0))      // 船底座大星云
                     + 0.60 * blob(p, vec2(6.0, -1.2), vec2(0.9, 0.7))        // 礁湖、三叶星云
                     + 0.35 * blob(p, vec2(16.5, 0.6), vec2(0.8, 0.6))        // 鹰状、ω 星云
                     + 0.55 * blob(p, vec2(85.0, -1.0), vec2(1.8, 1.4))       // 北美、鹈鹕星云
                     + 0.25 * blob(p, vec2(99.3, 3.7), vec2(1.6, 1.6))        // IC 1396
                     + 0.30 * blob(p, vec2(-153.7, -2.1), vec2(0.8, 0.8))     // 玫瑰星云
                     + 0.60 * blob(p, vec2(-151.0, -19.4), vec2(0.45, 0.6))    // 猎户座大星云
                     + 0.10 * ring(p, vec2(-153.0, -17.5), 7.0, 0.6) * smoothstep(0.45, 0.8, n2) // 巴纳德环
                     + 0.06 * blob(p, vec2(-102.0, -2.0), vec2(15.0, 13.0)) * n1  // 船帆座 Gum 星云
                     + 0.30 * blob(p, vec2(-80.5, -31.7), vec2(0.45, 0.45));  // 大麦哲伦云里的蜘蛛星云
            col += vec3(1.0, 0.28, 0.32) * ha * mix(0.5, 1.3, n2) * mix(0.5, 1.0, trans);

            // 河外星系：大、小麦哲伦云和仙女座星系
            col += vec3(0.86, 0.88, 1.0) * (0.20 * blob(p, vec2(-79.5, -32.9), vec2(4.8, 3.6)) * mix(0.4, 1.5, n3) + 0.22 * blob(p, vec2(-79.0, -33.6), vec2(2.8, 0.8)) * mix(0.6, 1.3, n3)
                                         + 0.12 * blob(p, vec2(-57.2, -44.3), vec2(2.4, 1.5)) * mix(0.5, 1.4, n3)
                                         + 0.10 * blob(p, vec2(121.2, -21.6), vec2(1.6, 0.6)));

            // 柔和的曝光曲线：亮处渐渐饱和，不会像直接放大那样过曝成一片白
            col = 1.0 - exp(-col * uIntensity);
            gl_FragColor = vec4(col, 1.0);
            #include <encodings_fragment>
            #ifndef BAKE
            gl_FragColor.rgb += dither(gl_FragCoord.xy) / 255.0;    // 抖动：消除暗部渐变的色带
            #endif
        }`;

    // 显示烘焙好的立方体贴图：每个像素只采样一次，开销极小
    const cubeFragment = `
        uniform samplerCube uCube; varying vec3 vDir;
        float dither(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; }
        void main(){
            gl_FragColor = vec4(textureCube(uCube, normalize(vDir)).rgb, 1.0);
            #include <encodings_fragment>
            gl_FragColor.rgb += dither(gl_FragCoord.xy) / 255.0;
        }`;

    // 把银河光带在启动时渲染一次到立方体贴图（半精度浮点，避免色带），之后每帧只读贴图。
    // 仍然是代码实时生成的，不是图片文件；只是不必每一帧都重新计算几十次噪声。
    function bakeBand(renderer, uniforms, size) {
        const target = new THREE.WebGLCubeRenderTarget(size, {
            type: THREE.HalfFloatType, format: THREE.RGBAFormat, generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter
        });
        const material = new THREE.ShaderMaterial({
            vertexShader: bandVertex, fragmentShader: bandFragment, side: THREE.BackSide,
            depthWrite: false, depthTest: false, defines: { BAKE: '' }, uniforms
        });
        const bakeScene = new THREE.Scene();
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 128, 96), material);
        bakeScene.add(sphere);
        new THREE.CubeCamera(0.1, 100, target).update(renderer, bakeScene);
        sphere.geometry.dispose();
        material.dispose();
        return target.texture;
    }

    const starVertex = `
        attribute float aMag; attribute vec3 aColor; uniform float uPixelRatio; uniform float uGain;
        varying vec3 vColor;
        void main(){
            float flux = pow(10.0, -0.4 * (aMag - 4.0));                   // 星等 → 亮度（4 等星为 1）
            vColor = aColor * pow(clamp(flux, 0.015, 1.0), 0.7) * uGain;
            gl_PointSize = clamp(1.5 + (4.5 - aMag) * 0.85, 1.5, 6.8) * uPixelRatio;  // 越亮的星光斑越大
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`;
    const starFragment = `
        varying vec3 vColor;
        void main(){
            float r = length(gl_PointCoord - 0.5) * 2.0;
            float a = exp(-r * r * 3.5);
            if (a < 0.02) discard;
            gl_FragColor = vec4(vColor * a, 1.0);
            #include <encodings_fragment>
        }`;

    // 色温 → 颜色（Tanner Helland 黑体近似），再向白色靠拢：真实星星在照片里只是淡淡的蓝白或橙黄
    function temperatureColor(kelvin, target) {
        const t = kelvin / 100;
        const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
        const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
        const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
        const c = (v) => Math.min(1, Math.max(0, v / 255)) * 0.6 + 0.4;
        return target.setRGB(c(r), c(g), c(b));
    }

    // 用于暗星分布的银河亮度近似（与着色器同一模型，去掉噪声）
    function galacticDensity(dir) {
        const gx = dir.dot(GAL_X), gy = dir.dot(GAL_Y), gz = dir.dot(GAL_Z);
        const L = Math.atan2(gy, gx) / DEG, B = Math.asin(Math.max(-1, Math.min(1, gz))) / DEG;
        const inner = Math.exp(-L * L / 3600), h = 3.2 + 2.6 * inner;
        const disk = (0.3 + 0.7 * Math.exp(-L * L / 3900)) * (0.68 * Math.exp(-B * B / (h * h)) + 0.32 * Math.exp(-Math.abs(B) / 10));
        const bulge = Math.exp(-1.7 * Math.hypot(L / 10, (B + 1.2) / 7));
        const lane = Math.exp(-Math.pow((B - 0.4) / (1.4 + 1.3 * inner), 2)) * (0.35 + 0.65 * Math.exp(-Math.pow((L - 18) / 48, 2)));
        return (disk + bulge * 1.5) * Math.exp(-lane * 1.3);
    }

    function makeStarPoints(positions, mags, colors, uniforms) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('aMag', new THREE.Float32BufferAttribute(mags, 1));
        geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3));
        const points = new THREE.Points(geometry, new THREE.ShaderMaterial({
            vertexShader: starVertex, fragmentShader: starFragment, uniforms,
            // 不透明队列 + 关闭深度测试 + 叠加混合：星星在行星之前画好，行星再盖上去；
            // 这样即使真实大小模式把近裁剪面调到极小、远处深度精度失效，星星也不会闪烁或消失
            transparent: false, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false
        }));
        points.frustumCulled = false;
        points.renderOrder = -9;
        return points;
    }

    /**
     * 创建星空 + 银河。
     * @param {object} [options]
     * @param {number} [options.radius=6000]      天空球半径，必须小于相机 far
     * @param {number} [options.intensity=1]      银河光带曝光（1 为默认，适合黑色太空背景）
     * @param {number} [options.starGain=1]       星星整体亮度
     * @param {number} [options.faintStars=30000] 暗星数量（按画质调整）
     * @param {number} [options.pixelRatio=1]     渲染像素比，保证高分屏上星点大小一致
     * @param {string} [options.catalogUrl]       亮星星表二进制文件地址
     * @param {THREE.WebGLRenderer} [options.renderer] 传入后，银河光带会在启动时烘焙成立方体贴图（推荐，省性能）
     * @param {number} [options.bakeSize=2048]    烘焙贴图每个面的边长（像素）
     * @param {THREE.Vector3} [options.centerToward] 可选：让银心朝向这个方向（用于行星表面的本地天空）
     * @returns {THREE.Group} group.userData.setPixelRatio(pr) 可在窗口变化时更新星点大小
     */
    function create(options) {
        const o = options || {};
        const radius = o.radius || 6000;
        const group = new THREE.Group();
        group.name = 'skyGalaxy';
        group.frustumCulled = false;
        // 在行星表面时：把整个天球转一下，让银心出现在指定方向（真实天空中银心的位置随地点和时间变化）
        if (o.centerToward) group.quaternion.setFromUnitVectors(GAL_X, o.centerToward.clone().normalize());

        const bandUniforms = { uIntensity: { value: 0.13 * (o.intensity === undefined ? 1 : o.intensity) }, uGx: { value: GAL_X }, uGy: { value: GAL_Y }, uGz: { value: GAL_Z } };
        let cube = null;
        if (o.renderer) {
            try { cube = bakeBand(o.renderer, bandUniforms, o.bakeSize || 2048); }
            catch (err) { console.warn('银河烘焙失败，改为逐帧计算：', err); }
        }
        const band = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), new THREE.ShaderMaterial({
            vertexShader: bandVertex, fragmentShader: cube ? cubeFragment : bandFragment, side: THREE.BackSide,
            depthWrite: false, depthTest: false, fog: false,
            uniforms: cube ? { uCube: { value: cube } } : bandUniforms
        }));
        band.name = 'milkyWayBand';
        band.renderOrder = -10;                      // 最先画，后面的一切都盖在它上面
        band.frustumCulled = false;
        group.add(band);

        const uniforms = { uPixelRatio: { value: o.pixelRatio || 1 }, uGain: { value: o.starGain === undefined ? 1 : o.starGain } };
        group.userData.setPixelRatio = (pr) => { uniforms.uPixelRatio.value = pr; };
        const starRadius = radius * 0.97;
        const color = new THREE.Color(), dir = new THREE.Vector3();

        // 暗星：按银河密度做接受-拒绝采样；星等 6.5–9.5，越暗越多（每暗 1 等约多 2.5 倍）
        let seed = 917331;
        const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        const faintCount = o.faintStars === undefined ? 30000 : o.faintStars;
        const fp = [], fm = [], fc = [];
        while (fm.length < faintCount) {
            const z = rand() * 2 - 1, phi = rand() * Math.PI * 2, r = Math.sqrt(1 - z * z);
            dir.set(r * Math.cos(phi), z, r * Math.sin(phi));
            if (rand() * 1.9 > 0.12 + galacticDensity(dir)) continue;
            const k = Math.log(2.5), u = rand();
            fm.push(9.5 - Math.log(1 + u * (Math.exp(k * 3) - 1)) / k);
            temperatureColor(3200 + Math.pow(rand(), 1.6) * 9000, color);
            fp.push(dir.x * starRadius, dir.y * starRadius, dir.z * starRadius);
            fc.push(color.r, color.g, color.b);
        }
        group.add(makeStarPoints(fp, fm, fc, uniforms));

        // 亮星：真实星表
        const addCatalog = (buffer) => {
            const view = new DataView(buffer), count = buffer.byteLength / 8;
            const pos = new Float32Array(count * 3), mag = new Float32Array(count), col = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const ra = view.getUint16(i * 8, true) / 65535 * Math.PI * 2;
                const dec = view.getInt16(i * 8 + 2, true) / 32767 * Math.PI / 2;
                equatorialToScene(ra, dec, dir).multiplyScalar(starRadius);
                pos.set([dir.x, dir.y, dir.z], i * 3);
                mag[i] = view.getInt16(i * 8 + 4, true) / 100;
                temperatureColor(2000 * Math.pow(20, view.getUint8(i * 8 + 6) / 255), color);
                col.set([color.r, color.g, color.b], i * 3);
            }
            const stars = makeStarPoints(pos, mag, col, uniforms);
            stars.name = 'brightStarCatalog';
            group.add(stars);
        };
        fetch(o.catalogUrl || 'textures/bsc5_stars.bin')
            .then((res) => { if (!res.ok) throw new Error(res.status); return res.arrayBuffer(); })
            .then(addCatalog)
            .catch((err) => console.warn('亮星星表加载失败，只显示暗星和银河：', err));
        return group;
    }

    root.SkyGalaxy = Object.freeze({ create, equatorialToScene, axes: { x: GAL_X, y: GAL_Y, z: GAL_Z } });
}(typeof globalThis !== 'undefined' ? globalThis : this));
