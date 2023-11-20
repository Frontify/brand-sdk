/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DispatchHandlerParameter } from '../../AppBridge';
import { CommandRegistry } from './CommandRegistry';

export const downloadAsset = (
    asset: CommandRegistry['downloadAsset'],
): DispatchHandlerParameter<'downloadAsset', CommandRegistry> => ({
    name: 'downloadAsset',
    payload: asset,
});

export const downloadAssets = (
    downloadUrl: CommandRegistry['downloadAssets']['downloadUrl'],
    assets: CommandRegistry['downloadAssets']['assets'],
): DispatchHandlerParameter<'downloadAssets', CommandRegistry> => ({
    name: 'downloadAssets',
    payload: { downloadUrl, assets },
});
