/* (c) Copyright Frontify Ltd., all rights reserved. */

import Fastify, { fastify } from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyStatic from '@fastify/static';
import FastifyWebSocket from '@fastify/websocket';
import type { RollupWatcher } from 'rollup';
import { build } from 'vite';
import { getViteConfig } from '../utils/compiler';
import Logger from '../utils/logger';

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
    private readonly fastifyServer = Fastify();
    private readonly type: 'theme' | 'block';
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
        this.compilerWatcher = (await build(
            getViteConfig(this.entryPath, this.entryFilePath, 'development', typeToGlobalName[this.type], true)
        )) as RollupWatcher;

        this.compilerWatcher.on('event', (event) => {
            switch (event.code) {
                case 'BUNDLE_START':
                    Logger.info('Compiling...');
                    break;
                case 'BUNDLE_END':
                    Logger.info('Compiled successfully!');
                    this.onBundleEnd?.();
                    event.result?.close();
                    break;
                case 'ERROR':
                    if (event.error.message && event.error.stack) {
                        Logger.error(event.error.message);
                        Logger.error(event.error.stack);
                    }
                    event.result?.close();
                    break;
            }
        });
    }

    serve(): void {
        this.registerPlugins();
        this.registerRoutes();
        this.registerWebsockets();

        Logger.info(`Development server is listening on port ${this.port}!`);
        this.fastifyServer.listen({ port: this.port, host: '0.0.0.0' });
    }

    registerRoutes(): void {
        this.fastifyServer.get('/', (_req, res) => {
            res.send({ status: 'OK' });
        });
    }

    registerWebsockets(): void {
        this.fastifyServer.register((fastify) =>
            fastify.get('/websocket', { websocket: true }, async (connection) => {
                Logger.info('Page connected to websocket!');

                // Send data on first connection
                connection.socket.send(JSON.stringify({ message: typeToSocketMessage[this.type] }));

                if (!this.compilerWatcher) {
                    await this.bindCompilerWatcher();
                }

                if (!this.onBundleEnd) {
                    this.onBundleEnd = () => {
                        Logger.info(`Notifying browser of ${this.type} update`);
                        connection.socket.send(JSON.stringify({ message: typeToSocketMessage[this.type] }));
                    };
                }

                connection.socket.on('close', () => {
                    connection.socket.close();
                    this.compilerWatcher?.close();
                    Logger.info('Page reloaded, closing websocket connection...');
                });
            })
        );
    }

    registerPlugins(): void {
        this.fastifyServer.register(FastifyCors);
        this.fastifyServer.register(FastifyWebSocket);
        this.fastifyServer.register(FastifyStatic, {
            root: this.distPath,
        });
    }
}

export const createDevelopmentServer = (
    customBlockPath: string,
    entryFilePath: string,
    distPath: string,
    port: number,
    type: 'theme' | 'block'
): void => {
    Logger.info(`Starting the ${type} development server...`);

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePath, distPath, port, type);
    developmentServer.serve();
    developmentServer.bindCompilerWatcher();
};
