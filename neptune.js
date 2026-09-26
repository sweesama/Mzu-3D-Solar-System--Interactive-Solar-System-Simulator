(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.NeptuneExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
        const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'NEPTUNE', surfaceMode: 'STORM-LAYER FLIGHT',
            chapter: 'EXPEDITION 008 / THE LAST GIANT', title: 'Ride Neptune’s\nfastest winds.', intro: 'Cruise Neptune’s storm layer — white methane cirrus streaming below, the Great Dark Spot turning on the horizon, Voyager 2 flying formation.', begin: 'Begin the flight', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Voyager 2 science.', gravity: 'GRAVITY', atmosphere: 'ENVIRONMENT', vacuum: 'Atmosphere · methane haze', temperature: 'STORM TEMP', tempValue: 'about −200°C', distance: 'STORM DECK',
            walkingHint: 'W A S D to drift · drag to look · Space to rise · C to sink · G gravity · M sound', touchHint: 'Arrows to drift · drag to look · Burn to rise', station0: 'Storm vista', station1: 'The storm wall', station2: 'Cirrus field',
            astronaut: 'PROBE', jump: 'Burn', grounded: 'Cruising', airborne: 'Cruising', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable camera drift for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SURVEYED STORM SECTION',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Setting course for the storm layer…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'A deep-blue sky with a storm on the horizon.',
            guideIntro: 'This is a small, freely explorable stretch of Neptune’s upper storm layer, not a whole-atmosphere simulation. The five observation points are different views of the same flight; two of them face the Great Dark Spot.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityMercury: 'Back to Neptune gravity · G', gravityHint: 'Same probe, different pull. Neptune’s gravity is 11.15 m/s² — press G and the deck’s gentle tug firms up slightly under Earth’s pull.', soundOn: 'Probe sounds: On', soundOff: 'Probe sounds: Off', soundHint: 'A cabin hum under a restless wind howl, faint radio hiss, and grains ticking off the hull. M toggles.', gravityMercuryTag: 'Neptune gravity — 11.15 m/s².', gravityEarth: 'Earth gravity — 9.8 m/s². A touch softer than the deep blue giant.', mercuryTag: 'NEPTUNE', earthTag: 'EARTH',
            controlsText: 'You are a probe cruising Neptune’s storm layer — there is no ground and no falling. The probe cruises forward on its own; W A S D or the arrow keys drift you sideways and speed you up, Shift is faster still. Space rises, C sinks toward the cloud deck. Drag to look. Touchscreens have direction and Burn buttons. G compares Earth gravity; M toggles sound. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'Neptune has the fastest winds in the Solar System — up to about 2,100 km/h, supersonic in this thin cold air. The Great Dark Spot was a storm wider than Earth when Voyager 2 flew past in 1989. The deck, winds and vortex here are artistic reconstructions.',
            soundText: 'The flight is far gentler than real Neptunian weather — winds here can top 2,000 km/h. Press G to compare Earth gravity; Neptune pulls a little harder than home. Listen for the wind howl rising inside the cirrus lanes.',
            assetText: 'Voyager 2 is a real NASA 3D model — the only probe ever to visit Neptune, in August 1989. The storm deck, particle field, and starfield are generated locally.',
            skyEyebrow: 'IN NEPTUNE’S SKY', sunName: 'The Sun', earthName: 'Earth', tritonName: 'Triton', stormName: 'The Great Dark Spot',
            sunText: 'From Neptune the Sun is thirty times farther than from Earth — a needle-bright spark giving barely 0.1% of Earth’s daylight, yet still enough to drive the wildest winds known. Artistic rendering, not an accurate ephemeris.',
            earthText: 'From Neptune, Earth never strays more than a degree or so from the Sun — a pale point lost in the glare. Its placement here is artistic.',
            tritonText: 'Triton — Neptune’s captured moon, orbiting backwards, venting nitrogen geysers through pink ice. Voyager 2 skimmed it on the same flyby. Artistic placement and scale.',
            stormText: 'The Great Dark Spot — an anticyclonic storm wider than Earth, circling Neptune at supersonic rim winds. Voyager 2 photographed it in 1989; it had vanished by 1994. Artistic scale.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Click the small Sun, Triton, or the distant storm to learn about it — you can then visit it in the Solar System view.',
            featuresTitle: 'What you are seeing', features: [
                ['A needle-bright Sun', 'From thirty times Earth’s distance the Sun is a sharp spark — yet it still drives the fastest winds anywhere.'],
                ['Methane cirrus', 'The pale streaks below are high-altitude methane-ice cirrus, stretched into lanes by screaming winds.'],
                ['The Great Dark Spot', 'On the horizon: a storm wider than Earth, its rim winds circling at supersonic speed.'],
                ['A racing cloud', 'The white lump is a Scooter-style cloud — Voyager 2 watched such clouds outrun the dark storm.'],
                ['The wind shear line', 'The boundary where winds flip direction — Neptune’s bands run opposite ways, stacked like gears.'],
                ['Voyager on the wing', 'NASA’s real Voyager model flies alongside — the only spacecraft ever to see this view, on 25 August 1989.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this flight lane. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['The storm vista', 'From altitude the storm layer resolves — blue-white cirrus lanes streaming below, the dark vortex waiting on the horizon.', 'ARRIVAL', 'Storm vista'],
                ['A cirrus wisp', 'This drifting crystal is methane ice — Neptune’s thin cold air grows its clouds out of the same gas that tints the planet blue. Rotate it in the specimen viewer.', 'AEROSOL', 'Methane cirrus'],
                ['The storm wall', 'Face the Great Dark Spot — the deck here bends toward a storm wider than Earth, rim winds supersonic.', 'VORTEX', 'Storm wall'],
                ['The wind shear line', 'A pale racing cloud marks the shear line — the boundary where Neptune’s winds reverse direction like meshing gears.', 'WIND', 'Shear line'],
                ['The storm spinner', 'A marker disc demonstrates the dark vortex — an anticyclone spinning for years, then gone when the wind pattern shifted.', 'ORIENTATION', 'Vortex spin']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '海王星', surfaceMode: '风暴层飞行', chapter: '探索 008 / 最后的巨行星', title: '驾驭海王星最快的风。',
            intro: '巡航海王星的风暴层——白色甲烷卷云在脚下拉成细带，大黑斑在天际缓缓转动，旅行者 2 号与你编队同行。', begin: '开始飞行', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受旅行者 2 号科学成果启发的虚构地点。',
            gravity: '海王星引力', atmosphere: '所处环境', vacuum: '大气层 · 甲烷薄雾', temperature: '风暴层温度', tempValue: '约 −200°C', distance: '云层高度', walkingHint: 'W A S D 漂移 · 拖动转头 · 空格上升 · C 下沉 · G 引力 · M 声音', touchHint: '方向按钮漂移 · 拖动画面转头 · 点击推进上升',
            astronaut: '探测器视角', jump: '推进', grounded: '巡航中', airborne: '巡航中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭镜头漂移可获得更平稳的视角。',
            station0: '风暴远眺', station1: '风暴之墙', station2: '卷云场', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实风暴测绘', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在设定风暴层航线…', fieldGuide: '海王星探索指南', guideTitle: '深蓝色的天空，天际有一场风暴。',
            guideIntro: '这是一段可以自由漫游的海王星高层风暴切片，而非完整的大气模拟。五个观察点位于同一段航程的不同位置；其中两处正对着大黑斑。', controlsTitle: '如何移动',
            gravityCompare: '对比地球引力 · G', gravityMercury: '恢复海王星引力 · G', gravityHint: '同一台探测器，不同的引力。海王星引力 11.15 m/s²——按 G 对比地球，云层的牵引感会稍微变强。', soundOn: '探测器声音：开', soundOff: '探测器声音：关', soundHint: '舱内低鸣之上是不安的呼啸风声、微弱的射电嘶声，以及颗粒敲击舱体的轻响。M 切换。', gravityMercuryTag: '海王星引力 — 11.15 m/s²。', gravityEarth: '地球引力 — 9.8 m/s²。比这颗深蓝巨行星稍温柔一点。', mercuryTag: '海王星', earthTag: '地球',
            controlsText: '你是一台巡航在海王星风暴层中的探测器——没有地面，也不会坠落。探测器会自行向前巡航；W A S D 或方向键控制侧向漂移和加减速，Shift 更快。空格上升，C 下沉向云层。拖动画面观察。触屏有方向按钮和推进键。G 对比地球引力，M 开关声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '海王星拥有太阳系最快的风——最高约每小时 2100 公里，在这稀薄冰冷的空气里已经超音速。旅行者 2 号 1989 年飞掠时，大黑斑是一场比地球还宽的风暴。这里的云层、风和涡旋都是艺术重建。',
            soundText: '飞行比真实的海王星天气平缓得多——这里的风速可以超过每小时 2000 公里。按 G 对比地球引力；海王星的引力比地球稍大一点。进入卷云带时，留意风声渐强。',
            assetText: '旅行者 2 号是 NASA 的真实 3D 模型——1989 年 8 月唯一到访过海王星的探测器。风暴云层、粒子场和星空由浏览器本地生成。',
            skyEyebrow: '海王星天空中', sunName: '太阳', earthName: '地球', tritonName: '海卫一', stormName: '大黑斑',
            sunText: '从海王星看，太阳比地球上看远三十倍——一枚刺眼的细小光点，光照只有地球白天的约千分之一，却依然驱动着全太阳系最猛烈的风。艺术呈现，并非精确星历。',
            earthText: '从海王星看，地球永远不会离开太阳一两度之外——一个湮没在眩光中的淡色小点。位置经过艺术处理。',
            tritonText: '海卫一——海王星俘获的卫星，逆向公转，粉色冰面上喷发着氮气间歇泉。旅行者 2 号在同一次飞掠中擦过它。位置和比例经过艺术处理。',
            stormText: '大黑斑——一个比地球还宽的反气旋风暴，边缘风速超音速。旅行者 2 号 1989 年拍到它；到 1994 年它已经消散。比例经过艺术处理。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '点击天空中的小太阳、海卫一或远处的风暴可以了解它，然后还能跳到太阳系视角。',
            featuresTitle: '你眼前的景观', features: [
                ['刺眼的小太阳', '隔着三十倍的距离，太阳只是一枚尖锐的光点——却依然驱动着全太阳系最快的风。'],
                ['甲烷卷云', '脚下拖长的浅色条纹是高空甲烷冰卷云，被呼啸的风拉成一道道细带。'],
                ['大黑斑', '天际那边：一场比地球还宽的风暴，边缘风速超音速。'],
                ['飞毛腿云', '那团白云是"飞毛腿"式的快云——旅行者 2 号曾看到这类云跑得比暗斑还快。'],
                ['风切变线', '风向翻转的边界——海王星的云带像齿轮一样，一层正转一层反转。'],
                ['同行的旅行者号', 'NASA 真实的旅行者号模型与你编队——1989 年 8 月 25 日，唯一见过这番景象的探测器。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次飞行航道的边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['风暴远眺', '从高处看，风暴层终于显形——蓝白色卷云在下方拉成条带，暗色涡旋等在天际。', '抵达方式', '风暴层远景'],
                ['一缕卷云', '这粒漂移的晶体是甲烷冰——海王星稀薄冰冷的空气用让行星变蓝的同一种气体造出了云。在查看器中旋转它。', '气溶胶', '甲烷卷云'],
                ['风暴之墙', '直面大黑斑——这里的云层向一场比地球还宽的风暴弯去，边缘风速超音速。', '涡旋', '风暴之墙'],
                ['风切变线', '一朵白色快云标记着切变线——海王星风向在此翻转的边界，像啮合的齿轮。', '风', '切变线'],
                ['风暴转盘', '一个标记转盘演示暗色涡旋——反气旋一转数年，风型一变又悄然消散。', '姿态', '涡旋自转']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR FLIGHT ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed storm section or an identified aerosol.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Match the deck layer before recording.', approach: 'Drift closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Drift to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures in the atmosphere. H hides or restores the route card.',
            teasers: ['Take in the cirrus lanes from above — pale streaks, the deep blue, and the storm on the horizon.', 'A methane cirrus wisp drifts in the deck lane — approach it and turn it in the specimen viewer.', 'Cruise the lane that bends toward the Great Dark Spot.', 'Ride the lanes north-east to where a racing white cloud marks the shear line.', 'Drift east to find a small spinning disc — the storm vortex in miniature.'],
            details: ['Neptune’s cirrus are methane ice — the same gas that absorbs red light and paints the planet blue freezes into thin white streaks at this altitude. Voyager 2 photographed them as delicate lines over the blue. The deck layout here is artistic, informed by real imagery.', 'Methane cirrus cast shadows on the deeper deck in Voyager 2’s photographs — bright threads kilometres above the blue. This wisp is a stand-in crystal; the real clouds are kilometre-long veils racing at hundreds of metres per second.', 'The Great Dark Spot was an anticyclone wider than Earth — rim winds of about 2,400 km/h made it the fastest storm ever measured. When Hubble looked again in 1994 it was gone; dark spots form and dissolve as Neptune’s winds shift.', 'Neptune’s wind bands run like meshed gears — equatorial winds blow backwards against the planet’s spin while higher latitudes race forwards. The pale cloud marks the shear line between them, a real feature Voyager 2 called Scooter.', 'An anticyclone in miniature — the dark spot spun once about every 18 days. This marker disc turns slowly to show the vortex spin; the real storm was wider than our entire planet.']
        },
        zh: {
            fieldRoute: '你的飞行路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转碎片', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实风暴测绘，也不是已鉴定的气溶胶样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点漂移', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请对齐这一云层再记录发现。', approach: '请漂近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，漂近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非大气中的真实结构。H 可隐藏或恢复路线卡片。',
            teasers: ['从高处俯瞰卷云条带——浅色细线、深蓝大气，以及天际的风暴。', '一缕甲烷卷云漂在云层航道上——靠近它，在查看器中转动观察。', '驶向那条弯向大黑斑的云道。', '沿航道向东北，找到标记切变线的白色快云。', '向东漂移，找到演示风暴涡旋的小转盘。'],
            details: ['海王星的卷云是甲烷冰——把行星染蓝的同一种气体（吸收红光）在这个高度冻成细白的丝。旅行者 2 号的照片里，它们是蓝色天幕上纤细的亮线。这里的云层布局是艺术再现，参考了真实影像。', '在旅行者 2 号的照片里，甲烷卷云会在更深处的云层上投下影子——悬浮在蓝色之上几公里高的亮线。这缕晶体是替代标本；真实的云是时速数百公里飞驰的数公里长云纱。', '大黑斑是一个比地球还宽的反气旋——约每小时 2400 公里的边缘风速让它成为测过最快的风暴。1994 年哈勃再看时它已经消失；海王星的暗斑随风型改变而生成又消散。', '海王星的风带像啮合的齿轮——赤道风逆着自转往回吹，高纬度风则向前狂奔。那朵白云标着两层之间的切变线，是旅行者 2 号命名为"飞毛腿"的真实结构。', '微缩的反气旋——真正的暗斑大约每 18 天自转一圈。这个标记转盘缓缓旋转以展示涡旋；真实的风暴比我们整颗地球还宽。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, sunlight, walker, probe, voyager, animationId = null;
    let motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = 0.55, pitch = -0.04, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = NeptuneStorm.GRAVITY, audio = null, soundEnabled = true;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set();
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null;
    const skyBodies = [], skyRay = new THREE.Raycaster(), skyPointer = new THREE.Vector2();
    let skyPivot = null, neptuneMesh = null, starField = null, ambientLight = null, thrustActive = false, iceField = [], deckSheet = null, puffGroup = null, composer = null, fxaaPass = null, cinePass = null, sunMesh = null, shaftPass = null, moonlet = null, tiltMarker = null, stormVortex = null, pingTimer = 2;
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
    const rand = NeptuneStorm.random(4451);
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
        $('gravity-mode').textContent = t(gravity === NeptuneStorm.GRAVITY ? 'mercuryTag' : 'earthTag');
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
        if (error) console.error('Neptune expedition:', error);
    }
    // Storm-deck texture: cirrus lanes spiralling around the dark-spot vortex,
    // streaked tangentially so the deck reads as wind-sheared cloud.
    function makeDeckTexture() {
        const size = profile.texture;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const image = ctx.createImageData(size, size);
        const px = image.data;
        const zSpan = 6000; // texture v axis covers the full 6 km sheet
        const cx = NeptuneStorm.VORTEX_X, cz = NeptuneStorm.VORTEX_Z;
        for (let y = 0; y < size; y++) {
            const wz = (y / size - 0.5) * zSpan;
            for (let x = 0; x < size; x++) {
                const wx = (x / size - 0.5) * zSpan;
                const dens = NeptuneStorm.stormDensity(wx, wz);
                // cirrus streaks: banded noise stretched along the wind direction
                const ang = Math.atan2(wz - cz, wx - cx);
                const rad = Math.hypot(wx - cx, wz - cz);
                const ripple = NeptuneStorm.noise(ang * 60 + rad * 0.002, rad * 0.12) * 0.5 + NeptuneStorm.noise(ang * 24, rad * 0.6) * 0.5;
                const flecks = NeptuneStorm.noise(ang * 160, rad * 0.25) > 0.82 ? 0.3 : 0;
                let a = dens * (0.5 + ripple * 0.9 + flecks) + 0.1;
                a = Math.max(0, Math.min(1, a));
                const i = (y * size + x) * 4;
                const shade = NeptuneStorm.noise(wx * 0.02, wz * 0.02);
                // deep navy deck with pale blue-white cirrus where dense
                px[i] = 36 + a * 160 - shade * 12;
                px[i + 1] = 54 + a * 170 - shade * 10;
                px[i + 2] = 96 + a * 155 - shade * 8;
                px[i + 3] = Math.round((0.55 + a * 0.45) * 250);
            }
        }
        ctx.putImageData(image, 0, 0);
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        return texture;
    }
    function buildDeckSheet() {
        const texture = makeDeckTexture();
        const group = new THREE.Group();
        // Two offset sheets give the cloud deck visible thickness at grazing angles.
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
        deckSheet = group;
        scene.add(group);
    }
    function iceGeometry(seed) {
        const geometry = new THREE.IcosahedronGeometry(1, 1);
        const p = geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const f = 0.75 + NeptuneStorm.noise(x * 2.4 + seed, y * 2.4 + z * 1.7) * 0.5;
            p.setXYZ(i, x * f, y * f * 0.85, z * f);
        }
        geometry.computeVertexNormals();
        return geometry;
    }
    // Methane-ice crystals drifting in the wind lanes; as the probe cruises,
    // chunks that fall behind are recycled ahead so the field feels endless.
    function buildIceField() {
        const material = new THREE.MeshStandardMaterial({
            color: 0x9db8d4, roughness: 0.6, metalness: 0.1, flatShading: true,
            emissive: 0x16283c, emissiveIntensity: 0.6
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
                const dens = NeptuneStorm.stormDensity(x, z);
                // sparser placement outside the cirrus lanes
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
        // The specimen lump for the discovery viewer — a methane cirrus crystal.
        featuredRock = new THREE.Mesh(iceGeometry(77), material.clone());
        featuredRock.scale.setScalar(1.9);
        featuredRock.position.set(60, 9, -120);
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
    // A racing cloud — Voyager 2 called these white methane clouds "Scooters",
    // they outrun the dark storm. Sits on the shear line discovery.
    function buildMoonlet() {
        const geo = new THREE.IcosahedronGeometry(1, 2);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const f = 0.72 + NeptuneStorm.noise(x * 1.9 + 5, y * 1.9 + z * 1.4) * 0.56;
            p.setXYZ(i, x * f, y * f * 0.82, z * f);
        }
        geo.computeVertexNormals();
        moonlet = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
            color: 0xd8e6f4, roughness: 0.9, metalness: 0.0, flatShading: true,
            emissive: 0x2a3c50, emissiveIntensity: 0.5
        }));
        moonlet.scale.setScalar(7);
        moonlet.position.set(-160, 10, 240);
        moonlet.rotation.set(0.4, 0.9, 0.2);
        moonlet.castShadow = true;
        scene.add(moonlet);
    }
    // The storm spinner — a small dark disc turning on a mast, demonstrating
    // the Great Dark Spot's anticyclonic spin in miniature.
    function buildTiltMarker() {
        tiltMarker = new THREE.Group();
        const disc = new THREE.Mesh(
            new THREE.CylinderGeometry(3.6, 3.6, 0.5, 48),
            new THREE.MeshStandardMaterial({ color: 0x101c30, roughness: 0.8, metalness: 0.05, emissive: 0x0a1a30, emissiveIntensity: 0.7 })
        );
        const rim = new THREE.Mesh(
            new THREE.TorusGeometry(3.7, 0.18, 10, 48),
            new THREE.MeshStandardMaterial({ color: 0x9fc4e8, roughness: 0.5, emissive: 0x1c3448, emissiveIntensity: 0.5 })
        );
        rim.rotation.x = Math.PI / 2;
        const tipped = new THREE.Group();
        tipped.add(disc, rim);
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
    // Sparse methane haze wisps drifting near the deck — depth, not weather.
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
        // The Sun — a needle-bright spark thirty times farther than Earth's,
        // low over the deep-blue haze: Neptune daylight is ~0.1% of Earth's.
        const sunDir = new THREE.Vector3(0.34, 0.42, 0.62).normalize();
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
        // The Great Dark Spot — a huge slowly-turning anticyclone painted on the
        // cloud deck itself, centred on the same point the wind lanes spiral
        // around. From inside the storm layer it reads as a dark vastness ahead.
        const vortexPos = new THREE.Vector3(NeptuneStorm.VORTEX_X, 2, NeptuneStorm.VORTEX_Z);
        {
            const vc = document.createElement('canvas');
            vc.width = vc.height = 512;
            const vctx = vc.getContext('2d');
            const vgrad = vctx.createRadialGradient(256, 256, 16, 256, 256, 256);
            vgrad.addColorStop(0, 'rgba(5,10,20,0.98)');
            vgrad.addColorStop(0.5, 'rgba(10,22,38,0.9)');
            vgrad.addColorStop(0.8, 'rgba(24,44,74,0.5)');
            vgrad.addColorStop(1, 'rgba(24,44,74,0)');
            vctx.fillStyle = vgrad;
            vctx.fillRect(0, 0, 512, 512);
            vctx.strokeStyle = 'rgba(150,185,220,0.32)';
            for (let i = 0; i < 30; i++) {
                const r0 = 90 + NeptuneStorm.random() * 150;
                const a0 = NeptuneStorm.random() * Math.PI * 2;
                vctx.beginPath();
                vctx.arc(256, 256, r0, a0, a0 + 0.6 + NeptuneStorm.random() * 1.0);
                vctx.lineWidth = 1.5 + NeptuneStorm.random() * 3.5;
                vctx.stroke();
            }
            const vortexTex = new THREE.CanvasTexture(vc);
            vortexTex.encoding = THREE.sRGBEncoding;
            stormVortex = new THREE.Mesh(
                new THREE.CircleGeometry(NeptuneStorm.VORTEX_R, 72),
                new THREE.MeshBasicMaterial({ map: vortexTex, transparent: true, depthWrite: false, fog: false })
            );
            stormVortex.rotation.x = -Math.PI / 2;
            stormVortex.position.copy(vortexPos);
            stormVortex.renderOrder = 1;
            scene.add(stormVortex);
        }
        const stormProxy = new THREE.Mesh(new THREE.SphereGeometry(NeptuneStorm.VORTEX_R, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        stormProxy.position.copy(vortexPos);
        stormProxy.userData.body = 'storm';
        scene.add(stormProxy);
        skyBodies.push(stormProxy);
        // Triton — the captured moon, a pale disc hanging in the deep-blue haze.
        neptuneMesh = new THREE.Mesh(
            new THREE.SphereGeometry(60, 32, 24),
            new THREE.MeshLambertMaterial({ color: 0xd9c9c4, fog: false, transparent: true })
        );
        neptuneMesh.position.set(-2400, 1800, -3200);
        scene.add(neptuneMesh);
        const tritonProxy = new THREE.Mesh(new THREE.SphereGeometry(150, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        tritonProxy.position.copy(neptuneMesh.position);
        tritonProxy.userData.body = 'triton';
        scene.add(tritonProxy);
        skyBodies.push(tritonProxy);
        return Promise.resolve();
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
        $('gravity-button').textContent = t(gravity === NeptuneStorm.GRAVITY ? 'gravityCompare' : 'gravityMercury');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== NeptuneStorm.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === NeptuneStorm.GRAVITY ? NeptuneStorm.EARTH_GRAVITY : NeptuneStorm.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === NeptuneStorm.GRAVITY ? 'mercuryTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === NeptuneStorm.GRAVITY ? 'gravityMercuryTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-neptune-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
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
        const focusNames = { sun: 'Sun', earth: 'Earth', triton: 'Neptune', storm: 'Neptune' };
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Neptune'}`;
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
        walker = NeptuneStorm.createWalker(position);
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
            NeptuneStorm.updateWalker(walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: burn, down: sink, pull: gravity / NeptuneStorm.GRAVITY }, dt);
            // Wind shear gently tides the probe back toward the deck lane.
            walker.vy -= Math.sign(walker.y) * Math.min(Math.abs(walker.y) / 60, 1) * 0.35 * (gravity / NeptuneStorm.GRAVITY) * dt;
            position.x = walker.x; position.z = walker.z;
            if (walker.thrusting && !thrustActive) { thrustActive = true; if (audio) audio.jump(); }
            if (!walker.thrusting) thrustActive = false;
            if ((walker.thrusting || sink) && Math.random() < 0.4) spawnDust(position.x + (rand() - 0.5), walker.y - 1.2, position.z + (rand() - 0.5), 2, 0.25);
            if (audio) audio.setDescent(walker.speed * 0.4 + Math.abs(walker.vy));
            // Ice-crystal pings when skimming a dense cirrus lane
            pingTimer -= dt;
            if (pingTimer <= 0) {
                pingTimer = 0.4 + rand() * 2;
                const dens = NeptuneStorm.stormDensity(position.x, position.z);
                if (audio && Math.abs(walker.y) < 14 && rand() < dens) audio.icePing();
            }
            if (Math.hypot(position.x, position.z) > NeptuneStorm.DRIFT_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
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
            // Darkness when below the deck — sinking into the deep haze.
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
            if (neptuneMesh) neptuneMesh.rotation.y += dt * 0.004;
            if (stormVortex) stormVortex.rotation.z -= dt * 0.06;
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
            if (!window.THREE || !window.NeptuneStorm) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x030a18);
            scene.fog = new THREE.FogExp2(0x0a1c34, 0.00055);
            camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.08, 9000);
            ambientLight = new THREE.AmbientLight(0x5a7fc0, 1.0);
            scene.add(ambientLight);
            scene.add(new THREE.HemisphereLight(0x6f9fd8, 0x0a1220, 0.6));
            sunlight = new THREE.DirectionalLight(0xeaf0ff, 2.0);
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
            buildDeckSheet();
            buildIceField();
            buildSpecks();
            buildPuffs();
            buildMoonlet();
            buildTiltMarker();
            buildProbe();
            await buildSky();
            buildVoyager();
            walker = NeptuneStorm.createWalker(position);
            walker.y = stations[0].y !== undefined ? stations[0].y : 120;
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface: null, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.NeptuneExpedition, terrain: NeptuneStorm, strings: discoveryStrings });
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
                link.href = url; link.download = `mzu-neptune-rings-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Neptune&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.NeptuneAudio ? window.NeptuneAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-neptune-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
