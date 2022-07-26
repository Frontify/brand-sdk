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

const typeToGlobalName: Record<'theme' | 'block', string> = {
    block: 'DevCustomBlock',
    theme: 'DevCustomTheme',
};

class DevelopmentServer {
    private readonly entryPath: string;
    private readonly entryFilePath: string;
    private readonly port: number;
    private readonly type: 'theme' | 'block';
    private onBundleEnd?: () => void;

    constructor(entryPath: string, entryFilePath: string, port: number, type: 'theme' | 'block') {
        this.entryPath = entryPath;
        this.entryFilePath = entryFilePath;
        this.port = port;
        this.type = type;
        this.onBundleEnd = undefined;
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

        // const listener = await this.viteDevServer.listen(this.port);
        // listener.printUrls();
        Logger.info(`Development server is listening on port ${this.port}!`);
    }
}

export const createDevelopmentServer = async (
    customBlockPath: string,
    entryFilePath: string,
    port: number,
    type: 'theme' | 'block'
): Promise<void> => {
    Logger.info(`Starting the ${type} development server...`);

    const developmentServer = new DevelopmentServer(customBlockPath, entryFilePath, port, type);
    await developmentServer.serve();
};
