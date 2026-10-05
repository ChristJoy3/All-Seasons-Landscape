import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so Lenis, ScrollTrigger
 * and the WebGL render loop all advance on the same frame.
 *
 * @param {{ reducedMotion: boolean }} options
 * @returns {Lenis | null}
 */
export function initSmoothScroll({ reducedMotion }) {
    if (reducedMotion) {
        initNativeAnchors();
        return null;
    }

    const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor links (navbar, CTAs, footer).
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;

        const hash = link.getAttribute('href');
        const target = hash === '#top' ? 0 : document.querySelector(hash);
        if (target === null) return;

        event.preventDefault();
        lenis.scrollTo(target, { duration: 1.6 });
        history.replaceState(null, '', hash);
    });

    return lenis;
}

/** Reduced motion: let the browser jump to anchors, but move focus for keyboard users. */
function initNativeAnchors() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        const target = link && document.querySelector(link.getAttribute('href'));
        if (target) target.setAttribute('tabindex', '-1');
    });
}
