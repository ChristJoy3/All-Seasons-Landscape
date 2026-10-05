import * as THREE from 'three';
import { common } from '../shaders/chunks';

/**
 * Instanced maple leaves, the logo's motif. They drift and tumble through the scene;
 * the mix of green / gold / ember leaves follows the season. Beats:
 *   uLeafAmount  share of leaves visible (0..1)
 *   uSweep       leaves blown out of frame (clean-up / hauling)
 *   uVortex      leaves gather into a slow vortex around uVortexCenter (contact finale)
 */
const vertexShader = /* glsl */ `
    ${common}

    uniform float uLeafAmount;
    uniform float uSweep;
    uniform float uVortex;
    uniform vec3 uVortexCenter;

    attribute vec4 aSeed;

    varying vec3 vColor;
    varying vec3 vNormal;
    varying float vDepth;

    mat3 rotation(float x, float z) {
        float cx = cos(x), sx = sin(x), cz = cos(z), sz = sin(z);
        return mat3(cz, sz, 0.0, -sz, cz, 0.0, 0.0, 0.0, 1.0) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
    }

    void main() {
        float t = uTime * (0.6 + aSeed.y * 0.6) + aSeed.w * 100.0;

        // Free fall through a box around the scene, wrapping vertically.
        vec3 drift;
        drift.x = (aSeed.x - 0.5) * 56.0 + sin(t * 0.6 + aSeed.z * 6.2831) * 1.8;
        drift.y = mod(aSeed.y * 16.0 - uTime * (0.5 + aSeed.z * 0.5), 16.0) - 1.0;
        drift.z = (aSeed.z - 0.5) * 46.0 - 10.0 + cos(t * 0.45) * 1.8;
        drift.x += uSweep * (26.0 + aSeed.x * 30.0);
        drift.y += uSweep * aSeed.z * 6.0;

        // Vortex formation.
        float angle = aSeed.x * 6.2831 + uTime * (0.25 + aSeed.y * 0.35);
        float radius = 1.6 + aSeed.z * 4.6;
        vec3 vortex = uVortexCenter + vec3(cos(angle) * radius, (aSeed.y - 0.5) * 5.0 + sin(angle * 2.0 + aSeed.w * 6.0) * 0.5, sin(angle) * radius * 0.7);
        vec3 center = mix(drift, vortex, smoothstep(0.0, 1.0, clamp(uVortex * 1.4 - aSeed.w * 0.4, 0.0, 1.0)));

        float visible = smoothstep(fract(aSeed.w * 7.13) - 0.04, fract(aSeed.w * 7.13), uLeafAmount);
        // Shrink leaves that drift right up to the lens so they never fill the screen.
        float lens = smoothstep(1.5, 5.0, distance(center, cameraPosition));
        float scale = (0.2 + aSeed.w * 0.22) * visible * lens;

        mat3 rot = rotation(t * 1.3, t * 0.9);
        vNormal = rot * vec3(0.0, 0.0, 1.0);

        // Season decides the share of green / gold / ember leaves.
        float pick = fract(aSeed.x * 13.7);
        float greenShare = clamp(0.8 - uSeason * 0.4, 0.0, 0.8);
        float goldShare = clamp(0.2 + uSeason * 0.25, 0.0, 0.45);
        vColor = mix(uGreen, uGold, smoothstep(greenShare - 0.04, greenShare + 0.04, pick));
        vColor = mix(vColor, uEmber, smoothstep(greenShare + goldShare - 0.04, greenShare + goldShare + 0.04, pick));

        vec4 mv = viewMatrix * vec4(center + rot * (position * scale), 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentShader = /* glsl */ `
    ${common}

    varying vec3 vColor;
    varying vec3 vNormal;
    varying float vDepth;

    void main() {
        float light = abs(dot(normalize(vNormal), normalize(vec3(-0.4, 0.8, 0.5)))) * 0.55 + 0.3;
        gl_FragColor = vec4(applyFog(vColor * light, vDepth), 1.0);
        #include <colorspace_fragment>
    }
`;

/** Maple-leaf outline in a -1..1 box, shared with any 2D leaf art. */
export const MAPLE_LEAF_POINTS = [
    [0.03, -1], [0.04, -0.5], [0.55, -0.68], [0.42, -0.3], [0.98, -0.05], [0.55, 0.08], [0.78, 0.5],
    [0.32, 0.32], [0.3, 0.78], [0.12, 0.52], [0, 1], [-0.12, 0.52], [-0.3, 0.78], [-0.32, 0.32],
    [-0.78, 0.5], [-0.55, 0.08], [-0.98, -0.05], [-0.42, -0.3], [-0.55, -0.68], [-0.04, -0.5], [-0.03, -1],
];

export class Leaves {
    /**
     * @param {Record<string, THREE.IUniform>} uniforms shared uniforms
     * @param {{ count: number }} quality
     */
    constructor(uniforms, { count }) {
        const shape = new THREE.Shape(MAPLE_LEAF_POINTS.map(([x, y]) => new THREE.Vector2(x, y)));
        const leaf = new THREE.ShapeGeometry(shape);

        this.geometry = new THREE.InstancedBufferGeometry();
        this.geometry.index = leaf.index;
        this.geometry.setAttribute('position', leaf.getAttribute('position'));
        this.geometry.instanceCount = count;

        const seeds = new Float32Array(count * 4);
        for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
        this.geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));

        this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, side: THREE.DoubleSide });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;

        leaf.dispose();
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
