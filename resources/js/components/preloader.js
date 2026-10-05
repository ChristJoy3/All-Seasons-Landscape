import { gsap } from 'gsap';

/**
 * Preloader: shows real progress for the tasks passed in (3D scene setup,
 * fonts, above-the-fold images), then reveals the page.
 *
 * @param {Array<Promise<unknown>>} tasks
 * @param {{ reducedMotion: boolean }} options
 * @returns {Promise<void>} resolves once the preloader has started leaving
 */
export async function runPreloader(tasks, { reducedMotion }) {
    const root = document.getElementById('preloader');
    if (!root) {
        await Promise.allSettled(tasks);
        return;
    }

    const bar = root.querySelector('.preloader-bar');
    const count = root.querySelector('.preloader-count');
    const logo = root.querySelector('.preloader-logo');

    gsap.from(logo, { autoAlpha: 0, y: 20, scale: 0.96, duration: 1.2, ease: 'expo.out' });

    // Displayed progress eases toward the real progress so it never jumps.
    const progress = { real: 0, shown: 0 };
    let done = 0;
    tasks.forEach((task) =>
        Promise.resolve(task)
            .catch(() => {})
            .finally(() => {
                done += 1;
                progress.real = done / tasks.length;
            }),
    );

    const tick = () => {
        progress.shown += (progress.real - progress.shown) * 0.12;
        if (progress.real === 1 && progress.shown > 0.995) progress.shown = 1;
        gsap.set(bar, { scaleX: progress.shown });
        count.textContent = String(Math.round(progress.shown * 100));
    };
    gsap.ticker.add(tick);

    // Minimum display time so the brand moment registers, without being slow.
    const minimum = new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : 1200));
    await Promise.allSettled([...tasks, minimum]);

    await new Promise((resolve) => {
        const wait = () => (progress.shown >= 1 ? resolve() : requestAnimationFrame(wait));
        wait();
    });
    gsap.ticker.remove(tick);

    const exit = gsap.timeline({ onComplete: () => root.remove() });
    exit.to(root.firstElementChild, { autoAlpha: 0, y: -24, duration: 0.6, ease: 'power2.in' }).to(
        root,
        { clipPath: 'inset(0 0 100% 0)', duration: reducedMotion ? 0.01 : 1.1, ease: 'expo.inOut' },
        '-=0.1',
    );
    root.setAttribute('aria-hidden', 'true');

    // Resolve as the curtain starts lifting so the hero intro overlaps it.
    await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : 700));
}
