(function exposeSiteAnalytics(root, factory) {
    const analytics = factory();
    if (typeof module === 'object' && module.exports) module.exports = analytics;
    if (root) root.SiteAnalytics = analytics;
    if (root && root.document && root.location) analytics.install(root);
}(typeof globalThis !== 'undefined' ? globalThis : this, function createSiteAnalytics() {
    const MEASUREMENT_ID = 'G-783407FTTB';

    function shouldLoad(location) {
        if (!location) return false;
        const protocol = String(location.protocol || '').toLowerCase();
        const host = String(location.hostname || '').toLowerCase();
        if (protocol === 'file:') return false;
        if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]' || host === '0.0.0.0') return false;
        if (host.endsWith('.local')) return false;
        return true;
    }

    function install(root) {
        if (!shouldLoad(root && root.location)) return false;
        const script = root.document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
        root.document.head.appendChild(script);
        root.dataLayer = root.dataLayer || [];
        function gtag() { root.dataLayer.push(arguments); }
        root.gtag = gtag;
        gtag('js', new Date());
        gtag('config', MEASUREMENT_ID);
        return true;
    }

    return { MEASUREMENT_ID, shouldLoad, install };
}));
