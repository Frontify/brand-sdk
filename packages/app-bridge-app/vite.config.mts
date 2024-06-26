/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
};

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, rollupTypes: true })],
    build: {
        lib: {
            entry: {
                index: './src/index.ts',
            },
            name: 'app-bridge-app',
        },
        sourcemap: true,
        minify: true,
    },
    test: {
        environment: 'happy-dom',
        css: true,
    },
});
