(function (root) {
    // Play units: canvas pixels and seconds. G and the Sun's mass are chosen so
    // orbits fit the view. They are not the SI gravitational constant or a solar mass.
    const G = 100;
    const SUN_MASS = 20000;
    const SOFTENING = 8;
    const DT = 1 / 120;

    // Acceleration on A from B is G * M_B * r / (r^2 + ε^2)^(3/2), the
    // Plummer-softened inverse-square law. ε keeps the force finite at overlap.
    function accelerations(bodies) {
        const ax = new Array(bodies.length).fill(0);
        const ay = new Array(bodies.length).fill(0);
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const dx = bodies[j].x - bodies[i].x;
                const dy = bodies[j].y - bodies[i].y;
                const softened = dx * dx + dy * dy + SOFTENING * SOFTENING;
                const inv = 1 / Math.sqrt(softened);
                const scale = G * inv * inv * inv;
                const pullI = scale * bodies[j].m;
                const pullJ = scale * bodies[i].m;
                ax[i] += pullI * dx;
                ay[i] += pullI * dy;
                ax[j] -= pullJ * dx;
                ay[j] -= pullJ * dy;
            }
        }
        return { ax: ax, ay: ay };
    }

    // Velocity Verlet with a fixed step. Callers should pass DT.
    function step(bodies, dt) {
        const before = accelerations(bodies);
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            body.x += body.vx * dt + 0.5 * before.ax[i] * dt * dt;
            body.y += body.vy * dt + 0.5 * before.ay[i] * dt * dt;
        }
        const after = accelerations(bodies);
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            body.vx += 0.5 * (before.ax[i] + after.ax[i]) * dt;
            body.vy += 0.5 * (before.ay[i] + after.ay[i]) * dt;
        }
        return bodies;
    }

    // Speed for a circular orbit at `distance` around a fixed mass `centralMass`.
    function circularSpeed(distance, centralMass) {
        return Math.sqrt(G * (centralMass == null ? SUN_MASS : centralMass) / distance);
    }

    // Sun plus three light planets on approximate circles. Planet-planet pulls
    // and the Sun's own motion mean the paths are not exact circles.
    function createDemo() {
        const sun = { x: 0, y: 0, vx: 0, vy: 0, m: SUN_MASS };
        const specs = [
            { dist: 90, mass: 6, angle: 0.4 },
            { dist: 150, mass: 12, angle: 2.2 },
            { dist: 220, mass: 20, angle: 4.0 }
        ];
        const planets = specs.map(function (spec) {
            const speed = circularSpeed(spec.dist, SUN_MASS);
            return {
                x: Math.cos(spec.angle) * spec.dist,
                y: Math.sin(spec.angle) * spec.dist,
                vx: -Math.sin(spec.angle) * speed,
                vy: Math.cos(spec.angle) * speed,
                m: spec.mass
            };
        });
        return [sun].concat(planets);
    }

    root.GravitySandbox = Object.freeze({
        G: G,
        SUN_MASS: SUN_MASS,
        SOFTENING: SOFTENING,
        DT: DT,
        accelerations: accelerations,
        step: step,
        circularSpeed: circularSpeed,
        createDemo: createDemo
    });
}(typeof globalThis !== 'undefined' ? globalThis : this));
