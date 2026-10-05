/**
 * Shared GLSL chunks. Every material shares one uniforms object (see Experience.js),
 * so these declarations are identical across shaders.
 */

/** Uniforms + helpers available to every shader. */
export const common = /* glsl */ `
    uniform float uTime;
    uniform float uSeason;      // 0 = spring green, 1 = summer gold, 2 = autumn ember
    uniform float uMorph;       // terrain relief multiplier
    uniform vec3 uGreen;
    uniform vec3 uGold;
    uniform vec3 uEmber;
    uniform vec3 uInk;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    // Brand colour for the current season, blended along green -> gold -> ember.
    vec3 seasonColor(float s) {
        return s < 1.0 ? mix(uGreen, uGold, s) : mix(uGold, uEmber, clamp(s - 1.0, 0.0, 1.0));
    }

    vec3 applyFog(vec3 color, float depth) {
        return mix(color, uFogColor, smoothstep(uFogNear, uFogFar, depth));
    }

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Distance from the centre line of the winding driveway laid by the gravel beat.
    float drivewayDistance(vec2 p) {
        return abs(p.x - 2.0 - sin(p.y * 0.09) * 5.0);
    }
`;

/**
 * 2D simplex noise (Ashima Arts, MIT) + the terrain height function.
 * Grass uses a CPU port of this (scene/terrainHeight.js) so every blade sits on the ground;
 * keep the two in sync.
 */
export const terrain = /* glsl */ `
    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    // Rolling Willamette-valley hills, flattened into a lawn around the hero camera.
    float terrainHeight(vec2 p) {
        float h = snoise(p * 0.03) * 3.6 + snoise(p * 0.08 + 7.3) * 1.1 + snoise(p * 0.21 - 3.1) * 0.25;
        float lawn = smoothstep(9.0, 32.0, length(p - vec2(0.0, -4.0)));
        return h * mix(0.1, 1.0, lawn) * uMorph;
    }
`;
