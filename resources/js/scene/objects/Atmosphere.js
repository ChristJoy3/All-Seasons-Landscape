import * as THREE from 'three';
import { common } from '../shaders/chunks';

/**
 * Atmosphere: a sky dome that blends into the fog at the horizon with a season-coloured
 * glow band, plus additive light motes (pollen / fireflies) floating above the lawn.
 */
const skyVertex = /* glsl */ `
    varying vec3 vDirection;

    void main() {
        vDirection = normalize(position);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
    }
`;

const skyFragment = /* glsl */ `
    ${common}

    varying vec3 vDirection;

    void main() {
        float y = vDirection.y;
        vec3 color = mix(uFogColor, uInk * 0.55, smoothstep(0.0, 0.5, y));
        color += seasonColor(uSeason) * 0.1 * exp(-abs(y - 0.02) * 9.0);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
    }
`;

const motesVertex = /* glsl */ `
    ${common}

    uniform float uPixelRatio;
    uniform float uMotes;

    attribute vec3 aRand;

    varying float vAlpha;

    void main() {
        vec3 p = position;
        p.y = mod(p.y + uTime * (0.15 + aRand.x * 0.25), 10.0) + 0.2;
        p.x += sin(uTime * 0.5 + aRand.y * 6.2831) * 0.6;
        p.z += cos(uTime * 0.4 + aRand.z * 6.2831) * 0.6;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (2.0 + aRand.z * 4.0) * uPixelRatio * (20.0 / -mv.z);

        float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + aRand.x * 20.0);
        vAlpha = twinkle * uMotes * (1.0 - smoothstep(uFogNear, uFogFar, -mv.z));
    }
`;

const motesFragment = /* glsl */ `
    ${common}

    varying float vAlpha;

    void main() {
        float d = length(gl_PointCoord - 0.5);
        float glow = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(mix(uGold, seasonColor(uSeason), 0.5) * glow, glow * vAlpha);
        #include <colorspace_fragment>
    }
`;

export class Atmosphere {
    /**
     * @param {Record<string, THREE.IUniform>} uniforms shared uniforms
     * @param {{ motes: number }} quality
     */
    constructor(uniforms, { motes }) {
        this.group = new THREE.Group();

        this.skyGeometry = new THREE.SphereGeometry(150, 32, 16);
        this.skyMaterial = new THREE.ShaderMaterial({
            vertexShader: skyVertex,
            fragmentShader: skyFragment,
            uniforms,
            side: THREE.BackSide,
            depthWrite: false,
        });
        this.sky = new THREE.Mesh(this.skyGeometry, this.skyMaterial);
        this.sky.renderOrder = -1;
        this.group.add(this.sky);

        const positions = new Float32Array(motes * 3);
        const randoms = new Float32Array(motes * 3);
        for (let i = 0; i < motes; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = -36 + Math.random() * 50;
            randoms.set([Math.random(), Math.random(), Math.random()], i * 3);
        }
        this.motesGeometry = new THREE.BufferGeometry();
        this.motesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.motesGeometry.setAttribute('aRand', new THREE.BufferAttribute(randoms, 3));
        this.motesMaterial = new THREE.ShaderMaterial({
            vertexShader: motesVertex,
            fragmentShader: motesFragment,
            uniforms,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.motes = new THREE.Points(this.motesGeometry, this.motesMaterial);
        this.motes.frustumCulled = false;
        this.group.add(this.motes);
    }

    /** Keep the sky centred on the camera so it never clips. */
    follow(camera) {
        this.sky.position.copy(camera.position);
    }

    dispose() {
        this.skyGeometry.dispose();
        this.skyMaterial.dispose();
        this.motesGeometry.dispose();
        this.motesMaterial.dispose();
    }
}
