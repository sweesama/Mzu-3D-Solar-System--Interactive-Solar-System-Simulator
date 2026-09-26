(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.MercuryExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
    const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'MERCURY', surfaceMode: 'SURFACE EXPLORATION',
            chapter: 'EXPEDITION 004 / THE TWILIGHT ZONE', title: 'Stand on\nMercury.', intro: 'Walk an imagined cratered plain near Mercury’s twilight band — a black sky at noon, a Sun three times wider than from Earth, and the oldest-looking ground in the Solar System.', begin: 'Step onto Mercury', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Mercury science.', gravity: 'GRAVITY', atmosphere: 'ATMOSPHERE', vacuum: 'Airless', temperature: 'SURFACE TEMP', tempValue: '430°C day / −180°C night', distance: 'FROM ARRIVAL',
            walkingHint: 'W A S D to walk · drag to look · Space to jump · G gravity · M sound', touchHint: 'Arrows to walk · drag to look · tap Jump to leap', station0: 'Arrival plain', station1: 'Crater approach', station2: 'Hollows rim',
            astronaut: 'ASTRONAUT', jump: 'Jump', grounded: 'On the surface', airborne: 'Airborne', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable head motion for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SCANNED LANDING SITE',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Preparing the Mercurian landscape…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'Where the Sun looms.',
            guideIntro: 'This is a small, freely explorable cratered plain, not a whole-planet simulation. The five observation points are different views of the same place; two of them can only be reached on foot.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityMercury: 'Back to Mercury gravity · G', gravityHint: 'Same takeoff push, different fall. Mercury gravity is 3.7 m/s² — almost exactly the same as Mars, on a much smaller world.', soundOn: 'Suit sounds: On', soundOff: 'Suit sounds: Off', soundHint: 'Inside the suit: fan hum and conducted footfalls. Outside, total silence — Mercury has no air to carry sound. M toggles.', gravityMercuryTag: 'Mercury gravity — 3.7 m/s², Mars-like.', gravityEarth: 'Earth gravity — 9.8 m/s². Same push, far less height.', mercuryTag: 'MERCURY', earthTag: 'EARTH',
            controlsText: 'You are exploring on foot as an astronaut. Walk with W A S D or the arrow keys; Shift gives a brisker pace. Press Space to jump, then wait to land before jumping again. Momentum carries you forward in the air. Drag to look, including down at your boots. Touchscreens have direction and Jump buttons. G compares Earth gravity; M toggles suit sounds. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'Mercury is airless and heavily cratered like the Moon, but darker and browner. Its signature landmarks are real: lobate scarps from a shrinking planet, bright hollows found nowhere else, and a Sun that looks three times wider. This site sits near the day-night band, where sunlight arrives at a low angle; terrain and observation points are procedural art, not survey data.',
            soundText: "Mercury has essentially no atmosphere — the surface is silent, so what you hear comes from inside the suit: a quiet life-support hum, footfalls conducted through the body, and a radio chime for each discovery. Jumps use Mercury's surface gravity of 3.7 m/s²; press G to feel Earth's 9.8 m/s² with the same takeoff push. Pace, takeoff strength, and camera motion are comfort settings, not a full spacesuit simulation.",
            assetText: 'No external imagery on this page — terrain, rock textures, and the sky are generated locally in your browser.',
            skyEyebrow: 'IN THE MERCURY SKY', sunName: 'The Sun', earthName: 'Earth', venusName: 'Venus',
            sunText: 'From Mercury the Sun looks about three times wider than from Earth — a fierce white disc in a black sky. Mercury’s slow spin and eccentric orbit can even make the Sun pause and reverse at sunrise. This is an artistic rendering, not an accurate ephemeris.',
            earthText: 'From Mercury, Earth is a brilliant blue-white “star” that never strays more than about 28° from the Sun. Its placement in this sky is artistic, not an accurate ephemeris.',
            venusText: 'Venus is the brightest point of light in Mercury’s sky — brighter than it appears from Earth — and can wander up to about 46° from the Sun. Its placement here is artistic, not an accurate ephemeris.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Click the Sun, Earth, or Venus in the sky to learn about it — you can then visit it in the Solar System view.',
            featuresTitle: 'What you are seeing', features: [
                ['A Sun three times wider', 'Mercury orbits barely a third of Earth’s distance from the Sun — it looms huge in a black sky, and its slow drift can pause and reverse.'],
                ['Black sky at noon', 'No air means no scattering — stars share the sky with the Sun and shadows are razor-sharp.'],
                ['The great scarp', 'A long cliff ridge to the south — Mercury shrank as its core cooled and the crust wrinkled like a dried fruit.'],
                ['Bright hollows', 'Shallow pale pits found only on Mercury — probably rock evaporating away under the heat.'],
                ['Central-peak crater', 'A mountain raised inside the bowl when the crater floor rebounded after impact.'],
                ['Earth & Venus as stars', 'The two brightest points hugging the Sun — both clickable.'],
                ['Angular ejecta blocks', 'Sharp-edged rock fragments clustered near crater rims — with no wind or water, nothing ever rounds them off.'],
                ['Mars-like gravity', '3.7 m/s² — a planet much smaller than Mars that feels oddly familiar underfoot.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this expedition. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['A mountain born of impact', 'The peak in the middle of this crater was pushed up when the compressed floor rebounded — a signature of large impacts everywhere, but especially crisp on airless worlds.', 'LANDSCAPE', 'Central-peak crater'],
                ['A block thrown by impact', 'This angular block is ejecta — rock blasted out of the crater and dropped here. Rotate it in the specimen viewer; its sharp edges have survived billions of years with no wind to soften them.', 'SURFACE', 'Ejecta block'],
                ['A listener in the glare', 'No probe has ever landed on Mercury — MESSENGER studied it from orbit between 2011 and 2015. This relay satellite is a real MESSENGER model from NASA\u2019s 3D archive; its placement here is imagined, not a real mission.', 'SPACECRAFT', 'Relay satellite'],
                ['Mercury’s hollows', 'These shallow, bright-rimmed pits exist nowhere else we know. They may form as volatile material in the rock evaporates under the relentless Sun.', 'SURFACE', 'Hollows field'],
                ['A wrinkle from a shrinking world', 'This long ridge is a lobate scarp — a cliff pushed up as Mercury’s interior cooled and the whole planet contracted. No other planet wears them so prominently.', 'LANDSCAPE', 'Lobate scarp']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '水星', surfaceMode: '水星表面探索', chapter: '探索 004 / 晨昏之地', title: '站上水星。',
            intro: '走进一片艺术重建的水星晨昏带陨击平原——正午时分天空依然漆黑，太阳的视直径是地球上的三倍，脚下是太阳系里最古老的地表。', begin: '踏上水星', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受水星科学启发的虚构地点。',
            gravity: '水星重力', atmosphere: '大气环境', vacuum: '接近真空', temperature: '表面温度', tempValue: '白天 430°C / 夜 −180°C', distance: '距抵达点', walkingHint: 'W A S D 行走 · 拖动转头 · 空格跳跃 · G 重力 · M 声音', touchHint: '方向按钮行走 · 拖动画面转头 · 点击跳跃',
            astronaut: '宇航员视角', jump: '跳跃', grounded: '双脚着地', airborne: '腾空中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭头部起伏可获得更平稳的视角。',
            station0: '抵达平原', station1: '陨坑外围', station2: '凹陷区边缘', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实着陆点扫描', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在准备水星风景…', fieldGuide: '水星探索指南', guideTitle: '太阳高悬之地。',
            guideIntro: '这是一片可以自由漫游的陨击平原，而非完整水星。五个观察点都位于同一个场景，其中两个只能徒步走到。', controlsTitle: '如何探索',
            gravityCompare: '对比地球重力 · G', gravityMercury: '恢复水星重力 · G', gravityHint: '同样的起跳力度，不同的下落感受。水星重力 3.7 m/s²——和火星几乎一模一样，但它比火星小得多。', soundOn: '宇航服声音：开', soundOff: '宇航服声音：关', soundHint: '宇航服内的风扇低鸣与经身体传导的脚步声；外部一片死寂——水星没有空气传声。M 切换。', gravityMercuryTag: '水星重力 — 3.7 m/s²，和火星相近。', gravityEarth: '地球重力 — 9.8 m/s²。同样的起跳，高度骤减。', mercuryTag: '水星', earthTag: '地球',
            controlsText: '你是一位徒步探索的宇航员。W A S D 或方向键行走，Shift 快步，空格跳跃，落地后才能再次起跳。腾空时保留起跳时的水平惯性，不能像飞行器一样转向。拖动画面观察，也可以低头看看自己的靴子。触屏有方向按钮和跳跃键。G 对比地球重力，M 开关宇航服声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '水星和月球一样没有大气、遍布陨击坑，但颜色更暗、偏棕。它的标志性地貌都是真实的：行星收缩形成的叶状悬崖、太阳系独有的明亮凹陷群、以及视直径三倍于地球的太阳。本场景位于晨昏带附近，阳光以很低的角度斜射；地形与观察点由程序创作，并非实测数据。',
            soundText: '水星几乎没有大气——表面是完全寂静的，你听到的来自宇航服内部：维生风扇的低鸣、经身体传导的脚步，以及记录发现时的无线电提示音。跳跃使用水星表面重力 3.7 m/s²；按 G 可用相同的起跳力度感受地球 9.8 m/s²。步速、起跳力度和镜头起伏经过舒适性设计，不是完整的宇航服物理模拟。',
            assetText: '本页不使用外部影像——地形、岩石纹理和天空均由浏览器本地生成。',
            skyEyebrow: '水星天空中', sunName: '太阳', earthName: '地球', venusName: '金星',
            sunText: '从水星看，太阳的视直径约为地球上的三倍——一轮炽热的白色圆盘挂在漆黑的天空中。水星缓慢的自转和偏心轨道甚至能让太阳在日出时停顿、倒退。本场景为艺术呈现，并非精确星历。',
            earthText: '从水星看，地球是一颗明亮的蓝白色"星"，永远不会离太阳超过约 28°。它在天空中的位置经过艺术处理，并非精确星历。',
            venusText: '金星是水星天空中最亮的点状天体——比从地球上看更亮——最多可以离太阳约 46°。它的位置经过艺术处理，并非精确星历。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '点击天空中的太阳、地球或金星可以了解它，然后还能跳到太阳系视角。',
            featuresTitle: '你眼前的景观', features: [
                ['三倍宽的太阳', '水星距太阳只有地球的三分之一左右——黑天上巨大的炽白日轮，还会缓慢漂移、仿佛停顿倒退。'],
                ['正午的黑天', '没有大气就没有散射——星星和太阳同时挂在天上，影子边缘锋利如刀。'],
                ['大悬崖皱脊', '南方横亘着一道长崖脊——水星内核冷却收缩，外壳像干果一样起皱。'],
                ['明亮的凹陷', '浅浅的亮色坑，太阳系中仅见于水星——可能是岩石中的挥发性物质被烤了出来。'],
                ['中央峰陨坑', '坑中央立着一座山——撞击瞬间坑底反弹抬升形成。'],
                ['地球与金星作伴', '太阳附近两颗最亮的星点——都可以点击。'],
                ['棱角溅射岩块', '聚集在陨坑边缘的锋利碎块——没有风水侵蚀，亿万年也磨不圆它们。'],
                ['类火星的重力', '3.7 m/s²——水星比火星小得多，脚感却几乎一样。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次探索区域边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['撞击诞生的山峰', '坑中央的山峰是受压坑底反弹抬升的结果——大撞击的标志性产物，在没有大气的星球上保存得格外清晰。', '地貌类型', '中央峰陨击坑'],
                ['被抛出的大岩块', '这块棱角分明的巨石是溅射物——撞击时从坑中炸飞出来、落在这里的岩石。在查看器中旋转它；没有风的打磨，它的棱角保存了几十亿年。', '地表组成', '溅射岩块'],
                ['烈日下的倾听者', '迄今没有探测器在水星着陆——信使号在 2011 至 2015 年间从轨道研究它。这颗中继卫星是 NASA 公开模型库的真实信使号模型，落地摆放是想象，并非真实任务。', '航天器', '中继卫星'],
                ['水星的凹陷', '这些浅浅的亮边浅坑在别处从未见过——可能是岩石中的挥发性物质在烈日下蒸发逸散形成的。', '地表组成', '凹陷群'],
                ['星球收缩的皱纹', '这道长脊是叶状悬崖——水星内部冷却、整颗行星收缩时把地壳推起来的断崖。没有哪颗行星像水星这样布满这种皱脊。', '地貌类型', '叶状悬崖']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR FIELD ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed landing site or an identified Mercurian sample.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Land before recording a discovery.', approach: 'Walk closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Walk up to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures on Mercury. H hides or restores the route card.',
            teasers: ['Walk south-west to the crater rim and look for the mountain inside its bowl.', 'Approach the angular block beside the crater, then turn it around in the specimen viewer.', 'Walk east from arrival to find a relay satellite standing in the glare.', 'Cross the plain north-east to a cluster of shallow, bright pits.', 'Hike south-east and climb the long cliff ridge — a wrinkle from a shrinking planet.'],
            details: ['Central peaks rise when a crater floor, compressed by the impact, springs back — the whole bowl rebounds like a slow splash frozen in rock. This crater is an artistic example, not a reconstruction of a named formation.', 'Ejecta blocks are fragments hurled out by the impact that dug the crater. On an airless world they keep their sharp edges for ages — nothing rounds them off. Rotate the representative rock to examine its surface.', 'Mercury has never hosted a lander — it is a hard place to reach and a harder place to survive. MESSENGER orbited it from 2011 to 2015, and BepiColombo is on its way. This model comes from NASA\u2019s open 3D archive; its placement on the surface is artistic, not a real mission.', 'MESSENGER found these bright, shallow depressions and named them “hollows” — they may form as sunlight bakes volatile substances out of the rock. They are young and still forming today, geologically speaking.', 'Lobate scarps are Mercury’s signature: as the planet’s huge core cooled and shrank, the crust cracked and one side thrust up over the other — cliffs hundreds of kilometres long. This ridge is a modest artistic echo.']
        },
        zh: {
            fieldRoute: '你的探索路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转岩石', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实着陆点测绘，也不是已鉴定的水星样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点前进', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请先落地，再记录发现。', approach: '请走近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维岩石查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，走近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非水星表面的真实设施。H 可隐藏或恢复路线卡片。',
            teasers: ['向西南走到陨坑边缘，找找坑底中央的那座山。', '走近陨坑旁那块棱角分明的大岩块，在查看器中转动并观察它。', '从抵达点向东走，在烈日下找一颗中继卫星。', '穿过平原向东北走，找一片浅浅的亮色坑群。', '徒步东南，爬上那道长长的崖脊——一颗收缩星球留下的皱纹。'],
            details: ['中央峰的形成原理是：撞击瞬间坑底被压缩，随后像慢动作的回弹一样隆起——整座坑底仿佛一朵被冻住的浪花。这座陨坑是艺术示例，不对应某个真实命名地貌。', '溅射岩块是挖掘陨坑的那次撞击抛出的碎片。在没有大气的星球上，它们的锋利棱角能保存几十亿年——没有任何东西磨圆它们。可以旋转这块代表性岩石，仔细观察表面。', '水星从来没有迎来过着陆器——抵达它难，活下来更难。信使号在 2011 至 2015 年间环绕它测绘，贝皮科伦坡正在路上。这台模型来自 NASA 开放三维模型库，落在表面是艺术创作，并非真实任务。', '信使号发现了这些明亮的浅坑并命名为"凹陷"——可能是阳光把岩石中的挥发性物质烤了出来。从地质尺度看，它们很年轻，至今仍在形成。', '叶状悬崖是水星的招牌：行星巨大的内核冷却收缩，地壳开裂、一侧推覆到另一侧之上——绵延数百公里的断崖。这道山脊是朴素的艺术再现。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, surface, sunlight, walker, astronaut, animationId = null;
    let jumpRequested = false, motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = -0.12, pitch = -0.06, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = MercuryTerrain.GRAVITY, audio = null, soundEnabled = true;
    let footprints = null, printCursor = 0, lastPrintMark = 0;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set(), obstacles = [];
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null, composer = null, fxaaPass = null, cinePass = null;
    const skyBodies = [], skyRay = new THREE.Raycaster(), skyPointer = new THREE.Vector2();
    let mercurySun = null;
    const lensFlare = [], flareV = new THREE.Vector3(), flareDir = new THREE.Vector3();
    let skyPivot = null, earthPivot = null;
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
        $('gravity-mode').textContent = t(gravity === MercuryTerrain.GRAVITY ? 'mercuryTag' : 'earthTag');
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
        if (error) console.error('Mercury expedition:', error);
    }
    function makeTexture() {
        const size = profile.texture;
        const pixels = new Uint8Array(size * size * 4);
        const rand = MercuryTerrain.random(817);
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
                const ripple = Math.sin((u * 46 + tileNoise(u, v, fields[1]) * 4.5) * Math.PI) * 4;
                const value = Math.max(48, Math.min(190, 118 + grain + cloud + ripple + (rand() > 0.999 ? -35 : 0)));
                const i = (z * size + x) * 4;
                pixels[i] = value; pixels[i + 1] = value * 0.92; pixels[i + 2] = value * 0.84; pixels[i + 3] = 255;
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
                diffuseColor.rgb *= 1.0 + sin(vGroundPosition.y * 3.1) * 0.055;
            `);
        };
        return material;
    }
    function mountainMaterial() {
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x8d8177).convertSRGBToLinear(), roughness: 1, metalness: 0, vertexColors: true });
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
        surface = MercuryTerrain.createSurface(960, profile.segments);
        const geometry = new THREE.PlaneGeometry(surface.size, surface.size, surface.segments, surface.segments);
        geometry.rotateX(-Math.PI / 2);
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        for (let i = 0; i < positions.count; i++) {
            positions.setY(i, surface.heights[i]);
            const n = MercuryTerrain.noise(positions.getX(i) * 0.085, positions.getZ(i) * 0.085);
            const patch = MercuryTerrain.noise(positions.getX(i) * 0.011 + 7, positions.getZ(i) * 0.011 - 3);
            const streak = MercuryTerrain.noise(positions.getX(i) * 0.03 - positions.getZ(i) * 0.05 + 11, positions.getZ(i) * 0.008);
            const px = positions.getX(i), pz = positions.getZ(i);
            let hollowGlow = 1;
            for (const hollow of MercuryTerrain.hollows) {
                const hd = Math.hypot(px - hollow.x, pz - hollow.z) / hollow.radius;
                if (hd < 1.7) hollowGlow = Math.max(hollowGlow, 1 + (1 - hd / 1.7) * 0.55);
            }
            const shade = (0.6 + n * 0.15 + patch * 0.07 + Math.max(0, streak - 0.35) * 0.08) * hollowGlow;
            colors.set([shade, shade * 0.94, shade * 0.88], i * 3);
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
            const n = MercuryTerrain.noise(x * 0.003 + 3, z * 0.003 - 1);
            const ridge = Math.exp(-Math.pow((r - 1100) / 510, 2));
            const broken = 0.55 + 0.35 * MercuryTerrain.noise(x * 0.008, z * 0.008) + 0.1 * MercuryTerrain.noise(x * 0.026, z * 0.026);
            const fractured = (Math.abs(MercuryTerrain.noise(x * 0.012 + 31, z * 0.012) * 2 - 1) - 0.4) * 12 + (MercuryTerrain.noise(x * 0.022, z * 0.022 + 19) - 0.5) * 3;
            const h = MercuryTerrain.height(x, z) - 0.6 + blend * (ridge * ((45 + n * 170) * broken + fractured) + n * 28);
            farPositions.setY(i, h);
            const color = 0.67 + n * 0.19;
            farColors.set([color, color * 0.92, color * 0.85], i * 3);
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
    function loadRockModel(url) {
        return new Promise(resolve => {
            if (!THREE.GLTFLoader) return resolve(null);
            createGltfLoader().load(url, gltf => {
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
            const n = MercuryTerrain.noise(x * 2.4 + seed, z * 2.4 + y * 1.7);
            const corner = MercuryTerrain.noise(x * 5.5 - seed, y * 5.5 + z * 3.1);
            const f = 0.72 + n * 0.34 + corner * 0.14;
            p.setXYZ(i, x * f, y * (0.52 + n * 0.3), z * f);
            const shade = 0.46 + MercuryTerrain.noise(x * 8 + seed, y * 8 + z * 2) * 0.2;
            c.set([shade, shade * 0.95, shade * 0.88], i * 3);
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(c, 3));
        geometry.computeVertexNormals();
        return geometry;
    }
    function buildRocks(texture, rockModels) {
        const rand = MercuryTerrain.random(19690720);
        const material = new THREE.MeshStandardMaterial({ map: texture, bumpMap: texture, bumpScale: 0.07, roughness: 0.98, vertexColors: true, flatShading: true });
        const transform = new THREE.Object3D();
        const color = new THREE.Color();
        const craters = MercuryTerrain.craters;
        const useModels = rockModels && rockModels.length;
        const groups = useModels ? rockModels.length : 4;
        for (let group = 0; group < groups; group++) {
            const count = Math.floor(profile.rocks / groups);
            const model = useModels ? rockModels[group % rockModels.length] : null;
            const rocks = new THREE.InstancedMesh(model ? model.geometry : rockGeometry(group * 19 + 8, 1), model ? (model.material || material) : material, count);
            for (let i = 0; i < count; i++) {
                let x, z;
                if (rand() < 0.55) {
                    const crater = craters[Math.floor(rand() * craters.length)];
                    const angle = rand() * Math.PI * 2;
                    const ring = crater.radius * (1.02 + rand() * 0.65);
                    x = crater.x + Math.cos(angle) * ring;
                    z = crater.z + Math.sin(angle) * ring;
                } else {
                    x = (rand() - 0.5) * 760; z = (rand() - 0.5) * 760;
                }
                const size = 0.2 + Math.pow(rand(), 3.7) * 2.7;
                while (stations.some(s => Math.hypot(x - s.x, z - s.z) < size + 4) || expedition.isOnRoute({ x, z }, size * 1.5 + 0.5)) {
                    x = (rand() - 0.5) * 760; z = (rand() - 0.5) * 760;
                }
                if (model) {
                    const s = size * 1.9;
                    const lift = -model.geometry.boundingBox.min.y * s;
                    transform.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) + lift * 0.38, z);
                    transform.scale.setScalar(s);
                    transform.rotation.set((rand() - 0.5) * 0.9, rand() * Math.PI * 2, (rand() - 0.5) * 0.9);
                    color.setScalar(0.78 + rand() * 0.22);
                } else {
                    transform.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) + size * 0.12, z);
                    transform.scale.set(size * (0.8 + rand() * 0.7), size, size * (0.8 + rand() * 0.5));
                    transform.rotation.set((rand() - 0.5) * 0.9, rand() * Math.PI * 2, (rand() - 0.5) * 0.9);
                    color.setScalar(0.5 + rand() * 0.4);
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
        const heroes = [[-37, -16, 2.6], [-42, -22, 1.2], [-26, -34, 1.5], [-52, -8, 0.9], [14, 30, 1.8], [8, -14, 0.9], [70, 42, 1.4], [-90, 20, 1.9], [50, -58, 1.2], [-12, 44, 1.1]];
        for (const [x, z, size] of heroes) {
            const model = rockModels && rockModels.length ? rockModels[Math.floor(rand() * rockModels.length)] : null;
            let rock;
            if (model) {
                rock = new THREE.Mesh(model.geometry, model.material || material);
                const s = size * 1.9;
                rock.scale.setScalar(s);
                rock.rotation.set((rand() - 0.5) * 0.5, rand() * 6, (rand() - 0.5) * 0.5);
                const lift = -model.geometry.boundingBox.min.y * s;
                rock.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) + lift * 0.38, z);
            } else {
                rock = new THREE.Mesh(rockGeometry(x + 100, 2), material);
                rock.scale.set(size * 1.35, size * 0.9, size);
                rock.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) + size * 0.2, z);
                rock.rotation.set((rand() - 0.5) * 0.5, rand() * 6, (rand() - 0.5) * 0.5);
            }
            rock.castShadow = rock.receiveShadow = true;
            scene.add(rock);
            if (x === -37 && z === -16) featuredRock = rock;
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
                transform.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) + lift * 0.38, z);
                transform.scale.setScalar(s);
            } else {
                transform.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) + size * 0.1, z);
                transform.scale.set(size * 1.7, size, size);
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
        const skyMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false, depthTest: false,
            uniforms: { base: { value: new THREE.Color(0x020203) } },
            vertexShader: 'varying vec3 vP; void main(){vP=position; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_Position.z=gl_Position.w;}',
            fragmentShader: 'uniform vec3 base; varying vec3 vP; void main(){gl_FragColor=vec4(base,1.0);}'
        });
        const sky = new THREE.Mesh(new THREE.SphereGeometry(6800, 32, 24), skyMaterial);
        sky.frustumCulled = false;
        sky.renderOrder = -1;
        scene.add(sky);
        const starRand = MercuryTerrain.random(9137);
        const starPositions = new Float32Array(1400 * 3);
        const starColors = new Float32Array(1400 * 3);
        for (let i = 0; i < 1400; i++) {
            const theta = starRand() * Math.PI * 2, y = 0.04 + starRand() * 0.96;
            const r = Math.sqrt(Math.max(0, 1 - y * y));
            starPositions.set([Math.cos(theta) * r * 6400, y * 6400, Math.sin(theta) * r * 6400], i * 3);
            const bright = 0.35 + starRand() * 0.65, warm = starRand();
            starColors.set([bright, bright * (0.88 + warm * 0.12), bright * (0.78 + (1 - warm) * 0.22)], i * 3);
        }
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ size: 5.5, vertexColors: true, sizeAttenuation: true, depthWrite: false, transparent: true, opacity: 0.9 }));
        stars.frustumCulled = false;
        scene.add(stars);
        skyPivot = new THREE.Group();
        scene.add(skyPivot);
        const sun = new THREE.Mesh(new THREE.SphereGeometry(26, 32, 24), new THREE.MeshBasicMaterial({ color: 0xfffaf0 }));
        sun.position.copy(sunlight.position).normalize().multiplyScalar(2100);
        skyPivot.add(sun);
        mercurySun = sun;
        const haloCanvas = document.createElement('canvas');
        haloCanvas.width = haloCanvas.height = 128;
        const haloContext = haloCanvas.getContext('2d');
        const gradient = haloContext.createRadialGradient(64, 64, 4, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255,248,235,0.95)');
        gradient.addColorStop(0.2, 'rgba(255,240,215,0.5)');
        gradient.addColorStop(0.55, 'rgba(255,230,195,0.14)');
        gradient.addColorStop(1, 'rgba(255,230,195,0)');
        haloContext.fillStyle = gradient;
        haloContext.fillRect(0, 0, 128, 128);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, opacity: 0.95, depthWrite: false }));
        halo.scale.set(340, 340, 1);
        halo.position.copy(sun.position);
        skyPivot.add(halo);
        earthPivot = new THREE.Group();
        skyPivot.add(earthPivot);
        const earthDirection = sun.position.clone().normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.22);
        earthDirection.y = Math.max(0.1, earthDirection.y - 0.06);
        const earthDot = new THREE.Mesh(new THREE.SphereGeometry(1.9, 12, 10), new THREE.MeshBasicMaterial({ color: 0xaac8ff }));
        earthDot.position.copy(earthDirection.normalize()).multiplyScalar(2100);
        earthPivot.add(earthDot);
        const venusDirection = sun.position.clone().normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.5);
        venusDirection.y = Math.max(0.12, venusDirection.y - 0.03);
        const venusDot = new THREE.Mesh(new THREE.SphereGeometry(2.3, 12, 10), new THREE.MeshBasicMaterial({ color: 0xf5ead0 }));
        venusDot.position.copy(venusDirection.normalize()).multiplyScalar(2100);
        skyPivot.add(venusDot);
        for (const [body, object, hitRadius, parent] of [['sun', sun, 230, skyPivot], ['earth', earthDot, 120, earthPivot], ['venus', venusDot, 130, skyPivot]]) {
            const proxy = new THREE.Mesh(new THREE.SphereGeometry(hitRadius, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
            proxy.position.copy(object.position);
            proxy.userData.body = body;
            parent.add(proxy);
            skyBodies.push(proxy);
        }
        return Promise.resolve();
    }
    function flareGhostTexture(streak) {
        const canvas = document.createElement('canvas');
        if (streak) {
            canvas.width = 256; canvas.height = 24;
            const context = canvas.getContext('2d');
            const g = context.createLinearGradient(0, 0, 256, 0);
            g.addColorStop(0, 'rgba(255,244,220,0)');
            g.addColorStop(0.5, 'rgba(255,244,220,0.7)');
            g.addColorStop(1, 'rgba(255,244,220,0)');
            context.fillStyle = g;
            context.fillRect(0, 0, 256, 24);
        } else {
            canvas.width = canvas.height = 64;
            const context = canvas.getContext('2d');
            const g = context.createRadialGradient(32, 32, 4, 32, 32, 32);
            g.addColorStop(0, 'rgba(255,242,214,0)');
            g.addColorStop(0.55, 'rgba(255,242,214,0.16)');
            g.addColorStop(0.82, 'rgba(196,214,255,0.34)');
            g.addColorStop(1, 'rgba(196,214,255,0)');
            context.fillStyle = g;
            context.fillRect(0, 0, 64, 64);
        }
        return new THREE.CanvasTexture(canvas);
    }
    function buildLensFlare() {
        const ghostTex = flareGhostTexture(false), streakTex = flareGhostTexture(true);
        const specs = [
            { k: 1, sx: 0.55, sy: 0.016, alpha: 0.4, streak: true },
            { k: 1, sx: 0.014, sy: 0.22, alpha: 0.45, streak: true },
            { k: -0.35, frac: 0.045, alpha: 0.3 },
            { k: -0.72, frac: 0.09, alpha: 0.2 },
            { k: -1.12, frac: 0.06, alpha: 0.26 },
            { k: -1.55, frac: 0.12, alpha: 0.14 },
            { k: 0.4, frac: 0.03, alpha: 0.3 },
            { k: 0.78, frac: 0.055, alpha: 0.22 }
        ];
        for (const spec of specs) {
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: spec.streak ? streakTex : ghostTex, transparent: true, opacity: 0,
                depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending
            }));
            sprite.frustumCulled = false;
            scene.add(sprite);
            lensFlare.push({ sprite, ...spec });
        }
    }
    function updateLensFlare() {
        if (!mercurySun || !lensFlare.length) return;
        mercurySun.getWorldPosition(flareV);
        flareV.project(camera);
        const visible = flareV.z < 1 && Math.abs(flareV.x) < 1.45 && Math.abs(flareV.y) < 1.45;
        const edge = Math.max(0, 1 - Math.hypot(flareV.x, flareV.y) / 1.5);
        const depth = 30, halfFov = Math.tan(camera.fov * Math.PI / 360);
        for (const g of lensFlare) {
            if (!visible || !edge) { g.sprite.material.opacity = 0; continue; }
            flareDir.set(flareV.x * g.k, flareV.y * g.k, 0.5).unproject(camera).sub(camera.position).normalize();
            g.sprite.position.copy(camera.position).addScaledVector(flareDir, depth);
            const w = 2 * depth * halfFov;
            if (g.streak) g.sprite.scale.set(g.sx * w * camera.aspect, g.sy * w, 1);
            else g.sprite.scale.set(g.frac * w * camera.aspect, g.frac * w, 1);
            g.sprite.material.opacity = g.alpha * edge;
        }
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
        context.fillStyle = 'rgba(56,34,22,0.55)';
        context.beginPath(); context.ellipse(0, 0, 13, 22, 0, 0, Math.PI * 2); context.fill();
        context.fillStyle = 'rgba(36,21,14,0.8)';
        for (let i = 0; i < 8; i++) context.fillRect(-11, -20 + i * 5, 22, 2.6);
        context.fillStyle = 'rgba(32,19,13,0.85)';
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
        const y = MercuryTerrain.sampleSurface(surface, x, z) + 0.015;
        const slopeX = (MercuryTerrain.sampleSurface(surface, x + 0.35, z) - MercuryTerrain.sampleSurface(surface, x - 0.35, z)) / 0.7;
        const slopeZ = (MercuryTerrain.sampleSurface(surface, x, z + 0.35) - MercuryTerrain.sampleSurface(surface, x, z - 0.35)) / 0.7;
        const normal = new THREE.Vector3(-slopeX, 1, -slopeZ).normalize();
        const align = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw + (rand() - 0.5) * 0.12);
        const matrix = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), align.multiply(turn), new THREE.Vector3(side < 0 ? -1 : 1, 1, 1));
        footprints.setMatrixAt(printCursor % 240, matrix);
        footprints.instanceMatrix.needsUpdate = true;
        printCursor++;
        if (walker.speed > 0.6) spawnDust(x, y + 0.03, z, 4, 0.28);
        if (audio) audio.step(walker.speed / MercuryTerrain.WALK_SPEED);
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
        const material = new THREE.PointsMaterial({ size: 0.05 + energy * 0.05, map: dustTexture(), color: 0xa79e92, transparent: true, opacity: 0.65, depthWrite: false, sizeAttenuation: true });
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
                burst.velocities[j * 3 + 1] -= gravity * dt;
                const ground = MercuryTerrain.sampleSurface(surface, px, pz) + 0.01;
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
    let stationBeacon = null;
    function buildInstrument() {
        const station = new THREE.Group();
        const foil = new THREE.MeshStandardMaterial({ color: 0xb9975f, roughness: 0.32, metalness: 0.72 });
        const metal = new THREE.MeshStandardMaterial({ color: 0xc8c1b1, roughness: 0.45, metalness: 0.6 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x36393d, roughness: 0.85 });
        const panel = new THREE.MeshStandardMaterial({ color: 0x1d3350, roughness: 0.3, metalness: 0.5 });
        const frame = new THREE.MeshStandardMaterial({ color: 0x8a8378, roughness: 0.5, metalness: 0.6 });
        function part(geometry, material, x, y, z) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = mesh.receiveShadow = true;
            station.add(mesh);
            return mesh;
        }
        for (const [lx, lz] of [[-0.34, -0.34], [0.34, -0.34], [-0.34, 0.34], [0.34, 0.34]]) {
            const leg = part(new THREE.CylinderGeometry(0.016, 0.026, 0.66, 8), dark, lx, 0.31, lz);
            leg.rotation.z = lx * 0.42; leg.rotation.x = -lz * 0.42;
            part(new THREE.CylinderGeometry(0.055, 0.07, 0.035, 10), dark, lx * 1.1, 0.015, lz * 1.1);
        }
        part(new THREE.BoxGeometry(0.56, 0.4, 0.56), foil, 0, 0.76, 0);
        part(new THREE.BoxGeometry(0.6, 0.05, 0.6), dark, 0, 0.97, 0);
        part(new THREE.BoxGeometry(0.58, 0.05, 0.58), dark, 0, 0.55, 0);
        part(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 14), dark, 0.36, 0.72, -0.1);
        part(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 14), frame, 0.36, 0.88, -0.1);
        const tallMast = part(new THREE.CylinderGeometry(0.012, 0.017, 1.85, 8), metal, -0.13, 1.55, -0.11);
        tallMast.rotation.z = 0.035;
        for (const [by, len, angle] of [[1.62, 0.4, 0], [1.86, 0.34, Math.PI / 2], [2.08, 0.28, 0]]) {
            const boom = part(new THREE.BoxGeometry(len, 0.022, 0.022), metal, -0.13, by, -0.11);
            boom.rotation.y = angle;
            part(new THREE.SphereGeometry(0.026, 8, 6), dark, -0.13 + len / 2 * Math.cos(angle), by, -0.11 - len / 2 * Math.sin(angle));
            part(new THREE.SphereGeometry(0.026, 8, 6), dark, -0.13 - len / 2 * Math.cos(angle), by, -0.11 + len / 2 * Math.sin(angle));
        }
        const smallMast = part(new THREE.CylinderGeometry(0.01, 0.013, 0.95, 8), metal, 0.18, 1.4, 0.18);
        part(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 10), dark, 0.18, 1.9, 0.18);
        const dishArm = part(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), dark, -0.05, 1.1, -0.28);
        dishArm.rotation.x = 0.6;
        const dish = part(new THREE.SphereGeometry(0.19, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2.8), metal, -0.05, 1.24, -0.36);
        dish.rotation.x = -1.15;
        for (const side of [-1, 1]) {
            const wing = part(new THREE.BoxGeometry(0.72, 0.018, 0.36), panel, side * 0.68, 0.66, 0.06);
            wing.rotation.z = side * -0.32;
            const rim = part(new THREE.BoxGeometry(0.74, 0.024, 0.04), frame, side * 0.68, 0.66, -0.14);
            rim.rotation.z = side * -0.32;
        }
        stationBeacon = part(new THREE.SphereGeometry(0.04, 12, 10), new THREE.MeshBasicMaterial({ color: 0xff6a3d, transparent: true, opacity: 0.9 }), -0.13, 2.5, -0.11);
        stationBeacon.castShadow = stationBeacon.receiveShadow = false;
        const x = 28, z = -30;
        station.position.set(x, MercuryTerrain.sampleSurface(surface, x, z) - 0.015, z);
        station.rotation.y = 2.2;
        scene.add(station);
        obstacles.push({ x, z, radius: 1 });
    }
    async function buildRelay() {
        const x = 28, z = -30;
        const model = await loadSceneModel('models/messenger.glb');
        if (!model) { buildInstrument(); return; }
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (!size.y || !isFinite(size.y)) { buildInstrument(); return; }
        model.scale.setScalar(2.4 / size.y);
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -box.min.y + 0.02, -center.z);
        model.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
        const group = new THREE.Group();
        group.add(model);
        const ground = MercuryTerrain.sampleSurface(surface, x, z);
        group.position.set(x, ground, z);
        group.rotation.y = 2.2;
        scene.add(group);
        stationBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), new THREE.MeshBasicMaterial({ color: 0xff6a3d, transparent: true, opacity: 0.9 }));
        stationBeacon.position.set(x, ground + 2.6, z);
        scene.add(stationBeacon);
        obstacles.push({ x, z, radius: 2.6 });
    }
    const rand = MercuryTerrain.random(4451);
    function updateGravityButton() {
        $('gravity-button').textContent = t(gravity === MercuryTerrain.GRAVITY ? 'gravityCompare' : 'gravityMercury');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== MercuryTerrain.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === MercuryTerrain.GRAVITY ? MercuryTerrain.EARTH_GRAVITY : MercuryTerrain.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === MercuryTerrain.GRAVITY ? 'mercuryTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === MercuryTerrain.GRAVITY ? 'gravityMercuryTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-mercury-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
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
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Mercury'}`;
        $('moonlet-dialog').showModal();
    }
    function updateCamera() {
        if (!walker) return;
        const headMotion = motionEnabled && !photoMode && exploring;
        const bob = headMotion ? walker.bob - walker.landing : 0;
        const roll = headMotion && walker.grounded ? Math.sin(walker.stride) * Math.min(1, walker.speed / MercuryTerrain.WALK_SPEED) * 0.003 : 0;
        camera.position.set(position.x, walker.y + MercuryTerrain.EYE_HEIGHT + bob, position.z);
        camera.rotation.set(pitch, yaw, roll, 'YXZ');
        if (astronaut) {
            astronaut.visible = exploring;
            astronaut.position.set(position.x, walker.y, position.z);
            astronaut.rotation.y = yaw;
            astronaut.userData.legs.forEach((leg, i) => {
                const stride = Math.sin(walker.stride + i * Math.PI);
                const amount = walker.grounded ? Math.min(1, walker.speed / MercuryTerrain.WALK_SPEED) : 0;
                leg.position.z = stride * 0.12 * amount;
                const footZ = leg.position.z - 0.1;
                const footX = position.x + Math.cos(yaw) * leg.position.x + Math.sin(yaw) * footZ;
                const footWorldZ = position.z - Math.sin(yaw) * leg.position.x + Math.cos(yaw) * footZ;
                const contact = walker.grounded ? MercuryTerrain.sampleSurface(surface, footX, footWorldZ) - walker.y : 0;
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
        walker = MercuryTerrain.createWalker(surface, position);
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
            MercuryTerrain.updateWalker(surface, walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: jumpRequested }, dt, obstacles, gravity);
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
            if (Math.hypot(position.x, position.z) > MercuryTerrain.WALK_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
            if (wasMoving || walker.speed > 0.001 || !walker.grounded) sunlight.shadow.needsUpdate = true;
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
        if (exploring && dt > 0) updateDust(dt);
        if (stationBeacon) stationBeacon.material.opacity = 0.15 + 0.75 * (0.5 + 0.5 * Math.sin(now * 0.0028));
        if (skyPivot) skyPivot.rotation.y = Math.sin(now * 0.00003) * 0.045;
        if (earthPivot) earthPivot.rotation.y = now * 0.00002;
        if (Math.hypot(sunlight.target.position.x - position.x, sunlight.target.position.z - position.z) > 20) {
            sunlight.target.position.set(position.x, 0, position.z);
            sunlight.position.set(position.x - 180, 105, position.z - 160);
            sunlight.shadow.needsUpdate = true;
        }
        updateLensFlare();
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
            if (!window.THREE || !window.MercuryTerrain) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.95;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x020203);
            camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 7200);
            scene.add(new THREE.AmbientLight(0x8a8578, 0.1));
            scene.add(new THREE.HemisphereLight(0xb0a99a, 0x1c1a17, 0.3));
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
                composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.65, 0.55, 0.72));
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
            buildRelay();
            walker = MercuryTerrain.createWalker(surface, position);
            await buildSky();
            buildLensFlare();
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.MercuryExpedition, terrain: MercuryTerrain, strings: discoveryStrings });
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
                link.href = url; link.download = `mzu-mercury-expedition-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Mercury&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.MercuryAudio ? window.MercuryAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-mercury-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
