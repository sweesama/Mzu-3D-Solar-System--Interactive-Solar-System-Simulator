(function exposeSolarQualityPolicy(root, factory) {
    const policy = factory();
    if (typeof module === 'object' && module.exports) module.exports = policy;
    if (root) root.SolarQualityPolicy = policy;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createSolarQualityPolicy() {
    const VALID_PREFERENCES = new Set(['auto', 'high', 'balanced', 'low']);
    const RENDER_PROFILES = Object.freeze({
        high: Object.freeze({ asteroids: 3000, stars: 40000, kuiperObjects: 10000, maxPixelRatio: 2, featuredModels: true }),
        balanced: Object.freeze({ asteroids: 1800, stars: 26000, kuiperObjects: 7000, maxPixelRatio: 1.75, featuredModels: true }),
        low: Object.freeze({ asteroids: 700, stars: 12000, kuiperObjects: 3000, maxPixelRatio: 1.25, featuredModels: false })
    });

    function normalizePreference(value) {
        const normalized = String(value || '').toLowerCase();
        if (normalized === 'medium') return 'balanced';
        return VALID_PREFERENCES.has(normalized) ? normalized : '';
    }

    function chooseAutomaticQuality(signals = {}) {
        const deviceMemory = Number(signals.deviceMemory || 0);
        const hardwareThreads = Number(signals.hardwareThreads || 0);
        const viewportPixels = Number(signals.viewportPixels || 0);
        const compactViewport = Boolean(signals.compactViewport);
        const saveData = Boolean(signals.saveData);

        const clearlyMemoryConstrained = deviceMemory > 0 && deviceMemory <= 2;
        const clearlyCpuConstrained = hardwareThreads > 0 && hardwareThreads <= 2;
        const jointlyConstrained = deviceMemory > 0 && deviceMemory <= 4 &&
            hardwareThreads > 0 && hardwareThreads <= 4;
        if (saveData || clearlyMemoryConstrained || clearlyCpuConstrained || jointlyConstrained) return 'low';

        const strongMemory = deviceMemory >= 8;
        const strongCpu = hardwareThreads >= 8;
        const manageablePixelLoad = viewportPixels > 0 && viewportPixels <= 5200000;
        const strongKnownDevice = strongMemory && strongCpu;
        const strongDesktopWithOneUnknownSignal = !compactViewport &&
            ((strongMemory && hardwareThreads === 0) || (strongCpu && deviceMemory === 0));
        if (manageablePixelLoad && (strongKnownDevice || strongDesktopWithOneUnknownSignal)) return 'high';

        return 'balanced';
    }

    return Object.freeze({
        QUALITY_STORAGE_KEY: 'mzu-solar-quality',
        RENDER_PROFILES,
        normalizePreference,
        chooseAutomaticQuality
    });
}));
