(function (root) {
    const stations = Object.freeze([
        Object.freeze({ x: 0, z: 6, yaw: -0.3, pitch: -0.04 }),
        Object.freeze({ x: -40, z: 20, yaw: 0.47, pitch: -0.03 }),
        Object.freeze({ x: -72, z: 100, yaw: 2.5, pitch: -0.02 })
    ]);
    const discoveries = Object.freeze([
        Object.freeze({ id: 'strata', x: -85, z: -69, radius: 5, node: 5, markerHeight: 2.4 }),
        Object.freeze({ id: 'boulder', x: -43, z: 14, radius: 9.5, node: 2, markerHeight: 4.5 }),
        Object.freeze({ id: 'dunes', x: -78, z: 108, radius: 6, node: 8, markerHeight: 1.6 }),
        Object.freeze({ id: 'station', x: 31, z: -63, radius: 5, node: 14, markerHeight: 1.6 }),
        Object.freeze({ id: 'crater', x: 106, z: 101, radius: 6, node: 12, markerHeight: 1.7 })
    ]);
    const nodes = Object.freeze([
        { x: 0, z: 6 }, { x: -14, z: 4 }, { x: -45, z: 0 }, { x: -70, z: -40 }, { x: -85, z: -60 }, { x: -85, z: -69 },
        { x: -40, z: 40 }, { x: -70, z: 80 }, { x: -78, z: 108 },
        { x: 45, z: 30 }, { x: 95, z: 60 }, { x: 120, z: 85 }, { x: 104, z: 99 },
        { x: 18, z: -24 }, { x: 30, z: -60 }
    ].map(Object.freeze));
    const edges = Object.freeze([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14]].map(Object.freeze));
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
    root.MarsExpedition = Object.freeze({ STORAGE_KEY: 'mzu-mars-discoveries-v1', stations, discoveries, nodes, edges, isOnRoute, canDiscover, parseProgress, recordDiscovery, guidance });
    if (typeof module !== 'undefined' && module.exports) module.exports = root.MarsExpedition;
}(typeof globalThis !== 'undefined' ? globalThis : this));
