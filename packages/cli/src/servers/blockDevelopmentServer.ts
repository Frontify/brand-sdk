/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

import pkg from '../../package.json';
import { getAppBridgeVersion, getReactVersion } from '../utils/getPackageVersion';
import { Logger } from '../utils/logger';
import { type ContentBlockManifest } from '../utils/verifyManifest';
import { reactBareExternalPlugin } from '../utils/vitePlugins';

export class BlockDevelopmentServer {
    constructor(
        private readonly entryFilePath: string,
        private readonly port: number,
        private readonly allowExternal: boolean,
    ) {}

    async serve(): Promise<void> {
        try {
            const appBridgeVersion = getAppBridgeVersion(process.cwd());
            const reactVersion = getReactVersion(process.cwd());

            const viteServer = await createServer({
                root: process.cwd(),
                plugins: [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    react(),
                    reactBareExternalPlugin(),
                ],
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                base: `http://localhost:${this.port}/`,
                appType: 'custom',
                server: {
                    port: this.port,
                    host: this.allowExternal ? '0.0.0.0' : 'localhost',
                    cors: true,
                    hmr: {
                        port: this.port,
                        host: this.allowExternal ? '0.0.0.0' : 'localhost',
                        protocol: 'ws',
                    },
                    forwardConsole: false,
                },
            });

            viteServer.middlewares.use('/', (req, res, next) => {
                if (req.url !== '/') {
                    return next();
                }

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                res.writeHead(200);
                return res.end('OK');
            });

            viteServer.middlewares.use('/_entrypoint', (req, res, next) => {
                if (req.url !== '/') {
                    return next();
                }

                const host = req.headers.host || `localhost:${this.port}`;
                const actualPort = Number.parseInt(host.split(':')[1] || String(this.port), 10);

                let manifest: ContentBlockManifest | undefined;
                try {
                    manifest = JSON.parse(
                        readFileSync(join(process.cwd(), 'manifest.json'), 'utf8'),
                    ) as ContentBlockManifest;
                } catch (error) {
                    Logger.error('Warning: could not read manifest.json from project root.', (error as Error).message);
                }

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                return res.end(
                    JSON.stringify({
                        url: `http://${host}/${this.entryFilePath}`,
                        entryFilePath: this.entryFilePath,
                        port: actualPort,
                        version: pkg.version,
                        dependencies: {
                            ...(appBridgeVersion ? { '@frontify/app-bridge': appBridgeVersion } : {}),
                            ...(reactVersion ? { react: reactVersion } : {}),
                        },
                        ...(manifest ? { manifest } : {}),
                    }),
                );
            });

            const server = await viteServer.listen(this.port, true);
            server.printUrls();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}
