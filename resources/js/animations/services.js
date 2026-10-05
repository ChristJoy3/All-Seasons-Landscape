import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Scroll distance per service while pinned, as a fraction of the viewport height. */
export const SERVICE_SLOT = 0.75;

/**
 * 3D beat for each service, keyed by data-scene (played by the master scene timeline in sceneScroll.js). Each beat is a list of explicit
 * [prop, from, to, start, end] segments in timeline units (service i occupies i..i+1).
 * Explicit from-values keep the scene deterministic however fast or far the user scrolls.
 */
export const BEATS = {
    aerate: [
        ['aerate', 0, 1, 0.1, 0.4],
        ['contour', 0.45, 0.15, 0.1, 0.4],
        ['aerate', 1, 0, 0.8, 1],
        ['contour', 0.15, 0.45, 0.8, 1],
    ],
    trim: [
        ['trim', 0, 1, 1.1, 1.5],
        ['wind', 1, 0.25, 1.1, 1.5],
    ],
    mulch: [
        ['trim', 1, 0, 2, 2.5],
        ['wind', 0.25, 1, 2, 2.5],
        ['tintAmount', 0, 1, 2, 2.2],
        ['tintProgress', 0, 1, 2, 2.85],
    ],
    topdress: [['tintMix', 0, 1, 3, 3.6]],
    overseed: [
        ['tintAmount', 1, 0, 3.85, 4.15],
        ['growth', 1, 0, 3.95, 4.2],
        ['growth', 0, 1, 4.3, 4.95],
    ],
    cleanup: [
        ['season', 0.5, 1, 4.8, 5.3],
        ['leafAmount', 0.25, 0.9, 5, 5.4],
        ['sweep', 0, 1, 5.45, 5.95],
    ],
    sod: [
        ['leafAmount', 0.9, 0, 6, 6.08],
        ['sweep', 1, 0, 6.1, 6.12],
        ['sod', 1, 0, 6, 6.12],
        ['sod', 0, 1, 6.2, 6.9],
        ['leafAmount', 0, 0.25, 6.3, 6.8],
    ],
    gravel: [
        ['gravel', 0, 1, 7.1, 7.5],
        ['camY', 5, 3, 7, 7.5],
        ['gravel', 1, 0, 7.85, 8.05],
        ['camY', 3, 5, 7.9, 8.2],
    ],
    overhaul: [
        ['morph', 1, 1.9, 8.1, 8.5],
        ['pulse', 0, 1, 8.1, 8.3],
        ['morph', 1.9, 1, 8.6, 8.95],
        ['pulse', 1, 0, 8.8, 9],
    ],
    haul: [
        ['leafAmount', 0.25, 0.8, 9, 9.2],
        ['sweep', 0, 1, 9.3, 9.9],
    ],
};

/**
 * Pinned services sequence: each service slides in with a 3D tilt while the scene plays
 * its beat (aerating dots, a trimmed lawn, a mulch sweep, regrowth, leaves blown away...).
 * Without JS or with reduced motion, the services stay a readable stacked list.
 *
 * @param {{ reducedMotion: boolean }} env
 */
export function initServices({ reducedMotion }) {
    const section = document.querySelector('[data-section="services"]');
    const pin = section?.querySelector('[data-services-pin]');
    const items = gsap.utils.toArray('[data-service]', section);
    if (!pin || !items.length || reducedMotion) return;

    section.classList.add('services-enhanced');

    const hud = {
        current: section.querySelector('.services-current'),
        group: section.querySelector('.services-group-label'),
        progress: section.querySelector('.services-progress'),
        index: gsap.utils.toArray('.services-index-item', section),
    };

    const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: () => `+=${items.length * window.innerHeight * SERVICE_SLOT}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateHud(hud, items, self.progress),
        },
    });

    // Card transitions: in over the first quarter of each slot, out over the last.
    // Opacity only (not visibility), so screen readers can still read every service.
    items.forEach((item, i) => {
        const parts = item.querySelectorAll('.service-num, .service-name, .service-copy');

        if (i > 0) {
            timeline.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.15 }, i);
            timeline.fromTo(
                parts,
                { yPercent: 60, rotateX: -35, opacity: 0 },
                { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' },
                i,
            );
        }
        if (i < items.length - 1) {
            timeline.to(parts, { yPercent: -50, rotateX: 30, opacity: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in' }, i + 0.75);
            timeline.to(item, { opacity: 0, duration: 0.1 }, i + 0.92);
        }
    });

    // Keep the timeline exactly `items.length` units long (one unit per service).
    timeline.set({}, {}, items.length);

    updateHud(hud, items, 0);
}

let lastIndex = -1;

function updateHud(hud, items, progress) {
    hud.progress && gsap.set(hud.progress, { scaleX: progress });

    const index = Math.min(items.length - 1, Math.floor(progress * items.length));
    if (index === lastIndex) return;
    lastIndex = index;

    if (hud.current) hud.current.textContent = String(index + 1).padStart(2, '0');
    if (hud.group) hud.group.textContent = items[index].dataset.group;
    hud.index.forEach((entry, i) => {
        entry.classList.toggle('text-bone', i === index);
        entry.classList.toggle('text-bone/35', i !== index);
    });
}
