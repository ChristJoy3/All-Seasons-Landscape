{{-- About: the camera rises into an aerial view while these lines reveal (resources/js/animations/about.js) --}}
<section id="about" class="relative px-5 py-[22vh] md:px-10" data-section="about">
    <div class="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-12">
        <div class="lg:col-span-7">
            <p class="eyebrow mb-8" data-reveal>About us</p>
            <h2 class="display text-[clamp(2.6rem,6.4vw,6.5rem)]" data-split>
                More than ordinary landscapers.
            </h2>
        </div>

        <div class="flex flex-col justify-end gap-8 lg:col-span-5 lg:pb-4">
            <p class="text-xl leading-relaxed text-bone/80 md:text-2xl" data-split="lines">
                {{ config('site.name') }} has been caring for properties in the Eugene, Oregon area for over 20 years.
            </p>
            <p class="text-lg leading-relaxed text-bone/60" data-split="lines">
                From routine lawn and grounds maintenance to full yard overhauls, we bring the same attention to every job: quality results, at an affordable price.
            </p>
        </div>
    </div>

    {{-- Floating coordinate marker that sits over the aerial terrain --}}
    <div class="mx-auto mt-24 flex max-w-[1440px] justify-end" data-reveal>
        <div class="glass flex items-center gap-6 rounded-2xl px-6 py-5" data-about-marker>
            <span class="relative flex size-3">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60"></span>
                <span class="relative inline-flex size-3 rounded-full bg-gold"></span>
            </span>
            <div>
                <p class="font-display text-3xl font-semibold text-bone">{{ config('site.years') }} <span class="text-base font-medium text-bone/60">years</span></p>
                <p class="font-display text-xs tracking-[0.25em] text-bone/50 uppercase">{{ config('site.location') }} · 44.05° N, 123.09° W</p>
            </div>
        </div>
    </div>
</section>
