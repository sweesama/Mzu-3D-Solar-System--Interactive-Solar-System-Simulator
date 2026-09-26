(function (root) {
    // Ring-plane flight through Uranus's narrow dark rings — the sideways system.
    // Same free-flight model as the Saturn cruise; the sheet lives at y = 0.
    const DRIFT_RADIUS = 520;
    const CRUISE_SPEED = 3.0;
    const DRIFT_SPEED = 4.2;
    const FAST_SPEED = 8.0;
    const VERTICAL_SPEED = 2.6;
    const MIN_ALTITUDE = -140;
    const MAX_ALTITUDE = 300;
    const RING_PLANE_Y = 0;
    const GRAVITY = 8.87;              // Uranus surface gravity, display only
    const EARTH_GRAVITY = 9.8;

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

    // Uranus's rings are narrow, charcoal-dark CONCENTRIC ARCS centred on the
    // planet — nothing like Saturn's broad bright sheet. The flight sheet shares
    // the planet's equatorial plane, so band density is radial: each band is a
    // ring of radius r around (RING_CX, RING_CZ), not a straight stripe.
    const RING_CX = -2000, RING_CZ = -2100;   // matches the globe position in uranus.js
    function ringDensity(x, z) {
        const dist = Math.hypot(x - RING_CX, z - RING_CZ);
        const bands = [
            { r: 2400, w: 55, d: 0.10 },  // ζ — diffuse inner haze
            { r: 2470, w: 14, d: 0.30 },  // inner narrow rings merged
            { r: 2540, w: 16, d: 0.42 },  // α
            { r: 2600, w: 12, d: 0.38 },  // η
            { r: 2670, w: 30, d: 0.62 },  // ε — the brightest band; station 02 sits inside
            { r: 2780, w: 14, d: 0.34 },  // δ
            { r: 2960, w: 18, d: 0.40 },  // shepherd-moonlet band
            { r: 3100, w: 14, d: 0.32 },  // outer thread
        ];
        for (const b of bands) {
            const t = Math.abs(dist - b.r) / b.w;
            if (t < 1) {
                const edge = Math.min(1, (1 - t) * 4);
                return b.d * edge * (0.7 + noise(x * 0.03, z * 0.06) * 0.6);
            }
        }
        return 0.015; // between the rings — nearly empty charcoal dust
    }

    function createWalker(position) {
        return { x: position.x, z: position.z, y: position.y !== undefined ? position.y : 90, vx: 0, vz: 0, vy: 0, grounded: true, thrusting: false, stride: 0, bob: 0, landing: 0, speed: 0, cruise: 0 };
    }
    function sampleSurface() { return 0; }
    function move(position, dx, dz) {
        let x = position.x + dx, z = position.z + dz;
        const r = Math.hypot(x, z);
        if (r > DRIFT_RADIUS) { const k = DRIFT_RADIUS / r; x *= k; z *= k; }
        return { x, z };
    }
    function updateWalker(body, input, dt) {
        if (!(dt > 0) || !Number.isFinite(dt)) return body;
        const steps = Math.ceil(dt / (1 / 120));
        const step = dt / steps;
        const forward = input.forward || 0, right = input.right || 0, yaw = input.yaw || 0;
        const magnitude = Math.hypot(forward, right);
        const speed = (input.fast ? FAST_SPEED : DRIFT_SPEED) / Math.max(1, magnitude);
        const cruise = CRUISE_SPEED + forward * speed;
        const targetX = (-Math.sin(yaw) * cruise + Math.cos(yaw) * right * speed);
        const targetZ = (-Math.cos(yaw) * cruise - Math.sin(yaw) * right * speed);
        const targetVy = (input.jump ? VERTICAL_SPEED : 0) + (input.down ? -VERTICAL_SPEED : 0);
        for (let i = 0; i < steps; i++) {
            const dx = targetX - body.vx, dz = targetZ - body.vz;
            const difference = Math.hypot(dx, dz);
            const blend = difference ? Math.min(1, 1.5 * step / difference) : 1;
            body.vx += dx * blend; body.vz += dz * blend;
            body.vy += (targetVy - body.vy) * Math.min(1, 2.2 * step);
            body.thrusting = !!input.jump;
            const next = move(body, body.vx * step, body.vz * step);
            body.x = next.x; body.z = next.z;
            body.y += body.vy * step;
            if (body.y > MAX_ALTITUDE) { body.y = MAX_ALTITUDE; body.vy = Math.min(0, body.vy); }
            if (body.y < MIN_ALTITUDE) { body.y = MIN_ALTITUDE; body.vy = Math.max(0, body.vy); }
            body.speed = Math.hypot(body.vx, body.vz);
            body.cruise += (CRUISE_SPEED - body.cruise) * Math.min(1, step);
            body.stride += Math.hypot(body.vx * step, body.vz * step) * Math.PI * 2 / 2.1;
            const targetBob = (Math.cos(body.stride * 2) - 1) * 0.01 * Math.min(1, body.speed / DRIFT_SPEED);
            body.bob += (targetBob - body.bob) * (1 - Math.exp(-12 * step));
            body.landing *= Math.exp(-9 * step);
        }
        return body;
    }
    root.UranusRings = Object.freeze({ DRIFT_RADIUS, GRAVITY, EARTH_GRAVITY, CRUISE_SPEED, DRIFT_SPEED, FAST_SPEED, VERTICAL_SPEED, MIN_ALTITUDE, MAX_ALTITUDE, RING_PLANE_Y, RING_CX, RING_CZ, random, noise, ringDensity, sampleSurface, createWalker, updateWalker });
}(typeof globalThis !== 'undefined' ? globalThis : this));
