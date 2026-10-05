/**
 * Scene state: plain numbers that GSAP tweens and Experience copies into uniforms
 * every frame. Each section of the page has a preset; scroll animations blend between them.
 *
 * Camera: cam* = position, look* = target.
 * season: 0 spring green -> 1 summer gold -> 2 autumn ember.
 */
export const defaultState = {
    camX: 0,
    camY: 1.5,
    camZ: 13,
    lookX: 0,
    lookY: 1.1,
    lookZ: 0,

    season: 0,
    contour: 0.25,
    pulse: 0,
    morph: 1,

    wind: 1,
    grassHeight: 1,
    trim: 0,
    growth: 1,
    sod: 1,

    aerate: 0,
    tintAmount: 0,
    tintProgress: 0,
    tintMix: 0,
    gravel: 0,

    leafAmount: 0.3,
    sweep: 0,
    vortex: 0,
    motes: 1,
};

/** Where the scene should be when each section is in view. */
export const presets = {
    // Low in the lawn at dusk.
    hero: { ...defaultState },

    // Rise into an aerial "site plan" view: contours and the scanning pulse light up.
    about: {
        camX: 0,
        camY: 24,
        camZ: 16,
        lookX: 0,
        lookY: 0,
        lookZ: -12,
        season: 0.25,
        contour: 1,
        pulse: 1,
        leafAmount: 0.15,
    },

    // Mid-height three-quarter view over the lawn for the service beats.
    services: {
        camX: -7,
        camY: 5,
        camZ: 11,
        lookX: 0,
        lookY: 0.6,
        lookZ: -3,
        season: 0.5,
        contour: 0.45,
        pulse: 0,
        leafAmount: 0.25,
    },

    // Summer gold, low and wide, more leaves and motes for parallax depth.
    why: {
        camX: 8,
        camY: 2.6,
        camZ: 7,
        lookX: -2,
        lookY: 1.4,
        lookZ: -8,
        season: 1.2,
        contour: 0.35,
        leafAmount: 0.6,
        sweep: 0,
    },

    // Pull far back over the hills behind the gallery cards.
    gallery: {
        camX: 0,
        camY: 10,
        camZ: 28,
        lookX: 0,
        lookY: 1.5,
        lookZ: -22,
        season: 1.6,
        contour: 0.6,
        leafAmount: 0.45,
    },

    // Autumn finale: leaves gather into a vortex behind the call-to-action.
    // (see exitOverrides below for how services hands over to the next section)
    contact: {
        camX: 0,
        camY: 3.2,
        camZ: 10,
        lookX: 0,
        lookY: 3.2,
        lookZ: 0,
        season: 2,
        contour: 0.5,
        leafAmount: 1,
        vortex: 1,
    },
};

/**
 * Where a section leaves the scene when it ends, if that differs from its preset.
 * The pinned services sequence orbits the camera, warms the season to gold and
 * blows the leaves away, so the next transition starts from there.
 */
export const exitOverrides = {
    services: {
        camX: 7,
        camZ: 9,
        season: 1,
        sweep: 1,
        leafAmount: 0.8,
    },
};
