import * as THREE from 'three';
import { common, terrain } from '../shaders/chunks';

/**
 * Procedural terrain: faceted hills with glowing contour lines and a faint survey grid,
 * the "digital site plan" look. Also hosts several service beats in the fragment shader:
 *   uAerate      grid of glowing core holes
 *   uTint*       a colour sweep across the ground (mulch = ember shade, topdress = gold shade)
 *   uGravel      a winding gravel driveway laid through the lawn
 *   uPulse       scanning ring that radiates from the lawn
 */
const vertexShader = /* glsl */ `
    ${common}
    ${terrain}

    varying vec3 vWorld;
    varying float vHeight;
    varying float vDepth;

    void main() {
        // Height comes from world x/z so it matches the grass, which is placed in world space.
        vec4 world = modelMatrix * vec4(position, 1.0);
        world.y = terrainHeight(world.xz);
        vec4 mv = viewMatrix * world;
        vWorld = world.xyz;
        vHeight = world.y;
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentShader = /* glsl */ `
    ${common}

    uniform float uContour;
    uniform float uPulse;
    uniform float uAerate;
    uniform float uTintAmount;
    uniform float uTintProgress;
    uniform float uTintMix;
    uniform float uGravel;

    varying vec3 vWorld;
    varying float vHeight;
    varying float vDepth;

    void main() {
        // Faceted normal from screen-space derivatives: a crisp low-poly read.
        vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
        vec3 sunDir = normalize(vec3(-0.4, 0.8, -0.5));
        float diffuse = clamp(dot(normal, sunDir), 0.0, 1.0);
        vec3 accent = seasonColor(uSeason);

        float heightMix = smoothstep(-3.5, 3.5, vHeight);
        vec3 color = mix(uInk * 1.3, uGreen * 0.1, heightMix * 0.6 + 0.25) * (0.4 + 0.7 * diffuse);

        // Colour sweep (mulch / topdress) travelling across the ground along +x.
        float front = smoothstep(-4.0, 4.0, (uTintProgress * 90.0 - 45.0) - vWorld.x);
        vec3 tint = mix(uEmber * 0.3, uGold * 0.4, uTintMix);
        color = mix(color, tint * (0.55 + 0.6 * diffuse), front * uTintAmount);

        // Gravel driveway: fine pebble texture inside a winding band.
        float pathDistance = drivewayDistance(vWorld.xz);
        float driveway = (1.0 - smoothstep(1.6, 2.2, pathDistance)) * uGravel;
        float pebble = hash(floor(vWorld.xz * 18.0));
        vec3 gravel = vec3(0.3, 0.28, 0.24) * (0.45 + 0.65 * pebble) * (0.5 + 0.6 * diffuse);
        color = mix(color, gravel, driveway);

        // Anti-aliased contour lines and survey grid.
        float c = vHeight * 2.4;
        float contour = 1.0 - min(abs(fract(c - 0.5) - 0.5) / fwidth(c), 1.0);
        vec2 gp = vWorld.xz / 3.0;
        vec2 gl = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
        float grid = 1.0 - min(min(gl.x, gl.y), 1.0);
        float near = 1.0 - smoothstep(20.0, 70.0, vDepth);
        vec3 glow = accent * (contour * 0.75 + grid * 0.1) * uContour * (0.35 + 0.65 * near);

        // Scanning ring.
        float radius = length(vWorld.xz - vec2(0.0, -4.0));
        float wave = mod(uTime * 9.0, 90.0);
        glow += accent * exp(-pow((radius - wave) * 0.8, 2.0)) * uPulse * (1.0 - wave / 90.0) * 0.7;

        // Aeration cores: a twinkling dot lattice.
        vec2 cellId = floor(vWorld.xz * 0.7);
        float dotMask = smoothstep(0.11, 0.05, length(fract(vWorld.xz * 0.7) - 0.5));
        glow += uGold * dotMask * uAerate * (0.55 + 0.45 * sin(uTime * 3.0 + hash(cellId) * 6.28)) * 1.4;

        // Gold edging along the driveway.
        glow += uGold * smoothstep(0.18, 0.0, abs(pathDistance - 2.0)) * uGravel * 0.7;

        color = applyFog(color + glow, vDepth);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
    }
`;

export class Terrain {
    /**
     * @param {Record<string, THREE.IUniform>} uniforms shared uniforms
     * @param {{ segments: number }} quality
     */
    constructor(uniforms, { segments }) {
        this.geometry = new THREE.PlaneGeometry(180, 180, segments, segments);
        this.geometry.rotateX(-Math.PI / 2);

        this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.z = -30;
        this.mesh.frustumCulled = false;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
