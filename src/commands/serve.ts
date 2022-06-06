import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from 'fastify-cors';
import FastifyStatic from 'fastify-static';
import FastifyWebSocket from 'fastify-websocket';
import Logger from '../utils/logger';
import { getOutputConfig, getRollupConfig } from '../utils/compiler';
import rollup, { RollupWatcher } from 'rollup';
import { watch } from '../utils/watch';
import { FSWatcher } from 'chokidar';

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

class DevelopmentServer {
    private readonly entryPath: string;
    private readonly entryFilePaths: string[];
    private readonly distPath: string;
    private readonly port: number;
    private readonly fastifyServer: FastifyInstance;
    private readonly type: 'theme' | 'block';
    private compilerWatcher?: RollupWatcher;
    private distWatcher?: FSWatcher;

    constructor(entryPath: string, entryFilePaths: string[], distPath: string, port: number, type: 'theme' | 'block') {
        this.entryPath = entryPath;
        this.distPath = distPath;
        this.entryFilePaths = entryFilePaths;
        this.port = port;
        this.fastifyServer = Fastify();
        this.compilerWatcher = undefined;
        this.distWatcher = undefined;
        this.type = type;
    }

    bindCompilerWatcher(): void {
        const filesToIgnore = ['node_modules', 'package*.json', '.git', '.gitignore', 'dist'];

        this.compilerWatcher = rollup.watch({
            ...getRollupConfig(this.entryPath, this.entryFilePaths, {
                NODE_ENV: 'development',
            }),
            output: getOutputConfig(this.distPath, typeToGlobalName[this.type]),
            watch: {
                include: `${this.entryPath}/**`,
                exclude: filesToIgnore,
            },
        });

        this.compilerWatcher.on('event', (event) => {
            switch (event.code) {
                case 'BUNDLE_START':
                    Logger.info('Compiling...');
                    break;
                case 'BUNDLE_END':
                    Logger.info('Compiled successfully!');
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

    bindDistWatcher(callback: () => void): void {
        this.distWatcher = watch(`${this.distPath}/**.js`, (event: string) => {
            if (event === 'change') {
                Logger.info(`Notifying browser of updated ${this.type}...`);
                callback();
            }
        });
    }

    serve(): void {
        this.registerPlugins();
        this.registerRoutes();
        this.registerWebsockets();

        Logger.info(`Development server is listening on port ${this.port}!`);
        this.fastifyServer.listen(this.port, '0.0.0.0');
    }

    registerRoutes(): void {
        this.fastifyServer.get('/', (_req, res) => {
            res.send({ status: 'OK' });
        });
    }

    registerWebsockets(): void {
        this.fastifyServer.get('/websocket', { websocket: true }, (connection) => {
            Logger.info('Page connected to websocket!');

            // Send data on first connection
            connection.socket.send(JSON.stringify({ message: `${this.type}-updated` }));

            if (!this.compilerWatcher) {
                this.bindCompilerWatcher();
            }

            if (!this.distWatcher) {
                this.bindDistWatcher(() => {
                    connection.socket.send(JSON.stringify({ message: `${this.type}-updated` }));
                });
            }

            connection.socket.on('close', () => {
                connection.socket.close();
                this.distWatcher?.close();
                this.distWatcher = undefined;
                this.compilerWatcher?.close();
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

export const createDevelopmentServer = (
    customBlockPath: string,
    entryFilePaths: string[],
    distPath: string,
    port: number,
    type: 'theme' | 'block'
): void => {
    Logger.info(`Starting the ${type} development server...`);

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePaths, distPath, port, type);
    developmentServer.serve();
    developmentServer.bindCompilerWatcher();
};
