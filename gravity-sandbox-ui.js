(function () {
    if (typeof document === 'undefined') return;

    const canvas = document.getElementById('sandbox');
    const pauseButton = document.getElementById('sandbox-pause');
    const resetButton = document.getElementById('sandbox-reset');
    const trailsButton = document.getElementById('sandbox-trails');
    const status = document.getElementById('sandbox-status');
    if (!canvas || !pauseButton || !resetButton || !trailsButton || !status || !window.GravitySandbox) return;

    const sandbox = window.GravitySandbox;
    const VIEW_RADIUS = 300;
    const MAX_PLANETS = 40;
    const MIN_SUN_DISTANCE = 36;
    const TRAIL_LIMIT = 90;
    const PALETTE = ['#d7d2c8', '#7eb6ff', '#e07a4c', '#e6d15a', '#9d7cff', '#5dcec4', '#f0a3c2'];
    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 70 }, function (_, i) {
        return {
            x: ((i * 97) % 1000) / 1000,
            y: ((i * 57 + 13) % 1000) / 1000,
            a: 0.18 + (i % 5) * 0.08
        };
    });

    let bodies = [];
    let running = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let trailsOn = true;
    let colorIndex = 0;
    let accumulator = 0;
    let trailTick = 0;
    let drag = null;
    let lastTime = 0;

    function decorate(raw) {
        return raw.map(function (body, index) {
            const sun = index === 0;
            return {
                x: body.x,
                y: body.y,
                vx: body.vx,
                vy: body.vy,
                m: body.m,
                sun: sun,
                color: sun ? '#ffca4b' : PALETTE[(index - 1) % PALETTE.length],
                radius: sun ? 18 : 4.5 + Math.sqrt(body.m),
                trail: []
            };
        });
    }

    function reset() {
        bodies = decorate(sandbox.createDemo());
        colorIndex = bodies.length - 1;
        accumulator = 0;
        drag = null;
        setStatus(running
            ? 'Drag on the canvas to launch a planet. The arrow is how far it moves in one second.'
            : 'Motion is paused. Press Play, or drag on the canvas to place a planet.');
    }

    function setStatus(text) {
        status.textContent = text;
    }

    function planetCount() {
        return bodies.reduce(function (count, body) { return count + (body.sun ? 0 : 1); }, 0);
    }

    function sunBody() {
        return bodies[0];
    }

    function viewScale(width, height) {
        const span = Math.min(width, height);
        if (span <= 0) return 1;
        return span / 2 / VIEW_RADIUS;
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function eventToWorld(event) {
        const rect = canvas.getBoundingClientRect();
        const scale = viewScale(rect.width, rect.height);
        const sun = sunBody();
        return {
            x: (event.clientX - rect.left - rect.width / 2) / scale + sun.x,
            y: (event.clientY - rect.top - rect.height / 2) / scale + sun.y
        };
    }

    function recordTrails() {
        if (!trailsOn) return;
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (body.sun) continue;
            const trail = body.trail;
            const last = trail[trail.length - 1];
            if (last && (last.x - body.x) * (last.x - body.x) + (last.y - body.y) * (last.y - body.y) < 0.25) continue;
            trail.push({ x: body.x, y: body.y });
            if (trail.length > TRAIL_LIMIT) trail.shift();
        }
    }

    function draw() {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#070b14';
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            ctx.fillStyle = 'rgba(255,255,255,' + star.a + ')';
            ctx.fillRect(star.x * width, star.y * height, 1.4, 1.4);
        }

        const sun = sunBody();
        const scale = viewScale(width, height);
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-sun.x, -sun.y);

        if (trailsOn) {
            for (let i = 0; i < bodies.length; i++) {
                const trail = bodies[i].trail;
                if (!trail || trail.length < 2) continue;
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let p = 1; p < trail.length; p++) ctx.lineTo(trail[p].x, trail[p].y);
                ctx.strokeStyle = bodies[i].color;
                ctx.globalAlpha = 0.45;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        if (drag) {
            ctx.beginPath();
            ctx.moveTo(drag.x, drag.y);
            ctx.lineTo(drag.px, drag.py);
            ctx.strokeStyle = '#ffe08a';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(drag.x, drag.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 224, 138, 0.85)';
            ctx.fill();
        }

        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            ctx.beginPath();
            ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
            ctx.fillStyle = body.color;
            ctx.fill();
            if (body.sun) {
                ctx.lineWidth = 6;
                ctx.strokeStyle = 'rgba(255, 202, 75, 0.28)';
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    function launch(origin, release) {
        const sun = sunBody();
        const dx = origin.x - sun.x;
        const dy = origin.y - sun.y;
        if (Math.hypot(dx, dy) < MIN_SUN_DISTANCE) {
            setStatus('That spot is too close to the Sun. Drag farther out.');
            return;
        }
        if (planetCount() >= MAX_PLANETS) {
            setStatus('This sandbox holds ' + MAX_PLANETS + ' planets. Reset to clear them.');
            return;
        }
        const vx = release.x - origin.x;
        const vy = release.y - origin.y;
        bodies.push({
            x: origin.x,
            y: origin.y,
            vx: vx,
            vy: vy,
            m: 8,
            sun: false,
            color: PALETTE[colorIndex % PALETTE.length],
            radius: 4.5 + Math.sqrt(8),
            trail: []
        });
        colorIndex += 1;
        const speed = Math.hypot(vx, vy);
        setStatus('Planet launched at ' + Math.round(speed) + ' pixels per second. ' + planetCount() + ' planets.');
    }

    canvas.addEventListener('pointerdown', function (event) {
        if (event.button != null && event.button !== 0) return;
        canvas.setPointerCapture(event.pointerId);
        const point = eventToWorld(event);
        drag = { id: event.pointerId, x: point.x, y: point.y, px: point.x, py: point.y };
    });
    canvas.addEventListener('pointermove', function (event) {
        if (!drag || drag.id !== event.pointerId) return;
        const point = eventToWorld(event);
        drag.px = point.x;
        drag.py = point.y;
    });
    function endDrag(event) {
        if (!drag || drag.id !== event.pointerId) return;
        const origin = { x: drag.x, y: drag.y };
        const release = { x: drag.px, y: drag.py };
        drag = null;
        launch(origin, release);
    }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', function (event) {
        if (drag && drag.id === event.pointerId) drag = null;
    });

    function updatePauseButton() {
        pauseButton.textContent = running ? 'Pause' : 'Play';
        pauseButton.setAttribute('aria-pressed', running ? 'false' : 'true');
    }

    pauseButton.addEventListener('click', function () {
        running = !running;
        updatePauseButton();
        setStatus(running ? 'Running.' : 'Paused. Drag still adds a planet.');
    });
    resetButton.addEventListener('click', reset);
    trailsButton.addEventListener('click', function () {
        trailsOn = !trailsOn;
        trailsButton.textContent = trailsOn ? 'Trails: on' : 'Trails: off';
        trailsButton.setAttribute('aria-pressed', trailsOn ? 'true' : 'false');
        if (!trailsOn) bodies.forEach(function (body) { body.trail = []; });
    });

    function frame(now) {
        if (!lastTime) lastTime = now;
        const elapsed = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        if (running) {
            accumulator += elapsed;
            let steps = 0;
            while (accumulator >= sandbox.DT && steps < 8) {
                sandbox.step(bodies, sandbox.DT);
                accumulator -= sandbox.DT;
                steps += 1;
            }
            trailTick += 1;
            if (trailTick % 2 === 0) recordTrails();
        }
        resize();
        draw();
        window.requestAnimationFrame(frame);
    }

    updatePauseButton();
    trailsButton.setAttribute('aria-pressed', 'true');
    reset();
    window.addEventListener('resize', resize);
    window.requestAnimationFrame(frame);
}());
