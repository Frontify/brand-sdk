/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import Fastify from 'fastify';
import { join } from 'path';
import { createServer } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import Logger from '../utils/logger';

export type Setting = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
};

class DevelopmentServer {
    private readonly entryPath: string;
    private readonly entryFilePath: string;
    private readonly port: number;
    private readonly metaPort: number;

    constructor(entryPath: string, entryFilePath: string, port: number, metaPort: number) {
        this.entryPath = entryPath;
        this.entryFilePath = entryFilePath;
        this.port = port;
        this.metaPort = metaPort;
    }

    async serve(): Promise<void> {
        try {
            const server = await createServer({
                envDir: join(__dirname, 'env'),
                root: this.entryPath,
                plugins: [
                    react(),
                    viteExternalsPlugin({
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    }),
                ],
                logLevel: 'warn',
                base: `http://localhost:${this.port}/`,
                server: {
                    port: this.port,
                    host: 'localhost',
                    cors: true,
                    hmr: {
                        port: this.port,
                        host: 'localhost',
                        protocol: 'ws',
                    },
                    fs: {
                        // INFO: Allow linked packages `../..`.
                        strict: false,
                    },
                },
            });
            await server.listen();
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

        const fastifyServer = Fastify();
        fastifyServer.get('/', (request, reply) => {
            reply
                .code(200)
                .type('text/json')
                .send(
                    JSON.stringify({
                        url: `http://localhost:${this.port}/${this.entryFilePath}`,
                        entryFilePath: this.entryFilePath,
                        port: this.port,
                    })
                );
        });
        await fastifyServer.listen({ port: this.metaPort, host: 'localhost' });

        Logger.info(`Development server is listening on http://localhost:${this.port}`);
        Logger.info(`Metadata server is listening on http://localhost:${this.metaPort}`);
    }
}

export const createDevelopmentServer = async (
    customBlockPath: string,
    entryFilePath: string,
    port: number,
    metaPort: number
): Promise<void> => {
    Logger.info('Starting the development server...');

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePath, port, metaPort);
    await developmentServer.serve();
};
