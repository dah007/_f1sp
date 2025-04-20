import react from '@vitejs/plugin-react';
import path from 'path';

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            assets: '/src/assets',
            components: '/src/components',
            constants: '/src/constants',
            features: '/src/features',
            hooks: '/src/hooks',
            pages: '/src/pages',
            services: 'services',
            styles: '/src/styles',
            types: '/src/types',
            utils: '/src/utils',
        },
    },
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
