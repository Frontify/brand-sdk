import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from 'fastify-cors';
import FastifyStatic from 'fastify-static';
import FastifyWebSocket from 'fastify-websocket';
import Logger from '../utils/logger';
import { getOutputConfig, getRollupConfig } from '../utils/compiler';
import rollup, { RollupWatcher } from 'rollup';
import { watch } from '../utils/watch';
import { FSWatcher } from 'chokidar';
import { BuildResult, build } from 'esbuild';

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
    private compilerWatcher?: BuildResult;
    private distWatcher?: FSWatcher;

    constructor(contentBlockPath: string, entryFilePaths: string[], distPath: string, port: number) {
        this.contentBlockPath = contentBlockPath;
        this.distPath = distPath;
        this.entryFilePaths = entryFilePaths;
        this.port = port;
        this.fastifyServer = Fastify();
        this.compilerWatcher = undefined;
        this.distWatcher = undefined;
    }

    async bindCompilerWatcher(): Promise<void> {
        Logger.info('Warming up the Content Block compiler...');

        const filesToIgnore = ['node_modules', 'package*.json', '.git', '.gitignore', 'dist'];

        // this.compilerWatcher = rollup.watch({
        //     ...getRollupConfig(this.contentBlockPath, this.entryFilePaths, {
        //         NODE_ENV: 'development',
        //     }),
        //     output: getOutputConfig(this.distPath, 'DevCustomBlock'),
        //     watch: {
        //         include: `${this.contentBlockPath}/**`,
        //         exclude: filesToIgnore,
        //     },
        // });

        this.compilerWatcher = await build({
            ...getRollupConfig(this.contentBlockPath, this.entryFilePaths, {
                NODE_ENV: 'development',
            }),
            watch: {
                onRebuild(error, result) {
                    if (error) {
                        Logger.info(`watch build failed: ${error}`);
                    } else {
                        Logger.info(`watch build succeeded: ${result}`);
                    }
                },
            },
        });
        if (this.compilerWatcher.errors.length > 0) {
            Logger.info(`Compiler errors: ${this.compilerWatcher.errors}`);
            return;
        }

        Logger.info('Compiled successfully!');

        // this.compilerWatcher.on('event', (event) => {
        //     switch (event.code) {
        //         case 'BUNDLE_START':
        //             Logger.info('Compiling Content Block...');
        //             break;
        //         case 'BUNDLE_END':
        //             Logger.info('Compiled successfully!');
        //             event.result?.close();
        //             break;
        //         case 'ERROR':
        //             if (event.error.message && event.error.stack) {
        //                 Logger.error(event.error.message);
        //                 Logger.error(event.error.stack);
        //             }
        //             event.result?.close();
        //             break;
        //     }
        // });
    }

    bindDistWatcher(callback: () => void): void {
        this.distWatcher = watch(`${this.distPath}/**.js`, (event: string) => {
            if (event === 'change') {
                Logger.info('Notifying browser of updated block...');
                callback();
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
        this.fastifyServer.get('/websocket', { websocket: true }, async (connection) => {
            Logger.info('Page connected to websocket!');

            // Send blocks and settings on first connection
            connection.socket.send(
                JSON.stringify({
                    message: SocketMessageType.BlockUpdated,
                })
            );

            if (!this.compilerWatcher) {
                await this.bindCompilerWatcher();
            }

            if (!this.distWatcher) {
                this.bindDistWatcher(() => {
                    connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));
                });
            }

            connection.socket.on('close', () => {
                connection.socket.close();
                this.distWatcher?.close();
                this.distWatcher = undefined;
                if (this.compilerWatcher?.stop) {
                    this.compilerWatcher.stop();
                }
                this.compilerWatcher = undefined;
                Logger.info('Page reloaded, closing websocket connection...');
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
    developmentServer.bindCompilerWatcher();
};
