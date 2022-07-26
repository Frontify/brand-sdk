/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
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
            const server = await createServer({
                mode: 'development',
                envDir: join(__dirname, 'env'),
                root: this.entryPath,
                plugins: [
                    react(),
                    viteExternalsPlugin({
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    }),
                ],
                logLevel: 'info',
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

        Logger.info(`Development server is listening on port ${this.port}!`);
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
