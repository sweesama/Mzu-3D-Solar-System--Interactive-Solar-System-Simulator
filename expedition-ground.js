// Shared photo-scanned ground for the walking expeditions (Moon, Mars, Venus, Mercury).
// Source: ambientCG "Ground054" (CC0). The colour map is desaturated so each world tints it;
// the normal and roughness maps give the soil real pits and grain under the sun.
(function (root) {
    let maps = null;
    function load(url, srgb) {
        const texture = new THREE.TextureLoader().load(url);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        if (srgb) texture.encoding = THREE.sRGBEncoding;
        return texture;
    }
    function upgrade(material, repeats, tint, anisotropy) {
        if (!maps) maps = { color: load('textures/regolith_color.jpg', true), normal: load('textures/regolith_normal.jpg'), rough: load('textures/regolith_roughness.jpg') };
        for (const texture of Object.values(maps)) {
            texture.repeat.set(repeats, repeats);
            texture.anisotropy = anisotropy || 1;
        }
        material.map = maps.color;
        material.normalMap = maps.normal;
        material.normalScale = new THREE.Vector2(1.2, 1.2);
        material.roughnessMap = maps.rough;
        material.bumpMap = null;
        material.color = new THREE.Color(tint);
        material.needsUpdate = true;
    }
    root.ExpeditionGround = Object.freeze({ upgrade });
}(typeof globalThis !== 'undefined' ? globalThis : this));
