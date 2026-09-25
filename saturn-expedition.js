(function (root) {
    // Ring-plane cruise: stations carry altitude y above the ring sheet (y = 0).
    const stations = Object.freeze([
        Object.freeze({ x: 0, z: 140, y: 120, yaw: 0.55, pitch: -0.04 }),   // 01 approach, high view of the sheet facing Saturn
        Object.freeze({ x: 40, z: 200, y: 9, yaw: 0.4, pitch: -0.02 }),     // 02 skimming the B ring
        Object.freeze({ x: -60, z: 10, y: 4, yaw: -1.8, pitch: 0.02 })      // 03 inside the Cassini division
    ]);
    const discoveries = Object.freeze([
        Object.freeze({ id: 'approach', x: 0, z: 140, radius: 30, node: 1, markerHeight: 118, y: 118 }),
        Object.freeze({ id: 'ice', x: 42, z: 196, radius: 10, node: 5, markerHeight: 7, y: 8 }),
        Object.freeze({ id: 'division', x: -60, z: 10, radius: 28, node: 8, markerHeight: 6, y: 5 }),
        Object.freeze({ id: 'moonlet', x: -140, z: 300, radius: 26, node: 3, markerHeight: 12, y: 10 }),
        Object.freeze({ id: 'propeller', x: 150, z: -180, radius: 24, node: 7, markerHeight: 4, y: 5 })
    ]);
    const nodes = Object.freeze([
        { x: 0, z: 140 }, { x: -20, z: 160 }, { x: -80, z: 220 }, { x: -140, z: 300 },
        { x: 20, z: 190 }, { x: 42, z: 196 }, { x: 80, z: 60 }, { x: 150, z: -180 },
        { x: -60, z: 10 }
    ].map(Object.freeze));
    const edges = Object.freeze([[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [0, 6], [6, 5], [6, 7], [4, 8]].map(Object.freeze));
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
        return !!(body && target && Math.hypot(body.x - target.x, body.z - target.z) <= target.radius && Math.abs(body.y - target.y) <= 40);
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
    root.SaturnExpedition = Object.freeze({ STORAGE_KEY: 'mzu-saturn-rings-v1', stations, discoveries, nodes, edges, isOnRoute, canDiscover, parseProgress, recordDiscovery, guidance });
}(typeof globalThis !== 'undefined' ? globalThis : this));
