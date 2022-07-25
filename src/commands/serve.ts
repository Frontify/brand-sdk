/* (c) Copyright Frontify Ltd., all rights reserved. */

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyStatic from '@fastify/static';
import FastifyWebSocket from '@fastify/websocket';
import type { RollupWatcher } from 'rollup';
import { ViteDevServer, build } from 'vite';
import { getViteConfig } from '../utils/compiler';
import Logger from '../utils/logger';
import { createServer } from 'vite';

export type Setting = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
};

const typeToGlobalName: Record<'theme' | 'block', string> = {
    block: 'DevCustomBlock',
    theme: 'DevCustomTheme',
};

const typeToSocketMessage: Record<'theme' | 'block', string> = {
    block: 'block-updated',
    theme: 'theme-updated',
};

class DevelopmentServer {
    private readonly entryPath: string;
    private readonly entryFilePath: string;
    private readonly distPath: string;
    private readonly port: number;
    private readonly type: 'theme' | 'block';
    private viteDevServer?: ViteDevServer;
    private compilerWatcher?: RollupWatcher;
    private onBundleEnd?: () => void;

    constructor(entryPath: string, entryFilePath: string, distPath: string, port: number, type: 'theme' | 'block') {
        this.entryPath = entryPath;
        this.distPath = distPath;
        this.entryFilePath = entryFilePath;
        this.port = port;
        this.compilerWatcher = undefined;
        this.type = type;
        this.onBundleEnd = undefined;
    }

    async bindCompilerWatcher(): Promise<void> {
        // this.compilerWatcher = (await build(
        //     getViteConfig(this.entryPath, this.entryFilePath, 'development', typeToGlobalName[this.type], true)
        // )) as RollupWatcher;
        // this.compilerWatcher.on('event', (event) => {
        //     switch (event.code) {
        //         case 'BUNDLE_START':
        //             Logger.info('Compiling...');
        //             break;
        //         case 'BUNDLE_END':
        //             Logger.info('Compiled successfully!');
        //             this.onBundleEnd?.();
        //             event.result?.close();
        //             break;
        //         case 'ERROR':
        //             event.result?.close();
        //             break;
        //     }
        // });
    }

    async serve(): Promise<void> {
        try {
            this.viteDevServer = await createServer({
                ...getViteConfig(this.entryPath, this.entryFilePath, 'development', typeToGlobalName[this.type], true),
                server: {
                    host: '0.0.0.0',
                    // origin: 'localhost',
                    hmr: {
                        // protocol: 'http',
                        host: 'localhost',
                        port: this.port,
                    },
                    // cors: true,
                },
            });
            await this.viteDevServer.listen(this.port);
            Logger.info(JSON.stringify(this.viteDevServer.ws));
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

        // const listener = await this.viteDevServer.listen(this.port);
        // listener.printUrls();
        Logger.info(`Development server is listening on port ${this.port}!`);
    }
}

export const createDevelopmentServer = async (
    customBlockPath: string,
    entryFilePath: string,
    distPath: string,
    port: number,
    type: 'theme' | 'block'
): Promise<void> => {
    Logger.info(`Starting the ${type} development server...`);

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePath, distPath, port, type);
    await developmentServer.serve();
    // developmentServer.bindCompilerWatcher();
};
