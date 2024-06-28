/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import pkg from '../../package.json';
import { getAppBridgeThemeVersion } from '../utils/appBridgeThemeVersion';
import { getAppBridgeVersion } from '../utils/appBridgeVersion';
import { Logger } from '../utils/logger';

class PlatformAppDevelopmentServer {
    constructor(private readonly port: number) {}

    async serve(): Promise<void> {
        try {
            const viteServer = await createServer({
                root: process.cwd(),
                configFile: false,
                plugins: [react()],
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
            });

            const server = await viteServer.listen(this.port, true);
            server.printUrls();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

class ThemeDevelopmentServer {
    constructor(
        private readonly entryFilePath: string,
        private readonly port: number,
        private readonly allowExternal: boolean,
    ) {}

    async serve(): Promise<void> {
        try {
            const viteServer = await createServer({
                root: process.cwd(),
                plugins: [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    react(),
                    viteExternalsPlugin({
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    }),
                ],
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                    'DevCustomTheme.dependencies.appBridgeTheme': JSON.stringify(
                        getAppBridgeThemeVersion(process.cwd()),
                    ),
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
                },
            });

            viteServer.middlewares.use('/', (req, res, next) => {
                if (req.url !== '/') {
                    return next();
                }

                res.writeHead(200);
                return res.end('OK');
            });

            viteServer.middlewares.use('/_entrypoint', (req, res, next) => {
                if (req.url !== '/') {
                    return next();
                }

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                return res.end(
                    JSON.stringify({
                        url: `http://localhost:${this.port}/${this.entryFilePath}`,
                        entryFilePath: this.entryFilePath,
                        port: this.port,
                        version: pkg.version,
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

class DevelopmentServer {
    constructor(
        private readonly entryFilePath: string,
        private readonly port: number,
        private readonly allowExternal: boolean,
    ) {}

    async serve(): Promise<void> {
        try {
            const viteServer = await createServer({
                root: process.cwd(),
                plugins: [
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    react(),
                    viteExternalsPlugin({
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    }),
                ],
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                    'DevCustomBlock.dependencies.appBridge': JSON.stringify(getAppBridgeVersion(process.cwd())),
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
                },
            });

            viteServer.middlewares.use('/', (req, res, next) => {
                if (req.url !== '/') {
                    return next();
                }

                res.writeHead(200);
                return res.end('OK');
            });

            viteServer.middlewares.use('/_entrypoint', (req, res, next) => {
                if (req.url !== '/') {
                    return next();
                }

                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                return res.end(
                    JSON.stringify({
                        url: `http://localhost:${this.port}/${this.entryFilePath}`,
                        entryFilePath: this.entryFilePath,
                        port: this.port,
                        version: pkg.version,
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

export const createDevelopmentServer = async (
    entryFilePath: string,
    port: number,
    allowExternal: boolean,
): Promise<void> => {
    Logger.info('Starting the development server...');

    const developmentServer = new DevelopmentServer(entryFilePath, port, allowExternal);
    await developmentServer.serve();
};

export const createDevelopmentServerForTheme = async (
    entryFilePath: string,
    port: number,
    allowExternal: boolean,
): Promise<void> => {
    Logger.info('Starting the development server for theme...');

    const developmentServer = new ThemeDevelopmentServer(entryFilePath, port, allowExternal);
    await developmentServer.serve();
};

export const createDevelopmentServerForPlatformApp = async (port: number): Promise<void> => {
    Logger.info('Starting the development server for Apps...');

    const developmentServer = new PlatformAppDevelopmentServer(port);
    await developmentServer.serve();
};
