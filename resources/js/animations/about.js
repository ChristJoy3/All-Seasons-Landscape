import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * About: while the camera rises into the aerial view, the headline drifts against the
 * scroll and the "20+ years" marker floats up as if pinned to the terrain below.
 *
 * @param {{ reducedMotion: boolean }} env
 */
export function initAbout({ reducedMotion }) {
    const section = document.querySelector('[data-section="about"]');
    if (!section || reducedMotion) return;

    const scrub = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true };

    gsap.fromTo(section.querySelector('h2'), { y: 80 }, { y: -80, ease: 'none', scrollTrigger: scrub });
    gsap.fromTo('[data-about-marker]', { y: 160, scale: 0.9 }, { y: -60, scale: 1, ease: 'none', scrollTrigger: { ...scrub } });
}
