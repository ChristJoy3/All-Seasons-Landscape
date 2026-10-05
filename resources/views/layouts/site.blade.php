<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="no-js">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        <title>{{ config('site.name') }} | Eugene, Oregon</title>
        <meta name="description" content="{{ config('site.description') }}">
        <meta name="theme-color" content="#0a120d">
        <link rel="canonical" href="{{ url('/') }}">
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <link rel="apple-touch-icon" href="{{ asset('images/brand/logo-400.png') }}">

        {{-- Open Graph / social --}}
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ config('site.name') }}">
        <meta property="og:description" content="{{ config('site.description') }}">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:image" content="{{ asset('images/brand/logo-800.png') }}">
        <meta name="twitter:card" content="summary_large_image">

        {{-- Structured data: only facts published on the client's site --}}
        <script type="application/ld+json">
            {!! json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'LandscapingBusiness',
                'name' => config('site.name'),
                'telephone' => config('site.phone.display'),
                'image' => asset('images/brand/logo-800.png'),
                'url' => url('/'),
                'areaServed' => config('site.location'),
                'address' => [
                    '@type' => 'PostalAddress',
                    'postOfficeBoxNumber' => '40132',
                    'addressLocality' => 'Eugene',
                    'addressRegion' => 'OR',
                    'postalCode' => '97404',
                    'addressCountry' => 'US',
                ],
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
        </script>

        {{-- Flag JS + reduced motion before first paint so reveal styles never flash. --}}
        <script>
            document.documentElement.classList.replace('no-js', 'js');
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('reduced-motion');
            }
        </script>

        @fonts
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body>
        <a href="#main" class="sr-only z-[200] rounded-full bg-gold px-5 py-3 font-display text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
            Skip to content
        </a>

        @yield('content')
    </body>
</html>
