/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

import pkg from '../../package.json';
import { getAppBridgeThemeVersion, getReactVersion } from '../utils/getPackageVersion';
import { reactBareExternalPlugin } from '../utils/vitePlugins';

export class ThemeDevelopmentServer {
    constructor(
        private readonly entryFilePath: string,
        private readonly port: number,
        private readonly allowExternal: boolean,
    ) {}

    async serve(): Promise<void> {
        try {
            const appBridgeThemeVersion = getAppBridgeThemeVersion(process.cwd());
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
                const actualPort = parseInt(host.split(':')[1] || String(this.port), 10);

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
                            ...(appBridgeThemeVersion ? { '@frontify/app-bridge-theme': appBridgeThemeVersion } : {}),
                            react: reactVersion,
                        },
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
