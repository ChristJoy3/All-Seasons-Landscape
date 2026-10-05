import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Sticky navbar: hides on scroll down, shows on scroll up, gains a frosted
 * background after leaving the hero. Also drives the mobile menu.
 *
 * @param {import('lenis').default | null} lenis
 */
export function initNavbar(lenis) {
    const nav = document.querySelector('[data-nav]');
    if (!nav) return;

    let lastY = window.scrollY;
    const threshold = 6;

    const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastY;

        nav.classList.toggle('is-scrolled', y > 40);

        if (Math.abs(delta) > threshold) {
            const hide = delta > 0 && y > window.innerHeight * 0.4 && !nav.classList.contains('menu-open');
            nav.classList.toggle('is-hidden', hide);
            lastY = y;
        }
    };

    if (lenis) {
        lenis.on('scroll', onScroll);
    } else {
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Show the nav whenever keyboard focus lands inside it.
    nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

    initMobileMenu(nav, lenis);
}

function initMobileMenu(nav, lenis) {
    const toggle = nav.querySelector('[data-menu-toggle]');
    const menu = nav.querySelector('[data-menu]');
    if (!toggle || !menu) return;

    const [lineTop, lineBottom] = toggle.querySelectorAll('.menu-line');

    const firstLink = menu.querySelector('a');

    const setOpen = (open) => {
        nav.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
        menu.classList.toggle('invisible', !open);
        menu.classList.toggle('opacity-0', !open);
        lineTop.style.transform = open ? 'translateY(5.5px) rotate(45deg)' : '';
        lineBottom.style.transform = open ? 'translateY(-5.5px) rotate(-45deg)' : '';
        open ? lenis?.stop() : lenis?.start();
        if (open) firstLink?.focus({ preventScroll: true });
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('menu-open')));
    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('menu-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

/**
 * Highlight the nav link for the section in view (gold + aria-current).
 * Call after pinned sections exist so the trigger ranges include pin spacing.
 */
export function initNavActive() {
    document.querySelectorAll('[data-nav] ul a[href^="#"]').forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;

        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: ({ isActive }) => {
                link.classList.toggle('text-gold', isActive);
                isActive ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current');
            },
        });
    });
}
