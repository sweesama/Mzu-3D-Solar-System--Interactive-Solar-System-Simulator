(function (root) {
    root.createMoonDiscoveries = function ({ scene, camera, surface, rock, getWalker, isExploring, isPhotoMode, clearMovement, onPhoto, onDiscover, getNotes, language: initialLanguage, expedition, terrain, strings }) {
        const $ = id => document.getElementById(id);
        const model = expedition || root.LunarExpedition;
        const terrainModule = terrain || root.LunarTerrain;
        const copy = strings || {
            en: {
                fieldRoute: 'YOUR FIELD ROUTE', allFound: 'All five discoveries are in your journal. Stay a little longer.', discover: 'Discover · E', review: 'Read again · E', chooseStop: 'Next stop', rotateRock: 'Drag or use arrow keys to rotate', continueRoute: 'Continue exploring', takePhoto: 'Frame a photograph', discoveryDisclaimer: 'This is an imagined site, not a surveyed landing site or an identified lunar sample.',
                savedHere: 'Journal saved on this device.', visitOnly: 'Journal kept for this visit only.', follow: 'Follow the amber guide dots', closeEnough: 'You are here. Press E or Discover.', landFirst: 'Land before recording a discovery.', approach: 'Walk closer to this discovery.', recorded: 'DISCOVERY RECORDED', journal: 'FROM YOUR FIELD JOURNAL', away: 'm to the stop', ready: 'Ready to discover', quick: 'Quick travel — discovery not automatic', unavailable: 'The 3D specimen viewer is unavailable.', routeHelp: 'Follow the amber guide dots and distance arrow. Walk up to a stop and press E or Discover to add it to your journal. The numbered buttons offer quick travel, not automatic discoveries. Guide dots are interface aids, not structures on the Moon. H hides or restores the route card.',
                teasers: ['Find a place on the crater rim and read the landscape.', 'Approach the large boulder, then turn it around in the specimen viewer.', 'Reach the viewing point and find Earth above the horizon.', 'Walk south from arrival to find a small science station resting on the plain.', 'Hike to the eastern rim of the deep crater and look into its shadowed floor.'],
                details: ['The rim is built from material displaced during impact. The surrounding debris is called ejecta. Our crater is an artistic example of this process, not a reconstruction of a named lunar crater.', 'Lunar regolith is a mixture of rock fragments, mineral grains, and glass produced by impacts. Shape alone cannot tell us this model’s mineral composition or age. Rotate the representative rock to examine its surface.', 'Earth is much larger in the lunar sky than the Moon is in our sky. Tidal locking keeps it near the same place when viewed from much of the near side, although libration makes it move somewhat. This scene uses an artistic sky arrangement.', 'Between 1969 and 1977, Apollo seismometers recorded thousands of moonquakes and meteoroid impacts, including shallow quakes that can last tens of minutes. This prop honours those instruments; its readings are imagined, not real data.', 'Permanently shadowed craters near the lunar poles are among the coldest places in the Solar System — colder than −230 °C. Ice delivered by comets may survive there for ages. This hollow is a modest artistic echo of those places.']
            },
            zh: {
                fieldRoute: '你的探索路线', allFound: '五个发现都已记入手记。不妨再多停留一会儿。', discover: '记录发现 · E', review: '重读手记 · E', chooseStop: '换一站', rotateRock: '拖动或使用方向键旋转岩石', continueRoute: '继续探索', takePhoto: '构图拍照', discoveryDisclaimer: '这是虚构场景，并非真实着陆点测绘，也不是已鉴定的月球样本。',
                savedHere: '手记已保存在此设备。', visitOnly: '手记仅在本次浏览中保留。', follow: '沿淡金色引导点前进', closeEnough: '已抵达，按 E 或点击记录发现。', landFirst: '请先落地，再记录发现。', approach: '请走近这个发现点。', recorded: '新的发现已记录', journal: '你的探索手记', away: '米到达此站', ready: '可以记录发现', quick: '快捷移动，不会自动完成发现', unavailable: '三维岩石查看器暂时不可用。', routeHelp: '跟随淡金色引导点和距离箭头，走近后按 E 或点击记录发现。底部编号可以快捷移动，但不会自动完成发现。引导点只是界面辅助，并非月面真实设施。H 可隐藏或恢复路线卡片。',
                teasers: ['走到环形山边缘，读一读地形留下的痕迹。', '走近那块大岩石，在查看器中转动并观察它。', '到达眺望点，寻找地平线上方的地球。', '从抵达点向南走，找一座落在平原上的小型科考站。', '徒步到东侧深坑的边缘，俯视它阴影中的坑底。'],
                details: ['撞击将物质挤压、抛散，堆成隆起的坑缘，周边散落的碎屑称为溅射物。这里的环形山是这一过程的艺术示例，并不对应某个真实命名的陨石坑。', '月壤由岩石碎屑、矿物颗粒以及撞击产生的玻璃等组成。仅凭外形无法判断这个模型的矿物成分或年龄。可以旋转这块代表性岩石，仔细观察表面。', '从月球看地球，其视直径比从地球看月球大得多。潮汐锁定使月球正面许多地区天空中的地球位置相对稳定，天平动仍会带来一定变化。本场景的天空经过艺术构图。', '1969 到 1977 年间，阿波罗月震仪记录了数千次月震与陨石撞击，有些浅源月震可持续数十分钟。这座科考站是致敬那些仪器的道具，读数是虚构的。', '月球两极的永久阴影坑是太阳系中最冷的地方之一，可低于零下 230 摄氏度，彗星带来的水冰或许能在其中留存很久。这处浅坑是对那些地方的朴素艺术再现。']
            }
        };
        let language = initialLanguage, found = [], persistent = true;
        try { found = model.parseProgress(localStorage.getItem(model.STORAGE_KEY)); } catch (error) { persistent = false; }
        let selected = Math.max(0, model.discoveries.findIndex(item => !found.includes(item.id)));
        let lastUpdate = 0, viewer = null;
        const pinPosition = new THREE.Vector3();
        const raycaster = new THREE.Raycaster();
        const trail = new THREE.Group();
        trail.visible = false;
        scene.add(trail);
        const sprite = document.createElement('canvas');
        sprite.width = sprite.height = 32;
        const context = sprite.getContext('2d');
        context.fillStyle = '#ffffff'; context.beginPath(); context.arc(16, 16, 12, 0, Math.PI * 2); context.fill();
        const geometry = new THREE.BufferGeometry();
        const MAX_DOTS = 256;
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAX_DOTS * 3), 3));
        const trailPoints = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xdfb889, map: new THREE.CanvasTexture(sprite), size: 0.22, transparent: true, opacity: 0.7, depthWrite: false, alphaTest: 0.1 }));
        trailPoints.frustumCulled = false;
        trail.add(trailPoints);
        function layTrail(body, target, guidance) {
            const attribute = geometry.getAttribute('position');
            let count = 0;
            const waypoints = guidance.path.concat([{ x: target.x, z: target.z }]);
            for (let i = 0; i < waypoints.length - 1 && count < MAX_DOTS; i++) {
                const start = waypoints[i], end = waypoints[i + 1];
                const steps = Math.max(1, Math.ceil(Math.hypot(end.x - start.x, end.z - start.z) / 2.5));
                for (let j = 0; j < steps && count < MAX_DOTS; j++) {
                    const x = start.x + (end.x - start.x) * j / steps, z = start.z + (end.z - start.z) * j / steps;
                    const y = target.y !== undefined ? target.y : terrainModule.sampleSurface(surface, x, z) + 0.08;
                    attribute.setXYZ(count++, x, y, z);
                }
            }
            geometry.setDrawRange(0, count);
            attribute.needsUpdate = true;
        }
        const text = key => copy[language][key];
        const isOpen = () => $('discovery-dialog').open;
        function journal() {
            const total = model.discoveries.length;
            $('discovery-count').textContent = `${found.length} / ${total}`;
            $('discovery-progress').max = total;
            $('discovery-progress').value = found.length;
            $('route-complete').hidden = found.length !== total;
            $('progress-storage').textContent = text(persistent ? 'savedHere' : 'visitOnly');
            $('station-number').textContent = `0${selected + 1} / 0${total}`;
            $('station-title').textContent = getNotes()[selected][0];
            $('station-description').textContent = text('teasers')[selected];
            document.querySelectorAll('[data-station]').forEach(button => {
                button.dataset.found = String(found.includes(model.discoveries[Number(button.dataset.station)].id));
                button.title = text('quick');
            });
        }
        function select(index) {
            selected = index;
            journal();
            update(0);
        }
        function update(now = 0) {
            const body = getWalker(), target = model.discoveries[selected];
            const active = isExploring() && !isPhotoMode() && !isOpen() && !$('guide-dialog').open;
            trail.visible = active;
            if (!active || !body) { $('discovery-pin').hidden = true; return; }
            camera.updateMatrixWorld();
            pinPosition.set(target.x, terrainModule.sampleSurface(surface, target.x, target.z) + target.markerHeight, target.z).project(camera);
            const x = (pinPosition.x * 0.5 + 0.5) * innerWidth, y = (-pinPosition.y * 0.5 + 0.5) * innerHeight;
            $('discovery-pin').hidden = pinPosition.z < -1 || pinPosition.z > 1 || x < 35 || x > innerWidth - 35 || y < 150 || y > innerHeight - 170;
            $('discovery-pin').style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
            if (now && now - lastUpdate < 120) return;
            lastUpdate = now;
            const distance = Math.hypot(body.x - target.x, body.z - target.z);
            const near = model.canDiscover(body, selected), recorded = found.includes(target.id);
            const guidance = model.guidance(body, selected);
            layTrail(body, target, guidance);
            const bearing = Math.atan2(guidance.x - body.x, -(guidance.z - body.z)) + camera.rotation.y;
            $('route-arrow').style.transform = `rotate(${bearing}rad)`;
            $('route-distance').textContent = near ? text('ready') : `${Math.ceil(Math.max(distance, guidance.distance))} ${text('away')}`;
            $('route-instruction').textContent = text(near ? 'closeEnough' : !body.grounded && distance <= target.radius ? 'landFirst' : 'follow');
            $('discover-button').disabled = !near && !recorded;
            $('discover-button').textContent = text(recorded ? 'review' : 'discover');
            $('pin-number').textContent = `0${selected + 1}`;
            $('pin-distance').textContent = `${Math.ceil(distance)} m`;
            $('discovery-pin').setAttribute('aria-label', `${getNotes()[selected][0]}, ${Math.ceil(distance)} m`);
        }
        function renderSpecimen() {
            if (!viewer || $('specimen-view').hidden || !isOpen()) return;
            const width = $('specimen-canvas').clientWidth, height = $('specimen-canvas').clientHeight;
            viewer.renderer.setSize(width, height, false);
            viewer.camera.aspect = width / height;
            viewer.camera.updateProjectionMatrix();
            viewer.renderer.render(viewer.scene, viewer.camera);
        }
        function prepareSpecimen() {
            if (!viewer) {
                try {
                    const canvas = $('specimen-canvas');
                    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
                    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
                    renderer.outputEncoding = THREE.sRGBEncoding;
                    renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    const specimenScene = new THREE.Scene();
                    specimenScene.add(new THREE.HemisphereLight(0xffffff, 0x363b40, 0.9));
                    const light = new THREE.DirectionalLight(0xffeed4, 2);
                    light.position.set(-3, 4, 5); specimenScene.add(light);
                    const mesh = new THREE.Mesh(rock.geometry, rock.material);
                    mesh.rotation.set(0.2, 0.4, 0); specimenScene.add(mesh);
                    const specimenCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
                    specimenCamera.position.set(0, 0.3, 3.8); specimenCamera.lookAt(0, 0, 0);
                    viewer = { renderer, scene: specimenScene, camera: specimenCamera, mesh, pointer: null };
                    canvas.addEventListener('pointerdown', event => {
                        if (event.button !== 0) return;
                        event.preventDefault(); canvas.focus(); canvas.setPointerCapture(event.pointerId);
                        viewer.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
                    });
                    canvas.addEventListener('pointermove', event => {
                        if (!viewer.pointer || viewer.pointer.id !== event.pointerId) return;
                        mesh.rotation.y += (event.clientX - viewer.pointer.x) * 0.012;
                        mesh.rotation.x = THREE.MathUtils.clamp(mesh.rotation.x + (event.clientY - viewer.pointer.y) * 0.012, -1.2, 1.2);
                        viewer.pointer.x = event.clientX; viewer.pointer.y = event.clientY; renderSpecimen();
                    });
                    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, () => { viewer.pointer = null; });
                    canvas.addEventListener('keydown', event => {
                        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.code)) return;
                        event.preventDefault();
                        mesh.rotation.y += event.code === 'ArrowLeft' ? -0.15 : event.code === 'ArrowRight' ? 0.15 : 0;
                        mesh.rotation.x = THREE.MathUtils.clamp(mesh.rotation.x + (event.code === 'ArrowUp' ? -0.15 : event.code === 'ArrowDown' ? 0.15 : 0), -1.2, 1.2);
                        renderSpecimen();
                    });
                } catch (error) {
                    $('specimen-view').hidden = true;
                    $('discovery-detail').textContent += ` ${text('unavailable')}`;
                    return;
                }
            }
            renderSpecimen();
        }
        function interact(index = selected) {
            if (!isExploring() || isPhotoMode() || isOpen() || $('guide-dialog').open) return;
            const body = getWalker(), target = model.discoveries[index];
            if (!body || !target) return;
            if (!found.includes(target.id) && !model.canDiscover(body, index)) {
                $('route-instruction').textContent = text('approach');
                $('field-card').hidden = false;
                return;
            }
            const alreadyFound = found.includes(target.id);
            found = model.recordDiscovery(found, body, index);
            try { localStorage.setItem(model.STORAGE_KEY, JSON.stringify(found)); } catch (error) { persistent = false; }
            selected = index;
            clearMovement(); journal();
            const note = getNotes()[index];
            $('discovery-label').textContent = `${text(alreadyFound ? 'journal' : 'recorded')} · ${found.length} / ${model.discoveries.length}`;
            if (!alreadyFound && onDiscover) onDiscover();
            $('discovery-title').textContent = note[0];
            $('discovery-description').textContent = note[1];
            $('discovery-detail').textContent = text('details')[index];
            $('specimen-view').hidden = index !== 1;
            $('discovery-dialog').showModal();
            update(0);
            if (index === 1) prepareSpecimen();
        }
        function hitRock(clientX, clientY) {
            if (!isExploring() || isPhotoMode() || !rock) return;
            raycaster.setFromCamera(new THREE.Vector2(clientX / innerWidth * 2 - 1, 1 - clientY / innerHeight * 2), camera);
            if (raycaster.intersectObject(rock).length && model.canDiscover(getWalker(), 1)) interact(1);
        }
        function setLanguage(value) {
            language = value;
            document.querySelectorAll('[data-i18n], [data-discovery-i18n]').forEach(element => {
                const value = text(element.dataset.discoveryI18n || element.dataset.i18n);
                if (typeof value === 'string') element.textContent = value;
            });
            journal(); update(0);
        }
        $('discover-button').addEventListener('click', () => interact());
        $('discovery-pin').addEventListener('click', () => interact());
        $('next-discovery').addEventListener('click', () => { select((selected + 1) % model.discoveries.length); $('moon-canvas').focus(); });
        $('continue-route').addEventListener('click', () => {
            $('discovery-dialog').close();
            const next = model.discoveries.findIndex(item => !found.includes(item.id));
            if (next >= 0) select(next);
        });
        $('discovery-photo').addEventListener('click', () => { $('discovery-dialog').close(); onPhoto(); });
        $('discovery-dialog').addEventListener('close', () => {
            if (viewer) viewer.pointer = null;
            clearMovement(); $('moon-canvas').focus({ preventScroll: true }); update(0);
        });
        for (const [id, direction] of [['specimen-in', -0.4], ['specimen-out', 0.4]]) $(id).addEventListener('click', () => {
            if (!viewer) return;
            viewer.camera.position.z = THREE.MathUtils.clamp(viewer.camera.position.z + direction, 2.4, 6);
            viewer.camera.lookAt(0, 0, 0); renderSpecimen();
        });
        window.addEventListener('resize', renderSpecimen);
        setLanguage(initialLanguage);
        return { update, select, setLanguage, interact, hitRock, isOpen };
    };
}(typeof globalThis !== 'undefined' ? globalThis : this));
