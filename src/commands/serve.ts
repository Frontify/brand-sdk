import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from 'fastify-cors';
import FastifyStatic from 'fastify-static';
import FastifyWebSocket from 'fastify-websocket';
import Logger from '../utils/logger';
import { join } from 'path';
import { CompilerOptions, compile } from '../utils/compile';
import { watch } from '../utils/watch';
import { FSWatcher } from 'chokidar';

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

class DevelopmentServer {
    private readonly customBlockPath: string;
    private readonly entryFilePaths: string[];
    private readonly distPath: string;
    private readonly port: number;
    private readonly options: CompilerOptions;
    private readonly fastifyServer: FastifyInstance;

    constructor(
        customBlockPath = 'custom_block',
        entryFilePaths = ['src/index.tsx', 'src/settings.ts'],
        port = 5600,
        options: CompilerOptions
    ) {
        this.customBlockPath = join(process.cwd(), customBlockPath);
        this.distPath = join(process.cwd(), 'dist');
        this.entryFilePaths = entryFilePaths;
        this.port = port;
        this.options = options;
        this.fastifyServer = Fastify();
    }

    watchForFileChangesAndCompile(): FSWatcher {
        const filesToIgnore = ['node_modules', 'package*.json', '.git', '.gitignore', 'dist'];

        return watch(
            this.customBlockPath,
            async () => {
                Logger.info('Compiling...');
                try {
                    await compile(this.customBlockPath, this.entryFilePaths, 'DevCustomBlock', {
                        ...this.options,
                        distPath: this.distPath,
                        env: {
                            NODE_ENV: 'development',
                        },
                    });

                    Logger.info('Compiled successfully!');
                } catch (error) {
                    Logger.error(error as string);
                }
            },
            filesToIgnore
        );
    }

    serve(): void {
        this.registerPlugins();
        this.registerRoutes();
        this.registerWebsockets();

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

export const createDevelopmentServer = (
    customBlockPath: string,
    entryFilePaths: string[],
    port: number,
    options: CompilerOptions
): void => {
    Logger.info('Starting the development server...');

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePaths, port, options);
    developmentServer.watchForFileChangesAndCompile();
    developmentServer.serve();

    Logger.info(`Development server is listening on port ${port}!`);
};
