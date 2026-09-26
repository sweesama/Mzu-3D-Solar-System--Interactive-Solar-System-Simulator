(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.SaturnExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
    const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'SATURN', surfaceMode: 'RING-PLANE CRUISE',
            chapter: 'EXPEDITION 006 / THE RING RUNNER', title: 'Fly through\nSaturn’s rings.', intro: 'Cruise alongside Cassini through the planet’s famous rings — glittering ice fields below, a golden giant overhead, and a moonlet shepherding the edge.', begin: 'Begin the cruise', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Cassini science.', gravity: 'GRAVITY', atmosphere: 'ENVIRONMENT', vacuum: 'Vacuum · ice', temperature: 'RING TEMP', tempValue: 'about −180°C', distance: 'RING PLANE',
            walkingHint: 'W A S D to drift · drag to look · Space to rise · C to sink · G gravity · M sound', touchHint: 'Arrows to drift · drag to look · Burn to rise', station0: 'Ring approach', station1: 'Bright ring skim', station2: 'The great division',
            astronaut: 'PROBE', jump: 'Burn', grounded: 'Cruising', airborne: 'Cruising', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable camera drift for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SURVEYED RING SECTION',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Setting course for the rings…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'There is no surface — only ice.',
            guideIntro: 'This is a small, freely explorable stretch of the ring plane, not a whole-system simulation. The five observation points are different views of the same cruise; three lie close to the glittering sheet itself.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityMercury: 'Back to Saturn gravity · G', gravityHint: 'Same probe, different pull. Saturn’s gravity is 10.44 m/s² — press G and the ring’s gentle tug toward the plane eases under Earth’s gentler pull.', soundOn: 'Probe sounds: On', soundOff: 'Probe sounds: Off', soundHint: 'A quiet cabin hum, faint radio hiss, and the tick of ring grains off the hull. M toggles.', gravityMercuryTag: 'Saturn gravity — 10.44 m/s².', gravityEarth: 'Earth gravity — 9.8 m/s². The ring plane’s tug softens.', mercuryTag: 'SATURN', earthTag: 'EARTH',
            controlsText: 'You are a probe cruising the ring plane — there is no ground and no falling. The probe cruises forward on its own; W A S D or the arrow keys drift you sideways and speed you up, Shift is faster still. Space rises, C sinks below the sheet. Drag to look. Touchscreens have direction and Burn buttons. G compares Earth gravity; M toggles sound. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'Saturn’s rings are countless ice particles — from grains to house-sized boulders — orbiting in a sheet only tens of metres thick yet wider than the distance to our Moon. Cassini flew these gaps for thirteen years. The band layout, the propeller swirl, and the moonlet are artistic reconstructions, not survey data.',
            soundText: 'The cruise is far gentler than real ring-plane flight — Cassini threaded the gap at tens of kilometres per second. Press G to feel the ring’s faint tidal tug ease under Earth’s gravity. Listen for grains ticking off the hull when you skim the dense bands.',
            assetText: 'Cassini itself is a real NASA 3D model. The Saturn globe uses a real planet texture; the ring sheet, ice field, and starfield are generated locally.',
            skyEyebrow: 'IN SATURN’S SKY', sunName: 'The Sun', earthName: 'Earth', venusName: 'Saturn',
            sunText: 'From Saturn the Sun is nearly ten times farther than from Earth — a fierce little spark giving barely 1% of Earth’s daylight. Artistic rendering, not an accurate ephemeris.',
            earthText: 'From Saturn, Earth is a pale blue point that never wanders far from the Sun — visible only when geometry allows. Its placement here is artistic.',
            venusText: 'The giant itself — banded in pale gold, its shadow cutting the rings. Cassini orbited it for 294 laps between 2004 and 2017. Artistic placement and scale.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Click the small Sun or the giant itself in the sky to learn about it — you can then visit it in the Solar System view.',
            featuresTitle: 'What you are seeing', features: [
                ['A ten-times-dimmer Sun', 'Saturn orbits 9.5 times farther from the Sun than Earth — sunlight here is about 1% as strong, a hard pinprick over the ring plane.'],
                ['The ring sheet', 'A translucent sheet of ice stretching to the horizon — bright bands, dim bands, and gaps, all drifting around Saturn together.'],
                ['Ice all around you', 'Ring particles from snowflakes to boulders tumble past — nearly pure water ice, which is why the rings shine so bright.'],
                ['The Cassini division', 'A broad dark gap between the bright inner rings and the outer ones — not empty, just sparse, swept by resonances with the moon Mimas.'],
                ['A shepherd moonlet', 'A small icy world embedded in the ring edge — moons like this herd the ring particles into sharp bands.'],
                ['A propeller swirl', 'A tiny S-shaped disturbance where a hidden moonlet’s gravity has stirred the sheet — Cassini photographed hundreds of these.'],
                ['Cassini on the wing', 'NASA’s actual spacecraft model flies alongside — the probe that spent thirteen years inside this very scene.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this cruise lane. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['The ring approach', 'From altitude the rings reveal their structure — the broad bright B ring, the dark Cassini division, the dimmer C ring glowing faintly against night.', 'ARRIVAL', 'Ring vista'],
                ['A chunk of ring ice', 'This tumbling boulder is nearly pure water ice — rotate it in the specimen viewer. The rings are made of billions like it.', 'PARTICLE', 'Ring ice'],
                ['The great division', 'Inside the Cassini division — the “empty” gap that is not empty at all, just thinner ice haze between the bright rings.', 'STRUCTURE', 'Cassini division'],
                ['The shepherd moonlet', 'A small moon embedded in the ring edge — its gravity herds drifting particles into sharp bands and clears gaps.', 'MOON', 'Shepherd moonlet'],
                ['The propeller', 'An S-shaped ripple in the sheet — the signature of a moonlet too small to clear a full gap, still churning the ice around it.', 'DYNAMICS', 'Propeller swirl']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '土星', surfaceMode: '环平面巡航', chapter: '探索 006 / 环上飞梭', title: '飞进土星环。',
            intro: '与卡西尼号并肩巡航土星著名的光环——脚下是粼粼的冰粒平原，头顶是金色的巨行星，边缘还有一颗牧羊小卫星。', begin: '开始巡航', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受卡西尼任务科学启发的虚构地点。',
            gravity: '土星引力', atmosphere: '所处环境', vacuum: '真空 · 冰粒', temperature: '环平面温度', tempValue: '约 −180°C', distance: '环平面高度', walkingHint: 'W A S D 漂移 · 拖动转头 · 空格上升 · C 下沉 · G 引力 · M 声音', touchHint: '方向按钮漂移 · 拖动画面转头 · 点击推进上升',
            astronaut: '探测器视角', jump: '推进', grounded: '巡航中', airborne: '巡航中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭镜头漂移可获得更平稳的视角。',
            station0: '环面远眺', station1: '亮环掠影', station2: '大裂缝之中', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实环带测绘', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在设定环平面航线…', fieldGuide: '土星探索指南', guideTitle: '这里没有地面——只有冰。',
            guideIntro: '这是一段可以自由漫游的环平面切片，而非完整的环系统模拟。五个观察点位于同一段航程的不同位置；其中三处紧贴波光粼粼的环面本身。', controlsTitle: '如何移动',
            gravityCompare: '对比地球引力 · G', gravityMercury: '恢复土星引力 · G', gravityHint: '同一台探测器，不同的引力。土星引力 10.44 m/s²——按 G 体验环平面的轻微牵引在地球引力下变得更缓。', soundOn: '探测器声音：开', soundOff: '探测器声音：关', soundHint: '安静的舱内低鸣、微弱的射电嘶声，以及冰粒敲击舱体的滴答声。M 切换。', gravityMercuryTag: '土星引力 — 10.44 m/s²。', gravityEarth: '地球引力 — 9.8 m/s²。环平面的牵引变缓了。', mercuryTag: '土星', earthTag: '地球',
            controlsText: '你是一台巡航在环平面上的探测器——没有地面，也不会坠落。探测器会自行向前巡航；W A S D 或方向键控制侧向漂移和加减速，Shift 更快。空格上升，C 下沉到环面之下。拖动画面观察。触屏有方向按钮和推进键。G 对比地球引力，M 开关声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '土星环由无数冰粒组成——从雪粒到房屋大小的巨砾——在一张只有几十米厚、却比地月距离还宽的薄板上绕土星运行。卡西尼号在这些缝隙间飞行了十三年。环带布局、螺旋桨扰动和小卫星都是艺术重建，并非实测数据。',
            soundText: '巡航比真实环平面飞行平缓得多——卡西尼号以每秒数十公里的速度穿越缝隙。按 G 感受地球引力下环面潮汐牵引的减弱。掠过致密环带时，留意冰粒敲击舱体的滴答声。',
            assetText: '卡西尼号是 NASA 的真实 3D 模型。土星本体使用真实行星贴图；环面、冰粒场和星空由浏览器本地生成。',
            skyEyebrow: '土星天空中', sunName: '太阳', earthName: '地球', venusName: '土星',
            sunText: '从土星看，太阳比地球上看远将近十倍——一枚刺目的小火星，光照只有地球白天的约 1%。艺术呈现，并非精确星历。',
            earthText: '从土星看，地球是一个永远贴着太阳的淡蓝色小点——只有在特定角度才能看到。位置经过艺术处理。',
            venusText: '巨行星本尊——浅金色条带环绕，它的影子斜切过环面。2004 到 2017 年间卡西尼号绕它飞了 294 圈。位置和比例经过艺术处理。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '点击天空中那颗小太阳或巨行星本身可以了解它，然后还能跳到太阳系视角。',
            featuresTitle: '你眼前的景观', features: [
                ['暗十倍的太阳', '土星距太阳是地球的 9.5 倍——这里的光照只有地球的约 1%，环平面上方一枚冷硬的针尖。'],
                ['环面薄片', '一张半透明的冰板延展到地平线——亮带、暗带与缝隙，一起绕着土星漂移。'],
                ['冰粒环绕着你', '从雪花到巨砾的环颗粒在身边翻滚掠过——几乎是纯净的水冰，所以环才这么亮。'],
                ['卡西尼缝', '明亮内环与外环之间一道宽阔的暗缝——并非空无一物，只是稀疏，被土卫一的共振扫过。'],
                ['牧羊小卫星', '嵌在环边缘的一颗小冰卫星——像这样的卫星用引力把环颗粒驱赶成锋利的环带。'],
                ['螺旋桨涟漪', '环面上一处 S 形的扰动——一颗小到清不开整道缝的隐藏小卫星，仍在搅动周围的冰。卡西尼拍过数百个。'],
                ['并肩的卡西尼号', 'NASA 真实的探测器模型与你并肩飞行——那台在这同一片场景里度过十三年的探测器。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次巡航航道的边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['环面远眺', '从高处看，环的结构一览无余——宽阔明亮的 B 环、黑暗的卡西尼缝、在夜色中微微发光的暗淡 C 环。', '抵达方式', '环面远景'],
                ['一块环冰', '这块翻滚的巨砾几乎是纯净的水冰——在查看器中旋转它。光环正是由数十亿个这样的冰块组成的。', '环颗粒', '环冰'],
                ['大裂缝', '在卡西尼缝内部——这条"空空"的缝隙其实并不空，只是明亮环带之间更稀薄的冰雾。', '环结构', '卡西尼缝'],
                ['牧羊小卫星', '嵌在环边缘的一颗小卫星——它的引力把漂移的颗粒驱赶成锋利的环带，并清扫出缝隙。', '卫星', '牧羊小卫星'],
                ['螺旋桨', '环面上一处 S 形涟漪——一颗小到无法清出完整缝隙的小卫星留下的签名，仍在搅动周围的冰。', '动力学', '螺旋桨扰动']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR CRUISE ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed ring section or an identified ring particle.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Match the ring layer before recording.', approach: 'Drift closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Drift to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures in the rings. H hides or restores the route card.',
            teasers: ['Take in the whole sheet from above — bands, gaps, and the giant beyond.', 'A tumbling ring boulder drifts near the bright band — approach it and turn it in the specimen viewer.', 'Cruise into the dark gap itself — the Cassini division from inside.', 'Ride the ring edge east to where a small moon herds the particles.', 'Sink low over the outer band to find a swirl stirred by a hidden moonlet.'],
            details: ['Saturn’s main rings span about 280,000 km yet are only tens of metres thick — proportionally thinner than a sheet of paper. From here you can see the bright B ring, the Cassini division, and the dim C ring toward the planet. The band layout is artistic, informed by real ring structure.', 'Ring particles are almost pure water ice — cleaner than the fresh snow on Earth — which is why the rings outshine the planet’s own clouds. A real ring boulder might be metres across; this one is scaled so you can hold it.', 'The Cassini division looks empty from Earth but is really a region of thinner, dustier ice. Voyager and Cassini both threaded gaps like it — the spacecraft even flew through the ring plane itself.', 'Shepherd moons like Prometheus and Pandora gravitationally herd ring particles, keeping edges sharp and gaps clear. This moonlet is an artistic stand-in — real embedded moonlets are usually only kilometres across.', 'Cassini’s cameras found hundreds of “propellers” — S-shaped disturbances a few kilometres long, carved by moonlets too small to open a full gap. This swirl honours them.']
        },
        zh: {
            fieldRoute: '你的巡航路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转冰块', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实环带测绘，也不是已鉴定的环颗粒样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点漂移', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请对齐这一环层再记录发现。', approach: '请漂近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，漂近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非环中的真实结构。H 可隐藏或恢复路线卡片。',
            teasers: ['从高处俯瞰整张环面——环带、缝隙，以及远处的巨行星。', '亮环带附近漂着一块翻滚的环冰巨砾——靠近它，在查看器中转动观察。', '直接驶进黑暗的缝隙——从内部看卡西尼缝。', '沿环边缘向东，找到那颗驱赶颗粒的小卫星。', '沉到外环带上方低空，寻找一颗隐藏小卫星搅出的涟漪。'],
            details: ['土星主环宽约 28 万公里，厚度却只有几十米——按比例算比一张纸还薄。从这里能看到明亮的 B 环、卡西尼缝，以及朝向行星方向的暗淡 C 环。环带布局是艺术再现，参考了真实环结构。', '环颗粒几乎是纯净的水冰——比地球上的新雪还干净——这就是环比行星本体云层更亮的原因。真实的环冰巨砾可能有几米宽；这一块被放大了以便观察。', '卡西尼缝从地球上看是空的，其实只是一片更稀薄、更浑浊的冰区。旅行者号和卡西尼号都穿越过这样的缝隙——探测器甚至直接穿过环平面本身。', '像普罗米修斯和潘多拉这样的牧羊卫星用引力驱赶环颗粒，保持边缘锋利、缝隙通畅。这颗小卫星是艺术替身——真实的内嵌小卫星通常只有几公里宽。', '卡西尼号的相机发现了数百个"螺旋桨"——几公里长的 S 形扰动，由小到无法清出整条缝隙的小卫星雕刻而成。这处涟漪正是致敬它们。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, sunlight, walker, probe, cassini, animationId = null;
    let motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = 0.55, pitch = -0.04, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = SaturnRings.GRAVITY, audio = null, soundEnabled = true;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set();
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null;
    const skyBodies = [], skyRay = new THREE.Raycaster(), skyPointer = new THREE.Vector2();
    let skyPivot = null, saturnMesh = null, starField = null, ambientLight = null, thrustActive = false, iceField = [], ringSheet = null, puffGroup = null, composer = null, fxaaPass = null, cinePass = null, sunMesh = null, shaftPass = null, moonlet = null, propeller = null, pingTimer = 2;
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
    const rand = SaturnRings.random(4451);
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
        $('gravity-mode').textContent = t(gravity === SaturnRings.GRAVITY ? 'mercuryTag' : 'earthTag');
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
        if (error) console.error('Saturn expedition:', error);
    }
    // Ring sheet texture: concentric annuli matching SaturnRings.ringDensity,
    // streaked tangentially so the sheet reads as countless fine ringlets.
    function makeRingTexture() {
        const size = profile.texture;
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const image = ctx.createImageData(size, size);
        const px = image.data;
        const zSpan = 6000; // texture v axis covers the full 6 km sheet
        const cx = SaturnRings.RING_CX, cz = SaturnRings.RING_CZ;
        for (let y = 0; y < size; y++) {
            const wz = (y / size - 0.5) * zSpan;
            for (let x = 0; x < size; x++) {
                const wx = (x / size - 0.5) * zSpan;
                const dens = SaturnRings.ringDensity(wx, wz);
                // fine ringlets: banded noise streaked along the arc direction
                const ang = Math.atan2(wz - cz, wx - cx);
                const rad = Math.hypot(wx - cx, wz - cz);
                const ripple = SaturnRings.noise(ang * 60 + rad * 0.002, rad * 0.12) * 0.5 + SaturnRings.noise(ang * 24, rad * 0.6) * 0.5;
                const flecks = SaturnRings.noise(ang * 160, rad * 0.25) > 0.82 ? 0.3 : 0;
                let a = dens * (0.55 + ripple * 0.75 + flecks) + 0.04;
                a = Math.max(0, Math.min(1, a));
                const i = (y * size + x) * 4;
                const warm = SaturnRings.noise(wx * 0.02, wz * 0.02);
                px[i] = 240; px[i + 1] = 238 - warm * 12; px[i + 2] = 225 - warm * 20; px[i + 3] = Math.round(a * 250);
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
            const f = 0.75 + SaturnRings.noise(x * 2.4 + seed, y * 2.4 + z * 1.7) * 0.5;
            p.setXYZ(i, x * f, y * f * 0.85, z * f);
        }
        geometry.computeVertexNormals();
        return geometry;
    }
    // Ice chunks live near the ring plane; as the probe cruises, chunks that fall
    // behind are recycled ahead so the field feels endless.
    function buildIceField() {
        const material = new THREE.MeshStandardMaterial({
            color: 0xdfe9f2, roughness: 0.55, metalness: 0.05, flatShading: true,
            emissive: 0x1a2230, emissiveIntensity: 0.55
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
                const dens = SaturnRings.ringDensity(x, z);
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
        // The specimen boulder for the discovery viewer.
        featuredRock = new THREE.Mesh(iceGeometry(77), material.clone());
        featuredRock.scale.setScalar(1.9);
        featuredRock.position.set(42, 8, 196);
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
            size: 0.16, map: dotTexture(), transparent: true, opacity: 0.75,
            depthWrite: false, blending: THREE.AdditiveBlending, color: 0xd8e6f8, sizeAttenuation: true
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
            const f = 0.72 + SaturnRings.noise(x * 1.9 + 5, y * 1.9 + z * 1.4) * 0.56;
            p.setXYZ(i, x * f, y * f * 0.82, z * f);
        }
        geo.computeVertexNormals();
        moonlet = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
            color: 0xc4cdd8, roughness: 0.95, metalness: 0.02, flatShading: true
        }));
        moonlet.scale.setScalar(7);
        moonlet.position.set(-140, 10, 300);
        moonlet.rotation.set(0.4, 0.9, 0.2);
        moonlet.castShadow = true;
        scene.add(moonlet);
    }
    // A propeller swirl — bright S-disturbance sprite lying in the ring sheet.
    function buildPropeller() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.translate(128, 128);
        for (let i = 0; i < 240; i++) {
            const t = i / 240;
            const angle = t * Math.PI * 2.6;
            const r = 8 + t * 105;
            const wobble = Math.sin(t * Math.PI * 2) * 18;
            ctx.fillStyle = `rgba(230,240,255,${(1 - t) * 0.4 + 0.08})`;
            ctx.beginPath();
            ctx.ellipse(Math.cos(angle) * r + wobble, Math.sin(angle) * r * 0.55, 8 - t * 4, 3.5, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        const tex = new THREE.CanvasTexture(canvas);
        propeller = new THREE.Mesh(
            new THREE.CircleGeometry(46, 40),
            new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })
        );
        propeller.rotation.x = -Math.PI / 2;
        propeller.position.set(150, 2.2, -180);
        propeller.renderOrder = 2;
        scene.add(propeller);
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
        // The Sun — a fierce spark ten times farther than Earth's.
        // Placed behind the departure view so Saturn's camera-facing face is lit.
        const sunDir = new THREE.Vector3(0.62, 0.2, 0.76).normalize();
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
        // Saturn itself — a banded giant half-submerged in the ring plane,
        // its equator on y = 0 so our sheet reads as the same ring system.
        const saturnPos = new THREE.Vector3(SaturnRings.RING_CX, 0, SaturnRings.RING_CZ);
        const saturnRadius = 1050;
        // Basic material: at this distance the globe just needs its true texture brightness.
        saturnMesh = new THREE.Mesh(
            new THREE.SphereGeometry(saturnRadius, 64, 48),
            new THREE.MeshBasicMaterial({ color: 0xb5a888, fog: false })
        );
        saturnMesh.position.copy(saturnPos);
        saturnMesh.rotation.z = 0.05;
        scene.add(saturnMesh);
        const saturnProxy = new THREE.Mesh(new THREE.SphereGeometry(saturnRadius * 1.02, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        saturnProxy.position.copy(saturnPos);
        saturnProxy.userData.body = 'venus';
        scene.add(saturnProxy);
        skyBodies.push(saturnProxy);
        // Saturn's far ring disc — real alpha texture, lying in the same plane as our sheet.
        const innerR = saturnRadius * 1.24, outerR = saturnRadius * 2.4;
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
        const ringTex = new THREE.TextureLoader().load('textures/2k_saturn_ring_alpha.png', tex => { tex.encoding = THREE.sRGBEncoding; }, undefined, () => notify('textureFailed'));
        const ringMat = new THREE.MeshBasicMaterial({ map: ringTex, alphaMap: ringTex, transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false });
        const saturnRing = new THREE.Mesh(ringGeo, ringMat);
        saturnRing.rotation.x = Math.PI / 2;
        saturnRing.position.copy(saturnPos);
        saturnRing.renderOrder = 1;
        scene.add(saturnRing);
        return new Promise(resolve => {
            new THREE.TextureLoader().load('textures/2k_saturn.jpg', tex => {
                tex.encoding = THREE.sRGBEncoding;
                tex.wrapS = THREE.MirroredRepeatWrapping;
                saturnMesh.material.map = tex;
                saturnMesh.material.color.set(0xcfc2a2);
                saturnMesh.material.needsUpdate = true;
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
    // Cassini flies alongside as a wingman — held at a camera-relative offset each frame.
    async function buildCassini() {
        const model = await loadSceneModel('models/cassini.glb');
        if (!model) return;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (!size.y || !isFinite(size.y)) return;
        model.scale.setScalar(11 / Math.max(size.x, size.y, size.z));
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -center.y, -center.z);
        model.traverse(o => { if (o.isMesh) o.castShadow = false; });
        cassini = new THREE.Group();
        cassini.add(model);
        cassini.rotation.set(0.2, 0.5, 0.1);
        cassini.position.set(position.x + 26, 108, position.z - 30);
        scene.add(cassini);
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
        $('gravity-button').textContent = t(gravity === SaturnRings.GRAVITY ? 'gravityCompare' : 'gravityMercury');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== SaturnRings.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === SaturnRings.GRAVITY ? SaturnRings.EARTH_GRAVITY : SaturnRings.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === SaturnRings.GRAVITY ? 'mercuryTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === SaturnRings.GRAVITY ? 'gravityMercuryTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-saturn-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
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
        const focusNames = { sun: 'Sun', earth: 'Earth', venus: 'Saturn' };
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Saturn'}`;
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
        walker = SaturnRings.createWalker(position);
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
            SaturnRings.updateWalker(walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: burn, down: sink, pull: gravity / SaturnRings.GRAVITY }, dt);
            // The ring sheet gently tides the probe back toward the plane.
            walker.vy -= Math.sign(walker.y) * Math.min(Math.abs(walker.y) / 60, 1) * 0.35 * (gravity / SaturnRings.GRAVITY) * dt;
            position.x = walker.x; position.z = walker.z;
            if (walker.thrusting && !thrustActive) { thrustActive = true; if (audio) audio.jump(); }
            if (!walker.thrusting) thrustActive = false;
            if ((walker.thrusting || sink) && Math.random() < 0.4) spawnDust(position.x + (rand() - 0.5), walker.y - 1.2, position.z + (rand() - 0.5), 2, 0.25);
            if (audio) audio.setDescent(walker.speed * 0.4 + Math.abs(walker.vy));
            // Ice pings when skimming a dense band
            pingTimer -= dt;
            if (pingTimer <= 0) {
                pingTimer = 0.4 + rand() * 2;
                const dens = SaturnRings.ringDensity(position.x, position.z);
                if (audio && Math.abs(walker.y) < 14 && rand() < dens) audio.icePing();
            }
            if (Math.hypot(position.x, position.z) > SaturnRings.DRIFT_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
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
            // Cassini holds formation off the port bow.
            if (cassini) {
                const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
                const rx = Math.cos(yaw), rz = -Math.sin(yaw);
                const tx = position.x + fx * 34 + rx * -14;
                const tz = position.z + fz * 34 + rz * -14;
                const ty = walker.y - 7 + Math.sin(now * 0.0004) * 1.5;
                cassini.position.x += (tx - cassini.position.x) * Math.min(1, dt * 0.8);
                cassini.position.y += (ty - cassini.position.y) * Math.min(1, dt * 0.8);
                cassini.position.z += (tz - cassini.position.z) * Math.min(1, dt * 0.8);
                cassini.rotation.y = yaw + 0.5;
                cassini.rotation.z = 0.08 + Math.sin(now * 0.0003) * 0.03;
            }
            if (puffGroup) {
                for (const puff of puffGroup.children) {
                    puff.position.x += Math.sin(now * 0.00008 + puff.userData.phase) * dt * 1.4;
                }
            }
            if (moonlet) { moonlet.rotation.y += dt * 0.12; moonlet.rotation.x += dt * 0.03; }
            if (propeller) propeller.rotation.z += dt * 0.05;
            if (starField) starField.rotation.y += dt * 0.0015;
            if (saturnMesh) saturnMesh.rotation.y += dt * 0.004;
            if (cinePass) cinePass.material.uniforms.uTime.value = now * 0.001;
            if (featuredRock) { featuredRock.rotation.y += dt * 0.5; featuredRock.rotation.x += dt * 0.18; }
        }
        if (Math.hypot(sunlight.target.position.x - position.x, sunlight.target.position.z - position.z) > 20) {
            sunlight.target.position.set(position.x, 0, position.z);
            sunlight.position.set(position.x + 260, 84, position.z + 320);
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
            if (!window.THREE || !window.SaturnRings) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x030408);
            scene.fog = new THREE.FogExp2(0x05060a, 0.00045);
            camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.08, 9000);
            ambientLight = new THREE.AmbientLight(0x8899bb, 0.9);
            scene.add(ambientLight);
            scene.add(new THREE.HemisphereLight(0x9aa8c8, 0x0a0c14, 0.5));
            sunlight = new THREE.DirectionalLight(0xfff2dc, 2.4);
            sunlight.position.set(260, 84, 320);
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
            buildPropeller();
            buildProbe();
            await buildSky();
            buildCassini();
            walker = SaturnRings.createWalker(position);
            walker.y = stations[0].y !== undefined ? stations[0].y : 120;
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface: null, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.SaturnExpedition, terrain: SaturnRings, strings: discoveryStrings });
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
                link.href = url; link.download = `mzu-saturn-rings-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Saturn&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.SaturnAudio ? window.SaturnAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-saturn-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
