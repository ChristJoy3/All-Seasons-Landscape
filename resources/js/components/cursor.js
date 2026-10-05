import { gsap } from 'gsap';

/**
 * Custom cursor: a gold dot plus a trailing ring. Grows over interactive
 * elements and shows a "View" label over gallery photos.
 * Only initialised for fine pointers (never on touch devices).
 */
export function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    document.documentElement.classList.add('has-cursor');

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    const label = cursor.querySelector('.cursor-label');

    // quickTo gives smooth, interruptible following without per-frame allocations.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo([ring, label], 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo([ring, label], 'y', { duration: 0.5, ease: 'power3.out' });

    gsap.set(cursor, { opacity: 0 });

    window.addEventListener(
        'pointermove',
        (event) => {
            if (event.pointerType !== 'mouse') return;
            gsap.to(cursor, { opacity: 1, duration: 0.3, overwrite: 'auto' });
            dotX(event.clientX);
            dotY(event.clientY);
            ringX(event.clientX);
            ringY(event.clientY);
        },
        { passive: true },
    );

    document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));

    document.addEventListener('pointerover', (event) => {
        const view = event.target.closest('[data-cursor="view"]');
        const interactive = event.target.closest('a, button, [data-magnetic]');
        cursor.classList.toggle('is-view', Boolean(view));
        cursor.classList.toggle('is-hover', Boolean(interactive) && !view);
    });
}
