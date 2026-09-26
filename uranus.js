(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.UranusExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
        const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'URANUS', surfaceMode: 'SIDEWAYS RING FLIGHT',
            chapter: 'EXPEDITION 007 / THE TILTED GIANT', title: 'Thread Uranus’s\ndark rings.', intro: 'Drift through Uranus’s narrow charcoal-dark rings — thin bands floating in turquoise light, the pale giant tipped on its side, Voyager 2 flying formation.', begin: 'Begin the flight', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Voyager 2 science.', gravity: 'GRAVITY', atmosphere: 'ENVIRONMENT', vacuum: 'Vacuum · dark ring dust', temperature: 'RING TEMP', tempValue: 'about −195°C', distance: 'RING PLANE',
            walkingHint: 'W A S D to drift · drag to look · Space to rise · C to sink · G gravity · M sound', touchHint: 'Arrows to drift · drag to look · Burn to rise', station0: 'Ring vista', station1: 'Inside the epsilon ring', station2: 'The dark gap',
            astronaut: 'PROBE', jump: 'Burn', grounded: 'Cruising', airborne: 'Cruising', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable camera drift for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SURVEYED RING SECTION',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Setting course for the sideways rings…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'Thirteen threads around a tipped world.',
            guideIntro: 'This is a small, freely explorable stretch of Uranus’s ring plane, not a whole-system simulation. The five observation points are different views of the same flight; three lie inside or beside the narrow dark bands.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityMercury: 'Back to Uranus gravity · G', gravityHint: 'Same probe, different pull. Uranus’s gravity is 8.87 m/s² — press G and the ring’s gentle tug barely changes under Earth’s near-identical pull.', soundOn: 'Probe sounds: On', soundOff: 'Probe sounds: Off', soundHint: 'A quiet cabin hum, faint radio hiss, and the rare tick of ring grains off the hull. M toggles.', gravityMercuryTag: 'Uranus gravity — 8.87 m/s².', gravityEarth: 'Earth gravity — 9.8 m/s². Nearly identical — that is the surprise.', mercuryTag: 'URANUS', earthTag: 'EARTH',
            controlsText: 'You are a probe cruising the ring plane — there is no ground and no falling. The probe cruises forward on its own; W A S D or the arrow keys drift you sideways and speed you up, Shift is faster still. Space rises, C sinks below the sheet. Drag to look. Touchscreens have direction and Burn buttons. G compares Earth gravity; M toggles sound. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'Uranus rolls around the Sun on its side — its axis tilted about 98°, so its thin rings stand nearly vertical against its orbit. The thirteen rings are narrow and almost black as charcoal. Only one spacecraft has ever visited: Voyager 2, in 1986. The band layout, moonlet, and tilt marker are artistic reconstructions.',
            soundText: 'The flight is far gentler than a real ring-plane crossing — Voyager 2 swept past at about 15 km per second. Press G to compare Earth gravity; Uranus pulls almost identically to home. Listen for rare grains ticking off the hull inside the bands.',
            assetText: 'Voyager 2 is a real NASA 3D model — the only probe ever to visit Uranus. The planet uses a real texture; the ring sheet, particle field, and starfield are generated locally.',
            skyEyebrow: 'IN URANUS’S SKY', sunName: 'The Sun', earthName: 'Earth', venusName: 'Uranus',
            sunText: 'From Uranus the Sun is nearly twenty times farther than from Earth — a sharp spark giving barely 0.3% of Earth’s daylight. Here it hangs almost directly over the giant’s pole. Artistic rendering, not an accurate ephemeris.',
            earthText: 'From Uranus, Earth never strays more than a few degrees from the Sun — a pale point lost in the glare. Its placement here is artistic.',
            venusText: 'The sideways giant — a featureless turquoise ball of hydrogen, helium, and methane haze, rolling on its side around the Sun. Voyager 2 flew by in 1986 and remains its only visitor. Artistic placement and scale.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Click the small Sun or the giant itself in the sky to learn about it — you can then visit it in the Solar System view.',
            featuresTitle: 'What you are seeing', features: [
                ['A Sun over the pole', 'Uranus lies on its side — the sunlight arrives almost perpendicular to the ring plane, pouring straight down instead of along it.'],
                ['Thin dark threads', 'The rings are a handful of narrow bands, widely spaced — charcoal-dark material, nothing like Saturn’s bright ice sheet.'],
                ['Charcoal around you', 'The particles tumbling past are nearly black — Uranus’s ring material reflects only a few percent of the light that hits it.'],
                ['The dark gaps', 'Between the rings lie wide emptiness — not perfectly empty, but swept thin by the little moons patrolling the lanes.'],
                ['A shepherd moonlet', 'A small irregular moon riding a gap — moons like Cordelia and Ophelia hold the ε ring’s edges in place.'],
                ['A tipped world model', 'A small marker globe shows the famous 98° tilt — the planet’s own rings standing vertical.'],
                ['Voyager on the wing', 'NASA’s real Voyager model flies alongside — the only spacecraft ever to see this view, on 24 January 1986.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this flight lane. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['The ring vista', 'From altitude the thin rings resolve — a few dark threads against turquoise space, the ε ring the brightest of them.', 'ARRIVAL', 'Ring vista'],
                ['A ring charcoal lump', 'This tumbling fragment is almost black — Uranus’s ring particles reflect just a few percent of sunlight. Rotate it in the specimen viewer.', 'PARTICLE', 'Dark ring material'],
                ['The dark gap', 'Inside a gap between the narrow rings — wide, quiet space swept clean by unseen shepherd moons.', 'STRUCTURE', 'Inter-ring gap'],
                ['The shepherd moonlet', 'A small irregular moon embedded near a ring edge — its gravity corrals drifting particles into thin sharp bands.', 'MOON', 'Shepherd moonlet'],
                ['The 98° tilt', 'A marker globe demonstrates Uranus’s famous lean — pole toward the Sun, rings standing nearly vertical through its orbit.', 'ORIENTATION', 'Axial tilt']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '天王星', surfaceMode: '侧躺环系飞行', chapter: '探索 007 / 躺倒的巨行星', title: '穿过天王星的黑暗窄环。',
            intro: '漂进天王星狭窄的炭黑色细环——青绿色微光中漂浮的细带，淡色巨行星侧躺在轨道面上，旅行者 2 号与你编队同行。', begin: '开始飞行', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受旅行者 2 号科学成果启发的虚构地点。',
            gravity: '天王星引力', atmosphere: '所处环境', vacuum: '真空 · 暗色环尘', temperature: '环平面温度', tempValue: '约 −195°C', distance: '环平面高度', walkingHint: 'W A S D 漂移 · 拖动转头 · 空格上升 · C 下沉 · G 引力 · M 声音', touchHint: '方向按钮漂移 · 拖动画面转头 · 点击推进上升',
            astronaut: '探测器视角', jump: '推进', grounded: '巡航中', airborne: '巡航中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭镜头漂移可获得更平稳的视角。',
            station0: '细环远眺', station1: 'ε 环之中', station2: '黑暗的间隙', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实环带测绘', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在设定侧躺环系航线…', fieldGuide: '天王星探索指南', guideTitle: '十三根细线，绕着一颗躺倒的星球。',
            guideIntro: '这是一段可以自由漫游的天王星环平面切片，而非完整的环系统模拟。五个观察点位于同一段航程的不同位置；其中三处就在狭窄暗环的内部或边缘。', controlsTitle: '如何移动',
            gravityCompare: '对比地球引力 · G', gravityMercury: '恢复天王星引力 · G', gravityHint: '同一台探测器，不同的引力。天王星引力 8.87 m/s²——按 G 对比地球，你会发现两者几乎一模一样。', soundOn: '探测器声音：开', soundOff: '探测器声音：关', soundHint: '安静的舱内低鸣、微弱的射电嘶声，以及环颗粒偶尔敲击舱体的轻响。M 切换。', gravityMercuryTag: '天王星引力 — 8.87 m/s²。', gravityEarth: '地球引力 — 9.8 m/s²。几乎一样——这正是让人意外的地方。', mercuryTag: '天王星', earthTag: '地球',
            controlsText: '你是一台巡航在环平面上的探测器——没有地面，也不会坠落。探测器会自行向前巡航；W A S D 或方向键控制侧向漂移和加减速，Shift 更快。空格上升，C 下沉到环面之下。拖动画面观察。触屏有方向按钮和推进键。G 对比地球引力，M 开关声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '天王星躺着绕太阳公转——自转轴倾角约 98°，所以它薄薄的环系在轨道面上几乎竖立。十三条环带狭窄、黑得像木炭。至今只有一艘飞船造访过：1986 年的旅行者 2 号。环带布局、小卫星和倾角标记都是艺术重建。',
            soundText: '飞行比真实的环平面穿越平缓得多——旅行者 2 号以每秒约 15 公里的速度掠过。按 G 对比地球引力；天王星引力几乎和地球完全相同。进入环带时，留意颗粒敲击舱体的轻响。',
            assetText: '旅行者 2 号是 NASA 的真实 3D 模型——唯一到访过天王星的探测器。行星使用真实贴图；环面、粒子场和星空由浏览器本地生成。',
            skyEyebrow: '天王星天空中', sunName: '太阳', earthName: '地球', venusName: '天王星',
            sunText: '从天王星看，太阳比地球上看远将近二十倍——一枚尖锐的小火点，光照只有地球白天的约 0.3%。这里它几乎正挂在巨行星的极点上。艺术呈现，并非精确星历。',
            earthText: '从天王星看，地球永远不会离开太阳几度之外——一个湮没在眩光中的淡色小点。位置经过艺术处理。',
            venusText: '侧躺的巨行星——氢、氦和甲烷雾霭构成的青绿色圆球，几乎看不见任何花纹，躺着绕太阳公转。1986 年旅行者 2 号飞掠而过，至今仍是唯一的访客。位置和比例经过艺术处理。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '点击天空中那颗小太阳或巨行星本身可以了解它，然后还能跳到太阳系视角。',
            featuresTitle: '你眼前的景观', features: [
                ['高挂极点的太阳', '天王星侧躺着——阳光几乎垂直于环平面洒下，自上而下而不是贴着环面。'],
                ['又细又暗的环带', '环是寥寥几条窄带，彼此间隔很宽——炭黑色的颗粒，和土星明亮的冰环完全不同。'],
                ['身边的炭块', '翻滚掠过的颗粒几乎是纯黑的——天王星的环物质只反射几个百分点的阳光。'],
                ['黑暗的间隙', '环与环之间是宽阔的空白——并非绝对空无一物，只是被巡逻的小卫星扫得极薄。'],
                ['牧羊小卫星', '骑在环缝中的一颗不规则小卫星——像天卫六、天卫七这样的卫星把 ε 环的边缘约束在原位。'],
                ['侧躺模型标记', '一颗小小的示范球展示著名的 98° 倾角——行星自己的环竖立起来。'],
                ['同行的旅行者号', 'NASA 真实的旅行者号模型与你编队——1986 年 1 月 24 日，唯一见过这番景象的探测器。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次飞行航道的边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['细环远眺', '从高处看，细环终于显形——几条暗色细线衬着青绿色空间，其中 ε 环最亮。', '抵达方式', '环面远景'],
                ['一块环炭', '这块翻滚的碎片几乎是纯黑的——天王星的环颗粒只反射几个百分点的阳光。在查看器中旋转它。', '环颗粒', '暗色环物质'],
                ['黑暗的间隙', '在狭窄环带之间的缝隙里——被看不见的牧羊卫星扫干净的宽阔安静空间。', '环结构', '环间隙'],
                ['牧羊小卫星', '嵌在环边附近的一颗不规则小卫星——它的引力把漂移的颗粒约束成又细又锋利的环带。', '卫星', '牧羊小卫星'],
                ['98° 倾角', '一颗标记小球演示天王星著名的侧躺——极点对着太阳，环系在轨道面上几乎竖立。', '姿态', '自转轴倾角']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR FLIGHT ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed ring section or an identified ring particle.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Match the ring layer before recording.', approach: 'Drift closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Drift to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures in the rings. H hides or restores the route card.',
            teasers: ['Take in the thin dark threads from above — bands, gaps, and the tipped giant beyond.', 'A charcoal-dark fragment drifts inside the ε ring — approach it and turn it in the specimen viewer.', 'Cruise into the wide dark gap between the narrow bands.', 'Ride the lanes north-east to where a small moon shepherds the ring edge.', 'Drift east to find a marker globe showing the famous sideways tilt.'],
            details: ['Uranus’s rings were discovered from Earth in 1977 when they blinked out a star behind them — all thirteen are narrow and dark. From here the brightest, the ε ring, is a faint thread against the turquoise glow. The layout is artistic, informed by real ring structure.', 'Uranus’s ring particles are among the darkest material in the Solar System — charcoal-grey, reflecting only a few percent of sunlight. Why they are so dark is still debated; radiation-darkened methane ice is one suspect.', 'The gaps between Uranus’s rings are wide and nearly empty — small moons like Cordelia and Ophelia patrol the lanes and keep the bands confined. Voyager 2’s camera saw fine dust lanes threading some gaps.', 'Cordelia and Ophelia — two small moons discovered by Voyager 2 — shepherd the ε ring from inside and out. This moonlet is an artistic stand-in; the real ones are tens of kilometres of dark rock and ice.', 'Uranus spins on its side — an axis tilted about 98°, probably knocked over by a giant impact long ago. Its rings and moons ride around the tipped equator, so the whole system rolls around the Sun like a wheel.']
        },
        zh: {
            fieldRoute: '你的飞行路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转碎片', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实环带测绘，也不是已鉴定的环颗粒样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点漂移', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请对齐这一环层再记录发现。', approach: '请漂近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，漂近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非环中的真实结构。H 可隐藏或恢复路线卡片。',
            teasers: ['从高处俯瞰又细又暗的环带——细线、缝隙，以及远处躺倒的巨行星。', 'ε 环里漂着一块炭黑色碎片——靠近它，在查看器中转动观察。', '驶进窄环之间宽阔的黑暗间隙。', '沿环道向东北，找到那颗约束环边缘的小卫星。', '向东漂移，找到展示著名侧躺姿态的标记小球。'],
            details: ['天王星的环是 1977 年从地球上发现的——它们挡住了后面一颗恒星的光。十三条环带全都又窄又暗。从这里看，最亮的 ε 环也只是青绿色光晕中的一根细线。环带布局是艺术再现，参考了真实环结构。', '天王星的环颗粒是太阳系中最暗的物质之一——炭灰色，只反射几个百分点的阳光。为什么这么黑仍有争议；被辐射晒黑的甲烷冰是主要嫌疑之一。', '天王星环之间的间隙宽阔且接近真空——天卫六、天卫七这样的小卫星巡逻其间，把环带约束在原位。旅行者 2 号的相机还拍到一些缝隙里穿行的细尘道。', '天卫六和天卫七——旅行者 2 号发现的两颗小卫星——一内一外看守着 ε 环。这颗小卫星是艺术替身；真身是几十公里宽的暗色岩石与冰。', '天王星侧躺着自转——倾角约 98°，很可能在很久以前被一次巨大撞击撞倒。它的环和卫星都绕着躺倒的赤道运行，整个系统像轮子一样滚着绕太阳转。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, sunlight, walker, probe, voyager, animationId = null;
    let motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = 0.55, pitch = -0.04, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = UranusRings.GRAVITY, audio = null, soundEnabled = true;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set();
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null;
    const skyBodies = [], skyRay = new THREE.Raycaster(), skyPointer = new THREE.Vector2();
    let skyPivot = null, uranusMesh = null, starField = null, ambientLight = null, thrustActive = false, iceField = [], ringSheet = null, puffGroup = null, composer = null, fxaaPass = null, cinePass = null, sunMesh = null, shaftPass = null, moonlet = null, tiltMarker = null, pingTimer = 2;
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
        high: { rocks: 2600, specks: 14000, texture: 1024, shadows: 2048, ratio: 1.75 },
        balanced: { rocks: 1600, specks: 8000, texture: 512, shadows: 1024, ratio: 1.5 },
        low: { rocks: 700, specks: 3500, texture: 512, shadows: 512, ratio: 1 }
    };
    const profile = profiles[quality];
    const rand = UranusRings.random(4451);
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
        $('gravity-mode').textContent = t(gravity === UranusRings.GRAVITY ? 'mercuryTag' : 'earthTag');
        if (walker) $('movement-state').textContent = t('grounded');
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
        if (error) console.error('Uranus expedition:', error);
    }
    // Ring sheet texture: concentric arcs matching UranusRings.ringDensity,
    // streaked tangentially so the sheet reads as countless fine ringlets.
    function makeRingTexture() {
        const size = profile.texture;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const image = ctx.createImageData(size, size);
        const px = image.data;
        const zSpan = 6000; // texture v axis covers the full 6 km sheet
        const cx = UranusRings.RING_CX, cz = UranusRings.RING_CZ;
        for (let y = 0; y < size; y++) {
            const wz = (y / size - 0.5) * zSpan;
            for (let x = 0; x < size; x++) {
                const wx = (x / size - 0.5) * zSpan;
                const dens = UranusRings.ringDensity(wx, wz);
                // fine ringlets: banded noise streaked along the arc direction
                const ang = Math.atan2(wz - cz, wx - cx);
                const rad = Math.hypot(wx - cx, wz - cz);
                const ripple = UranusRings.noise(ang * 60 + rad * 0.002, rad * 0.12) * 0.5 + UranusRings.noise(ang * 24, rad * 0.6) * 0.5;
                const flecks = UranusRings.noise(ang * 160, rad * 0.25) > 0.82 ? 0.3 : 0;
                let a = dens * (0.6 + ripple * 0.8 + flecks) + 0.02;
                a = Math.max(0, Math.min(1, a));
                const i = (y * size + x) * 4;
                const shade = UranusRings.noise(wx * 0.02, wz * 0.02);
                px[i] = 96 - shade * 14; px[i + 1] = 112 - shade * 12; px[i + 2] = 116 - shade * 10; px[i + 3] = Math.round(a * 250);
            }
        }
        ctx.putImageData(image, 0, 0);
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        return texture;
    }
    function buildRingSheet() {
        const texture = makeRingTexture();
        const group = new THREE.Group();
        // Two offset sheets give the ring plane visible thickness at grazing angles.
        for (const [dy, opacity] of [[0, 0.95], [-1.6, 0.5]]) {
            const geo = new THREE.PlaneGeometry(6000, 6000, 1, 1);
            geo.rotateX(-Math.PI / 2);
            const mat = new THREE.MeshBasicMaterial({
                map: texture, transparent: true, opacity, side: THREE.DoubleSide,
                depthWrite: false, fog: true
            });
            const sheet = new THREE.Mesh(geo, mat);
            sheet.position.y = dy;
            sheet.renderOrder = 1;
            group.add(sheet);
        }
        ringSheet = group;
        scene.add(group);
    }
    function iceGeometry(seed) {
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const p = geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const f = 0.75 + UranusRings.noise(x * 2.4 + seed, y * 2.4 + z * 1.7) * 0.5;
            p.setXYZ(i, x * f, y * f * 0.85, z * f);
        }
        geometry.computeVertexNormals();
        return geometry;
    }
    // Ice chunks live near the ring plane; as the probe cruises, chunks that fall
    // behind are recycled ahead so the field feels endless.
    function buildIceField() {
        const material = new THREE.MeshStandardMaterial({
            color: 0x424c52, roughness: 0.8, metalness: 0.12, flatShading: true,
            emissive: 0x0c1418, emissiveIntensity: 0.5
        });
        const transform = new THREE.Object3D();
        iceField = [];
        const WRAP = 420;
        for (let group = 0; group < 3; group++) {
            const count = Math.floor(profile.rocks / 3);
            const mesh = new THREE.InstancedMesh(iceGeometry(group * 17 + 3), material, count);
            const items = [];
            for (let i = 0; i < count; i++) {
                let x = (rand() - 0.5) * WRAP * 2, z = (rand() - 0.5) * WRAP * 2;
                const dens = UranusRings.ringDensity(x, z);
                // sparser placement outside dense bands
                if (rand() > dens + 0.12) { i--; continue; }
                const thickness = 3 + rand() * 9;
                const y = (rand() - 0.5) * thickness + (rand() - 0.5) * 2;
                const size = 0.08 + Math.pow(rand(), 3.2) * 2.6;
                items.push({ x, y, z, size, spin: rand() * Math.PI * 2, spinRate: (rand() - 0.5) * 0.6, tumble: rand() * Math.PI * 2 });
                transform.position.set(x, y, z);
                transform.scale.setScalar(size);
                transform.rotation.set(rand() * 3, rand() * 3, rand() * 3);
                transform.updateMatrix();
                mesh.setMatrixAt(i, transform.matrix);
            }
            mesh.count = items.length;
            mesh.frustumCulled = false;
            scene.add(mesh);
            iceField.push({ mesh, items, wrap: WRAP });
        }
        // The specimen lump for the discovery viewer — inside the ε ring.
        featuredRock = new THREE.Mesh(iceGeometry(77), material.clone());
        featuredRock.scale.setScalar(1.9);
        featuredRock.position.set(40, 9, -410);
        scene.add(featuredRock);
    }
    // Tiny bright grains streaming past — the "snow" of the ring plane.
    function buildSpecks() {
        const count = profile.specks;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (rand() - 0.5) * 700;
            positions[i * 3 + 1] = (rand() - 0.5) * 60 - rand() * 8;
            positions[i * 3 + 2] = (rand() - 0.5) * 700;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            size: 0.15, map: dotTexture(), transparent: true, opacity: 0.5,
            depthWrite: false, blending: THREE.AdditiveBlending, color: 0x8fb8c4, sizeAttenuation: true
        });
        const pts = new THREE.Points(geo, mat);
        pts.frustumCulled = false;
        pts.userData.isSpecks = true;
        scene.add(pts);
        iceField.push({ specks: pts, count });
    }
    function dotTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, 'rgba(240,248,255,1)');
        g.addColorStop(0.35, 'rgba(220,235,255,0.55)');
        g.addColorStop(1, 'rgba(220,235,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }
    // A shepherd moonlet — an irregular icy body embedded in the ring edge.
    function buildMoonlet() {
        const geo = new THREE.IcosahedronGeometry(1, 2);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const f = 0.72 + UranusRings.noise(x * 1.9 + 5, y * 1.9 + z * 1.4) * 0.56;
            p.setXYZ(i, x * f, y * f * 0.82, z * f);
        }
        geo.computeVertexNormals();
        moonlet = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
            color: 0x6a7076, roughness: 0.95, metalness: 0.05, flatShading: true
        }));
        moonlet.scale.setScalar(7);
        moonlet.position.set(-160, 10, 240);
        moonlet.rotation.set(0.4, 0.9, 0.2);
        moonlet.castShadow = true;
        scene.add(moonlet);
    }
    // The tilt marker — a little turquoise globe spinning on its side with a
    // vertical ring, demonstrating Uranus's famous 98° lean.
    function buildTiltMarker() {
        tiltMarker = new THREE.Group();
        const globe = new THREE.Mesh(
            new THREE.SphereGeometry(3.2, 32, 24),
            new THREE.MeshStandardMaterial({ color: 0x9fd9d6, roughness: 0.5, metalness: 0.05, emissive: 0x1c3a3c, emissiveIntensity: 0.6 })
        );
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(4.6, 5.4, 64),
            new THREE.MeshBasicMaterial({ color: 0x5d7078, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
        );
        ring.rotation.x = Math.PI / 2;
        const tipped = new THREE.Group();
        tipped.add(globe, ring);
        tipped.rotation.z = THREE.MathUtils.degToRad(98);
        tiltMarker.add(tipped);
        const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.12, 9, 8),
            new THREE.MeshStandardMaterial({ color: 0x2c3438, roughness: 0.7 })
        );
        mast.position.y = -7.5;
        tiltMarker.add(mast);
        tiltMarker.position.set(150, 14, 60);
        tiltMarker.userData.tipped = tipped;
        scene.add(tiltMarker);
    }
    function puffTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < 22; i++) {
            const a = rand() * Math.PI * 2, r = rand() * 36;
            const x = 64 + Math.cos(a) * r, y = 64 + Math.sin(a) * r;
            const s = 16 + rand() * 30;
            const g = ctx.createRadialGradient(x, y, 0, x, y, s);
            g.addColorStop(0, `rgba(210,225,245,${0.05 + rand() * 0.08})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(x - s, y - s, s * 2, s * 2);
        }
        return new THREE.CanvasTexture(canvas);
    }
    // Sparse icy haze wisps hovering near the plane — depth, not weather.
    function buildPuffs() {
        const tex = puffTexture();
        puffGroup = new THREE.Group();
        for (let i = 0; i < 90; i++) {
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex, color: 0xaec4dd, transparent: true, opacity: 0.06 + rand() * 0.08, depthWrite: false
            }));
            const w = 90 + rand() * 220;
            sprite.scale.set(w, w * (0.06 + rand() * 0.08), 1);
            const angle = rand() * Math.PI * 2, r = 30 + Math.sqrt(rand()) * 380;
            sprite.position.set(Math.cos(angle) * r, (rand() - 0.5) * 14 - 2, Math.sin(angle) * r);
            sprite.userData.phase = rand() * Math.PI * 2;
            puffGroup.add(sprite);
        }
        puffGroup.renderOrder = 1;
        scene.add(puffGroup);
    }
    function buildSky() {
        // Starfield dome
        const starCount = 2600;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const a = rand() * Math.PI * 2, e = Math.asin(rand() * 2 - 1);
            const r = 6000;
            positions[i * 3] = Math.cos(e) * Math.cos(a) * r;
            positions[i * 3 + 1] = Math.sin(e) * r;
            positions[i * 3 + 2] = Math.cos(e) * Math.sin(a) * r;
            const b = 0.55 + rand() * 0.45, warm = rand();
            colors[i * 3] = b * (0.85 + warm * 0.15); colors[i * 3 + 1] = b * 0.9; colors[i * 3 + 2] = b;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starField = new THREE.Points(starGeo, new THREE.PointsMaterial({
            size: 2.2, vertexColors: true, sizeAttenuation: false, transparent: true, opacity: 0.9,
            map: dotTexture(), depthWrite: false, blending: THREE.AdditiveBlending, fog: false
        }));
        starField.frustumCulled = false;
        scene.add(starField);
        skyPivot = new THREE.Group();
        scene.add(skyPivot);
        // The Sun — a sharp spark twenty times farther than Earth's, hanging
        // almost over the giant's pole: Uranus's axis points at the Sun, so
        // sunlight falls nearly perpendicular to the ring plane.
        const sunDir = new THREE.Vector3(0.32, 0.82, 0.34).normalize();
        const sun = new THREE.Mesh(new THREE.SphereGeometry(4.5, 24, 18), new THREE.MeshBasicMaterial({ color: 0xfff8ea, fog: false }));
        sun.position.copy(sunDir).multiplyScalar(4200);
        skyPivot.add(sun);
        const haloCanvas = document.createElement('canvas');
        haloCanvas.width = haloCanvas.height = 128;
        const haloContext = haloCanvas.getContext('2d');
        const gradient = haloContext.createRadialGradient(64, 64, 2, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255,248,235,0.95)');
        gradient.addColorStop(0.2, 'rgba(255,240,220,0.4)');
        gradient.addColorStop(1, 'rgba(255,230,200,0)');
        haloContext.fillStyle = gradient;
        haloContext.fillRect(0, 0, 128, 128);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, opacity: 0.8, depthWrite: false, fog: false }));
        halo.scale.set(150, 150, 1);
        halo.position.copy(sun.position);
        skyPivot.add(halo);
        const sunProxy = new THREE.Mesh(new THREE.SphereGeometry(190, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        sunProxy.position.copy(sun.position);
        sunProxy.userData.body = 'sun';
        skyPivot.add(sunProxy);
        skyBodies.push(sunProxy);
        sunMesh = sun;
        // Earth — a pale point near the Sun.
        const earth = new THREE.Mesh(new THREE.SphereGeometry(3, 16, 12), new THREE.MeshBasicMaterial({ color: 0xaac4e8, fog: false }));
        earth.position.copy(sunDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.06)).multiplyScalar(4200);
        earth.position.y += 140;
        skyPivot.add(earth);
        const earthProxy = new THREE.Mesh(new THREE.SphereGeometry(160, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        earthProxy.position.copy(earth.position);
        earthProxy.userData.body = 'earth';
        skyPivot.add(earthProxy);
        skyBodies.push(earthProxy);
        // Uranus itself — a featureless turquoise ball half-submerged in the
        // ring plane, its tipped equator on y = 0 so our sheet is the same system.
        // Real proportions: we fly inside the ring system, and the rings sit at
        // ~1.6-2.0 Uranus radii — so the planet must span ~60° of sky, a looming
        // wall of turquoise, not a neat ball viewed from outside.
        const uranusPos = new THREE.Vector3(UranusRings.RING_CX, 0, UranusRings.RING_CZ);
        const uranusRadius = 1450;
        uranusMesh = new THREE.Mesh(
            new THREE.SphereGeometry(uranusRadius, 64, 48),
            new THREE.MeshLambertMaterial({ color: 0x8fb8b4, fog: false })
        );
        uranusMesh.position.copy(uranusPos);
        scene.add(uranusMesh);
        const uranusProxy = new THREE.Mesh(new THREE.SphereGeometry(uranusRadius * 1.02, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        uranusProxy.position.copy(uranusPos);
        uranusProxy.userData.body = 'venus';
        scene.add(uranusProxy);
        skyBodies.push(uranusProxy);
        // Uranus's far rings — thin dark threads seen edge-on from inside the
        // plane: they project as a narrow band cutting straight across the globe.
        const innerR = uranusRadius * 1.6, outerR = uranusRadius * 2.2;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 180, 8);
        {
            const pos = ringGeo.attributes.position, uv = ringGeo.attributes.uv;
            const v3 = new THREE.Vector3();
            for (let i = 0; i < pos.count; i++) {
                v3.fromBufferAttribute(pos, i);
                uv.setXY(i, (v3.length() - innerR) / (outerR - innerR), 1);
            }
            uv.needsUpdate = true;
        }
        const ringCanvas = document.createElement('canvas');
        ringCanvas.width = 64; ringCanvas.height = 4;
        const ringCtx = ringCanvas.getContext('2d');
        for (let x = 0; x < 64; x++) {
            const t = x / 63;
            const bands = [0.16, 0.3, 0.44, 0.58, 0.78, 0.95];
            let a = 0;
            for (const b of bands) a = Math.max(a, Math.max(0, 1 - Math.abs(t - b) * 30));
            const shade = 74 + Math.round(a * 26);
            ringCtx.fillStyle = `rgba(${shade * 0.55},${shade * 0.68},${shade * 0.72},${a * 0.42})`;
            ringCtx.fillRect(x, 0, 1, 4);
        }
        const ringTex = new THREE.CanvasTexture(ringCanvas);
        const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false });
        const uranusRing = new THREE.Mesh(ringGeo, ringMat);
        uranusRing.rotation.x = Math.PI / 2;
        uranusRing.position.copy(uranusPos);
        uranusRing.renderOrder = 1;
        scene.add(uranusRing);
        return new Promise(resolve => {
            new THREE.TextureLoader().load('textures/2k_uranus.jpg', tex => {
                tex.encoding = THREE.sRGBEncoding;
                tex.wrapS = THREE.MirroredRepeatWrapping;
                uranusMesh.material.map = tex;
                uranusMesh.material.needsUpdate = true;
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
    // Voyager 2 flies alongside as a wingman — the only probe ever to visit.
    async function buildVoyager() {
        const model = await loadSceneModel('models/voyager.glb');
        if (!model) return;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (!size.y || !isFinite(size.y)) return;
        model.scale.setScalar(9 / Math.max(size.x, size.y, size.z));
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -center.y, -center.z);
        model.traverse(o => { if (o.isMesh) o.castShadow = false; });
        voyager = new THREE.Group();
        voyager.add(model);
        voyager.rotation.set(0.2, 0.5, 0.1);
        voyager.position.set(position.x + 26, 108, position.z - 30);
        scene.add(voyager);
    }
    // A small probe hull under the camera so the view reads as "inside a craft".
    function buildProbe() {
        const hull = new THREE.MeshStandardMaterial({ color: 0x8a7d55, roughness: 0.45, metalness: 0.7 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x1d1f21, roughness: 0.85, metalness: 0.25 });
        probe = new THREE.Group();
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 8, 24), hull);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(0, -1.02, -0.5);
        const dish = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), hull);
        dish.rotation.x = Math.PI;
        dish.position.set(0, -1.18, -0.55);
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6), dark);
        mast.position.set(0.25, -0.6, -0.45);
        mast.rotation.z = -0.4;
        probe.add(rim, dish, mast);
        probe.visible = false;
        scene.add(probe);
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
            velocities[i * 3] = Math.cos(angle) * spread;
            velocities[i * 3 + 1] = energy * (0.4 + rand() * 0.8) - energy * 0.5;
            velocities[i * 3 + 2] = Math.sin(angle) * spread;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ size: 0.07 + energy * 0.05, map: dustTexture(), color: 0xdce8f2, transparent: true, opacity: 0.6, depthWrite: false, sizeAttenuation: true });
        const points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        scene.add(points);
        dust.bursts.push({ points, velocities, age: 0, life: 1.1 + energy * 0.4 });
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
                attribute.setXYZ(j,
                    attribute.getX(j) + burst.velocities[j * 3] * dt,
                    attribute.getY(j) + burst.velocities[j * 3 + 1] * dt,
                    attribute.getZ(j) + burst.velocities[j * 3 + 2] * dt);
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
    function updateGravityButton() {
        $('gravity-button').textContent = t(gravity === UranusRings.GRAVITY ? 'gravityCompare' : 'gravityMercury');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== UranusRings.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === UranusRings.GRAVITY ? UranusRings.EARTH_GRAVITY : UranusRings.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === UranusRings.GRAVITY ? 'mercuryTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === UranusRings.GRAVITY ? 'gravityMercuryTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-uranus-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
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
        const wp = proxy.getWorldPosition(new THREE.Vector3());
        const dx = wp.x - position.x, dz = wp.z - position.z;
        const targetYaw = Math.atan2(-dx, -dz);
        const targetPitch = THREE.MathUtils.clamp(Math.atan2(wp.y - camera.position.y, Math.hypot(dx, dz)), -1.45, 1.2);
        const delta = THREE.MathUtils.euclideanModulo(targetYaw - yaw + Math.PI, Math.PI * 2) - Math.PI;
        cameraTween = { fromYaw: yaw, fromPitch: pitch, toYaw: yaw + delta, toPitch: targetPitch, t: 0, body };
    }
    function showMoonlet(body) {
        clearMovement();
        $('moonlet-title').textContent = t(`${body}Name`);
        $('moonlet-text').textContent = t(`${body}Text`);
        const focusNames = { sun: 'Sun', earth: 'Earth', venus: 'Uranus' };
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Uranus'}`;
        $('moonlet-dialog').showModal();
    }
    function updateCamera() {
        if (!walker) return;
        const headMotion = motionEnabled && !photoMode && exploring;
        const bob = headMotion ? Math.sin(walker.stride * 0.7) * 0.05 : 0;
        const roll = headMotion ? Math.sin(walker.stride * 0.4) * 0.004 : 0;
        camera.position.set(position.x, walker.y + bob, position.z);
        camera.rotation.set(pitch, yaw, roll, 'YXZ');
        if (probe) {
            probe.visible = exploring;
            probe.position.set(position.x, walker.y, position.z);
            probe.rotation.y = yaw;
        }
        $('movement-state').textContent = walker.thrusting ? t('jump') : t('grounded');
        $('heading').textContent = `${String(Math.round((-yaw * 180 / Math.PI + 360) % 360)).padStart(3, '0')}°`;
        const h = Math.round(walker.y);
        $('distance-value').textContent = `${h >= 0 ? '+' : '−'}${Math.abs(h)} m · ${Math.abs(walker.speed + walker.vy).toFixed(1)} m/s`;
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
        walker = UranusRings.createWalker(position);
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
            const sink = keys.has('KeyC') || keys.has('ControlLeft');
            UranusRings.updateWalker(walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: burn, down: sink, pull: gravity / UranusRings.GRAVITY }, dt);
            // The ring sheet gently tides the probe back toward the plane.
            walker.vy -= Math.sign(walker.y) * Math.min(Math.abs(walker.y) / 60, 1) * 0.35 * (gravity / UranusRings.GRAVITY) * dt;
            position.x = walker.x; position.z = walker.z;
            if (walker.thrusting && !thrustActive) { thrustActive = true; if (audio) audio.jump(); }
            if (!walker.thrusting) thrustActive = false;
            if ((walker.thrusting || sink) && Math.random() < 0.4) spawnDust(position.x + (rand() - 0.5), walker.y - 1.2, position.z + (rand() - 0.5), 2, 0.25);
            if (audio) audio.setDescent(walker.speed * 0.4 + Math.abs(walker.vy));
            // Ice pings when skimming a dense band
            pingTimer -= dt;
            if (pingTimer <= 0) {
                pingTimer = 0.4 + rand() * 2;
                const dens = UranusRings.ringDensity(position.x, position.z);
                if (audio && Math.abs(walker.y) < 14 && rand() < dens) audio.icePing();
            }
            if (Math.hypot(position.x, position.z) > UranusRings.DRIFT_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
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
            // Darkness when below the sheet — the ring shadow.
            const depth = THREE.MathUtils.clamp(-walker.y / 120, 0, 1);
            if (ambientLight) ambientLight.intensity = 0.9 * (1 - depth * 0.7);
            sunlight.intensity = 2.4 * (1 - depth * 0.75);
            scene.fog.density = 0.00045 + depth * 0.004;
            if (shaftPass && sunMesh) {
                const sp = sunMesh.getWorldPosition(new THREE.Vector3()).project(camera);
                const sx = sp.x * 0.5 + 0.5, sy = sp.y * 0.5 + 0.5;
                const edge = Math.min(1, Math.max(0, (sx + 0.35) / 0.3)) * Math.min(1, Math.max(0, (1.35 - sx) / 0.3))
                           * Math.min(1, Math.max(0, (sy + 0.35) / 0.3)) * Math.min(1, Math.max(0, (1.35 - sy) / 0.3));
                shaftPass.uniforms.uSunPos.value.set(sx, sy);
                shaftPass.uniforms.uIntensity.value = sp.z < 1 ? 0.3 * (1 - depth * 0.8) * edge : 0;
            }
            // Recycle ice chunks and specks around the probe — the field is endless.
            for (const field of iceField) {
                if (field.specks) {
                    const arr = field.specks.geometry.attributes.position.array;
                    for (let i = 0; i < field.count; i++) {
                        arr[i * 3] += 0.5 * dt; // slow differential drift along the ring
                        if (arr[i * 3] - position.x > 350) arr[i * 3] -= 700;
                        if (arr[i * 3] - position.x < -350) arr[i * 3] += 700;
                        if (arr[i * 3 + 2] - position.z > 350) arr[i * 3 + 2] -= 700;
                        if (arr[i * 3 + 2] - position.z < -350) arr[i * 3 + 2] += 700;
                    }
                    field.specks.geometry.attributes.position.needsUpdate = true;
                    continue;
                }
                const { mesh, items, wrap } = field;
                const tr = new THREE.Object3D();
                let dirty = false;
                for (let i = 0; i < items.length; i++) {
                    const it = items[i];
                    it.spin += it.spinRate * dt;
                    if (it.x - position.x > wrap) it.x -= wrap * 2; else if (it.x - position.x < -wrap) it.x += wrap * 2;
                    if (it.z - position.z > wrap) it.z -= wrap * 2; else if (it.z - position.z < -wrap) it.z += wrap * 2;
                    tr.position.set(it.x, it.y, it.z);
                    tr.scale.setScalar(it.size);
                    tr.rotation.set(it.tumble, it.spin, it.tumble * 0.7);
                    tr.updateMatrix();
                    mesh.setMatrixAt(i, tr.matrix);
                    dirty = true;
                }
                if (dirty) mesh.instanceMatrix.needsUpdate = true;
            }
            // voyager holds formation off the port bow.
            if (voyager) {
                const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
                const rx = Math.cos(yaw), rz = -Math.sin(yaw);
                const tx = position.x + fx * 34 + rx * -14;
                const tz = position.z + fz * 34 + rz * -14;
                const ty = walker.y - 7 + Math.sin(now * 0.0004) * 1.5;
                voyager.position.x += (tx - voyager.position.x) * Math.min(1, dt * 0.8);
                voyager.position.y += (ty - voyager.position.y) * Math.min(1, dt * 0.8);
                voyager.position.z += (tz - voyager.position.z) * Math.min(1, dt * 0.8);
                voyager.rotation.y = yaw + 0.5;
                voyager.rotation.z = 0.08 + Math.sin(now * 0.0003) * 0.03;
            }
            if (puffGroup) {
                for (const puff of puffGroup.children) {
                    puff.position.x += Math.sin(now * 0.00008 + puff.userData.phase) * dt * 1.4;
                }
            }
            if (moonlet) { moonlet.rotation.y += dt * 0.12; moonlet.rotation.x += dt * 0.03; }
            if (tiltMarker && tiltMarker.userData.tipped) tiltMarker.userData.tipped.rotation.y += dt * 0.25;
            if (starField) starField.rotation.y += dt * 0.0015;
            if (uranusMesh) uranusMesh.rotation.y += dt * 0.004;
            if (cinePass) cinePass.material.uniforms.uTime.value = now * 0.001;
            if (featuredRock) { featuredRock.rotation.y += dt * 0.5; featuredRock.rotation.x += dt * 0.18; }
        }
        if (Math.hypot(sunlight.target.position.x - position.x, sunlight.target.position.z - position.z) > 20) {
            sunlight.target.position.set(position.x, 0, position.z);
            sunlight.position.set(position.x + 120, 380, position.z + 140);
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
        const movementCodes = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'KeyC', 'ControlLeft'];
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
            if (!window.THREE || !window.UranusRings) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x02060a);
            scene.fog = new THREE.FogExp2(0x071016, 0.00045);
            camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.08, 9000);
            ambientLight = new THREE.AmbientLight(0x86acb4, 0.9);
            scene.add(ambientLight);
            scene.add(new THREE.HemisphereLight(0x8fbcc0, 0x0a1014, 0.5));
            sunlight = new THREE.DirectionalLight(0xf2faf4, 2.2);
            sunlight.position.set(120, 380, 140);
            sunlight.castShadow = true;
            sunlight.shadow.mapSize.set(profile.shadows, profile.shadows);
            Object.assign(sunlight.shadow.camera, { left: -160, right: 160, top: 160, bottom: -160, near: 1, far: 900 });
            sunlight.shadow.bias = -0.00018;
            sunlight.shadow.normalBias = 0.08;
            sunlight.shadow.autoUpdate = false;
            sunlight.shadow.needsUpdate = true;
            scene.add(sunlight, sunlight.target);
            if (THREE.EffectComposer && quality !== 'low') {
                composer = new THREE.EffectComposer(renderer);
                composer.addPass(new THREE.RenderPass(scene, camera));
                composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.45, 0.5, 0.8));
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
                            base.rgb += shaft / max(tot, 0.001) * uIntensity * vec3(1.0, 0.92, 0.78);
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
            buildRingSheet();
            buildIceField();
            buildSpecks();
            buildPuffs();
            buildMoonlet();
            buildTiltMarker();
            buildProbe();
            await buildSky();
            buildVoyager();
            walker = UranusRings.createWalker(position);
            walker.y = stations[0].y !== undefined ? stations[0].y : 120;
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface: null, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.UranusExpedition, terrain: UranusRings, strings: discoveryStrings });
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
                link.href = url; link.download = `mzu-uranus-rings-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Uranus&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.UranusAudio ? window.UranusAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-uranus-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
