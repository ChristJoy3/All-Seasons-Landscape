import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Hero intro: split-text headline + staggered fades, played after the preloader.
 *
 * @param {{ reducedMotion: boolean }} options
 * @returns {gsap.core.Timeline | null}
 */
export function playHeroIntro({ reducedMotion }) {
    const title = document.querySelector('[data-hero-title]');
    const fades = gsap.utils.toArray('[data-hero-fade]');
    if (!title || reducedMotion) return null;

    const split = SplitText.create(title, { type: 'words,chars,lines', mask: 'lines', linesClass: 'split-line' });

    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
        .from(split.chars, { yPercent: 120, rotate: 6, duration: 1.4, stagger: 0.018 })
        .from(fades, { autoAlpha: 0, y: 30, duration: 1.2, stagger: 0.1 }, '-=1');

    // Looping scroll cue
    gsap.fromTo('.scroll-cue', { yPercent: -100 }, { yPercent: 200, duration: 1.8, ease: 'power2.inOut', repeat: -1 });

    return intro;
}

/**
 * As the hero scrolls away its content lifts and fades, handing focus to the 3D camera move.
 *
 * @param {{ reducedMotion: boolean }} options
 */
export function initHeroScroll({ reducedMotion }) {
    const hero = document.querySelector('[data-section="hero"]');
    if (!hero || reducedMotion) return;

    gsap.to(hero.children, {
        yPercent: -18,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 15%', scrub: true },
    });
}
