/*
 * Fills the live sky pages from SkyEphemeris. All of the arithmetic
 * stays in the browser. This file does not call a server.
 */
(function () {
    'use strict';

    var BODIES = [
        { name: 'Sun', href: '/?focus=Sun', closest: 'Next perihelion' },
        { name: 'Moon', href: '/moon.html', closest: 'Next perigee' },
        { name: 'Mercury', href: '/mercury.html', closest: 'Next closest' },
        { name: 'Venus', href: '/venus.html', closest: 'Next closest' },
        { name: 'Mars', href: '/mars.html', closest: 'Next closest' },
        { name: 'Jupiter', href: '/jupiter.html', closest: 'Next closest' },
        { name: 'Saturn', href: '/saturn.html', closest: 'Next closest' },
        { name: 'Uranus', href: '/uranus.html', closest: 'Next closest' },
        { name: 'Neptune', href: '/neptune.html', closest: 'Next closest' }
    ];

    var DIAMETERS = [
        { name: 'Mercury', km: 4879, earth: '0.38', color: '#9a9a9a', href: '/mercury.html' },
        { name: 'Venus', km: 12104, earth: '0.95', color: '#e6c98a', href: '/venus.html' },
        { name: 'Earth', km: 12756, earth: '1.00', color: '#4f86c6', href: '/earth.html' },
        { name: 'Mars', km: 6792, earth: '0.53', color: '#d06a3a', href: '/mars.html' },
        { name: 'Jupiter', km: 142984, earth: '11.21', color: '#e0b15a', href: '/jupiter.html' },
        { name: 'Saturn', km: 120536, earth: '9.45', color: '#ead7a8', href: '/saturn.html' },
        { name: 'Uranus', km: 51118, earth: '4.01', color: '#8fd0dc', href: '/uranus.html' },
        { name: 'Neptune', km: 49528, earth: '3.88', color: '#3d62c8', href: '/neptune.html' }
    ];

    var GLARE_DEG = 15;

    function pageKind() {
        return document.body.getAttribute('data-sky');
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }

    function anchor(href, text) {
        var a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    }

    function clear(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
    }

    function clockLine(sky, date) {
        return 'Computed in your browser for ' + sky.formatUtc(date)
            + '. Your device reads ' + sky.formatLocal(date)
            + '. If that clock is wrong, these figures are wrong by the same amount.';
    }

    function skyLabel(info) {
        if (info.sep < GLARE_DEG) return 'Lost in the Sun’s glare';
        if (info.sky === 'evening') return info.sep > 90 ? 'Evening sky, up much of the night' : 'Evening sky';
        return info.sep > 90 ? 'Morning sky, up much of the night' : 'Morning sky';
    }

    function skyDetail(info) {
        var hours = info.hours.toFixed(1).replace(/\.0$/, '');
        var place = 'The hour figure treats the sky as turning 15° per hour and ignores your latitude and the tilt of the ecliptic, so the real clock time depends on where you are.';
        if (info.sep < GLARE_DEG) {
            return 'It is only ' + info.sep.toFixed(0) + '° from the Sun, inside the ' + GLARE_DEG + '° glare limit used on this page. That is a naked-eye rule of thumb, not a computed magnitude.';
        }
        if (info.sky === 'evening' && info.sep > 90) {
            return 'It is ' + info.sep.toFixed(0) + '° east of the Sun, so it is already up by sunset and sets roughly ' + hours + ' hours later. ' + place;
        }
        if (info.sky === 'evening') {
            return 'Look toward the west after sunset. It is ' + info.sep.toFixed(0) + '° east of the Sun and sets roughly ' + hours + ' hours after the Sun. ' + place;
        }
        if (info.sep > 90) {
            return 'It is ' + info.sep.toFixed(0) + '° west of the Sun, so it rises roughly ' + hours + ' hours before sunrise and is still up at dawn. ' + place;
        }
        return 'Look toward the east before sunrise. It is ' + info.sep.toFixed(0) + '° west of the Sun and rises roughly ' + hours + ' hours earlier. ' + place;
    }

    function renderDistance(sky) {
        var clock = document.getElementById('sky-clock');
        var body = document.getElementById('distance-body');
        if (!clock || !body) return;
        var now = new Date();
        var jd = sky.julianDate(now);
        clock.textContent = clockLine(sky, now);
        clear(body);
        BODIES.forEach(function (item) {
            var move = sky.motion(item.name, jd);
            var next = sky.nextClosest(item.name, jd);
            var tr = document.createElement('tr');
            var nameCell = document.createElement('td');
            nameCell.setAttribute('data-label', 'Body');
            nameCell.appendChild(anchor(item.href, item.name));
            tr.appendChild(nameCell);

            var distCell = document.createElement('td');
            distCell.setAttribute('data-label', 'Distance from Earth');
            distCell.appendChild(el('strong', null, sky.formatKm(move.distKm, item.name)));
            distCell.appendChild(document.createElement('br'));
            distCell.appendChild(el('span', 'muted', sky.formatAU(move.distKm)));
            distCell.appendChild(document.createElement('br'));
            distCell.appendChild(el('span', 'muted', 'Nominal error ' + sky.errorPhrase(item.name)));
            tr.appendChild(distCell);

            var lightCell = el('td', null, sky.formatLight(move.lightSeconds));
            lightCell.setAttribute('data-label', 'Light-time');
            tr.appendChild(lightCell);

            var motionCell = document.createElement('td');
            motionCell.setAttribute('data-label', 'Motion');
            motionCell.appendChild(el('strong', null, move.approaching ? 'Approaching' : 'Receding'));
            motionCell.appendChild(document.createElement('br'));
            motionCell.appendChild(el('span', 'muted', sky.formatSpeed(move.kms)));
            tr.appendChild(motionCell);

            var nextCell = document.createElement('td');
            nextCell.setAttribute('data-label', 'Next closest');
            if (next) {
                nextCell.appendChild(el('strong', null, sky.formatUtc(next.date)));
                nextCell.appendChild(document.createElement('br'));
                nextCell.appendChild(el('span', 'muted', item.closest + ' · ' + sky.formatAU(next.distKm)));
            } else {
                nextCell.textContent = '—';
            }
            tr.appendChild(nextCell);
            body.appendChild(tr);
        });
    }

    function renderCard(sky, jd, name, extra) {
        var info = sky.planetElongation(name, jd);
        var card = el('article', 'vis-card');
        var head = el('div', 'vis-head');
        var body = BODIES.filter(function (item) { return item.name === name; })[0];
        head.appendChild(anchor(body ? body.href : '/', name));
        var pill = el('span', 'pill pill-' + (info.sep < GLARE_DEG ? 'glare' : info.sky), skyLabel(info));
        head.appendChild(pill);
        card.appendChild(head);
        card.appendChild(el('p', null, skyDetail(info)));
        if (extra) card.appendChild(el('p', null, extra));
        var meta = el('p', 'muted', info.sep.toFixed(0) + '° elongation from the Sun');
        card.appendChild(meta);
        return card;
    }

    function renderVisible(sky) {
        var clock = document.getElementById('sky-clock');
        var list = document.getElementById('visible-list');
        var faint = document.getElementById('faint-list');
        if (!clock || !list || !faint) return;
        var now = new Date();
        var jd = sky.julianDate(now);
        clock.textContent = clockLine(sky, now);
        clear(list);
        clear(faint);
        sky.NAKED_EYE.forEach(function (name) {
            var info = sky.planetElongation(name, jd);
            var card = renderCard(sky, jd, name, info.finding);
            list.appendChild(card);
        });
        faint.appendChild(renderCard(
            sky,
            jd,
            'Uranus',
            'Uranus is at the limit of naked-eye vision and usually needs a dark sky. This row is context, not a promise you can see it.'
        ));
        faint.appendChild(renderCard(
            sky,
            jd,
            'Neptune',
            'Neptune is too faint for the naked eye. It needs binoculars or a telescope. The elongation uses the same approximate model.'
        ));
    }

    function drawMoon(canvas, illum, waxing) {
        var css = 220;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var size = Math.round(css * dpr);
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = css + 'px';
        canvas.style.height = css + 'px';
        var ctx = canvas.getContext('2d');
        var image = ctx.createImageData(size, size);
        var data = image.data;
        var cx = (size - 1) / 2;
        var cy = (size - 1) / 2;
        var r = size * 0.39;
        var cosI = 2 * illum - 1;
        var y, x, dx, dy, s, limit, lit, disc, edge, idx, shade;
        for (y = 0; y < size; y++) {
            dy = y - cy;
            for (x = 0; x < size; x++) {
                dx = x - cx;
                disc = dx * dx + dy * dy;
                idx = (y * size + x) * 4;
                if (disc > (r + 1.2) * (r + 1.2)) continue;
                if (disc > r * r) {
                    data[idx] = 40;
                    data[idx + 1] = 34;
                    data[idx + 2] = 22;
                    data[idx + 3] = 180;
                    continue;
                }
                s = Math.sqrt(Math.max(0, r * r - dy * dy));
                limit = (waxing ? -cosI : cosI) * s;
                // A 1% crescent is only a pixel or two wide. Keep a hairline
                // visible; the percentage next to the drawing stays exact.
                if (illum > 0.004 && illum < 0.08) {
                    limit += waxing ? -2.2 : 2.2;
                }
                lit = waxing ? dx >= limit - 0.5 : dx <= limit + 0.5;
                edge = 1 - Math.max(0, (Math.sqrt(disc) - (r - 1.4)) / 1.4);
                shade = lit ? 1 : 0;
                data[idx] = shade ? 243 : 18;
                data[idx + 1] = shade ? 239 : 22;
                data[idx + 2] = shade ? 226 : 32;
                data[idx + 3] = Math.round(255 * Math.max(0, Math.min(1, edge)));
            }
        }
        ctx.putImageData(image, 0, 0);
    }

    function addFact(list, term, value) {
        list.appendChild(el('dt', null, term));
        list.appendChild(el('dd', null, value));
    }

    function renderMoon(sky) {
        var clock = document.getElementById('sky-clock');
        var nameEl = document.getElementById('moon-name');
        var facts = document.getElementById('moon-facts');
        var canvas = document.getElementById('moon-canvas');
        var caption = document.getElementById('moon-caption');
        var cal = document.getElementById('phase-body');
        if (!clock || !nameEl || !facts || !cal) return;
        var now = new Date();
        var jd = sky.julianDate(now);
        var state = sky.moonState(jd);
        var age = sky.moonAgeDays(jd);
        var move = sky.motion('Moon', jd);
        var days = Math.floor(age);
        var hours = Math.round((age - days) * 24);
        if (hours === 24) { days += 1; hours = 0; }
        var ageLabel = days + 'd ' + hours + 'h since new moon';
        if (state.elong >= 350) {
            var hoursUntil = Math.round((360 - state.elong) / 12.1908 * 24);
            ageLabel = hoursUntil <= 1 ? 'New moon within the hour' : 'New moon in about ' + hoursUntil + ' h';
        }
        clock.textContent = clockLine(sky, now);
        nameEl.textContent = state.name;
        if (canvas) drawMoon(canvas, state.illum, state.waxing);
        if (caption) {
            caption.textContent = state.name + ', ' + (state.illum * 100).toFixed(1) + '% lit. '
                + (state.waxing ? 'Waxing: the right side is lit in this northern-hemisphere drawing.' : 'Waning: the left side is lit in this northern-hemisphere drawing.');
        }
        clear(facts);
        addFact(facts, 'Illumination', (state.illum * 100).toFixed(1) + '%');
        addFact(facts, 'Age', ageLabel);
        addFact(facts, 'Distance', sky.formatKm(state.distKm, 'Moon') + ' (' + sky.formatAU(state.distKm) + ')');
        addFact(facts, 'Light-time', sky.formatLight(move.lightSeconds));
        addFact(facts, 'Motion', (move.approaching ? 'Approaching' : 'Receding') + ' at ' + sky.formatSpeed(move.kms));
        clear(cal);
        sky.upcomingPhases(jd, 4).forEach(function (event) {
            var tr = document.createElement('tr');
            tr.appendChild(el('td', null, event.name));
            tr.appendChild(el('td', null, sky.formatUtc(event.date)));
            cal.appendChild(tr);
        });
    }

    function byName(name) {
        for (var i = 0; i < DIAMETERS.length; i++) {
            if (DIAMETERS[i].name === name) return DIAMETERS[i];
        }
        return DIAMETERS[0];
    }

    function renderPair() {
        var aSel = document.getElementById('size-a');
        var bSel = document.getElementById('size-b');
        var stage = document.getElementById('pair-stage');
        var readout = document.getElementById('pair-readout');
        if (!aSel || !bSel || !stage || !readout) return;
        var a = byName(aSel.value);
        var b = byName(bSel.value);
        var maxKm = Math.max(a.km, b.km);
        clear(stage);
        [a, b].forEach(function (planet) {
            var col = el('figure', 'planet-orb');
            var px = Math.max(8, Math.round(220 * planet.km / maxKm));
            var disc = el('span', 'disc');
            disc.style.width = px + 'px';
            disc.style.height = px + 'px';
            disc.style.background = planet.color;
            col.appendChild(disc);
            var cap = el('figcaption');
            cap.appendChild(anchor(planet.href, planet.name));
            cap.appendChild(document.createElement('br'));
            cap.appendChild(document.createTextNode(planet.km.toLocaleString('en-US') + ' km'));
            col.appendChild(cap);
            stage.appendChild(col);
        });
        if (a.name === b.name) {
            readout.textContent = a.name + ' compared with itself. Pick two different planets.';
            return;
        }
        var bigger = a.km >= b.km ? a : b;
        var smaller = a.km >= b.km ? b : a;
        var ratio = bigger.km / smaller.km;
        readout.textContent = bigger.name + ' is ' + ratio.toFixed(2) + '× wider than ' + smaller.name
            + ' (equatorial diameter). The circles use that ratio and leave out rings.';
    }

    function renderSizes() {
        var aSel = document.getElementById('size-a');
        var bSel = document.getElementById('size-b');
        if (!aSel || !bSel) return;
        if (!aSel.options.length) {
            DIAMETERS.forEach(function (planet) {
                aSel.appendChild(new Option(planet.name, planet.name));
                bSel.appendChild(new Option(planet.name, planet.name));
            });
            aSel.value = 'Jupiter';
            bSel.value = 'Saturn';
        }
        renderPair();
        if (aSel.getAttribute('data-bound') === 'yes') return;
        aSel.setAttribute('data-bound', 'yes');
        aSel.addEventListener('change', renderPair);
        bSel.addEventListener('change', renderPair);
        document.querySelectorAll('[data-pair]').forEach(function (button) {
            button.addEventListener('click', function () {
                var parts = button.getAttribute('data-pair').split(',');
                aSel.value = parts[0];
                bSel.value = parts[1];
                renderPair();
            });
        });
    }

    function renderGiants(sky) {
        var slot = document.getElementById('giants-now');
        if (!slot) return;
        var now = new Date();
        var jd = sky.julianDate(now);
        clear(slot);
        slot.appendChild(document.createTextNode('From the same in-browser model, at ' + sky.formatUtc(now) + ': '));
        ['Jupiter', 'Saturn', 'Uranus', 'Neptune'].forEach(function (name, index) {
            if (index) slot.appendChild(document.createTextNode('; '));
            var move = sky.motion(name, jd);
            slot.appendChild(anchor('/' + name.toLowerCase() + '.html', name));
            slot.appendChild(document.createTextNode(' ' + sky.formatKm(move.distKm, name)));
        });
        slot.appendChild(document.createTextNode('. '));
        slot.appendChild(anchor('/distance/', 'Full distance table'));
        slot.appendChild(document.createTextNode('.'));
    }

    function tick() {
        var sky = window.SkyEphemeris;
        var kind = pageKind();
        if (kind === 'sizes') {
            renderSizes();
            return;
        }
        if (!sky) return;
        if (kind === 'distance') renderDistance(sky);
        else if (kind === 'visible') renderVisible(sky);
        else if (kind === 'moon') renderMoon(sky);
        else if (kind === 'giants') renderGiants(sky);
    }

    document.addEventListener('DOMContentLoaded', function () {
        tick();
        var kind = pageKind();
        if (kind === 'sizes' || kind === 'giants') return;
        window.setInterval(tick, 60000);
    });
})();
