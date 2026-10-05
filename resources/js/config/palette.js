/**
 * Brand palette shared by the UI and the 3D scene.
 * Keep in sync with the @theme tokens in resources/css/app.css.
 */
export const palette = {
    ink: '#0a120d',
    ink2: '#101b14',
    bone: '#f4f1e6',
    green: '#3e993a',
    greenSoft: '#5fb85a',
    gold: '#e2d96b',
    ember: '#e8742a',
};

/** Environment flags evaluated once at startup. */
export const env = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    isMobile: window.matchMedia('(max-width: 767px)').matches || navigator.maxTouchPoints > 1,
};
