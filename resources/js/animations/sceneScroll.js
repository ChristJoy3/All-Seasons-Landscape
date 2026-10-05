import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { exitOverrides, presets } from '../scene/presets';
import { BEATS, SERVICE_SLOT } from './services';

gsap.registerPlugin(ScrollTrigger);

/** Section order on the page; must match the data-section attributes. */
export const SECTION_ORDER = ['hero', 'about', 'services', 'why', 'gallery', 'contact'];

/**
 * Presets are partial; resolve each one on top of the previous so every
 * transition is an explicit fromTo between two complete states.
 */
export const resolvedPresets = SECTION_ORDER.reduce((resolved, key, index) => {
    const previous = index === 0 ? {} : resolved[SECTION_ORDER[index - 1]];
    resolved[key] = { ...previous, ...presets[key] };
    return resolved;
}, {});

/**
 * Drive the 3D scene from scroll with ONE master timeline whose time is measured in
 * scroll pixels. Section transitions and the services beats all live on it, so there is
 * a single writer to the scene state and the result is identical however the user gets
 * somewhere (slow scroll, fling, anchor jump, scrolling back up).
 * The timeline is rebuilt on every ScrollTrigger refresh so positions survive resizes.
 * Easing toward the result happens in Experience.easeView.
 *
 * @param {import('../scene/Experience').Experience} experience
 */
export function initSceneScroll(experience) {
    let timeline = null;

    const rebuild = () => {
        timeline?.kill();
        timeline = buildTimeline(experience.state);
        timeline.seek(window.scrollY);
    };

    ScrollTrigger.addEventListener('refresh', rebuild);
    ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => timeline?.seek(self.scroll()),
    });
    rebuild();
}

/** Document-relative top of an element (pin spacers included). */
function topOf(element) {
    return element.getBoundingClientRect().top + window.scrollY;
}

function buildTimeline(state) {
    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } });
    const viewport = window.innerHeight;

    // While each section scrolls in (its top travelling from the bottom of the viewport to
    // the top), blend from the previous section's exit state to this section's preset.
    SECTION_ORDER.slice(1).forEach((key, index) => {
        const section = document.querySelector(`[data-section="${key}"]`);
        if (!section) return;

        const previous = SECTION_ORDER[index];
        const end = topOf(section);
        const start = Math.max(0, end - viewport);
        timeline.fromTo(
            state,
            { ...resolvedPresets[previous], ...exitOverrides[previous] },
            { ...resolvedPresets[key], duration: Math.max(1, end - start) },
            start,
        );
    });

    addServiceBeats(timeline, state, viewport);

    return timeline;
}

/** Services is pinned: one slot of SERVICE_SLOT viewports per service, each with its 3D beat. */
function addServiceBeats(timeline, state, viewport) {
    const section = document.querySelector('[data-section="services"]');
    const items = section ? [...section.querySelectorAll('[data-service]')] : [];
    if (!section?.classList.contains('services-enhanced') || !items.length) return;

    const pinStart = topOf(section);
    const unit = viewport * SERVICE_SLOT;
    const from = resolvedPresets.services;
    const to = { ...from, ...exitOverrides.services };

    // Slow camera orbit across the whole sequence, ending at the hand-off position.
    timeline.fromTo(state, { camX: from.camX, camZ: from.camZ }, { camX: to.camX, camZ: to.camZ, duration: items.length * unit }, pinStart);

    items.forEach((item) => {
        (BEATS[item.dataset.scene] ?? []).forEach(([prop, start, end, at, until]) => {
            timeline.fromTo(
                state,
                { [prop]: start },
                { [prop]: end, duration: (until - at) * unit, ease: 'power1.inOut' },
                pinStart + at * unit,
            );
        });
    });
}

/**
 * Cinematic intro after the preloader: the camera dollies in on its own offset, and the
 * grass grows in because the displayed state starts short and eases up to the target.
 *
 * @param {import('../scene/Experience').Experience} experience
 */
export function playSceneIntro(experience) {
    gsap.from(experience.intro, { y: 4, z: 9, duration: 3, ease: 'expo.out' });
    experience.view.grassHeight = 0.1;
}
