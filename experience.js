const planetTour = [
    { name: 'Mercury', fact: 'Mercury is the smallest major planet and completes one orbit in about 88 Earth days.' },
    { name: 'Venus', fact: 'Venus is close to Earth in size, but its dense atmosphere creates extreme surface temperatures.' },
    { name: 'Earth', fact: 'Earth is the only world currently known to have stable liquid surface oceans and life.' },
    { name: 'Mars', fact: 'Iron minerals in Martian soil give the cold, dusty planet its familiar red appearance.' },
    { name: 'Jupiter', fact: 'Jupiter is the largest planet and has more mass than all the other planets combined.' },
    { name: 'Saturn', fact: 'Saturn’s broad rings are made mostly of ice particles, with rock and dust mixed in.' },
    { name: 'Uranus', fact: 'Uranus rotates on an axis tilted roughly sideways relative to its orbit.' },
    { name: 'Neptune', fact: 'Neptune is the farthest major planet and has exceptionally fast atmospheric winds.' }
];

let currentTourStep = -1;
let toastTimer = null;

function trackExperienceEvent(eventName, parameters = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, parameters);
}

function showToast(message) {
    const toast = document.getElementById('action-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

function updateQualityUi() {
    const qualitySelect = document.getElementById('quality-select');
    const qualityStatus = document.getElementById('quality-status');
    const state = window.SOLAR_QUALITY;
    if (!qualitySelect || !qualityStatus || !state) return;

    qualitySelect.value = state.preference;
    const activeLabel = state.active.charAt(0).toUpperCase() + state.active.slice(1);
    if (state.preference === 'auto') {
        qualityStatus.textContent = state.runtimeReliefLevel
            ? `${activeLabel}, adjusted for smoothness`
            : `Auto selected ${activeLabel}`;
    } else {
        qualityStatus.textContent = `${activeLabel} selected`;
    }
}

function changeQualityPreference(preference) {
    const normalized = ['auto', 'high', 'balanced', 'low'].includes(preference) ? preference : 'auto';
    let stored = false;
    try {
        window.localStorage.setItem(QUALITY_STORAGE_KEY, normalized);
        stored = true;
    } catch (error) {
        stored = false;
    }

    const url = new URL(window.location.href);
    if (stored || normalized === 'auto') url.searchParams.delete('quality');
    else url.searchParams.set('quality', normalized);
    trackExperienceEvent('solar_quality_change', { quality_preference: normalized });
    window.location.replace(url.toString());
}

function fillObjectInfo(data) {
    document.getElementById('info-title').innerText = data.displayName || data.name || 'Celestial object';
    document.getElementById('info-name').innerText = `Name: ${data.displayName || data.name || 'Unknown'}`;
    document.getElementById('info-type').innerText = `Type: ${data.type || 'Unknown'}`;
    document.getElementById('info-radius-metric').innerText = `Radius (km): ${data.radiusMetric !== undefined ? data.radiusMetric.toLocaleString() : 'N/A'}`;
    document.getElementById('info-radius-relative').innerText = `Radius (Earth=1): ${data.radius !== undefined ? data.radius.toFixed(2) : 'N/A'}`;
    document.getElementById('info-orbit-au').innerText = `Orbital semi-major axis (AU): ${data.orbitSemiMajorAxisAU !== undefined ? data.orbitSemiMajorAxisAU.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : 'N/A'}`;
    document.getElementById('info-orbit-scene').innerText = `Orbit (visual units): ${data.orbitRadius !== undefined ? (data.orbitRadius === 0 && data.type === 'Star' ? 'Centre' : data.orbitRadius.toFixed(1)) : 'N/A'}`;
    document.getElementById('info-eccentricity').innerText = `Orbital eccentricity: ${data.e !== undefined ? data.e.toFixed(4) : (data.eccentricity !== undefined ? data.eccentricity.toFixed(4) : 'N/A')}`;
    document.getElementById('info-panel').style.display = 'block';
}

function findCelestialObject(name) {
    if (!name) return null;
    const normalizedName = String(name).toLowerCase();
    return celestialObjects.find(object => {
        const data = object.mesh && object.mesh.userData ? object.mesh.userData : object;
        return [object.displayName, object.name, data.displayName, data.name]
            .filter(Boolean)
            .some(value => String(value).toLowerCase() === normalizedName);
    }) || null;
}

function syncFocusedView(name, source = 'unknown') {
    if (!name) return;
    window.CURRENT_FOCUS = name;
    const url = new URL(window.location.href);
    url.searchParams.set('focus', name);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    document.querySelectorAll('[data-focus]').forEach(link => {
        if (link.getAttribute('data-focus').toLowerCase() === String(name).toLowerCase()) {
            link.dataset.selected = 'true';
        } else {
            delete link.dataset.selected;
        }
    });
    trackExperienceEvent('solar_object_focus', { object_name: name, interaction_source: source });
}

function focusCelestialObject(name, options = {}) {
    const { updateUrl = true, duration = 1300, source = 'guide' } = options;
    const target = findCelestialObject(name);
    if (!target || !target.mesh) {
        showToast(`Could not find ${name} in this scene.`);
        return false;
    }

    const data = target.mesh.userData || target;
    if (data.type && /belt/i.test(data.type)) return false;

    fillObjectInfo(data);
    trackedObject = target.mesh;
    isTransitioningCamera = true;

    const targetPosition = new THREE.Vector3();
    target.mesh.getWorldPosition(targetPosition);
    target.mesh.userData._lastPos = targetPosition.clone();

    const objectRadius = data.radius || 1;
    const isStar = data.type && data.type.toLowerCase() === 'star';
    const distance = isStar ? Math.max(objectRadius * 4, 60) : objectRadius * 2.5;
    controls.minDistance = isStar ? 20 : Math.max(0.5, objectRadius * 1.2);

    const offset = camera.position.clone().sub(controls.target).normalize();
    if (offset.length() < 0.1) offset.set(0, 0, 1);
    offset.multiplyScalar(distance);
    const cameraDestination = targetPosition.clone().add(offset);

    activeCameraTweens.forEach(tween => tween.stop());
    activeCameraTweens = [];

    const cameraTween = new TWEEN.Tween(camera.position)
        .to({ x: cameraDestination.x, y: cameraDestination.y, z: cameraDestination.z }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => { isTransitioningCamera = false; })
        .start();
    const targetTween = new TWEEN.Tween(controls.target)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    activeCameraTweens.push(cameraTween, targetTween);

    if (updateUrl) syncFocusedView(data.displayName || data.name || name, source);
    return true;
}

function setGuideVisible(visible) {
    const panel = document.getElementById('experience-panel');
    const openButton = document.getElementById('panel-open');
    if (!panel || !openButton) return;
    panel.hidden = !visible;
    openButton.hidden = visible;
    trackExperienceEvent(visible ? 'solar_guide_open' : 'solar_guide_close');
}

async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
    }
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
}

async function shareCurrentView() {
    const focusName = window.CURRENT_FOCUS || window.INITIAL_PLANET || 'the Solar System';
    const shareData = {
        title: `${focusName} — Mzu 3D Solar System`,
        text: `Explore ${focusName} in this interactive 3D Solar System visualization.`,
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showToast('Share sheet opened.');
            trackExperienceEvent('solar_view_share', { method: 'native', object_name: focusName });
        } else {
            await copyText(shareData.url);
            showToast('View link copied.');
            trackExperienceEvent('solar_view_share', { method: 'clipboard', object_name: focusName });
        }
    } catch (error) {
        if (error && error.name !== 'AbortError') showToast('Sharing was not available.');
    }
}

function saveSceneImage() {
    if (!renderer || !renderer.domElement) {
        showToast('The scene is still loading.');
        return;
    }
    try {
        renderer.render(scene, camera);
        const imageUrl = renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        const focusName = String(window.CURRENT_FOCUS || window.INITIAL_PLANET || 'solar-system').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        link.href = imageUrl;
        link.download = `mzu-${focusName}-3d-view.png`;
        link.click();
        showToast('Scene image saved.');
        trackExperienceEvent('solar_snapshot_download', { object_name: focusName });
    } catch (error) {
        console.error('Snapshot failed:', error);
        showToast('This browser could not save the scene image.');
    }
}

async function copyEmbedCode() {
    const url = new URL(window.location.href);
    url.searchParams.set('embed', '1');
    url.searchParams.delete('quality');
    const code = `<iframe src="${url.toString()}" title="Interactive 3D Solar System" loading="lazy" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px"></iframe>`;
    try {
        await copyText(code);
        showToast('Responsive embed code copied.');
        trackExperienceEvent('solar_embed_copy', { object_name: window.CURRENT_FOCUS || window.INITIAL_PLANET || 'solar-system' });
    } catch (error) {
        showToast('Could not copy the embed code.');
    }
}

function advancePlanetTour() {
    currentTourStep = (currentTourStep + 1) % planetTour.length;
    const step = planetTour[currentTourStep];
    if (!focusCelestialObject(step.name, { source: 'guided-tour' })) return;

    const card = document.getElementById('tour-card');
    card.hidden = false;
    document.getElementById('tour-progress').textContent = `Stop ${currentTourStep + 1} of ${planetTour.length}`;
    document.getElementById('tour-title').textContent = step.name;
    document.getElementById('tour-fact').textContent = step.fact;
    document.getElementById('tour-button').textContent = currentTourStep === planetTour.length - 1 ? 'Restart planet tour' : 'Next planet';
    trackExperienceEvent('solar_tour_step', { step_number: currentTourStep + 1, object_name: step.name });
}

function setupExperienceUi() {
    const embedMode = pageParameters.get('embed') === '1';
    if (embedMode) {
        document.body.classList.add('embed-mode');
        const fullUrl = new URL(window.location.href);
        fullUrl.searchParams.delete('embed');
        document.getElementById('embed-badge').href = fullUrl.toString();
    }
    if (lowDetailMode) document.body.classList.add('low-detail-mode');

    document.getElementById('panel-close').addEventListener('click', () => setGuideVisible(false));
    document.getElementById('panel-open').addEventListener('click', () => setGuideVisible(true));
    document.querySelector('#info-panel .close-button').addEventListener('click', () => {
        document.getElementById('info-panel').style.display = 'none';
    });
    document.getElementById('music-button').addEventListener('click', toggleMusic);
    document.getElementById('orbit-glow-button').addEventListener('click', toggleOrbitGlow);
    document.getElementById('tour-button').addEventListener('click', advancePlanetTour);
    document.getElementById('share-button').addEventListener('click', shareCurrentView);
    document.getElementById('snapshot-button').addEventListener('click', saveSceneImage);
    document.getElementById('embed-button').addEventListener('click', copyEmbedCode);
    document.getElementById('quality-select').addEventListener('change', event => {
        changeQualityPreference(event.target.value);
    });
    updateQualityUi();

    window.addEventListener('solar-quality-adjusted', event => {
        updateQualityUi();
        showToast(`Auto quality reduced render load after ${event.detail.measuredFps} fps.`);
        trackExperienceEvent('solar_quality_auto_adjust', {
            relief_level: event.detail.level,
            measured_fps: event.detail.measuredFps
        });
    });

    if (document.body.dataset.pageKind === 'home') {
        document.querySelectorAll('[data-focus]').forEach(link => {
            link.addEventListener('click', event => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (focusCelestialObject(link.dataset.focus, { source: 'planet-navigation' })) event.preventDefault();
            });
        });
    }

    document.addEventListener('keydown', event => {
        if (event.key.toLowerCase() !== 'g' || event.target.matches('input, textarea, select, button')) return;
        setGuideVisible(document.getElementById('experience-panel').hidden);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            clock.stop();
        } else if (renderer && animationFrameId === null) {
            performanceSampleStartedAt = 0;
            performanceSampleFrames = 0;
            clock.start();
            animate();
        }
    });

    if (window.INITIAL_PLANET) {
        window.CURRENT_FOCUS = window.INITIAL_PLANET;
        document.querySelectorAll('[data-focus]').forEach(link => {
            if (link.dataset.focus.toLowerCase() === String(window.INITIAL_PLANET).toLowerCase()) link.dataset.selected = 'true';
        });
    }
}
