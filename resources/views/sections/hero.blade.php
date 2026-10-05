{{-- Hero: full screen over the 3D field. Animated by resources/js/animations/hero.js --}}
<section id="top" class="relative flex min-h-svh flex-col justify-end px-5 pt-32 pb-14 md:px-10 md:pb-16" data-section="hero">
    <div class="mx-auto w-full max-w-[1440px]">
        <p class="eyebrow mb-8" data-hero-fade>{{ config('site.location') }} · {{ config('site.years') }} years</p>

        <h1 class="display max-w-[14ch] text-[clamp(3.2rem,10vw,10.5rem)]" data-split data-hero-title>
            Landscapes cared for in <span class="text-gold">every season.</span>
        </h1>

        <div class="mt-10 grid items-end gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_auto]">
            <p class="max-w-xl text-lg leading-relaxed text-bone/75 md:text-xl" data-hero-fade>
                For over 20 years, {{ config('site.name') }} has kept Eugene's lawns and grounds looking their best, with quality results at an affordable price.
            </p>

            <div class="flex flex-wrap gap-3" data-hero-fade>
                <a href="#services" class="btn btn-primary" data-magnetic>
                    {{ config('site.tagline') }}
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                </a>
                <a href="{{ config('site.phone.href') }}" class="btn btn-ghost" data-magnetic>Call {{ config('site.phone.display') }}</a>
            </div>
        </div>
    </div>

    {{-- Scroll cue --}}
    <div class="pointer-events-none absolute right-5 bottom-14 hidden flex-col items-center gap-4 md:right-10 md:flex" data-hero-fade aria-hidden="true">
        <span class="font-display text-[10px] tracking-[0.4em] text-bone/50 uppercase [writing-mode:vertical-rl]">Scroll</span>
        <span class="relative h-16 w-px overflow-hidden bg-bone/15">
            <span class="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold"></span>
        </span>
    </div>
</section>
