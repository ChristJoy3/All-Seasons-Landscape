import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * "Why All Seasons": cards rise in with a 3D tilt, then drift at different speeds
 * (parallax layers) along with floating maple-leaf silhouettes.
 *
 * @param {{ reducedMotion: boolean }} env
 */
export function initHighlights({ reducedMotion }) {
    const section = document.querySelector('[data-section="why"]');
    if (!section || reducedMotion) return;

    const cards = gsap.utils.toArray('[data-highlight]', section);

    gsap.from(cards, {
        y: 120,
        rotateX: -25,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: '50% 100%',
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: cards[0], start: 'top 85%', once: true },
    });

    // Parallax layers: each card and leaf moves at its own rate while the section scrolls.
    cards.forEach((card) => {
        const speed = parseFloat(card.dataset.speed) || 0;
        gsap.fromTo(card, { yPercent: speed * 100 }, {
            yPercent: -speed * 100,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });

    gsap.utils.toArray('[data-parallax]', section).forEach((leaf) => {
        const speed = parseFloat(leaf.dataset.parallax) || 0;
        gsap.fromTo(leaf, { y: speed * -400, rotate: -20 }, {
            y: speed * 400,
            rotate: 40 * Math.sign(speed || 1),
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        });
    });
}
