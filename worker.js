// worker.js
// Handles heavy Math computations for celestial body generation

self.onmessage = function(e) {
    const { type, data } = e.data;
    
    if (type === 'GENERATE_KUIPER_BELT') {
        const { count, beltInnerRadius, beltOuterRadius, beltHeight } = data;
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const a = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
            const e = Math.random() * 0.25; 
            const M = Math.random() * Math.PI * 2;

            let E_kbo = M;
            for (let k = 0; k < 5; k++) { E_kbo = M + e * Math.sin(E_kbo); }

            const r_kbo = a * (1 - e * Math.cos(E_kbo));
            const trueAnomaly = 2 * Math.atan2(Math.sqrt(1+e) * Math.sin(E_kbo/2), Math.sqrt(1-e) * Math.cos(E_kbo/2));

            const x = r_kbo * Math.cos(trueAnomaly) - a * e;
            const z = r_kbo * Math.sin(trueAnomaly);

            const inclination = (Math.random() - 0.5) * 0.35;
            const longitudeOfAscendingNode = Math.random() * Math.PI * 2;

            const cx = Math.cos(inclination), sx = Math.sin(inclination);
            const cy = Math.cos(longitudeOfAscendingNode), sy = Math.sin(longitudeOfAscendingNode);

            // Rotate X (y = 0)
            const y1 = -z * sx;
            const z1 = z * cx;
            const x1 = x;

            // Rotate Y
            const x2 = x1 * cy + z1 * sy;
            const z2 = -x1 * sy + z1 * cy;
            const y2 = y1 + (Math.random() - 0.5) * beltHeight * (1 + (Math.random()-0.5)*1.2); 
            
            positions[i * 3] = x2;
            positions[i * 3 + 1] = y2;
            positions[i * 3 + 2] = z2;
        }
        
        self.postMessage({ type: 'KUIPER_BELT_DATA', positions }, [positions.buffer]);
    }
    
    if (type === 'GENERATE_ASTEROID_BELT') {
        const { count, beltInnerRadius, beltOuterRadius, beltHeight, poolSize } = data;
        // Each asteroid has 10 properties:
        // [poolIndex, scale, a, e, y_pos, rotX, rotZ, rotY, speed, rotationSpeed]
        const asteroidData = new Float32Array(count * 10);
        
        for (let i = 0; i < count; i++) {
            const poolIndex = Math.floor(Math.random() * poolSize);
            const scale = 0.8 + Math.random() * 0.4;
            const a = beltInnerRadius + Math.random() * (beltOuterRadius - beltInnerRadius);
            const e = Math.random() * 0.08;
            const y_pos = (Math.random() - 0.5) * beltHeight * (1 + (Math.random()-0.5)*1.0);
            
            const rotX = (Math.random() - 0.5) * 0.25;
            const rotZ = (Math.random() - 0.5) * 0.25;
            const rotY = Math.random() * Math.PI * 2;
            
            const speed = 0.0015 + Math.random() * 0.008;
            const rotationSpeed = Math.random() * 0.02;
            
            const offset = i * 10;
            asteroidData[offset] = poolIndex;
            asteroidData[offset + 1] = scale;
            asteroidData[offset + 2] = a;
            asteroidData[offset + 3] = e;
            asteroidData[offset + 4] = y_pos;
            asteroidData[offset + 5] = rotX;
            asteroidData[offset + 6] = rotZ;
            asteroidData[offset + 7] = rotY;
            asteroidData[offset + 8] = speed;
            asteroidData[offset + 9] = rotationSpeed;
        }
        
        self.postMessage({ type: 'ASTEROID_BELT_DATA', asteroidData }, [asteroidData.buffer]);
    }
};
