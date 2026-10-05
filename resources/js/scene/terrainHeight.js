/**
 * CPU port of the GLSL `snoise` + `terrainHeight` in shaders/chunks.js (keep them in sync).
 * Used once at startup to give every grass blade its ground height, so the grass vertex
 * shader no longer evaluates three noise octaves per vertex, per frame.
 * Returns the height before the `uMorph` multiplier, which the shader still applies.
 */
const C = [0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439];

const mod289 = (x) => x - Math.floor(x / 289) * 289;
const permute = (x) => mod289((x * 34 + 1) * x);
const fract = (x) => x - Math.floor(x);

export function snoise(vx, vy) {
    let ix = Math.floor(vx + (vx + vy) * C[1]);
    let iy = Math.floor(vy + (vx + vy) * C[1]);
    const x0x = vx - ix + (ix + iy) * C[0];
    const x0y = vy - iy + (ix + iy) * C[0];
    const i1x = x0x > x0y ? 1 : 0;
    const i1y = x0x > x0y ? 0 : 1;
    const x1x = x0x + C[0] - i1x;
    const x1y = x0y + C[0] - i1y;
    const x2x = x0x + C[2];
    const x2y = x0y + C[2];

    ix = mod289(ix);
    iy = mod289(iy);
    const p = [0, i1y, 1].map((oy, k) => permute(permute(iy + oy) + ix + [0, i1x, 1][k]));

    const m = [
        Math.max(0.5 - (x0x * x0x + x0y * x0y), 0),
        Math.max(0.5 - (x1x * x1x + x1y * x1y), 0),
        Math.max(0.5 - (x2x * x2x + x2y * x2y), 0),
    ].map((value) => value ** 4);

    const corners = [
        [x0x, x0y],
        [x1x, x1y],
        [x2x, x2y],
    ];
    let total = 0;
    for (let k = 0; k < 3; k++) {
        const x = 2 * fract(p[k] * C[3]) - 1;
        const h = Math.abs(x) - 0.5;
        const a0 = x - Math.floor(x + 0.5);
        const falloff = m[k] * (1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h));
        total += falloff * (a0 * corners[k][0] + h * corners[k][1]);
    }
    return 130 * total;
}

/** Same as GLSL terrainHeight(p) / uMorph. */
export function terrainHeight(x, z) {
    const h = snoise(x * 0.03, z * 0.03) * 3.6 + snoise(x * 0.08 + 7.3, z * 0.08 + 7.3) * 1.1 + snoise(x * 0.21 - 3.1, z * 0.21 - 3.1) * 0.25;
    const distance = Math.hypot(x, z + 4);
    const t = Math.min(Math.max((distance - 9) / 23, 0), 1);
    const lawn = t * t * (3 - 2 * t);
    return h * (0.1 + 0.9 * lawn);
}
