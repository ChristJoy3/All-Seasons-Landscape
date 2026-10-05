{{--
    Client logo, used exactly as supplied: only proportional resizes (public/images/brand) of public/logo.png.
    @param string $class    classes for the <img> (size it here)
    @param string $sizes    rendered width hint for srcset selection
    @param string $loading  'eager' | 'lazy'
--}}
@php
    $class ??= '';
    $sizes ??= '200px';
    $loading ??= 'eager';
@endphp
<picture>
    <source type="image/webp" srcset="{{ asset('images/brand/logo-400.webp') }} 400w, {{ asset('images/brand/logo-800.webp') }} 800w" sizes="{{ $sizes }}">
    <img
        src="{{ asset('images/brand/logo-400.png') }}"
        srcset="{{ asset('images/brand/logo-400.png') }} 400w, {{ asset('images/brand/logo-800.png') }} 800w"
        sizes="{{ $sizes }}"
        alt="{{ config('site.name') }}"
        width="1862"
        height="862"
        loading="{{ $loading }}"
        decoding="async"
        @if ($loading === 'eager') fetchpriority="high" @endif
        class="{{ $class }}"
    >
</picture>
