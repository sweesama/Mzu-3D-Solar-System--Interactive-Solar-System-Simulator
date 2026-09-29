(function () {
    'use strict';
    // Lets visitors scroll down to the "About this expedition" article while the
    // arrival card is showing, and locks the page back to the full-screen scene
    // (scrolled to the top) the moment the expedition begins.
    const card = document.getElementById('arrival-card');
    const article = document.getElementById('about');
    if (!card || !article) return;
    const root = document.documentElement;
    function sync() {
        const reading = !card.hidden;
        if (!reading) window.scrollTo(0, 0);
        root.classList.toggle('can-read', reading);
    }
    new MutationObserver(sync).observe(card, { attributes: true, attributeFilter: ['hidden'] });
    sync();
}());
