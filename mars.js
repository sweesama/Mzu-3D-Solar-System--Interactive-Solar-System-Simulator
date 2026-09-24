(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.MarsExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
    const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'MARS', surfaceMode: 'SURFACE EXPLORATION',
            chapter: 'EXPEDITION 002 / THE RED PLAIN', title: 'Walk on\nMars.', intro: 'Walk an imagined Martian plain, jump in gentler gravity, and read layered rock, wind-blown dunes, and a butterscotch sky.', begin: 'Step onto Mars', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Mars science.', gravity: 'GRAVITY', atmosphere: 'ATMOSPHERE', vacuum: 'Thin CO₂', distance: 'FROM ARRIVAL',
            walkingHint: 'W A S D to walk · drag to look · Space to jump · G gravity · M sound', touchHint: 'Arrows to walk · drag to look · tap Jump to leap', station0: 'Layered mesa', station1: 'Boulder field', station2: 'Dune edge',
            astronaut: 'ASTRONAUT', jump: 'Jump', grounded: 'On the surface', airborne: 'Airborne', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable head motion for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SCANNED LANDING SITE',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Preparing the Martian landscape…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'Take the long way home.',
            guideIntro: 'This is a small, freely explorable Martian plain, not a whole-planet simulation. The five observation points are different views of the same place; two of them can only be reached on foot.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityMars: 'Back to Martian gravity · G', gravityHint: 'Same takeoff push, different fall. Mars gravity is 3.71 m/s² — lighter than Earth, heavier than the Moon.', soundOn: 'Suit sounds: On', soundOff: 'Suit sounds: Off', soundHint: 'Fan hum and footfalls inside the suit; outside, deep silence broken by an occasional faint gust. M toggles.', gravityMarsTag: 'Martian gravity — 3.71 m/s².', gravityEarth: 'Earth gravity — 9.8 m/s². Same push, far less height.', marsTag: 'MARS', earthTag: 'EARTH',
            controlsText: 'You are exploring on foot as an astronaut. Walk with W A S D or the arrow keys; Shift gives a brisker pace. Press Space to jump, then wait to land before jumping again. Momentum carries you forward in the air. Drag to look, including down at your boots. Touchscreens have direction and Jump buttons. G compares Earth gravity; M toggles suit sounds. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'The butterscotch sky comes from fine dust scattering sunlight; blue light collects around the Sun, opposite to sunsets on Earth. Layered rock, basalt boulders, and wind-shaped dunes are inspired by rover imagery. Terrain and observation points are procedural art, not survey data.',
            soundText: "Mars has a real atmosphere — about one percent of Earth's — but it carries sound poorly: recordings by NASA's Perseverance rover show that a deep silence prevails, broken by occasional faint, muffled gusts. High pitches barely travel in carbon dioxide air. Most of what you hear comes from inside the suit: a quiet life-support hum, footfalls conducted through the body, and a radio chime for each discovery. Jumps use a constant Martian gravity of 3.71 m/s²; press G to feel Earth's 9.8 m/s² with the same takeoff push. Pace, takeoff strength, and camera motion are comfort settings, not a full spacesuit simulation.",
            assetText: 'No external imagery on this page — terrain, rock textures, and the sky are generated locally in your browser.',
            skyEyebrow: 'IN THE MARTIAN SKY', phobosName: 'Phobos', deimosName: 'Deimos', sunName: 'The Sun', earthName: 'Earth',
            phobosText: 'The larger of Mars’s two moons — an irregular, asteroid-like body about 22 km across. It orbits so low that it rises in the west and sets in the east twice each Martian day. Its size and position in this sky are artistic, not an accurate ephemeris.',
            deimosText: 'Mars’s smaller, more distant moon — only about 12 km across, appearing as a star-like point in the real Martian sky. Its placement here is artistic, not an accurate ephemeris.',
            sunText: 'Seen from Mars, the Sun looks about two-thirds the size it does from Earth, wearing a pale bluish halo — Martian dust scatters blue light forward toward the Sun. This is an artistic rendering, not an accurate ephemeris.',
            earthText: 'From Mars, Earth is a bright blue-white “evening star” that never strays far from the Sun — rovers and orbiters have photographed it. Its placement in this sky is artistic, not an accurate ephemeris.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Click the Sun, Earth, or a moon in the sky to learn about it — you can then visit it in the Solar System view.',
            featuresTitle: 'What you are seeing', features: [
                ['Dust-devil tracks', 'Dark wandering streaks where whirlwinds vacuumed the bright dust — one is still swirling out on the plain right now.'],
                ['Rover tracks', 'Twin grooves near the arrival point — a nod to the tracks Curiosity and Perseverance leave behind.'],
                ['Dust-capped rocks', 'Boulders wear a coat of red dust on top; the sides stay dark basalt.'],
                ['Ventifacts', 'Elongated rocks aligned to the prevailing wind, carved grain by grain.'],
                ['Butterscotch sky & cirrus', 'Suspended dust tints the sky; thin ice clouds drift high overhead.'],
                ['Phobos & Deimos', 'Two tiny moons cross the sky — click one and the camera turns to it.'],
                ['Sun & Earth', 'A shrunken Sun with a faint blue halo, and Earth as a blue evening star — both clickable.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this expedition. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['Layers of deep time', 'The mesa wall ahead is banded like a sedimentary stack. On the real Mars, such layers record lakes, floods, and ash over billions of years.', 'LANDSCAPE', 'Layered mesa'],
                ['Basalt under the dust', 'This dark boulder represents volcanic basalt — the rock beneath most Martian dust. Rotate it in the specimen viewer to inspect its texture.', 'SURFACE', 'Rock & regolith'],
                ['The wind still works here', 'These dunes are shaped by real physics: thin air can still move sand. Martian dunes migrate a little every year.', 'ATMOSPHERE', 'Active dunes'],
                ['A quiet weather mast', 'Orbiters and landers have measured Martian wind, temperature, and pressure for decades. This mast is an artistic prop honouring instruments like those on Viking and InSight.', 'INSTRUMENT', 'Weather mast'],
                ['A softened crater', 'Unlike the Moon, Mars craters erode — wind and dust soften their rims over time. Look into the bowl and compare it with lunar craters.', 'LANDSCAPE', 'Degraded crater']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '火星', surfaceMode: '火星表面探索', chapter: '探索 002 / 红色平原', title: '漫步火星。',
            intro: '走进一片艺术重建的火星平原，在较轻的重力中跳跃，观察层状岩石、风吹沙丘和奶油色的天空。', begin: '踏上火星', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受火星科学启发的虚构地点。',
            gravity: '火星重力', atmosphere: '大气环境', vacuum: '稀薄二氧化碳', distance: '距抵达点', walkingHint: 'W A S D 行走 · 拖动转头 · 空格跳跃 · G 重力 · M 声音', touchHint: '方向按钮行走 · 拖动画面转头 · 点击跳跃',
            astronaut: '宇航员视角', jump: '跳跃', grounded: '双脚着地', airborne: '腾空中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭头部起伏可获得更平稳的视角。',
            station0: '层状平顶山', station1: '岩石原野', station2: '沙丘边缘', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实着陆点扫描', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在准备火星风景…', fieldGuide: '火星探索指南', guideTitle: '慢一点，看看远方。',
            guideIntro: '这是一片可以自由漫游的火星平原，而非完整火星。五个观察点都位于同一个场景，其中两个只能徒步走到。', controlsTitle: '如何探索',
            gravityCompare: '对比地球重力 · G', gravityMars: '恢复火星重力 · G', gravityHint: '同样的起跳力度，不同的下落感受。火星重力 3.71 m/s²——比地球轻，比月球重。', soundOn: '宇航服声音：开', soundOff: '宇航服声音：关', soundHint: '宇航服内的风扇低鸣与脚步声；外部是深邃的寂静，偶尔掠过一阵微弱而沉闷的风。M 切换。', gravityMarsTag: '火星重力 — 3.71 m/s²。', gravityEarth: '地球重力 — 9.8 m/s²。同样的起跳，高度骤减。', marsTag: '火星', earthTag: '地球',
            controlsText: '你是一位徒步探索的宇航员。W A S D 或方向键行走，Shift 快步，空格跳跃，落地后才能再次起跳。腾空时保留起跳时的水平惯性，不能像飞行器一样转向。拖动画面观察，也可以低头看看自己的靴子。触屏有方向按钮和跳跃键。G 对比地球重力，M 开关宇航服声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '奶油色的天空来自细小尘埃散射阳光；蓝色聚集在太阳周围，与地球上的日落恰好相反。层状岩石、玄武岩巨石和风成沙丘都受火星探测车影像启发。地形与观察点由程序创作，并非实测数据。',
            soundText: '火星有真实的大气——约为地球的百分之一——但传声能力很差：NASA 毅力号的录音显示，火星上绝大部分时间是深邃的寂静，偶尔掠过微弱而沉闷的阵风，高音在二氧化碳空气中几乎传不远。你听到最多的仍来自宇航服内部：维生风扇的低鸣、经身体传导的脚步，以及记录发现时的无线电提示音。跳跃使用火星重力 3.71 m/s²；按 G 可用相同的起跳力度感受地球 9.8 m/s²。步速、起跳力度和镜头起伏经过舒适性设计，不是完整的宇航服物理模拟。',
            assetText: '本页不使用外部影像——地形、岩石纹理和天空均由浏览器本地生成。',
            skyEyebrow: '火星天空中', phobosName: '火卫一（福博斯）', deimosName: '火卫二（德莫斯）', sunName: '太阳', earthName: '地球',
            phobosText: '火星较大的卫星——一颗直径约 22 公里的不规则小天体，轨道极低，在火星上看它每天从西边升起、东边落下两次。它在天空中的大小和位置经过艺术处理，并非精确星历。',
            deimosText: '火星较小、较远的卫星——直径约 12 公里，在真实的火星天空中只是一个星点般的亮点。它的位置经过艺术处理，并非精确星历。',
            sunText: '从火星看，太阳只有地球上看到的约三分之二大，周围还带着一圈淡蓝色光晕——火星尘埃会把蓝光向前散射。本场景为艺术呈现，并非精确星历。',
            earthText: '从火星看，地球是一颗靠近太阳的蓝白色“昏星”——探测车和轨道器都拍到过它。它在天空中的位置经过艺术处理，并非精确星历。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '点击天空中的太阳、地球或卫星可以了解它，然后还能跳到太阳系视角。',
            featuresTitle: '你眼前的景观', features: [
                ['尘卷风轨迹', '深色的蜿蜒条纹——旋风卷走表层亮尘留下的痕迹，此刻平原上就有一个在转。'],
                ['火星车辙印', '抵达点附近的双轨凹槽——致敬好奇号和毅力号留下的轨迹。'],
                ['戴尘帽的岩石', '巨石顶部盖着一层红色尘土，侧面仍是深色玄武岩。'],
                ['风蚀岩', '沿盛行风向拉长的岩石——被风沙一粒粒磨出来的形状。'],
                ['奶油色天空与卷云', '悬浮的尘埃把天空染成奶油色，高空还飘着稀薄的冰晶云。'],
                ['火卫一与火卫二', '两颗小小的卫星划过天空——点击它，镜头会自动转过去。'],
                ['太阳与地球', '缩小了一圈、带着淡蓝光晕的太阳，和一颗蓝色的"昏星"地球——都可以点击。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次探索区域边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['沉积的时光', '眼前的平顶山壁像一层层堆叠的沉积物。在真实的火星上，这样的岩层记录着湖泊、洪水与火山灰的数十亿年历史。', '地貌类型', '层状平顶山'],
                ['尘埃下的玄武岩', '这块深色巨石代表火山玄武岩——火星尘埃之下最常见的岩石。可以在查看器中旋转它，观察表面质感。', '地表组成', '岩石与风化层'],
                ['风仍在工作', '这些沙丘由真实的物理过程塑造：稀薄的空气依然能搬运沙粒。火星上的沙丘每年都在缓慢移动。', '大气作用', '活动沙丘'],
                ['安静的气象站', '轨道器和着陆器数十年来一直在测量火星的风、温度和气压。这座气象桅杆是致敬海盗号、洞察号等仪器的艺术道具。', '仪器类型', '气象桅杆'],
                ['被磨平的环形山', '与月球不同，火星环形山会被侵蚀——风和尘埃随时间磨平坑缘。看看这个坑的坑底，和月球的环形山比较一下。', '地貌类型', '退化环形山']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR FIELD ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed landing site or an identified Martian sample.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Land before recording a discovery.', approach: 'Walk closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Walk up to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures on Mars. H hides or restores the route card.',
            teasers: ['Walk west to the layered mesa and look up at its banded wall.', 'Approach the dark boulder, then turn it around in the specimen viewer.', 'Enter the dune field and look for ripples shaped by Martian wind.', 'Walk south-east from arrival to find a small weather mast standing on the plain.', 'Hike east to the rim of a worn crater and look into its bowl.'],
            details: ['Sedimentary layers like these form when water, wind, or ash deposits material over long periods. On Mars they record environments that changed over billions of years. This mesa is an artistic example, not a reconstruction of a named formation.', 'Beneath the red dust, much of the Martian surface is dark basalt from ancient volcanism. Rovers have studied such rocks up close. Shape alone cannot tell us this model’s composition or age. Rotate the representative rock to examine its surface.', 'Martian dunes migrate measurably — orbiters have photographed them shifting over years. Thin air still moves sand, just slowly and differently than on Earth. This field is an artistic arrangement.', 'Viking landers measured Martian weather starting in 1976; InSight tracked wind, pressure, and temperature until 2022. This mast honours those instruments; its readings are imagined, not real data.', 'Unlike lunar craters, Martian craters erode under wind and dust — rims soften and bowls fill over millions of years. This worn crater is a modest artistic echo of that process.']
        },
        zh: {
            fieldRoute: '你的探索路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转岩石', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实着陆点测绘，也不是已鉴定的火星样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点前进', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请先落地，再记录发现。', approach: '请走近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维岩石查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，走近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非火星表面的真实设施。H 可隐藏或恢复路线卡片。',
            teasers: ['向西走到层状平顶山，抬头看看带状岩壁。', '走近那块深色巨石，在查看器中转动并观察它。', '走进沙丘区，寻找火星风吹出的波纹。', '从抵达点向东南走，找一座立在平原上的小型气象桅杆。', '徒步到东侧一座风化环形山的坑缘，俯视它的坑底。'],
            details: ['这样的沉积岩层是水、风或火山灰在漫长岁月中逐层堆积形成的。在火星上，它们记录着数十亿年间不断变迁的环境。这座平顶山是艺术示例，并不对应某个真实命名的地层。', '红色尘埃之下，火星表面大多是远古火山活动形成的深色玄武岩。探测车曾近距离研究过这类岩石。仅凭外形无法判断这个模型的成分或年龄。可以旋转这块代表性岩石，仔细观察表面。', '火星沙丘确实在移动——轨道器拍到过它们逐年变化。稀薄的空气依然能搬运沙粒，只是比地球慢。这片沙丘是艺术化布置。', '1976 年起，海盗号着陆器开始测量火星气象；洞察号直到 2022 年都在记录风、气压和温度。这座桅杆致敬那些仪器，读数是虚构的。', '与月球环形山不同，火星环形山会在风和尘埃作用下被侵蚀——坑缘随数百万年逐渐软化、坑底被填平。这座风化环形山是对这一过程的朴素艺术再现。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false;
    let renderer, scene, camera, surface, sunlight, walker, astronaut, animationId = null;
    let jumpRequested = false, motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = -0.12, pitch = -0.06, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = MarsTerrain.GRAVITY, audio = null, soundEnabled = true;
    let footprints = null, printCursor = 0, lastPrintMark = 0, dustDevil = null;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set(), obstacles = [];
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null, composer = null, fxaaPass = null, cinePass = null;
    const skyBodies = [], skyRay = new THREE.Raycaster(), skyPointer = new THREE.Vector2();
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
        $('gravity-mode').textContent = t(gravity === MarsTerrain.GRAVITY ? 'marsTag' : 'earthTag');
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
        const rand = MarsTerrain.random(817);
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
                const value = Math.max(55, Math.min(200, 155 + grain + cloud + ripple + (rand() > 0.999 ? -35 : 0)));
                const i = (z * size + x) * 4;
                pixels[i] = value; pixels[i + 1] = value * 0.76; pixels[i + 2] = value * 0.56; pixels[i + 3] = 255;
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
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xb08a72).convertSRGBToLinear(), roughness: 1, metalness: 0, vertexColors: true });
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
        surface = MarsTerrain.createSurface(960, profile.segments);
        const geometry = new THREE.PlaneGeometry(surface.size, surface.size, surface.segments, surface.segments);
        geometry.rotateX(-Math.PI / 2);
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        for (let i = 0; i < positions.count; i++) {
            positions.setY(i, surface.heights[i]);
            const n = MarsTerrain.noise(positions.getX(i) * 0.085, positions.getZ(i) * 0.085);
            const patch = MarsTerrain.noise(positions.getX(i) * 0.011 + 7, positions.getZ(i) * 0.011 - 3);
            const streak = MarsTerrain.noise(positions.getX(i) * 0.03 - positions.getZ(i) * 0.05 + 11, positions.getZ(i) * 0.008);
            const px = positions.getX(i), pz = positions.getZ(i);
            const wander = MarsTerrain.noise(px * 0.006 + 21, pz * 0.006 - 8) * 7;
            const trackA = Math.abs(Math.sin(px * 0.017 + pz * 0.008 + wander));
            const trackB = Math.abs(Math.sin(px * -0.011 + pz * 0.023 + MarsTerrain.noise(px * 0.005 - 14, pz * 0.005 + 33) * 5));
            const devil = (trackA < 0.055 || trackB < 0.045) ? 0.84 : 1;
            let roverShade = 1;
            if (px > -50 && px < 58 && pz > -20 && pz < 45) {
                const lane = 14 + Math.sin(px * 0.045) * 5 + Math.sin(px * 0.012 + 2.2) * 4;
                const edge = THREE.MathUtils.smoothstep(px, -50, -36) * (1 - THREE.MathUtils.smoothstep(px, 42, 58));
                const wheel = Math.abs(Math.abs(pz - lane) - 0.55);
                if (wheel < 0.1) roverShade = 1 - edge * 0.24;
                else if (Math.abs(pz - lane) < 0.55) roverShade = 1 - edge * 0.07;
            }
            const shade = (0.73 + n * 0.17 + patch * 0.08 + Math.max(0, streak - 0.35) * 0.1) * devil * roverShade;
            colors.set([shade, shade * 0.9, shade * 0.78], i * 3);
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
            const n = MarsTerrain.noise(x * 0.003 + 3, z * 0.003 - 1);
            const ridge = Math.exp(-Math.pow((r - 1100) / 510, 2));
            const broken = 0.55 + 0.35 * MarsTerrain.noise(x * 0.008, z * 0.008) + 0.1 * MarsTerrain.noise(x * 0.026, z * 0.026);
            const fractured = (Math.abs(MarsTerrain.noise(x * 0.012 + 31, z * 0.012) * 2 - 1) - 0.4) * 12 + (MarsTerrain.noise(x * 0.022, z * 0.022 + 19) - 0.5) * 3;
            const h = MarsTerrain.height(x, z) - 0.6 + blend * (ridge * ((45 + n * 170) * broken + fractured) + n * 28);
            farPositions.setY(i, h);
            const color = 0.67 + n * 0.19;
            farColors.set([color, color * 0.8, color * 0.6], i * 3);
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
    function rockGeometry(seed, detail) {
        const geometry = new THREE.IcosahedronGeometry(1, detail);
        const p = geometry.attributes.position;
        const c = new Float32Array(p.count * 3);
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const n = MarsTerrain.noise(x * 3 + seed, z * 3 + y * 2);
            const f = 0.86 + n * 0.2;
            p.setXYZ(i, x * f, y * (0.72 + n * 0.16), z * f);
            const shade = 0.46 + MarsTerrain.noise(x * 8 + seed, y * 8 + z * 2) * 0.2;
            const dustTop = Math.max(0, y) * 0.11;
            c.set([shade + dustTop, (shade + dustTop) * 0.8, (shade + dustTop) * 0.64], i * 3);
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(c, 3));
        geometry.computeVertexNormals();
        const normals = geometry.attributes.normal;
        const normal = new THREE.Vector3(), radial = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
            normal.fromBufferAttribute(normals, i);
            radial.set(p.getX(i), p.getY(i) * 1.7, p.getZ(i)).normalize();
            normal.lerp(radial, 0.72).normalize();
            normals.setXYZ(i, normal.x, normal.y, normal.z);
        }
        return geometry;
    }
    function buildRocks(texture) {
        const rand = MarsTerrain.random(19690720);
        const material = new THREE.MeshStandardMaterial({ map: texture, bumpMap: texture, bumpScale: 0.07, roughness: 0.98, vertexColors: true });
        const transform = new THREE.Object3D();
        const color = new THREE.Color();
        for (let group = 0; group < 4; group++) {
            const count = Math.floor(profile.rocks / 4);
            const rocks = new THREE.InstancedMesh(rockGeometry(group * 19 + 8, 1), material, count);
            for (let i = 0; i < count; i++) {
                let x = (rand() - 0.5) * 760, z = (rand() - 0.5) * 760;
                const size = 0.2 + Math.pow(rand(), 3.7) * 2.7;
                while (stations.some(s => Math.hypot(x - s.x, z - s.z) < size + 4) || expedition.isOnRoute({ x, z }, size * 1.5 + 0.5)) {
                    x = (rand() - 0.5) * 760; z = (rand() - 0.5) * 760;
                }
                const ventifact = size > 0.35 && rand() < 0.4;
                transform.position.set(x, MarsTerrain.sampleSurface(surface, x, z) + size * 0.22, z);
                transform.scale.set(size * (0.8 + rand() * 0.7) * (ventifact ? 1.5 + rand() * 0.4 : 1), size * (ventifact ? 0.78 : 1), size * (0.8 + rand() * 0.5));
                transform.rotation.set((rand() - 0.5) * 0.4, ventifact ? -0.9 + (rand() - 0.5) * 0.4 : rand() * Math.PI * 2, (rand() - 0.5) * 0.4);
                transform.updateMatrix();
                rocks.setMatrixAt(i, transform.matrix);
                rocks.setColorAt(i, color.setScalar(0.5 + rand() * 0.4));
                if (size > 0.5) obstacles.push({ x, z, radius: size * 1.5 });
            }
            rocks.castShadow = quality !== 'low';
            rocks.receiveShadow = true;
            rocks.frustumCulled = false;
            scene.add(rocks);
        }
        const heroes = [[-7, 68, 1.1], [12, 48, 2.2], [21, 50, 1.1], [-43, 14, 3.4], [-47, 8, 1.3], [-42, 19, 0.7], [90, 26, 1.5], [7, 20, 0.9], [-17, 40, 1.9]];
        for (const [x, z, size] of heroes) {
            const rock = new THREE.Mesh(rockGeometry(x + 100, 2), material);
            rock.scale.set(size * 1.25, size, size);
            rock.position.set(x, MarsTerrain.sampleSurface(surface, x, z) + size * 0.3, z);
            rock.rotation.y = rand() * 6;
            rock.castShadow = rock.receiveShadow = true;
            scene.add(rock);
            if (x === -43 && z === 14) featuredRock = rock;
            obstacles.push({ x, z, radius: size * 1.45 });
        }
        const gravel = new THREE.InstancedMesh(rockGeometry(84, 0), material, profile.gravel);
        for (let i = 0; i < profile.gravel; i++) {
            const x = (rand() - 0.5) * 530, z = (rand() - 0.5) * 530;
            const size = 0.03 + rand() * 0.17;
            transform.position.set(x, MarsTerrain.sampleSurface(surface, x, z) + size * 0.1, z);
            transform.scale.set(size * 1.7, size, size);
            transform.rotation.set(0, rand() * Math.PI * 2, 0);
            transform.updateMatrix();
            gravel.setMatrixAt(i, transform.matrix);
            gravel.setColorAt(i, color.setScalar(0.45 + rand() * 0.5));
        }
        gravel.receiveShadow = true;
        gravel.frustumCulled = false;
        scene.add(gravel);
    }
    function buildSky() {
        const skyMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false, depthTest: false,
            uniforms: {
                zenith: { value: new THREE.Color(0x8f5f42).convertSRGBToLinear() },
                horizon: { value: new THREE.Color(0xe3b489).convertSRGBToLinear() }
            },
            vertexShader: 'varying vec3 vP; void main(){vP=position; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_Position.z=gl_Position.w;}',
            fragmentShader: 'uniform vec3 zenith; uniform vec3 horizon; varying vec3 vP; void main(){float h=clamp(normalize(vP).y,0.0,1.0); vec3 c=mix(horizon,zenith,pow(h,0.6)); gl_FragColor=vec4(c,1.0);}'
        });
        const sky = new THREE.Mesh(new THREE.SphereGeometry(6800, 32, 24), skyMaterial);
        sky.frustumCulled = false;
        sky.renderOrder = -1;
        scene.add(sky);
        scene.fog = new THREE.Fog(new THREE.Color(0xd9ab84).convertSRGBToLinear(), 240, 4200);
        const sun = new THREE.Mesh(new THREE.SphereGeometry(4.6, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff3dd, fog: false }));
        sun.position.copy(sunlight.position).normalize().multiplyScalar(2100);
        scene.add(sun);
        const haloCanvas = document.createElement('canvas');
        haloCanvas.width = haloCanvas.height = 128;
        const haloContext = haloCanvas.getContext('2d');
        const gradient = haloContext.createRadialGradient(64, 64, 2, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(190,214,245,0.9)');
        gradient.addColorStop(0.25, 'rgba(170,196,235,0.45)');
        gradient.addColorStop(0.6, 'rgba(210,170,140,0.18)');
        gradient.addColorStop(1, 'rgba(210,170,140,0)');
        haloContext.fillStyle = gradient;
        haloContext.fillRect(0, 0, 128, 128);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, opacity: 0.85, depthWrite: false, fog: false }));
        halo.scale.set(150, 150, 1);
        halo.position.copy(sun.position);
        scene.add(halo);
        const earthDirection = sun.position.clone().normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.3);
        earthDirection.y = Math.max(0.18, earthDirection.y - 0.09);
        const earthDot = new THREE.Mesh(new THREE.SphereGeometry(2.2, 12, 10), new THREE.MeshBasicMaterial({ color: 0xbcd2ff, fog: false }));
        earthDot.position.copy(earthDirection.normalize()).multiplyScalar(2100);
        scene.add(earthDot);
        for (const [body, object, hitRadius] of [['sun', sun, 170], ['earth', earthDot, 140]]) {
            const proxy = new THREE.Mesh(new THREE.SphereGeometry(hitRadius, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
            proxy.position.copy(object.position);
            proxy.userData.body = body;
            scene.add(proxy);
            skyBodies.push(proxy);
        }
        for (const [body, mx, my, mz, size] of [['phobos', -820, 940, -1350, 4.2], ['deimos', 340, 520, -1950, 2.6]]) {
            const moonlet = new THREE.Mesh(new THREE.SphereGeometry(size, 14, 10), new THREE.MeshStandardMaterial({ color: 0x7a6250, roughness: 1 }));
            moonlet.position.set(mx, my, mz);
            scene.add(moonlet);
            const proxy = new THREE.Mesh(new THREE.SphereGeometry(140, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
            proxy.position.copy(moonlet.position);
            proxy.userData.body = body;
            scene.add(proxy);
            skyBodies.push(proxy);
        }
        for (const [cx, cy, cz, sx, sy, opacity] of [[-1500, 1500, -3200, 1600, 300, 0.1], [900, 1800, -2600, 1300, 240, 0.08], [2200, 1300, -800, 1500, 260, 0.09], [-2400, 1700, 900, 1800, 320, 0.07]]) {
            const cloudCanvas = document.createElement('canvas');
            cloudCanvas.width = 256; cloudCanvas.height = 64;
            const cloudContext = cloudCanvas.getContext('2d');
            const cloudGradient = cloudContext.createRadialGradient(128, 32, 4, 128, 32, 120);
            cloudGradient.addColorStop(0, 'rgba(255,238,220,0.9)');
            cloudGradient.addColorStop(0.5, 'rgba(255,232,205,0.35)');
            cloudGradient.addColorStop(1, 'rgba(255,230,200,0)');
            cloudContext.fillStyle = cloudGradient;
            cloudContext.beginPath();
            cloudContext.ellipse(128, 32, 124, 30, 0, 0, Math.PI * 2);
            cloudContext.fill();
            const cloud = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cloudCanvas), transparent: true, opacity, depthWrite: false }));
            cloud.position.set(cx, cy, cz);
            cloud.scale.set(sx, sy, 1);
            scene.add(cloud);
        }
        return Promise.resolve();
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
        const y = MarsTerrain.sampleSurface(surface, x, z) + 0.015;
        const slopeX = (MarsTerrain.sampleSurface(surface, x + 0.35, z) - MarsTerrain.sampleSurface(surface, x - 0.35, z)) / 0.7;
        const slopeZ = (MarsTerrain.sampleSurface(surface, x, z + 0.35) - MarsTerrain.sampleSurface(surface, x, z - 0.35)) / 0.7;
        const normal = new THREE.Vector3(-slopeX, 1, -slopeZ).normalize();
        const align = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw + (rand() - 0.5) * 0.12);
        const matrix = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), align.multiply(turn), new THREE.Vector3(side < 0 ? -1 : 1, 1, 1));
        footprints.setMatrixAt(printCursor % 240, matrix);
        footprints.instanceMatrix.needsUpdate = true;
        printCursor++;
        if (walker.speed > 0.6) spawnDust(x, y + 0.03, z, 4, 0.28);
        if (audio) audio.step(walker.speed / MarsTerrain.WALK_SPEED);
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
        const material = new THREE.PointsMaterial({ size: 0.05 + energy * 0.05, map: dustTexture(), color: 0xd0a888, transparent: true, opacity: 0.65, depthWrite: false, sizeAttenuation: true });
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
                const ground = MarsTerrain.sampleSurface(surface, px, pz) + 0.01;
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
        const x = 31, z = -63;
        station.position.set(x, MarsTerrain.sampleSurface(surface, x, z) - 0.015, z);
        station.rotation.y = 2.2;
        scene.add(station);
        obstacles.push({ x, z, radius: 1 });
    }
    const rand = MarsTerrain.random(4451);
    function updateGravityButton() {
        $('gravity-button').textContent = t(gravity === MarsTerrain.GRAVITY ? 'gravityCompare' : 'gravityMars');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== MarsTerrain.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === MarsTerrain.GRAVITY ? MarsTerrain.EARTH_GRAVITY : MarsTerrain.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === MarsTerrain.GRAVITY ? 'marsTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === MarsTerrain.GRAVITY ? 'gravityMarsTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-mars-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
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
        const focusNames = { phobos: 'Phobos', deimos: 'Deimos', sun: 'Sun', earth: 'Earth' };
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Mars'}`;
        $('moonlet-dialog').showModal();
    }
    function updateCamera() {
        if (!walker) return;
        const headMotion = motionEnabled && !photoMode && exploring;
        const bob = headMotion ? walker.bob - walker.landing : 0;
        const roll = headMotion && walker.grounded ? Math.sin(walker.stride) * Math.min(1, walker.speed / MarsTerrain.WALK_SPEED) * 0.003 : 0;
        camera.position.set(position.x, walker.y + MarsTerrain.EYE_HEIGHT + bob, position.z);
        camera.rotation.set(pitch, yaw, roll, 'YXZ');
        if (astronaut) {
            astronaut.visible = exploring;
            astronaut.position.set(position.x, walker.y, position.z);
            astronaut.rotation.y = yaw;
            astronaut.userData.legs.forEach((leg, i) => {
                const stride = Math.sin(walker.stride + i * Math.PI);
                const amount = walker.grounded ? Math.min(1, walker.speed / MarsTerrain.WALK_SPEED) : 0;
                leg.position.z = stride * 0.12 * amount;
                const footZ = leg.position.z - 0.1;
                const footX = position.x + Math.cos(yaw) * leg.position.x + Math.sin(yaw) * footZ;
                const footWorldZ = position.z - Math.sin(yaw) * leg.position.x + Math.cos(yaw) * footZ;
                const contact = walker.grounded ? MarsTerrain.sampleSurface(surface, footX, footWorldZ) - walker.y : 0;
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
        walker = MarsTerrain.createWalker(surface, position);
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
    function buildDustDevil() {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 256;
        const context = canvas.getContext('2d');
        for (let i = 0; i < 26; i++) {
            const x = Math.random() * 128;
            const gradient = context.createLinearGradient(0, 256, 0, 0);
            gradient.addColorStop(0, 'rgba(196,150,116,0.55)');
            gradient.addColorStop(0.55, 'rgba(206,164,128,0.28)');
            gradient.addColorStop(1, 'rgba(206,164,128,0)');
            context.strokeStyle = gradient;
            context.lineWidth = 3 + Math.random() * 7;
            context.beginPath();
            context.moveTo(x, 256);
            for (let y = 256; y > 0; y -= 16) context.lineTo(x + Math.sin(y * 0.05 + i) * 9 + (256 - y) * 0.06, y);
            context.stroke();
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        const group = new THREE.Group();
        const makeColumn = (topR, bottomR, height, opacity) => {
            const material = new THREE.MeshBasicMaterial({ map: texture.clone(), transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(new THREE.CylinderGeometry(topR, bottomR, height, 14, 1, true), material);
            mesh.position.y = height / 2;
            group.add(mesh);
            return mesh;
        };
        const outer = makeColumn(2.2, 4.6, 34, 0.3);
        const inner = makeColumn(1.2, 2.6, 27, 0.34);
        inner.position.y = 15;
        group.userData = { outer, inner };
        dustDevil = group;
        scene.add(group);
    }
    function updateDustDevil(now) {
        if (!dustDevil) return;
        const t = now * 0.001;
        const x = -170 + Math.sin(t * 0.021) * 85;
        const z = 150 + Math.cos(t * 0.016) * 70;
        dustDevil.position.set(x, MarsTerrain.height(x, z) - 0.5, z);
        dustDevil.userData.outer.rotation.y += 0.028;
        dustDevil.userData.inner.rotation.y -= 0.043;
        dustDevil.userData.outer.material.map.offset.y = -t * 0.14;
        dustDevil.userData.inner.material.map.offset.y = -t * 0.22;
        const pulse = 0.85 + 0.15 * Math.sin(t * 0.9);
        dustDevil.scale.set(pulse, 1, pulse);
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
            MarsTerrain.updateWalker(surface, walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: jumpRequested }, dt, obstacles, gravity);
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
            if (Math.hypot(position.x, position.z) > MarsTerrain.WALK_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
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
        if (exploring && dt > 0) updateDustDevil(now);
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
            if (!window.THREE || !window.MarsTerrain) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.95;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xd9ab84);
            camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 7200);
            scene.add(new THREE.AmbientLight(0xd8b094, 0.14));
            scene.add(new THREE.HemisphereLight(0xe6bd92, 0x5a3a28, 0.42));
            sunlight = new THREE.DirectionalLight(0xffe4c4, 2.15);
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
                composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.45, 0.55, 0.8));
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
            buildRocks(texture);
            buildAstronaut(texture);
            buildFootprints();
            buildInstrument();
            buildDustDevil();
            walker = MarsTerrain.createWalker(surface, position);
            await buildSky();
            updateCamera();
            if (composer) composer.render(); else renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.MarsExpedition, terrain: MarsTerrain, strings: discoveryStrings });
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
                link.href = url; link.download = `mzu-mars-expedition-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Mars&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.MarsAudio ? window.MarsAudio.create() : null;
    try { soundEnabled = localStorage.getItem('mzu-mars-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
