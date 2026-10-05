import * as THREE from 'three';
import { gsap } from 'gsap';

import { palette } from '../config/palette';
import { defaultState } from './presets';
import { Terrain } from './objects/Terrain';
import { Grass } from './objects/Grass';
import { Leaves } from './objects/Leaves';
import { Atmosphere } from './objects/Atmosphere';

/** Quality tiers. Mobile gets roughly 30% of the geometry and a lower pixel-ratio cap. */
const QUALITY = {
    desktop: { grass: 52000, leaves: 900, motes: 1400, segments: 256, maxPixelRatio: 2 },
    mobile: { grass: 14000, leaves: 280, motes: 400, segments: 120, maxPixelRatio: 1.5 },
};

/** state key -> uniform name */
const STATE_UNIFORMS = {
    season: 'uSeason',
    contour: 'uContour',
    pulse: 'uPulse',
    morph: 'uMorph',
    wind: 'uWind',
    grassHeight: 'uGrassHeight',
    trim: 'uTrim',
    growth: 'uGrowth',
    sod: 'uSod',
    aerate: 'uAerate',
    tintAmount: 'uTintAmount',
    tintProgress: 'uTintProgress',
    tintMix: 'uTintMix',
    gravel: 'uGravel',
    leafAmount: 'uLeafAmount',
    sweep: 'uSweep',
    vortex: 'uVortex',
    motes: 'uMotes',
};

/**
 * The single persistent WebGL scene behind the page.
 * Scroll animations tween `experience.state` (the target, no lag); every frame the
 * displayed `view` eases toward it and is copied into the shared uniforms. Keeping all
 * smoothing here gives the whole scene one consistent, frame-rate independent glide.
 */
export class Experience {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {{ isMobile: boolean, reducedMotion: boolean }} env
     */
    constructor(canvas, { isMobile, reducedMotion }) {
        this.canvas = canvas;
        this.reducedMotion = reducedMotion;
        // ?quality=mobile|desktop forces a tier (handy for testing on any device).
        const forced = new URLSearchParams(window.location.search).get('quality');
        this.quality = QUALITY[forced in QUALITY ? forced : isMobile ? 'mobile' : 'desktop'];
        this.state = { ...defaultState };
        this.view = { ...defaultState };
        /** Camera offset used only by the intro dolly, kept apart from scroll-driven state. */
        this.intro = { y: 0, z: 0 };

        this.elapsed = reducedMotion ? 12 : 0;
        this.isVisible = !document.hidden;
        this.pointer = new THREE.Vector2();
        this.pointerSmooth = new THREE.Vector2();
        this.mouseWorld = new THREE.Vector3(0, 0, 999);
        this.mouseTarget = new THREE.Vector3();
        this.hasPointer = false;

        this.tick = this.tick.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onVisibility = this.onVisibility.bind(this);
    }

    /** Build everything and pre-compile shaders. Resolves when the first frame is ready. */
    async init() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: window.devicePixelRatio < 2,
            powerPreference: 'high-performance',
        });
        this.pixelRatio = Math.min(window.devicePixelRatio, this.quality.maxPixelRatio);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight, false);
        this.renderer.setClearColor(palette.ink);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.fovFor(window.innerWidth / window.innerHeight), window.innerWidth / window.innerHeight, 0.1, 400);
        this.lookTarget = new THREE.Vector3();

        this.createUniforms();

        this.terrain = new Terrain(this.uniforms, this.quality);
        this.grass = new Grass(this.uniforms, { count: this.quality.grass });
        this.leaves = new Leaves(this.uniforms, { count: this.quality.leaves });
        this.atmosphere = new Atmosphere(this.uniforms, this.quality);
        this.scene.add(this.atmosphere.group, this.terrain.mesh, this.grass.mesh, this.leaves.mesh);

        // Ray from the pointer onto the ground plane, so the grass can part around it.
        this.raycaster = new THREE.Raycaster();
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        this.syncUniforms();
        this.updateCamera(1);
        await this.renderer.compileAsync(this.scene, this.camera);
        this.renderer.render(this.scene, this.camera);

        window.addEventListener('resize', this.onResize);
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
        document.addEventListener('visibilitychange', this.onVisibility);
        gsap.ticker.add(this.tick);
    }

    createUniforms() {
        const color = (hex) => new THREE.Color(hex);
        this.seasonColors = [color(palette.green), color(palette.gold), color(palette.ember)];
        this.inkColor = color(palette.ink2);

        this.uniforms = {
            uTime: { value: this.elapsed },
            uGreen: { value: this.seasonColors[0] },
            uGold: { value: this.seasonColors[1] },
            uEmber: { value: this.seasonColors[2] },
            uInk: { value: this.inkColor },
            uFogColor: { value: new THREE.Color() },
            uFogNear: { value: 14 },
            uFogFar: { value: 80 },
            uMouse: { value: this.mouseWorld },
            uVortexCenter: { value: new THREE.Vector3(...this.vortexFor(window.innerWidth / window.innerHeight)) },
            uPixelRatio: { value: this.pixelRatio },
        };
        Object.values(STATE_UNIFORMS).forEach((name) => (this.uniforms[name] = { value: 0 }));
    }

    /** Copy tweened state into uniforms and derive the fog colour from the season. */
    syncUniforms() {
        for (const [key, name] of Object.entries(STATE_UNIFORMS)) this.uniforms[name].value = this.view[key];

        const s = THREE.MathUtils.clamp(this.view.season, 0, 2);
        const [green, gold, ember] = this.seasonColors;
        const accent = s < 1 ? green.clone().lerp(gold, s) : gold.clone().lerp(ember, s - 1);
        this.uniforms.uFogColor.value.copy(this.inkColor).lerp(accent, 0.05);
    }

    /** Ease the displayed state toward the scroll-driven target. */
    easeView(delta) {
        const k = this.reducedMotion ? 1 : 1 - Math.exp(-delta * 3.2);
        for (const key in this.state) this.view[key] += (this.state[key] - this.view[key]) * k;
    }

    updateCamera(smoothing) {
        const s = this.view;
        this.pointerSmooth.lerp(this.pointer, smoothing);

        // Subtle mouse parallax on top of the scroll-driven camera.
        this.camera.position.set(
            s.camX + this.pointerSmooth.x * 0.7,
            s.camY + this.pointerSmooth.y * 0.35 + this.intro.y,
            s.camZ + this.intro.z,
        );
        this.lookTarget.set(s.lookX + this.pointerSmooth.x * 0.25, s.lookY + this.pointerSmooth.y * 0.12, s.lookZ);
        this.camera.lookAt(this.lookTarget);
    }

    updateMouseWorld(smoothing) {
        const target = this.mouseTarget.set(0, 0, 999);
        if (this.hasPointer) {
            this.raycaster.setFromCamera(this.pointer, this.camera);
            this.raycaster.ray.intersectPlane(this.groundPlane, target);
        }
        this.mouseWorld.lerp(target, target.z === 999 ? 1 : smoothing);
    }

    /** GSAP ticker callback: (time in s, delta in ms). */
    tick(time, deltaMs) {
        if (!this.isVisible) return;

        const delta = Math.min(deltaMs, 50) / 1000;
        if (!this.reducedMotion) this.elapsed += delta;
        this.uniforms.uTime.value = this.elapsed;

        // Frame-rate independent smoothing.
        const smoothing = 1 - Math.pow(0.001, delta);

        this.easeView(delta);
        this.syncUniforms();
        this.updateCamera(this.reducedMotion ? 1 : smoothing * 0.6);
        this.updateMouseWorld(smoothing);
        this.atmosphere.follow(this.camera);

        this.renderer.render(this.scene, this.camera);
        this.adaptQuality(deltaMs);
    }

    /** If the device cannot hold ~50fps, step the pixel ratio down (never up) to protect smoothness. */
    adaptQuality(deltaMs) {
        this.frameSamples = (this.frameSamples || 0) + 1;
        this.frameTotal = (this.frameTotal || 0) + deltaMs;
        if (this.frameSamples < 90) return;

        const average = this.frameTotal / this.frameSamples;
        this.frameSamples = 0;
        this.frameTotal = 0;

        if (average > 20 && this.pixelRatio > 1) {
            this.pixelRatio = Math.max(1, this.pixelRatio - 0.25);
            this.renderer.setPixelRatio(this.pixelRatio);
            this.uniforms.uPixelRatio.value = this.pixelRatio;
        }
    }

    /** Portrait screens: drop the contact vortex behind the glass cards so it never covers the headline. */
    vortexFor(aspect) {
        return aspect < 1 ? [0.5, 0.8, -1] : [3.5, 3.4, 0];
    }

    fovFor(aspect) {
        // Portrait screens need a wider field of view to keep the scene readable.
        return aspect < 1 ? 62 : 45;
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.fov = this.fovFor(this.camera.aspect);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.uniforms.uVortexCenter.value.set(...this.vortexFor(this.camera.aspect));
    }

    onPointerMove(event) {
        if (event.pointerType !== 'mouse') return;
        this.hasPointer = true;
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    }

    /** Stop rendering while the tab is hidden. */
    onVisibility() {
        this.isVisible = !document.hidden;
    }

    destroy() {
        gsap.ticker.remove(this.tick);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('visibilitychange', this.onVisibility);

        [this.terrain, this.grass, this.leaves, this.atmosphere].forEach((object) => object?.dispose());
        this.renderer?.dispose();
    }
}
