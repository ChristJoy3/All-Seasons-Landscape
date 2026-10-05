import * as THREE from 'three';
import { common, terrain } from '../shaders/chunks';
import { terrainHeight } from '../terrainHeight';

/**
 * Instanced grass field. One tapered blade geometry, tens of thousands of instances,
 * all animated on the GPU (wind, mouse push, and service beats):
 *   uGrassHeight  overall height
 *   uTrim         cuts every blade to a clean, level line (hedge trimming)
 *   uGrowth       staggered regrowth from bare ground (overseeding)
 *   uSod          lawn appears in rolled strips (sod installation)
 *   uGravel       blades part to make way for the gravel driveway
 */
const vertexShader = /* glsl */ `
    ${common}
    ${terrain}

    uniform vec3 uMouse;
    uniform float uWind;
    uniform float uGrassHeight;
    uniform float uTrim;
    uniform float uGrowth;
    uniform float uSod;
    uniform float uGravel;

    attribute vec3 aOffset;  // x, z, height scale
    attribute vec3 aRand;    // rotation, sway phase, variant
    attribute float aGround; // terrain height under the blade (precomputed on the CPU, before uMorph)

    varying float vY;
    varying float vVariant;
    varying float vDepth;

    void main() {
        vec2 base = aOffset.xy;
        float ground = aGround * uMorph;

        float grow = clamp((uGrowth - aRand.z * 0.6) / 0.4, 0.0, 1.0);
        float strip = fract(sin(floor(base.y / 1.6) * 91.7) * 4375.85);
        float sod = clamp((uSod * 1.2 - strip) / 0.2, 0.0, 1.0);
        float driveway = mix(1.0, smoothstep(1.5, 2.4, drivewayDistance(base)), uGravel);
        float height = aOffset.z * uGrassHeight * grow * sod * driveway;
        height = mix(height, min(height, 0.26 + aRand.z * 0.02), uTrim);

        vec3 p = position;
        float y = p.y;
        p.y *= height;

        float ca = cos(aRand.x);
        float sa = sin(aRand.x);
        p.xz = mat2(ca, -sa, sa, ca) * p.xz;

        // Wind: large noise gusts plus a per-blade sway.
        float gust = snoise(base * 0.12 + vec2(uTime * 0.35, uTime * 0.2));
        float sway = sin(uTime * 1.8 + aRand.y * 6.2831 + base.x * 0.3) * 0.08;
        vec2 bend = vec2(gust * 0.55 + sway, gust * 0.25) * uWind;

        // Blades part around the pointer.
        vec2 away = base - uMouse.xz;
        float dist = length(away);
        bend += (dist > 0.001 ? away / dist : vec2(0.0)) * smoothstep(3.5, 0.0, dist) * 1.1;

        float k = y * y;
        p.xz += bend * k * height;
        p.y -= length(bend) * k * height * 0.35;

        vec4 mv = viewMatrix * vec4(vec3(base.x, ground, base.y) + p, 1.0);
        vY = y;
        vVariant = aRand.z;
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentShader = /* glsl */ `
    ${common}

    varying float vY;
    varying float vVariant;
    varying float vDepth;

    void main() {
        vec3 accent = seasonColor(uSeason);
        vec3 root = uInk * 1.1 + uGreen * 0.03;
        vec3 tip = mix(uGreen, accent, 0.5) * (0.42 + vVariant * 0.38);
        vec3 color = mix(root, tip, smoothstep(0.0, 1.0, vY));
        color += accent * pow(vY, 6.0) * 0.18;

        gl_FragColor = vec4(applyFog(color, vDepth), 1.0);
        #include <colorspace_fragment>
    }
`;

/** Tapered blade: `segments` quads narrowing to a single tip vertex. y runs 0 -> 1. */
function createBladeGeometry(width = 0.09, segments = 4) {
    const positions = [];
    const indices = [];

    for (let i = 0; i < segments; i++) {
        const y = i / segments;
        const half = (width / 2) * (1 - y);
        positions.push(-half, y, 0, half, y, 0);
    }
    positions.push(0, 1, 0);

    for (let i = 0; i < segments - 1; i++) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const last = (segments - 1) * 2;
    indices.push(last, last + 1, segments * 2);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    return geometry;
}

export class Grass {
    /**
     * @param {Record<string, THREE.IUniform>} uniforms shared uniforms
     * @param {{ count: number }} quality
     */
    constructor(uniforms, { count }) {
        const blade = createBladeGeometry();

        this.geometry = new THREE.InstancedBufferGeometry();
        this.geometry.index = blade.index;
        this.geometry.setAttribute('position', blade.getAttribute('position'));
        this.geometry.instanceCount = count;

        const offsets = new Float32Array(count * 3);
        const randoms = new Float32Array(count * 3);
        const grounds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            offsets[i * 3] = (Math.random() - 0.5) * 52; // x: -26..26
            offsets[i * 3 + 1] = -34 + Math.random() * 43; // z: -34..9 (clear of the hero lens)
            offsets[i * 3 + 2] = 0.5 + Math.random() * 0.6; // height
            randoms[i * 3] = Math.random() * Math.PI * 2;
            randoms[i * 3 + 1] = Math.random();
            randoms[i * 3 + 2] = Math.random();
            grounds[i] = terrainHeight(offsets[i * 3], offsets[i * 3 + 1]);
        }
        this.geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
        this.geometry.setAttribute('aRand', new THREE.InstancedBufferAttribute(randoms, 3));
        this.geometry.setAttribute('aGround', new THREE.InstancedBufferAttribute(grounds, 1));

        this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, side: THREE.DoubleSide });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;

        blade.dispose();
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
