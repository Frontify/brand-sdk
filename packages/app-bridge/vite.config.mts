/* (c) Copyright Frontify Ltd., all rights reserved. */

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap, peerDependencies as peerDependenciesMap } from './package.json';

// Externalize every declared dependency and any of its subpaths (e.g. 'react/jsx-runtime').
const external = [...Object.keys(dependenciesMap), ...Object.keys(peerDependenciesMap)].map(
    (dependency) => new RegExp(`^${dependency.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`),
);

export default defineConfig({
    plugins: [
        // One declaration file per entry, like the other packages. Per-file declarations used
        // extensionless relative imports, which `moduleResolution: "nodenext"` can't resolve.
        dts({ insertTypesEntry: true, rollupTypes: true }),
    ],
    build: {
        lib: {
            entry: {
                index: './src/index.ts',
                testing: './src/tests/index.ts',
            },
            // ESM only: a CommonJS build would still have to require lodash-es, which is ESM-only.
            formats: ['es'],
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external,
        },
    },
    test: {
        environment: 'happy-dom',
        css: true,
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/*.spec.ts', 'src/**/*.spec.tsx', 'src/setupTests.ts'],
        },
        setupFiles: ['./src/setupTests.ts'],
    },
});
