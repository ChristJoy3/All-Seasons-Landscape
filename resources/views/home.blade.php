@extends('layouts.site')

@section('content')
    @include('sections.preloader')

    {{-- One persistent WebGL canvas behind all content --}}
    <canvas id="webgl" aria-hidden="true"></canvas>
    <div class="scene-overlay" aria-hidden="true"></div>

    @include('sections.cursor')
    @include('sections.navbar')

    <main id="main" class="relative z-10">
        @include('sections.hero')
        @include('sections.about')
        @include('sections.services')
        @include('sections.highlights')
        @include('sections.gallery')
        @include('sections.contact')
    </main>

    @include('sections.footer')
@endsection
