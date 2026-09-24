(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const expedition = window.VenusExpedition;
    if (!expedition) { $('loading-label').textContent = 'The expedition guide could not load. Please reload this page.'; return; }
    const dictionary = {
        en: {
            expeditions: 'EXPEDITIONS', fullscreen: 'Full screen', return: 'Return to orbit', destination: 'VENUS', surfaceMode: 'SURFACE EXPLORATION',
            chapter: 'EXPEDITION 003 / THE BURNING PLAIN', title: 'Stand on\nVenus.', intro: 'Walk an imagined volcanic plain beneath a crushing orange sky — dim light, heavy air, and the quiet rumble of a world at 465°C.', begin: 'Step onto Venus', arrivalHint: 'No download. Just a little curiosity.',
            fieldNotes: 'FIELD NOTES', reconstruction: 'An imagined site, informed by Venus science.', gravity: 'GRAVITY', atmosphere: 'ATMOSPHERE', vacuum: 'Dense CO₂ · 92 atm', distance: 'FROM ARRIVAL',
            walkingHint: 'W A S D to walk · drag to look · Space to jump · G gravity · M sound', touchHint: 'Arrows to walk · drag to look · tap Jump to leap', station0: 'Fractured plain', station1: 'Boulder slabs', station2: 'Channel rim',
            astronaut: 'ASTRONAUT', jump: 'Jump', grounded: 'On the surface', airborne: 'Airborne', motionOn: 'Camera motion: On', motionOff: 'Camera motion: Off', motionHint: 'Disable head motion for a steadier view.',
            guide: 'Field guide', photo: 'Photo mode', quality: 'Quality', auto: 'Auto', high: 'High', balanced: 'Balanced', low: 'Low', artNote: 'SCIENCE-INSPIRED ARTISTIC RECONSTRUCTION · NOT A SCANNED LANDING SITE',
            capture: 'Save photograph', exitPhoto: 'Exit photo mode', loading: 'Preparing the Venusian landscape…', fieldGuide: 'THE EXPEDITION FIELD GUIDE', guideTitle: 'The quietest loud place.',
            guideIntro: 'This is a small, freely explorable volcanic plain, not a whole-planet simulation. The five observation points are different views of the same place; two of them can only be reached on foot.', controlsTitle: 'Moving around',
            gravityCompare: 'Compare Earth gravity · G', gravityVenus: 'Back to Venus gravity · G', gravityHint: 'Same takeoff push, different fall. Venus gravity is 8.87 m/s² — about 91% of Earth’s, so a jump feels almost like home.', soundOn: 'Suit sounds: On', soundOff: 'Suit sounds: Off', soundHint: 'Inside the suit: fan hum and conducted footfalls. Outside, dense air carries a low rumble, slow wind swells, and rare distant thunder. M toggles.', gravityVenusTag: 'Venus gravity — 8.87 m/s², nearly Earth’s.', gravityEarth: 'Earth gravity — 9.8 m/s². Almost identical to Venus — that is the surprise.', venusTag: 'VENUS', earthTag: 'EARTH',
            controlsText: 'You are exploring on foot as an astronaut. Walk with W A S D or the arrow keys; Shift gives a brisker pace. Press Space to jump, then wait to land before jumping again. Momentum carries you forward in the air. Drag to look, including down at your boots. Touchscreens have direction and Jump buttons. G compares Earth gravity; M toggles suit sounds. H hides notes; P opens photo mode; Esc closes it.',
            scienceTitle: 'Science meets imagination', scienceText: 'Venus hides its surface under thick sulfuric-acid clouds; sunlight arrives as a dim, directionless orange glow. The Soviet Venera landers photographed flat, dark, slab-like basalt plains. The lava channel, pancake dome, and ridged tesserae here are inspired by Magellan radar maps — the terrain is procedural art, not survey data.',
            soundText: "Venus is nearly Earth's twin in gravity: 8.87 m/s², so a jump rises only slightly higher than at home — press G to feel how small the difference is. Its atmosphere, though, is 92 times denser than Earth's and carries sound far better: expect a low rumble, slow heavy wind swells, and rare muffled thunder (lightning in the clouds is plausible but still debated). Inside the suit you hear the life-support fan and footfalls conducted through the body. Pace, takeoff strength, and camera motion are comfort settings, not a full spacesuit simulation.",
            assetText: 'No external imagery on this page — terrain, rock textures, and the sky are generated locally in your browser.',
            skyEyebrow: 'IN THE VENUSIAN SKY', sunName: 'The Sun',
            sunText: 'From the surface, Venus’s clouds hide the Sun completely — there is only a brighter patch of amber haze where it stands. The glow here is an artistic interpretation, not an accurate ephemeris. Nothing else — no moons, no stars, not even Earth — is visible through the overcast.',
            viewOrbit: 'See it in the Solar System', keepExploring: 'Keep exploring', skyHint: 'Venus has no moons, and its clouds hide every other body — only the Sun’s brighter patch of haze is clickable. Click it to learn more.',
            featuresTitle: 'What you are seeing', features: [
                ['Broken slab plains', 'Flat basalt plates cracked like a cooling crust — exactly what the Venera cameras saw. Low plates can be walked onto and climbed.'],
                ['Leaning plate pairs', 'Slabs propped against each other where the crust buckled.'],
                ['Lava channel', 'A dark, winding channel cut by very runny lava. The faint ember glow along its floor is artistic license — the real flows froze long ago.'],
                ['Pancake dome', 'The low flat-topped rise to the north-west: thick, sticky lava that piled up in place.'],
                ['Tessera highlands', 'Ridged, criss-crossed terrain to the far south-east — among the oldest surfaces on Venus.'],
                ['Venera-style lander', 'A tribute to the Soviet probes that photographed this world for barely two hours.'],
                ['The crushing sky', 'No sun disk, no stars, no moons — directionless amber light, heavy air, and rare thunder with a flash. Heat shimmer bends the far horizon.']
            ],
            error: 'The 3D scene could not start. Try reloading in a browser with WebGL enabled.', lost: 'The graphics connection was interrupted. Reload this page to resume.', boundary: 'You have reached the edge of this expedition. Try another observation point.', saved: 'Photograph saved.', saveFailed: 'This browser could not save the photograph.', fullscreenFailed: 'Full screen is not available in this browser.', textureFailed: 'A texture was unavailable; a simpler material is shown instead.', adjusted: 'Render resolution reduced to keep exploring smoothly.',
            notes: [
                ['A floor of broken slabs', 'The ground under your boots is fractured volcanic rock — flat plates tilted and cracked like cooling crust. The Venera landers photographed exactly this kind of surface.', 'LANDSCAPE', 'Fractured basalt plain'],
                ['Basalt in orange light', 'This dark slab represents Venusian basalt — the rock beneath the plains. Its true colour is grey; the amber cast is the sky’s light. Rotate it in the specimen viewer.', 'SURFACE', 'Rock & lava crust'],
                ['A river that was lava', 'This winding channel was carved by lava, not water. Some Venusian channels run thousands of kilometres — longer than any river on Earth.', 'LANDSCAPE', 'Lava channel'],
                ['A visitor that lasted 127 minutes', 'A lander rests on the plain — an artistic tribute to Venera 13, which photographed Venus in 1982 before the heat and pressure ended its mission. Its instruments here are imagined.', 'INSTRUMENT', 'Venera-style lander'],
                ['A dome of thick lava', 'The low, flat-topped rise ahead is a “pancake dome” — formed when sticky lava piled up instead of flowing away. Several real ones sit in a region called Eistla Regio.', 'LANDSCAPE', 'Pancake dome']
            ]
        },
        zh: {
            expeditions: '星际探索', fullscreen: '全屏', return: '返回太阳系', destination: '金星', surfaceMode: '金星表面探索', chapter: '探索 003 / 灼热平原', title: '站上金星。',
            intro: '走进一片艺术重建的火山平原，头顶是厚重压抑的橙色天空——昏暗的光线、沉重的空气，以及这个 465°C 世界低沉的轰鸣。', begin: '踏上金星', arrivalHint: '无需下载，带上好奇心就好。', fieldNotes: '探索手记', reconstruction: '受金星科学启发的虚构地点。',
            gravity: '金星重力', atmosphere: '大气环境', vacuum: '稠密二氧化碳 · 92 大气压', distance: '距抵达点', walkingHint: 'W A S D 行走 · 拖动转头 · 空格跳跃 · G 重力 · M 声音', touchHint: '方向按钮行走 · 拖动画面转头 · 点击跳跃',
            astronaut: '宇航员视角', jump: '跳跃', grounded: '双脚着地', airborne: '腾空中', motionOn: '镜头起伏：开', motionOff: '镜头起伏：关', motionHint: '关闭头部起伏可获得更平稳的视角。',
            station0: '碎裂平原', station1: '石板原野', station2: '熔岩沟边缘', guide: '探索指南', photo: '摄影模式', quality: '画质', auto: '自动', high: '高', balanced: '均衡', low: '低',
            artNote: '科学启发的艺术重建 · 非真实着陆点扫描', capture: '保存照片', exitPhoto: '退出摄影', loading: '正在准备金星风景…', fieldGuide: '金星探索指南', guideTitle: '最安静的喧嚣之地。',
            guideIntro: '这是一片可以自由漫游的火山平原，而非完整金星。五个观察点都位于同一个场景，其中两个只能徒步走到。', controlsTitle: '如何探索',
            gravityCompare: '对比地球重力 · G', gravityVenus: '恢复金星重力 · G', gravityHint: '同样的起跳力度，不同的下落感受。金星重力 8.87 m/s²——约为地球的 91%，跳跃感觉几乎和家里一样。', soundOn: '宇航服声音：开', soundOff: '宇航服声音：关', soundHint: '宇航服内是风扇低鸣与传导的脚步声；外部稠密的大气传声很好——低沉的轰鸣、缓慢沉重的风压涌动，偶尔远处一声闷雷。M 切换。', gravityVenusTag: '金星重力 — 8.87 m/s²，几乎与地球相同。', gravityEarth: '地球重力 — 9.8 m/s²。与金星几乎一样——这正是让人意外的地方。', venusTag: '金星', earthTag: '地球',
            controlsText: '你是一位徒步探索的宇航员。W A S D 或方向键行走，Shift 快步，空格跳跃，落地后才能再次起跳。腾空时保留起跳时的水平惯性，不能像飞行器一样转向。拖动画面观察，也可以低头看看自己的靴子。触屏有方向按钮和跳跃键。G 对比地球重力，M 开关宇航服声音。H 隐藏手记，P 进入摄影，Esc 退出摄影。',
            scienceTitle: '科学与想象的交界', scienceText: '金星表面被浓厚的硫酸云完全遮蔽，阳光抵达地面时只剩昏暗、无方向感的橙色光晕。苏联金星号着陆器拍到的正是平坦、深色的板状玄武岩平原。这里的熔岩沟、薄饼穹丘和镶嵌地块（tesserae）受麦哲伦号雷达测绘启发——地形是程序创作，并非实测数据。',
            soundText: '金星的重力几乎是地球的孪生兄弟：8.87 m/s²，跳跃只比在地球上略高一点——按 G 感受一下差别有多小。但它的大气密度是地球的 92 倍，传声能力反而很好：你会听到低沉的轰鸣、缓慢沉重的风压涌动，以及偶尔远处的闷雷（金星云中的闪电可能存在，科学上仍有争议）。宇航服内是维生风扇的低鸣和经身体传导的脚步。步速、起跳力度和镜头起伏经过舒适性设计，不是完整的宇航服物理模拟。',
            assetText: '本页不使用外部影像——地形、岩石纹理和天空均由浏览器本地生成。',
            skyEyebrow: '金星天空中', sunName: '太阳',
            sunText: '在金星表面，浓云完全遮住了太阳——只能看到一片稍亮的琥珀色雾霭标记它的方位。这里的亮斑是艺术演绎，并非精确星历。除此之外什么都看不见：金星没有卫星，云层也挡住了星星和地球。',
            viewOrbit: '在太阳系中查看它', keepExploring: '继续探索', skyHint: '金星没有卫星，云层遮蔽了所有天体——只有太阳那团稍亮的雾霭可以点击。点它了解更多。',
            featuresTitle: '你眼前的景观', features: [
                ['碎裂石板平原', '玄武岩板像冷却的壳一样碎裂翘起——正是金星号相机拍到的样子。矮的石板可以直接走上去。'],
                ['斜靠板对', '地壳挤压变形，让两块石板互相倚靠成尖顶。'],
                ['熔岩沟', '深色蜿蜒的沟槽，曾由极稀的熔岩切开。沟底残留的微光是艺术处理——真实的熔岩早已凝固。'],
                ['薄饼穹丘', '西北方向那座低平的圆顶：粘稠的熔岩原地堆积而成。'],
                ['镶嵌高地', '东南远处纵横交错的脊状地形——金星上最古老的表面之一。'],
                ['金星号着陆器', '向当年只工作了两小时就牺牲的苏联探测器致敬。'],
                ['压抑的天空', '没有日轮、没有星星、没有卫星——只有无方向的琥珀色微光、沉重的空气和偶尔一声闷雷。远处的地平线在热气中微微晃动。']
            ],
            error: '三维场景未能启动，请在支持 WebGL 的浏览器中重新加载。', lost: '图形连接中断，请重新加载页面继续。', boundary: '已到达本次探索区域边缘，可以前往另一个观察点。', saved: '照片已保存。', saveFailed: '当前浏览器无法保存照片。', fullscreenFailed: '当前浏览器无法进入全屏。', textureFailed: '纹理暂时不可用，已显示简化材质。', adjusted: '已适当降低渲染分辨率，让探索更流畅。',
            notes: [
                ['碎裂的地板', '靴底是碎裂的火山岩——一块块平板翘起、开裂，像冷却中的外壳。金星号着陆器拍到的正是这种地表。', '地貌类型', '碎裂玄武岩平原'],
                ['橙色光里的玄武岩', '这块深色石板代表金星玄武岩——平原之下的岩石。它的真实颜色是灰色，橙色调完全来自天空的光。可以在查看器中旋转观察。', '地表组成', '岩石与熔岩壳'],
                ['一条流过的熔岩河', '这条蜿蜒的沟槽是熔岩刻出来的，不是水。金星上有些熔岩通道长达数千公里——比地球上任何河流都长。', '地貌类型', '熔岩通道'],
                ['存活了 127 分钟的访客', '一台着陆器静卧在平原上——致敬 1982 年拍下金星地表照片的金星 13 号，它在高温高压下坚持工作了 127 分钟。这里的仪器细节是想象的。', '仪器类型', '金星号式着陆器'],
                ['黏稠熔岩堆成的穹丘', '前方那座低矮的平顶隆起是“薄饼穹丘”——黏稠的熔岩流不动，就地堆成了它。真实的埃斯特拉区就有好几座。', '地貌类型', '薄饼穹丘']
            ]
        }
    };
    const discoveryStrings = {
        en: {
            fieldRoute: 'YOUR FIELD ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed landing site or an identified Venusian sample.',
            savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Land before recording a discovery.', approach: 'Walk closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Walk up to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures on Venus. H hides or restores the route card.',
            teasers: ['Walk west across the plain and look down at the fractured slabs underfoot.', 'Approach the dark slab of rock, then turn it around in the specimen viewer.', 'Follow the plain south-east to a winding channel once carved by lava.', 'Walk south-east from arrival to find a small lander resting on the plain.', 'Hike north-west and climb the low dome with the flat top — a pancake dome.'],
            details: ['The Venera landers photographed plains of flat, fractured rock — cooling lava crusts broken into plates. Thick air and heat weather the surface slowly, so these slabs stay sharp-edged for ages. This field is an artistic arrangement.', 'Most of the Venusian plains are volcanic basalt. Under this orange sky its grey rock appears amber; the colour cast is atmosphere, not mineral. Rotate the representative rock to examine its surface.', 'Magellan’s radar mapped lava channels thousands of kilometres long — the longest channels in the Solar System. They were cut by very runny lava that stayed molten far longer than water could here. This channel is a modest artistic echo.', 'Between 1961 and 1984 the Soviet Venera programme landed ten probes on Venus; none survived much beyond two hours in 465°C heat and 92 atmospheres of pressure. This lander honours them; its details are imagined, not real data.', 'Pancake domes form when thick, sticky lava erupts slowly and piles up in place instead of flowing away — several steep-sided, flat-topped domes cluster in Eistla Regio. This dome is an artistic example, not a reconstruction of a named formation.']
        },
        zh: {
            fieldRoute: '你的探索路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转岩石', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实着陆点测绘，也不是已鉴定的金星样本。',
            savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点前进', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请先落地，再记录发现。', approach: '请走近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维岩石查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，走近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非金星表面的真实设施。H 可隐藏或恢复路线卡片。',
            teasers: ['向西穿过平原，低头看看脚下碎裂的岩板。', '走近那块深色石板，在查看器中转动并观察它。', '沿平原向东南走，找一条熔岩曾经流淌过的蜿蜒沟槽。', '从抵达点向东南走，找一台静卧在平原上的小型着陆器。', '向西北徒步，爬上那座平顶的低矮穹丘——一座薄饼穹丘。'],
            details: ['金星号着陆器拍到的平原遍布平坦的碎裂岩石——那是冷却的熔岩外壳碎成的板块。稠密的大气和高温让地表风化得很慢，这些岩板能长久保持锋利的边缘。这片区域是艺术化布置。', '金星平原大多是火山玄武岩。在这橙色天光下，灰色的岩石显出琥珀色——那是大气的颜色，不是矿物本身。可以旋转这块代表性岩石，仔细观察表面。', '麦哲伦号的雷达测绘出长达数千公里的熔岩通道——太阳系里最长的通道。切割它们的熔岩流动性极强，在这里远比水更耐久。这条沟槽是对它们的朴素艺术再现。', '1961 到 1984 年间，苏联金星计划让十台探测器登上了金星；在 465°C 高温和 92 个大气压下，没有一台撑过两小时。这台着陆器致敬它们，细节是虚构的。', '薄饼穹丘形成于黏稠的熔岩缓慢喷发、流不动就原地堆积——陡峭的边缘配平顶。真实的埃斯特拉区就聚集着好几座。这座穹丘是艺术示例，不对应某个命名的真实构造。']
        }
    };
    let language = parameters.get('lang') === 'zh' ? 'zh' : 'en';
    let stationIndex = 0, exploring = false, photoMode = false, ready = false, onSlab = false;
    let renderer, scene, camera, surface, sunlight, hemisphereLight, walker, astronaut, animationId = null;
    let flash = 0;
    const timeUniform = { value: 0 };
    let skyMat = null;
    let jumpRequested = false, motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw = -0.12, pitch = -0.06, lastTime = 0, frameCount = 0, sampleTime = 0, pixelRelief = 0, cameraTween = null;
    let noticeTimer, lastBoundaryNotice = 0, drag = null;
    let gravity = VenusTerrain.GRAVITY, audio = null, soundEnabled = true;
    let footprints = null, printCursor = 0, lastPrintMark = 0;
    const dust = { bursts: [], texture: null };
    const keys = new Set(), touchKeys = new Set(), obstacles = [], walkables = [];
    const stations = expedition.stations;
    let discoveryUI = null, featuredRock = null;
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
        $('gravity-mode').textContent = t(gravity === VenusTerrain.GRAVITY ? 'venusTag' : 'earthTag');
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
        if (error) console.error('Venus expedition:', error);
    }
    function makeTexture() {
        const size = profile.texture;
        const pixels = new Uint8Array(size * size * 4);
        const rand = VenusTerrain.random(817);
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
                const crack = Math.abs(tileNoise(u, v, fields[1]) - 0.5) < 0.02 ? -30 : 0;
                const value = Math.max(38, Math.min(150, 105 + grain + cloud + crack + (rand() > 0.999 ? -25 : 0)));
                const i = (z * size + x) * 4;
                pixels[i] = value; pixels[i + 1] = value * 0.74; pixels[i + 2] = value * 0.55; pixels[i + 3] = 255;
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
        const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x8a6244).convertSRGBToLinear(), roughness: 1, metalness: 0, vertexColors: true });
        material.extensions = { derivatives: true };
        material.onBeforeCompile = shader => {
            shader.uniforms.uTime = timeUniform;
            shader.vertexShader = 'uniform float uTime; varying vec3 vMountainPosition;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
                vMountainPosition = position;
                float shim = smoothstep(500.0, 2600.0, length(transformed.xz));
                transformed.x += sin(transformed.z * 0.011 + uTime * 1.6) * shim * 2.4;
                transformed.z += sin(transformed.x * 0.013 + uTime * 1.25) * shim * 2.4;`);
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
        surface = VenusTerrain.createSurface(960, profile.segments);
        const geometry = new THREE.PlaneGeometry(surface.size, surface.size, surface.segments, surface.segments);
        geometry.rotateX(-Math.PI / 2);
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        for (let i = 0; i < positions.count; i++) {
            positions.setY(i, surface.heights[i]);
            const n = VenusTerrain.noise(positions.getX(i) * 0.085, positions.getZ(i) * 0.085);
            const patch = VenusTerrain.noise(positions.getX(i) * 0.011 + 7, positions.getZ(i) * 0.011 - 3);
            const streak = VenusTerrain.noise(positions.getX(i) * 0.03 - positions.getZ(i) * 0.05 + 11, positions.getZ(i) * 0.008);
            const shade = 0.62 + n * 0.16 + patch * 0.08 + Math.max(0, streak - 0.35) * 0.1;
            const flowDark = 1 - Math.max(0, 1 - VenusTerrain.channelDistance(positions.getX(i), positions.getZ(i)) / (VenusTerrain.CHANNEL.width * 3.2)) * 0.32;
            colors.set([shade * flowDark, shade * 0.84 * flowDark, shade * 0.64 * flowDark], i * 3);
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
            const n = VenusTerrain.noise(x * 0.003 + 3, z * 0.003 - 1);
            const shieldDistance = Math.hypot(x + 1500, z + 1150);
            const shield = Math.exp(-Math.pow(shieldDistance / 950, 2)) * 300;
            const coronaDistance = Math.hypot(x - 1800, z - 500);
            const corona = Math.exp(-Math.pow((coronaDistance - 620) / 220, 2)) * 95;
            const broken = 0.55 + 0.35 * VenusTerrain.noise(x * 0.008, z * 0.008) + 0.1 * VenusTerrain.noise(x * 0.026, z * 0.026);
            const fractured = (Math.abs(VenusTerrain.noise(x * 0.012 + 31, z * 0.012) * 2 - 1) - 0.4) * 10 + (VenusTerrain.noise(x * 0.022, z * 0.022 + 19) - 0.5) * 3;
            const h = VenusTerrain.height(x, z) - 0.6 + blend * (shield * (0.75 + n * 0.4) + corona * broken + fractured + n * 30);
            farPositions.setY(i, h);
            const color = 0.58 + n * 0.18;
            farColors.set([color, color * 0.82, color * 0.6], i * 3);
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
        const sides = 6 + ((seed + detail) % 3);
        const geometry = new THREE.CylinderGeometry(1, 1.06, 0.22, sides, 1, false);
        const p = geometry.attributes.position;
        const c = new Float32Array(p.count * 3);
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
            const angle = Math.atan2(z, x);
            const rim = 1 + VenusTerrain.noise(Math.cos(angle) * 2.4 + seed, Math.sin(angle) * 2.4) * 0.26;
            const warp = 1 + VenusTerrain.noise(x * 2.1 + seed, z * 2.1 - y * 3) * 0.1;
            const crown = VenusTerrain.noise(x * 3 + seed, z * 3) * 0.05;
            p.setXYZ(i, x * rim * warp, y + crown, z * rim * warp);
            const shade = 0.3 + VenusTerrain.noise(x * 8 + seed, z * 8 + y * 4) * 0.16 + (y > 0.05 ? 0.06 : 0);
            c.set([shade, shade * 0.8, shade * 0.58], i * 3);
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(c, 3));
        geometry.computeVertexNormals();
        return geometry;
    }
    function registerWalkable(object, sx, sy, sz) {
        const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(object.quaternion);
        if (normal.y < 0.55) return false;
        const ground = VenusTerrain.sampleSurface(surface, object.position.x, object.position.z);
        if (object.position.y + sy * 0.11 - ground > 0.55) return false;
        walkables.push({
            px: object.position.x, py: object.position.y, pz: object.position.z,
            nx: normal.x, ny: normal.y, nz: normal.z, halfT: sy * 0.11,
            hx: sx * 0.46, hz: sz * 0.46, bound: Math.max(sx, sz) * 0.55,
            inv: object.quaternion.clone().invert()
        });
        return true;
    }
    const slabProbe = new THREE.Vector3();
    function slabTopAt(x, z) {
        let best = -Infinity;
        for (const s of walkables) {
            const dx = x - s.px, dz = z - s.pz;
            if (dx * dx + dz * dz > s.bound * s.bound) continue;
            slabProbe.set(dx, 0, dz).applyQuaternion(s.inv);
            if (Math.abs(slabProbe.x) > s.hx || Math.abs(slabProbe.z) > s.hz) continue;
            const top = s.py + (s.halfT - s.nx * dx - s.nz * dz) / s.ny;
            if (top > best) best = top;
        }
        return best;
    }
    function buildRocks(texture) {
        const rand = VenusTerrain.random(19690720);
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
                const upheaved = size > 1.35 && rand() < 0.3;
                const scaleX = size * (1.4 + rand() * 0.9), scaleZ = size * (0.9 + rand() * 0.5);
                const scaleY = size * (upheaved ? 1.1 + rand() * 0.6 : 0.4 + rand() * 0.4);
                transform.position.set(x, VenusTerrain.sampleSurface(surface, x, z) + size * 0.07, z);
                transform.scale.set(scaleX, scaleY, scaleZ);
                transform.rotation.set((rand() - 0.5) * (upheaved ? 1.3 : 0.5), rand() * Math.PI * 2, (rand() - 0.5) * (upheaved ? 1.3 : 0.5));
                transform.updateMatrix();
                rocks.setMatrixAt(i, transform.matrix);
                rocks.setColorAt(i, color.setScalar(0.5 + rand() * 0.4));
                const halfWidth = Math.max(scaleX, scaleZ) * 0.5;
                if (upheaved) obstacles.push({ x, z, radius: halfWidth * 0.95 });
                else if (halfWidth >= 0.4 && !registerWalkable(transform, scaleX, scaleY, scaleZ) && halfWidth >= 0.5) obstacles.push({ x, z, radius: halfWidth * 0.8 });
            }
            rocks.castShadow = quality !== 'low';
            rocks.receiveShadow = true;
            rocks.frustumCulled = false;
            scene.add(rocks);
        }
        const heroes = [[-45, 55, 3.2], [-49, 50, 1.5], [-40, 60, 0.8], [-62, -22, 1.7], [-56, -30, 0.9], [-66, -27, 0.6], [72, -82, 1.3], [28, -48, 0.9], [-18, -14, 1.1]];
        for (const [x, z, size] of heroes) {
            const rock = new THREE.Mesh(rockGeometry(x + 100, 2), material);
            rock.scale.set(size * 2.0, size * 0.45, size * 1.35);
            rock.rotation.set((rand() - 0.5) * 0.4, rand() * 6, (rand() - 0.5) * 0.4);
            rock.position.set(x, VenusTerrain.sampleSurface(surface, x, z) + size * 0.07, z);
            rock.castShadow = rock.receiveShadow = true;
            rock.updateMatrixWorld();
            scene.add(rock);
            if (x === -45 && z === 55) featuredRock = rock;
            if (!registerWalkable(rock, size * 2.0, size * 0.45, size * 1.35)) obstacles.push({ x, z, radius: size * 1.6 });
        }
        const giants = [[-95, 30, 4.6], [105, -35, 5.4], [28, 95, 4.1]];
        for (const [x, z, size] of giants) {
            const plate = new THREE.Mesh(rockGeometry(x * 3 + 7, 2), material);
            plate.scale.set(size * 2.2, size * 0.35, size * 1.5);
            plate.rotation.set((rand() - 0.5) * 0.3, rand() * 6, (rand() - 0.5) * 0.3);
            plate.position.set(x, VenusTerrain.sampleSurface(surface, x, z) + size * 0.03, z);
            plate.castShadow = plate.receiveShadow = true;
            plate.updateMatrixWorld();
            scene.add(plate);
            if (!registerWalkable(plate, size * 2.2, size * 0.35, size * 1.5)) obstacles.push({ x, z, radius: size * 1.4 });
        }
        for (const [lx, lz, lean] of [[-58.5, -28.5, 1], [-63.5, -20.5, -1], [75, -85, 1]]) {
            for (const side of [-1, 1]) {
                const plate = new THREE.Mesh(rockGeometry(Math.round(lx * 7 + side * 31), 1), material);
                plate.scale.set(1.7, 0.5, 2.3);
                plate.rotation.set(0, lean * 0.5 + side * 0.12, side * lean * 1.02);
                plate.position.set(lx + side * lean * 0.75, VenusTerrain.sampleSurface(surface, lx, lz) + 0.52, lz + side * 0.25);
                plate.castShadow = plate.receiveShadow = true;
                scene.add(plate);
            }
            obstacles.push({ x: lx, z: lz, radius: 1.9 });
        }
        const gravel = new THREE.InstancedMesh(rockGeometry(84, 0), material, profile.gravel);
        for (let i = 0; i < profile.gravel; i++) {
            const x = (rand() - 0.5) * 530, z = (rand() - 0.5) * 530;
            const size = 0.03 + rand() * 0.17;
            transform.position.set(x, VenusTerrain.sampleSurface(surface, x, z) + size * 0.05, z);
            transform.scale.set(size * 1.9, size * 0.6, size * 1.3);
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
                zenith: { value: new THREE.Color(0x77492a).convertSRGBToLinear() },
                horizon: { value: new THREE.Color(0xd99a55).convertSRGBToLinear() },
                flashBoost: { value: 0 }
            },
            vertexShader: 'varying vec3 vP; void main(){vP=position; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_Position.z=gl_Position.w;}',
            fragmentShader: `uniform vec3 zenith; uniform vec3 horizon; uniform float flashBoost; varying vec3 vP;
                float hsh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
                float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hsh(i),hsh(i+vec2(1.0,0.0)),f.x),mix(hsh(i+vec2(0.0,1.0)),hsh(i+vec2(1.0,1.0)),f.x),f.y);}
                void main(){
                    vec3 d = normalize(vP);
                    float h = clamp(d.y, 0.0, 1.0);
                    vec3 c = mix(horizon, zenith, pow(h, 0.5));
                    float bands = n2(vec2(d.x * 2.1 + d.z * 1.3, d.y * 6.5)) - 0.5;
                    float mottle = n2(vP.xz * 0.0016 + vec2(vP.y * 0.002)) - 0.5;
                    c *= 1.0 + (bands * 0.08 + mottle * 0.1) * smoothstep(0.02, 0.4, h);
                    c *= 1.0 + flashBoost * 0.55;
                    gl_FragColor = vec4(c, 1.0);
                }`
        });
        skyMat = skyMaterial;
        const sky = new THREE.Mesh(new THREE.SphereGeometry(6800, 32, 24), skyMaterial);
        sky.frustumCulled = false;
        sky.renderOrder = -1;
        scene.add(sky);
        scene.fog = new THREE.Fog(new THREE.Color(0xc98e54).convertSRGBToLinear(), 40, 520);
        const sunDirection = sunlight.position.clone().normalize();
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = glowCanvas.height = 256;
        const glowContext = glowCanvas.getContext('2d');
        const glow = glowContext.createRadialGradient(128, 128, 8, 128, 128, 128);
        glow.addColorStop(0, 'rgba(255,224,170,0.95)');
        glow.addColorStop(0.3, 'rgba(250,200,140,0.5)');
        glow.addColorStop(0.7, 'rgba(230,160,100,0.16)');
        glow.addColorStop(1, 'rgba(230,160,100,0)');
        glowContext.fillStyle = glow;
        glowContext.fillRect(0, 0, 256, 256);
        const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, opacity: 0.9, depthWrite: false, fog: false }));
        sunGlow.scale.set(1600, 1600, 1);
        sunGlow.position.copy(sunDirection).multiplyScalar(2100);
        scene.add(sunGlow);
        const sunProxy = new THREE.Mesh(new THREE.SphereGeometry(420, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        sunProxy.position.copy(sunGlow.position);
        sunProxy.userData.body = 'sun';
        scene.add(sunProxy);
        skyBodies.push(sunProxy);
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
        context.fillStyle = 'rgba(38,26,16,0.55)';
        context.beginPath(); context.ellipse(0, 0, 13, 22, 0, 0, Math.PI * 2); context.fill();
        context.fillStyle = 'rgba(26,17,10,0.8)';
        for (let i = 0; i < 8; i++) context.fillRect(-11, -20 + i * 5, 22, 2.6);
        context.fillStyle = 'rgba(24,15,9,0.85)';
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
        const y = VenusTerrain.sampleSurface(surface, x, z) + 0.015;
        const slopeX = (VenusTerrain.sampleSurface(surface, x + 0.35, z) - VenusTerrain.sampleSurface(surface, x - 0.35, z)) / 0.7;
        const slopeZ = (VenusTerrain.sampleSurface(surface, x, z + 0.35) - VenusTerrain.sampleSurface(surface, x, z - 0.35)) / 0.7;
        const normal = new THREE.Vector3(-slopeX, 1, -slopeZ).normalize();
        const align = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw + (rand() - 0.5) * 0.12);
        const matrix = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), align.multiply(turn), new THREE.Vector3(side < 0 ? -1 : 1, 1, 1));
        footprints.setMatrixAt(printCursor % 240, matrix);
        footprints.instanceMatrix.needsUpdate = true;
        printCursor++;
        if (walker.speed > 0.6) spawnDust(x, y + 0.03, z, 4, 0.28);
        if (audio) audio.step(walker.speed / VenusTerrain.WALK_SPEED);
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
        const material = new THREE.PointsMaterial({ size: 0.05 + energy * 0.05, map: dustTexture(), color: 0x9a7350, transparent: true, opacity: 0.6, depthWrite: false, sizeAttenuation: true });
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
                const ground = VenusTerrain.sampleSurface(surface, px, pz) + 0.01;
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
    let channelGlow = null;
    function buildChannelGlow() {
        const pts = VenusTerrain.CHANNEL.points;
        const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)));
        const divisions = 72, halfWidth = 1.1;
        const positions = [], indices = [];
        const point = new THREE.Vector3(), tangent = new THREE.Vector3();
        for (let i = 0; i <= divisions; i++) {
            const t = i / divisions;
            curve.getPoint(t, point); curve.getTangent(t, tangent);
            const px = -tangent.z, pz = tangent.x;
            const length = Math.hypot(px, pz) || 1;
            const ox = px / length * halfWidth, oz = pz / length * halfWidth;
            positions.push(point.x + ox, VenusTerrain.sampleSurface(surface, point.x + ox, point.z + oz) + 0.07, point.z + oz);
            positions.push(point.x - ox, VenusTerrain.sampleSurface(surface, point.x - ox, point.z - oz) + 0.07, point.z - oz);
            if (i < divisions) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        channelGlow = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff4517, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
        scene.add(channelGlow);
    }
    let stationBeacon = null;
    function buildInstrument() {
        const station = new THREE.Group();
        const foil = new THREE.MeshStandardMaterial({ color: 0xb9975f, roughness: 0.32, metalness: 0.72 });
        const metal = new THREE.MeshStandardMaterial({ color: 0xc8c1b1, roughness: 0.45, metalness: 0.6 });
        const dark = new THREE.MeshStandardMaterial({ color: 0x36393d, roughness: 0.85 });
        const titanium = new THREE.MeshStandardMaterial({ color: 0xa89f8e, roughness: 0.4, metalness: 0.65 });
        function part(geometry, material, x, y, z) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = mesh.receiveShadow = true;
            station.add(mesh);
            return mesh;
        }
        const ring = part(new THREE.TorusGeometry(0.62, 0.09, 12, 28), titanium, 0, 0.12, 0);
        ring.rotation.x = Math.PI / 2;
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const strut = part(new THREE.CylinderGeometry(0.016, 0.02, 0.42, 8), dark, Math.cos(angle) * 0.5, 0.32, Math.sin(angle) * 0.5);
            strut.rotation.z = Math.cos(angle) * 0.55;
            strut.rotation.x = -Math.sin(angle) * 0.55;
        }
        part(new THREE.CylinderGeometry(0.4, 0.44, 0.85, 20), foil, 0, 0.78, 0);
        part(new THREE.CylinderGeometry(0.34, 0.4, 0.18, 20), titanium, 0, 1.28, 0);
        for (const angle of [0.5, 2.1, 3.9, 5.4]) {
            const port = part(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 12), dark, Math.cos(angle) * 0.41, 0.82, Math.sin(angle) * 0.41);
            port.rotation.order = 'YXZ';
            port.rotation.y = -angle;
            port.rotation.x = Math.PI / 2;
        }
        part(new THREE.CylinderGeometry(0.78, 0.5, 0.16, 24), titanium, 0, 1.5, 0);
        part(new THREE.TorusGeometry(0.76, 0.035, 10, 30), dark, 0, 1.5, 0).rotation.x = Math.PI / 2;
        const helical = part(new THREE.TorusGeometry(0.09, 0.014, 8, 22), metal, 0.28, 1.78, 0.18);
        helical.rotation.x = 0.4;
        const mastTop = part(new THREE.CylinderGeometry(0.012, 0.016, 0.6, 8), metal, 0.28, 1.78, 0.18);
        mastTop.rotation.z = -0.18;
        part(new THREE.SphereGeometry(0.05, 10, 8), dark, -0.3, 1.62, -0.15);
        stationBeacon = part(new THREE.SphereGeometry(0.045, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffa03d, transparent: true, opacity: 0.9 }), 0, 1.72, 0);
        stationBeacon.castShadow = stationBeacon.receiveShadow = false;
        const x = 33, z = -55;
        station.position.set(x, VenusTerrain.sampleSurface(surface, x, z) - 0.02, z);
        station.rotation.y = 0.8;
        scene.add(station);
        obstacles.push({ x, z, radius: 1.2 });
    }
    const rand = VenusTerrain.random(4451);
    function updateGravityButton() {
        $('gravity-button').textContent = t(gravity === VenusTerrain.GRAVITY ? 'gravityCompare' : 'gravityVenus');
        $('gravity-button').setAttribute('aria-pressed', String(gravity !== VenusTerrain.GRAVITY));
    }
    function updateSoundButton() {
        $('sound-button').textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
        $('sound-button').setAttribute('aria-pressed', String(soundEnabled));
    }
    function toggleGravity() {
        gravity = gravity === VenusTerrain.GRAVITY ? VenusTerrain.EARTH_GRAVITY : VenusTerrain.GRAVITY;
        $('gravity-value').textContent = gravity.toFixed(2);
        $('gravity-mode').textContent = t(gravity === VenusTerrain.GRAVITY ? 'venusTag' : 'earthTag');
        updateGravityButton();
        notify(gravity === VenusTerrain.GRAVITY ? 'gravityVenusTag' : 'gravityEarth');
    }
    function toggleSound() {
        soundEnabled = !soundEnabled;
        try { localStorage.setItem('mzu-venus-sound', soundEnabled ? 'on' : 'off'); } catch (error) { }
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
        const focusNames = { sun: 'Sun' };
        $('moonlet-link').href = `index.html?focus=${focusNames[body] || 'Venus'}`;
        $('moonlet-dialog').showModal();
    }
    function updateCamera() {
        if (!walker) return;
        const headMotion = motionEnabled && !photoMode && exploring;
        const bob = headMotion ? walker.bob - walker.landing : 0;
        const roll = headMotion && walker.grounded ? Math.sin(walker.stride) * Math.min(1, walker.speed / VenusTerrain.WALK_SPEED) * 0.003 : 0;
        camera.position.set(position.x, walker.y + VenusTerrain.EYE_HEIGHT + bob, position.z);
        camera.rotation.set(pitch, yaw, roll, 'YXZ');
        if (astronaut) {
            astronaut.visible = exploring;
            astronaut.position.set(position.x, walker.y, position.z);
            astronaut.rotation.y = yaw;
            astronaut.userData.legs.forEach((leg, i) => {
                const stride = Math.sin(walker.stride + i * Math.PI);
                const amount = walker.grounded ? Math.min(1, walker.speed / VenusTerrain.WALK_SPEED) : 0;
                leg.position.z = stride * 0.12 * amount;
                const footZ = leg.position.z - 0.1;
                const footX = position.x + Math.cos(yaw) * leg.position.x + Math.sin(yaw) * footZ;
                const footWorldZ = position.z - Math.sin(yaw) * leg.position.x + Math.cos(yaw) * footZ;
                const contact = walker.grounded ? VenusTerrain.sampleSurface(surface, footX, footWorldZ) - walker.y : 0;
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
        walker = VenusTerrain.createWalker(surface, position);
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
            VenusTerrain.updateWalker(surface, walker, { forward, right, yaw, fast: keys.has('ShiftLeft') || keys.has('ShiftRight'), jump: jumpRequested }, dt, obstacles, gravity);
            jumpRequested = false;
            position.x = walker.x; position.z = walker.z;
            onSlab = false;
            const slabTop = slabTopAt(position.x, position.z);
            if (slabTop > -Infinity && walker.vy <= 0.01) {
                const rise = slabTop - walker.y;
                if (rise > -0.28 && rise <= 0.5) { walker.y = slabTop; walker.vy = 0; walker.grounded = true; onSlab = true; }
            }
            if (!wasAirborne && !walker.grounded) { spawnDust(position.x, walker.y + 0.06, position.z, 10, 0.45); if (audio) audio.jump(); }
            if (wasAirborne && walker.grounded) {
                const energy = Math.min(1.5, Math.max(0.3, fallSpeed / 3));
                spawnDust(position.x, walker.y + 0.05, position.z, Math.round(14 + energy * 14), 0.4 + energy * 0.7);
                if (audio) audio.land(energy);
            }
            const printMark = Math.floor(walker.stride / Math.PI);
            if (onSlab) lastPrintMark = printMark;
            while (lastPrintMark < printMark) { lastPrintMark++; dropPrint(lastPrintMark); }
            if (Math.hypot(position.x, position.z) > VenusTerrain.WALK_RADIUS - 1 && now - lastBoundaryNotice > 5000) { notify('boundary'); lastBoundaryNotice = now; }
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
        timeUniform.value = now * 0.001;
        if (channelGlow) channelGlow.material.opacity = 0.1 + 0.12 * (0.5 + 0.5 * Math.sin(now * 0.0009)) + flash * 0.15;
        if (flash > 0.001) { flash *= Math.exp(-dt * 3.4); hemisphereLight.intensity = 0.62 * (1 + flash * 1.7); if (skyMat) skyMat.uniforms.flashBoost.value = flash; }
        else if (skyMat && skyMat.uniforms.flashBoost.value !== 0) skyMat.uniforms.flashBoost.value = 0;
        if (Math.hypot(sunlight.target.position.x - position.x, sunlight.target.position.z - position.z) > 20) {
            sunlight.target.position.set(position.x, 0, position.z);
            sunlight.position.set(position.x - 180, 105, position.z - 160);
            sunlight.shadow.needsUpdate = true;
        }
        if (discoveryUI) discoveryUI.update(now);
        renderer.render(scene, camera);
        if (!sampleTime) sampleTime = now;
        frameCount++;
        if (now - sampleTime > 6000) {
            const fps = frameCount * 1000 / (now - sampleTime);
            if (preference === 'auto' && fps < 27 && pixelRelief < 2) {
                pixelRelief++;
                renderer.setPixelRatio(Math.max(0.75, Math.min(devicePixelRatio, profile.ratio) * (1 - pixelRelief * 0.2)));
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
        });
        canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail('lost'); });
    }
    async function init() {
        try {
            if (!window.THREE || !window.VenusTerrain) throw new Error('Required 3D dependencies are unavailable');
            renderer = new THREE.WebGLRenderer({ canvas: $('moon-canvas'), antialias: quality !== 'low', powerPreference: 'high-performance' });
            renderer.setSize(innerWidth, innerHeight);
            renderer.setPixelRatio(Math.min(devicePixelRatio, profile.ratio));
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.88;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xc98e54);
            camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.08, 7200);
            scene.add(new THREE.AmbientLight(0xd9a468, 0.3));
            hemisphereLight = new THREE.HemisphereLight(0xe3a55f, 0x40281a, 0.62);
            scene.add(hemisphereLight);
            sunlight = new THREE.DirectionalLight(0xffd2a0, 1.5);
            sunlight.position.set(-180, 105, -160);
            sunlight.castShadow = true;
            sunlight.shadow.mapSize.set(profile.shadows, profile.shadows);
            Object.assign(sunlight.shadow.camera, { left: -145, right: 145, top: 145, bottom: -145, near: 1, far: 650 });
            sunlight.shadow.bias = -0.00018;
            sunlight.shadow.normalBias = 0.08;
            sunlight.shadow.autoUpdate = false;
            sunlight.shadow.needsUpdate = true;
            scene.add(sunlight, sunlight.target);
            await new Promise(resolve => setTimeout(resolve, 30));
            const texture = makeTexture();
            buildTerrain(texture);
            await new Promise(resolve => setTimeout(resolve, 20));
            buildRocks(texture);
            buildAstronaut(texture);
            buildFootprints();
            buildInstrument();
            buildChannelGlow();
            walker = VenusTerrain.createWalker(surface, position);
            await buildSky();
            updateCamera();
            renderer.render(scene, camera);
            if (typeof window.createMoonDiscoveries !== 'function') throw new Error('Discovery interface is unavailable');
            discoveryUI = window.createMoonDiscoveries({ scene, camera, surface, rock: featuredRock, getWalker: () => walker, isExploring: () => exploring, isPhotoMode: () => photoMode, clearMovement, onPhoto: () => setPhoto(true), onDiscover: () => { if (audio) audio.chime(); }, getNotes: () => t('notes'), language, expedition: window.VenusExpedition, terrain: VenusTerrain, strings: discoveryStrings });
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
            renderer.render(scene, camera);
            renderer.domElement.toBlob(blob => {
                if (!blob) { notify('saveFailed'); return; }
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url; link.download = `mzu-venus-expedition-${stationIndex + 1}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                notify('saved');
            }, 'image/png');
        } catch (error) { notify('saveFailed'); }
    });
    $('moon-quality').value = preference;
    $('return-orbit').href = `index.html?focus=Venus&quality=${preference}`;
    $('moon-quality').addEventListener('change', event => {
        try { localStorage.setItem(policy?.QUALITY_STORAGE_KEY || 'mzu-solar-quality', event.target.value); } catch (error) { savedQuality = ''; }
        const url = new URL(location.href);
        url.searchParams.set('quality', event.target.value);
        url.searchParams.set('lang', language);
        location.assign(url.toString());
    });
    audio = window.VenusAudio ? window.VenusAudio.create() : null;
    if (audio) audio.onThunder(() => { flash = 1; });
    try { soundEnabled = localStorage.getItem('mzu-venus-sound') !== 'off'; } catch (error) { soundEnabled = true; }
    if (audio && !soundEnabled) audio.setEnabled(false);
    applyLanguage();
    init();
}());
