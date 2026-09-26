(function (root) {
    // Free flight inside Neptune's storm layer — no ground, no falling.
    // Same cruise model as the ring flights; the cirrus deck lives at y = 0 and
    // the Great Dark Spot vortex turns around (VORTEX_X, VORTEX_Z).
    const DRIFT_RADIUS = 520;
    const CRUISE_SPEED = 3.0;
    const DRIFT_SPEED = 4.2;
    const FAST_SPEED = 8.0;
    const VERTICAL_SPEED = 2.6;
    const MIN_ALTITUDE = -140;
    const MAX_ALTITUDE = 300;
    const DECK_Y = 0;                 // cirrus deck altitude
    const GRAVITY = 11.15;            // Neptune surface gravity, display only
    const EARTH_GRAVITY = 9.8;
    const VORTEX_X = -1400, VORTEX_Z = -2600; // the Great Dark Spot
    const VORTEX_R = 420;                     // dark-spot radius on the deck

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
        n = (n ^ (n >>> 13)) * 1274126177;
        return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
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

    // Cirrus density: thin streak bands spiralling around the dark-spot vortex.
    // Returns roughly 0-1 — used by the deck texture, particle placement and
    // the wind-hiss gain. The vortex itself is nearly empty (the eye).
    function stormDensity(x, z) {
        const dx = x - VORTEX_X, dz = z - VORTEX_Z;
        const dist = Math.hypot(dx, dz);
        if (dist < VORTEX_R * 0.65) return 0.02;          // inside the dark eye
        // Spiral arms: density follows the winding angle, like cloud bands
        // wrapping the storm.
        const ang = Math.atan2(dz, dx);
        const arm = Math.sin(ang * 3 + dist * 0.006);
        const band = Math.max(0, arm) * Math.max(0, 1 - Math.abs(dist - 700) / 900);
        return 0.08 + band * 0.5 + noise(x * 0.01, z * 0.01) * 0.15;
    }

    function createWalker(position) {
        return { x: position.x, z: position.z, y: position.y !== undefined ? position.y : 90, vx: 0, vz: 0, vy: 0, grounded: true, thrusting: false, stride: 0, bob: 0, landing: 0, speed: 0, cruise: 0 };
    }
    // Discovery pins ride the cirrus deck — the "surface" is simply y = 0.
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
    root.NeptuneStorm = Object.freeze({ DRIFT_RADIUS, GRAVITY, EARTH_GRAVITY, CRUISE_SPEED, DRIFT_SPEED, FAST_SPEED, VERTICAL_SPEED, MIN_ALTITUDE, MAX_ALTITUDE, RING_PLANE_Y: DECK_Y, VORTEX_X, VORTEX_Z, VORTEX_R, random, noise, stormDensity, sampleSurface, createWalker, updateWalker });
}(typeof globalThis !== 'undefined' ? globalThis : this));
