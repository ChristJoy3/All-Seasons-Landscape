import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
            fonts: [
                // Display: geometric grotesk for the "future" voice.
                bunny('Space Grotesk', {
                    weights: [500, 600, 700],
                }),
                // Body copy.
                bunny('Inter', {
                    weights: [400, 500],
                }),
                // Eyebrows: classical small caps that echo the logo lettering.
                bunny('Cinzel', {
                    weights: [500, 600],
                    preload: false,
                }),
            ],
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
