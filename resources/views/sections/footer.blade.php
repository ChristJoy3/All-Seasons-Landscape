<footer class="relative z-10 border-t border-bone/10 bg-ink px-5 pt-16 pb-10 md:px-10">
    <div class="mx-auto flex max-w-[1440px] flex-col gap-12">
        <div class="flex flex-wrap items-end justify-between gap-10">
            <a href="#top" aria-label="Back to top">
                @include('sections.logo', ['class' => 'h-auto w-56 md:w-72', 'sizes' => '(min-width: 768px) 288px, 224px', 'loading' => 'lazy'])
            </a>

            <ul class="flex flex-wrap gap-x-10 gap-y-3 font-display text-sm text-bone/70">
                <li><a href="#services" class="link-underline hover:text-bone">Services</a></li>
                <li><a href="#about" class="link-underline hover:text-bone">About</a></li>
                <li><a href="#gallery" class="link-underline hover:text-bone">Gallery</a></li>
                <li><a href="#contact" class="link-underline hover:text-bone">Contact</a></li>
                <li><a href="{{ config('site.phone.href') }}" class="link-underline text-gold">{{ config('site.phone.display') }}</a></li>
            </ul>
        </div>

        <div class="flex flex-wrap justify-between gap-4 border-t border-bone/10 pt-8 text-sm text-bone/45">
            <p>&copy; {{ date('Y') }} {{ config('site.name') }}. {{ config('site.address.line1') }}, {{ config('site.address.line2') }}.</p>
            <p>Lawn &amp; grounds care in {{ config('site.location') }}.</p>
        </div>
    </div>
</footer>
