/**
 * Entry point: smooth scroll + GSAP setup, then initialise every module.
 * Each module lives in its own folder so this file stays an orchestration layer:
 *   components/  navbar, preloader, cursor, magnetic buttons, smooth scroll
 *   animations/  ScrollTrigger timelines per section
 *   scene/       Three.js scene (one persistent canvas, procedural world, .glb hook)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { env } from './config/palette';
import { initSmoothScroll } from './components/smoothScroll';
import { runPreloader } from './components/preloader';
import { initNavActive, initNavbar } from './components/navbar';
import { initCursor } from './components/cursor';
import { initMagnetic } from './components/magnetic';
import { initReveals } from './animations/reveal';
import { initHeroScroll, playHeroIntro } from './animations/hero';
import { initAbout } from './animations/about';
import { initServices } from './animations/services';
import { initHighlights } from './animations/highlights';
import { initGallery } from './animations/gallery';
import { initSceneScroll, playSceneIntro } from './animations/sceneScroll';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });
// Mobile browsers resize the viewport as the address bar shows/hides; don't recalculate for that.
ScrollTrigger.config({ ignoreMobileResize: true });

// Always start at the top so scroll-driven scenes initialise in their first state.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

async function boot() {
    const lenis = initSmoothScroll(env);
    lenis?.stop();

    initNavbar(lenis);
    if (env.finePointer && !env.reducedMotion) {
        initCursor();
        initMagnetic();
    }

    // Three.js + the scene load as a separate chunk, in parallel with the preloader.
    let experience = null;
    const sceneReady = import('./scene/Experience')
        .then(({ Experience }) => {
            experience = new Experience(document.getElementById('webgl'), env);
            return experience.init();
        })
        .catch((error) => {
            // No WebGL (or it failed): keep the page fully usable over a CSS backdrop.
            console.warn('3D scene unavailable, using static backdrop.', error);
            document.documentElement.classList.add('no-webgl');
            experience?.destroy();
        });

    // Everything the first screen needs before it is revealed.
    const tasks = [sceneReady, document.fonts.ready, waitForImage(document.querySelector('[data-nav] img'))];

    await runPreloader(tasks, env);
    const sceneLoaded = !document.documentElement.classList.contains('no-webgl');

    const scene = sceneLoaded ? experience : null;

    // Pinned sections first (they add scroll distance), then everything that depends on positions.
    initServices(env);
    initGallery(env);
    initHeroScroll(env);
    initAbout(env);
    initHighlights(env);
    initReveals(env);
    if (scene) initSceneScroll(scene);
    initNavActive();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    playHeroIntro(env);
    if (scene && !env.reducedMotion) playSceneIntro(scene);
    lenis?.start();

    // Recalculate trigger positions once late content (lazy images, fonts) settles.
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

/** Resolves when an <img> has loaded (or failed), so the preloader never hangs. */
function waitForImage(image) {
    if (!image || image.complete) return Promise.resolve();
    return new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
    });
}

boot();
