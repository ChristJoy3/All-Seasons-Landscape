{{--
    Gallery: horizontal scroll driven by vertical scroll (pinned) with 3D tilt per card.
    Falls back to native horizontal overflow scrolling without JS / with reduced motion.
    Animated by resources/js/animations/gallery.js
--}}
<section id="gallery" class="relative" data-section="gallery">
    <div class="gallery-pin flex min-h-svh flex-col justify-center gap-12 py-24" data-gallery-pin>
        <div class="mx-auto flex w-full max-w-[1440px] flex-wrap items-end justify-between gap-6 px-5 md:px-10">
            <div>
                <p class="eyebrow mb-6" data-reveal>Our work</p>
                <h2 class="display text-[clamp(2.4rem,5.6vw,5.6rem)]" data-split>Recent projects.</h2>
            </div>
            <p class="max-w-sm text-bone/60" data-reveal>A look at lawns and grounds we care for around Eugene.</p>
        </div>

        <div class="gallery-viewport overflow-x-auto overscroll-x-contain" data-gallery-viewport>
            <ul class="gallery-track flex w-max gap-5 px-5 md:gap-8 md:px-10" data-gallery-track>
                @foreach (config('site.gallery') as $index => $photo)
                    @php([$width, $height] = getimagesize(public_path('images/gallery/'.$photo['file'])))
                    <li class="gallery-card shrink-0" data-gallery-card>
                        <figure class="group relative h-[58svh] max-h-[640px] min-h-[340px] overflow-hidden rounded-3xl bg-ink-3" data-cursor="view" style="aspect-ratio: {{ $width }} / {{ $height }}">
                            <picture class="block h-full w-full">
                                <source type="image/webp" srcset="{{ asset('images/gallery/'.str_replace('.jpg', '.webp', $photo['file'])) }}">
                                <img
                                    src="{{ asset('images/gallery/'.$photo['file']) }}"
                                    alt="{{ $photo['alt'] }}"
                                    width="{{ $width }}"
                                    height="{{ $height }}"
                                    loading="{{ $index < 4 ? 'eager' : 'lazy' }}"
                                    decoding="async"
                                    class="gallery-img h-full w-full object-cover brightness-90 transition-[filter] duration-700 group-hover:brightness-110"
                                >
                            </picture>
                            <figcaption class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/80 to-transparent p-5 pt-16">
                                <span class="font-display text-xs tracking-[0.25em] text-bone/70 uppercase">Project {{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span>
                                <span class="font-display text-xs text-gold">Eugene, OR</span>
                            </figcaption>
                        </figure>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
</section>
