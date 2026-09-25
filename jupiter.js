(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.JupiterExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
    const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'JUPITER', surfaceMode: 'ATMOSPHERIC DESCENT',
            chapter: 'EXPEDITION 005 / THE FALLING PROBE', title: 'Descend into\nJupiter.', intro: 'Ride an imagined probe down through Jupiter’s cloud decks — banded haze above, a giant storm to the west, and lightning far below.', begin: 'Begin descent', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Jupiter science.', gravity: 'GRAVITY', atmosphere: 'ATMOSPHERE', vacuum: 'H₂ / He · hydrogen', temperature: 'CLOUD TOP', tempValue: 'about −110°C', distance: 'ALTITUDE',
            walkingHint: 'W A S D to drift · drag to look · Space to fire the ascent thruster · G gravity · M sound', touchHint: 'Arrows to drift · drag to look · tap Burn to rise', station0: 'Entry point', station1: 'Crystal field', station2: 'Storm rim',
            astronaut: 'PROBE', jump: 'Burn', grounded: 'Descending', airborne: 'Descending', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable camera drift for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SCANNED ATMOSPHERE',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Preparing the Jovian atmosphere…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'There is no ground here.',
            guideIntro: 'This is a small, freely explorable column of atmosphere, not a whole-planet simulation. The five observation points are different views of the same descent; two of them lie deeper and can only be reached by sinking on your own.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityMercury: 'Back to Jupiter gravity · G', gravityHint: 'Same probe, different pull. Jupiter’s gravity is 24.79 m/s² — with G the descent quickens, just as the same parachute would fail harder on Jupiter.', soundOn: 'Probe sounds: On', soundOff: 'Probe sounds: Off', soundHint: 'Wind rushing past the hull, a deep rumble, radio static, and muffled thunder from storms below. M toggles.', gravityMercuryTag: 'Jupiter gravity — 24.79 m/s².', gravityEarth: 'Earth gravity — 9.8 m/s². The same probe sinks gentler.', mercuryTag: 'JUPITER', earthTag: 'EARTH',
            controlsText: 'You are a descending probe, not a walker — there is no surface to stand on. The probe sinks on its own; hold Space to fire the ascent thruster and climb. W A S D or the arrow keys drift sideways; Shift drifts faster. Drag to look. Touchscreens have direction and Burn buttons. G compares Earth gravity; M toggles sound. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'Jupiter has no surface — its hydrogen atmosphere simply thickens downward until it behaves like a hot metallic ocean. The Galileo probe descended into these clouds in 1995 and transmitted for about an hour. The ammonia cirrus, the great storm vortex, the deeper ammonium-sulfide haze, and the lightning flashes are artistic reconstructions, not survey data.',
            soundText: 'The probe sinks at a comfortable terminal-velocity drift — real descent profiles are far harsher. Press G to feel how much faster the same probe would sink under Earth’s gentler gravity... inverted: under Jupiter’s 24.79 m/s² the sink rate more than doubles. Wind rush follows your descent rate; the crackles honour Jupiter’s powerful radio emissions.',
            assetText: 'No external imagery on this page — clouds, the storm, and the sky are generated locally in your browser.',
            skyEyebrow: 'IN THE JOVIAN SKY', sunName: 'The Sun', earthName: 'Earth', venusName: 'Venus',
            sunText: 'From Jupiter the Sun is five times farther than from Earth — a small fierce disc, about a fifth as wide as we see it, giving roughly 4% of Earth’s daylight. Artistic rendering, not an accurate ephemeris.',
            earthText: 'From Jupiter, Earth never strays far from the Sun — a pale point lost in the haze most days. Its placement here is artistic.',
            venusText: 'Venus hugs the Sun even tighter than Earth when seen from Jupiter — a faint spark in the bright haze. Artistic placement.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Click the small Sun in the sky to learn about it — you can then visit it in the Solar System view.',
            featuresTitle: 'What you are seeing', features: [
                ['A five-times-smaller Sun', 'Jupiter orbits 5.2 times farther from the Sun than Earth — sunlight here is only about 4% as strong, a bright pinprick in the haze.'],
                ['Banded sky above', 'Look up through the thinning haze — the cloud bands of a giant planet wrap the whole sky.'],
                ['Ammonia cirrus', 'High, thin white wisps — ice crystals of ammonia, the same chemistry as household cleaner, frozen hard at −110°C.'],
                ['The great vortex', 'A storm larger than Earth churns to the west — the Great Red Spot’s artistic echo, with a raised collar of cloud around its rim.'],
                ['Drifting ice crystals', 'Ammonia snow grains glitter past the probe — rotate one in the specimen viewer.'],
                ['Lightning below', 'Deep flashes inside the brown layer — Jupiter’s storms make lightning ten times stronger than Earth’s.'],
                ['The darkening deep', 'Descend far enough and the haze swallows the light — pressure and temperature climb until no probe survives.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this descent corridor. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['The veil of ammonia', 'Thin white cirrus marks the ammonia ice deck — the highest of Jupiter’s three cloud layers and the one we see in photographs.', 'ATMOSPHERE', 'Ammonia cirrus'],
                ['A frozen crystal', 'This tumbling grain is ammonia ice — rotate it in the specimen viewer. Jupiter’s white zones are made of trillions like it.', 'AEROSOL', 'Ice crystal'],
                ['The storm that outlives nations', 'The rim of the great vortex — a hurricane wider than Earth that has raged for centuries. Winds circle its collar at over 300 km/h.', 'STORM', 'Great vortex rim'],
                ['Flash in the deep', 'Lightning flickers inside the ammonium-hydrosulfide layer — storms here are powered by water, like ours, but vastly stronger.', 'STORM', 'Lightning shelf'],
                ['Where signals fade', 'Down here sunlight dies, pressure mounts, and temperature climbs past what electronics can stand. The Galileo probe went silent somewhere like this in 1995.', 'DESCENT', 'The abyss']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '木星', surfaceMode: '大气层下降', chapter: '探索 005 / 坠落中的探测器', title: '坠入木星。',
            intro: '乘上一台想象的探测器，穿过木星的层层云带——上方是条带状的霾，西侧是巨型风暴，深处有闪电。', begin: '开始下降', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受木星科学启发的虚构地点。',
            gravity: '木星引力', atmosphere: '大气环境', vacuum: '氢 / 氦', temperature: '云顶温度', tempValue: '约 −110°C', distance: '当前高度', walkingHint: 'W A S D 漂移 · 拖动转头 · 空格点火上升 · G 引力 · M 声音', touchHint: '方向按钮漂移 · 拖动画面转头 · 点击推进上升',
            astronaut: '探测器视角', jump: '推进', grounded: '下降中', airborne: '下降中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭镜头漂移可获得更平稳的视角。',
            station0: '进入点', station1: '冰晶区', station2: '风暴边缘', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实大气测绘', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在准备木星大气…', fieldGuide: '木星探索指南', guideTitle: '这里没有地面。',
            guideIntro: '这是一段可以自由漫游的大气柱，而非完整木星。五个观察点位于同一次下降的不同高度；其中两处更深，只能靠你自己沉下去。', controlsTitle: '如何移动',
            gravityCompare: '对比地球引力 · G', gravityMercury: '恢复木星引力 · G', gravityHint: '同一台探测器，不同的引力。木星引力 24.79 m/s²——按 G 感受同样降落伞在木星上失效得更快。', soundOn: '探测器声音：开', soundOff: '探测器声音：关', soundHint: '掠过舱体的呼啸风、低沉轰鸣、射电杂音，以及深处风暴的闷雷。M 切换。', gravityMercuryTag: '木星引力 — 24.79 m/s²。', gravityEarth: '地球引力 — 9.8 m/s²。同一台探测器下沉得更缓。', mercuryTag: '木星', earthTag: '地球',
            controlsText: '你是一台正在下降的探测器，不是步行者——这里没有可以站立的表面。探测器会自行下沉；按住空格点火上升。W A S D 或方向键侧向漂移，Shift 漂得更快。拖动画面观察。触屏有方向按钮和推进键。G 对比地球引力，M 开关声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '木星没有表面——氢大气越往下越稠，最终变成炽热的金属海洋。1995 年伽利略探测器曾坠入这样的云层，传回了约一小时的信号。氨冰卷云、巨型风暴涡旋、更深处的硫化铵霾、以及闪电闪光都是艺术重建，并非实测数据。',
            soundText: '探测器以舒适的终端速度下沉——真实的下降剖面要严酷得多。按 G 感受：在木星 24.79 m/s² 的引力下，同一台探测器的下沉速率会翻倍还多。呼啸声跟随下沉速率变化；断断续续的杂音致敬木星强大的射电辐射。',
            assetText: '本页不使用外部影像——云层、风暴和天空均由浏览器本地生成。',
            skyEyebrow: '木星天空中', sunName: '太阳', earthName: '地球', venusName: '金星',
            sunText: '从木星看，太阳比地球上看远五倍——一个刺目的小圆盘，视直径只有地球上的约五分之一，光照强度只有地球白天的约 4%。艺术呈现，并非精确星历。',
            earthText: '从木星看，地球永远紧挨着太阳——大多数时候只是霾中一个苍白的光点。位置经过艺术处理。',
            venusText: '从木星看，金星比地球更贴近太阳——亮霾里一颗微弱的火星。位置经过艺术处理。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '点击天空中那颗小小的太阳可以了解它，然后还能跳到太阳系视角。',
            featuresTitle: '你眼前的景观', features: [
                ['小五倍的太阳', '木星距太阳是地球的 5.2 倍——这里的光照只有地球的约 4%，霾中一枚刺目的针尖。'],
                ['头顶的条带天空', '抬头穿过稀薄的霾——巨行星的云带环绕整片天空。'],
                ['氨冰卷云', '高处稀薄的白色云丝——氨结晶，就是家用清洁剂里那种成分，在 −110°C 冻成冰。'],
                ['巨型风暴涡旋', '西侧翻腾着比地球还大的风暴——大红斑的艺术再现，边缘有一圈抬升的云领。'],
                ['飘浮的冰晶', '氨雪粒在探测器旁闪亮掠过——可以在查看器中旋转一粒。'],
                ['深处的闪电', '棕色云层内部明灭的闪光——木星风暴的闪电比地球强十倍。'],
                ['渐暗的深处', '沉得够深，光会被霾吞没——气压和温度持续攀升，直到没有探测器能幸存。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次下降走廊的边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['氨的面纱', '薄薄的白色卷云标志着氨冰云层——木星三层云里最高的一层，也是我们照片里看到的那层。', '大气现象', '氨冰卷云'],
                ['一粒冻结的晶体', '这颗翻滚的小颗粒是氨冰——在查看器中旋转它。木星的白色亮带由数以万亿计这样的颗粒组成。', '气溶胶', '冰晶'],
                ['比国家更长寿的风暴', '巨型涡旋的边缘——一场比地球还宽、已经肆虐了几个世纪的飓风。环领上的风速超过每小时 300 公里。', '风暴类型', '涡旋边缘'],
                ['深处的一闪', '硫化铵云层内部明灭的闪电——这里的风暴由水驱动，和地球类似，但强大得多。', '风暴类型', '闪电层'],
                ['信号消失之处', '这里阳光熄灭、气压攀升、温度高到电子设备无法承受。1995 年伽利略探测器就在类似的地方归于沉默。', '下降阶段', '深渊']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR DESCENT ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed descent track or an identified Jovian sample.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Match the layer before recording.', approach: 'Drift closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Drift to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures in the atmosphere. H hides or restores the route card.',
            teasers: ['Drift south-west from entry to the thin ammonia cirrus veil.', 'A tumbling ice crystal drifts near the crystal field — approach it and turn it in the specimen viewer.', 'Ride west to the rim of the great storm vortex and look into its eye.', 'Sink below the deck north-west to where the flashes live.', 'Let yourself sink far south — down where the light dies.'],
            details: ['Jupiter’s visible face is ammonia ice cirrus at about −110°C — the topmost of three stacked cloud decks. Below it lie ammonium hydrosulfide and then water clouds. This veil is an artistic rendering of that top deck.', 'Ammonia snow and ice grains populate the white zones. A real crystal is micrometres across — this one is scaled up so you can hold it. Rotate it to inspect the facets.', 'The Great Red Spot is a storm wider than Earth, first recorded in the 1800s and probably older. Its rim collar rises above the surrounding deck and the windspeeds exceed 300 km/h. This vortex is an artistic echo, not a scan.', 'Juno detected lightning flashes throughout Jupiter’s water-bearing layers — shallow flashes and deep bolts alike, some ten times stronger than Earth’s. The flickers here honour those storms.', 'The Galileo atmospheric probe transmitted for about an hour in 1995 before pressure and heat ended it. There is no floor down there — the haze simply gets hotter and denser until it becomes metallic hydrogen. This descent is artistic, not a mission replay.']
        },
        zh: {
            fieldRoute: '你的下降路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转冰晶', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实下降轨迹测绘，也不是已鉴定的木星样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点漂移', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请对齐这一层再记录发现。', approach: '请漂近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，漂近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非大气中的真实设施。H 可隐藏或恢复路线卡片。',
            teasers: ['从进入点向西南漂到那片稀薄的氨卷云纱。', '冰晶区附近有一粒翻滚的冰晶——靠近它，在查看器中转动观察。', '向西漂到巨型风暴涡旋的边缘，俯视它的风暴眼。', '向西北沉到云层下方，去闪光出没的地方。', '让自己向南方深处沉下去——沉到光消失的地方。'],
            details: ['木星可见的"脸"是约 −110°C 的氨冰卷云——三层叠置云带里最上面的一层。它之下是硫化铵云，再往下是水云。这片云纱是对顶层云的艺术再现。', '白色亮带里充满了氨雪和冰晶颗粒。真实的冰晶只有微米级——这一粒被放大了以便观察。旋转它，看看晶面。', '大红斑是比地球还宽的风暴，1800 年代就有记录，可能更古老。它的边缘环领高出周围云层，风速超过每小时 300 公里。这个涡旋是艺术再现，并非测绘。', '朱诺号在木星含水云层各处都探测到了闪电——浅层闪光和深层巨闪都有，有些比地球闪电强十倍。这里的明灭正是致敬那些风暴。', '1995 年伽利略大气探测器传回了约一小时的信号，然后被压力和高温终结。更深处没有"底"——霾只会越来越热、越来越稠，最终变成金属氢。这段下降是艺术演绎，不是任务回放。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, surface, sunlight, walker, astronaut, orbiter, animationId = null;
    let motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = -0.12, pitch = -0.06, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = JupiterAtmo.GRAVITY, audio = null, soundEnabled = true;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set(), obstacles = [];
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null;
    const skyBodies = [], skyRay = new THREE.Raycaster(), skyPointer = new THREE.Vector2();
    let skyPivot = null, earthPivot = null, crystalField = [], skyMaterial = null, ambientLight = null, flashTimer = 6, thrustActive = false, stormDisc = null, bolts = [], boltTimer = 0, deckShader = null, puffGroup = null, composer = null, fxaaPass = null, cinePass = null, stormPts = null, stormVel = null, volCloud = null, sunMesh = null, shaftPass = null;
    const isDialogOpen = () => $('guide-dialog').open || $('discovery-dialog').open || $('moonlet-dialog').open;
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
        $('gravity-mode').textContent = t(gravity === JupiterAtmo.GRAVITY ? 'mercuryTag' : 'earthTag');
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
        if (error) console.error('Jupiter expedition:', error);
    }
    function makeTexture() {
        const size = profile.texture;
        const pixels = new Uint8Array(size * size * 4);
        const rand = JupiterAtmo.random(817);
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
                const grain = (rand() - 0.5) * 9;
                const cloud = (tileNoise(u, v, fields[0]) - 0.5) * 33 + (tileNoise(u, v, fields[1]) - 0.5) * 27 + (tileNoise(u, v, fields[2]) - 0.5) * 12;
                const ripple = Math.sin((u * 46 + tileNoise(u, v, fields[1]) * 4.5) * Math.PI) * 3;
                const value = Math.max(48, Math.min(190, 118 + grain + cloud + ripple + (rand() > 0.999 ? -35 : 0)));
                const i = (z * size + x) * 4;
                pixels[i] = Math.min(255, value * 1.08); pixels[i + 1] = value * 0.94; pixels[i + 2] = value * 0.72; pixels[i + 3] = 255;
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
        const material = new THREE.MeshStandardMaterial({ map, bumpMap: map, bumpScale: 0.012, roughness: 1, metalness: 0, vertexColors: true, emissive: 0x52453a, emissiveIntensity: 0.75 });
        material.onBeforeCompile = shader => {
            shader.uniforms.uTime = { value: 0 };
            material.userData.shader = shader;
            shader.vertexShader = 'uniform float uTime; varying vec3 vGroundPosition;\n' + terrainNoiseShader + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
                vGroundPosition = position;
                float churn = lunarNoise(position.xz * 0.03 + vec2(uTime * 0.025, uTime * 0.017)) - 0.5;
                float churnFine = lunarNoise(position.xz * 0.11 + vec2(-uTime * 0.04, uTime * 0.03)) - 0.5;
                transformed.y += churn * 4.5 + churnFine * 1.6;`);
            shader.fragmentShader = 'varying vec3 vGroundPosition;\n' + terrainNoiseShader + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
                float broad = lunarNoise(vGroundPosition.xz * 0.038) - 0.5;
                float fine = lunarNoise(vGroundPosition.xz * 1.8) - 0.5;
                float detailFade = 1.0 - smoothstep(25.0, 130.0, distance(cameraPosition, vGroundPosition));
                float billow = lunarNoise(vGroundPosition.xz * 0.14) * 0.55 + lunarNoise(vGroundPosition.xz * 0.42 + 7.0) * 0.30 + lunarNoise(vGroundPosition.xz * 1.3 + 19.0) * 0.15;
                float billowShade = smoothstep(0.15, 0.85, billow);
                diffuseColor.rgb *= 0.72 + broad * 0.18 + billowShade * 0.42 + fine * 0.08 * detailFade;
                float stream = sin(vGroundPosition.z * 0.16 + lunarNoise(vGroundPosition.xz * 0.045) * 5.0);
                diffuseColor.rgb *= 1.0 + stream * 0.05;
                float crest = smoothstep(4.0, 18.0, vGroundPosition.y);
                diffuseColor.rgb *= 1.0 + crest * 0.18;
            `);
        };
        return material;
    }
    function mountainMaterial() {
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xcbb894).convertSRGBToLinear(), roughness: 1, metalness: 0, vertexColors: true });
        material.extensions = { derivatives: true };
        material.onBeforeCompile = shader => {
            shader.vertexShader = 'varying vec3 vMountainPosition;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvMountainPosition = position;');
            shader.fragmentShader = 'varying vec3 vMountainPosition;\n' + terrainNoiseShader + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
                vec2 cloudPoint = vMountainPosition.xz;
                float billow = lunarNoise(cloudPoint * 0.012) * 0.6 + lunarNoise(cloudPoint * 0.05 + 9.0) * 0.4;
                float streaks = sin(vMountainPosition.z * 0.02 + lunarNoise(cloudPoint * 0.006) * 6.0);
                diffuseColor.rgb *= 0.72 + billow * 0.26 + streaks * 0.05;
            `);
        };
        return material;
    }
    function buildTerrain(texture) {
        surface = JupiterAtmo.createSurface(960, profile.segments);
        const geometry = new THREE.PlaneGeometry(surface.size, surface.size, surface.segments, surface.segments);
        geometry.rotateX(-Math.PI / 2);
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        const cream = new THREE.Color(0xf5ecd8), tan = new THREE.Color(0xdcc094), brown = new THREE.Color(0xa87e5c), rust = new THREE.Color(0xc05c42), pale = new THREE.Color(0xfbf7ec);
        const c1 = new THREE.Color(), c2 = new THREE.Color();
        for (let i = 0; i < positions.count; i++) {
            const px = positions.getX(i), pz = positions.getZ(i);
            positions.setY(i, surface.heights[i]);
            const n = JupiterAtmo.noise(px * 0.085, pz * 0.085);
            const patch = JupiterAtmo.noise(px * 0.011 + 7, pz * 0.011 - 3);
            const band = Math.sin(pz * 0.055 + JupiterAtmo.noise(px * 0.012, pz * 0.004) * 2.2);
            c1.copy(band > 0 ? cream : tan).lerp(band > 0 ? pale : brown, Math.abs(band) * 0.85);
            const cap = JupiterAtmo.noise(px * 0.03 + 21, pz * 0.03 - 14);
            if (cap > 0.64) c1.lerp(pale, Math.min(1, (cap - 0.64) * 4) * 0.75);
            const sd = JupiterAtmo.stormDistance(px, pz);
            if (sd < 1.7) {
                const s = THREE.MathUtils.clamp(1.7 - sd, 0, 1);
                const ring = Math.exp(-Math.pow((sd - 0.8) / 0.3, 2));
                c2.copy(rust).lerp(pale, ring * 0.55);
                c1.lerp(c2, Math.min(1, s * 0.8 + ring * 0.35));
            }
            const shade = 0.85 + n * 0.3 + patch * 0.14;
            colors.set([c1.r * shade, c1.g * shade, c1.b * shade], i * 3);
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        deckShader = groundMaterial(texture, 240);
        const ground = new THREE.Mesh(geometry, deckShader);
        ground.receiveShadow = true;
        ground.castShadow = true;
        scene.add(ground);
        const farGeometry = new THREE.PlaneGeometry(6400, 6400, quality === 'low' ? 160 : 260, quality === 'low' ? 160 : 260);
        farGeometry.rotateX(-Math.PI / 2);
        const farPositions = farGeometry.attributes.position;
        const farColors = new Float32Array(farPositions.count * 3);
        for (let i = 0; i < farPositions.count; i++) {
            const x = farPositions.getX(i), z = farPositions.getZ(i);
            const n = JupiterAtmo.noise(x * 0.003 + 3, z * 0.003 - 1);
            const billow = JupiterAtmo.noise(x * 0.009, z * 0.009) * 9 + n * 16;
            farPositions.setY(i, JupiterAtmo.height(x, z) - 2 + billow);
            const band = Math.sin(z * 0.0045 + JupiterAtmo.noise(x * 0.001, z * 0.0008) * 3);
            const color = 0.82 + n * 0.26 + band * 0.2;
            farColors.set([color, color * 0.86, color * 0.62], i * 3);
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
    function crystalGeometry(seed) {
        const geometry = new THREE.OctahedronGeometry(1, 0);
        const p = geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const f = 0.7 + JupiterAtmo.noise(x * 3 + seed, y * 3 + z * 2) * 0.3;
            p.setXYZ(i, x * f, y * (2.1 + JupiterAtmo.noise(x * 2, z * 2 + seed) * 0.5), z * f);
        }
        geometry.computeVertexNormals();
        return geometry;
    }
    function buildRocks() {
        const rand = JupiterAtmo.random(19690720);
        const material = new THREE.MeshStandardMaterial({ color: 0xeef4fb, roughness: 0.18, metalness: 0.05, transparent: true, opacity: 0.6, flatShading: true, emissive: 0x384a5c, emissiveIntensity: 0.5 });
        const transform = new THREE.Object3D();
        crystalField = [];
        for (let group = 0; group < 3; group++) {
            const count = Math.floor(profile.rocks / 3);
            const mesh = new THREE.InstancedMesh(crystalGeometry(group * 13 + 5), material, count);
            const items = [];
            for (let i = 0; i < count; i++) {
                let x = (rand() - 0.5) * 640, z = (rand() - 0.5) * 640;
                const size = 0.12 + Math.pow(rand(), 2.8) * 0.7;
                const y = JupiterAtmo.sampleSurface(surface, x, z) + 10 + rand() * 90;
                const drift = { x, y, z, size, spin: rand() * Math.PI * 2, spinRate: (rand() - 0.5) * 0.5, bob: rand() * Math.PI * 2 };
                items.push(drift);
                transform.position.set(x, y, z);
                transform.scale.setScalar(size);
                transform.rotation.set(rand() * 3, rand() * 3, rand() * 3);
                transform.updateMatrix();
                mesh.setMatrixAt(i, transform.matrix);
            }
            mesh.frustumCulled = false;
            scene.add(mesh);
            crystalField.push({ mesh, items });
        }
        featuredRock = new THREE.Mesh(crystalGeometry(77), material.clone());
        featuredRock.scale.set(1.6, 2.1, 1.6);
        featuredRock.position.set(62, JupiterAtmo.sampleSurface(surface, 62, 84) + 26, 84);
        scene.add(featuredRock);
    }
    function buildStorm() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.translate(256, 256);
        const palette = ['rgba(168,80,60,0.9)', 'rgba(196,120,80,0.75)', 'rgba(232,214,180,0.8)', 'rgba(140,70,52,0.85)'];
        for (let arm = 0; arm < 3; arm++) {
            for (let i = 0; i < 260; i++) {
                const t = i / 260;
                const angle = t * Math.PI * 5 + arm * (Math.PI * 2 / 3);
                const r = 18 + t * 218;
                const jitter = (rand() - 0.5) * 9;
                ctx.fillStyle = palette[(i + arm) % palette.length];
                ctx.globalAlpha = (1 - t) * 0.5 + 0.12;
                ctx.beginPath();
                ctx.ellipse(Math.cos(angle) * r + jitter, Math.sin(angle) * r + jitter, 9 - t * 5, 4 - t * 2, angle + 1.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        const eye = ctx.createRadialGradient(0, 0, 0, 0, 0, 42);
        eye.addColorStop(0, 'rgba(120,50,40,0.95)');
        eye.addColorStop(0.6, 'rgba(150,80,58,0.8)');
        eye.addColorStop(1, 'rgba(150,80,58,0)');
        ctx.fillStyle = eye;
        ctx.fillRect(-42, -42, 84, 84);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.95 });
        const s = JupiterAtmo.storm;
        stormDisc = new THREE.Mesh(new THREE.CircleGeometry(s.radius * 1.5, 48), material);
        stormDisc.rotation.x = -Math.PI / 2;
        stormDisc.position.set(s.x, JupiterAtmo.deckHeight(s.x, s.z) + s.rim + 4, s.z);
        stormDisc.renderOrder = 2;
        scene.add(stormDisc);
    }
    function boltTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(220,235,255,0.95)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(160,190,255,0.9)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        let x = 32;
        ctx.moveTo(x, 6);
        for (let y = 6; y < 246; y += 18) { x += (rand() - 0.5) * 26; ctx.lineTo(Math.max(6, Math.min(58, x)), y); }
        ctx.stroke();
        return new THREE.CanvasTexture(canvas);
    }
    function buildBolts() {
        const texture = boltTexture();
        for (let i = 0; i < 4; i++) {
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
            const bolt = new THREE.Mesh(new THREE.PlaneGeometry(14, 56), material);
            const angle = rand() * Math.PI * 2, r = 40 + rand() * 160;
            bolt.position.set(Math.cos(angle) * r, -55 - rand() * 110, Math.sin(angle) * r);
            bolt.visible = false;
            scene.add(bolt);
            bolts.push(bolt);
        }
    }
    function puffTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < 26; i++) {
            const a = rand() * Math.PI * 2, r = rand() * 34;
            const x = 64 + Math.cos(a) * r, y = 64 + Math.sin(a) * r;
            const s = 14 + rand() * 30;
            const g = ctx.createRadialGradient(x, y, 0, x, y, s);
            const v = 200 + rand() * 55;
            g.addColorStop(0, `rgba(${v},${v * 0.94},${v * 0.82},${0.10 + rand() * 0.14})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(x - s, y - s, s * 2, s * 2);
        }
        return new THREE.CanvasTexture(canvas);
    }
    function buildPuffs() {
        const tex = puffTexture();
        puffGroup = new THREE.Group();
        const tint = new THREE.Color();
        const palette = [0xf2e6cc, 0xe0c8a4, 0xd8b088, 0xc89878, 0xf8f2e4];
        for (let i = 0; i < 240; i++) {
            const layer = rand();
            const y = layer < 0.5 ? -15 + rand() * 45 : layer < 0.82 ? 30 + rand() * 130 : 160 + rand() * 120;
            const angle = rand() * Math.PI * 2, r = 20 + Math.sqrt(rand()) * 340;
            const x = Math.cos(angle) * r, z = Math.sin(angle) * r;
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex, color: tint.setHex(palette[Math.floor(rand() * palette.length)]).clone(),
                transparent: true, opacity: 0.18 + rand() * 0.22, depthWrite: false
            }));
            const w = 60 + rand() * 200;
            sprite.scale.set(w, w * (0.3 + rand() * 0.25), 1);
            sprite.position.set(x, y, z);
            sprite.userData.phase = rand() * Math.PI * 2;
            puffGroup.add(sprite);
        }
        puffGroup.renderOrder = 1;
        scene.add(puffGroup);
    }
    // Bake a tileable 3D noise volume (Perlin-style fbm in R, inverted Worley cells in G).
    // The raymarch shader samples this to know how dense the cloud is at any point in space.
    function bakeCloudNoise3D(size = 64) {
        const data = new Uint8Array(size * size * size * 4);
        const prand = JupiterAtmo.random(4242);
        // Worley feature points on a wrapped grid (4 cells per axis)
        const WC = 4, wpts = [];
        for (let z = 0; z < WC; z++) for (let y = 0; y < WC; y++) for (let x = 0; x < WC; x++)
            wpts.push([(x + prand()) / WC, (y + prand()) / WC, (z + prand()) / WC]);
        function hash3(x, y, z) {
            let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
            return h - Math.floor(h);
        }
        function vnoise(x, y, z) {
            const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
            let fx = x - ix, fy = y - iy, fz = z - iz;
            fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
            const g = (dx, dy, dz) => hash3(((ix + dx) % size + size) % size, ((iy + dy) % size + size) % size, ((iz + dz) % size + size) % size);
            const x00 = g(0, 0, 0) * (1 - fx) + g(1, 0, 0) * fx, x10 = g(0, 1, 0) * (1 - fx) + g(1, 1, 0) * fx;
            const x01 = g(0, 0, 1) * (1 - fx) + g(1, 0, 1) * fx, x11 = g(0, 1, 1) * (1 - fx) + g(1, 1, 1) * fx;
            return (x00 * (1 - fy) + x10 * fy) * (1 - fz) + (x01 * (1 - fy) + x11 * fy) * fz;
        }
        function fbm(x, y, z) {
            return vnoise(x * 4, y * 4, z * 4) * 0.55 + vnoise(x * 8, y * 8, z * 8) * 0.3 + vnoise(x * 16, y * 16, z * 16) * 0.15;
        }
        for (let z = 0; z < size; z++) for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
            const u = x / size, v = y / size, w = z / size;
            // Worley F1 (toroidal wrap)
            let f1 = 9;
            for (const p of wpts) {
                let dx = Math.abs(u - p[0]); if (dx > 0.5) dx = 1 - dx;
                let dy = Math.abs(v - p[1]); if (dy > 0.5) dy = 1 - dy;
                let dz = Math.abs(w - p[2]); if (dz > 0.5) dz = 1 - dz;
                const d = dx * dx + dy * dy + dz * dz;
                if (d < f1) f1 = d;
            }
            const worley = 1 - Math.min(1, Math.sqrt(f1) * 2.2);
            const i = (z * size * size + y * size + x) * 4;
            data[i] = Math.max(0, Math.min(255, fbm(u, v, w) * 255));
            data[i + 1] = Math.max(0, Math.min(255, Math.pow(worley, 1.4) * 255));
            data[i + 2] = Math.max(0, Math.min(255, vnoise(u * 3 + 9, v * 3, w * 3) * 255));
            data[i + 3] = 255;
        }
        const tex = new THREE.DataTexture3D(data, size, size, size);
        tex.format = THREE.RGBAFormat; tex.type = THREE.UnsignedByteType;
        tex.minFilter = tex.magFilter = THREE.LinearFilter;
        tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
        tex.needsUpdate = true;
        return tex;
    }
    // Volumetric cloud slab: a box volume raymarched per-pixel, inspired by
    // github.com/leoawen/volumetric_cloud_atmosphere_scattering (MIT).
    function buildVolumeClouds() {
        if (!renderer.capabilities.isWebGL2 || !THREE.DataTexture3D) return;
        const noiseTex = bakeCloudNoise3D(64);
        const boxMin = new THREE.Vector3(-800, -38, -800), boxMax = new THREE.Vector3(800, 105, 800);
        const geo = new THREE.BoxGeometry(boxMax.x - boxMin.x, boxMax.y - boxMin.y, boxMax.z - boxMin.z);
        const mat = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            side: THREE.BackSide, transparent: true, depthWrite: false,
            uniforms: {
                uNoise: { value: noiseTex },
                uBoxMin: { value: boxMin }, uBoxMax: { value: boxMax },
                uTime: { value: 0 }, uDarkness: { value: 0 },
                uCoverage: { value: 0.46 }, uExtinct: { value: 3.2 },
                uSunDir: { value: new THREE.Vector3(-0.58, 0.4, -0.52).normalize() },
                uStormCenter: { value: new THREE.Vector2(-230, -150) },
                uLit: { value: new THREE.Color(0xfff2dc) },
                uShade: { value: new THREE.Color(0xbca88e) },
                uFogCol: { value: new THREE.Color(0xa08b6b) },
                uCream: { value: new THREE.Color(0xf5ecd8) },
                uTan: { value: new THREE.Color(0xd8b284) },
                uRust: { value: new THREE.Color(0xb8553c) },
            },
            vertexShader: `
                varying vec3 vWorldPos;
                void main() {
                    vec4 wp = modelMatrix * vec4(position, 1.0);
                    vWorldPos = wp.xyz;
                    gl_Position = projectionMatrix * viewMatrix * wp;
                }`,
            fragmentShader: `
                precision highp sampler3D;
                uniform sampler3D uNoise;
                uniform vec3 uBoxMin, uBoxMax, uSunDir, uLit, uShade, uCream, uTan, uRust, uFogCol;
                uniform vec2 uStormCenter;
                uniform float uTime, uDarkness, uCoverage, uExtinct;
                varying vec3 vWorldPos;
                out vec4 fragColor;

                vec2 boxHit(vec3 ro, vec3 rd) {
                    vec3 inv = 1.0 / rd;
                    vec3 t1 = (uBoxMin - ro) * inv, t2 = (uBoxMax - ro) * inv;
                    vec3 tmin = min(t1, t2), tmax = max(t1, t2);
                    return vec2(max(max(tmin.x, tmin.y), tmin.z), min(min(tmax.x, tmax.y), tmax.z));
                }
                float cloudDensity(vec3 p) {
                    vec3 uvw = (p - uBoxMin) / (uBoxMax - uBoxMin);
                    float hFade = smoothstep(0.0, 0.16, uvw.y) * (1.0 - smoothstep(0.42, 0.95, uvw.y));
                    // Cylindrical rim fade — a square boundary leaves a brightness step on diagonal rays
                    float rad = length(p.xz);
                    float edgeF = 1.0 - smoothstep(520.0, 780.0, rad);
                    // Storm swirl: rotate the density lookup around the vortex
                    vec2 rel = p.xz - uStormCenter;
                    float sd = length(rel);
                    float ang = exp(-pow(sd / 260.0, 2.0)) * 1.35;
                    mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
                    vec2 sxz = uStormCenter + rot * rel;
                    // Zonal stretch: Jupiter clouds elongate along the band direction (x),
                    // so sample x at a much lower frequency than z → streamers, not lumps
                    vec3 wp = vec3(sxz.x * 0.0032, p.y * 0.011, sxz.y * 0.010) + vec3(uTime * 0.004, 0.0, uTime * 0.0008);
                    vec4 n = texture(uNoise, wp);
                    float base = n.r * 0.68 + n.g * 0.4;
                    float band = 0.78 + 0.22 * sin(p.z * 0.018 + n.b * 5.0);
                    float dens = clamp((base * band - (1.0 - uCoverage)) * 1.8, 0.0, 1.0);
                    // Worley erosion carves wispy edges into each puff
                    float detail = texture(uNoise, wp * 3.9 + vec3(0.31)).g;
                    dens *= 1.0 - detail * 0.3;
                    dens = dens * dens * (3.0 - 2.0 * dens); // smoothstep softens silhouettes
                    dens = pow(dens, 1.4); // push mids down — soft fringe, dense cores
                    return dens * hFade * edgeF;
                }
                void main() {
                    vec3 ro = cameraPosition;
                    vec3 rd = normalize(vWorldPos - ro);
                    vec2 hit = boxHit(ro, rd);
                    float t0 = max(hit.x, 0.0), t1 = hit.y;
                    if (t1 <= t0) discard;
                    const int STEPS = 48;
                    float dt = (t1 - t0) / float(STEPS);
                    // Interleaved gradient noise jitter kills step banding better than a hash
                    float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
                    t0 += dt * jit;
                    vec3 acc = vec3(0.0);
                    float T = 1.0;
                    float phase = 0.4 + 0.6 * pow(max(dot(rd, uSunDir), 0.0), 3.0);
                    for (int i = 0; i < STEPS; i++) {
                        vec3 p = ro + rd * (t0 + dt * (float(i) + 0.5));
                        float d = cloudDensity(p);
                        if (d > 0.003) {
                            float ld = cloudDensity(p + uSunDir * 14.0);
                            float shade = clamp(1.0 - ld * 1.4, 0.5, 1.0);
                            float bnd = sin(p.z * 0.045 + texture(uNoise, p * 0.0012).b * 4.0);
                            vec3 tint = mix(uTan, uCream, smoothstep(-0.5, 0.5, bnd));
                            float sd = length(p.xz - uStormCenter);
                            tint = mix(tint, uRust, exp(-pow(sd / 210.0, 2.0)) * 0.85);
                            vec3 c = mix(uShade, uLit, shade) * tint * phase * 1.18;
                            float a = 1.0 - exp(-d * uExtinct * dt);
                            acc += T * a * c;
                            T *= 1.0 - a;
                            if (T < 0.02) break;
                        }
                    }
                    acc *= 1.0 - uDarkness * 0.82;
                    // Distant clouds dissolve into the ambient haze instead of staying hard-edged
                    float hazeF = 1.0 - exp(-t0 * 0.005);
                    acc = mix(acc, uFogCol * (1.0 - uDarkness * 0.82) * (1.0 - T), hazeF * 0.85);
                    fragColor = vec4(acc, 1.0 - T);
                }`
        });
        volCloud = new THREE.Mesh(geo, mat);
        volCloud.position.set(0, (boxMin.y + boxMax.y) / 2, 0);
        volCloud.frustumCulled = false;
        volCloud.renderOrder = 2;
        scene.add(volCloud);
    }
    function dotTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, 'rgba(255,250,235,1)');
        g.addColorStop(0.35, 'rgba(255,244,220,0.55)');
        g.addColorStop(1, 'rgba(255,244,220,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }
    function buildCrystalStorm() {
        const count = quality === 'high' ? 5200 : 2600;
        const positions = new Float32Array(count * 3);
        stormVel = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const a = rand() * Math.PI * 2, r = 15 + Math.sqrt(rand()) * 420;
            positions[i * 3] = Math.cos(a) * r;
            positions[i * 3 + 1] = -360 + rand() * 800;
            positions[i * 3 + 2] = Math.sin(a) * r;
            stormVel[i] = 0.8 + rand() * 2.6;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            size: 1.5, map: dotTexture(), transparent: true, opacity: 0.5,
            depthWrite: false, blending: THREE.AdditiveBlending, color: 0xfff0d8, sizeAttenuation: true
        });
        stormPts = new THREE.Points(geo, mat);
        stormPts.frustumCulled = false;
        scene.add(stormPts);
    }
    function buildSky() {
        skyMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false, depthTest: false,
            uniforms: { darkening: { value: 0 }, flash: { value: 0 }, tJupiter: { value: null }, hasMap: { value: 0 } },
            vertexShader: 'varying vec3 vP; void main(){vP=position; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_Position.z=gl_Position.w;}',
            fragmentShader: `uniform float darkening; uniform float flash; uniform sampler2D tJupiter; uniform float hasMap; varying vec3 vP;
                float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
                float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
                float fbm(vec2 p){return n2(p)*0.55+n2(p*2.3)*0.28+n2(p*5.1)*0.17;}
                void main(){
                    vec3 dir = normalize(vP);
                    float up = clamp(dir.y, -1.0, 1.0);
                    float az = atan(dir.z, dir.x);
                    // Sample turbulence on dir.xz (continuous around the dome) — atan() would jump at the ±π wrap
                    float turb = fbm(dir.xz * 3.0 + vec2(0.0, up * 12.0)) - 0.5;
                    float band = sin(up * 26.0 + turb * 4.2);
                    vec3 cream = vec3(0.86, 0.79, 0.64), tan_ = vec3(0.60, 0.44, 0.30), rust = vec3(0.52, 0.30, 0.22), brown = vec3(0.30, 0.20, 0.14);
                    vec3 sky = mix(tan_, cream, smoothstep(-0.35, 0.55, band));
                    sky = mix(rust, sky, smoothstep(-0.6, -0.05, band));
                    float filament = smoothstep(0.92, 1.0, abs(sin(up * 26.0 + turb * 6.5))) * smoothstep(0.3, 0.0, up);
                    sky = mix(sky, vec3(0.92, 0.88, 0.78), filament * 0.5);
                    // Real Cassini/Juno cloud map on the upper dome
                    vec2 juv = vec2(az / 6.2831853 + 0.5, clamp(0.62 - up * 0.26, 0.02, 0.98));
                    vec3 realMap = texture2D(tJupiter, juv).rgb * vec3(0.95, 0.92, 0.88);
                    sky = mix(sky, realMap, hasMap * smoothstep(-0.05, 0.45, up) * 0.78);
                    sky = mix(brown, sky, smoothstep(-0.25, 0.4, up));
                    sky = mix(sky, vec3(0.10, 0.09, 0.11), smoothstep(0.55, 0.95, up));
                    sky = mix(sky, vec3(0.16, 0.11, 0.08), smoothstep(-0.15, -0.8, up));
                    sky += flash * vec3(0.5, 0.55, 0.7);
                    sky *= 1.0 - darkening * 0.82;
                    gl_FragColor = vec4(sky, 1.0);
                }`
        });
        const sky = new THREE.Mesh(new THREE.SphereGeometry(6800, 32, 24), skyMaterial);
        sky.frustumCulled = false;
        sky.renderOrder = -1;
        scene.add(sky);
        skyPivot = new THREE.Group();
        scene.add(skyPivot);
        const sun = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 18), new THREE.MeshBasicMaterial({ color: 0xfff4e0 }));
        sun.position.copy(sunlight.position).normalize().multiplyScalar(2100);
        skyPivot.add(sun);
        const haloCanvas = document.createElement('canvas');
        haloCanvas.width = haloCanvas.height = 128;
        const haloContext = haloCanvas.getContext('2d');
        const gradient = haloContext.createRadialGradient(64, 64, 2, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255,248,235,0.9)');
        gradient.addColorStop(0.25, 'rgba(255,240,215,0.35)');
        gradient.addColorStop(1, 'rgba(255,230,195,0)');
        haloContext.fillStyle = gradient;
        haloContext.fillRect(0, 0, 128, 128);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, opacity: 0.55, depthWrite: false }));
        halo.scale.set(60, 60, 1);
        halo.position.copy(sun.position);
        skyPivot.add(halo);
        const proxy = new THREE.Mesh(new THREE.SphereGeometry(140, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        proxy.position.copy(sun.position);
        proxy.userData.body = 'sun';
        skyPivot.add(proxy);
        skyBodies.push(proxy);
        sunMesh = sun;
        return new Promise(resolve => {
            new THREE.TextureLoader().load('textures/2k_jupiter.jpg', tex => {
                tex.encoding = THREE.sRGBEncoding;
                tex.wrapS = THREE.MirroredRepeatWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.minFilter = THREE.LinearMipmapLinearFilter;
                skyMaterial.uniforms.tJupiter.value = tex;
                skyMaterial.uniforms.hasMap.value = 1;
                resolve();
            }, undefined, () => resolve());
        });
    }
    function createGltfLoader() {
        const loader = new THREE.GLTFLoader();
        if (THREE.DRACOLoader) {
            const draco = new THREE.DRACOLoader();
            draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/gltf/');
            loader.setDRACOLoader(draco);
        }
        return loader;
    }
    function loadSceneModel(url) {
        return new Promise(resolve => {
            if (!THREE.GLTFLoader) return resolve(null);
            createGltfLoader().load(url, gltf => resolve(gltf.scene), undefined, () => resolve(null));
        });
    }
    async function buildOrbiter() {
        const model = await loadSceneModel('models/galileo.glb');
        if (!model) return;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (!size.y || !isFinite(size.y)) return;
        model.scale.setScalar(7 / Math.max(size.x, size.y, size.z));
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -center.y, -center.z);
        model.traverse(o => { if (o.isMesh) o.castShadow = false; });
        orbiter = new THREE.Group();
        orbiter.add(model);
        orbiter.position.set(6, 276, -9);
        orbiter.rotation.set(0.35, 0.7, 0.15);
        scene.add(orbiter);
    }
    async function buildAstronaut(texture) {
        const hull = new THREE.MeshStandardMaterial({ color: 0x6e6a5e, roughness: 0.55, metalness: 0.6 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x1d1f21, roughness: 0.85, metalness: 0.25 });
        astronaut = new THREE.Group();
        const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.07, 20), dark);
        shield.position.set(0, -1.05, -0.55);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.022, 8, 24), hull);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, -0.98, -0.55);
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6), hull);
        mast.position.set(0.24, -0.55, -0.45);
        mast.rotation.z = -0.35;
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.45, 6), hull);
        boom.position.set(-0.24, -0.68, -0.4);
        boom.rotation.z = 0.5;
        boom.rotation.x = -0.3;
        const antenna = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), hull);
        antenna.position.set(0.32, -0.28, -0.5);
        astronaut.add(shield, ring, mast, boom, antenna);
        astronaut.userData.legs = [];
        astronaut.visible = false;
        scene.add(astronaut);
        // Real descent probe: NASA's Huygens model (the probe Cassini dropped into Titan)
        const model = await loadSceneModel('models/huygens.glb');
        if (!model) return;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3(); box.getSize(size);
        const center = new THREE.Vector3(); box.getCenter(center);
        model.position.sub(center);
        model.scale.setScalar(0.62 / Math.max(size.x, size.y, size.z));
        astronaut.children.forEach(c => c.visible = false);
        const wrap = new THREE.Group();
        wrap.add(model);
        wrap.position.set(0.3, -1.25, -0.35);
        wrap.rotation.set(1.15, -0.55, 0.35);
        astronaut.add(wrap);
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
        const material = new THREE.PointsMaterial({ size: 0.06 + energy * 0.05, map: dustTexture(), color: 0xdce8f2, transparent: true, opacity: 0.6, depthWrite: false, sizeAttenuation: true });
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
                let px = attribute.getX(j) + (burst.velocities[j * 3] + 0.14) * dt;
                let py = attribute.getY(j) + burst.velocities[j * 3 + 1] * dt;
                let pz = attribute.getZ(j) + (burst.velocities[j * 3 + 2] + 0.06) * dt;
                burst.velocities[j * 3 + 1] -= gravity * 0.12 * dt;
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
    const rand = JupiterAtmo.random(4451);
    function updateGravityButton() {
        $('gravity-button').textContent = t(gravity === JupiterAtmo.GRAVITY ? 'gravityCompare' : 'gravityMercury');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== JupiterAtmo.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === JupiterAtmo.GRAVITY ? JupiterAtmo.EARTH_GRAVITY : JupiterAtmo.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === JupiterAtmo.GRAVITY ? 'mercuryTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === JupiterAtmo.GRAVITY ? 'gravityMercuryTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-jupiter-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
        if (audio) audio.setEnabled(soundEnabled);
        updateSoundButton();
    }
    function pickSkyBody(x, y) {
        skyPointer.set(x / innerWidth * 2 - 1, 1 - y / innerHeight * 2);
        skyRay.setFromCamera(skyPointer, camera);
        const hits = skyRay.intersectObjects(skyBodies, false);
        return hits.length ? hits[0].object.userData.body : null;
    }
    function lookAtBody(body) {
        const proxy = skyBodies.find(item => item.userData.body === body);
        if (!proxy || !camera) return;
        const dx = proxy.position.x - position.x, dz = proxy.position.z - position.z;
        const targetYaw = Math.atan2(-dx, -dz);
        const targetPitch = THREE.MathUtils.clamp(Math.atan2(proxy.position.y - camera.position.y, Math.hypot(dx, dz)), -1.45, 1.2);
        const delta = THREE.MathUtils.euclideanModulo(targetYaw - yaw + Math.PI, Math.PI * 2) - Math.PI;
        cameraTween = { fromYaw: yaw, fromPitch: pitch, toYaw: yaw + delta, toPitch: targetPitch, t: 0, body };
    }
    function showMoonlet(body) {
        clearMovement();
        $('moonlet-title').textContent = t(`${body}Name`);
        $('moonlet-text').textContent = t(`${body}Text`);
        const focusNames = { sun: 'Sun', earth: 'Earth', venus: 'Venus' };
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Jupiter'}`;
        $('moonlet-dialog').showModal();
    }
    function updateCamera() {
        if (!walker) return;
        const headMotion = motionEnabled && !photoMode && exploring;
        const bob = headMotion ? Math.sin(walker.stride * 0.7) * 0.05 : 0;
        const roll = headMotion ? Math.sin(walker.stride * 0.4) * 0.004 : 0;
        camera.position.set(position.x, walker.y + bob, position.z);
        camera.rotation.set(pitch, yaw, roll, 'YXZ');
        if (astronaut) {
            astronaut.visible = exploring;
            astronaut.position.set(position.x, walker.y, position.z);
            astronaut.rotation.y = yaw;
        }
        $('movement-state').textContent = walker.thrusting ? t('jump') : t('grounded');
        $('heading').textContent = `${String(Math.round((-yaw * 180 / Math.PI + 360) % 360)).padStart(3, '0')}°`;
        $('distance-value').textContent = `${Math.round(walker.y)} m · ${walker.vy >= 0 ? '↑' : '↓'}${Math.abs(walker.vy).toFixed(1)} m/s`;
    }
    function clearMovement() {
        keys.clear(); touchKeys.clear(); drag = null;
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
        walker = JupiterAtmo.createWalker(surface, position);
        if (station.y !== undefined) walker.y = station.y;
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
            const burn = keys.has('Space') || touchKeys.has('burn');
            JupiterAtmo.updateWalker(surface, walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: burn }, dt, obstacles, gravity);
            position.x = walker.x; position.z = walker.z;
            if (walker.thrusting && !thrustActive) { thrustActive = true; if (audio) audio.jump(); }
            if (!walker.thrusting) thrustActive = false;
            if (walker.thrusting && Math.random() < 0.5) spawnDust(position.x + (rand() - 0.5), walker.y - 1.2, position.z + (rand() - 0.5), 2, 0.3);
            if (audio) audio.setDescent(walker.vy);
            if (Math.hypot(position.x, position.z) > JupiterAtmo.WALK_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
            sunlight.shadow.needsUpdate = true;
            updateCamera();
        }
        if (cameraTween && dt > 0) {
            cameraTween.t = Math.min(1, cameraTween.t + dt / 1.15);
            const ease = cameraTween.t * cameraTween.t * (3 - 2 * cameraTween.t);
            yaw = cameraTween.fromYaw + (cameraTween.toYaw - cameraTween.fromYaw) * ease;
            pitch = cameraTween.fromPitch + (cameraTween.toPitch - cameraTween.fromPitch) * ease;
            updateCamera();
            if (cameraTween.t >= 1) { const target = cameraTween.body; cameraTween = null; showMoonlet(target); }
        }
        if (exploring && dt > 0) {
            updateDust(dt);
            if (orbiter) { orbiter.rotation.y += dt * 0.1; orbiter.position.y += dt * 0.12; }
            flashTimer -= dt;
            boltTimer -= dt;
            if (skyMaterial) {
                skyMaterial.uniforms.flash.value = Math.max(0, skyMaterial.uniforms.flash.value - dt * 2.4);
                const depth = THREE.MathUtils.clamp((0 - walker.y) / (0 - JupiterAtmo.MIN_ALTITUDE + 60), 0, 1);
                skyMaterial.uniforms.darkening.value = depth;
                if (ambientLight) ambientLight.intensity = 1.4 * (1 - depth * 0.75);
                sunlight.intensity = 2.6 * (1 - depth * 0.8);
                scene.fog.density = 0.0022 + depth * 0.012;
                scene.fog.color.setHex(0xa08b6b).lerp(new THREE.Color(0x241812), depth);
                if (volCloud) {
                    volCloud.material.uniforms.uTime.value = now * 0.001;
                    volCloud.material.uniforms.uDarkness.value = depth;
                    volCloud.material.uniforms.uFogCol.value.copy(scene.fog.color);
                }
                if (shaftPass && sunMesh) {
                    const sp = sunMesh.getWorldPosition(new THREE.Vector3()).project(camera);
                    const sx = sp.x * 0.5 + 0.5, sy = sp.y * 0.5 + 0.5;
                    const edge = Math.min(1, Math.max(0, (sx + 0.35) / 0.3)) * Math.min(1, Math.max(0, (1.35 - sx) / 0.3))
                               * Math.min(1, Math.max(0, (sy + 0.35) / 0.3)) * Math.min(1, Math.max(0, (1.35 - sy) / 0.3));
                    shaftPass.uniforms.uSunPos.value.set(sx, sy);
                    shaftPass.uniforms.uIntensity.value = sp.z < 1 ? 0.25 * (1 - depth * 0.7) * edge : 0;
                }
            }
            if (flashTimer <= 0) {
                flashTimer = 4 + rand() * 9;
                if (skyMaterial) skyMaterial.uniforms.flash.value = 0.4 + rand() * 0.7;
                if (audio && rand() < 0.8) audio.thunder();
                if (bolts.length && walker && walker.y < 60) {
                    const bolt = bolts[Math.floor(rand() * bolts.length)];
                    const angle = rand() * Math.PI * 2, dist = 30 + rand() * 120;
                    bolt.position.set(position.x + Math.cos(angle) * dist, walker.y - 40 - rand() * 80, position.z + Math.sin(angle) * dist);
                    bolt.rotation.y = yaw + Math.PI / 2;
                    bolt.visible = true;
                    bolt.material.opacity = 0.9;
                    boltTimer = 0.55 + rand() * 0.4;
                    bolt.userData.life = boltTimer;
                }
            }
            if (boltTimer <= 0) for (const bolt of bolts) if (bolt.visible) { bolt.material.opacity -= dt * 3; if (bolt.material.opacity <= 0) bolt.visible = false; }
            if (stormDisc) stormDisc.rotation.z += dt * 0.06;
            if (deckShader && deckShader.userData.shader) deckShader.userData.shader.uniforms.uTime.value = now * 0.001;
            if (puffGroup) {
                for (const puff of puffGroup.children) {
                    puff.position.x += Math.sin(now * 0.0001 + puff.userData.phase) * dt * 2.2;
                    puff.position.y += Math.cos(now * 0.00013 + puff.userData.phase) * dt * 0.6;
                }
            }
            if (stormPts) {
                const arr = stormPts.geometry.attributes.position.array;
                for (let i = 0; i < stormVel.length; i++) {
                    arr[i * 3 + 1] -= stormVel[i] * dt;
                    if (arr[i * 3 + 1] < -370) arr[i * 3 + 1] = 430;
                }
                stormPts.geometry.attributes.position.needsUpdate = true;
                stormPts.rotation.y += dt * 0.003;
            }
            if (cinePass) cinePass.material.uniforms.uTime.value = now * 0.001;
            for (const field of crystalField) field.mesh.rotation.y += dt * 0.008;
            if (featuredRock) { featuredRock.rotation.y += dt * 0.5; featuredRock.rotation.x += dt * 0.2; }
        }
        if (Math.hypot(sunlight.target.position.x - position.x, sunlight.target.position.z - position.z) > 20) {
            sunlight.target.position.set(position.x, 0, position.z);
            sunlight.position.set(position.x - 180, 105, position.z - 160);
            sunlight.shadow.needsUpdate = true;
        }
        if (discoveryUI) discoveryUI.update(now);
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
            cameraTween = null;
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
            if (!clicked || !exploring || photoMode || isDialogOpen()) return;
            const body = pickSkyBody(event.clientX, event.clientY);
            if (body) lookAtBody(body);
            else if (discoveryUI) discoveryUI.hitRock(event.clientX, event.clientY);
        });
        canvas.addEventListener('pointercancel', endDrag);
        canvas.addEventListener('lostpointercapture', endDrag);
        const movementCodes = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
        document.addEventListener('keydown', event => {
            if (event.code === 'Escape' && isDialogOpen()) {
                event.preventDefault();
                for (const id of ['guide-dialog', 'discovery-dialog', 'moonlet-dialog']) { const dialog = $(id); if (dialog.open) dialog.close(); }
                canvas.focus({ preventScroll: true });
                return;
            }
            if (event.code === 'Escape' && photoMode) { setPhoto(false); return; }
            if ((event.target instanceof Element && event.target.matches('input, textarea, select, button, a')) || isDialogOpen()) return;
            if (movementCodes.includes(event.code) && exploring && !photoMode) { event.preventDefault(); keys.add(event.code); }
            if (event.code === 'Space' && exploring && !photoMode) {
                event.preventDefault();
                keys.add('Space');
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
            if (!window.THREE || !window.JupiterAtmo) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.95;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x6b5a44);
            scene.fog = new THREE.FogExp2(0xa08b6b, 0.0024);
            camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 7200);
            ambientLight = new THREE.AmbientLight(0xcbb894, 1.4);
            scene.add(ambientLight);
            scene.add(new THREE.HemisphereLight(0xd8c8a8, 0x4a3a28, 0.8));
            sunlight = new THREE.DirectionalLight(0xfff4e0, 2.6);
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
                composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.5, 0.55, 0.74));
                // Cheap radial god-rays: blur bright sky toward the Sun's screen position
                shaftPass = new THREE.ShaderPass({
                    uniforms: { tDiffuse: { value: null }, uSunPos: { value: new THREE.Vector2(0.5, 0.5) }, uIntensity: { value: 0 } },
                    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
                    fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uSunPos; uniform float uIntensity; varying vec2 vUv;
                        void main(){
                            vec4 base = texture2D(tDiffuse, vUv);
                            if (uIntensity <= 0.001) { gl_FragColor = base; return; }
                            vec2 stepDir = (uSunPos - vUv) / 22.0;
                            vec2 uv2 = vUv;
                            vec3 shaft = vec3(0.0);
                            float w = 1.0, tot = 0.0;
                            for (int i = 0; i < 22; i++) {
                                uv2 += stepDir;
                                vec3 s = texture2D(tDiffuse, uv2).rgb;
                                float lum = max(0.0, dot(s, vec3(0.35, 0.45, 0.2)) - 0.72) * 1.6;
                                shaft += s * lum * w;
                                tot += w; w *= 0.90;
                            }
                            base.rgb += shaft / max(tot, 0.001) * uIntensity * vec3(1.0, 0.88, 0.68);
                            gl_FragColor = base;
                        }`
                });
                composer.addPass(shaftPass);
                composer.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
                if (THREE.FXAAShader) {
                    fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
                    fxaaPass.material.uniforms.resolution.value.set(1 / (innerWidth * renderer.getPixelRatio()), 1 / (innerHeight * renderer.getPixelRatio()));
                    composer.addPass(fxaaPass);
                }
                cinePass = new THREE.ShaderPass({
                    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVig: { value: 0.42 }, uGrain: { value: 0.028 } },
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
            buildRocks();
            buildStorm();
            buildBolts();
            buildPuffs();
            if (!location.search.includes('nocloud')) buildVolumeClouds();
            buildCrystalStorm();
            await buildAstronaut(texture);
            buildOrbiter();
            walker = JupiterAtmo.createWalker(surface, position);
            walker.y = stations[0].y || 260;
            await buildSky();
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.JupiterExpedition, terrain: JupiterAtmo, strings: discoveryStrings });
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
    $('jump-button').addEventListener('pointerdown', event => { event.preventDefault(); try { event.target.setPointerCapture(event.pointerId); } catch (e) { } touchKeys.add('burn'); });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) $('jump-button').addEventListener(name, () => touchKeys.delete('burn'));
    $('motion-button').addEventListener('click', () => { motionEnabled = !motionEnabled; updateMotionButton(); if (ready) updateCamera(); });
    $('sound-button').addEventListener('click', toggleSound);
    $('gravity-button').addEventListener('click', toggleGravity);
    $('guide-dialog').addEventListener('close', () => { if (ready) $('moon-canvas').focus({ preventScroll: true }); });
    $('moonlet-dialog').addEventListener('close', () => { if (ready) $('moon-canvas').focus({ preventScroll: true }); });
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
                link.href = url; link.download = `mzu-jupiter-descent-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Jupiter&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.JupiterAudio ? window.JupiterAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-jupiter-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
