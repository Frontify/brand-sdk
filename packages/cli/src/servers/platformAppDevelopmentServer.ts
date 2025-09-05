/* (c) Copyright Frontify Ltd., all rights reserved. */

import path from 'node:path';

import react from '@vitejs/plugin-react';
import * as esbuild from 'esbuild';
import { createServer } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export class PlatformAppDevelopmentServer {
    constructor(
        private readonly entryFilePath: string,
        private readonly port: number,
    ) { }

    async serve(): Promise<void> {
        try {
            const settingsSchema = await esbuild.context({
                entryPoints: [this.entryFilePath],
                outfile: './dist/dev-settings.js',
                minify: true,
                globalName: 'devSettings',
                format: 'iife',
                bundle: true,
                loader: {
                    '.css': 'empty',
                },
            });

            const viteServerDev = await createServer({
                root: process.cwd(),
                configFile: false,
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                server: { cors: true },
                plugins: [
                    mkcert(),
                    react(),
                    {
                        name: 'prebuild-commands',
                        handleHotUpdate: ({ file, server }) => {
                            const relativeFilePath = path.relative(process.cwd(), file);

                            if (relativeFilePath === 'src/settings.ts' || relativeFilePath === 'src/index.ts') {
                                // if the change is either in settings.ts or index.ts do a rebuild to load settings
                                settingsSchema.rebuild();
                                server.restart();
                            }
                        },
                        buildStart: () => {
                            settingsSchema.rebuild();
                        },
                    },
                ],
            });

            const server = await viteServerDev.listen(this.port, true);
            server.printUrls();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}
