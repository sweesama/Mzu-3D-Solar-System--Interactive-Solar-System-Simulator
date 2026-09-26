(function (root) {
    'use strict';
    // Screen-space lens flare, shared by every expedition page that shows a
    // real sun. The shader pass reads the rendered frame each frame, samples
    // the sun's actual brightness, and derives the anamorphic beam, vertical
    // spike, halo ring and chromatic ghost chain from it — so terrain or haze
    // occluding the sun dims the flare for real, and an off-screen sun casts
    // none at all.
    let sharedVector = null;
    function create() {
        if (typeof THREE === 'undefined' || !THREE.ShaderPass) return null;
        return new THREE.ShaderPass({
            uniforms: {
                tDiffuse: { value: null },
                uSunPos: { value: new THREE.Vector2(0.5, 0.5) },
                uIntensity: { value: 0 },
                uAspect: { value: 1.78 }
            },
            vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
            fragmentShader: `uniform sampler2D tDiffuse;
                uniform vec2 uSunPos; uniform float uIntensity, uAspect; varying vec2 vUv;
                float sunLum(vec2 uv){
                    vec3 c = texture2D(tDiffuse, uv).rgb;
                    return smoothstep(0.5, 0.9, max(c.r, max(c.g, c.b)));
                }
                void main(){
                    vec4 base = texture2D(tDiffuse, vUv);
                    vec3 acc = vec3(0.0);
                    if (uIntensity > 0.002) {
                        vec2 center = vec2(0.5);
                        vec2 sd = uSunPos - center;
                        float sl = sunLum(uSunPos) * 0.6
                                 + sunLum(uSunPos + vec2(0.006, 0.0)) * 0.2
                                 + sunLum(uSunPos - vec2(0.006, 0.0)) * 0.2;
                        sl *= uIntensity;
                        float dx = (vUv.x - uSunPos.x) * uAspect;
                        float dy = vUv.y - uSunPos.y;
                        float beam = exp(-dy * dy / 1.4e-5) * (0.45 + 0.55 * exp(-abs(dx) * 2.4));
                        float vbeam = exp(-dx * dx / 1.0e-5) * exp(-abs(dy) * 5.0) * 0.22;
                        float rd = length(vec2(dx, dy));
                        float halo = exp(-pow(rd - 0.075, 2.0) / 0.00016) * 0.16;
                        acc += vec3(1.0, 0.96, 0.88) * beam * sl * 0.55
                             + vec3(0.82, 0.88, 1.0) * vbeam * sl
                             + vec3(0.9, 0.92, 1.0) * halo * sl;
                        for (int i = 0; i < 6; i++) {
                            float k = 0.55 + float(i) * 0.42;
                            float r = 0.016 + float(i) * 0.009;
                            vec2 g = center - sd * k;
                            float d = length(vec2((vUv.x - g.x) * uAspect, vUv.y - g.y));
                            float ring = exp(-pow((d - r) / (r * 0.55), 2.0));
                            vec3 tint = (i == 0 || i == 2 || i == 4) ? vec3(1.0, 0.9, 0.72) : vec3(0.68, 0.8, 1.0);
                            acc += tint * ring * sl * (0.13 - float(i) * 0.011);
                        }
                    }
                    gl_FragColor = vec4(base.rgb + acc, base.a);
                }`
        });
    }
    // Call once per frame before composer.render(). `sun` is the THREE object
    // used as the bright source; the pass fades out automatically when the
    // sun leaves the frame or sits behind the camera.
    function update(pass, sun, camera) {
        if (!pass || !sun) return;
        if (!sharedVector) sharedVector = new THREE.Vector3();
        sun.getWorldPosition(sharedVector);
        sharedVector.project(camera);
        const uniforms = pass.material.uniforms;
        uniforms.uAspect.value = camera.aspect;
        uniforms.uSunPos.value.set(sharedVector.x * 0.5 + 0.5, sharedVector.y * 0.5 + 0.5);
        const visible = sharedVector.z < 1 && Math.abs(sharedVector.x) < 1.45 && Math.abs(sharedVector.y) < 1.45;
        const edge = Math.max(0, 1 - Math.hypot(sharedVector.x, sharedVector.y) / 1.5);
        uniforms.uIntensity.value = visible ? edge * edge : 0;
    }
    root.SolarFlare = Object.freeze({ create, update });
}(typeof globalThis !== 'undefined' ? globalThis : this));
