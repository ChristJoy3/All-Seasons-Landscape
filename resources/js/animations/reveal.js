import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Generic scroll reveals used across sections:
 *  - [data-split]          headline split into words that rise out of line masks
 *  - [data-split="lines"]  paragraph revealed line by line
 *  - [data-reveal]         simple fade + rise
 * The hero title is skipped here; hero.js plays it after the preloader.
 *
 * @param {{ reducedMotion: boolean }} options
 */
export function initReveals({ reducedMotion }) {
    if (reducedMotion) return;

    document.querySelectorAll('[data-split]:not([data-hero-title])').forEach((element) => {
        const byLines = element.dataset.split === 'lines';

        SplitText.create(element, {
            type: byLines ? 'lines' : 'words,lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
                gsap.from(byLines ? self.lines : self.words, {
                    yPercent: 110,
                    rotate: byLines ? 0 : 4,
                    duration: byLines ? 1.1 : 1.2,
                    ease: 'expo.out',
                    stagger: byLines ? 0.1 : 0.05,
                    scrollTrigger: { trigger: element, start: 'top 85%', once: true },
                }),
        });
    });

    gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(
            element,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            },
        );
    });
}
