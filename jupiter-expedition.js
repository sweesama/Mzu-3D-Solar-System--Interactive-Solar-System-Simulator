(function (root) {
    // Stations carry an altitude (y): quick travel repositions the probe in 3D space.
    const stations = Object.freeze([
        Object.freeze({ x: 0, z: 6, y: 260, yaw: -0.12, pitch: -0.1 }),
        Object.freeze({ x: 60, z: 80, y: 150, yaw: 0.6, pitch: -0.05 }),
        Object.freeze({ x: -124, z: -44, y: 80, yaw: -1.9, pitch: -0.15 })
    ]);
    const discoveries = Object.freeze([
        Object.freeze({ id: 'veil', x: -18, z: -14, radius: 26, node: 1, markerHeight: 190, y: 190 }),
        Object.freeze({ id: 'crystal', x: 62, z: 84, radius: 8, node: 5, markerHeight: 30, y: 60 }),
        Object.freeze({ id: 'storm', x: -124, z: -44, radius: 26, node: 3, markerHeight: 10, y: 45 }),
        Object.freeze({ id: 'lightning', x: -95, z: 120, radius: 22, node: 7, markerHeight: -55, y: -60 }),
        Object.freeze({ id: 'abyss', x: 0, z: -160, radius: 30, node: 8, markerHeight: -140, y: -150 })
    ]);
    const nodes = Object.freeze([
        { x: 0, z: 6 }, { x: -14, z: -10 }, { x: -60, z: -20 }, { x: -124, z: -44 },
        { x: -30, z: 60 }, { x: 60, z: 80 }, { x: 30, z: 20 }, { x: -95, z: 120 },
        { x: 0, z: -160 }
    ].map(Object.freeze));
    const edges = Object.freeze([[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [0, 6], [6, 5], [4, 7], [1, 8]].map(Object.freeze));
    function segmentDistance(x, z, a, b) {
        const dx = b.x - a.x, dz = b.z - a.z;
        const length = dx * dx + dz * dz;
        const t = length ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / length)) : 0;
        return Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t));
    }
    function isOnRoute(position, margin = 1.5) {
        if (stations.some(s => Math.hypot(position.x - s.x, position.z - s.z) < 6 + margin)) return true;
        return edges.some(([from, to]) => segmentDistance(position.x, position.z, nodes[from], nodes[to]) <= margin);
    }
    function canDiscover(body, index) {
        const target = discoveries[index];
        return !!(body && target && body.grounded && Math.hypot(body.x - target.x, body.z - target.z) <= target.radius && Math.abs(body.y - target.y) <= 42);
    }
    function parseProgress(raw) {
        try {
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list.filter(id => discoveries.some(d => d.id === id)) : [];
        } catch (error) { return []; }
    }
    function recordDiscovery(found, body, index) {
        const target = discoveries[index];
        if (!target || found.includes(target.id) || !canDiscover(body, index)) return found;
        return found.concat(target.id);
    }
    function guidance(position, index) {
        const target = discoveries[index];
        const start = nodes.reduce((best, node, i) => Math.hypot(node.x - position.x, node.z - position.z) < Math.hypot(best.x - position.x, best.z - position.z) ? node : best, nodes[0]);
        const stop = nodes.reduce((best, node, i) => Math.hypot(node.x - target.x, node.z - target.z) + (edges.some(([a, b]) => (nodes[a] === node && b === target.node) || (nodes[b] === node && a === target.node)) ? 0 : 400) < Math.hypot(best.x - target.x, best.z - target.z) + (edges.some(([a, b]) => (nodes[a] === best && b === target.node) || (nodes[b] === best && a === target.node)) ? 0 : 400) ? node : best, nodes[target.node]);
        const parent = new Map([[start, null]]);
        const queue = [start];
        while (queue.length) {
            const node = queue.shift();
            if (node === stop) break;
            for (const [a, b] of edges) {
                const next = nodes[a] === node ? nodes[b] : nodes[b] === node ? nodes[a] : null;
                if (next && !parent.has(next)) { parent.set(next, node); queue.push(next); }
            }
        }
        const path = [];
        for (let node = stop; node; node = parent.get(node)) path.unshift(node);
        if (path.length > 1) path.shift();
        const next = path[0] && Math.hypot(path[0].x - position.x, path[0].z - position.z) > 1 ? path[0] : target;
        return { x: next.x, z: next.z, distance: Math.hypot(next.x - position.x, next.z - position.z), path };
    }
    root.JupiterExpedition = Object.freeze({ STORAGE_KEY: 'mzu-jupiter-descent-v1', stations, discoveries, nodes, edges, isOnRoute, canDiscover, parseProgress, recordDiscovery, guidance });
}(typeof globalThis !== 'undefined' ? globalThis : this));
