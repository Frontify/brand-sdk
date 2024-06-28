/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger } from '../utils/logger';

import { BlockDevelopmentServer } from '../servers/blockDevelopmentServer';
import { PlatformAppDevelopmentServer } from '../servers/platformAppDevelopmentServer';
import { ThemeDevelopmentServer } from '../servers/themeDevelopmentServer';

export const createDevelopmentServer = async (
    entryFilePath: string,
    port: number,
    allowExternal: boolean,
): Promise<void> => {
    Logger.info('Starting the development server...');

    const developmentServer = new BlockDevelopmentServer(entryFilePath, port, allowExternal);
    await developmentServer.serve();
};

export const createDevelopmentServerForTheme = async (
    entryFilePath: string,
    port: number,
    allowExternal: boolean,
): Promise<void> => {
    Logger.info('Starting the development server for theme...');

    const developmentServer = new ThemeDevelopmentServer(entryFilePath, port, allowExternal);
    await developmentServer.serve();
};

export const createDevelopmentServerForPlatformApp = async (entryFilePath: string, port: number): Promise<void> => {
    Logger.info('Starting the development server for Apps...');

    const developmentServer = new PlatformAppDevelopmentServer(entryFilePath, port);
    await developmentServer.serve();
};
