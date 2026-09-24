(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.LunarExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
    const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: "EARTH'S MOON", surfaceMode: 'SURFACE EXPLORATION',
            chapter: 'EXPEDITION 001 / THE NEAR SIDE', title: 'Walk on\nthe Moon.', intro: 'Walk an imagined lunar landscape, jump in low gravity, and discover craters, rocks, and Earth above the horizon.', begin: 'Step onto the Moon', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by lunar science.', gravity: 'GRAVITY', atmosphere: 'ATMOSPHERE', vacuum: 'Near vacuum', distance: 'FROM ARRIVAL',
            walkingHint: 'W A S D to walk · drag to look · Space to jump · G gravity · M sound', touchHint: 'Arrows to walk · drag to look · tap Jump to leap', station0: 'Crater overlook', station1: 'Boulder field', station2: 'Home in the sky',
            astronaut: 'ASTRONAUT', jump: 'Jump', grounded: 'On the surface', airborne: 'Airborne', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable head motion for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SCANNED LANDING SITE',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Preparing the lunar landscape…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'Take the long way home.',
            guideIntro: 'This is a small, freely explorable lunar landscape, not a whole-planet simulation. The five observation points are different views of the same place; two of them can only be reached on foot.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityLunar: 'Back to lunar gravity · G', gravityHint: 'Same takeoff push, different fall. Feel how little height a jump gives under Earth gravity.', soundOn: 'Suit sounds: On', soundOff: 'Suit sounds: Off', soundHint: 'A quiet life-support hum, footfalls and a radio chime inside the suit — the airless surface itself is silent. M toggles.', gravityMoon: 'Lunar gravity — 1.62 m/s².', gravityEarth: 'Earth gravity — 9.8 m/s². Same push, far less height.', moonTag: 'MOON', earthTag: 'EARTH',
            controlsText: 'You are exploring on foot as an astronaut. Walk with W A S D or the arrow keys; Shift gives a brisker pace. Press Space to jump, then wait to land before jumping again. Momentum carries you forward in the air. Drag to look, including down at your boots. Touchscreens have direction and Jump buttons. G compares Earth gravity; M toggles suit sounds. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: "Impact craters, airless skies, subdued rock colors, and hard sunlight are inspired by lunar science. Terrain, rock placement, and observation points are procedural art, not survey data. Earth's apparent size and placement are composed for this scene, not calculated for a real date or location.",
            soundText: "In this near vacuum there is no wind to hear; the sounds come from inside the suit — a quiet life-support hum, footfalls conducted through the body, and a radio chime for each discovery. Jumps use a constant lunar surface gravity of 1.62 m/s²; press G to feel Earth's 9.8 m/s² with the same takeoff push. The chosen 1.8 m/s takeoff gives about 1 metre of rise and 2.2 seconds in the air on level ground. Pace, takeoff strength, and camera motion are comfort settings, not a full spacesuit simulation.",
            assetText: "Earth imagery: Solar System Scope, CC BY 4.0, using the site's existing textures. Boulder and lunar module models: NASA 3D Resources. Terrain and scatter textures are generated locally in your browser.",
            featuresTitle: 'What you are seeing', features: [
                ['Glass-bead soil', 'The regolith glints — Apollo crews called the soil "sparkly". Watch for bright specks near your boots.'],
                ['Micro-craters', 'The ground is peppered with centimetre-scale pits from endless micrometeorite rain.'],
                ['Rock fillets', 'Dust ramped against the base of every big boulder — a signature lunar look.'],
                ['Black-sky daylight', 'No air to scatter light: the sky stays black at noon and shadows are razor-sharp.'],
                ['Earth overhead', 'It hangs almost still in the lunar sky — from here it never sets, and it shines about four times brighter than a full Moon does at home.'],
                ['Horizon glow', 'A faint bright band hugs the horizon toward the Sun — Apollo crews reported dust levitating and scattering light there.'],
                ['Your footprints', 'Nothing erodes them — Apollo’s boot prints are still up there after fifty years.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this expedition. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'Earth imagery is unavailable; a simple globe is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['A history of impacts', 'The raised rim and sunken bowl tell the same story: an impact scattered rock outward. Without wind or rain, these scars can remain for billions of years.', 'LANDSCAPE', 'Impact crater'],
                ['Written in stone', 'Impacts break, scatter, and bury rock. Look closely at the angular boulders and the fine blanket of regolith beneath them. Nothing here is shaped by a breeze.', 'SURFACE', 'Rock & regolith'],
                ['Everything we call home', 'From much of the near side, Earth stays in roughly the same part of the sky. The Moon turns once per orbit, keeping nearly the same face toward home.', 'ROTATION', 'Tidally locked'],
                ['Eagle has landed', 'Between 1969 and 1972, six Apollo crews landed on the Moon. Their lunar modules\u2019 descent stages still rest on the surface today. This module is a real model from NASA\u2019s 3D archive, placed here as a tribute.', 'SPACECRAFT', 'Lunar module'],
                ['Where sunlight never rests', 'The bowl below holds pockets of deep shadow. Near the real lunar poles, some crater floors have not seen the Sun for billions of years — and may preserve water ice.', 'LIGHT', 'Shadowed hollow']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '地球的月亮', surfaceMode: '月面探索', chapter: '探索 001 / 月球正面', title: '漫步月球。',
            intro: '走进一片艺术重建的月面，在低重力中跳跃，探索环形山与岩石，遥望地平线上方的地球。', begin: '踏上月球', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受月球科学启发的虚构地点。',
            gravity: '月面重力', atmosphere: '大气环境', vacuum: '接近真空', distance: '距抵达点', walkingHint: 'W A S D 行走 · 拖动转头 · 空格跳跃 · G 重力 · M 声音', touchHint: '方向按钮行走 · 拖动画面转头 · 点击跳跃',
            astronaut: '宇航员视角', jump: '跳跃', grounded: '双脚着地', airborne: '腾空中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭头部起伏可获得更平稳的视角。',
            station0: '环形山眺望点', station1: '岩石原野', station2: '天空中的家园', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实着陆点扫描', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在准备月面风景…', fieldGuide: '月球探索指南', guideTitle: '慢一点，看看远方。',
            guideIntro: '这是一片可以自由漫游的月面区域，而非完整月球。五个观察点都位于同一个场景，其中两个只能徒步走到。', controlsTitle: '如何探索',
            gravityCompare: '对比地球重力 · G', gravityLunar: '恢复月球重力 · G', gravityHint: '同样的起跳力度，不同的下落感受。切换到地球重力，体验跳跃高度骤减。', soundOn: '宇航服声音：开', soundOff: '宇航服声音：关', soundHint: '维生风扇的低鸣、脚步的体内传导声与发现时的无线电提示音——月面本身寂静无声。M 切换。', gravityMoon: '月球重力 — 1.62 m/s²。', gravityEarth: '地球重力 — 9.8 m/s²。同样的起跳，高度骤减。', moonTag: '月球', earthTag: '地球',
            controlsText: '你是一位徒步探索的宇航员。W A S D 或方向键行走，Shift 快步，空格跳跃，落地后才能再次起跳。腾空时保留起跳时的水平惯性，不能像飞行器一样转向。拖动画面观察，也可以低头看看自己的靴子。触屏有方向按钮和跳跃键。G 对比地球重力，M 开关宇航服声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '撞击坑、漆黑天空、低饱和度岩石和强烈日照来自月球科学常识。地形、岩石分布与观察点由程序创作，并非实测地形。地球在天空中的位置和视觉大小经过构图处理，不对应真实日期或坐标。',
            soundText: '接近真空的环境里没有风声；你听到的来自宇航服内部——维生风扇的低鸣、经身体传导的脚步，以及记录发现时的无线电提示音。跳跃使用月面平均重力 1.62 m/s²；按 G 可用相同的起跳力度感受地球 9.8 m/s² 的重力。设定的起跳速度为 1.8 m/s，在平地约跳高 1 米、腾空 2.2 秒。步速、起跳力度和镜头起伏经过舒适性设计，不是完整的宇航服物理模拟。',
            assetText: '地球影像：Solar System Scope，CC BY 4.0，复用网站已有贴图。巨石与登月舱模型：NASA 三维模型库。地形与散布纹理由浏览器本地生成。',
            featuresTitle: '你眼前的景观', features: [
                ['玻璃微珠月壤', '月壤会闪光——阿波罗宇航员形容它"亮晶晶的"。注意你靴边零星的光点。'],
                ['微小撞击坑', '地面布满厘米级小坑，来自永不停歇的微陨石雨。'],
                ['岩根土堆', '每块巨石根部都堆起一圈月壤——月球上标志性的细节。'],
                ['白昼黑天', '没有大气散射阳光：正午的天空依然漆黑，影子边缘锋利如刀。'],
                ['头顶的地球', '它几乎一动不动地挂在月空——从这里看它永不落下，亮度约是满月的四倍。'],
                ['地平线辉光', '朝着太阳方向的地平线有一圈微弱亮带——阿波罗宇航员报告过悬浮尘埃散射出的这种光。'],
                ['你的脚印', '没有风没有水，脚印永不磨灭——阿波罗的靴印至今仍留在月面。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次探索区域边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '地球影像暂时无法加载，已显示简化球体。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['撞击留下的岁月', '隆起的边缘与下陷的坑底，记录着一次猛烈撞击。没有风雨侵蚀，这样的痕迹可以留存数十亿年。', '地貌类型', '撞击坑'],
                ['石头里的故事', '撞击打碎、抛散并掩埋岩石。看看这些棱角分明的石块，以及覆盖地面的细碎月壤。这里没有微风雕刻的痕迹。', '地表组成', '岩石与月壤'],
                ['我们称之为家园', '在月球正面许多地方，地球大致停留在天空的同一片区域。月球绕地球一周时也恰好自转一周，始终以近乎同一面朝向家园。', '自转特点', '潮汐锁定'],
                ['鹰已着陆', '1969 至 1972 年间，六艘阿波罗登月舱降落月面，它们的下降级至今仍留在那里。这台登月舱是 NASA 公开模型库的真实三维模型，在此作为致敬摆放。', '航天器', '登月舱'],
                ['阳光照不到的地方', '脚下的坑底藏着深深的阴影。在真实的月球两极，一些坑底数十亿年未见阳光——那里可能保存着水冰。', '光照特点', '阴影坑']
            ]
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, surface, sunlight, walker, astronaut, animationId = null;
    let jumpRequested = false, motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = -0.12, pitch = -0.06, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = LunarTerrain.GRAVITY, audio = null, soundEnabled = true;
    let footprints = null, printCursor = 0, lastPrintMark = 0;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set(), obstacles = [];
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null, composer = null, fxaaPass = null, cinePass = null;
    const isDialogOpen = () => $('guide-dialog').open || $('discovery-dialog').open;
    const position = { x: stations[0].x, z: stations[0].z };
    const touchDevice = matchMedia('(pointer: coarse)').matches;
    const policy = window.SolarQualityPolicy;
    let savedQuality = '';
    try { savedQuality = localStorage.getItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality') || ''; } catch (error) { savedQuality = ''; }
    const preference = policy ? policy.normalizePreference(parameters.get('quality')) || policy.normalizePreference(savedQuality) || 'auto' : 'balanced';
    let quality = preference === 'auto' && policy ? policy.chooseAutomaticQuality({
        deviceMemory: navigator.deviceMemory, hardwareThreads: navigator.hardwareConcurrency,
        compactViewport: innerWidth < 768, viewportPixels: innerWidth * innerHeight * Math.min(devicePixelRatio, 2) ** 2, saveData: navigator.connection?.saveData
    }) : preference;
    if (!['high', 'balanced', 'low'].includes(quality)) quality = 'balanced';
    const profiles = {
        high: { segments: 384, rocks: 2200, gravel: 6500, texture: 1024, shadows: 2048, ratio: 1.75 },
        balanced: { segments: 288, rocks: 1300, gravel: 3800, texture: 512, shadows: 1024, ratio: 1.5 },
        low: { segments: 192, rocks: 600, gravel: 1400, texture: 512, shadows: 512, ratio: 1 }
    };
    const profile = profiles[quality];
    const t = key => dictionary[language][key];
    function applyLanguage() {
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const value = t(element.dataset.i18n);
            if (value) element.textContent = value;
        });
        document.querySelector('h1').style.whiteSpace = 'pre-line';
        $('language-button').textContent = language === 'zh' ? 'EN' : '中文';
        $('walking-hint').textContent = t(touchDevice ? 'touchHint' : 'walkingHint');
        updateMotionButton();
        updateGravityButton();
        updateSoundButton();
        $('gravity-mode').textContent = t(gravity === LunarTerrain.GRAVITY ? 'moonTag' : 'earthTag');
        if (walker) $('movement-state').textContent = t(walker.grounded ? 'grounded' : 'airborne');
        const featureList = $('feature-list');
        if (featureList) {
            featureList.innerHTML = '';
            for (const [name, text] of (t('features') || [])) {
                const li = document.createElement('li'), strong = document.createElement('strong'), span = document.createElement('span');
                strong.textContent = name; span.textContent = text;
                li.append(strong, span); featureList.appendChild(li);
            }
        }
        updateNotes();
    }
    function updateNotes() {
        if (discoveryUI) discoveryUI.setLanguage(language);
    }
    function notify(key) {
        $('notice').textContent = t(key);
        $('notice').classList.add('visible');
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => $('notice').classList.remove('visible'), 4200);
    }
    function fail(key, error) {
        ready = false;
        if (animationId !== null) cancelAnimationFrame(animationId);
        animationId = null;
        $('loading-overlay').hidden = false;
        $('loading-label').textContent = t(key);
        document.querySelector('.loading-orbit').style.animation = 'none';
        document.querySelectorAll('.station-button, #begin-button, #photo-button').forEach(button => { button.disabled = true; });
        if (error) console.error('Moon expedition:', error);
    }
    function makeTexture() {
        const size = profile.texture;
        const pixels = new Uint8Array(size * size * 4);
        const rand = LunarTerrain.random(817);
        const fields = [8, 32, 128].map(count => ({ count, data: Float32Array.from({ length: count * count }, () => rand()) }));
        function tileNoise(u, v, field) {
            const x = u * field.count, z = v * field.count, ix = Math.floor(x), iz = Math.floor(z);
            let fx = x - ix, fz = z - iz;
            fx = fx * fx * (3 - 2 * fx); fz = fz * fz * (3 - 2 * fz);
            const at = (a, b) => field.data[(b % field.count) * field.count + a % field.count];
            return (at(ix, iz) * (1 - fx) + at(ix + 1, iz) * fx) * (1 - fz) + (at(ix, iz + 1) * (1 - fx) + at(ix + 1, iz + 1) * fx) * fz;
        }
        for (let z = 0; z < size; z++) {
            for (let x = 0; x < size; x++) {
                const u = x / size, v = z / size;
                const grain = (rand() - 0.5) * 17;
                const cloud = (tileNoise(u, v, fields[0]) - 0.5) * 33 + (tileNoise(u, v, fields[1]) - 0.5) * 27 + (tileNoise(u, v, fields[2]) - 0.5) * 20;
                const value = Math.max(55, Math.min(200, 155 + grain + cloud + (rand() > 0.999 ? -35 : 0)));
                const i = (z * size + x) * 4;
                pixels[i] = value; pixels[i + 1] = value; pixels[i + 2] = value; pixels[i + 3] = 255;
            }
        }
        const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
        texture.encoding = THREE.sRGBEncoding;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        texture.needsUpdate = true;
        return texture;
    }
    const terrainNoiseShader = `
        float lunarHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float lunarNoise(vec2 p) {
            vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
            return mix(mix(lunarHash(i),lunarHash(i+vec2(1.0,0.0)),f.x),mix(lunarHash(i+vec2(0.0,1.0)),lunarHash(i+vec2(1.0,1.0)),f.x),f.y);
        }
    `;
    function groundMaterial(texture, repeats) {
        const map = texture.clone();
        map.repeat.set(repeats, repeats);
        map.needsUpdate = true;
        const material = new THREE.MeshStandardMaterial({ map, bumpMap: map, bumpScale: 0.055, roughness: 1, metalness: 0, vertexColors: true });
        material.onBeforeCompile = shader => {
            shader.vertexShader = 'varying vec3 vGroundPosition;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGroundPosition = position;');
            shader.fragmentShader = 'varying vec3 vGroundPosition;\n' + terrainNoiseShader + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
                float broad = lunarNoise(vGroundPosition.xz * 0.038) - 0.5;
                float fine = lunarNoise(vGroundPosition.xz * 1.8) - 0.5;
                float detailFade = 1.0 - smoothstep(25.0, 130.0, distance(cameraPosition, vGroundPosition));
                diffuseColor.rgb *= 0.94 + broad * 0.22 + fine * 0.06 * detailFade;
                vec2 microCell = vGroundPosition.xz * 1.4;
                vec2 microId = floor(microCell);
                vec2 microF = fract(microCell) - vec2(0.28, 0.31) * (lunarHash(microId) - 0.35) - 0.5;
                float microDist = length(microF);
                float microPit = step(0.6, lunarHash(microId + 17.0)) * (smoothstep(0.3, 0.16, microDist) * -0.1 + smoothstep(0.36, 0.28, microDist) * 0.07);
                diffuseColor.rgb *= 1.0 + microPit * detailFade;
                vec2 glintCell = floor(vGroundPosition.xz * 17.0);
                vec2 glintF = fract(vGroundPosition.xz * 17.0) - 0.5;
                float glint = step(0.996, lunarHash(glintCell + 3.0)) * smoothstep(0.24, 0.02, length(glintF));
                diffuseColor.rgb += vec3(glint * 0.4) * detailFade;
            `);
        };
        return material;
    }
    function mountainMaterial() {
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xa49f94).convertSRGBToLinear(), roughness: 1, metalness: 0, vertexColors: true });
        material.extensions = { derivatives: true };
        material.onBeforeCompile = shader => {
            shader.vertexShader = 'varying vec3 vMountainPosition;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMountainPosition = position;');
            shader.fragmentShader = 'varying vec3 vMountainPosition;\n' + terrainNoiseShader + `
                float rockRelief(vec2 p) {
                    return lunarNoise(p * 0.067) * 2.8 + lunarNoise(p * 0.19) * 0.45;
                }
            ` + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
                vec2 rockPoint = vMountainPosition.xz + vMountainPosition.y * vec2(0.35, 0.17);
                float footprint = max(length(dFdx(rockPoint)), length(dFdy(rockPoint)));
                float rockDetail = 1.0 - smoothstep(2.0, 7.0, footprint);
                float largePatches = lunarNoise(rockPoint * 0.011);
                float fracturedRock = lunarNoise(rockPoint * 0.063 + vec2(largePatches * 3.0));
                float grains = mix(0.5, lunarNoise(rockPoint * 0.29), rockDetail);
                float crevices = smoothstep(0.35, 0.62, fracturedRock);
                diffuseColor.rgb *= 0.54 + largePatches * 0.44 + crevices * 0.3 + grains * 0.16;
            `);
            shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
                float reliefX = (rockRelief(rockPoint + vec2(1.0, 0.0)) - rockRelief(rockPoint - vec2(1.0, 0.0))) * 0.5;
                float reliefZ = (rockRelief(rockPoint + vec2(0.0, 1.0)) - rockRelief(rockPoint - vec2(0.0, 1.0))) * 0.5;
                vec3 reliefNormal = mat3(viewMatrix) * vec3(reliefX, 0.0, reliefZ);
                normal = normalize(normal - reliefNormal * (0.4 + rockDetail * 0.6));
            `);
        };
        return material;
    }
    function buildTerrain(texture) {
        surface = LunarTerrain.createSurface(960, profile.segments);
        const geometry = new THREE.PlaneGeometry(surface.size, surface.size, surface.segments, surface.segments);
        geometry.rotateX(-Math.PI / 2);
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        for (let i = 0; i < positions.count; i++) {
            positions.setY(i, surface.heights[i]);
            const n = LunarTerrain.noise(positions.getX(i) * 0.085, positions.getZ(i) * 0.085);
            const shade = 0.75 + n * 0.17;
            colors.set([shade, shade * 0.975, shade * 0.93], i * 3);
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        const ground = new THREE.Mesh(geometry, groundMaterial(texture, 240));
        ground.receiveShadow = true;
        ground.castShadow = true;
        scene.add(ground);
        const farGeometry = new THREE.PlaneGeometry(6400, 6400, quality === 'low' ? 240 : 400, quality === 'low' ? 240 : 400);
        farGeometry.rotateX(-Math.PI / 2);
        const farPositions = farGeometry.attributes.position;
        const farColors = new Float32Array(farPositions.count * 3);
        for (let i = 0; i < farPositions.count; i++) {
            const x = farPositions.getX(i), z = farPositions.getZ(i), r = Math.hypot(x, z);
            const blend = THREE.MathUtils.smoothstep(r, 480, 700);
            const n = LunarTerrain.noise(x * 0.003 + 3, z * 0.003 - 1);
            const ridge = Math.exp(-Math.pow((r - 1100) / 510, 2));
            const broken = 0.55 + 0.35 * LunarTerrain.noise(x * 0.008, z * 0.008) + 0.1 * LunarTerrain.noise(x * 0.026, z * 0.026);
            const fractured = (Math.abs(LunarTerrain.noise(x * 0.012 + 31, z * 0.012) * 2 - 1) - 0.4) * 12 + (LunarTerrain.noise(x * 0.022, z * 0.022 + 19) - 0.5) * 3;
            const h = LunarTerrain.height(x, z) - 0.6 + blend * (ridge * ((45 + n * 170) * broken + fractured) + n * 28);
            farPositions.setY(i, h);
            const color = 0.67 + n * 0.19;
            farColors.set([color, color * 0.98, color * 0.95], i * 3);
        }
        const outerIndices = [];
        const indices = farGeometry.index.array;
        for (let i = 0; i < indices.length; i += 3) {
            const outside = [indices[i], indices[i + 1], indices[i + 2]].some(index => Math.max(Math.abs(farPositions.getX(index)), Math.abs(farPositions.getZ(index))) >= 430);
            if (outside) outerIndices.push(indices[i], indices[i + 1], indices[i + 2]);
        }
        farGeometry.setIndex(outerIndices);
        farGeometry.setAttribute('color', new THREE.BufferAttribute(farColors, 3));
        farGeometry.computeVertexNormals();
        const farMaterial = mountainMaterial();
        const far = new THREE.Mesh(farGeometry, farMaterial);
        far.receiveShadow = true;
        scene.add(far);
    }
    function rockTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#8d897e';
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 20000; i++) {
            const v = 110 + Math.random() * 90;
            ctx.fillStyle = `rgba(${v},${v * 0.98},${v * 0.92},${0.16 + Math.random() * 0.2})`;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2.4, 1 + Math.random() * 2.4);
        }
        for (let i = 0; i < 620; i++) {
            const x = Math.random() * 512, y = Math.random() * 512, r = 0.7 + Math.random() * 4.5;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(28,26,24,0.85)');
            g.addColorStop(0.7, 'rgba(48,45,42,0.4)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        }
        ctx.strokeStyle = 'rgba(30,28,26,0.5)';
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 60; i++) {
            let x = Math.random() * 512, y = Math.random() * 512;
            ctx.beginPath(); ctx.moveTo(x, y);
            for (let s = 0; s < 5; s++) { x += (Math.random() - 0.5) * 36; y += (Math.random() - 0.5) * 36; ctx.lineTo(x, y); }
            ctx.stroke();
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
    function loadRockModel(url) {
        return new Promise(resolve => {
            if (!THREE.GLTFLoader) return resolve(null);
            new THREE.GLTFLoader().load(url, gltf => {
                let mesh = null;
                gltf.scene.traverse(o => { if (!mesh && o.isMesh) mesh = o; });
                if (!mesh) return resolve(null);
                const geometry = mesh.geometry.clone();
                geometry.computeBoundingBox();
                geometry.center();
                const size = new THREE.Vector3();
                geometry.boundingBox.getSize(size);
                const norm = 1 / Math.max(size.x, size.y, size.z);
                geometry.scale(norm, norm, norm);
                geometry.computeBoundingBox();
                if (mesh.material && mesh.material.map) { mesh.material.map.anisotropy = 4; }
                resolve({ geometry, material: mesh.material || null });
            }, undefined, () => resolve(null));
        });
    }
    function rockGeometry(seed, detail) {
        const geometry = new THREE.IcosahedronGeometry(1, detail);
        const p = geometry.attributes.position;
        const c = new Float32Array(p.count * 3);
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const n = LunarTerrain.noise(x * 3 + seed, z * 3 + y * 2);
            const n2 = LunarTerrain.noise(x * 7 - seed, y * 7 + z * 4);
            const ridge = Math.abs(LunarTerrain.noise(x * 4 + y * 2 + seed, z * 4) - 0.5) * 2;
            const f = 0.72 + n * 0.3 + n2 * 0.12 - ridge * 0.16;
            p.setXYZ(i, x * f, y * (0.58 + n * 0.24), z * f);
            const dustCap = THREE.MathUtils.clamp(y * 1.1 + 0.15, 0, 1);
            const shade = (0.58 + LunarTerrain.noise(x * 8 + seed, y * 8 + z * 2) * 0.3) * (1 + dustCap * 0.24);
            c.set([shade, shade * 0.97, shade * 0.92], i * 3);
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(c, 3));
        geometry.computeVertexNormals();
        const normals = geometry.attributes.normal;
        const normal = new THREE.Vector3(), radial = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
            normal.fromBufferAttribute(normals, i);
            radial.set(p.getX(i), p.getY(i) * 1.6, p.getZ(i)).normalize();
            normal.lerp(radial, 0.28).normalize();
            normals.setXYZ(i, normal.x, normal.y, normal.z);
        }
        return geometry;
    }
    function buildRocks(texture, rockModels) {
        const rand = LunarTerrain.random(19690720);
        const rockTex = rockTexture();
        const material = new THREE.MeshStandardMaterial({ map: rockTex, bumpMap: rockTex, bumpScale: 0.16, roughness: 1, vertexColors: true, flatShading: true });
        const transform = new THREE.Object3D();
        const color = new THREE.Color();
        const useModels = rockModels && rockModels.length;
        const groups = useModels ? rockModels.length : 4;
        for (let group = 0; group < groups; group++) {
            const count = Math.floor(profile.rocks / groups);
            const model = useModels ? rockModels[group % rockModels.length] : null;
            const rocks = new THREE.InstancedMesh(model ? model.geometry : rockGeometry(group * 19 + 8, 1), model ? (model.material || material) : material, count);
            for (let i = 0; i < count; i++) {
                let x = (rand() - 0.5) * 760, z = (rand() - 0.5) * 760;
                const size = 0.2 + Math.pow(rand(), 3.7) * 2.7;
                while (stations.some(s => Math.hypot(x - s.x, z - s.z) < size + 4) || expedition.isOnRoute({ x, z }, size * 1.5 + 0.5)) {
                    x = (rand() - 0.5) * 760; z = (rand() - 0.5) * 760;
                }
                if (model) {
                    const s = size * 1.9;
                    const lift = -model.geometry.boundingBox.min.y * s;
                    transform.position.set(x, LunarTerrain.sampleSurface(surface, x, z) + lift * 0.38, z);
                    transform.scale.setScalar(s);
                    transform.rotation.set((rand() - 0.5) * 0.5, rand() * Math.PI * 2, (rand() - 0.5) * 0.5);
                    color.setScalar(0.78 + rand() * 0.22);
                } else {
                    transform.position.set(x, LunarTerrain.sampleSurface(surface, x, z) + size * 0.12, z);
                    transform.scale.set(size * (0.75 + rand() * 0.9), size * (0.62 + rand() * 0.55), size * (0.75 + rand() * 0.65));
                    transform.rotation.set((rand() - 0.5) * 0.4, rand() * Math.PI * 2, (rand() - 0.5) * 0.4);
                    color.setScalar(0.67 + rand() * 0.33);
                }
                transform.updateMatrix();
                rocks.setMatrixAt(i, transform.matrix);
                rocks.setColorAt(i, color);
                if (size > 0.5) obstacles.push({ x, z, radius: size * 1.5 });
            }
            rocks.castShadow = quality !== 'low';
            rocks.receiveShadow = true;
            rocks.frustumCulled = false;
            scene.add(rocks);
        }
        const filletGeometry = new THREE.SphereGeometry(1, 14, 8);
        const filletMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, color: 0xb3aea2 });
        const heroes = [[-7, 68, 1.1], [12, 48, 2.2], [21, 50, 1.1], [-43, 13, 3.4], [-47, 8, 1.3], [-42, 18, 0.7], [90, 26, 1.5], [7, 20, 0.9], [-17, 40, 1.9]];
        for (const [x, z, size] of heroes) {
            const model = rockModels && rockModels.length ? rockModels[Math.floor(rand() * rockModels.length)] : null;
            let rock;
            if (model) {
                rock = new THREE.Mesh(model.geometry, model.material || material);
                const s = size * 1.9;
                rock.scale.setScalar(s);
                rock.rotation.set((rand() - 0.5) * 0.45, rand() * 6, (rand() - 0.5) * 0.45);
                const lift = -model.geometry.boundingBox.min.y * s;
                rock.position.set(x, LunarTerrain.sampleSurface(surface, x, z) + lift * 0.38, z);
            } else {
                rock = new THREE.Mesh(rockGeometry(x + 100, 2), material);
                rock.scale.set(size * (1.1 + rand() * 0.5), size * (0.78 + rand() * 0.35), size);
                rock.rotation.y = rand() * 6;
                rock.position.set(x, LunarTerrain.sampleSurface(surface, x, z) + size * 0.2, z);
            }
            rock.castShadow = rock.receiveShadow = true;
            scene.add(rock);
            const fillet = new THREE.Mesh(filletGeometry, filletMaterial);
            fillet.scale.set(size * 1.75, size * 0.3, size * 1.55);
            fillet.position.set(x, LunarTerrain.sampleSurface(surface, x, z) - size * 0.06, z);
            fillet.receiveShadow = true;
            scene.add(fillet);
            if (x === -43 && z === 13) featuredRock = rock;
            obstacles.push({ x, z, radius: size * 1.45 });
        }
        const gravelModel = useModels ? rockModels[0] : null;
        const gravel = new THREE.InstancedMesh(gravelModel ? gravelModel.geometry : rockGeometry(84, 0), gravelModel ? (gravelModel.material || material) : material, profile.gravel);
        for (let i = 0; i < profile.gravel; i++) {
            const x = (rand() - 0.5) * 530, z = (rand() - 0.5) * 530;
            const size = 0.03 + rand() * 0.17;
            if (gravelModel) {
                const s = size * 1.9;
                const lift = -gravelModel.geometry.boundingBox.min.y * s;
                transform.position.set(x, LunarTerrain.sampleSurface(surface, x, z) + lift * 0.38, z);
                transform.scale.setScalar(s);
            } else {
                transform.position.set(x, LunarTerrain.sampleSurface(surface, x, z) + size * 0.05, z);
                transform.scale.set(size * (1.3 + rand() * 0.8), size * (0.6 + rand() * 0.5), size);
            }
            transform.rotation.set(0, rand() * Math.PI * 2, 0);
            transform.updateMatrix();
            gravel.setMatrixAt(i, transform.matrix);
            gravel.setColorAt(i, color.setScalar(gravelModel ? 0.8 + rand() * 0.2 : 0.45 + rand() * 0.5));
        }
        gravel.receiveShadow = true;
        gravel.frustumCulled = false;
        scene.add(gravel);
    }
    function buildSky() {
        const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x7fafd0, roughness: 0.95 });
        const earth = new THREE.Mesh(new THREE.SphereGeometry(36, 64, 48), earthMaterial);
        earth.position.set(350, 340, -1250);
        earth.rotation.z = 0.35;
        earth.rotation.y = 2.4;
        scene.add(earth);
        const loader = new THREE.TextureLoader();
        const earthReady = new Promise(resolve => {
            loader.load('textures/2k_earth_daymap.jpg', texture => {
                texture.encoding = THREE.sRGBEncoding;
                earthMaterial.map = texture;
                earthMaterial.emissiveMap = texture;
                earthMaterial.emissive = new THREE.Color(0x4a5560);
                earthMaterial.color.set(0xffffff);
                earthMaterial.needsUpdate = true;
                resolve();
            }, undefined, () => { notify('textureFailed'); resolve(); });
        });
        const cloudsMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(36.4, 48, 32), cloudsMaterial);
        earth.add(clouds);
        loader.load('textures/2k_earth_clouds.jpg', texture => {
            cloudsMaterial.alphaMap = texture;
            cloudsMaterial.opacity = 0.8;
            cloudsMaterial.needsUpdate = true;
        }, undefined, () => {});
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(37.4, 48, 32), new THREE.ShaderMaterial({
            uniforms: {}, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv;}',
            fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){float f=pow(1.0-max(0.0,dot(normalize(vN),normalize(vV))),4.0); gl_FragColor=vec4(0.16,0.45,0.9,f*0.55);}'
        }));
        earth.add(atmosphere);
        const sun = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff5dc }));
        sun.position.copy(sunlight.position).normalize().multiplyScalar(2100);
        scene.add(sun);
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 256; glowCanvas.height = 64;
        const glowContext = glowCanvas.getContext('2d');
        const glowGradient = glowContext.createRadialGradient(128, 96, 4, 128, 96, 96);
        glowGradient.addColorStop(0, 'rgba(255,244,214,0.5)');
        glowGradient.addColorStop(0.4, 'rgba(240,228,200,0.18)');
        glowGradient.addColorStop(1, 'rgba(230,220,195,0)');
        glowContext.save();
        glowContext.translate(0, 32);
        glowContext.scale(1, 0.42);
        glowContext.translate(0, -32);
        glowContext.fillStyle = glowGradient;
        glowContext.fillRect(0, -96, 256, 256);
        glowContext.restore();
        const horizonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
        const sunFlat = new THREE.Vector3(sun.position.x, 0, sun.position.z).normalize();
        horizonGlow.position.copy(sunFlat).multiplyScalar(2500);
        horizonGlow.position.y = 55;
        horizonGlow.scale.set(2400, 190, 1);
        scene.add(horizonGlow);
        return Promise.race([earthReady, new Promise(resolve => setTimeout(resolve, 5000))]);
    }
    function buildAstronaut(texture) {
        const suit = new THREE.MeshStandardMaterial({ color: 0xb8b5ab, roughness: 0.92, bumpMap: texture, bumpScale: 0.012 });
        const joint = new THREE.MeshStandardMaterial({ color: 0x34383a, roughness: 1 });
        const sole = new THREE.MeshStandardMaterial({ color: 0x4a4841, roughness: 1 });
        const shadowOnly = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
        astronaut = new THREE.Group();
        function part(parent, geometry, material, x, y, z) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        }
        function roundedBox(width, height, depth, radius) {
            const geometry = new THREE.BoxGeometry(width, height, depth, 6, 4, 8);
            const positions = geometry.attributes.position, normals = geometry.attributes.normal;
            const point = new THREE.Vector3(), core = new THREE.Vector3(), normal = new THREE.Vector3();
            for (let i = 0; i < positions.count; i++) {
                point.fromBufferAttribute(positions, i);
                core.set(THREE.MathUtils.clamp(point.x, -width / 2 + radius, width / 2 - radius), THREE.MathUtils.clamp(point.y, -height / 2 + radius, height / 2 - radius), THREE.MathUtils.clamp(point.z, -depth / 2 + radius, depth / 2 - radius));
                normal.subVectors(point, core).normalize();
                point.copy(core).addScaledVector(normal, radius);
                positions.setXYZ(i, point.x, point.y, point.z);
                normals.setXYZ(i, normal.x, normal.y, normal.z);
            }
            return geometry;
        }
        const bootGeometry = roundedBox(0.25, 0.16, 0.44, 0.035);
        const soleGeometry = roundedBox(0.26, 0.035, 0.46, 0.012);
        const legs = [-1, 1].map(side => {
            const leg = new THREE.Group();
            leg.position.x = side * 0.17;
            leg.rotation.y = side * -0.055;
            part(leg, new THREE.CylinderGeometry(0.135, 0.12, 0.42, 12), shadowOnly, 0, 0.7, 0.08);
            part(leg, new THREE.SphereGeometry(0.125, 12, 8), shadowOnly, 0, 0.48, 0.03);
            part(leg, new THREE.CylinderGeometry(0.105, 0.09, 0.22, 16, 1, true), suit, 0, 0.25, 0.02);
            part(leg, bootGeometry, suit, 0, 0.105, -0.1);
            part(leg, soleGeometry, sole, 0, 0.023, -0.1);
            for (let i = 0; i < 3; i++) part(leg, new THREE.BoxGeometry(0.19, 0.01, 0.023), joint, 0, 0.187, -0.23 + i * 0.055);
            astronaut.add(leg);
            return leg;
        });
        part(astronaut, new THREE.BoxGeometry(0.48, 0.19, 0.29), shadowOnly, 0, 0.94, 0.12);
        part(astronaut, new THREE.BoxGeometry(0.53, 0.5, 0.34), shadowOnly, 0, 1.26, 0.13);
        part(astronaut, new THREE.BoxGeometry(0.43, 0.6, 0.24), shadowOnly, 0, 1.27, 0.4);
        part(astronaut, new THREE.SphereGeometry(0.25, 20, 16), shadowOnly, 0, 1.64, 0.08);
        for (const side of [-1, 1]) {
            const arm = part(astronaut, new THREE.CylinderGeometry(0.105, 0.09, 0.49, 12), shadowOnly, side * 0.36, 1.12, 0.12);
            arm.rotation.z = side * 0.12;
            part(astronaut, new THREE.SphereGeometry(0.095, 12, 8), shadowOnly, side * 0.39, 0.85, 0.09);
        }
        astronaut.userData.legs = legs;
        astronaut.visible = false;
        scene.add(astronaut);
    }
    function buildFootprints() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 96;
        const context = canvas.getContext('2d');
        context.translate(32, 48);
        context.fillStyle = 'rgba(26,24,20,0.78)';
        context.beginPath(); context.ellipse(0, 0, 13, 22, 0, 0, Math.PI * 2); context.fill();
        context.fillStyle = 'rgba(12,11,9,0.95)';
        for (let i = 0; i < 8; i++) context.fillRect(-11, -20 + i * 5, 22, 2.8);
        context.fillStyle = 'rgba(11,10,8,0.95)';
        context.fillRect(-10, 15, 20, 8);
        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(0.24, 0.42);
        geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
        footprints = new THREE.InstancedMesh(geometry, material, 240);
        footprints.frustumCulled = false;
        const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
        for (let i = 0; i < 240; i++) footprints.setMatrixAt(i, hidden);
        footprints.instanceMatrix.needsUpdate = true;
        scene.add(footprints);
    }
    function dropPrint(mark) {
        const side = mark % 2 ? -1 : 1;
        const legX = side * 0.17;
        const footZ = -0.1 + (walker.grounded ? Math.min(0, Math.sin(walker.stride + (side < 0 ? 0 : Math.PI)) * 0.12) : 0);
        const x = position.x + Math.cos(yaw) * legX + Math.sin(yaw) * footZ;
        const z = position.z - Math.sin(yaw) * legX + Math.cos(yaw) * footZ;
        const y = LunarTerrain.sampleSurface(surface, x, z) + 0.015;
        const slopeX = (LunarTerrain.sampleSurface(surface, x + 0.35, z) - LunarTerrain.sampleSurface(surface, x - 0.35, z)) / 0.7;
        const slopeZ = (LunarTerrain.sampleSurface(surface, x, z + 0.35) - LunarTerrain.sampleSurface(surface, x, z - 0.35)) / 0.7;
        const normal = new THREE.Vector3(-slopeX, 1, -slopeZ).normalize();
        const align = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw + (rand() - 0.5) * 0.12);
        const matrix = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), align.multiply(turn), new THREE.Vector3(side < 0 ? -1 : 1, 1, 1));
        footprints.setMatrixAt(printCursor % 240, matrix);
        footprints.instanceMatrix.needsUpdate = true;
        printCursor++;
        if (walker.speed > 0.6) spawnDust(x, y + 0.03, z, 4, 0.28);
        if (audio) audio.step(walker.speed / LunarTerrain.WALK_SPEED);
        return { x, z };
    }
    function dustTexture() {
        if (dust.texture) return dust.texture;
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 32;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        dust.texture = new THREE.CanvasTexture(canvas);
        return dust.texture;
    }
    function spawnDust(x, y, z, count, energy) {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const angle = rand() * Math.PI * 2, spread = energy * (0.3 + rand() * 0.9);
            positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
            velocities[i * 3] = Math.cos(angle) * spread + walker.vx * 0.3;
            velocities[i * 3 + 1] = energy * (0.5 + rand() * 0.9);
            velocities[i * 3 + 2] = Math.sin(angle) * spread + walker.vz * 0.3;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ size: 0.05 + energy * 0.05, map: dustTexture(), color: 0xbcb4a4, transparent: true, opacity: 0.65, depthWrite: false, sizeAttenuation: true });
        const points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        scene.add(points);
        dust.bursts.push({ points, velocities, age: 0, life: 1.15 + energy * 0.4 });
        if (dust.bursts.length > 24) {
            const old = dust.bursts.shift();
            scene.remove(old.points);
            old.points.geometry.dispose(); old.points.material.dispose();
        }
    }
    function updateDust(dt) {
        for (let i = dust.bursts.length - 1; i >= 0; i--) {
            const burst = dust.bursts[i];
            burst.age += dt;
            const attribute = burst.points.geometry.attributes.position;
            for (let j = 0; j < attribute.count; j++) {
                let px = attribute.getX(j) + burst.velocities[j * 3] * dt;
                let py = attribute.getY(j) + burst.velocities[j * 3 + 1] * dt;
                let pz = attribute.getZ(j) + burst.velocities[j * 3 + 2] * dt;
                burst.velocities[j * 3 + 1] -= gravity * dt;
                const ground = LunarTerrain.sampleSurface(surface, px, pz) + 0.01;
                if (py < ground) { py = ground; burst.velocities[j * 3] *= 0.3; burst.velocities[j * 3 + 1] = 0; burst.velocities[j * 3 + 2] *= 0.3; }
                attribute.setXYZ(j, px, py, pz);
            }
            attribute.needsUpdate = true;
            burst.points.material.opacity = Math.max(0, 0.65 * (1 - burst.age / burst.life));
            if (burst.age >= burst.life) {
                scene.remove(burst.points);
                burst.points.geometry.dispose(); burst.points.material.dispose();
                dust.bursts.splice(i, 1);
            }
        }
    }
    function buildInstrument() {
        const station = new THREE.Group();
        const metal = new THREE.MeshStandardMaterial({ color: 0xc8c1b1, roughness: 0.5, metalness: 0.55 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x36393d, roughness: 0.85 });
        const panel = new THREE.MeshStandardMaterial({ color: 0x24405e, roughness: 0.35, metalness: 0.45 });
        function part(geometry, material, x, y, z) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = mesh.receiveShadow = true;
            station.add(mesh);
            return mesh;
        }
        for (const [lx, lz] of [[-0.26, -0.26], [0.26, -0.26], [-0.26, 0.26], [0.26, 0.26]]) {
            const leg = part(new THREE.CylinderGeometry(0.02, 0.03, 0.55, 8), dark, lx, 0.27, lz);
            leg.rotation.z = lx * 0.35; leg.rotation.x = -lz * 0.35;
        }
        part(new THREE.BoxGeometry(0.6, 0.42, 0.6), metal, 0, 0.68, 0);
        part(new THREE.SphereGeometry(0.16, 16, 12), metal, 0, 0.95, 0);
        const mast = part(new THREE.CylinderGeometry(0.012, 0.012, 0.85, 8), dark, 0.18, 1.3, 0.18);
        part(new THREE.SphereGeometry(0.045, 10, 8), metal, 0.18, 1.74, 0.18);
        const dish = part(new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.6), metal, -0.2, 1.06, -0.2);
        dish.rotation.x = -0.9; dish.rotation.y = 0.5;
        for (const side of [-1, 1]) {
            const wing = part(new THREE.BoxGeometry(0.78, 0.025, 0.4), panel, side * 0.72, 0.62, 0);
            wing.rotation.z = side * -0.28;
        }
        const x = 32, z = -60;
        station.position.set(x, LunarTerrain.sampleSurface(surface, x, z), z);
        station.rotation.y = 2.2;
        scene.add(station);
        obstacles.push({ x, z, radius: 1 });
    }
    function loadSceneModel(url) {
        return new Promise(resolve => {
            if (!THREE.GLTFLoader) return resolve(null);
            new THREE.GLTFLoader().load(url, gltf => resolve(gltf.scene), undefined, () => resolve(null));
        });
    }
    async function buildLander() {
        const x = 32, z = -60;
        const model = await loadSceneModel('models/lunar-module.glb');
        if (!model) { buildInstrument(); return; }
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (!size.y || !isFinite(size.y)) { buildInstrument(); return; }
        model.scale.setScalar(7.2 / size.y);
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -box.min.y + 0.02, -center.z);
        model.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
        const group = new THREE.Group();
        group.add(model);
        group.position.set(x, LunarTerrain.sampleSurface(surface, x, z), z);
        group.rotation.y = 2.2;
        scene.add(group);
        obstacles.push({ x, z, radius: 4 });
    }
    const rand = LunarTerrain.random(4451);
    function updateGravityButton() {
        $('gravity-button').textContent = t(gravity === LunarTerrain.GRAVITY ? 'gravityCompare' : 'gravityLunar');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== LunarTerrain.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === LunarTerrain.GRAVITY ? LunarTerrain.EARTH_GRAVITY : LunarTerrain.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === LunarTerrain.GRAVITY ? 'moonTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === LunarTerrain.GRAVITY ? 'gravityMoon' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-moon-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
        if (audio) audio.setEnabled(soundEnabled);
        updateSoundButton();
    }
    function updateCamera() {
        if (!walker) return;
        const headMotion = motionEnabled && !photoMode && exploring;
        const bob = headMotion ? walker.bob - walker.landing : 0;
        const roll = headMotion && walker.grounded ? Math.sin(walker.stride) * Math.min(1, walker.speed / LunarTerrain.WALK_SPEED) * 0.003 : 0;
        camera.position.set(position.x, walker.y + LunarTerrain.EYE_HEIGHT + bob, position.z);
        camera.rotation.set(pitch, yaw, roll, 'YXZ');
        if (astronaut) {
            astronaut.visible = exploring;
            astronaut.position.set(position.x, walker.y, position.z);
            astronaut.rotation.y = yaw;
            astronaut.userData.legs.forEach((leg, i) => {
                const stride = Math.sin(walker.stride + i * Math.PI);
                const amount = walker.grounded ? Math.min(1, walker.speed / LunarTerrain.WALK_SPEED) : 0;
                leg.position.z = stride * 0.12 * amount;
                const footZ = leg.position.z - 0.1;
                const footX = position.x + Math.cos(yaw) * leg.position.x + Math.sin(yaw) * footZ;
                const footWorldZ = position.z - Math.sin(yaw) * leg.position.x + Math.cos(yaw) * footZ;
                const contact = walker.grounded ? LunarTerrain.sampleSurface(surface, footX, footWorldZ) - walker.y : 0;
                leg.position.y = contact + Math.max(0, stride) * 0.07 * amount;
            });
        }
        $('movement-state').textContent = t(walker.grounded ? 'grounded' : 'airborne');
        $('heading').textContent = `${String(Math.round((-yaw * 180 / Math.PI + 360) % 360)).padStart(3, '0')}°`;
        const distance = Math.round(Math.hypot(position.x - stations[0].x, position.z - stations[0].z));
        $('distance-value').textContent = `${distance} m`;
    }
    function clearMovement() {
        keys.clear(); touchKeys.clear(); jumpRequested = false; drag = null;
        if (walker && walker.grounded) { walker.vx = 0; walker.vz = 0; walker.speed = 0; }
    }
    function requestJump() {
        if (ready && exploring && !photoMode && !isDialogOpen() && walker.grounded) jumpRequested = true;
    }
    function updateMotionButton() {
        $('motion-button').textContent = t(motionEnabled ? 'motionOn' : 'motionOff');
        $('motion-button').setAttribute('aria-pressed', String(motionEnabled));
    }
    function enter() {
        if (!ready) return;
        exploring = true;
        $('visor').hidden = false;
        if (audio) audio.start();
        $('arrival-card').hidden = true;
        $('field-card').hidden = false;
        $('reticle').hidden = false;
        $('walking-hint').hidden = false;
        $('locomotion-status').hidden = false;
        $('touch-pad').hidden = !touchDevice;
        updateCamera();
        sunlight.shadow.needsUpdate = true;
        $('moon-canvas').focus({ preventScroll: true });
    }
    function relocate(index) {
        if (!ready) return;
        clearMovement();
        stationIndex = index;
        const station = stations[index];
        position.x = station.x; position.z = station.z;
        walker = LunarTerrain.createWalker(surface, position);
        lastPrintMark = 0;
        yaw = station.yaw; pitch = station.pitch;
        updateCamera();
        updateNotes();
        if (discoveryUI) discoveryUI.select(index);
        document.querySelectorAll('[data-station]').forEach(button => {
            button.classList.toggle('selected', Number(button.dataset.station) === index);
            button.setAttribute('aria-pressed', String(Number(button.dataset.station) === index));
        });
        enter();
        sunlight.shadow.needsUpdate = true;
    }
    function setPhoto(enabled) {
        if (!ready) return;
        photoMode = enabled;
        clearMovement();
        updateCamera();
        document.body.classList.toggle('photo-mode', enabled);
        $('photo-controls').hidden = !enabled;
        if (discoveryUI) discoveryUI.update(0);
        $('moon-canvas').focus({ preventScroll: true });
    }
    function frame(now) {
        if (!ready || document.hidden) { animationId = null; return; }
        animationId = requestAnimationFrame(frame);
        const dt = Math.min((now - (lastTime || now)) / 1000, 0.1);
        lastTime = now;
        if (exploring && !photoMode && !isDialogOpen() && dt > 0) {
            const forward = Number(keys.has('KeyW') || keys.has('ArrowUp') || touchKeys.has('forward')) - Number(keys.has('KeyS') || keys.has('ArrowDown') || touchKeys.has('back'));
            const right = Number(keys.has('KeyD') || keys.has('ArrowRight') || touchKeys.has('right')) - Number(keys.has('KeyA') || keys.has('ArrowLeft') || touchKeys.has('left'));
            const wasMoving = walker.speed > 0.001 || !walker.grounded;
            const wasAirborne = !walker.grounded;
            const fallSpeed = wasAirborne ? Math.max(0, -walker.vy) : 0;
            LunarTerrain.updateWalker(surface, walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: jumpRequested }, dt, obstacles, gravity);
            jumpRequested = false;
            position.x = walker.x; position.z = walker.z;
            if (!wasAirborne && !walker.grounded) { spawnDust(position.x, walker.y + 0.06, position.z, 10, 0.45); if (audio) audio.jump(); }
            if (wasAirborne && walker.grounded) {
                const energy = Math.min(1.5, Math.max(0.3, fallSpeed / 3));
                spawnDust(position.x, walker.y + 0.05, position.z, Math.round(14 + energy * 14), 0.4 + energy * 0.7);
                if (audio) audio.land(energy);
            }
            const printMark = Math.floor(walker.stride / Math.PI);
            while (lastPrintMark < printMark) { lastPrintMark++; dropPrint(lastPrintMark); }
            if (Math.hypot(position.x, position.z) > LunarTerrain.WALK_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
            if (wasMoving || walker.speed > 0.001 || !walker.grounded) sunlight.shadow.needsUpdate = true;
            updateCamera();
        }
        if (exploring && dt > 0) updateDust(dt);
        if (Math.hypot(sunlight.target.position.x - position.x, sunlight.target.position.z - position.z) > 20) {
            sunlight.target.position.set(position.x, 0, position.z);
            sunlight.position.set(position.x - 180, 105, position.z - 160);
            sunlight.shadow.needsUpdate = true;
        }
        if (discoveryUI) discoveryUI.update(now);
        if (cinePass) cinePass.material.uniforms.uTime.value = now * 0.001;
        if (composer) composer.render(); else renderer.render(scene, camera);
        if (!sampleTime) sampleTime = now;
        frameCount++;
        if (now - sampleTime > 6000) {
            const fps = frameCount * 1000 / (now - sampleTime);
            if (preference === 'auto' && fps < 27 && pixelRelief < 2) {
                pixelRelief++;
                renderer.setPixelRatio(Math.max(0.75, Math.min(devicePixelRatio, profile.ratio) * (1 - pixelRelief * 0.2)));
                if (composer) composer.setPixelRatio(Math.max(0.75, Math.min(devicePixelRatio, profile.ratio) * (1 - pixelRelief * 0.2)));
                if (fxaaPass) fxaaPass.material.uniforms.resolution.value.set(1 / (innerWidth * renderer.getPixelRatio()), 1 / (innerHeight * renderer.getPixelRatio()));
                notify('adjusted');
            }
            frameCount = 0; sampleTime = now;
        }
    }
    function bindInput() {
        const canvas = $('moon-canvas');
        canvas.addEventListener('pointerdown', event => {
            if (!ready || event.button !== 0) return;
            drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false };
            try { canvas.setPointerCapture(event.pointerId); } catch (error) { }
            canvas.focus({ preventScroll: true });
        });
        canvas.addEventListener('pointermove', event => {
            if (!drag || drag.id !== event.pointerId) return;
            yaw = THREE.MathUtils.euclideanModulo(yaw - (event.clientX - drag.x) * 0.003 + Math.PI, Math.PI * 2) - Math.PI;
            pitch = THREE.MathUtils.clamp(pitch - (event.clientY - drag.y) * 0.003, -1.45, 1.2);
            drag.moved ||= Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6;
            drag.x = event.clientX; drag.y = event.clientY;
            sunlight.shadow.needsUpdate = true;
            updateCamera();
        });
        const endDrag = () => { drag = null; };
        canvas.addEventListener('pointerup', event => {
            const clicked = drag && drag.id === event.pointerId && !drag.moved;
            endDrag();
            if (clicked && discoveryUI) discoveryUI.hitRock(event.clientX, event.clientY);
        });
        canvas.addEventListener('pointercancel', endDrag);
        canvas.addEventListener('lostpointercapture', endDrag);
        const movementCodes = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
        document.addEventListener('keydown', event => {
            if (event.code === 'Escape' && isDialogOpen()) {
                event.preventDefault();
                ($('guide-dialog').open ? $('guide-dialog') : $('discovery-dialog')).close();
                canvas.focus({ preventScroll: true });
                return;
            }
            if (event.code === 'Escape' && photoMode) { setPhoto(false); return; }
            if ((event.target instanceof Element && event.target.matches('input, textarea, select, button, a')) || isDialogOpen()) return;
            if (movementCodes.includes(event.code) && exploring && !photoMode) { event.preventDefault(); keys.add(event.code); }
            if (event.code === 'Space' && exploring && !photoMode) {
                event.preventDefault();
                if (!event.repeat) requestJump();
            }
            if (event.repeat) return;
            if (event.code === 'KeyE' && discoveryUI) discoveryUI.interact();
            if (event.code === 'KeyP') setPhoto(!photoMode);
            if (event.code === 'KeyH' && exploring && !photoMode) $('field-card').hidden = !$('field-card').hidden;
            if (event.code === 'KeyG' && exploring && !photoMode) toggleGravity();
            if (event.code === 'KeyM') toggleSound();
        });
        document.addEventListener('keyup', event => keys.delete(event.code));
        document.querySelectorAll('[data-move]').forEach(button => {
            button.addEventListener('pointerdown', event => {
                event.preventDefault();
                button.setPointerCapture(event.pointerId);
                touchKeys.add(button.dataset.move);
            });
            for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(name, () => touchKeys.delete(button.dataset.move));
        });
        window.addEventListener('blur', clearMovement);
        document.addEventListener('visibilitychange', () => {
            clearMovement();
            if (document.hidden) {
                if (audio) audio.suspend();
                if (animationId !== null) cancelAnimationFrame(animationId);
                animationId = null;
            } else if (ready && animationId === null) {
                if (audio && exploring) audio.start();
                lastTime = 0; sampleTime = 0; frameCount = 0;
                animationId = requestAnimationFrame(frame);
            }
        });
        window.addEventListener('resize', () => {
            if (!renderer) return;
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(innerWidth, innerHeight);
            if (composer) composer.setSize(innerWidth, innerHeight);
            if (fxaaPass) fxaaPass.material.uniforms.resolution.value.set(1 / (innerWidth * renderer.getPixelRatio()), 1 / (innerHeight * renderer.getPixelRatio()));
        });
        canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail('lost'); });
    }
    async function init() {
        try {
            if (!window.THREE || !window.LunarTerrain) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.95;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 7200);
            scene.add(new THREE.AmbientLight(0xc4c8d0, 0.105));
            sunlight = new THREE.DirectionalLight(0xfff6e8, 2.3);
            sunlight.position.set(-180, 105, -160);
            sunlight.castShadow = true;
            sunlight.shadow.mapSize.set(profile.shadows, profile.shadows);
            Object.assign(sunlight.shadow.camera, { left: -145, right: 145, top: 145, bottom: -145, near: 1, far: 650 });
            sunlight.shadow.bias = -0.00018;
            sunlight.shadow.normalBias = 0.08;
            sunlight.shadow.autoUpdate = false;
            sunlight.shadow.needsUpdate = true;
            scene.add(sunlight, sunlight.target);
            if (THREE.EffectComposer && quality !== 'low') {
                composer = new THREE.EffectComposer(renderer);
                composer.addPass(new THREE.RenderPass(scene, camera));
                composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.55, 0.8));
                composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
                if (THREE.FXAAShader) {
                    fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
                    fxaaPass.material.uniforms.resolution.value.set(1 / (innerWidth * renderer.getPixelRatio()), 1 / (innerHeight * renderer.getPixelRatio()));
                    composer.addPass(fxaaPass);
                }
                cinePass = new THREE.ShaderPass({
                    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVig: { value: 0.4 }, uGrain: { value: 0.028 } },
                    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
                    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime, uVig, uGrain; varying vec2 vUv;
                        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                        void main(){
                            vec4 c = texture2D(tDiffuse, vUv);
                            vec2 d = vUv - 0.5;
                            float vig = 1.0 - uVig * dot(d, d) * 1.5;
                            float g = (hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 7.13) - 0.5) * uGrain;
                            gl_FragColor = vec4(clamp(c.rgb * vig + g, 0.0, 1.0), c.a);
                        }`
                });
                composer.addPass(cinePass);
            }
            await new Promise(resolve => setTimeout(resolve, 30));
            const texture = makeTexture();
            buildTerrain(texture);
            await new Promise(resolve => setTimeout(resolve, 20));
            const rockModels = (await Promise.all([loadRockModel('models/bennu.glb'), loadRockModel('models/itokawa.glb')])).filter(Boolean);
            buildRocks(texture, rockModels);
            buildAstronaut(texture);
            buildFootprints();
            buildLander();
            walker = LunarTerrain.createWalker(surface, position);
            await buildSky();
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language });
            ready = true;
            $('loading-overlay').hidden = true;
            document.querySelectorAll('.station-button, #begin-button, #photo-button').forEach(button => { button.disabled = false; });
            bindInput();
            animationId = requestAnimationFrame(frame);
        } catch (error) { fail('error', error); }
    }
    $('language-button').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; applyLanguage(); });
    $('begin-button').addEventListener('click', enter);
    document.querySelectorAll('[data-station]').forEach(button => button.addEventListener('click', () => relocate(Number(button.dataset.station))));
    $('help-button').addEventListener('click', () => { clearMovement(); $('guide-dialog').showModal(); });
    $('jump-button').addEventListener('pointerdown', event => { event.preventDefault(); requestJump(); });
    $('jump-button').addEventListener('click', event => { if (event.detail === 0) requestJump(); });
    $('motion-button').addEventListener('click', () => { motionEnabled = !motionEnabled; updateMotionButton(); if (ready) updateCamera(); });
    $('sound-button').addEventListener('click', toggleSound);
    $('gravity-button').addEventListener('click', toggleGravity);
    $('guide-dialog').addEventListener('close', () => { if (ready) $('moon-canvas').focus({ preventScroll: true }); });
    $('photo-button').addEventListener('click', () => setPhoto(true));
    $('exit-photo-button').addEventListener('click', () => setPhoto(false));
    $('fullscreen-button').addEventListener('click', async () => {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await document.documentElement.requestFullscreen();
        } catch (error) { notify('fullscreenFailed'); }
    });
    $('capture-button').addEventListener('click', () => {
        try {
            if (composer) composer.render(); else renderer.render(scene, camera);
            renderer.domElement.toBlob(blob => {
                if (!blob) { notify('saveFailed'); return; }
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url; link.download = `mzu-moon-expedition-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Moon&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.MoonAudio ? window.MoonAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-moon-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
