{{-- Contact: autumn finale scene. The client lists phone + mailing address only (no email or socials). --}}
<section id="contact" class="relative flex min-h-svh items-center px-5 py-32 md:px-10" data-section="contact">
    <div class="mx-auto w-full max-w-[1440px]">
        <p class="eyebrow mb-8" data-reveal>Contact</p>

        <h2 class="display max-w-[16ch] text-[clamp(3rem,8.4vw,9rem)]" data-split>
            See what we can do <span class="text-ember">for you.</span>
        </h2>

        <div class="mt-16 grid gap-6 md:grid-cols-3">
            <a href="{{ config('site.phone.href') }}" class="glass group flex flex-col justify-between gap-10 rounded-3xl p-8 transition-colors duration-500 hover:border-gold/60 md:col-span-2 md:p-10" data-reveal data-magnetic="0.15">
                <span class="font-display text-xs tracking-[0.3em] text-bone/50 uppercase">Call us</span>
                <span class="flex items-end justify-between gap-6">
                    <span class="display text-[clamp(2rem,8.5vw,5.6rem)] whitespace-nowrap text-gold">{{ config('site.phone.display') }}</span>
                    <span class="mb-3 hidden size-14 shrink-0 items-center sm:flex justify-center rounded-full bg-gold text-ink transition-transform duration-500 group-hover:-rotate-45">
                        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </span>
            </a>

            <div class="glass flex flex-col justify-between gap-10 rounded-3xl p-8 md:p-10" data-reveal>
                <span class="font-display text-xs tracking-[0.3em] text-bone/50 uppercase">Mailing address</span>
                <div>
                    <address class="font-display text-2xl leading-snug font-medium not-italic">
                        {{ config('site.address.line1') }}<br>
                        {{ config('site.address.line2') }}
                    </address>
                    <a href="{{ config('site.map_url') }}" target="_blank" rel="noopener" class="link-underline mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-gold">
                        View Eugene on Google Maps
                        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
