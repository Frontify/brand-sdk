/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock } from './AppBridgeBlock';
import { AppBridgeCreateAsset } from './AppBridgeCreateAsset';
import { AppBridgeTheme } from './AppBridgeTheme';

type AppBridgeBlockOptions = {
    blockId: number;
    sectionId?: number;
};

type AppBridgeThemeOptions = {
    portalId: number;
};

type AppBridgeArgs = ['block', AppBridgeBlockOptions] | ['theme', AppBridgeThemeOptions] | ['create-asset'];

export class AppBridgeImpl {
    public constructor(type: 'block', options: AppBridgeBlockOptions);
    public constructor(type: 'theme', options: AppBridgeThemeOptions);
    public constructor(type: 'create-asset');
    public constructor(...args: AppBridgeArgs) {
        if (args[0] === 'block') {
            const options = args[1];
            if (!options) {
                throw new Error('You need to pass options for the block.');
            }

            return new AppBridgeBlock(options.blockId, options.sectionId);
        } else if (args[0] === 'theme') {
            const options = args[1];
            if (!options) {
                throw new Error('You need to pass options for the theme.');
            }

            return new AppBridgeTheme(options.portalId);
        } else if (args[0] === 'create-asset') {
            return new AppBridgeCreateAsset();
        } else {
            throw new Error('Invalid arguments');
        }
    }
}

export const AppBridge: {
    new (type: 'block', options: AppBridgeBlockOptions): AppBridgeBlock;
    new (type: 'theme', options: AppBridgeThemeOptions): AppBridgeTheme;
    new (type: 'create-asset'): AppBridgeCreateAsset;
} = AppBridgeImpl as never;
