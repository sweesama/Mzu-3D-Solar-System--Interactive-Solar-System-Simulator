(function (root) {
    const DRIFT_RADIUS = 380;
    const GRAVITY = 24.79;
    const EARTH_GRAVITY = 9.8;
    const EYE_HEIGHT = 0;
    const DRIFT_SPEED = 3.4;
    const FAST_SPEED = 6.5;
    const SINK_SPEED = 2.6;
    const THRUST_SPEED = 2.1;
    const MIN_ALTITUDE = -360;
    const MAX_ALTITUDE = 420;
    // The visible cloud-deck altitude field: rolling ammonia tops plus the great storm vortex.
    const storm = { x: -230, z: -150, radius: 150, depth: 26, rim: 14 };
    function random(seed) {
        return function () {
            seed |= 0;
            seed = seed + 0x6D2B79F5 | 0;
            let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    function hash(x, z) {
        let n = Math.imul(x, 374761393) + Math.imul(z, 668265263) | 0;
        n = Math.imul(n ^ n >>> 13, 1274126177);
        return ((n ^ n >>> 16) >>> 0) / 4294967295;
    }
    function noise(x, z) {
        const ix = Math.floor(x), iz = Math.floor(z);
        let fx = x - ix, fz = z - iz;
        fx = fx * fx * (3 - 2 * fx);
        fz = fz * fz * (3 - 2 * fz);
        const a = hash(ix, iz), b = hash(ix + 1, iz);
        const c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
        return (a + (b - a) * fx) * (1 - fz) + (c + (d - c) * fx) * fz;
    }
    function stormDistance(x, z) {
        return Math.hypot(x - storm.x, z - storm.z) / storm.radius;
    }
    function deckHeight(x, z) {
        let h = (noise(x * 0.008 + 3, z * 0.008 - 8) - 0.5) * 9;
        h += (noise(x * 0.032 - 5, z * 0.032 + 11) - 0.5) * 4;
        h += (noise(x * 0.11, z * 0.11) - 0.5) * 3;
        const s = stormDistance(x, z);
        if (s < 2.6) {
            const bowl = s < 1 ? -storm.depth * Math.pow(1 - s * s, 1.4) : 0;
            const rim = storm.rim * Math.exp(-Math.pow((s - 1) / 0.22, 2));
            h += bowl + rim;
        }
        return h;
    }
    function createSurface(size, segments) {
        const heights = new Float32Array((segments + 1) ** 2);
        for (let z = 0; z <= segments; z++) {
            for (let x = 0; x <= segments; x++) {
                heights[z * (segments + 1) + x] = deckHeight(x / segments * size - size / 2, z / segments * size - size / 2);
            }
        }
        return { size, segments, heights };
    }
    function sampleSurface(surface, x, z) {
        const { size, segments, heights } = surface;
        const gx = Math.max(0, Math.min(segments - 0.000001, (x / size + 0.5) * segments));
        const gz = Math.max(0, Math.min(segments - 0.000001, (z / size + 0.5) * segments));
        const ix = Math.floor(gx), iz = Math.floor(gz), fx = gx - ix, fz = gz - iz;
        const a = iz * (segments + 1) + ix;
        const h00 = heights[a], h10 = heights[a + 1], h01 = heights[a + segments + 1], h11 = heights[a + segments + 2];
        return fx + fz <= 1
            ? h00 + (h10 - h00) * fx + (h01 - h00) * fz
            : h11 + (h01 - h11) * (1 - fx) + (h10 - h11) * (1 - fz);
    }
    function move(surface, position, dx, dz, obstacles, body = null) {
        // Inside an atmosphere there are no walls — only the drift boundary matters.
        let x = position.x + dx, z = position.z + dz;
        const r = Math.hypot(x, z);
        if (r > DRIFT_RADIUS) { const k = DRIFT_RADIUS / r; x *= k; z *= k; }
        return { x, z };
    }
    function createWalker(surface, position) {
        return { x: position.x, z: position.z, y: position.y !== undefined ? position.y : 260, vx: 0, vz: 0, vy: 0, grounded: true, thrusting: false, stride: 0, bob: 0, landing: 0, speed: 0 };
    }
    function updateWalker(surface, body, input, dt, obstacles, gravity) {
        if (!(dt > 0) || !Number.isFinite(dt)) return body;
        const g = gravity > 0 ? gravity : GRAVITY;
        const steps = Math.ceil(dt / (1 / 120));
        const step = dt / steps;
        const forward = input.forward || 0, right = input.right || 0, yaw = input.yaw || 0;
        const magnitude = Math.hypot(forward, right);
        const speed = (input.fast ? FAST_SPEED : DRIFT_SPEED) / Math.max(1, magnitude);
        const targetX = (-Math.sin(yaw) * forward + Math.cos(yaw) * right) * speed;
        const targetZ = (-Math.cos(yaw) * forward - Math.sin(yaw) * right) * speed;
        for (let i = 0; i < steps; i++) {
            const dx = targetX - body.vx, dz = targetZ - body.vz;
            const difference = Math.hypot(dx, dz);
            const blend = difference ? Math.min(1, 1.6 * step / difference) : 1;
            body.vx += dx * blend; body.vz += dz * blend;
            // Terminal-velocity descent: the probe eases toward its sink rate; Space fires the ascent thruster.
            // The gravity compare button scales the sink rate with g so Earth's gentler pull can be felt.
            const sink = SINK_SPEED * (g / GRAVITY);
            const targetVy = input.jump ? THRUST_SPEED : -sink;
            body.vy += (targetVy - body.vy) * Math.min(1, 1.9 * step);
            body.thrusting = !!input.jump;
            const next = move(surface, body, body.vx * step, body.vz * step, obstacles, body);
            body.x = next.x; body.z = next.z;
            body.y += body.vy * step;
            if (body.y > MAX_ALTITUDE) { body.y = MAX_ALTITUDE; body.vy = Math.min(0, body.vy); }
            if (body.y < MIN_ALTITUDE) { body.y = MIN_ALTITUDE; body.vy = Math.max(0, body.vy); }
            body.speed = Math.hypot(body.vx, body.vz);
            body.stride += Math.hypot(body.vx * step, body.vz * step) * Math.PI * 2 / 2.1;
            const targetBob = (Math.cos(body.stride * 2) - 1) * 0.014 * Math.min(1, body.speed / DRIFT_SPEED);
            body.bob += (targetBob - body.bob) * (1 - Math.exp(-14 * step));
            body.landing *= Math.exp(-9 * step);
        }
        return body;
    }
    root.JupiterAtmo = Object.freeze({ DRIFT_RADIUS, WALK_RADIUS: DRIFT_RADIUS, GRAVITY, EARTH_GRAVITY, EYE_HEIGHT, WALK_SPEED: DRIFT_SPEED, FAST_SPEED, SINK_SPEED, THRUST_SPEED, MIN_ALTITUDE, MAX_ALTITUDE, storm, stormDistance, random, noise, height: deckHeight, deckHeight, createSurface, sampleSurface, move, createWalker, updateWalker });
}(typeof globalThis !== 'undefined' ? globalThis : this));
