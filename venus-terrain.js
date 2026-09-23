(function (root) {
    const WALK_RADIUS = 300;
    const GRAVITY = 8.87;
    const EARTH_GRAVITY = 9.8;
    const EYE_HEIGHT = 1.68;
    const WALK_SPEED = 1.55;
    const FAST_SPEED = 2.8;
    const JUMP_SPEED = 2.6;
    const DOME = { x: -120, z: -95, radius: 44, height: 7 };
    const TESSERA = { x: 190, z: 150, radius: 95, amplitude: 2.6, angle: 0.6 };
    const CHANNEL = { points: [[-15, -165], [35, -125], [95, -98], [160, -58]], width: 8, depth: 2.4 };
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
    function smoothstep(edge0, edge1, value) {
        const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
    }
    function channelDistance(x, z) {
        let best = Infinity;
        const points = CHANNEL.points;
        for (let i = 0; i < points.length - 1; i++) {
            const [ax, az] = points[i], [bx, bz] = points[i + 1];
            const dx = bx - ax, dz = bz - az;
            const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
            best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
        }
        return best;
    }
    function height(x, z) {
        let h = (noise(x * 0.005 + 3, z * 0.005 + 9) - 0.5) * 9;
        h += (noise(x * 0.028 + 1, z * 0.028 + 2) - 0.5) * 1.6;
        h += (noise(x * 0.1 + 7, z * 0.1 + 4) - 0.5) * 0.45;
        h += (noise(x * 0.38 + 11, z * 0.38 + 6) - 0.5) * 0.12;
        h += (Math.floor(noise(x * 0.05 + 40, z * 0.05 + 9) * 5) / 5 - 0.4) * 0.5;
        const channelOffset = channelDistance(x, z);
        if (channelOffset < CHANNEL.width * 2.4) {
            const inside = channelOffset / CHANNEL.width;
            h -= CHANNEL.depth * Math.max(0, 1 - inside * inside);
            h += smoothstep(CHANNEL.width * 2.4, CHANNEL.width * 1.2, channelOffset) * 0.55;
        }
        const domeDistance = Math.hypot(x - DOME.x, z - DOME.z) / DOME.radius;
        if (domeDistance < 1.5) {
            const cap = smoothstep(1.2, 0.82, domeDistance);
            h += DOME.height * cap + (noise(x * 0.16 + 5, z * 0.16 + 3) - 0.5) * 1.2 * cap;
        }
        const tesseraDistance = Math.hypot(x - TESSERA.x, z - TESSERA.z) / TESSERA.radius;
        if (tesseraDistance < 1.2) {
            const mask = smoothstep(1.2, 0.72, tesseraDistance);
            const u = x * Math.cos(TESSERA.angle) + z * Math.sin(TESSERA.angle);
            const v = -x * Math.sin(TESSERA.angle) + z * Math.cos(TESSERA.angle);
            const ridges = Math.abs(Math.sin(u * 0.5 + noise(x * 0.015 + 9, z * 0.015) * 2.4));
            const cross = Math.abs(Math.sin(v * 0.23 + noise(x * 0.02 - 4, z * 0.02 + 8) * 1.6));
            h += (ridges * 1.15 + cross * 0.5 - 0.55) * TESSERA.amplitude * mask;
        }
        return h;
    }
    function createSurface(size, segments) {
        const heights = new Float32Array((segments + 1) ** 2);
        for (let z = 0; z <= segments; z++) {
            for (let x = 0; x <= segments; x++) {
                heights[z * (segments + 1) + x] = height(x / segments * size - size / 2, z / segments * size - size / 2);
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
        let x = position.x, z = position.z;
        const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.3));
        function allowed(nx, nz) {
            if (Math.hypot(nx, nz) > WALK_RADIUS) return false;
            if (obstacles.some(rock => Math.hypot(nx - rock.x, nz - rock.z) < rock.radius + 0.4)) return false;
            const ground = sampleSurface(surface, nx, nz);
            if (body && !body.grounded) return ground <= body.y + 0.015;
            const distance = Math.hypot(nx - x, nz - z);
            const rise = ground - sampleSurface(surface, x, z);
            return (body ? rise : Math.abs(rise)) <= distance * 0.85 + 0.001;
        }
        for (let i = 0; i < steps; i++) {
            const sx = dx / steps, sz = dz / steps;
            if (allowed(x + sx, z + sz)) { x += sx; z += sz; }
            else {
                if (allowed(x + sx, z)) x += sx;
                if (allowed(x, z + sz)) z += sz;
            }
        }
        return { x, z };
    }
    function createWalker(surface, position) {
        return { x: position.x, z: position.z, y: sampleSurface(surface, position.x, position.z), vx: 0, vz: 0, vy: 0, grounded: true, stride: 0, bob: 0, landing: 0, speed: 0 };
    }
    function updateWalker(surface, body, input, dt, obstacles, gravity) {
        if (!(dt > 0) || !Number.isFinite(dt)) return body;
        const g = gravity > 0 ? gravity : GRAVITY;
        if (input.jump && body.grounded) { body.vy = JUMP_SPEED; body.grounded = false; }
        const steps = Math.ceil(dt / (1 / 120));
        const step = dt / steps;
        const forward = input.forward || 0, right = input.right || 0, yaw = input.yaw || 0;
        const magnitude = Math.hypot(forward, right);
        const speed = (input.fast ? FAST_SPEED : WALK_SPEED) / Math.max(1, magnitude);
        const targetX = (-Math.sin(yaw) * forward + Math.cos(yaw) * right) * speed;
        const targetZ = (-Math.cos(yaw) * forward - Math.sin(yaw) * right) * speed;
        for (let i = 0; i < steps; i++) {
            if (body.grounded) {
                const dx = targetX - body.vx, dz = targetZ - body.vz;
                const difference = Math.hypot(dx, dz);
                const acceleration = magnitude ? 3.2 : 5;
                const blend = difference ? Math.min(1, acceleration * step / difference) : 1;
                body.vx += dx * blend; body.vz += dz * blend;
            }
            const dx = body.vx * step, dz = body.vz * step;
            const next = move(surface, body, dx, dz, obstacles, body);
            const travel = Math.hypot(next.x - body.x, next.z - body.z);
            if (Math.abs(next.x - body.x - dx) > 0.00001) body.vx = 0;
            if (Math.abs(next.z - body.z - dz) > 0.00001) body.vz = 0;
            body.x = next.x; body.z = next.z;
            const ground = sampleSurface(surface, body.x, body.z);
            if (body.grounded) {
                if (body.y - ground <= Math.max(0.015, travel * 0.9)) body.y = ground;
                else { body.grounded = false; body.vy = 0; }
            }
            if (!body.grounded) {
                body.y += body.vy * step - 0.5 * g * step * step;
                body.vy -= g * step;
                if (body.y <= ground) {
                    body.y = ground;
                    body.landing = Math.min(0.07, Math.max(0, -body.vy) * 0.024);
                    body.vy = 0;
                    body.grounded = true;
                }
            }
            body.speed = travel / step;
            if (body.grounded) body.stride += travel * Math.PI * 2 / 2.1;
            const targetBob = body.grounded ? (Math.cos(body.stride * 2) - 1) * 0.018 * Math.min(1, body.speed / WALK_SPEED) : 0;
            body.bob += (targetBob - body.bob) * (1 - Math.exp(-14 * step));
            body.landing *= Math.exp(-9 * step);
        }
        return body;
    }
    root.VenusTerrain = Object.freeze({ WALK_RADIUS, GRAVITY, EARTH_GRAVITY, EYE_HEIGHT, WALK_SPEED, FAST_SPEED, JUMP_SPEED, DOME, TESSERA, CHANNEL, random, noise, height, createSurface, sampleSurface, move, createWalker, updateWalker });
    if (typeof module !== 'undefined' && module.exports) module.exports = root.VenusTerrain;
}(typeof globalThis !== 'undefined' ? globalThis : this));
