import { gsap } from 'gsap';

/**
 * Magnetic hover: elements with [data-magnetic] lean toward the pointer.
 * The attribute value sets the strength (default 0.35).
 */
export function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach((element) => {
        const strength = parseFloat(element.dataset.magnetic) || 0.35;
        const moveX = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'power3.out' });
        const moveY = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'power3.out' });

        element.addEventListener('pointermove', (event) => {
            if (event.pointerType !== 'mouse') return;
            const rect = element.getBoundingClientRect();
            moveX((event.clientX - rect.left - rect.width / 2) * strength);
            moveY((event.clientY - rect.top - rect.height / 2) * strength);
        });

        element.addEventListener('pointerleave', () => {
            gsap.to(element, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
        });
    });
}
