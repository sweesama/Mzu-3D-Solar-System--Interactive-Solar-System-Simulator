(function (root) {
    const WALK_RADIUS = 300;
    const GRAVITY = 3.7;
    const EARTH_GRAVITY = 9.8;
    const EYE_HEIGHT = 1.68;
    const WALK_SPEED = 1.55;
    const FAST_SPEED = 2.8;
    const JUMP_SPEED = 1.8;
    const craters = [
        { x: -60, z: -55, radius: 42, depth: 11, rim: 5, peak: 4.2 },
        { x: 110, z: 60, radius: 26, depth: 5.5, rim: 2.4 },
        { x: -150, z: 60, radius: 60, depth: 14, rim: 6 },
        { x: 60, z: -170, radius: 85, depth: 17, rim: 7 },
        { x: -40, z: 150, radius: 14, depth: 3, rim: 1.2 },
        { x: 170, z: -40, radius: 20, depth: 4, rim: 1.8 },
        { x: 30, z: 35, radius: 7, depth: 1.5, rim: 0.7 },
        { x: -15, z: -28, radius: 9, depth: 1.8, rim: 0.8 },
        { x: 140, z: 130, radius: 30, depth: 6, rim: 2.6 },
        { x: 18, z: -52, radius: 6, depth: 1.2, rim: 0.5 },
        { x: -80, z: 30, radius: 5, depth: 1.0, rim: 0.4 },
        { x: 45, z: 8, radius: 4, depth: 0.9, rim: 0.4 },
        { x: -45, z: 95, radius: 7, depth: 1.4, rim: 0.6 },
        { x: 75, z: -45, radius: 5, depth: 1.0, rim: 0.5 },
        { x: 130, z: 10, radius: 6, depth: 1.1, rim: 0.5 },
        { x: -110, z: -30, radius: 8, depth: 1.6, rim: 0.7 },
        { x: 12, z: 110, radius: 5, depth: 0.9, rim: 0.4 }
    ];
    const scarpA = { x: -40, z: -150 };
    const scarpB = { x: 160, z: -10 };
    const hollows = [
        { x: 92, z: 96, radius: 11, depth: 1.3 },
        { x: 83, z: 89, radius: 8, depth: 0.9 },
        { x: 101, z: 104, radius: 9, depth: 1.1 },
        { x: 79, z: 106, radius: 7, depth: 0.8 },
        { x: 99, z: 84, radius: 6, depth: 0.7 }
    ];
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
    function scarpDistance(x, z) {
        const dx = scarpB.x - scarpA.x, dz = scarpB.z - scarpA.z;
        const t = Math.max(0, Math.min(1, ((x - scarpA.x) * dx + (z - scarpA.z) * dz) / (dx * dx + dz * dz)));
        return Math.hypot(x - (scarpA.x + dx * t), z - (scarpA.z + dz * t));
    }
    function height(x, z) {
        let h = (noise(x * 0.008 + 7, z * 0.008 + 12) - 0.5) * 13;
        h += (noise(x * 0.034, z * 0.034) - 0.5) * 2.6;
        h += (noise(x * 0.13, z * 0.13) - 0.5) * 0.6;
        h += (noise(x * 0.45, z * 0.45) - 0.5) * 0.15;
        for (const crater of craters) {
            const dx = x - crater.x, dz = z - crater.z;
            const distance = Math.hypot(dx, dz) / crater.radius;
            if (distance > 1.9) continue;
            const angle = Math.atan2(dz, dx);
            const irregularity = 1 + 0.025 * Math.sin(angle * 7) + 0.018 * Math.cos(angle * 11);
            const r = distance * irregularity;
            const bowl = r < 1 ? -crater.depth * Math.pow(1 - r * r, 1.5) : 0;
            const rim = crater.rim * Math.exp(-Math.pow((r - 1) / 0.14, 2));
            const peak = crater.peak ? crater.peak * Math.exp(-Math.pow(distance * crater.radius / 9, 2)) : 0;
            h += bowl + rim + peak;
        }
        const scarpD = scarpDistance(x, z) + (noise(x * 0.015 + 5, z * 0.015 - 9) - 0.5) * 18;
        h += 7.5 * Math.exp(-Math.pow(scarpD / 13, 2)) * (0.75 + 0.5 * noise(x * 0.02, z * 0.02));
        for (const hollow of hollows) {
            const d = Math.hypot(x - hollow.x, z - hollow.z) / hollow.radius;
            if (d < 1.6) h -= hollow.depth * Math.exp(-d * d * 1.8) * (0.7 + 0.6 * noise(x * 0.3, z * 0.3));
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
    root.MercuryTerrain = Object.freeze({ WALK_RADIUS, GRAVITY, EARTH_GRAVITY, EYE_HEIGHT, WALK_SPEED, FAST_SPEED, JUMP_SPEED, craters, hollows, scarpDistance, random, noise, height, createSurface, sampleSurface, move, createWalker, updateWalker });
}(typeof globalThis !== 'undefined' ? globalThis : this));
