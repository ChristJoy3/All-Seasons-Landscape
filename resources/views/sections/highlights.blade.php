{{-- Why choose us: only the claims the client's site makes. Parallax by resources/js/animations/highlights.js --}}
<section id="why" class="relative overflow-clip px-5 py-[20vh] md:px-10" data-section="why">
    <div class="mx-auto max-w-[1440px]">
        <div class="mb-20 max-w-3xl">
            <p class="eyebrow mb-8" data-reveal>Why All Seasons</p>
            <h2 class="display text-[clamp(2.4rem,5.6vw,5.6rem)]" data-split>
                Quality you can see. <span class="text-green-soft">Pricing that makes sense.</span>
            </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
            @foreach (config('site.highlights') as $index => $highlight)
                <article class="highlight-card glass group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-8 md:p-10" data-highlight data-speed="{{ [0.06, -0.04, 0.1][$index] }}">
                    <div class="absolute -top-24 -right-24 size-56 rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-50 {{ ['bg-gold', 'bg-green', 'bg-ember'][$index] }}" aria-hidden="true"></div>

                    <span class="font-display text-sm text-bone/40 tabular-nums">0{{ $index + 1 }}</span>
                    <div class="relative">
                        <p class="display text-[clamp(3.4rem,6vw,6rem)] {{ ['text-gold', 'text-green-soft', 'text-ember'][$index] }}">{{ $highlight['value'] }}</p>
                        <h3 class="mt-3 font-display text-xl font-semibold">{{ $highlight['label'] }}</h3>
                        <p class="mt-3 leading-relaxed text-bone/65">{{ $highlight['copy'] }}</p>
                    </div>
                </article>
            @endforeach
        </div>
    </div>

    {{-- Parallax maple-leaf silhouettes (decorative; same outline as the 3D leaves in scene/objects/Leaves.js) --}}
    @foreach ([['top-[12%] left-[4%] size-24 text-ember/30', -0.3], ['top-[40%] right-[6%] size-36 text-gold/20', 0.25], ['bottom-[8%] left-[38%] size-16 text-green/40', -0.5]] as [$classes, $speed])
        <svg class="parallax-leaf pointer-events-none absolute {{ $classes }}" data-parallax="{{ $speed }}" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
            <path d="M51.4 98.0 L51.9 74.0 L76.4 82.6 L70.2 64.4 L97.0 52.4 L76.4 46.2 L87.4 26.0 L65.4 34.6 L64.4 12.6 L55.8 25.0 L50.0 2.0 L44.2 25.0 L35.6 12.6 L34.6 34.6 L12.6 26.0 L23.6 46.2 L3.0 52.4 L29.8 64.4 L23.6 82.6 L48.1 74.0 L48.6 98.0 Z"/>
        </svg>
    @endforeach
</section>
