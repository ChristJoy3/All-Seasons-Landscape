@php
    // Flatten groups so each service knows its group and a global index for the pinned sequence.
    $services = collect(config('site.service_groups'))
        ->flatMap(fn (array $group, int $groupIndex) => collect($group['items'])->map(fn (array $item) => [
            ...$item,
            'group' => $group['title'],
            'group_index' => $groupIndex,
            'season' => $group['season'],
        ]))
        ->values();
@endphp

{{--
    Services: pinned on desktop; each item is revealed in sequence while the 3D scene plays a matching beat.
    Without JS (or with reduced motion) the items simply stack as a readable list.
    Animated by resources/js/animations/services.js
--}}
<section id="services" class="relative" data-section="services">
    <div class="services-pin relative flex min-h-svh flex-col px-5 pt-28 pb-10 md:px-10" data-services-pin>
        <div class="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
            <header class="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <p class="eyebrow mb-5" data-reveal>Services</p>
                    <h2 class="display text-[clamp(2.2rem,4.6vw,4.4rem)]" data-split>What we do, all year.</h2>
                </div>

                {{-- Group tabs + progress (enhanced by JS) --}}
                <div class="services-hud flex w-full flex-col gap-3 md:max-w-sm" aria-hidden="true">
                    <div class="flex justify-between font-display text-xs tracking-[0.25em] uppercase">
                        <span class="services-group-label text-gold">{{ $services[0]['group'] }}</span>
                        <span class="text-bone/50"><span class="services-current text-bone">01</span> / {{ str_pad($services->count(), 2, '0', STR_PAD_LEFT) }}</span>
                    </div>
                    <div class="h-px w-full bg-bone/10">
                        <div class="services-progress h-full w-full origin-left scale-x-0 bg-gradient-to-r from-green to-gold"></div>
                    </div>
                </div>
            </header>

            <div class="services-stage relative mt-12 flex-1 md:mt-16">
                {{-- Index of all services --}}
                <ol class="services-index hidden lg:block" aria-hidden="true">
                    @foreach ($services as $index => $service)
                        <li class="services-index-item font-display text-sm text-bone/35 transition-colors duration-500" data-index="{{ $index }}">
                            <span class="inline-block w-8 tabular-nums">{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span>{{ $service['name'] }}
                        </li>
                    @endforeach
                </ol>

                <ul class="services-list grid gap-6">
                    @foreach ($services as $index => $service)
                        @if ($loop->first || $services[$index - 1]['group_index'] !== $service['group_index'])
                            <li class="services-group-heading pt-6 font-serif text-sm font-semibold tracking-[0.25em] text-gold uppercase">{{ $service['group'] }}</li>
                        @endif
                        <li
                            class="service-item glass rounded-3xl p-7 md:p-10"
                            data-service
                            data-index="{{ $index }}"
                            data-scene="{{ $service['scene'] }}"
                            data-group="{{ $service['group'] }}"
                            data-season="{{ $service['season'] }}"
                        >
                            <span class="service-num font-display text-sm tabular-nums {{ $service['season'] === 'gold' ? 'text-gold' : 'text-green-soft' }}">{{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span>
                            <h3 class="service-name display mt-4 text-[clamp(2rem,5.4vw,5.6rem)]">{{ $service['name'] }}</h3>
                            <p class="service-copy mt-5 max-w-md text-lg leading-relaxed text-bone/70">{{ $service['copy'] }}</p>
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</section>
