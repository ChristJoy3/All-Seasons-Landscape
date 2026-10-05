@php
    $navLinks = [
        ['href' => '#services', 'label' => 'Services'],
        ['href' => '#about', 'label' => 'About'],
        ['href' => '#gallery', 'label' => 'Gallery'],
        ['href' => '#contact', 'label' => 'Contact'],
    ];
@endphp

<header class="site-nav fixed inset-x-0 top-0 z-50" data-nav>
    <nav class="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 md:px-10" aria-label="Primary">
        <a href="#top" class="shrink-0" aria-label="{{ config('site.name') }}, back to top">
            @include('sections.logo', ['class' => 'h-11 w-auto md:h-14', 'sizes' => '122px'])
        </a>

        <ul class="hidden items-center gap-10 font-display text-sm font-medium text-bone/80 lg:flex">
            @foreach ($navLinks as $link)
                <li><a href="{{ $link['href'] }}" class="link-underline py-1 transition-colors hover:text-bone">{{ $link['label'] }}</a></li>
            @endforeach
        </ul>

        <div class="flex items-center gap-3">
            <a href="{{ config('site.phone.href') }}" class="btn btn-primary hidden !px-5 !py-3 sm:inline-flex" data-magnetic>
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>
                {{ config('site.phone.display') }}
            </a>

            <button type="button" class="glass flex size-12 items-center justify-center rounded-full lg:hidden" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
                <span class="sr-only">Open menu</span>
                <span class="relative block h-3 w-5" aria-hidden="true">
                    <span class="menu-line absolute top-0 left-0 h-px w-full bg-bone transition-transform duration-500"></span>
                    <span class="menu-line absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-500"></span>
                </span>
            </button>
        </div>
    </nav>

    {{-- Mobile menu --}}
    <div id="mobile-menu" class="invisible fixed inset-0 -z-10 flex flex-col justify-end bg-ink/95 px-6 pt-28 pb-10 opacity-0 backdrop-blur-xl transition-[opacity,visibility] duration-500 lg:hidden" data-menu>
        <ul class="flex flex-col gap-2">
            @foreach ($navLinks as $link)
                <li><a href="{{ $link['href'] }}" class="display block py-2 text-5xl text-bone">{{ $link['label'] }}</a></li>
            @endforeach
        </ul>
        <a href="{{ config('site.phone.href') }}" class="btn btn-primary mt-10 justify-center">Call {{ config('site.phone.display') }}</a>
    </div>
</header>
