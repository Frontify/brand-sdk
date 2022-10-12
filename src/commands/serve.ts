/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { Logger } from '../utils/logger';

export type Setting = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
};

class DevelopmentServer {
    private readonly entryFilePath: string;
    private readonly port: number;

    constructor(entryFilePath: string, port: number) {
        this.entryFilePath = entryFilePath;
        this.port = port;
    }

    async serve(): Promise<void> {
        try {
            const viteServer = await createServer({
                root: process.cwd(),
                plugins: [
                    react(),
                    viteExternalsPlugin({
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    }),
                ],
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                base: `http://localhost:${this.port}/`,
                appType: 'custom',
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
                    })
                );
            });

            await viteServer.listen(this.port, true);

            Logger.info(`Development server is listening on http://localhost:${this.port}`);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}

export const createDevelopmentServer = async (entryFilePath: string, port: number): Promise<void> => {
    Logger.info('Starting the development server...');

    const developmentServer = new DevelopmentServer(entryFilePath, port);
    await developmentServer.serve();
};
