// Scene, Camera, Renderer
        let scene, camera, renderer;
        // Orbit Controls
        let controls;
        // Store planets and other celestial objects for animation updates
        const celestialObjects = [];
        // Clock for animation
        const clock = new THREE.Clock();
        // Uniforms for shaders that need time
        const shaderUniforms = {
            time: { value: 0 }
        };
        // Raycaster for object picking
        const raycaster = new THREE.Raycaster();
        raycaster.params.Points = { threshold: 2 };
        raycaster.params.Line = { threshold: 1 };
        const mouse = new THREE.Vector2();
        const pointerDownPosition = new THREE.Vector2();
        
        // Store all orbit lines for glow toggle
        const orbitLines = [];
        let orbitGlowEnabled = false;

        // Camera Tracking Variables
        let trackedObject = null;
        let isTransitioningCamera = false;

        // --- Celestial Body Data with Metric and Scene Units ---
        // radius: visual radius relative to Earth=1 for scene display
        // radiusMetric: actual radius in kilometers
        // orbitRadius: visual orbit radius in scene units for display
        // orbitSemiMajorAxisAU: actual semi-major axis in Astronomical Units (AU)
        // e: eccentricity
        // speed: factor for orbital speed in animation (arbitrary)
        // rotationSpeed: factor for self-rotation speed in animation (arbitrary)
        // axialTilt: in radians

        const planetData = [
            { name: 'Mercury', displayName: 'Mercury', type: "Planet", e: 0.2056, color: 0x888888,
                radius: 0.38, radiusMetric: 2439.7, orbitRadius: 16, orbitSemiMajorAxisAU: 0.387098,
                speed: 0.0479, rotationSpeed: 0.005, axialTilt: 0.00052, materialProps: { roughness: 0.9, metalness: 0.1 }, isMercury: true },
            { name: 'Venus', displayName: 'Venus', type: "Planet", e: 0.0067, color: 0xf8e0a0,
                radius: 0.95, radiusMetric: 6051.8, orbitRadius: 22, orbitSemiMajorAxisAU: 0.723332,
                speed: 0.0350, rotationSpeed: 0.002, axialTilt: 3.0959, materialProps: { roughness: 0.8, metalness: 0.15 }, isVenus: true, hasAtmosphere: true, atmosphereColor: 0xffe080, atmosphereScale: 1.03 },
            {
                name: 'Earth', displayName: 'Earth', type: "Planet", e: 0.0167, color: 0x5070bb,
                radius: 1.0, radiusMetric: 6371.0, orbitRadius: 30, orbitSemiMajorAxisAU: 1.000000,
                speed: 0.0298, rotationSpeed: 0.020, axialTilt: 0.4091, materialProps: { roughness: 0.5, metalness: 0.15 }, isEarth: true, hasAtmosphere: true, atmosphereColor: 0x87ceeb, atmosphereScale: 1.025,
                moons: [
                    { name: 'Moon', displayName: 'Moon', type: "Moon", e: 0.0549,
                      radius: 0.27, radiusMetric: 1737.4, orbitRadius: 2.5, orbitSemiMajorAxisAU: 0.002569, // Around Earth
                      speed: 0.1022, color: 0xbbbbbb, materialProps: { roughness: 0.9, metalness: 0.05 }, isMoon: true, rotationSpeed: 0.0027 } // Moon's rotation is tidally locked
                ]
            },
            {
                name: 'Mars', displayName: 'Mars', type: "Planet", e: 0.0934, color: 0xdc7633,
                radius: 0.53, radiusMetric: 3389.5, orbitRadius: 38, orbitSemiMajorAxisAU: 1.523680,
                speed: 0.0241, rotationSpeed: 0.018, axialTilt: 0.4396, materialProps: { roughness: 0.85, metalness: 0.15 }, isMars: true,
                 moons: [
                    { name: 'Phobos', displayName: 'Phobos', type: "Moon", e: 0.0151, radius: 0.06, radiusMetric: 11.26, orbitRadius: 0.9, orbitSemiMajorAxisAU: 0.000062668, speed: 0.47, color: 0x554433, materialProps: { roughness: 0.95, metalness: 0.0 }, rotationSpeed: 0.01 }, // Actual speeds are much faster
                    { name: 'Deimos', displayName: 'Deimos', type: "Moon", e: 0.0002, radius: 0.04, radiusMetric: 6.2, orbitRadius: 1.5, orbitSemiMajorAxisAU: 0.0001563, speed: 0.23, color: 0x605040, materialProps: { roughness: 0.95, metalness: 0.0 }, rotationSpeed: 0.008 }
                ]
            },
            {
                name: 'Jupiter', displayName: 'Jupiter', type: "Planet", e: 0.0489, color: 0xffd700,
                radius: 4.2, radiusMetric: 69911, orbitRadius: 65, orbitSemiMajorAxisAU: 5.2044,
                speed: 0.0131, rotationSpeed: 0.045, axialTilt: 0.0547, materialProps: { roughness: 0.7, metalness: 0.0 }, isJupiter: true, hasRings: true, ringType: "jupiter",
                moons: [
                    { name: 'Io', displayName: 'Io', type: "Moon", e: 0.0041, radius: 0.45, radiusMetric: 1821.6, orbitRadius: 7, orbitSemiMajorAxisAU: 0.002819, speed: 0.173, color: 0xfdd835, materialProps: { roughness: 0.7, metalness: 0.1 }, isIo: true, rotationSpeed: 0.015 },
                    { name: 'Europa', displayName: 'Europa', type: "Moon", e: 0.0094, radius: 0.38, radiusMetric: 1560.8, orbitRadius: 10, orbitSemiMajorAxisAU: 0.004486, speed: 0.137, color: 0xeeeeee, materialProps: { roughness: 0.6, metalness: 0.05 }, isEuropa: true, rotationSpeed: 0.012 },
                    { name: 'Ganymede', displayName: 'Ganymede', type: "Moon", e: 0.0013, radius: 0.65, radiusMetric: 2631.2, orbitRadius: 14, orbitSemiMajorAxisAU: 0.007155, speed: 0.108, color: 0xa0a0a0, materialProps: { roughness: 0.8, metalness: 0.1 }, isGanymede: true, rotationSpeed: 0.01 },
                    { name: 'Callisto', displayName: 'Callisto', type: "Moon", e: 0.0074, radius: 0.60, radiusMetric: 2410.3, orbitRadius: 19, orbitSemiMajorAxisAU: 0.012585, speed: 0.082, color: 0x606060, materialProps: { roughness: 0.9, metalness: 0.05 }, isCallisto: true, rotationSpeed: 0.009 }
                ]
            },
            {
                name: 'Saturn', displayName: 'Saturn', type: "Planet", e: 0.0565, color: 0xf0e68c,
                radius: 3.8, radiusMetric: 58232, orbitRadius: 95, orbitSemiMajorAxisAU: 9.5826,
                speed: 0.0097, rotationSpeed: 0.040, axialTilt: 0.4660, materialProps: { roughness: 0.75, metalness: 0.05 }, isSaturn: true, hasRings: true, ringType: "saturn",
                moons: [
                    { name: 'Mimas', displayName: 'Mimas', type: "Moon", e: 0.0196, radius: 0.1, radiusMetric: 198.2, orbitRadius: 6, orbitSemiMajorAxisAU: 0.001240, speed: 0.07, color: 0xbbbbbb, materialProps: { roughness: 0.85, metalness: 0.05 }, isMimas: true, rotationSpeed: 0.008 },
                    { name: 'Titan', displayName: 'Titan', type: "Moon", e: 0.0288, radius: 0.7, radiusMetric: 2574.7, orbitRadius: 7.5, orbitSemiMajorAxisAU: 0.008168, speed: 0.055, color: 0xffa500, materialProps: { roughness: 0.6, metalness: 0.1 }, isTitan: true, hasAtmosphere: true, atmosphereColor:0xffc04d, atmosphereScale: 1.05, rotationSpeed: 0.003 },
                    { name: 'Rhea', displayName: 'Rhea', type: "Moon", e: 0.001, radius: 0.25, radiusMetric: 763.8, orbitRadius: 9.5, orbitSemiMajorAxisAU: 0.003523, speed: 0.05, color: 0xb0b0b0, materialProps: { roughness: 0.8, metalness: 0.05 }, isRhea: true, rotationSpeed: 0.005 },
                    // Dione and Tethys omitted for brevity but should be added with metric data if desired
                ]
            },
            { name: 'Uranus', displayName: 'Uranus', type: "Planet", e: 0.0457, color: 0xafdde9,
                radius: 2.2, radiusMetric: 25362, orbitRadius: 125, orbitSemiMajorAxisAU: 19.2184,
                speed: 0.0068, rotationSpeed: 0.025, axialTilt: 1.709, materialProps: { roughness: 0.7, metalness: 0.1 }, isUranus: true, hasRings: true, ringType: "uranus",
                moons: [
                    { name: 'Miranda', displayName: 'Miranda', type: "Moon", e: 0.0013, radius: 0.09, radiusMetric: 235.8, orbitRadius: 1.2, orbitSemiMajorAxisAU: 0.000866, speed: 0.085, color: 0x9fb3cc, materialProps: { roughness: 0.8, metalness: 0.05 }, isMiranda: true, rotationSpeed: 0.008 },
                    { name: 'Ariel', displayName: 'Ariel', type: "Moon", e: 0.0012, radius: 0.12, radiusMetric: 578.9, orbitRadius: 1.6, orbitSemiMajorAxisAU: 0.001259, speed: 0.062, color: 0xafc3dc, materialProps: { roughness: 0.75, metalness: 0.08 }, isAriel: true, rotationSpeed: 0.006 },
                    { name: 'Umbriel', displayName: 'Umbriel', type: "Moon", e: 0.0039, radius: 0.11, radiusMetric: 584.7, orbitRadius: 2.0, orbitSemiMajorAxisAU: 0.002661, speed: 0.048, color: 0x7f8fa0, materialProps: { roughness: 0.85, metalness: 0.06 }, isUmbriel: true, rotationSpeed: 0.005 },
                    { name: 'Titania', displayName: 'Titania', type: "Moon", e: 0.0011, radius: 0.16, radiusMetric: 788.4, orbitRadius: 2.5, orbitSemiMajorAxisAU: 0.004363, speed: 0.035, color: 0xbfd3e0, materialProps: { roughness: 0.7, metalness: 0.1 }, isTitania: true, rotationSpeed: 0.004 },
                    { name: 'Oberon', displayName: 'Oberon', type: "Moon", e: 0.0014, radius: 0.15, radiusMetric: 761.4, orbitRadius: 3.0, orbitSemiMajorAxisAU: 0.005834, speed: 0.028, color: 0x8fa0b0, materialProps: { roughness: 0.8, metalness: 0.07 }, isOberon: true, rotationSpeed: 0.003 }
                ]
            },
            { name: 'Neptune', displayName: 'Neptune', type: "Planet", e: 0.0113, color: 0x3b5998,
                radius: 2.1, radiusMetric: 24622, orbitRadius: 150, orbitSemiMajorAxisAU: 30.110,
                speed: 0.0054, rotationSpeed: 0.026, axialTilt: 0.4945, materialProps: { roughness: 0.65, metalness: 0.1 }, isNeptune: true, hasRings: true, ringType: "neptune",
                moons: [
                    { name: 'Triton', displayName: 'Triton', type: "Moon", e: 0.000016, radius: 0.21, radiusMetric: 1353.4, orbitRadius: 2.2, orbitSemiMajorAxisAU: 0.002371, speed: -0.025, color: 0xb8c6db, materialProps: { roughness: 0.6, metalness: 0.15 }, isTriton: true, hasAtmosphere: true, atmosphereColor: 0xc8d6e8, atmosphereScale: 1.02, rotationSpeed: -0.008 },
                    { name: 'Nereid', displayName: 'Nereid', type: "Moon", e: 0.7512, radius: 0.08, radiusMetric: 170.0, orbitRadius: 4.5, orbitSemiMajorAxisAU: 0.036087, speed: 0.003, color: 0x8a9bb0, materialProps: { roughness: 0.9, metalness: 0.05 }, isNereid: true, rotationSpeed: 0.002 }
                ]
            },
            // Dwarf Planet System
            { name: 'Pluto', displayName: 'Pluto', type: "Dwarf Planet", e: 0.2488, color: 0x8b7d6b,
                radius: 0.19, radiusMetric: 1188.3, orbitRadius: 260, orbitSemiMajorAxisAU: 39.482,
                speed: 0.0047, rotationSpeed: 0.015, axialTilt: 3.1289, materialProps: { roughness: 0.85, metalness: 0.05 }, isPluto: true,
                moons: [
                    { name: 'Charon', displayName: 'Charon', type: "Moon", e: 0.0002, radius: 0.09, radiusMetric: 606.0, orbitRadius: 1.0, orbitSemiMajorAxisAU: 0.000196, speed: 0.112, color: 0x8b7d6b, materialProps: { roughness: 0.85, metalness: 0.05 }, isCharon: true, rotationSpeed: 0.015 },
                    { name: 'Styx', displayName: 'Styx', type: "Moon", e: 0.0001, radius: 0.02, radiusMetric: 16.0, orbitRadius: 1.8, orbitSemiMajorAxisAU: 0.000324, speed: 0.085, color: 0x6b5d4b, materialProps: { roughness: 0.9, metalness: 0.0 }, rotationSpeed: 0.01 },
                    { name: 'Nix', displayName: 'Nix', type: "Moon", e: 0.0001, radius: 0.025, radiusMetric: 49.8, orbitRadius: 2.2, orbitSemiMajorAxisAU: 0.000396, speed: 0.072, color: 0x7b6d5b, materialProps: { roughness: 0.9, metalness: 0.0 }, rotationSpeed: 0.01 },
                    { name: 'Kerberos', displayName: 'Kerberos', type: "Moon", e: 0.0001, radius: 0.015, radiusMetric: 19.0, orbitRadius: 2.6, orbitSemiMajorAxisAU: 0.000468, speed: 0.062, color: 0x5b4d3b, materialProps: { roughness: 0.9, metalness: 0.0 }, rotationSpeed: 0.01 },
                    { name: 'Hydra', displayName: 'Hydra', type: "Moon", e: 0.0001, radius: 0.03, radiusMetric: 61.0, orbitRadius: 3.0, orbitSemiMajorAxisAU: 0.000540, speed: 0.055, color: 0x7b6d5b, materialProps: { roughness: 0.9, metalness: 0.0 }, rotationSpeed: 0.01 }
                ]
            },
            { name: 'Ceres', displayName: 'Ceres', type: "Dwarf Planet", e: 0.0760, color: 0x8b7355,
                radius: 0.15, radiusMetric: 473.0, orbitRadius: 290, orbitSemiMajorAxisAU: 2.767,
                speed: 0.0178, rotationSpeed: 0.025, axialTilt: 0.1865, materialProps: { roughness: 0.8, metalness: 0.1 }, isCeres: true },
            { name: 'Eris', displayName: 'Eris', type: "Dwarf Planet", e: 0.4407, color: 0x7b7b7b,
                radius: 0.18, radiusMetric: 1163.0, orbitRadius: 320, orbitSemiMajorAxisAU: 67.668,
                speed: 0.0034, rotationSpeed: 0.012, axialTilt: 1.5882, materialProps: { roughness: 0.85, metalness: 0.05 }, isEris: true },
            { name: 'Makemake', displayName: 'Makemake', type: "Dwarf Planet", e: 0.1599, color: 0x9b8b7b,
                radius: 0.16, radiusMetric: 715.0, orbitRadius: 280, orbitSemiMajorAxisAU: 45.792,
                speed: 0.0040, rotationSpeed: 0.018, axialTilt: 0.1571, materialProps: { roughness: 0.85, metalness: 0.05 }, isMakemake: true },
            { name: 'Haumea', displayName: 'Haumea', type: "Dwarf Planet", e: 0.1951, color: 0x8b7b6b,
                radius: 0.14, radiusMetric: 797.5, orbitRadius: 270, orbitSemiMajorAxisAU: 43.335,
                speed: 0.0042, rotationSpeed: 0.030, axialTilt: 0.5934, materialProps: { roughness: 0.8, metalness: 0.1 }, isHaumea: true,
                moons: [
                    { name: 'Hiaka', displayName: 'Hiaka', type: "Moon", e: 0.0001, radius: 0.02, radiusMetric: 320.0, orbitRadius: 0.8, orbitSemiMajorAxisAU: 0.000294, speed: 0.085, color: 0x7b6b5b, materialProps: { roughness: 0.9, metalness: 0.0 }, rotationSpeed: 0.01 },
                    { name: 'Namaka', displayName: 'Namaka', type: "Moon", e: 0.0001, radius: 0.015, radiusMetric: 170.0, orbitRadius: 1.2, orbitSemiMajorAxisAU: 0.000441, speed: 0.065, color: 0x6b5b4b, materialProps: { roughness: 0.9, metalness: 0.0 }, rotationSpeed: 0.01 }
                ]
            }
        ];
        const sunRadiusVisual = 8; // Visual radius relative to Earth for scene display
        const sunRadiusMetric = 695700; // km
        const sunDisplayName = 'Sun';
        let sun, sunGlowObject, sunLensflare;

        const workerCode = `
self.onmessage = function(e) {
    const { type, data } = e.data;
    if (type === 'GENERATE_KUIPER_BELT') {
        const { count, beltInnerRadius, beltOuterRadius, beltHeight } = data;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const a = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
            const e = Math.random() * 0.25; const M = Math.random() * Math.PI * 2;
            let E_kbo = M; for (let k = 0; k < 5; k++) { E_kbo = M + e * Math.sin(E_kbo); }
            const r_kbo = a * (1 - e * Math.cos(E_kbo));
            const trueAnomaly = 2 * Math.atan2(Math.sqrt(1+e) * Math.sin(E_kbo/2), Math.sqrt(1-e) * Math.cos(E_kbo/2));
            const x = r_kbo * Math.cos(trueAnomaly) - a * e;
            const z = r_kbo * Math.sin(trueAnomaly);
            const inclination = (Math.random() - 0.5) * 0.35;
            const longitudeOfAscendingNode = Math.random() * Math.PI * 2;
            const cx = Math.cos(inclination), sx = Math.sin(inclination);
            const cy = Math.cos(longitudeOfAscendingNode), sy = Math.sin(longitudeOfAscendingNode);
            const y1 = -z * sx; const z1 = z * cx; const x1 = x;
            const x2 = x1 * cy + z1 * sy; const z2 = -x1 * sy + z1 * cy;
            const y2 = y1 + (Math.random() - 0.5) * beltHeight * (1 + (Math.random()-0.5)*1.2); 
            positions[i * 3] = x2; positions[i * 3 + 1] = y2; positions[i * 3 + 2] = z2;
        }
        self.postMessage({ type: 'KUIPER_BELT_DATA', positions }, [positions.buffer]);
    }
    if (type === 'GENERATE_ASTEROID_BELT') {
        const { count, beltInnerRadius, beltOuterRadius, beltHeight, poolSize } = data;
        const asteroidData = new Float32Array(count * 10);
        for (let i = 0; i < count; i++) {
            const poolIndex = Math.floor(Math.random() * poolSize);
            const scale = 0.8 + Math.random() * 0.4;
            const a = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
            const e = Math.random() * 0.08;
            const y_pos = (Math.random() - 0.5) * beltHeight * (1 + (Math.random()-0.5)*1.0);
            const rotX = (Math.random() - 0.5) * 0.25; const rotZ = (Math.random() - 0.5) * 0.25; const rotY = Math.random() * Math.PI * 2;
            const speed = 0.0015 + Math.random() * 0.008; const rotationSpeed = Math.random() * 0.02;
            const offset = i * 10;
            asteroidData[offset] = poolIndex; asteroidData[offset + 1] = scale;
            asteroidData[offset + 2] = a; asteroidData[offset + 3] = e;
            asteroidData[offset + 4] = y_pos; asteroidData[offset + 5] = rotX;
            asteroidData[offset + 6] = rotZ; asteroidData[offset + 7] = rotY;
            asteroidData[offset + 8] = speed; asteroidData[offset + 9] = rotationSpeed;
        }
        self.postMessage({ type: 'ASTEROID_BELT_DATA', asteroidData }, [asteroidData.buffer]);
    }
};
`;
        const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
        const WORKER_URL = URL.createObjectURL(workerBlob);

        const yieldThread = () => new Promise(resolve => setTimeout(resolve, 0));
        function updateProgress(text, pct) {
            const screen = document.getElementById('loading-screen');
            if (!screen || screen.style.display === 'none') return;
            const textEl = document.getElementById('loading-text');
            const barEl = document.getElementById('loading-progress-bar');
            if (textEl) textEl.innerText = text;
            if (barEl) barEl.style.width = Math.max(0, Math.min(100, pct)) + '%';
        }

        async function init() {
            updateProgress("Initializing Environment...", 5);
            await yieldThread();
            
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 7000);
            camera.position.set(0, 100, 200);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

 
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            document.body.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 20;
            controls.maxDistance = 1500;

            updateProgress("Igniting Sun...", 10);
            await yieldThread();
            sun = createSun();
            if (!sun) {
                console.error('[DEBUG] CRITICAL: createSun() returned undefined or null! Aborting init.');
                return;
            }
            scene.add(sun);

            sunGlowObject = sun.getObjectByName("sunGlowSprite");
            sunLensflare = sun.getObjectByName("sunLensflareSystem");

            if (!sunGlowObject) console.warn('[DEBUG] sunGlowObject not found on sun.');
            if (!sunLensflare) console.warn('[DEBUG] sunLensflare not found on sun.');

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
            scene.add(ambientLight);

            const totalPlanets = planetData.length;
            for (let i = 0; i < totalPlanets; i++) {
                const data = planetData[i];
                updateProgress(`Generating ${data.displayName}...`, 10 + (i / totalPlanets) * 40);
                await yieldThread();
                createPlanet(data);
            }

            updateProgress("Generating Asteroid Belt...", 50);
            await yieldThread();
            await createAsteroidBeltAsync();

            updateProgress("Generating Kuiper Belt...", 70);
            await yieldThread();
            createKuiperBelt();

            updateProgress("Generating Starfield...", 80);
            await yieldThread();
            createStarfield();

            updateProgress("Generating Nebulae...", 85);
            await yieldThread();
            createDistantNebulae();

            updateProgress("Creating Comets...", 90);
            await yieldThread();
            // --- Create Comets with Metric Data ---
            createComet({
                name: "HalleyTypeComet", displayName: "哈雷型彗星", type: "彗星",
                orbitRadius: 200, orbitSemiMajorAxisAU: 17.834, e: 0.967,
                coreRadius: 0.1, coreRadiusMetric: 5.5, // Approx Halley nucleus radius in km
                speed: 0.0020, rotationSpeed: 0.005, coreColor: 0xe0e0ff, tailColor: 0xb0c0ff,
                initialOrbitRotationX: Math.PI / 4, initialOrbitRotationY: Math.PI / 3, tailInitialLengthFactor: 5
            });

            createComet({
                name: "LongPeriodExampleComet", displayName: "长周期彗星 (LP-1)", type: "彗星",
                orbitRadius: 450, orbitSemiMajorAxisAU: 20000, e: 0.995,
                coreRadius: 0.30, coreRadiusMetric: 10,
                speed: 0.0007, rotationSpeed: 0.003, coreColor: 0xd0f0e0, coreEmissive: 0xccffdd, tailColor: 0xa0d0b0,
                tailParticleCount: 1000, initialOrbitRotationX: Math.PI / 2.5, initialOrbitRotationY: Math.PI * 1.2, tailInitialLengthFactor: 6.5
            });

            createComet({
                name: "ShortPeriodExampleComet", displayName: "短周期彗星 (SP-1)", type: "彗星",
                orbitRadius: 90, orbitSemiMajorAxisAU: 3.5, e: 0.75,
                coreRadius: 0.18, coreRadiusMetric: 2,
                speed: 0.0045, rotationSpeed: 0.007, coreColor: 0xf0e0d0, coreEmissive: 0xffeedd, tailColor: 0xd0b090,
                tailParticleCount: 600, initialOrbitRotationX: -Math.PI / 8, initialOrbitRotationY: Math.PI * 0.5, tailInitialLengthFactor: 4
            });

            updateProgress("Finalizing Simulation...", 95);
            await yieldThread();

            window.addEventListener('resize', onWindowResize, false);
            window.addEventListener('pointerdown', onPointerDown, false);
            window.addEventListener('pointerup', onPointerUp, false);

            console.log("太阳系模拟初始化完成 (动态小行星带, 增强柯伊伯带, 精确数据字段, 矮行星系统)。");
            updateProgress("Initialization Complete!", 100);
            
            // Check for SEO page auto-focus
            if (window.INITIAL_PLANET) {
                const targetObjInfo = celestialObjects.find(obj => 
                    (obj.displayName && obj.displayName.toLowerCase() === window.INITIAL_PLANET.toLowerCase()) ||
                    (obj.name && obj.name.toLowerCase() === window.INITIAL_PLANET.toLowerCase()) ||
                    (obj.mesh && obj.mesh.userData && obj.mesh.userData.displayName && obj.mesh.userData.displayName.toLowerCase() === window.INITIAL_PLANET.toLowerCase())
                );
                
                if (targetObjInfo && targetObjInfo.mesh) {
                    const data = targetObjInfo.mesh.userData || targetObjInfo;
                    
                    // Directly apply the tracking camera logic
                    trackedObject = targetObjInfo.mesh;
                    isTransitioningCamera = true;
                    
                    const targetPosition = new THREE.Vector3();
                    targetObjInfo.mesh.getWorldPosition(targetPosition);
                    targetObjInfo.mesh.userData._lastPos = targetPosition.clone();
                    
                    const objectRadius = data.radius || 1;
                    const minDistance = data.type && data.type.toLowerCase() === "star" ? 60 : 5;
                    const distance = Math.max(objectRadius * 4, minDistance);
                    
                    const offset = camera.position.clone().sub(controls.target).normalize();
                    if (offset.length() < 0.1) offset.set(0, 0, 1);
                    offset.multiplyScalar(distance);
                    
                    const newCamPos = targetPosition.clone().add(offset);
                    
                    new TWEEN.Tween(camera.position)
                        .to({ x: newCamPos.x, y: newCamPos.y, z: newCamPos.z }, 2000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onComplete(() => { isTransitioningCamera = false; })
                        .start();
                        
                    new TWEEN.Tween(controls.target)
                        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 2000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .start();
                        
                    // Make the info panel show up
                    document.getElementById('info-title').innerText = data.displayName || 'Unknown';
                    document.getElementById('info-name').innerText = `Name: ${data.displayName || 'Unknown'}`;
                    document.getElementById('info-type').innerText = `Type: ${data.type || 'Unknown'}`;
                    document.getElementById('info-radius-metric').innerText = `Radius (km): ${data.radiusMetric !== undefined ? data.radiusMetric.toLocaleString() : 'N/A'}`;
                    document.getElementById('info-radius-relative').innerText = `Radius (Earth=1): ${data.radius !== undefined ? data.radius.toFixed(2) : 'N/A'}`;
                    document.getElementById('info-orbit-au').innerText = `Orbital Semi-Major Axis (AU): ${data.orbitSemiMajorAxisAU !== undefined ? data.orbitSemiMajorAxisAU.toLocaleString(undefined, {minimumFractionDigits: 3}) : 'N/A'}`;
                    document.getElementById('info-orbit-scene').innerText = `Orbit (Scene Units): ${data.orbitRadius !== undefined ? (data.orbitRadius === 0 && data.type === "Star" ? "Center" : data.orbitRadius.toFixed(1)) : 'N/A'}`;
                    document.getElementById('info-eccentricity').innerText = `Orbital Eccentricity: ${data.e !== undefined ? data.e.toFixed(4) : (data.eccentricity !== undefined ? data.eccentricity.toFixed(4) : 'N/A')}`;
                    document.getElementById('info-panel').style.display = 'block';
                }
            }
            
            const screen = document.getElementById('loading-screen');
            if (screen) {
                screen.classList.add('fade-out');
                setTimeout(() => screen.style.display = 'none', 1000);
            }
        }

        function createProceduralTexture(width, height, drawFunction) { /* ... NO CHANGE ... */
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            drawFunction(context, width, height);
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.needsUpdate = true;
            return texture;
        }

        const const_shader_noise_functions = ` /* ... NO CHANGE ... */
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 =   v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute(
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }
            float fbm(vec3 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 6; i++) {
                    value += amplitude * snoise(p);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
        `;

        function createSun() { // Added metric data to userData
            const sunGeometry = new THREE.SphereGeometry(sunRadiusVisual, 64, 64); // Use visual radius for geometry
            const sunMaterial = new THREE.ShaderMaterial({ /* ... NO CHANGE ... */
                uniforms: {
                    time: shaderUniforms.time,
                    uColor1: { value: new THREE.Color(0xFF8C00) },
                    uColor2: { value: new THREE.Color(0xFFD700) },
                    uColor3: { value: new THREE.Color(0xFF4500) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 uColor1;
                    uniform vec3 uColor2;
                    uniform vec3 uColor3;
                    varying vec2 vUv;
                    ${const_shader_noise_functions}

                    void main() {
                        float noiseSpeed = 0.25;
                        float noiseScale = 2.5;
                        float displacement = fbm(vec3(vUv * noiseScale, time * noiseSpeed)) * 0.5 + 0.5;
                        
                        float noiseSpeed2 = 0.1;
                        float noiseScale2 = 5.0;
                        float displacement2 = fbm(vec3(vUv * noiseScale2 + vec2(5.0, 3.0), time * noiseSpeed2)) * 0.5 + 0.5;

                        float combinedNoise = smoothstep(0.3, 0.7, displacement * 0.55 + displacement2 * 0.45);

                        vec3 color = mix(uColor1, uColor2, combinedNoise);
                        color = mix(color, uColor3, pow(combinedNoise, 2.5) * 0.6);
                        
                        float brightSpotNoise = snoise(vec3(vUv * 12.0, time * 0.6));
                        float brightSpots = smoothstep(0.5, 0.8, pow(brightSpotNoise, 3.0));
                        color = mix(color, vec3(1.0, 0.95, 0.8), brightSpots * 0.6);

                        gl_FragColor = vec4(color, 1.0);
                    }
                `
            });

            const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
            sunMesh.name = "Sun";
            sunMesh.userData = {
                displayName: sunDisplayName,
                type: "Stellar",
                radius: sunRadiusVisual,         // Visual radius for scene scale
                radiusMetric: sunRadiusMetric,   // Actual radius in km
                orbitRadius: 0,                  // Sun is the center (scene units)
                orbitSemiMajorAxisAU: 0          // Sun is the center (AU)
            };

            const pointLight = new THREE.PointLight(0xffffff, 2.0, 3000); /* ... NO CHANGE ... */
            pointLight.castShadow = true;
            pointLight.shadow.mapSize.width = 2048;
            pointLight.shadow.mapSize.height = 2048;
            pointLight.shadow.bias = -0.0001;
            sunMesh.add(pointLight);

            const flareColor = new THREE.Color(0xffffff); /* ... NO CHANGE ... */
            const createFlareTexture = (size, drawFunc) => {
                return createProceduralTexture(size, size, (ctx, w, h) => {
                    drawFunc(ctx, w, h, flareColor);
                });
            };
            const textureFlare0 = createFlareTexture(256, (ctx, w, h, color) => {
                const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
                gradient.addColorStop(0.0, `rgba(${color.r*255},${color.g*255},${color.b*255},0.4)`);
                gradient.addColorStop(0.3, `rgba(${color.r*255},${color.g*255},${color.b*255},0.2)`);
                gradient.addColorStop(1.0, `rgba(${color.r*255},${color.g*255},${color.b*255},0.0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0,0,w,h);
            });
            const textureFlareHex = createFlareTexture(128, (ctx, w, h, color) => {
                ctx.fillStyle = `rgba(${color.r*255},${color.g*255},${color.b*255},0.5)`;
                const S = w / 2;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) { ctx.lineTo(S + S * Math.cos(i * 2 * Math.PI / 6), S + S * Math.sin(i * 2 * Math.PI / 6)); }
                ctx.closePath(); ctx.fill();
            });
             const textureFlareRing = createFlareTexture(128, (ctx, w, h, color) => {
                ctx.strokeStyle = `rgba(${color.r*255},${color.g*255},${color.b*255},0.5)`;
                ctx.lineWidth = w * 0.1; ctx.beginPath(); ctx.arc(w/2, h/2, w*0.4, 0, 2*Math.PI); ctx.stroke();
            });

            const lensflare = new THREE.Lensflare(); /* ... NO CHANGE ... */
            lensflare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0, pointLight.color));
            lensflare.addElement(new THREE.LensflareElement(textureFlareHex, 60, 0.6, pointLight.color.clone().lerp(new THREE.Color(0x88ffff), 0.5)));
            lensflare.addElement(new THREE.LensflareElement(textureFlareHex, 70, 0.7, pointLight.color.clone().lerp(new THREE.Color(0xff88ff), 0.5)));
            lensflare.addElement(new THREE.LensflareElement(textureFlareRing, 120, 0.9, pointLight.color.clone().lerp(new THREE.Color(0xffff88), 0.5)));
            lensflare.addElement(new THREE.LensflareElement(textureFlareHex, 100, 1.0, pointLight.color.clone().lerp(new THREE.Color(0xffaa88), 0.5)));
            lensflare.name = "sunLensflareSystem";
            pointLight.add(lensflare);


            const glowMaterial = new THREE.SpriteMaterial({ /* ... NO CHANGE ... */
                map: createProceduralTexture(128, 128, (ctx, w, h) => {
                    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
                    grad.addColorStop(0.0, 'rgba(255, 220, 180, 0.7)');
                    grad.addColorStop(0.2, 'rgba(255, 200, 100, 0.5)');
                    grad.addColorStop(0.5, 'rgba(255, 160, 0, 0.2)');
                    grad.addColorStop(1.0, 'rgba(255, 120, 0, 0.0)');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0,0,w,h);
                }),
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthWrite: false,
            });
            const sunGlow = new THREE.Sprite(glowMaterial); /* ... NO CHANGE ... */
            sunGlow.scale.set(sunRadiusVisual * 6, sunRadiusVisual * 6, 1.0); // Use visual radius
            sunGlow.name = "sunGlowSprite";
            sunMesh.add(sunGlow);

            return sunMesh;
        }

        function createPlanet(planetData) { // userData now includes metric values from planetData
            let planetMaterial;
            let texture;
            // Use planetData.radius for geometry (visual radius)
            const visualRadius = planetData.radius;

            if (planetData.isEarth) { /* ... ULTRA-REALISTIC EARTH TEXTURE ... */
                texture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                    // 创建更高质量的地球纹理
                    
                    // 1. 海洋基础层 - 深邃的海洋渐变
                    const oceanGradient = ctx.createLinearGradient(0, 0, 0, h);
                    oceanGradient.addColorStop(0, '#1a4d7a');    // 深蓝（北极）
                    oceanGradient.addColorStop(0.3, '#2e5f8a');  // 中蓝
                    oceanGradient.addColorStop(0.5, '#1e5085');  // 深蓝（赤道）
                    oceanGradient.addColorStop(0.7, '#2e5f8a');  // 中蓝
                    oceanGradient.addColorStop(1, '#1a4d7a');    // 深蓝（南极）
                    ctx.fillStyle = oceanGradient;
                    ctx.fillRect(0, 0, w, h);
                    
                    // 2. 添加海洋深度变化
                    ctx.globalAlpha = 0.3;
                    for(let i = 0; i < 200; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const radius = Math.random() * 20 + 5;
                        const depthGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                        depthGradient.addColorStop(0, 'rgba(30, 60, 90, 0.4)');
                        depthGradient.addColorStop(1, 'rgba(20, 40, 70, 0.1)');
                        ctx.fillStyle = depthGradient;
                        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 3. 超真实大陆系统 - 基于真实地理分布
                    const continents = [
                        // 北美洲 - 更精确的形状和位置
                        { 
                            x: 0.12, y: 0.22, w: 0.28, h: 0.45, color: '#4a7c59',
                            details: [
                                // 阿拉斯加
                                { x: 0.05, y: 0.08, w: 0.08, h: 0.12, color: '#5d8a6b' },
                                // 格陵兰
                                { x: 0.35, y: 0.05, w: 0.06, h: 0.15, color: '#e8f4f8' },
                                // 佛罗里达
                                { x: 0.22, y: 0.35, w: 0.03, h: 0.08, color: '#4a7c59' }
                            ]
                        },
                        // 南美洲 - 更真实的轮廓
                        { 
                            x: 0.18, y: 0.52, w: 0.12, h: 0.42, color: '#5d8a6b',
                            details: [
                                // 亚马逊盆地
                                { x: 0.22, y: 0.65, w: 0.06, h: 0.15, color: '#6b9b7a' },
                                // 巴塔哥尼亚
                                { x: 0.25, y: 0.88, w: 0.04, h: 0.08, color: '#8b7355' }
                            ]
                        },
                        // 欧洲 - 包含更多细节
                        { 
                            x: 0.42, y: 0.15, w: 0.15, h: 0.28, color: '#4a7c59',
                            details: [
                                // 斯堪的纳维亚半岛
                                { x: 0.45, y: 0.08, w: 0.04, h: 0.12, color: '#5d8a6b' },
                                // 英国
                                { x: 0.38, y: 0.18, w: 0.02, h: 0.03, color: '#4a7c59' },
                                // 意大利
                                { x: 0.46, y: 0.28, w: 0.015, h: 0.04, color: '#4a7c59' }
                            ]
                        },
                        // 非洲 - 更准确的位置和形状
                        { 
                            x: 0.46, y: 0.32, w: 0.16, h: 0.5, color: '#8b7355',
                            details: [
                                // 撒哈拉沙漠
                                { x: 0.48, y: 0.35, w: 0.12, h: 0.08, color: '#d4a574' },
                                // 刚果盆地
                                { x: 0.48, y: 0.55, w: 0.08, h: 0.12, color: '#6b9b7a' },
                                // 马达加斯加
                                { x: 0.62, y: 0.65, w: 0.02, h: 0.06, color: '#5d8a6b' }
                            ]
                        },
                        // 亚洲 - 最大的大陆，更多细节
                        { 
                            x: 0.58, y: 0.08, w: 0.38, h: 0.65, color: '#4a7c59',
                            details: [
                                // 西伯利亚
                                { x: 0.65, y: 0.05, w: 0.25, h: 0.15, color: '#e8f4f8' },
                                // 中国
                                { x: 0.75, y: 0.25, w: 0.12, h: 0.15, color: '#5d8a6b' },
                                // 印度
                                { x: 0.68, y: 0.42, w: 0.06, h: 0.08, color: '#6b9b7a' },
                                // 东南亚群岛
                                { x: 0.78, y: 0.52, w: 0.15, h: 0.08, color: '#5d8a6b' },
                                // 日本
                                { x: 0.88, y: 0.28, w: 0.03, h: 0.08, color: '#4a7c59' }
                            ]
                        },
                        // 澳洲 - 更准确的位置
                        { 
                            x: 0.78, y: 0.68, w: 0.12, h: 0.12, color: '#8b7355',
                            details: [
                                // 新西兰
                                { x: 0.92, y: 0.78, w: 0.02, h: 0.04, color: '#4a7c59' },
                                // 新几内亚
                                { x: 0.82, y: 0.62, w: 0.04, h: 0.06, color: '#5d8a6b' }
                            ]
                        },
                        // 南极洲
                        { 
                            x: 0.3, y: 0.92, w: 0.4, h: 0.06, color: '#f0f8ff',
                            details: []
                        }
                    ];
                    
                    continents.forEach(continent => {
                        // 绘制主要大陆块
                        drawDetailedContinent(ctx, continent, w, h);
                        
                        // 绘制大陆细节
                        continent.details.forEach(detail => {
                            drawDetailedContinent(ctx, detail, w, h);
                        });
                    });
                    
                    // 绘制详细大陆的函数
                    function drawDetailedContinent(ctx, continent, w, h) {
                        ctx.fillStyle = continent.color;
                        
                        const centerX = continent.x * w;
                        const centerY = continent.y * h;
                        const width = continent.w * w;
                        const height = continent.h * h;
                        
                        // 创建更自然的大陆形状
                        ctx.beginPath();
                        const points = 16; // 增加点数以获得更精确的形状
                        
                        for(let i = 0; i < points; i++) {
                            const angle = (i / points) * Math.PI * 2;
                            
                            // 基于真实大陆形状的半径变化
                            let radiusVariation = 1.0;
                            if(continent.color.includes('e8f4f8')) {
                                // 冰雪覆盖区域（格陵兰、西伯利亚）
                                radiusVariation = 0.6 + Math.random() * 0.3;
                            } else if(continent.color === '#d4a574') {
                                // 沙漠区域
                                radiusVariation = 0.8 + Math.random() * 0.4;
                            } else if(continent.color === '#8b7355') {
                                // 干燥地区
                                radiusVariation = 0.7 + Math.random() * 0.5;
                            } else {
                                // 森林/草原地区
                                radiusVariation = 0.6 + Math.random() * 0.7;
                            }
                            
                            const radiusX = (width / 2) * radiusVariation;
                            const radiusY = (height / 2) * radiusVariation;
                            
                            const x = centerX + Math.cos(angle) * radiusX;
                            const y = centerY + Math.sin(angle) * radiusY;
                            
                            if(i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.closePath();
                        ctx.fill();
                        
                        // 添加地形细节
                        const detailCount = Math.floor(width * height / 5000); // 基于面积确定细节数量
                        
                        ctx.globalAlpha = 0.6;
                        for(let i = 0; i < detailCount; i++) {
                            const x = centerX + (Math.random() - 0.5) * width;
                            const y = centerY + (Math.random() - 0.5) * height;
                            const radius = Math.random() * 8 + 2;
                            
                            // 根据大陆类型添加不同的地形
                            if(continent.color.includes('e8f4f8')) {
                                // 冰雪地区
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                            } else if(continent.color === '#d4a574') {
                                // 沙漠
                                ctx.fillStyle = 'rgba(205, 170, 125, 0.4)';
                            } else if(continent.color === '#8b7355') {
                                // 干燥地区
                                ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
                            } else {
                                // 植被地区
                                const terrainType = Math.random();
                                if(terrainType < 0.4) {
                                    // 森林
                                    ctx.fillStyle = 'rgba(34, 85, 34, 0.4)';
                                } else if(terrainType < 0.7) {
                                    // 山脉
                                    ctx.fillStyle = 'rgba(139, 90, 43, 0.3)';
                                } else {
                                    // 平原
                                    ctx.fillStyle = 'rgba(144, 238, 144, 0.3)';
                                }
                            }
                            
                            ctx.beginPath();
                            ctx.arc(x, y, radius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.globalAlpha = 1.0;
                    }
                    
                    // 4. 超真实水文系统 - 基于真实河流分布
                    ctx.globalAlpha = 0.7;
                    
                    // 主要河流系统
                    const majorRivers = [
                        // 亚马逊河
                        { startX: 0.25, startY: 0.65, points: 25, width: 3, color: 'rgba(65, 105, 225, 0.8)' },
                        // 尼罗河
                        { startX: 0.52, startY: 0.45, points: 30, width: 2, color: 'rgba(70, 130, 180, 0.7)' },
                        // 长江
                        { startX: 0.82, startY: 0.35, points: 20, width: 2, color: 'rgba(100, 149, 237, 0.7)' },
                        // 密西西比河
                        { startX: 0.22, startY: 0.32, points: 22, width: 2, color: 'rgba(65, 105, 225, 0.7)' },
                        // 伏尔加河
                        { startX: 0.52, startY: 0.18, points: 18, width: 1.5, color: 'rgba(70, 130, 180, 0.6)' },
                        // 恒河
                        { startX: 0.72, startY: 0.42, points: 16, width: 1.5, color: 'rgba(100, 149, 237, 0.6)' }
                    ];
                    
                    majorRivers.forEach(river => {
                        ctx.strokeStyle = river.color;
                        ctx.lineWidth = river.width;
                        ctx.beginPath();
                        
                        const startX = river.startX * w;
                        const startY = river.startY * h;
                        ctx.moveTo(startX, startY);
                        
                        // 创建自然的河流路径
                        let currentX = startX;
                        let currentY = startY;
                        
                        for(let j = 0; j < river.points; j++) {
                            // 河流的自然弯曲
                            const curve = Math.sin(j * 0.3) * 15;
                            currentX += (Math.random() - 0.4) * 25 + curve;
                            currentY += (Math.random() - 0.3) * 20;
                            ctx.lineTo(currentX, currentY);
                        }
                        ctx.stroke();
                    });
                    
                    // 添加湖泊
                    const lakes = [
                        { x: 0.22, y: 0.28, radius: 8 },   // 五大湖区
                        { x: 0.55, y: 0.18, radius: 6 },   // 贝加尔湖
                        { x: 0.18, y: 0.42, radius: 5 },   // 大湖地区
                        { x: 0.48, y: 0.58, radius: 4 },   // 维多利亚湖
                        { x: 0.25, y: 0.72, radius: 3 }    // 巴拉圭湖系
                    ];
                    
                    lakes.forEach(lake => {
                        const lakeGradient = ctx.createRadialGradient(
                            lake.x * w, lake.y * h, 0,
                            lake.x * w, lake.y * h, lake.radius
                        );
                        lakeGradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
                        lakeGradient.addColorStop(1, 'rgba(70, 130, 180, 0.4)');
                        
                        ctx.fillStyle = lakeGradient;
                        ctx.beginPath();
                        ctx.arc(lake.x * w, lake.y * h, lake.radius, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    ctx.globalAlpha = 1.0;
                    
                    // 5. 高分辨率多层云系统
                    const cloudLayers = [
                        { alpha: 0.25, color: 'rgba(255, 255, 255, 0.4)', count: 120, size: [15, 40] },
                        { alpha: 0.2, color: 'rgba(240, 248, 255, 0.5)', count: 180, size: [10, 25] },
                        { alpha: 0.15, color: 'rgba(230, 230, 250, 0.3)', count: 240, size: [6, 18] }
                    ];
                    
                    cloudLayers.forEach(layer => {
                        ctx.globalAlpha = layer.alpha;
                        for(let i = 0; i < layer.count; i++) {
                            const x = Math.random() * w;
                            const y = Math.random() * h;
                            const radius = Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0];
                            
                            // 创建云朵团
                            const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                            cloudGradient.addColorStop(0, layer.color);
                            cloudGradient.addColorStop(0.7, layer.color.replace(/[\d.]+\)$/, '0.2)'));
                            cloudGradient.addColorStop(1, layer.color.replace(/[\d.]+\)$/, '0)'));
                            
                            ctx.fillStyle = cloudGradient;
                            ctx.beginPath();
                            ctx.arc(x, y, radius, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 添加云朵细节
                            for(let j = 0; j < 3; j++) {
                                const detailX = x + (Math.random() - 0.5) * radius;
                                const detailY = y + (Math.random() - 0.5) * radius;
                                const detailRadius = radius * (0.3 + Math.random() * 0.4);
                                
                                ctx.fillStyle = layer.color;
                                ctx.beginPath();
                                ctx.arc(detailX, detailY, detailRadius, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                    });
                    ctx.globalAlpha = 1.0;
                    
                    // 6. 超高分辨率极地冰盖系统
                    // 北极 - 更复杂的多层冰盖
                    const northPoleGradient = ctx.createRadialGradient(w/2, 0, 0, w/2, 0, h*0.18);
                    northPoleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
                    northPoleGradient.addColorStop(0.3, 'rgba(248, 248, 255, 0.9)');
                    northPoleGradient.addColorStop(0.6, 'rgba(235, 245, 255, 0.7)');
                    northPoleGradient.addColorStop(0.8, 'rgba(220, 235, 255, 0.4)');
                    northPoleGradient.addColorStop(1, 'rgba(200, 220, 255, 0.1)');
                    ctx.fillStyle = northPoleGradient;
                    ctx.fillRect(0, 0, w, h*0.18);
                    
                    // 北极冰盖裂缝和细节
                    ctx.globalAlpha = 0.3;
                    for(let i = 0; i < 50; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h * 0.15;
                        const length = Math.random() * 20 + 5;
                        
                        ctx.strokeStyle = 'rgba(200, 220, 255, 0.6)';
                        ctx.lineWidth = Math.random() * 2 + 0.5;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + (Math.random() - 0.5) * length, y + Math.random() * length);
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 南极 - 包含冰架系统
                    const southPoleGradient = ctx.createRadialGradient(w/2, h, 0, w/2, h, h*0.18);
                    southPoleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
                    southPoleGradient.addColorStop(0.3, 'rgba(248, 248, 255, 0.9)');
                    southPoleGradient.addColorStop(0.6, 'rgba(235, 245, 255, 0.7)');
                    southPoleGradient.addColorStop(0.8, 'rgba(220, 235, 255, 0.4)');
                    southPoleGradient.addColorStop(1, 'rgba(200, 220, 255, 0.1)');
                    ctx.fillStyle = southPoleGradient;
                    ctx.fillRect(0, h*0.82, w, h*0.18);
                    
                    // 南极冰架延伸
                    ctx.globalAlpha = 0.4;
                    const iceShelves = [
                        { x: 0.4, y: 0.85, w: 0.08, h: 0.03 },  // 罗斯冰架
                        { x: 0.6, y: 0.88, w: 0.06, h: 0.02 },  // 菲尔希纳冰架
                        { x: 0.3, y: 0.87, w: 0.04, h: 0.025 }   // 其他冰架
                    ];
                    
                    iceShelves.forEach(shelf => {
                        const shelfGradient = ctx.createLinearGradient(
                            shelf.x * w, shelf.y * h,
                            shelf.x * w, (shelf.y + shelf.h) * h
                        );
                        shelfGradient.addColorStop(0, 'rgba(240, 248, 255, 0.8)');
                        shelfGradient.addColorStop(1, 'rgba(200, 220, 255, 0.2)');
                        
                        ctx.fillStyle = shelfGradient;
                        ctx.fillRect(
                            shelf.x * w, shelf.y * h,
                            shelf.w * w, shelf.h * h
                        );
                    });
                    ctx.globalAlpha = 1.0;
                    
                    // 7. 大气散射效果
                    ctx.globalAlpha = 0.1;
                    const atmosphereGradient = ctx.createLinearGradient(0, 0, 0, h);
                    atmosphereGradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)');
                    atmosphereGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                    atmosphereGradient.addColorStop(1, 'rgba(135, 206, 235, 0.3)');
                    ctx.fillStyle = atmosphereGradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                    
                });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isJupiter) { /* ... ULTRA-REALISTIC JUPITER TEXTURE ... */
                texture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                    // 超真实木星纹理系统
                    
                    // 1. 基础大气层 - 模拟木星氢氦大气
                    const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
                    baseGradient.addColorStop(0, '#d4a574');     // 北极
                    baseGradient.addColorStop(0.1, '#c19660');   // 高纬度
                    baseGradient.addColorStop(0.25, '#cd853f');  // 中纬度
                    baseGradient.addColorStop(0.5, '#daa520');   // 赤道
                    baseGradient.addColorStop(0.75, '#cd853f');  // 中纬度
                    baseGradient.addColorStop(0.9, '#c19660');   // 高纬度
                    baseGradient.addColorStop(1, '#d4a574');     // 南极
                    ctx.fillStyle = baseGradient;
                    ctx.fillRect(0, 0, w, h);
                    
                    // 2. 木星复杂的带状系统 - 基于真实观测数据
                    const bands = [
                        // 北极区域
                        { y: 0.02, height: 0.04, color: '#e6d4c1', type: 'zone', alpha: 0.8 },
                        { y: 0.06, height: 0.03, color: '#cd853f', type: 'belt', alpha: 0.9 },
                        { y: 0.09, height: 0.04, color: '#f4e4c1', type: 'zone', alpha: 0.7 },
                        { y: 0.13, height: 0.03, color: '#b8860b', type: 'belt', alpha: 0.95 },
                        // 北温带
                        { y: 0.16, height: 0.05, color: '#daa520', type: 'zone', alpha: 0.8 },
                        { y: 0.21, height: 0.03, color: '#a0522d', type: 'belt', alpha: 0.9 },
                        { y: 0.24, height: 0.04, color: '#ffd700', type: 'zone', alpha: 0.75 },
                        // 北热带
                        { y: 0.28, height: 0.06, color: '#cd853f', type: 'belt', alpha: 0.85 },
                        { y: 0.34, height: 0.08, color: '#f0e68c', type: 'zone', alpha: 0.7 },
                        // 赤道区域（包含大红斑）
                        { y: 0.42, height: 0.04, color: '#b8860b', type: 'belt', alpha: 0.9 },
                        { y: 0.46, height: 0.08, color: '#daa520', type: 'zone', alpha: 0.75 },
                        // 南热带
                        { y: 0.54, height: 0.06, color: '#cd853f', type: 'belt', alpha: 0.85 },
                        { y: 0.60, height: 0.08, color: '#f0e68c', type: 'zone', alpha: 0.7 },
                        // 南温带
                        { y: 0.68, height: 0.04, color: '#ffd700', type: 'zone', alpha: 0.75 },
                        { y: 0.72, height: 0.03, color: '#a0522d', type: 'belt', alpha: 0.9 },
                        { y: 0.75, height: 0.05, color: '#daa520', type: 'zone', alpha: 0.8 },
                        // 南极区域
                        { y: 0.80, height: 0.03, color: '#b8860b', type: 'belt', alpha: 0.95 },
                        { y: 0.83, height: 0.04, color: '#f4e4c1', type: 'zone', alpha: 0.7 },
                        { y: 0.87, height: 0.03, color: '#cd853f', type: 'belt', alpha: 0.9 },
                        { y: 0.90, height: 0.04, color: '#e6d4c1', type: 'zone', alpha: 0.8 },
                        { y: 0.94, height: 0.04, color: '#d4a574', type: 'polar', alpha: 0.9 }
                    ];
                    
                    bands.forEach(band => {
                        const bandY = band.y * h;
                        const bandHeight = band.height * h;
                        
                        // 创建带状渐变
                        const bandGradient = ctx.createLinearGradient(0, bandY, 0, bandY + bandHeight);
                        if(band.type === 'belt') {
                            // 暗带 - 更深的颜色
                            bandGradient.addColorStop(0, band.color.replace(')', ', 0.7)').replace('rgb', 'rgba'));
                            bandGradient.addColorStop(0.5, band.color.replace(')', `, ${band.alpha})`).replace('rgb', 'rgba'));
                            bandGradient.addColorStop(1, band.color.replace(')', ', 0.7)').replace('rgb', 'rgba'));
                        } else {
                            // 亮区 - 更亮的颜色
                            bandGradient.addColorStop(0, band.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
                            bandGradient.addColorStop(0.5, band.color.replace(')', `, ${band.alpha})`).replace('rgb', 'rgba'));
                            bandGradient.addColorStop(1, band.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
                        }
                        
                        ctx.fillStyle = bandGradient;
                        ctx.fillRect(0, bandY, w, bandHeight);
                        
                        // 添加带状湍流细节
                        ctx.globalAlpha = band.alpha * 0.4;
                        for(let i = 0; i < 200; i++) {
                            const x = Math.random() * w;
                            const y = bandY + Math.random() * bandHeight;
                            const size = Math.random() * 4 + 1;
                            
                            const turbulenceGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                            turbulenceGradient.addColorStop(0, band.color);
                            turbulenceGradient.addColorStop(1, band.color.replace(')', ', 0)').replace('rgb', 'rgba'));
                            
                            ctx.fillStyle = turbulenceGradient;
                            ctx.fillRect(x - size, y - size, size * 2, size * 2);
                        }
                        ctx.globalAlpha = 1.0;
                    });
                    
                    // 3. 木星大红斑 - 超级风暴系统
                    const greatRedSpot = {
                        x: 0.62, y: 0.45, width: 0.12, height: 0.08, rotation: -Math.PI / 8
                    };
                    
                    // 大红斑主体
                    const grsX = greatRedSpot.x * w;
                    const grsY = greatRedSpot.y * h;
                    const grsWidth = greatRedSpot.width * w;
                    const grsHeight = greatRedSpot.height * h;
                    
                    ctx.save();
                    ctx.translate(grsX, grsY);
                    ctx.rotate(greatRedSpot.rotation);
                    
                    // 大红斑渐变 - 模拟真实的 storm 结构
                    const grsGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, grsWidth/2);
                    grsGradient.addColorStop(0, 'rgba(178, 34, 34, 0.9)');      // 深红中心
                    grsGradient.addColorStop(0.3, 'rgba(220, 20, 60, 0.8)');    // 红色中层
                    grsGradient.addColorStop(0.6, 'rgba(255, 69, 0, 0.6)');     // 橙红色
                    grsGradient.addColorStop(0.8, 'rgba(255, 140, 0, 0.3)');   // 浅橙色
                    grsGradient.addColorStop(1, 'rgba(255, 165, 0, 0.1)');     // 边缘透明
                    
                    ctx.fillStyle = grsGradient;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, grsWidth/2, grsHeight/2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 大红斑内部涡旋结构
                    ctx.globalAlpha = 0.6;
                    for(let spiral = 0; spiral < 3; spiral++) {
                        ctx.strokeStyle = 'rgba(139, 0, 0, 0.8)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        
                        for(let angle = 0; angle < Math.PI * 6; angle += 0.05) {
                            const radius = (angle / (Math.PI * 6)) * Math.min(grsWidth, grsHeight) * 0.4;
                            const x = Math.cos(angle + spiral * Math.PI * 2 / 3) * radius;
                            const y = Math.sin(angle + spiral * Math.PI * 2 / 3) * radius * 0.7;
                            
                            if(angle === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;
                    ctx.restore();
                    
                    // 4. 其他椭圆形风暴（白斑等）
                    const storms = [
                        { x: 0.25, y: 0.35, width: 0.04, height: 0.02, color: '#f5f5dc', alpha: 0.7 },
                        { x: 0.75, y: 0.25, width: 0.03, height: 0.015, color: '#ffffff', alpha: 0.8 },
                        { x: 0.45, y: 0.65, width: 0.05, height: 0.025, color: '#f5f5dc', alpha: 0.6 },
                        { x: 0.15, y: 0.55, width: 0.035, height: 0.02, color: '#ffffff', alpha: 0.7 },
                        { x: 0.85, y: 0.70, width: 0.04, height: 0.02, color: '#f5f5dc', alpha: 0.6 }
                    ];
                    
                    storms.forEach(storm => {
                        const stormX = storm.x * w;
                        const stormY = storm.y * h;
                        const stormWidth = storm.width * w;
                        const stormHeight = storm.height * h;
                        
                        const stormGradient = ctx.createRadialGradient(
                            stormX, stormY, 0,
                            stormX, stormY, stormWidth/2
                        );
                        stormGradient.addColorStop(0, storm.color.replace(')', `, ${storm.alpha})`).replace('rgb', 'rgba'));
                        stormGradient.addColorStop(0.7, storm.color.replace(')', `, ${storm.alpha * 0.5})`).replace('rgb', 'rgba'));
                        stormGradient.addColorStop(1, storm.color.replace(')', ', 0)').replace('rgb', 'rgba'));
                        
                        ctx.fillStyle = stormGradient;
                        ctx.beginPath();
                        ctx.ellipse(stormX, stormY, stormWidth/2, stormHeight/2, 0, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    // 5. 湍流和复杂气流模式
                    ctx.globalAlpha = 0.3;
                    for(let i = 0; i < 50; i++) {
                        const centerX = Math.random() * w;
                        const centerY = Math.random() * h;
                        const radius = Math.random() * 30 + 10;
                        
                        // 创建湍流涡旋
                        const turbulenceGradient = ctx.createRadialGradient(
                            centerX, centerY, 0,
                            centerX, centerY, radius
                        );
                        turbulenceGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
                        turbulenceGradient.addColorStop(0.5, 'rgba(218, 165, 32, 0.2)');
                        turbulenceGradient.addColorStop(1, 'rgba(184, 134, 11, 0.1)');
                        
                        ctx.fillStyle = turbulenceGradient;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 添加涡旋线条
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        for(let angle = 0; angle < Math.PI * 2; angle += 0.2) {
                            const x = centerX + Math.cos(angle) * radius * 0.8;
                            const y = centerY + Math.sin(angle) * radius * 0.8;
                            
                            if(angle === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 6. 极地特征
                    // 北极涡旋
                    const northPoleGradient = ctx.createRadialGradient(w/2, 0, 0, w/2, 0, h*0.08);
                    northPoleGradient.addColorStop(0, 'rgba(135, 206, 235, 0.6)');
                    northPoleGradient.addColorStop(0.5, 'rgba(176, 196, 222, 0.3)');
                    northPoleGradient.addColorStop(1, 'rgba(210, 180, 140, 0.1)');
                    ctx.fillStyle = northPoleGradient;
                    ctx.fillRect(0, 0, w, h*0.08);
                    
                    // 南极涡旋
                    const southPoleGradient = ctx.createRadialGradient(w/2, h, 0, w/2, h, h*0.08);
                    southPoleGradient.addColorStop(0, 'rgba(135, 206, 235, 0.6)');
                    southPoleGradient.addColorStop(0.5, 'rgba(176, 196, 222, 0.3)');
                    southPoleGradient.addColorStop(1, 'rgba(210, 180, 140, 0.1)');
                    ctx.fillStyle = southPoleGradient;
                    ctx.fillRect(0, h*0.92, w, h*0.08);
                    
                    // 7. 大气散射效果
                    ctx.globalAlpha = 0.12;
                    const atmosphereGradient = ctx.createLinearGradient(0, 0, 0, h);
                    atmosphereGradient.addColorStop(0, 'rgba(255, 248, 220, 0.3)');
                    atmosphereGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                    atmosphereGradient.addColorStop(1, 'rgba(255, 248, 220, 0.3)');
                    ctx.fillStyle = atmosphereGradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                    
                });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isVenus) { /* ... ULTRA-REALISTIC VENUS TEXTURE ... */
                texture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                    // 超真实金星纹理系统 - 基于麦哲伦探测器数据
                    
                    // 1. 基础大气层 - 浓厚的二氧化碳大气
                    const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
                    baseGradient.addColorStop(0, '#ffd4a3');     // 极地亮区
                    baseGradient.addColorStop(0.2, '#ffb366');   // 高纬度
                    baseGradient.addColorStop(0.4, '#ff9933');  // 中纬度
                    baseGradient.addColorStop(0.5, '#e67300');   // 赤道带
                    baseGradient.addColorStop(0.6, '#ff9933');  // 中纬度
                    baseGradient.addColorStop(0.8, '#ffb366');  // 高纬度
                    baseGradient.addColorStop(1, '#ffd4a3');     // 极地亮区
                    ctx.fillStyle = baseGradient;
                    ctx.fillRect(0, 0, w, h);
                    
                    // 2. 金星Y形云带系统 - 基于真实观测
                    const cloudBands = [
                        { y: 0.1, height: 0.05, color: '#ffcc99', alpha: 0.6 },
                        { y: 0.2, height: 0.08, color: '#ff9966', alpha: 0.8 },
                        { y: 0.35, height: 0.12, color: '#ff8c1a', alpha: 0.9 },
                        { y: 0.5, height: 0.08, color: '#e67300', alpha: 0.7 },
                        { y: 0.65, height: 0.12, color: '#ff8c1a', alpha: 0.9 },
                        { y: 0.8, height: 0.08, color: '#ff9966', alpha: 0.8 },
                        { y: 0.9, height: 0.05, color: '#ffcc99', alpha: 0.6 }
                    ];
                    
                    cloudBands.forEach(band => {
                        const bandY = band.y * h;
                        const bandHeight = band.height * h;
                        
                        const bandGradient = ctx.createLinearGradient(0, bandY, 0, bandY + bandHeight);
                        bandGradient.addColorStop(0, band.color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
                        bandGradient.addColorStop(0.5, band.color.replace(')', `, ${band.alpha})`).replace('rgb', 'rgba'));
                        bandGradient.addColorStop(1, band.color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
                        
                        ctx.fillStyle = bandGradient;
                        ctx.fillRect(0, bandY, w, bandHeight);
                        
                        // 添加云带纹理
                        ctx.globalAlpha = band.alpha * 0.3;
                        for(let i = 0; i < 50; i++) {
                            const x = Math.random() * w;
                            const y = bandY + Math.random() * bandHeight;
                            const size = Math.random() * 4 + 1;
                            
                            ctx.fillStyle = band.color.replace(')', ', 0.4)').replace('rgb', 'rgba');
                            ctx.beginPath();
                            ctx.arc(x, y, size, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        ctx.globalAlpha = 1.0;
                    });
                    
                    // 3. 火山平原区域 - 基于真实金星地质
                    const volcanicPlains = [
                        { x: 0.2, y: 0.3, w: 0.15, h: 0.1, color: '#cc6633' },
                        { x: 0.6, y: 0.4, w: 0.2, h: 0.15, color: '#b3592d' },
                        { x: 0.3, y: 0.7, w: 0.12, h: 0.08, color: '#cc6633' },
                        { x: 0.7, y: 0.2, w: 0.1, h: 0.12, color: '#b3592d' }
                    ];
                    
                    volcanicPlains.forEach(plain => {
                        const plainGradient = ctx.createRadialGradient(
                            plain.x * w, plain.y * h, 0,
                            plain.x * w, plain.y * h, Math.max(plain.w * w, plain.h * h) * 0.5
                        );
                        plainGradient.addColorStop(0, plain.color);
                        plainGradient.addColorStop(1, plain.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
                        
                        ctx.fillStyle = plainGradient;
                        ctx.fillRect(
                            (plain.x - plain.w/2) * w, 
                            (plain.y - plain.h/2) * h, 
                            plain.w * w, 
                            plain.h * h
                        );
                    });
                    
                    // 4. 高地地形 - 金星大陆
                    ctx.globalAlpha = 0.4;
                    for(let i = 0; i < 30; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const radius = Math.random() * 20 + 10;
                        
                        const highlandGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                        highlandGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
                        highlandGradient.addColorStop(0.5, 'rgba(255, 220, 180, 0.3)');
                        highlandGradient.addColorStop(1, 'rgba(255, 200, 150, 0.1)');
                        
                        ctx.fillStyle = highlandGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 5. 大气散射效果
                    ctx.globalAlpha = 0.2;
                    const atmosphereGradient = ctx.createLinearGradient(0, 0, 0, h);
                    atmosphereGradient.addColorStop(0, 'rgba(255, 230, 180, 0.4)');
                    atmosphereGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
                    atmosphereGradient.addColorStop(1, 'rgba(255, 230, 180, 0.4)');
                    ctx.fillStyle = atmosphereGradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                    
                });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isMars) { /* ... ULTRA-REALISTIC MARS TEXTURE ... */
                texture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                    // 超真实火星纹理系统 - 基于火星探测器数据
                    
                    // 1. 基础地表 - 火星土壤基色
                    const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
                    baseGradient.addColorStop(0, '#d2691e');     // 北极
                    baseGradient.addColorStop(0.15, '#cd853f');  // 高纬度
                    baseGradient.addColorStop(0.4, '#b22222');  // 中纬度
                    baseGradient.addColorStop(0.5, '#8b0000');   // 赤道
                    baseGradient.addColorStop(0.6, '#b22222');  // 中纬度
                    baseGradient.addColorStop(0.85, '#cd853f');  // 高纬度
                    baseGradient.addColorStop(1, '#d2691e');     // 南极
                    ctx.fillStyle = baseGradient;
                    ctx.fillRect(0, 0, w, h);
                    
                    // 2. 极地冰盖系统
                    // 北极冰盖
                    const northPoleGradient = ctx.createRadialGradient(w/2, 0, 0, w/2, 0, h*0.15);
                    northPoleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                    northPoleGradient.addColorStop(0.3, 'rgba(240, 248, 255, 0.8)');
                    northPoleGradient.addColorStop(0.6, 'rgba(220, 235, 255, 0.4)');
                    northPoleGradient.addColorStop(1, 'rgba(200, 220, 255, 0.1)');
                    ctx.fillStyle = northPoleGradient;
                    ctx.fillRect(0, 0, w, h*0.15);
                    
                    // 南极冰盖
                    const southPoleGradient = ctx.createRadialGradient(w/2, h, 0, w/2, h, h*0.12);
                    southPoleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                    southPoleGradient.addColorStop(0.4, 'rgba(240, 248, 255, 0.7)');
                    southPoleGradient.addColorStop(0.7, 'rgba(220, 235, 255, 0.3)');
                    southPoleGradient.addColorStop(1, 'rgba(200, 220, 255, 0.1)');
                    ctx.fillStyle = southPoleGradient;
                    ctx.fillRect(0, h*0.88, w, h*0.12);
                    
                    // 3. 主要地质特征 - 基于真实火星地形
                    const features = [
                        // 水手峡谷系统
                        { x: 0.4, y: 0.4, w: 0.25, h: 0.08, type: 'canyon', color: '#8b4513' },
                        // 奥林匹斯山
                        { x: 0.3, y: 0.25, w: 0.08, h: 0.06, type: 'volcano', color: '#a0522d' },
                        // 塔尔西斯火山群
                        { x: 0.35, y: 0.3, w: 0.15, h: 0.1, type: 'volcanic', color: '#cd853f' },
                        // 希腊盆地
                        { x: 0.7, y: 0.7, w: 0.2, h: 0.15, type: 'basin', color: '#8b0000' },
                        // 阿拉伯高地
                        { x: 0.15, y: 0.2, w: 0.2, h: 0.25, type: 'highland', color: '#d2691e' }
                    ];
                    
                    features.forEach(feature => {
                        if (feature.type === 'canyon') {
                            // 水手峡谷的详细绘制
                            ctx.strokeStyle = feature.color;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(feature.x * w, feature.y * h);
                            ctx.lineTo((feature.x + feature.w) * w, (feature.y + feature.h * 0.3) * h);
                            ctx.lineTo((feature.x + feature.w * 0.8) * w, (feature.y + feature.h) * h);
                            ctx.stroke();
                            
                            // 峡谷阴影
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                            ctx.fillRect(feature.x * w, feature.y * h, feature.w * w, feature.h * h);
                        } else if (feature.type === 'volcano') {
                            // 火山锥形
                            const volcanoGradient = ctx.createRadialGradient(
                                feature.x * w, feature.y * h, 0,
                                feature.x * w, feature.y * h, Math.max(feature.w * w, feature.h * h) * 0.5
                            );
                            volcanoGradient.addColorStop(0, feature.color);
                            volcanoGradient.addColorStop(0.7, feature.color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
                            volcanoGradient.addColorStop(1, feature.color.replace(')', ', 0.2)').replace('rgb', 'rgba'));
                            
                            ctx.fillStyle = volcanoGradient;
                            ctx.beginPath();
                            ctx.arc(feature.x * w, feature.y * h, Math.max(feature.w * w, feature.h * h) * 0.5, 0, Math.PI * 2);
                            ctx.fill();
                        } else {
                            // 其他地质特征
                            const featureGradient = ctx.createRadialGradient(
                                feature.x * w, feature.y * h, 0,
                                feature.x * w, feature.y * h, Math.max(feature.w * w, feature.h * h) * 0.5
                            );
                            featureGradient.addColorStop(0, feature.color);
                            featureGradient.addColorStop(1, feature.color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
                            
                            ctx.fillStyle = featureGradient;
                            ctx.fillRect(
                                (feature.x - feature.w/2) * w, 
                                (feature.y - feature.h/2) * h, 
                                feature.w * w, 
                                feature.h * h
                            );
                        }
                    });
                    
                    // 4. 沙丘和风成地貌
                    ctx.globalAlpha = 0.6;
                    for(let i = 0; i < 100; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const width = Math.random() * 30 + 10;
                        const height = Math.random() * 15 + 5;
                        
                        const duneGradient = ctx.createLinearGradient(x, y, x + width, y + height);
                        duneGradient.addColorStop(0, 'rgba(205, 133, 63, 0.4)');
                        duneGradient.addColorStop(0.5, 'rgba(184, 134, 11, 0.6)');
                        duneGradient.addColorStop(1, 'rgba(160, 82, 45, 0.3)');
                        
                        ctx.fillStyle = duneGradient;
                        ctx.beginPath();
                        ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 5. 陨石坑分布
                    ctx.globalAlpha = 0.5;
                    for(let i = 0; i < 80; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const radius = Math.random() * 8 + 2;
                        
                        const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                        craterGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
                        craterGradient.addColorStop(0.7, 'rgba(139, 69, 19, 0.3)');
                        craterGradient.addColorStop(1, 'rgba(205, 133, 63, 0.1)');
                        
                        ctx.fillStyle = craterGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 陨石坑边缘
                        ctx.strokeStyle = 'rgba(160, 82, 45, 0.6)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 6. 尘埃和大气效果
                    ctx.globalAlpha = 0.15;
                    const dustGradient = ctx.createLinearGradient(0, 0, 0, h);
                    dustGradient.addColorStop(0, 'rgba(255, 200, 150, 0.3)');
                    dustGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.2)');
                    dustGradient.addColorStop(1, 'rgba(255, 200, 150, 0.3)');
                    ctx.fillStyle = dustGradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                    
                });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isMercury) { /* ... ULTRA-REALISTIC MERCURY TEXTURE ... */
                texture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                    // 超真实水星纹理系统 - 基于信使号探测器数据
                    
                    // 1. 基础地表 - 水星特有的灰褐色表面
                    const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
                    baseGradient.addColorStop(0, '#8b7d6b');     // 北极
                    baseGradient.addColorStop(0.2, '#6b5d4b');   // 高纬度
                    baseGradient.addColorStop(0.4, '#5b4d3b');   // 中纬度
                    baseGradient.addColorStop(0.5, '#4b3d2b');   // 赤道
                    baseGradient.addColorStop(0.6, '#5b4d3b');   // 中纬度
                    baseGradient.addColorStop(0.8, '#6b5d4b');   // 高纬度
                    baseGradient.addColorStop(1, '#8b7d6b');     // 南极
                    ctx.fillStyle = baseGradient;
                    ctx.fillRect(0, 0, w, h);
                    
                    // 2. 大型陨石坑系统 - 水星的标志性特征
                    const majorCraters = [
                        // 卡洛里盆地 - 水星最大的陨石坑
                        { x: 0.35, y: 0.45, radius: 40, type: 'basin', color: '#3b2d1b' },
                        // 其他主要陨石坑
                        { x: 0.6, y: 0.3, radius: 25, type: 'crater', color: '#4b3d2b' },
                        { x: 0.2, y: 0.6, radius: 20, type: 'crater', color: '#4b3d2b' },
                        { x: 0.8, y: 0.7, radius: 18, type: 'crater', color: '#4b3d2b' },
                        { x: 0.15, y: 0.25, radius: 15, type: 'crater', color: '#4b3d2b' }
                    ];
                    
                    majorCraters.forEach(crater => {
                        if (crater.type === 'basin') {
                            // 卡洛里盆地的多环结构
                            for(let ring = 0; ring < 3; ring++) {
                                const ringRadius = crater.radius * (1 - ring * 0.3);
                                const ringGradient = ctx.createRadialGradient(
                                    crater.x * w, crater.y * h, ringRadius * 0.5,
                                    crater.x * w, crater.y * h, ringRadius
                                );
                                ringGradient.addColorStop(0, 'rgba(59, 45, 27, 0.8)');
                                ringGradient.addColorStop(0.7, 'rgba(75, 61, 43, 0.4)');
                                ringGradient.addColorStop(1, 'rgba(91, 77, 59, 0.1)');
                                
                                ctx.fillStyle = ringGradient;
                                ctx.beginPath();
                                ctx.arc(crater.x * w, crater.y * h, ringRadius, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        } else {
                            // 普通陨石坑
                            const craterGradient = ctx.createRadialGradient(
                                crater.x * w, crater.y * h, 0,
                                crater.x * w, crater.y * h, crater.radius
                            );
                            craterGradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
                            // 安全地转换十六进制颜色值为rgba格式
                            const hexColor = crater.color.replace('#', '');
                            const r = parseInt(hexColor.substr(0, 2), 16);
                            const g = parseInt(hexColor.substr(2, 2), 16);
                            const b = parseInt(hexColor.substr(4, 2), 16);
                            craterGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.4)`);
                            craterGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`);
                            
                            ctx.fillStyle = craterGradient;
                            ctx.beginPath();
                            ctx.arc(crater.x * w, crater.y * h, crater.radius, 0, Math.PI * 2);
                            ctx.fill();
                            
                            // 陨石坑边缘
                            ctx.strokeStyle = 'rgba(107, 93, 75, 0.8)';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                    });
                    
                    // 3. 中小型陨石坑分布
                    ctx.globalAlpha = 0.7;
                    for(let i = 0; i < 200; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const radius = Math.random() * 12 + 2;
                        
                        const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                        craterGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
                        craterGradient.addColorStop(0.6, 'rgba(75, 61, 43, 0.3)');
                        craterGradient.addColorStop(1, 'rgba(107, 93, 75, 0.1)');
                        
                        ctx.fillStyle = craterGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 小陨石坑边缘
                        if (radius > 5) {
                            ctx.strokeStyle = 'rgba(91, 77, 59, 0.6)';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 4. 丘陵和山脉地形
                    ctx.globalAlpha = 0.4;
                    for(let i = 0; i < 50; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        const width = Math.random() * 40 + 10;
                        const height = Math.random() * 20 + 5;
                        
                        const hillGradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height));
                        hillGradient.addColorStop(0, 'rgba(139, 121, 107, 0.6)');
                        hillGradient.addColorStop(0.7, 'rgba(107, 93, 75, 0.3)');
                        hillGradient.addColorStop(1, 'rgba(75, 61, 43, 0.1)');
                        
                        ctx.fillStyle = hillGradient;
                        ctx.beginPath();
                        ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 5. 表面纹理细节
                    ctx.globalAlpha = 0.3;
                    for(let i = 0; i < 1000; i++) {
                        const x = Math.random() * w;
                        const y = Math.random() * h;
                        
                        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(107, 93, 75, 0.4)' : 'rgba(75, 61, 43, 0.3)';
                        ctx.fillRect(x, y, 1, 1);
                    }
                    ctx.globalAlpha = 1.0;
                    
                    // 6. 温度梯度效果（面向太阳的一侧更热）
                    const tempGradient = ctx.createLinearGradient(0, 0, w * 0.7, h * 0.3);
                    tempGradient.addColorStop(0, 'rgba(255, 200, 150, 0.1)');
                    tempGradient.addColorStop(0.5, 'rgba(255, 180, 120, 0.05)');
                    tempGradient.addColorStop(1, 'rgba(255, 160, 90, 0.0)');
                    
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = tempGradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                    
                });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isSaturn) { /* ... ULTRA-REALISTIC SATURN TEXTURE ... */
                texture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                    // 超真实土星纹理系统
                    
                    // 1. 基础大气层 - 多层渐变模拟土星氢氦大气
                    const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
                    baseGradient.addColorStop(0, '#faf0e6');     // 极地淡色
                    baseGradient.addColorStop(0.15, '#f5e6d3');  // 高纬度
                    baseGradient.addColorStop(0.3, '#deb887');   // 中纬度
                    baseGradient.addColorStop(0.5, '#d2b48c');   // 赤道带
                    baseGradient.addColorStop(0.7, '#deb887');   // 中纬度
                    baseGradient.addColorStop(0.85, '#f5e6d3');  // 高纬度
                    baseGradient.addColorStop(1, '#faf0e6');     // 极地淡色
                    ctx.fillStyle = baseGradient;
                    ctx.fillRect(0, 0, w, h);
                    
                    // 2. 复杂的带状云系统 - 基于真实土星观测
                    const cloudBands = [
                        { y: 0.05, height: 0.03, color: '#e6d4c1', alpha: 0.6, type: 'high' },
                        { y: 0.08, height: 0.02, color: '#d4c4b0', alpha: 0.4, type: 'medium' },
                        { y: 0.12, height: 0.04, color: '#c4b4a0', alpha: 0.7, type: 'fast' },
                        { y: 0.18, height: 0.03, color: '#e6d4c1', alpha: 0.5, type: 'slow' },
                        { y: 0.23, height: 0.05, color: '#b4a490', alpha: 0.8, type: 'fast' },
                        { y: 0.30, height: 0.04, color: '#d4c4b0', alpha: 0.6, type: 'medium' },
                        { y: 0.36, height: 0.08, color: '#a49480', alpha: 0.9, type: 'equatorial' },
                        { y: 0.46, height: 0.06, color: '#b4a490', alpha: 0.8, type: 'fast' },
                        { y: 0.54, height: 0.04, color: '#d4c4b0', alpha: 0.6, type: 'medium' },
                        { y: 0.60, height: 0.05, color: '#c4b4a0', alpha: 0.7, type: 'fast' },
                        { y: 0.67, height: 0.03, color: '#e6d4c1', alpha: 0.5, type: 'slow' },
                        { y: 0.72, height: 0.04, color: '#b4a490', alpha: 0.8, type: 'fast' },
                        { y: 0.78, height: 0.03, color: '#d4c4b0', alpha: 0.4, type: 'medium' },
                        { y: 0.83, height: 0.02, color: '#e6d4c1', alpha: 0.6, type: 'high' },
                        { y: 0.87, height: 0.03, color: '#d4c4b0', alpha: 0.5, type: 'medium' },
                        { y: 0.92, height: 0.04, color: '#e6d4c1', alpha: 0.6, type: 'polar' }
                    ];
                    
                    cloudBands.forEach(band => {
                        const bandY = band.y * h;
                        const bandHeight = band.height * h;
                        
                        // 创建云带渐变
                        const bandGradient = ctx.createLinearGradient(0, bandY, 0, bandY + bandHeight);
                        bandGradient.addColorStop(0, band.color.replace(')', ', 0.1)').replace('rgb', 'rgba'));
                        bandGradient.addColorStop(0.5, band.color.replace(')', `, ${band.alpha})`).replace('rgb', 'rgba'));
                        bandGradient.addColorStop(1, band.color.replace(')', ', 0.1)').replace('rgb', 'rgba'));
                        
                        ctx.fillStyle = bandGradient;
                        ctx.fillRect(0, bandY, w, bandHeight);
                        
                        // 添加云带纹理细节
                        ctx.globalAlpha = band.alpha * 0.3;
                        for(let i = 0; i < 100; i++) {
                            const x = Math.random() * w;
                            const y = bandY + Math.random() * bandHeight;
                            const size = Math.random() * 3 + 1;
                            
                            const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                            cloudGradient.addColorStop(0, band.color);
                            cloudGradient.addColorStop(1, band.color.replace(')', ', 0)').replace('rgb', 'rgba'));
                            
                            ctx.fillStyle = cloudGradient;
                            ctx.fillRect(x - size, y - size, size * 2, size * 2);
                        }
                        ctx.globalAlpha = 1.0;
                    });
                    
                    // 3. 土星风暴系统
                    const storms = [
                        // 北半球风暴群
                        { x: 0.2, y: 0.25, radius: 15, color: '#cd853f', intensity: 0.7 },
                        { x: 0.7, y: 0.32, radius: 12, color: '#daa520', intensity: 0.6 },
                        { x: 0.4, y: 0.28, radius: 8, color: '#b8860b', intensity: 0.5 },
                        // 南半球风暴群
                        { x: 0.3, y: 0.65, radius: 18, color: '#cd853f', intensity: 0.8 },
                        { x: 0.8, y: 0.72, radius: 14, color: '#daa520', intensity: 0.6 },
                        { x: 0.6, y: 0.68, radius: 10, color: '#b8860b', intensity: 0.5 }
                    ];
                    
                    storms.forEach(storm => {
                        const stormX = storm.x * w;
                        const stormY = storm.y * h;
                        const stormRadius = storm.radius;
                        
                        // 创建风暴涡旋
                        const stormGradient = ctx.createRadialGradient(
                            stormX, stormY, 0,
                            stormX, stormY, stormRadius
                        );
                        stormGradient.addColorStop(0, storm.color.replace(')', `, ${storm.intensity})`).replace('rgb', 'rgba'));
                        stormGradient.addColorStop(0.5, storm.color.replace(')', `, ${storm.intensity * 0.5})`).replace('rgb', 'rgba'));
                        stormGradient.addColorStop(1, storm.color.replace(')', ', 0)').replace('rgb', 'rgba'));
                        
                        ctx.fillStyle = stormGradient;
                        ctx.beginPath();
                        ctx.arc(stormX, stormY, stormRadius, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // 添加风暴螺旋结构
                        ctx.globalAlpha = storm.intensity * 0.4;
                        ctx.strokeStyle = storm.color;
                        ctx.lineWidth = 2;
                        
                        for(let spiral = 0; spiral < 3; spiral++) {
                            ctx.beginPath();
                            for(let angle = 0; angle < Math.PI * 4; angle += 0.1) {
                                const radius = (angle / (Math.PI * 4)) * stormRadius;
                                const x = stormX + Math.cos(angle + spiral * Math.PI * 2 / 3) * radius;
                                const y = stormY + Math.sin(angle + spiral * Math.PI * 2 / 3) * radius;
                                
                                if(angle === 0) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.stroke();
                        }
                        ctx.globalAlpha = 1.0;
                    });
                    
                    // 4. 北极六边形风暴系统 - 土星的标志性特征
                    const hexagonCenterX = w * 0.5;
                    const hexagonCenterY = h * 0.08;
                    const hexagonRadius = w * 0.08;
                    
                    ctx.globalAlpha = 0.6;
                    ctx.strokeStyle = '#f4a460';
                    ctx.lineWidth = 3;
                    
                    // 绘制六边形边界
                    ctx.beginPath();
                    for(let i = 0; i <= 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const x = hexagonCenterX + Math.cos(angle) * hexagonRadius;
                        const y = hexagonCenterY + Math.sin(angle) * hexagonRadius;
                        
                        if(i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                    
                    // 添加六边形内部涡旋
                    const hexagonGradient = ctx.createRadialGradient(
                        hexagonCenterX, hexagonCenterY, 0,
                        hexagonCenterX, hexagonCenterY, hexagonRadius
                    );
                    hexagonGradient.addColorStop(0, 'rgba(244, 164, 96, 0.4)');
                    hexagonGradient.addColorStop(0.7, 'rgba(222, 184, 135, 0.2)');
                    hexagonGradient.addColorStop(1, 'rgba(205, 133, 63, 0.1)');
                    
                    ctx.fillStyle = hexagonGradient;
                    ctx.beginPath();
                    ctx.arc(hexagonCenterX, hexagonCenterY, hexagonRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1.0;
                    
                    // 5. 南极极地涡旋
                    const southPoleX = w * 0.5;
                    const southPoleY = h * 0.92;
                    const southPoleRadius = w * 0.06;
                    
                    const southPoleGradient = ctx.createRadialGradient(
                        southPoleX, southPoleY, 0,
                        southPoleX, southPoleY, southPoleRadius
                    );
                    southPoleGradient.addColorStop(0, 'rgba(250, 240, 230, 0.6)');
                    southPoleGradient.addColorStop(0.5, 'rgba(238, 203, 173, 0.3)');
                    southPoleGradient.addColorStop(1, 'rgba(222, 184, 135, 0.1)');
                    
                    ctx.fillStyle = southPoleGradient;
                    ctx.beginPath();
                    ctx.arc(southPoleX, southPoleY, southPoleRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 6. 大气散射效果
                    ctx.globalAlpha = 0.15;
                    const atmosphereGradient = ctx.createLinearGradient(0, 0, 0, h);
                    atmosphereGradient.addColorStop(0, 'rgba(255, 248, 240, 0.3)');
                    atmosphereGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                    atmosphereGradient.addColorStop(1, 'rgba(255, 248, 240, 0.3)');
                    ctx.fillStyle = atmosphereGradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.globalAlpha = 1.0;
                    
                    // 7. 环系统阴影模拟
                    ctx.globalAlpha = 0.2;
                    const ringShadowGradient = ctx.createLinearGradient(0, h * 0.4, 0, h * 0.6);
                    ringShadowGradient.addColorStop(0, 'rgba(139, 90, 43, 0.1)');
                    ringShadowGradient.addColorStop(0.5, 'rgba(160, 82, 45, 0.3)');
                    ringShadowGradient.addColorStop(1, 'rgba(139, 90, 43, 0.1)');
                    ctx.fillStyle = ringShadowGradient;
                    ctx.fillRect(0, h * 0.4, w, h * 0.2);
                    ctx.globalAlpha = 1.0;
                    
                });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isUranus) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Uranus */ ctx.fillStyle = '#90c0c8'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.04; for(let y=0; y<h; y+=1) { for(let x=0; x<w; x+=1) { if (Math.random() < 0.05) { ctx.fillStyle = `rgba(180,225,235,${Math.random()*0.1 + 0.05})`; ctx.fillRect(x,y,1,1); } } } ctx.globalAlpha = 1.0; });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isNeptune) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Neptune */ ctx.fillStyle = '#3a5588'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.07; for(let y=0; y<h; y+=1) { for(let x=0; x<w; x+=1) { if (Math.random() < 0.08) { ctx.fillStyle = `rgba(25,40,70,${Math.random()*0.2 + 0.1})`; ctx.fillRect(x,y,1,1); } } } ctx.globalAlpha = 1.0; });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isPluto) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Pluto */ ctx.fillStyle = '#8b7d6b'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.4; for(let i=0; i<80; i++) { ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(139,125,107,0.3)' : 'rgba(107,93,75,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); } ctx.globalAlpha = 1.0; ctx.fillStyle = 'rgba(150,140,125,0.8)'; for(let i=0; i<12; i++) { ctx.beginPath(); const cx = Math.random()*w; const cy = Math.random()*h; const rx = Math.random()*w*0.2 + w*0.05; const ry = Math.random()*h*0.15 + h*0.05; ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); ctx.fill(); } ctx.fillStyle = 'rgba(200,195,185,0.7)'; ctx.beginPath(); ctx.arc(w*0.7, h*0.3, w*0.08, 0, Math.PI*2); ctx.fill(); });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isCeres) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Ceres */ ctx.fillStyle = '#8b7355'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.3; for(let i=0; i<100; i++) { ctx.fillStyle = (Math.random() > 0.6) ? 'rgba(120,100,70,0.4)' : 'rgba(80,60,40,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); } ctx.globalAlpha = 1.0; ctx.fillStyle = 'rgba(140,120,90,0.6)'; for(let i=0; i<8; i++) { ctx.beginPath(); const cx = Math.random()*w; const cy = Math.random()*h; const rx = Math.random()*w*0.15 + w*0.03; const ry = Math.random()*h*0.12 + h*0.03; ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); ctx.fill(); } ctx.fillStyle = 'rgba(160,145,120,0.5)'; ctx.beginPath(); ctx.arc(w*0.8, h*0.2, w*0.06, 0, Math.PI*2); ctx.fill(); });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isEris) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Eris */ ctx.fillStyle = '#7b7b7b'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.3; for(let i=0; i<120; i++) { ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(100,100,100,0.3)' : 'rgba(60,60,60,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); } ctx.globalAlpha = 1.0; ctx.fillStyle = 'rgba(120,120,120,0.7)'; for(let i=0; i<15; i++) { ctx.beginPath(); const cx = Math.random()*w; const cy = Math.random()*h; const rx = Math.random()*w*0.1 + w*0.02; const ry = Math.random()*h*0.08 + h*0.02; ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); ctx.fill(); } ctx.fillStyle = 'rgba(150,150,150,0.6)'; ctx.beginPath(); ctx.arc(w*0.6, h*0.4, w*0.07, 0, Math.PI*2); ctx.fill(); });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isMakemake) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Makemake */ ctx.fillStyle = '#9b8b7b'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.35; for(let i=0; i<90; i++) { ctx.fillStyle = (Math.random() > 0.6) ? 'rgba(140,120,100,0.4)' : 'rgba(90,70,50,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); } ctx.globalAlpha = 1.0; ctx.fillStyle = 'rgba(130,110,90,0.6)'; for(let i=0; i<10; i++) { ctx.beginPath(); const cx = Math.random()*w; const cy = Math.random()*h; const rx = Math.random()*w*0.12 + w*0.03; const ry = Math.random()*h*0.1 + h*0.03; ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); ctx.fill(); } ctx.fillStyle = 'rgba(150,130,110,0.5)'; ctx.beginPath(); ctx.arc(w*0.7, h*0.3, w*0.06, 0, Math.PI*2); ctx.fill(); });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            } else if (planetData.isHaumea) { /* ... NO CHANGE IN TEXTURE LOGIC ... */
                texture = createProceduralTexture(128, 64, (ctx, w, h) => { /* Haumea */ ctx.fillStyle = '#8b7b6b'; ctx.fillRect(0,0,w,h); ctx.globalAlpha = 0.4; for(let i=0; i<85; i++) { ctx.fillStyle = (Math.random() > 0.55) ? 'rgba(130,110,90,0.4)' : 'rgba(80,60,40,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); } ctx.globalAlpha = 1.0; ctx.fillStyle = 'rgba(120,100,80,0.6)'; for(let i=0; i<9; i++) { ctx.beginPath(); const cx = Math.random()*w; const cy = Math.random()*h; const rx = Math.random()*w*0.13 + w*0.04; const ry = Math.random()*h*0.11 + h*0.04; ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); ctx.fill(); } ctx.fillStyle = 'rgba(140,120,100,0.5)'; ctx.beginPath(); ctx.arc(w*0.65, h*0.35, w*0.05, 0, Math.PI*2); ctx.fill(); });
                planetMaterial = new THREE.MeshStandardMaterial({ map: texture, ...planetData.materialProps });
            }
            else { /* ... NO CHANGE ... */
                planetMaterial = new THREE.MeshStandardMaterial({ color: planetData.color, ...planetData.materialProps });
            }

            const planetGeometry = new THREE.SphereGeometry(visualRadius, 48, 48);
            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.name = planetData.name;
            planetMesh.userData = planetData; // This now contains metric data if available in planetData
            planetMesh.castShadow = true;
            planetMesh.receiveShadow = true;
            
 
            
            // 为矮行星增加发光效果以提高可见度
            if (planetData.type === "Dwarf Planet") {
                planetMaterial.emissive = new THREE.Color(planetData.color);
                planetMaterial.emissiveIntensity = 0.15;
            }

            const axialTiltGroup = new THREE.Object3D(); /* ... NO CHANGE ... */
            axialTiltGroup.rotation.z = planetData.axialTilt;
            axialTiltGroup.add(planetMesh);

            // 为小行星/矮行星添加透明点击辅助球，提高远距离点击命中率
            if (visualRadius < 1.5) {
                const hitRadius = Math.max(visualRadius * 6, 2.5);
                const hitGeometry = new THREE.SphereGeometry(hitRadius, 8, 8);
                const hitMaterial = new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                    side: THREE.FrontSide
                });
                const hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);
                hitMesh.userData = planetData; // 点击时透传行星数据
                hitMesh.name = planetData.name + '_hitzone';
                axialTiltGroup.add(hitMesh);
            }


            const orbitPivot = new THREE.Object3D();  /* ... NO CHANGE ... */
            scene.add(orbitPivot);
            orbitPivot.add(axialTiltGroup);

            celestialObjects.push({ /* ... NO CHANGE ... */
                isPlanet: true,
                mesh: planetMesh,
                pivot: orbitPivot,
                speed: planetData.speed,
                rotationSpeed: planetData.rotationSpeed,
                axialTiltGroup: axialTiltGroup,
                orbitRadius: planetData.orbitRadius, // Scene orbit radius
                eccentricity: planetData.e,
                // For info panel, data is on planetMesh.userData
                // Storing some here for direct access if ever needed, but primary source is userData
                displayName: planetData.displayName,
                type: planetData.type,
                radius: visualRadius // Scene radius
            });

            if (planetData.moons) { /* ... NO CHANGE IN MOON CREATION LOGIC, userData will carry metric data ... */
                planetData.moons.forEach(moonData => {
                    const moonVisualRadius = moonData.radius;
                    let moonTexture;
                    if (moonData.isMoon) { moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{ctx.fillStyle = '#b0b0b0';ctx.fillRect(0,0,w,h);ctx.globalAlpha=0.7;for(let i=0;i<80;i++){const cX=Math.random()*w,cY=Math.random()*h,cR=Math.random()*(w*0.04)+w*0.01;ctx.fillStyle=(Math.random()<0.6)?'rgba(80,80,80,0.6)':'rgba(160,160,160,0.4)';ctx.beginPath();ctx.arc(cX,cY,cR,0,2*Math.PI);ctx.fill();}ctx.globalAlpha=1.0;});}
                    else if (moonData.isIo) { moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{ctx.fillStyle = '#fdd835';ctx.fillRect(0,0,w,h);for(let i=0;i<20;i++){ctx.fillStyle=(Math.random()<0.5)?'rgba(200,50,0,0.7)':'rgba(50,50,50,0.6)';ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*w*0.05+w*0.02,0,2*Math.PI);ctx.fill();}}); }
                    else if (moonData.isEuropa) { moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{ctx.fillStyle = '#ddeeff';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(150,180,200,0.5)';ctx.lineWidth=1;for(let i=0;i<30;i++){ctx.beginPath();ctx.moveTo(Math.random()*w,Math.random()*h);ctx.lineTo(Math.random()*w,Math.random()*h);ctx.stroke();}}); }
                    else if (moonData.isGanymede) { moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{ctx.fillStyle = '#9090a0';ctx.fillRect(0,0,w,h);for(let i=0;i<40;i++){ctx.fillStyle=(Math.random()<0.6)?'rgba(60,60,70,0.5)':'rgba(150,150,160,0.3)';ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*w*0.04+w*0.01,0,2*Math.PI);ctx.fill();}}); }
                    else if (moonData.isCallisto) { moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{ctx.fillStyle = '#505055';ctx.fillRect(0,0,w,h);for(let i=0;i<100;i++){ctx.fillStyle='rgba(200,200,220,0.6)';ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*w*0.02+w*0.005,0,2*Math.PI);ctx.fill();}}); }
                    else if (moonData.isTitan) {
                        moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{
                            ctx.fillStyle = '#d2a060';
                            ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.2;
                            for(let i=0; i<20; i++){
                                ctx.fillStyle = (Math.random() < 0.5) ? 'rgba(240,200,150,0.3)' : 'rgba(200,160,120,0.2)';
                                ctx.beginPath();
                                ctx.ellipse(Math.random()*w, Math.random()*h, Math.random()*w*0.2+w*0.1, Math.random()*h*0.15+h*0.05, Math.random()*Math.PI, 0, 2*Math.PI);
                                ctx.fill();
                            }
                            ctx.globalAlpha = 1.0;
                        });
                    } else if (moonData.isMimas) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#b8b8b8'; ctx.fillRect(0,0,w,h);
                            ctx.fillStyle = 'rgba(60,60,60,0.7)';
                            ctx.beginPath();
                            ctx.arc(w*0.3, h*0.5, w*0.2, 0, 2*Math.PI);
                            ctx.fill();
                            ctx.globalAlpha = 0.6;
                            for(let i=0; i<20; i++){ const cR=Math.random()*(w*0.05)+w*0.01; ctx.fillStyle='rgba(80,80,80,0.5)'; ctx.beginPath(); ctx.arc(Math.random()*w,Math.random()*h,cR,0,2*Math.PI); ctx.fill(); }
                            ctx.globalAlpha = 1.0;
                        });
                    } else if (moonData.isCharon) {
                        moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{
                            ctx.fillStyle = '#8b7d6b'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.4;
                            for(let i=0; i<60; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(139,125,107,0.3)' : 'rgba(107,93,75,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            ctx.fillStyle = 'rgba(150,140,125,0.6)';
                            for(let i=0; i<8; i++){ 
                                ctx.beginPath(); 
                                const cx = Math.random()*w; 
                                const cy = Math.random()*h; 
                                const rx = Math.random()*w*0.15 + w*0.03; 
                                const ry = Math.random()*h*0.12 + h*0.03; 
                                ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isMiranda) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#9fb3cc'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.4;
                            for(let i=0; i<40; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(120,140,160,0.4)' : 'rgba(80,100,120,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            // 添加一些地形特征
                            for(let i=0; i<3; i++){ 
                                ctx.fillStyle = 'rgba(100,120,140,0.5)';
                                ctx.beginPath(); 
                                const cx = Math.random()*w; 
                                const cy = Math.random()*h; 
                                const rx = Math.random()*w*0.15 + w*0.05; 
                                const ry = Math.random()*h*0.1 + h*0.03; 
                                ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isAriel) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#afc3dc'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.3;
                            for(let i=0; i<30; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(140,160,180,0.4)' : 'rgba(100,120,140,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            // 平坦的冰层表面
                            for(let i=0; i<5; i++){ 
                                ctx.fillStyle = 'rgba(160,180,200,0.4)';
                                ctx.beginPath(); 
                                ctx.ellipse(Math.random()*w, Math.random()*h, Math.random()*w*0.1+w*0.05, Math.random()*h*0.08+h*0.02, Math.random()*Math.PI, 0, 2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isUmbriel) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#7f8fa0'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.5;
                            for(let i=0; i<50; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(100,110,120,0.3)' : 'rgba(60,70,80,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            // 暗色表面
                            ctx.fillStyle = 'rgba(80,90,100,0.6)';
                            for(let i=0; i<8; i++){ 
                                ctx.beginPath(); 
                                ctx.arc(Math.random()*w, Math.random()*h, Math.random()*w*0.05+w*0.01, 0, 2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isTitania) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#bfd3e0'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.3;
                            for(let i=0; i<35; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(160,180,200,0.4)' : 'rgba(120,140,160,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            // 最大的天王星卫星
                            for(let i=0; i<6; i++){ 
                                ctx.fillStyle = 'rgba(150,170,190,0.5)';
                                ctx.beginPath(); 
                                ctx.ellipse(Math.random()*w, Math.random()*h, Math.random()*w*0.12+w*0.04, Math.random()*h*0.08+h*0.02, Math.random()*Math.PI, 0, 2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isOberon) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#8fa0b0'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.4;
                            for(let i=0; i<45; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(120,140,160,0.3)' : 'rgba(80,100,120,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            // 老化的表面
                            ctx.fillStyle = 'rgba(100,120,140,0.5)';
                            for(let i=0; i<10; i++){ 
                                ctx.beginPath(); 
                                ctx.arc(Math.random()*w, Math.random()*h, Math.random()*w*0.06+w*0.02, 0, 2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isTriton) {
                        moonTexture = createProceduralTexture(128,64,(ctx,w,h)=>{
                            ctx.fillStyle = '#b8c6db'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.2;
                            // 年轻的冰层表面
                            for(let i=0; i<25; i++){
                                ctx.fillStyle = (Math.random() < 0.5) ? 'rgba(200,210,220,0.3)' : 'rgba(160,180,200,0.2)';
                                ctx.beginPath();
                                ctx.ellipse(Math.random()*w, Math.random()*h, Math.random()*w*0.15+w*0.05, Math.random()*h*0.1+h*0.03, Math.random()*Math.PI, 0, 2*Math.PI);
                                ctx.fill();
                            }
                            ctx.globalAlpha = 1.0;
                            // 地质特征
                            ctx.fillStyle = 'rgba(150,170,190,0.6)';
                            for(let i=0; i<8; i++){ 
                                ctx.beginPath(); 
                                const cx = Math.random()*w; 
                                const cy = Math.random()*h; 
                                const rx = Math.random()*w*0.1 + w*0.02; 
                                const ry = Math.random()*h*0.08 + h*0.02; 
                                ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isNereid) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = '#8a9bb0'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.6;
                            for(let i=0; i<40; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(110,130,150,0.3)' : 'rgba(70,90,110,0.3)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            // 不规则形状的小卫星
                            ctx.fillStyle = 'rgba(90,110,130,0.5)';
                            for(let i=0; i<12; i++){ 
                                ctx.beginPath(); 
                                ctx.arc(Math.random()*w, Math.random()*h, Math.random()*w*0.04+w*0.01, 0, 2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    } else if (moonData.isHiaka || moonData.isNamaka) {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = moonData.isHiaka ? '#7b6b5b' : '#6b5b4b'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.3;
                            for(let i=0; i<25; i++){ ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(130,110,90,0.3)' : 'rgba(80,60,40,0.2)'; ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1); }
                            ctx.globalAlpha = 1.0;
                            ctx.fillStyle = 'rgba(120,100,80,0.5)';
                            for(let i=0; i<5; i++){ 
                                ctx.beginPath(); 
                                const cx = Math.random()*w; 
                                const cy = Math.random()*h; 
                                const rx = Math.random()*w*0.1 + w*0.02; 
                                const ry = Math.random()*h*0.08 + h*0.02; 
                                ctx.ellipse(cx,cy,rx,ry, Math.random()*Math.PI, 0,2*Math.PI); 
                                ctx.fill(); 
                            }
                        });
                    }
                     else {
                        moonTexture = createProceduralTexture(64,32,(ctx,w,h)=>{
                            ctx.fillStyle = moonData.color || '#777777'; ctx.fillRect(0,0,w,h);
                            ctx.globalAlpha = 0.5;
                            for(let i=0;i<10;i++){ ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.arc(Math.random()*w,Math.random()*h,Math.random()*w*0.1,0,2*Math.PI); ctx.fill(); }
                            ctx.globalAlpha = 1.0;
                        });
                    }

                    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, ...moonData.materialProps });
                    const moonGeometry = new THREE.SphereGeometry(moonVisualRadius, 16, 16);
                    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
                    moonMesh.name = moonData.name;
                    moonMesh.userData = moonData; // Contains metric data if available
                    moonMesh.castShadow = true;
                    moonMesh.receiveShadow = true;
                    
 

                    const moonOrbitPivot = new THREE.Object3D();
                    axialTiltGroup.add(moonOrbitPivot);

                    moonOrbitPivot.add(moonMesh);

                    celestialObjects.push({
                        isMoon: true,
                        mesh: moonMesh,
                        pivot: moonOrbitPivot,
                        speed: moonData.speed,
                        rotationSpeed: moonData.rotationSpeed || 0.001,
                        orbitRadius: moonData.orbitRadius, // Scene orbit radius
                        eccentricity: moonData.e || 0,
                        parentObject: planetMesh,
                        displayName: moonData.displayName,
                        type: moonData.type,
                        radius: moonVisualRadius // Scene radius
                    });

                    const moonOrbitLineMat = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
                    const moonEllipse = new THREE.EllipseCurve(0,0, moonData.orbitRadius, moonData.orbitRadius * Math.sqrt(1-(moonData.e||0)*(moonData.e||0)), 0, 2*Math.PI, false, 0);
                    const moonOrbitPoints = moonEllipse.getPoints(64);
                    const moonOrbitGeom = new THREE.BufferGeometry().setFromPoints(moonOrbitPoints);
                    const moonOrbitLine = new THREE.Line(moonOrbitGeom, moonOrbitLineMat);
                    moonOrbitLine.rotation.x = Math.PI / 2;
                    moonOrbitPivot.add(moonOrbitLine);
                    
                    // Store moon orbit line reference for glow toggle
                    moonOrbitLine.userData = { isMoonOrbit: true };
                    orbitLines.push(moonOrbitLine);
                });
            }


            if (planetData.hasAtmosphere) { /* ... NO CHANGE IN ATMOSPHERE SHADER/LOGIC ... */
                const atmosphereGeometry = new THREE.SphereGeometry(visualRadius * planetData.atmosphereScale, 48, 48);
                const atmosphereMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        glowColor: { value: new THREE.Color(planetData.atmosphereColor) },
                        viewVector: { value: camera.position }
                    },
                    vertexShader: `
                        varying vec3 vNormalWorld;
                        varying vec3 vPositionWorld;
                        void main() {
                            vNormalWorld = normalize( mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal );
                            vPositionWorld = (modelMatrix * vec4( position, 1.0 )).xyz;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                        }
                    `,
                    fragmentShader: `
                        uniform vec3 glowColor;
                        uniform vec3 viewVector;
                        varying vec3 vNormalWorld;
                        varying vec3 vPositionWorld;
                        void main() {
                            vec3 viewDirection = normalize(viewVector - vPositionWorld);
                            float intensity = pow( 1.0 - abs(dot(vNormalWorld, viewDirection)), 3.0 );
                            intensity = clamp(intensity * 1.5, 0.0, 1.0);
                            gl_FragColor = vec4( glowColor, intensity * 0.8 );
                        }
                    `,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    depthWrite: false
                });
                 if (planetData.isVenus || planetData.isTitan) {
                    let alphaFactor = planetData.isVenus ? 0.95 : (planetData.isTitan ? 0.9 : 0.8);
                    atmosphereMaterial.fragmentShader = atmosphereMaterial.fragmentShader.replace('intensity * 0.8',`intensity * ${alphaFactor.toFixed(2)}`);
                }
                const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                // 设置大气层mesh的userData，与主行星相同，这样点击大气层时也能显示信息卡片
                atmosphereMesh.userData = planetData;
                planetMesh.add(atmosphereMesh);
            }


            if (planetData.hasRings) { 
                const ringSegments = 128;
                let ringGeometry, ringMaterial;
                
                // 根据行星类型创建不同的环系统
                switch (planetData.ringType || "saturn") {
                    case "saturn":
                        // 土星环 - 明亮复杂
                        ringGeometry = new THREE.RingGeometry(visualRadius * 1.35, visualRadius * 2.7, ringSegments, 10, 0, Math.PI * 2);
                        ringMaterial = createRingMaterial("saturn", visualRadius);
                        break;
                        
                    case "uranus":
                        // 天王星环 - 暗淡，垂直
                        ringGeometry = new THREE.RingGeometry(visualRadius * 1.8, visualRadius * 2.4, ringSegments, 10, 0, Math.PI * 2);
                        ringMaterial = createRingMaterial("uranus", visualRadius);
                        break;
                        
                    case "neptune":
                        // 海王星环 - 非常暗淡，有弧段
                        ringGeometry = new THREE.RingGeometry(visualRadius * 1.6, visualRadius * 2.2, ringSegments, 10, 0, Math.PI * 2);
                        ringMaterial = createRingMaterial("neptune", visualRadius);
                        break;
                        
                    case "jupiter":
                        // 木星环 - 非常暗淡，主要由尘埃组成
                        ringGeometry = new THREE.RingGeometry(visualRadius * 1.2, visualRadius * 1.8, ringSegments, 10, 0, Math.PI * 2);
                        ringMaterial = createRingMaterial("jupiter", visualRadius);
                        break;
                        
                    default:
                        ringGeometry = new THREE.RingGeometry(visualRadius * 1.35, visualRadius * 2.7, ringSegments, 10, 0, Math.PI * 2);
                        ringMaterial = createRingMaterial("saturn", visualRadius);
                }
                
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.receiveShadow = true;
                ringMesh.rotation.x = Math.PI / 2;
                
                // 天王星的环系统几乎是垂直的
                if (planetData.ringType === "uranus") {
                    ringMesh.rotation.z = Math.PI / 2 + planetData.axialTilt;
                }
                
                planetMesh.add(ringMesh);
            }
            // Use planetData.orbitRadius for orbit line (scene units)
            // 创建与实际运动机制完全一致的轨道线
            const points = [];
            const a = planetData.orbitRadius;
            const e = planetData.e;
            
            for (let i = 0; i <= 128; i++) {
                const M = (i / 128) * 2 * Math.PI; // Mean Anomaly
                let r = a;
                
                if (e > 0.0001) {
                    let E = M; // Eccentric Anomaly
                    for (let k = 0; k < 7; k++) { E = M + e * Math.sin(E); }
                    r = a * (1 - e * Math.cos(E));
                }
                
                // 实际运动的机制：物体放在X轴上，距离为r，然后通过pivot旋转
                // 所以轨道线上的点应该是：x = r * cos(M), y = r * sin(M)
                const x = r * Math.cos(M);
                const y = r * Math.sin(M);
                
                points.push(new THREE.Vector2(x, y));
            }
            
            const orbitLineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const orbitLineMaterial = new THREE.LineBasicMaterial({ color: 0x282828, transparent: true, opacity: 0.25 });
            const orbitLine = new THREE.Line(orbitLineGeometry, orbitLineMaterial);
            orbitLine.rotation.x = Math.PI / 2;
            scene.add(orbitLine);
            
            // Store orbit line reference for glow toggle
            orbitLine.userData = { isPlanetOrbit: true };
            orbitLines.push(orbitLine);
        }

        // 创建不同类型的行星环材质
        function createRingMaterial(ringType, planetRadius) {
            let ringTexture;
            
            switch (ringType) {
                case "saturn":
                    // 土星环 - 明亮复杂，多层结构
                    ringTexture = createProceduralTexture(1024, 64, (ctx, w, h) => {
                        const baseColor = new THREE.Color(0xad9f84);
                        for (let x = 0; x < w; x++) {
                            let radialPosition = x / w;
                            let alpha = 0.6;
                            let r = baseColor.r, g = baseColor.g, b = baseColor.b;

                            // 卡西尼环缝
                            if (radialPosition > 0.65 && radialPosition < 0.72) {
                                alpha *= 0.1;
                            } else if (radialPosition > 0.3 && radialPosition < 0.6) {
                                alpha *= 1.1;
                                r *= 1.05; g *= 1.05; b *= 1.05;
                            } else {
                                alpha *= 0.9;
                                r *= 0.95; g *= 0.95; b *= 0.95;
                            }
                            
                            r = Math.max(0, Math.min(1, r));
                            g = Math.max(0, Math.min(1, g));
                            b = Math.max(0, Math.min(1, b));

                            for (let y = 0; y < h; y++) {
                                let noiseVal = Math.random() * 0.4 - 0.2;
                                const currentAlpha = THREE.MathUtils.clamp(alpha + noiseVal * 0.2, 0.05, 0.8);
                                const currentR = THREE.MathUtils.clamp(r + noiseVal * 0.1, 0.0, 1.0);
                                const currentG = THREE.MathUtils.clamp(g + noiseVal * 0.1, 0.0, 1.0);
                                const currentB = THREE.MathUtils.clamp(b + noiseVal * 0.1, 0.0, 1.0);
                                ctx.fillStyle = `rgba(${Math.floor(currentR*255)}, ${Math.floor(currentG*255)}, ${Math.floor(currentB*255)}, ${currentAlpha})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                    });
                    break;
                    
                case "uranus":
                    // 天王星环 - 暗淡，由暗色物质组成
                    ringTexture = createProceduralTexture(1024, 64, (ctx, w, h) => {
                        for (let x = 0; x < w; x++) {
                            let radialPosition = x / w;
                            let alpha = 0.15; // 非常暗淡
                            
                            // 天王星环的多个细环
                            if (radialPosition > 0.2 && radialPosition < 0.25) alpha = 0.3;
                            else if (radialPosition > 0.35 && radialPosition < 0.4) alpha = 0.25;
                            else if (radialPosition > 0.5 && radialPosition < 0.55) alpha = 0.35;
                            else if (radialPosition > 0.7 && radialPosition < 0.75) alpha = 0.2;
                            else if (radialPosition > 0.85 && radialPosition < 0.9) alpha = 0.15;
                            else alpha = 0.05;
                            
                            for (let y = 0; y < h; y++) {
                                let noiseVal = Math.random() * 0.1 - 0.05;
                                const currentAlpha = THREE.MathUtils.clamp(alpha + noiseVal, 0.01, 0.4);
                                ctx.fillStyle = `rgba(${Math.floor(100 + noiseVal * 20)}, ${Math.floor(120 + noiseVal * 20)}, ${Math.floor(140 + noiseVal * 20)}, ${currentAlpha})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                    });
                    break;
                    
                case "neptune":
                    // 海王星环 - 非常暗淡，有明亮的弧段
                    ringTexture = createProceduralTexture(1024, 64, (ctx, w, h) => {
                        for (let x = 0; x < w; x++) {
                            let radialPosition = x / w;
                            let alpha = 0.08; // 极其暗淡
                            
                            // 亚当斯环（包含弧段）
                            if (radialPosition > 0.4 && radialPosition < 0.45) {
                                // 模拟弧段 - 某些区域更亮
                                const arcAngle = (x / w) * Math.PI * 8;
                                if (Math.sin(arcAngle) > 0.7) {
                                    alpha = 0.4; // 明亮的弧段
                                } else {
                                    alpha = 0.1;
                                }
                            }
                            // 其他环
                            else if (radialPosition > 0.6 && radialPosition < 0.65) alpha = 0.12;
                            else if (radialPosition > 0.8 && radialPosition < 0.85) alpha = 0.08;
                            else alpha = 0.02;
                            
                            for (let y = 0; y < h; y++) {
                                let noiseVal = Math.random() * 0.05 - 0.025;
                                const currentAlpha = THREE.MathUtils.clamp(alpha + noiseVal, 0.01, 0.5);
                                ctx.fillStyle = `rgba(${Math.floor(80 + noiseVal * 20)}, ${Math.floor(100 + noiseVal * 20)}, ${Math.floor(160 + noiseVal * 30)}, ${currentAlpha})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                    });
                    break;
                    
                case "jupiter":
                    // 木星环 - 非常暗淡的尘埃环
                    ringTexture = createProceduralTexture(1024, 64, (ctx, w, h) => {
                        for (let x = 0; x < w; x++) {
                            let radialPosition = x / w;
                            let alpha = 0.03; // 几乎透明
                            
                            // 木星环的主要部分
                            if (radialPosition > 0.7 && radialPosition < 0.9) {
                                alpha = 0.08;
                            } else if (radialPosition > 0.4 && radialPosition < 0.6) {
                                alpha = 0.05;
                            } else {
                                alpha = 0.01;
                            }
                            
                            for (let y = 0; y < h; y++) {
                                let noiseVal = Math.random() * 0.02 - 0.01;
                                const currentAlpha = THREE.MathUtils.clamp(alpha + noiseVal, 0.005, 0.1);
                                ctx.fillStyle = `rgba(${Math.floor(150 + noiseVal * 30)}, ${Math.floor(140 + noiseVal * 30)}, ${Math.floor(120 + noiseVal * 30)}, ${currentAlpha})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                    });
                    break;
                    
                default:
                    // 默认土星环
                    ringTexture = createProceduralTexture(1024, 64, (ctx, w, h) => {
                        const baseColor = new THREE.Color(0xad9f84);
                        for (let x = 0; x < w; x++) {
                            let radialPosition = x / w;
                            let alpha = 0.6;
                            let r = baseColor.r, g = baseColor.g, b = baseColor.b;
                            
                            if (radialPosition > 0.65 && radialPosition < 0.72) alpha *= 0.1;
                            else if (radialPosition > 0.3 && radialPosition < 0.6) {
                                alpha *= 1.1; r *= 1.05; g *= 1.05; b *= 1.05;
                            } else {
                                alpha *= 0.9; r *= 0.95; g *= 0.95; b *= 0.95;
                            }
                            
                            for (let y = 0; y < h; y++) {
                                let noiseVal = Math.random() * 0.4 - 0.2;
                                const currentAlpha = THREE.MathUtils.clamp(alpha + noiseVal * 0.2, 0.05, 0.8);
                                ctx.fillStyle = `rgba(${Math.floor(r*255)}, ${Math.floor(g*255)}, ${Math.floor(b*255)}, ${currentAlpha})`;
                                ctx.fillRect(x, y, 1, 1);
                            }
                        }
                    });
            }
            
            return new THREE.MeshStandardMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.01,
                roughness: 0.95,
                metalness: 0.02
            });
        }

        // 改进的小行星几何体生成函数
        function createEnhancedAsteroidGeometry(size) {
            // 使用低面数几何体避免球体外观
            const geometryTypes = [
                () => new THREE.TetrahedronGeometry(size, 0), // 四面体
                () => new THREE.OctahedronGeometry(size, 0),   // 八面体
                () => new THREE.DodecahedronGeometry(size, 0), // 十二面体
                () => new THREE.IcosahedronGeometry(size, 0)   // 二十面体
            ];
            
            const baseGeometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)]();
            const positionAttribute = baseGeometry.getAttribute('position');
            const vertex = new THREE.Vector3();
            
            // 为每个小行星生成随机种子
            const seed = Math.random();
            
            // 大幅度变形使其不规则
            for (let j = 0; j < positionAttribute.count; j++) {
                vertex.fromBufferAttribute(positionAttribute, j);
                
                // 每个顶点的独特变形
                const vertexSeed = (seed + j * 0.1) % 1;
                
                // 大型不规则变形
                const largeDeform = (vertexSeed - 0.5) * 0.6;
                vertex.x *= (1 + largeDeform);
                vertex.y *= (1 + largeDeform * 0.8);
                vertex.z *= (1 + largeDeform * 1.2);
                
                // 添加随机偏移
                vertex.x += (vertexSeed - 0.5) * size * 0.3;
                vertex.y += (vertexSeed - 0.5) * size * 0.3;
                vertex.z += (vertexSeed - 0.5) * size * 0.3;
                
                positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
            }
            
            // 添加一些尖锐的边缘特征
            const sharpVertexCount = Math.floor(positionAttribute.count * 0.3);
            for (let i = 0; i < sharpVertexCount; i++) {
                const vertexIndex = Math.floor(Math.random() * positionAttribute.count);
                vertex.fromBufferAttribute(positionAttribute, vertexIndex);
                
                // 将某些顶点推得更远，创造尖锐效果
                vertex.multiplyScalar(1.2 + Math.random() * 0.4);
                positionAttribute.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z);
            }
            
            // 重新计算法线
            baseGeometry.computeVertexNormals();
            
            return baseGeometry;
        }
        
        // 改进的小行星材质生成函数
        function createEnhancedAsteroidMaterial(size) {
            // 真实的小行星颜色（灰褐色系）
            const colorVariations = [
                0x4a453f, // 深灰褐色
                0x5a4f45, // 灰褐色
                0x6a594f, // 浅灰褐色
                0x4a4a4a, // 中灰色
                0x5a5550, // 暖灰色
                0x3a3a35, // 深灰色
                0x4a4842  // 暗褐色
            ];
            
            const baseColor = colorVariations[Math.floor(Math.random() * colorVariations.length)];
            
            return new THREE.MeshStandardMaterial({
                color: baseColor,
                roughness: 0.85 + Math.random() * 0.1, // 0.85-0.95 很粗糙
                metalness: 0.0 + Math.random() * 0.05, // 0.0-0.05 几乎没有金属感
                // 移除自发光，避免塑料感
            });
        }

        async function createAsteroidBeltAsync() {
            const asteroidCount = 3000;
            const beltInnerRadius = 42;
            const beltOuterRadius = 60;
            const beltHeight = 5;

            console.log(`Creating Enhanced Asteroid Belt with ${asteroidCount} objects via Worker.`);

            const geometryPool = [];
            const materialPool = [];
            const sizePool = [];
            const poolSize = 10;
            
            for (let p = 0; p < poolSize; p++) {
                let baseSize;
                if (p < 2) baseSize = 0.12;
                else if (p < 5) baseSize = 0.05;
                else baseSize = 0.02;
                
                sizePool.push(baseSize);
                geometryPool.push(createEnhancedAsteroidGeometry(baseSize));
                materialPool.push(createEnhancedAsteroidMaterial(baseSize));
            }

            return new Promise((resolve) => {
                let worker;
                try {
                    worker = new Worker(WORKER_URL);
                } catch (e) {
                    console.error("Asteroid Worker Error (Initialization):", e);
                    resolve();
                    return;
                }
                
                worker.onerror = function(err) {
                    console.error("Asteroid Worker Error:", err);
                    resolve();
                };
                
                worker.onmessage = async function(e) {
                    if (e.data.type === 'ASTEROID_BELT_DATA') {
                        const dataArray = e.data.asteroidData;
                        const batchSize = 300;
                        
                        for (let i = 0; i < asteroidCount; i += batchSize) {
                            for (let j = i; j < Math.min(i + batchSize, asteroidCount); j++) {
                                const offset = j * 10;
                                const poolIndex = dataArray[offset];
                                const scale = dataArray[offset + 1];
                                const a = dataArray[offset + 2];
                                const e_val = dataArray[offset + 3];
                                const y_pos = dataArray[offset + 4];
                                const rotX = dataArray[offset + 5];
                                const rotZ = dataArray[offset + 6];
                                const rotY = dataArray[offset + 7];
                                const speed = dataArray[offset + 8];
                                const rotationSpeed = dataArray[offset + 9];
                                
                                const asteroidGeometry = geometryPool[poolIndex];
                                const asteroidMaterial = materialPool[poolIndex];
                                const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
                                
                                asteroid.scale.set(scale, scale, scale);
                                const asteroidVisualSize = sizePool[poolIndex] * scale;
                                
                                asteroid.castShadow = false;
                                asteroid.receiveShadow = true;
                                
                                const orbitPivot = new THREE.Object3D();
                                orbitPivot.add(asteroid);
                                orbitPivot.position.y = y_pos;
                                orbitPivot.rotation.x = rotX;
                                orbitPivot.rotation.z = rotZ;
                                orbitPivot.rotation.y = rotY;
                                
                                scene.add(orbitPivot);
                                
                                const asteroidRadiusMetric = asteroidVisualSize * 300;
                                const asteroidOrbitAU = a / 30 * 3.0;
                                
                                asteroid.userData = {
                                    displayName: `小行星 ${j+1}`,
                                    type: "小行星",
                                    radius: asteroidVisualSize,
                                    radiusMetric: parseFloat(asteroidRadiusMetric.toFixed(1)),
                                    orbitRadius: parseFloat(a.toFixed(1)),
                                    orbitSemiMajorAxisAU: parseFloat(asteroidOrbitAU.toFixed(2)),
                                    eccentricity: parseFloat(e_val.toFixed(3))
                                };
                                
                                celestialObjects.push({
                                    isAsteroid: true,
                                    mesh: asteroid,
                                    pivot: orbitPivot,
                                    speed: speed,
                                    rotationSpeed: rotationSpeed,
                                    orbitRadius: a,
                                    eccentricity: e_val,
                                    displayName: asteroid.userData.displayName,
                                    type: asteroid.userData.type,
                                    radius: asteroid.userData.radius,
                                });
                            }
                            const pct = 50 + ((i + batchSize) / asteroidCount) * 20;
                            updateProgress(`Instantiating Asteroids (${Math.min(100, Math.round((i + batchSize)/asteroidCount * 100))}%)...`, pct);
                            await yieldThread();
                        }
                        console.log("Asteroids instantiation complete.");
                        worker.terminate();
                        resolve();
                    }
                };
                
                updateProgress("Calculating Asteroid trajectories in Worker...", 50);
                worker.postMessage({
                    type: 'GENERATE_ASTEROID_BELT',
                    data: { count: asteroidCount, beltInnerRadius, beltOuterRadius, beltHeight, poolSize }
                });
            });
        }

  
        function createStarfield() { /* ... NO CHANGE ... */
            const starQty = 40000;
            const starGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(starQty * 3);
            const colors = new Float32Array(starQty * 3);
            const sizes = new Float32Array(starQty);

            for (let i = 0; i < starQty; i++) {
                const r = THREE.MathUtils.randFloat(900, 3000);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const i3 = i * 3;
                positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = r * Math.cos(phi);

                const baseColor = new THREE.Color(0xffffff);
                const randomColorFactor = Math.random();
                if (randomColorFactor < 0.4) {
                    baseColor.lerp(new THREE.Color(0x9ab0ff), Math.random() * 0.7 + 0.1);
                } else if (randomColorFactor < 0.75) {
                     baseColor.lerp(new THREE.Color(0xffe8c0), Math.random() * 0.7 + 0.1);
                }
                colors[i3] = baseColor.r;
                colors[i3 + 1] = baseColor.g;
                colors[i3 + 2] = baseColor.b;

                if (Math.random() < 0.03) {
                    sizes[i] = Math.random() * 1.2 + 1.0;
                } else if (Math.random() < 0.2) {
                     sizes[i] = Math.random() * 0.5 + 0.5;
                }
                else {
                    sizes[i] = Math.random() * 0.3 + 0.2;
                }
            }
            starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const starMaterial = new THREE.PointsMaterial({
                transparent: true,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                sizeAttenuation: true,
                depthWrite: false
            });
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);
        }

        function createDistantNebulae() { /* ... NO CHANGE ... */
            const nebulaGeometry = new THREE.SphereGeometry(3500, 64, 64);

            const nebulaTexture = createProceduralTexture(1024, 512, (ctx, w, h) => {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0,0,w,h);
                for(let i=0; i < 100; i++) {
                    const centerX = Math.random() * w;
                    const centerY = Math.random() * h;
                    const radiusX = Math.random() * w * 0.4 + w * 0.15;
                    const radiusY = Math.random() * h * 0.4 + h * 0.15;
                    const rotation = Math.random() * Math.PI;

                    const r = Math.floor(Math.random() * 40 + 10);
                    const g = Math.floor(Math.random() * 40 + 15);
                    const b = Math.floor(Math.random() * 60 + 30);
                    const alpha = Math.random() * 0.025 + 0.005;

                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(rotation);
                    const gradient = ctx.createRadialGradient(0,0,0, 0,0, Math.max(radiusX, radiusY));
                    gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
                    gradient.addColorStop(0.7, `rgba(${r*0.8},${g*0.8},${b*0.8},${alpha*0.5})`);
                    gradient.addColorStop(1, `rgba(${r*0.5},${g*0.5},${b*0.5},0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.ellipse(0,0, radiusX, radiusY, 0, 0, 2*Math.PI);
                    ctx.fill();
                    ctx.restore();
                }
            });

            const nebulaMaterial = new THREE.MeshBasicMaterial({
                map: nebulaTexture,
                side: THREE.BackSide,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            scene.add(nebulaMesh);
        }

        function createKuiperBelt() {
            const kuiperObjectCount = 10000;
            const beltInnerRadius = 160;
            const beltOuterRadius = 240;
            const beltHeight = 35;

            const kboMaterial = new THREE.PointsMaterial({
                color: 0x788898,
                size: 0.22,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            });

            let worker;
            try {
                worker = new Worker(WORKER_URL);
            } catch (e) {
                console.error("Kuiper Worker failed:", e);
                return;
            }
            
            worker.onerror = function(err) {
                console.error("Kuiper Worker Error:", err);
            };
            
            worker.onmessage = function(e) {
                if (e.data.type === 'KUIPER_BELT_DATA') {
                    const positions = e.data.positions;
                    const kboGeometry = new THREE.BufferGeometry();
                    kboGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    const kuiperBelt = new THREE.Points(kboGeometry, kboMaterial);
                    kuiperBelt.userData = {
                        displayName: "Kuiper Belt",
                        type: "Kuiper Belt Objects"
                    };
                    scene.add(kuiperBelt);
                    console.log("Kuiper Belt re-initialized with " + kuiperObjectCount + " objects via Web Worker.");
                    worker.terminate();
                }
            };
            worker.postMessage({
                type: 'GENERATE_KUIPER_BELT',
                data: { count: kuiperObjectCount, beltInnerRadius, beltOuterRadius, beltHeight }
            });
        }

// ... (rest of the code remains the same)
        function createComet(cometData) { // Added metric data to userData
            const defaults = { /* ... NO CHANGE, but ensure it includes type, orbitSemiMajorAxisAU, coreRadiusMetric ... */
                name: "Comet", displayName: "彗星", type: "彗星",
                orbitRadius: 250, orbitSemiMajorAxisAU: 50, 
                eccentricity: 0.95, speed: 0.0015, rotationSpeed: 0.005,
                coreRadius: 0.25, coreRadiusMetric: 5, 
                coreColor: 0xe0e0ff, coreEmissive: 0xccccff, coreEmissiveIntensity: 0.4,
                tailColor: 0xb0c0ff, tailParticleCount: 800, tailBaseOpacity: 0.2,
                tailSize: 0.1, tailInitialLengthFactor: 5,
                initialOrbitRotationX: Math.PI / 3, initialOrbitRotationY: Math.random() * Math.PI * 2,
            };
            const data = { ...defaults, ...cometData };

            const coreGeometry = new THREE.IcosahedronGeometry(data.coreRadius, 0); // Use visual coreRadius
            const coreMaterial = new THREE.MeshStandardMaterial({ /* ... NO CHANGE ... */
                color: data.coreColor,
                roughness: 0.6,
                metalness: 0.05,
                emissive: data.coreEmissive,
                emissiveIntensity: data.coreEmissiveIntensity
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            core.name = data.name + "Core";
            core.userData = { // Ensure all necessary fields for info panel are here
                displayName: data.displayName,
                type: data.type, // Should be "彗星"
                radius: data.coreRadius,         // Visual radius for scene scale
                radiusMetric: data.coreRadiusMetric,   // Actual core radius in km
                orbitRadius: data.orbitRadius, // Scene units for semi-major axis (visual)
                orbitSemiMajorAxisAU: data.orbitSemiMajorAxisAU, // Actual semi-major axis in AU
                eccentricity: data.eccentricity
            };
            core.castShadow = true;
            
 

            const tailMaterial = new THREE.PointsMaterial({ /* ... NO CHANGE ... */
                color: data.tailColor,
                size: data.tailSize,
                transparent: true,
                opacity: data.tailBaseOpacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true,
            });
            tailMaterial.userData = { baseOpacity: data.tailBaseOpacity };


            const tailPositions = []; /* ... NO CHANGE ... */
            for (let i = 0; i < data.tailParticleCount; i++) {
                const r = Math.random();
                tailPositions.push(
                    (Math.random() - 0.5) * 0.3 * (1 + r),
                    (Math.random() - 0.5) * 0.3 * (1 + r),
                    -Math.random() * data.tailInitialLengthFactor * (1 + r * 2)
                );
            }
            const tailGeometry = new THREE.BufferGeometry(); /* ... NO CHANGE ... */
            tailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(tailPositions, 3));
            const tail = new THREE.Points(tailGeometry, tailMaterial); /* ... NO CHANGE ... */
            tail.name = data.name + "Tail";
            tail.userData = { baseScaleZ: data.tailInitialLengthFactor };
            core.add(tail);

            const orbitPivot = new THREE.Object3D(); /* ... NO CHANGE ... */
            orbitPivot.add(core);
            orbitPivot.rotation.x = data.initialOrbitRotationX;
            orbitPivot.rotation.y = data.initialOrbitRotationY;

            scene.add(orbitPivot);

            celestialObjects.push({ /* ... NO CHANGE in structure, data comes from cometData via core.userData ... */
                isComet: true,
                mesh: core, // core mesh has the rich userData
                pivot: orbitPivot,
                speed: data.speed,
                rotationSpeed: data.rotationSpeed,
                orbitRadius: data.orbitRadius, // Scene units for positioning
                eccentricity: data.eccentricity,
                tail: tail,
                // Redundant, but can be useful for quick checks without traversing to mesh.userData
                displayName: data.displayName,
                type: data.type,
                radius: data.coreRadius // Visual radius
            });
            console.log(`${data.displayName} initialized: a_scene=${data.orbitRadius}, a_AU=${data.orbitSemiMajorAxisAU}, e=${data.eccentricity}, r_visual=${data.coreRadius}, r_metric=${data.coreRadiusMetric}km`);
        }


        function onPointerDown(event) {
            pointerDownPosition.x = event.clientX;
            pointerDownPosition.y = event.clientY;
        }

        function onPointerUp(event) { // Updated to show more specific data
            // Ignore if it's a drag (10px tolerance)
            const deltaX = Math.abs(event.clientX - pointerDownPosition.x);
            const deltaY = Math.abs(event.clientY - pointerDownPosition.y);
            if (deltaX > 10 || deltaY > 10) return;

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            // Try all intersected objects, not just the first, to find one with displayName
            let clickedObjectData = null;
            let tempObj = null;
            
            for (let ii = 0; ii < Math.min(intersects.length, 10); ii++) {
                let candidate = intersects[ii].object;
                while (candidate && candidate !== scene) {
                    if (candidate.name === 'sunGlowSprite' || (candidate.parent && candidate.parent.type === 'Lensflare')) {
                        candidate = null; // skip glow/lens
                        break;
                    }
                    if (candidate.userData && candidate.userData.displayName) {
                        clickedObjectData = candidate.userData;
                        tempObj = candidate;
                        break;
                    }
                    candidate = candidate.parent;
                }
                if (clickedObjectData) break;
            }

                if (clickedObjectData) {
                    const data = clickedObjectData;
                    document.getElementById('info-title').innerText = data.displayName;
                    document.getElementById('info-name').innerText = `Name: ${data.displayName}`;
                    document.getElementById('info-type').innerText = `Type: ${data.type || 'Unknown'}`;

                    document.getElementById('info-radius-metric').innerText = `Radius (km): ${data.radiusMetric !== undefined ? data.radiusMetric.toLocaleString() : 'N/A'}`;
                    document.getElementById('info-radius-relative').innerText = `Radius (Earth=1): ${data.radius !== undefined ? data.radius.toFixed(2) : 'N/A'}`;
                    
                    let orbitAUText = "Orbital Semi-Major Axis (AU): ";
                    if (data.orbitSemiMajorAxisAU !== undefined) {
                        if (data.orbitSemiMajorAxisAU === 0 && data.type === "Star") {
                            orbitAUText += "Solar Center";
                        } else {
                            orbitAUText += data.orbitSemiMajorAxisAU.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3});
                            // For moons, specify parent if possible (this part is tricky without direct parent data here)
                            // We'd need to traverse from the clicked moon mesh up to its planet parent in the scene graph
                            // For simplicity, this is omitted for now from the generic data display.
                        }
                    } else {
                        orbitAUText += 'N/A';
                    }
                    document.getElementById('info-orbit-au').innerText = orbitAUText;

                    document.getElementById('info-orbit-scene').innerText = `Orbit (Scene Units): ${data.orbitRadius !== undefined ? (data.orbitRadius === 0 && data.type === "Star" ? "Center" : data.orbitRadius.toFixed(1)) : 'N/A'}`;
                    document.getElementById('info-eccentricity').innerText = `Orbital Eccentricity: ${data.e !== undefined ? data.e.toFixed(4) : (data.eccentricity !== undefined ? data.eccentricity.toFixed(4) : 'N/A')}`;

                    document.getElementById('info-panel').style.display = 'block';
                    
                    // Set tracked object for camera tracking
                    trackedObject = tempObj;
                    isTransitioningCamera = true;
                    
                    // Initialize or update _lastPos
                    const targetPosition = new THREE.Vector3();
                    tempObj.getWorldPosition(targetPosition);
                    if (!tempObj.userData._lastPos) {
                        tempObj.userData._lastPos = targetPosition.clone();
                    }
                    
                    // Calculate target distance based on object size
                    const objectRadius = data.radius || 1;
                    const minDistance = data.type === "Star" ? 60 : 5;
                    const distance = Math.max(objectRadius * 4, minDistance);
                    
                    // Transition camera using TWEEN
                    const offset = camera.position.clone().sub(controls.target).normalize();
                    // If looking straight down/up or very close, ensure a sensible offset
                    if (offset.length() < 0.1) offset.set(0, 0, 1);
                    offset.multiplyScalar(distance);
                    
                    const newCamPos = targetPosition.clone().add(offset);
                    
                    new TWEEN.Tween(camera.position)
                        .to({ x: newCamPos.x, y: newCamPos.y, z: newCamPos.z }, 1500)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onComplete(() => { isTransitioningCamera = false; })
                        .start();
                        
                    new TWEEN.Tween(controls.target)
                        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1500)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .start();
                        
                } else {
                     // document.getElementById('info-panel').style.display = 'none'; // Hide if nothing useful clicked
                }
        }


        function onWindowResize() { /* ... NO CHANGE ... */
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
 
        }

        function animate() { /* ... NO CHANGE in core logic, but relies on correct celestialObjects data ... */
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            TWEEN.update();

            if (!shaderUniforms || shaderUniforms.time === undefined) {
                console.error('[DEBUG] CRITICAL: shaderUniforms.time is undefined! Sun shader will not animate.');
            } else {
                shaderUniforms.time.value = elapsedTime;
            }

            const baseOrbitSpeedMultiplier = 2.5;
            const baseRotationSpeedMultiplier = 2;

            celestialObjects.forEach(obj => {
                obj.pivot.rotation.y += obj.speed * delta * baseOrbitSpeedMultiplier;
                const M = obj.pivot.rotation.y; // Mean Anomaly
                const e = obj.eccentricity || 0;
                const a = obj.orbitRadius; // Scene orbit radius

                let r = a; // Distance from focus (sun/parent)
                let trueAnomaly = M;

                if (e > 0.0001) {
                    let E = M; // Eccentric Anomaly
                    for (let i = 0; i < 7; i++) { E = M + e * Math.sin(E); }
                    r = a * (1 - e * Math.cos(E));
                    trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
                }
                
                // 恢复原来的运动机制：物体放在X轴上，通过pivot旋转来定位
                const positionedObject = obj.axialTiltGroup || obj.mesh;
                if (positionedObject) {
                     // For planets/moons, the axialTiltGroup is positioned. For asteroids/comets, the mesh itself.
                    positionedObject.position.x = r;
                }


                if (obj.mesh) { // Self-rotation
                    obj.mesh.rotation.y += (obj.rotationSpeed || 0) * delta * baseRotationSpeedMultiplier;
                }

                if (obj.isComet && obj.tail) { /* ... NO CHANGE IN TAIL LOGIC ... */
                    const sunPosition = new THREE.Vector3(0,0,0); 
                    const cometWorldPosition = new THREE.Vector3();
                    obj.mesh.getWorldPosition(cometWorldPosition); 

                    const directionToSun = sunPosition.clone().sub(cometWorldPosition).normalize();
                    obj.tail.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,-1), directionToSun); 

                    const distToSun = cometWorldPosition.length();
                    const maxDist = obj.orbitRadius * (1 + obj.eccentricity); 
                    const minDist = obj.orbitRadius * (1 - obj.eccentricity); 

                    let tailFactor = 1.0 - THREE.MathUtils.smoothstep(distToSun, minDist * 1.1, maxDist * 0.9);
                    tailFactor = Math.max(0.01, Math.pow(tailFactor, 1.5)); 

                    const baseOpacity = obj.tail.material.userData.baseOpacity || 0.2;
                    obj.tail.material.opacity = Math.min(baseOpacity * 0.1 + tailFactor * baseOpacity * 4.0, baseOpacity * 5.0);

                    const baseScaleZ = obj.tail.userData.baseScaleZ || 5; 
                    const scaleZ = (0.2 + tailFactor * 1.5) * (baseScaleZ + Math.log1p(obj.orbitRadius/80));
                    obj.tail.scale.set(1, 1, Math.max(0.1, scaleZ));
                }
            });

            if (trackedObject) {
                const targetPos = new THREE.Vector3();
                trackedObject.getWorldPosition(targetPos);
                
                if (!isTransitioningCamera) {
                    if (trackedObject.userData && trackedObject.userData._lastPos) {
                        const moveDelta = targetPos.clone().sub(trackedObject.userData._lastPos);
                        camera.position.add(moveDelta);
                    }
                    controls.target.copy(targetPos);
                }
                
                if (trackedObject.userData) {
                    trackedObject.userData._lastPos = targetPos.clone();
                }
            }

            if (sun && sunGlowObject && sunLensflare) { /* ... NO CHANGE IN SUN OCCLUSION LOGIC ... */
                const sunWorldPosition = new THREE.Vector3();
                sun.getWorldPosition(sunWorldPosition);

                const cameraWorldPosition = new THREE.Vector3();
                camera.getWorldPosition(cameraWorldPosition);

                const frustum = new THREE.Frustum();
                const projScreenMatrix = new THREE.Matrix4();
                projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
                frustum.setFromProjectionMatrix(projScreenMatrix);

                let sunInView = frustum.containsPoint(sunWorldPosition);
                let sunOccluded = false;

                if (sunInView) {
                    const directionToSun = new THREE.Vector3().subVectors(sunWorldPosition, cameraWorldPosition).normalize();
                    raycaster.set(cameraWorldPosition, directionToSun);
                    const objectsToTest = scene.children.filter(objInScene =>
                        objInScene !== sun &&
                        objInScene !== sunGlowObject &&
                        !(objInScene.type === 'Lensflare') && // Check type of object, not material
                        objInScene.isMesh && 
                        objInScene.material && !objInScene.material.transparent && 
                        objInScene.geometry &&
                        objInScene.visible // Only test visible objects
                    );
                    const intersects = raycaster.intersectObjects(objectsToTest, true); // Recursive check

                    if (intersects.length > 0) {
                        const distanceToSun = cameraWorldPosition.distanceTo(sunWorldPosition);
                        // Ensure sun.geometry exists before accessing parameters
                        const effectiveSunRadius = (sun.geometry && sun.geometry.parameters) ? sun.geometry.parameters.radius : sunRadiusVisual;
                        if (intersects[0].distance < distanceToSun - effectiveSunRadius) {
                            sunOccluded = true;
                        }
                    }
                }

                const shouldBeVisible = sunInView && !sunOccluded;
                if (sunGlowObject) sunGlowObject.visible = shouldBeVisible;
                if (sunLensflare) sunLensflare.visible = shouldBeVisible;
            }


            controls.update();
            renderer.render(scene, camera);
 
        }

        // Toggle orbit glow function
        function toggleOrbitGlow() {
            orbitGlowEnabled = !orbitGlowEnabled;
            const button = document.getElementById('orbit-glow-button');
            
            if (orbitGlowEnabled) {
                button.textContent = '🪐 Orbit: On';
                button.style.borderColor = '#9966ff';
                button.style.boxShadow = '0 0 10px rgba(153,102,255,0.5)';
                
                // Enable glow for all orbit lines
                orbitLines.forEach(orbitLine => {
                    if (orbitLine.userData.isPlanetOrbit) {
                        orbitLine.material.color.setHex(0x9966ff);
                        orbitLine.material.opacity = 0.8;
                        orbitLine.material.linewidth = 2;
                    } else if (orbitLine.userData.isMoonOrbit) {
                        orbitLine.material.color.setHex(0x66aaff);
                        orbitLine.material.opacity = 0.6;
                        orbitLine.material.linewidth = 1;
                    }
                });
            } else {
                button.textContent = '🪐 Orbit: Off';
                button.style.borderColor = '#444';
                button.style.boxShadow = 'none';
                
                // Disable glow for all orbit lines
                orbitLines.forEach(orbitLine => {
                    if (orbitLine.userData.isPlanetOrbit) {
                        orbitLine.material.color.setHex(0x282828);
                        orbitLine.material.opacity = 0.25;
                        orbitLine.material.linewidth = 1;
                    } else if (orbitLine.userData.isMoonOrbit) {
                        orbitLine.material.color.setHex(0x444444);
                        orbitLine.material.opacity = 0.3;
                        orbitLine.material.linewidth = 1;
                    }
                });
            }
        }

        // Music control functionality
        let musicEnabled = false;
        const backgroundMusic = document.getElementById('background-music');
        
        function toggleMusic() {
            const button = document.getElementById('music-button');
            
            if (musicEnabled) {
                // Turn off music
                backgroundMusic.pause();
                musicEnabled = false;
                button.textContent = '🎵 Music: Off';
                button.style.borderColor = '#444';
                button.style.boxShadow = 'none';
            } else {
                // Turn on music
                backgroundMusic.play().then(() => {
                    musicEnabled = true;
                    button.textContent = '🎵 Music: On';
                    button.style.borderColor = '#c0c0c0';
                    button.style.boxShadow = '0 0 10px rgba(192,192,192,0.7)';
                }).catch(error => {
                    console.log('Music autoplay prevented by browser:', error);
                    // Show user-friendly message
                    button.textContent = '🎵 Click to Play';
                    button.style.borderColor = '#ffaa00';
                });
            }
        }
        
        // Initialize music button state (removed auto-start due to browser limitations)
        function initializeMusicButton() {
            const button = document.getElementById('music-button');
            // Keep initial state as Music Off
            musicEnabled = false;
            button.textContent = '🎵 Music: Off';
            button.style.borderColor = '#444';
            button.style.boxShadow = 'none';
            console.log('Music button initialized - user can click to start music');
        }
        
        // Try to enable music after user interaction
        document.addEventListener('click', function enableMusicOnFirstClick() {
            if (!musicEnabled && backgroundMusic.paused) {
                // This will be called on first user click anywhere on the page
                document.removeEventListener('click', enableMusicOnFirstClick);
            }
        });

        window.onload = function() {
            init().then(() => {
                animate();
                initializeMusicButton();
            }).catch(error => {
                console.error("初始化或动画过程中发生错误:", error);
                const errorDiv = document.createElement('div');
                errorDiv.style.position = 'fixed'; 
                errorDiv.style.bottom = '10px';
                errorDiv.style.left = '10px';
                errorDiv.style.padding = '10px';
                errorDiv.style.backgroundColor = 'rgba(255,0,0,0.7)';
                errorDiv.style.color = "white";
                errorDiv.style.zIndex = "1000";
                errorDiv.textContent = "发生严重错误，请检查浏览器控制台。错误: " + error.message;
                document.body.appendChild(errorDiv);

                if (error instanceof Error) {
                    console.error("Error Type: ", error.name);
                    console.error("Error Message: ", error.message);
                    console.error("Error Stack: ", error.stack);
                } else {
                    try {
                        console.error("Raw error object (attempting JSON stringify): ", JSON.stringify(error, null, 2));
                    } catch (e) {
                        console.error("Raw error object (could not stringify): ", error);
                    }
                }
            });
        };