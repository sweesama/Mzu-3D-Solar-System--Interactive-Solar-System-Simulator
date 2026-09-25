(function (root) {
    // Ring-plane flight: a probe cruising through Saturn's rings.
    // No descent — gentle auto-cruise forward, WASD lateral drift, Space/Shift for up/down.
    const DRIFT_RADIUS = 520;          // lateral roam limit around the ring lane
    const CRUISE_SPEED = 3.0;          // effortless forward cruise
    const DRIFT_SPEED = 4.2;           // WASD lateral speed
    const FAST_SPEED = 8.0;            // Shift boost
    const VERTICAL_SPEED = 2.6;        // Space up / Shift+Ctrl-style down
    const MIN_ALTITUDE = -140;         // below the ring plane it gets dark and sparse
    const MAX_ALTITUDE = 300;          // climbing high shows the whole sheet
    const RING_PLANE_Y = 0;            // the ring sheet lives at y = 0
    const GRAVITY = 10.44;             // Saturn surface gravity, display only
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

    // Ring optical depth by "radius" — drives both the sheet texture and how dense the
    // ice-chunk field feels at a given x/z. Written as bands across z for readability.
    function ringDensity(x, z) {
        // Bands along z: C ring (dim inner), Cassini division (gap), B ring (bright), Encke gap, A ring.
        const bands = [
            { z0: -560, z1: -340, d: 0.55 },   // A ring outer
            { z0: -300, z1: -260, d: 0.05 },   // Encke-like gap
            { z0: -260, z1: -40,  d: 0.85 },   // A/B bright run
            { z0: -40,  z1: 60,   d: 0.08 },   // Cassini division
            { z0: 60,   z1: 340,  d: 0.9 },    // B ring — the bright one
            { z0: 340,  z1: 560,  d: 0.35 },   // C ring, dimmer
        ];
        for (const b of bands) {
            if (z >= b.z0 && z < b.z1) {
                const t = (z - b.z0) / (b.z1 - b.z0);
                const edge = Math.min(1, Math.min(t, 1 - t) * 8); // soft band edges
                return b.d * edge * (0.75 + noise(x * 0.02, z * 0.05) * 0.5);
            }
        }
        return 0.03; // outside the sheet — near empty
    }

    function createWalker(position) {
        return { x: position.x, z: position.z, y: position.y !== undefined ? position.y : 90, vx: 0, vz: 0, vy: 0, grounded: true, thrusting: false, stride: 0, bob: 0, landing: 0, speed: 0, cruise: 0 };
    }
    // Discovery pins sit on the ring sheet — the "surface" is simply the plane y = 0.
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
        // Cruise: the probe drifts along +x on its own; W adds speed along facing, S brakes.
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
    root.SaturnRings = Object.freeze({ DRIFT_RADIUS, GRAVITY, EARTH_GRAVITY, CRUISE_SPEED, DRIFT_SPEED, FAST_SPEED, VERTICAL_SPEED, MIN_ALTITUDE, MAX_ALTITUDE, RING_PLANE_Y, random, noise, ringDensity, sampleSurface, createWalker, updateWalker });
}(typeof globalThis !== 'undefined' ? globalThis : this));
