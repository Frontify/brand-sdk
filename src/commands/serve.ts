/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import express from 'express';
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

    constructor(entryPath: string, entryFilePath: string, port: number) {
        this.entryPath = entryPath;
        this.entryFilePath = entryFilePath;
        this.port = port;
    }

    async serve(): Promise<void> {
        try {
            const app = express();
            const vite = await createServer({
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
                appType: 'custom',
                server: {
                    middlewareMode: true,
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
            app.use(vite.middlewares);
            app.get('/_entrypoint.json', (req, res) =>
                res.type('application/json').send(
                    JSON.stringify({
                        url: `http://localhost:${this.port}/${this.entryFilePath}`,
                        entryFilePath: this.entryFilePath,
                        port: this.port,
                    })
                )
            );
            app.listen(this.port, () =>
                Logger.info(`Development server is listening on http://localhost:${this.port}`)
            );
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }
}

export const createDevelopmentServer = async (
    customBlockPath: string,
    entryFilePath: string,
    port: number
): Promise<void> => {
    Logger.info('Starting the development server...');

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePath, port);
    await developmentServer.serve();
};
