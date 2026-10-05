import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal gallery: the section pins and vertical scroll moves the track sideways.
 * Each card tilts in 3D as it crosses the viewport and its photo parallaxes inside the frame.
 * Without JS / with reduced motion the track is a native horizontal scroller.
 *
 * @param {{ reducedMotion: boolean }} env
 */
export function initGallery({ reducedMotion }) {
    const section = document.querySelector('[data-section="gallery"]');
    const pin = section?.querySelector('[data-gallery-pin]');
    const viewport = section?.querySelector('[data-gallery-viewport]');
    const track = section?.querySelector('[data-gallery-track]');
    if (!pin || !track || reducedMotion) return;

    viewport.classList.replace('overflow-x-auto', 'overflow-x-clip');

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const scroller = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
        },
    });

    gsap.utils.toArray('[data-gallery-card]', track).forEach((card) => {
        const figure = card.querySelector('figure');
        const image = card.querySelector('img');

        // Cards swing in from the right, face the viewer at centre, and swing out to the left.
        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                containerAnimation: scroller,
                start: 'left right',
                end: 'right left',
                scrub: true,
            },
        })
            .fromTo(figure, { rotateY: -16, z: -90, transformPerspective: 1200 }, { rotateY: 0, z: 0, ease: 'power2.out' })
            .to(figure, { rotateY: 14, z: -70, ease: 'power2.in' });

        gsap.fromTo(
            image,
            { xPercent: -6, scale: 1.18 },
            {
                xPercent: 6,
                scale: 1.18,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: scroller,
                    start: 'left right',
                    end: 'right left',
                    scrub: true,
                },
            },
        );
    });

    // Lazy photos settle late; recalculate the track length once each one loads.
    track.querySelectorAll('img[loading="lazy"]').forEach((image) => {
        if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });
}
