{{-- Preloader: logo + progress while the 3D scene and images load. Removed by resources/js/components/preloader.js --}}
<div id="preloader" class="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-ink" role="status" aria-live="polite">
    <div class="relative flex flex-col items-center gap-10 px-6">
        @include('sections.logo', ['class' => 'preloader-logo h-auto w-[min(72vw,340px)]', 'sizes' => 'min(72vw, 340px)'])

        <div class="flex w-[min(72vw,340px)] flex-col gap-3">
            <div class="relative h-px w-full overflow-hidden bg-bone/10">
                <div class="preloader-bar absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-green via-gold to-ember"></div>
            </div>
            <div class="flex justify-between font-display text-[11px] tracking-[0.3em] text-bone/50 uppercase">
                <span>Growing the scene</span>
                <span><span class="preloader-count">0</span>%</span>
            </div>
        </div>
    </div>
</div>
