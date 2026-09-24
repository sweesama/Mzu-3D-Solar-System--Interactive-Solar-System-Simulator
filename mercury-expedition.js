(function (root) {
    const stations = Object.freeze([
        Object.freeze({ x: 0, z: 6, yaw: -0.12, pitch: -0.06 }),
        Object.freeze({ x: -65, z: 8, yaw: -1.9, pitch: -0.02 }),
        Object.freeze({ x: 55, z: 50, yaw: 0.5, pitch: 0.1 })
    ]);
    const discoveries = Object.freeze([
        Object.freeze({ id: 'crater', x: -31, z: -25, radius: 6, node: 2, markerHeight: 1.4 }),
        Object.freeze({ id: 'boulder', x: -37, z: -16, radius: 6, node: 18, markerHeight: 2.6 }),
        Object.freeze({ id: 'beacon', x: 28, z: -30, radius: 5, node: 6, markerHeight: 1.9 }),
        Object.freeze({ id: 'hollows', x: 92, z: 96, radius: 6, node: 9, markerHeight: 1.2 }),
        Object.freeze({ id: 'scarp', x: 62, z: -72, radius: 6, node: 5, markerHeight: 1.8 })
    ]);
    const nodes = Object.freeze([
        { x: 0, z: 6 }, { x: -22, z: -12 }, { x: -31, z: -25 }, { x: -5, z: -75 },
        { x: 30, z: -98 }, { x: 62, z: -72 }, { x: 28, z: -30 }, { x: 60, z: 20 },
        { x: 78, z: 68 }, { x: 92, z: 96 }, { x: 18, z: 55 }, { x: -95, z: 95 },
        { x: -135, z: 120 }, { x: -152, z: 102 }, { x: -65, z: 8 }, { x: 90, z: -30 },
        { x: 140, z: 50 }, { x: 55, z: 50 }, { x: -33, z: -12 }
    ].map(Object.freeze));
    const edges = Object.freeze([[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [0, 6], [6, 15], [15, 5], [0, 10], [10, 7], [7, 8], [8, 9], [8, 17], [10, 11], [11, 12], [12, 13], [0, 14], [7, 16], [1, 18]].map(Object.freeze));
    function project(point, a, b) {
        const dx = b.x - a.x, dz = b.z - a.z;
        const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.z - a.z) * dz) / (dx * dx + dz * dz)));
        const x = a.x + dx * t, z = a.z + dz * t;
        return { x, z, distance: Math.hypot(point.x - x, point.z - z) };
    }
    function isOnRoute(point, radius) {
        return edges.some(([a, b]) => project(point, nodes[a], nodes[b]).distance < radius + 1.5);
    }
    function canDiscover(position, index) {
        const target = discoveries[index];
        return Boolean(target && position.grounded && Math.hypot(position.x - target.x, position.z - target.z) <= target.radius);
    }
    function parseProgress(value) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? discoveries.map(item => item.id).filter(id => parsed.includes(id)) : [];
        } catch (error) { return []; }
    }
    function recordDiscovery(found, position, index) {
        if (!canDiscover(position, index)) return found.slice();
        return discoveries.map(item => item.id).filter(id => found.includes(id) || id === discoveries[index].id);
    }
    function guidance(position, index) {
        const goal = discoveries[index].node;
        const distances = nodes.map(() => Infinity), next = nodes.map(() => -1), visited = new Set();
        distances[goal] = 0;
        for (let i = 0; i < nodes.length; i++) {
            let closest = -1;
            for (let j = 0; j < nodes.length; j++) if (!visited.has(j) && (closest < 0 || distances[j] < distances[closest])) closest = j;
            visited.add(closest);
            for (const [a, b] of edges) {
                const neighbor = a === closest ? b : b === closest ? a : -1;
                if (neighbor < 0) continue;
                const distance = distances[closest] + Math.hypot(nodes[a].x - nodes[b].x, nodes[a].z - nodes[b].z);
                if (distance < distances[neighbor]) { distances[neighbor] = distance; next[neighbor] = closest; }
            }
        }
        let nearest, edge;
        for (const [a, b] of edges) {
            const projection = project(position, nodes[a], nodes[b]);
            if (!nearest || projection.distance < nearest.distance) { nearest = projection; edge = [a, b]; }
        }
        const costs = edge.map(node => distances[node] + Math.hypot(nearest.x - nodes[node].x, nearest.z - nodes[node].z));
        let node = costs[0] <= costs[1] ? edge[0] : edge[1];
        const distance = nearest.distance + Math.min(...costs);
        let point = nearest;
        if (nearest.distance <= 4) {
            if (Math.hypot(position.x - nodes[node].x, position.z - nodes[node].z) < 2 && next[node] >= 0) node = next[node];
            point = nodes[node];
        }
        const path = [nearest, nodes[node]];
        let cursor = node;
        while (next[cursor] >= 0) { cursor = next[cursor]; path.push(nodes[cursor]); }
        return { x: point.x, z: point.z, distance, path };
    }
    root.MercuryExpedition = Object.freeze({ STORAGE_KEY: 'mzu-mercury-discoveries-v1', stations, discoveries, nodes, edges, isOnRoute, canDiscover, parseProgress, recordDiscovery, guidance });
}(typeof globalThis !== 'undefined' ? globalThis : this));
