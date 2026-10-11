(function (root) {
    'use strict';
    // Shared dust bursts for the surface expeditions (Moon, Mars, Venus, Mercury).
    // Each footstep or landing spawns a small puff of particles that arcs under the
    // page's own gravity, lands on the page's own terrain, fades out, and is removed.
    // Pages differ only in colour, opacity, gravity, terrain sampling and wind drift,
    // so each page passes those in instead of carrying its own copy of this logic.
    //
    // Every option that refers to a page variable is a function, because those variables
    // are assigned later during initialisation (for example the scene and the walker).
    //
    //   THREE          the Three.js namespace
    //   getScene()     returns the scene the particles are added to
    //   getWalker()    returns the walker (for inherited momentum)
    //   random()       returns a random number in [0, 1)
    //   getGravity()   returns the page's gravity in m/s²
    //   sampleGround(x, z)  returns terrain height at (x, z)
    //   color          particle colour (hex)
    //   opacity        starting opacity of the particle material
    //   drift          optional [dx, dz] wind added to particle velocity every frame
    function create(options) {
        const { THREE, getScene, getWalker, random, getGravity, sampleGround, color, opacity, drift = null, maxBursts = 24 } = options;
        const state = { bursts: [], texture: null };

        function texture() {
            if (state.texture) return state.texture;
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 32;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
            state.texture = new THREE.CanvasTexture(canvas);
            return state.texture;
        }

        function disposeBurst(burst) {
            getScene().remove(burst.points);
            burst.points.geometry.dispose();
            burst.points.material.dispose();
        }

        function spawn(x, y, z, count, energy) {
            const walker = getWalker();
            const positions = new Float32Array(count * 3);
            const velocities = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const angle = random() * Math.PI * 2, spread = energy * (0.3 + random() * 0.9);
                positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
                velocities[i * 3] = Math.cos(angle) * spread + walker.vx * 0.3;
                velocities[i * 3 + 1] = energy * (0.5 + random() * 0.9);
                velocities[i * 3 + 2] = Math.sin(angle) * spread + walker.vz * 0.3;
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const material = new THREE.PointsMaterial({ size: 0.05 + energy * 0.05, map: texture(), color, transparent: true, opacity, depthWrite: false, sizeAttenuation: true });
            const points = new THREE.Points(geometry, material);
            points.frustumCulled = false;
            getScene().add(points);
            state.bursts.push({ points, velocities, age: 0, life: 1.15 + energy * 0.4 });
            if (state.bursts.length > maxBursts) disposeBurst(state.bursts.shift());
        }

        function update(dt) {
            const gravity = getGravity();
            const driftX = drift ? drift[0] : 0, driftZ = drift ? drift[1] : 0;
            for (let i = state.bursts.length - 1; i >= 0; i--) {
                const burst = state.bursts[i];
                burst.age += dt;
                const attribute = burst.points.geometry.attributes.position;
                for (let j = 0; j < attribute.count; j++) {
                    let px = attribute.getX(j) + (burst.velocities[j * 3] + driftX) * dt;
                    let py = attribute.getY(j) + burst.velocities[j * 3 + 1] * dt;
                    let pz = attribute.getZ(j) + (burst.velocities[j * 3 + 2] + driftZ) * dt;
                    burst.velocities[j * 3 + 1] -= gravity * dt;
                    const ground = sampleGround(px, pz) + 0.01;
                    if (py < ground) { py = ground; burst.velocities[j * 3] *= 0.3; burst.velocities[j * 3 + 1] = 0; burst.velocities[j * 3 + 2] *= 0.3; }
                    attribute.setXYZ(j, px, py, pz);
                }
                attribute.needsUpdate = true;
                burst.points.material.opacity = Math.max(0, 0.65 * (1 - burst.age / burst.life));
                if (burst.age >= burst.life) {
                    disposeBurst(burst);
                    state.bursts.splice(i, 1);
                }
            }
        }

        return { spawn, update, texture };
    }

    root.ExpeditionDust = Object.freeze({ create });
}(typeof globalThis !== 'undefined' ? globalThis : this));
