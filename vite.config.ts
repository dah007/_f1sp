import react from '@vitejs/plugin-react';
import path from 'path';

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: './',
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            app: '/src/app',
            assets: '/src/assets',
            components: '/src/components',
            constants: '/src/constants',
            features: '/src/features',
            hooks: '/src/hooks',
            routes: '/src/routes',
            selectors: '/src/selectors',
            services: 'services',
            slices: '/src/slices',
            styles: '/src/styles',
            types: '/src/types',
            utils: '/src/utils',
        },
    },
    // server: {
    //     proxy: {
    //         '/data-api/rest/*': {
    //             target: 'http://localhost:4280', // Replace with your backend's local URL
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/data-api\/rest/, '/data-api/rest'),
    //         },
    //     },
    // },
    test: {
        coverage: {
            exclude: ['node_modules/', 'test/', 'setupTests.ts'],
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
        },
        deps: {
            inline: ['vitest-canvas-mock'],
        },
        environment: 'jsdom',
        globals: true,
        // setupFiles: './setupTests.ts',
    },
});
