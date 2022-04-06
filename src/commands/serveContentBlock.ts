import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from 'fastify-cors';
import FastifyStatic from 'fastify-static';
import FastifyWebSocket from 'fastify-websocket';
import Logger from '../utils/logger';
import { getOutputConfig, getRollupConfig } from '../utils/compiler';
import rollup from 'rollup';
import { watch } from '../utils/watch';

export interface SocketMessage {
    message: SocketMessageType;
    data: unknown;
}

export enum SocketMessageType {
    BlockUpdated = 'block-updated',
}

export type Setting = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
};

class ContentBlockDevelopmentServer {
    private readonly contentBlockPath: string;
    private readonly entryFilePaths: string[];
    private readonly distPath: string;
    private readonly port: number;
    private readonly fastifyServer: FastifyInstance;

    constructor(
        contentBlockPath: string,
        entryFilePaths: string[],
        distPath: string,
        port: number,
    ) {
        this.contentBlockPath = contentBlockPath;
        this.distPath = distPath;
        this.entryFilePaths = entryFilePaths;
        this.port = port;
        this.fastifyServer = Fastify();
    }

    watchForFileChangesAndCompile(): void {
        Logger.info('Warming up the Content Block compiler...');

        const filesToIgnore = ['node_modules', 'package*.json', '.git', '.gitignore', 'dist'];

        const watcher = rollup.watch({
            ...getRollupConfig(this.contentBlockPath, this.entryFilePaths, {
                NODE_ENV: 'development',
            }),
            output: getOutputConfig(this.distPath, 'DevCustomBlock'),
            watch: {
                include: `${this.contentBlockPath}/**`,
                exclude: filesToIgnore,
                chokidar: {
                    interval: 300,
                    awaitWriteFinish: {
                        stabilityThreshold: 500,
                        pollInterval: 100,
                    },
                },
                clearScreen: true,
            },
        });

        watcher.on('event', (event) => {
            switch (event.code) {
                case 'BUNDLE_START':
                    Logger.info('Compiling Content Block...');
                    break;
                case 'BUNDLE_END':
                    Logger.info('Compiled successfully!');
                    event.result.close();
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

        Logger.info(`Content Block development server is listening on port ${this.port}!`);
        this.fastifyServer.listen(this.port, '0.0.0.0');
    }

    registerRoutes(): void {
        this.fastifyServer.get('/', (_req, res) => {
            res.send({ status: 'OK' });
        });
    }

    registerWebsockets(): void {
        this.fastifyServer.get('/websocket', { websocket: true }, (connection) => {
            // Send blocks and settings on first connection
            connection.socket.send(
                JSON.stringify({
                    message: SocketMessageType.BlockUpdated,
                })
            );

            const blocksUpdateWatcher = watch(`${this.distPath}/**.js`, (event: string) => {
                if (event === 'change') {
                    Logger.info('Notifying browser of updated block');
                    connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));
                }
            });

            connection.socket.on('close', () => {
                connection.socket.close();
                blocksUpdateWatcher.close();
            });
        });
    }

    registerPlugins(): void {
        this.fastifyServer.register(FastifyCors);
        this.fastifyServer.register(FastifyWebSocket);
        this.fastifyServer.register(FastifyStatic, {
            root: this.distPath,
        });
    }
}

export const createContentBlockDevelopmentServer = (
    customBlockPath: string,
    entryFilePaths: string[],
    distPath: string,
    port: number
): void => {
    Logger.info('Starting the Content Block development server...');

    const developmentServer = new ContentBlockDevelopmentServer(customBlockPath, entryFilePaths, distPath, port);
    developmentServer.serve();
    developmentServer.watchForFileChangesAndCompile();
};
